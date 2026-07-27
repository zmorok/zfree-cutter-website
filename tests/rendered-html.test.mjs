import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the ZFree Cutter landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>ZFree Cutter — media editor for Android<\/title>/i);
  assert.match(html, /Обрежь лишнее/);
  assert.match(html, /Живой мини‑редактор/);
  assert.match(html, /Твои файлы остаются твоими/);
  assert.match(html, /github\.com\/zmorok\/zfree-cutter/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("removes the disposable starter and declares the Pages build", async () => {
  const [page, layout, packageJson, workflow] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
  ]);

  assert.match(page, /ZFree Cutter/);
  assert.match(page, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(layout, /openGraph/);
  assert.match(packageJson, /"build:pages": "next build"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(workflow, /actions\/deploy-pages@v4/);

  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", root)));
});
