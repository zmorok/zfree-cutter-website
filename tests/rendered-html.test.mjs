import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports the ZFree Cutter landing page", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>ZFree Cutter — media editor for Android<\/title>/i);
  assert.match(html, /<html lang="en"/i);
  assert.match(html, /Cut the noise/);
  assert.match(html, /One editor for video, photos, and GIFs/);
  assert.match(html, /This is ZFree Cutter/);
  assert.match(html, /Download v0\.5\.4/);
  assert.match(html, /Switch to light theme/);
  assert.match(html, /Online media/);
  assert.match(html, /Inspect the source/);
  assert.match(html, /Report an issue/);
  assert.match(html, /github\.com\/zmorok\/zfree-cutter/);
  assert.match(html, /releases\/tag\/v0\.5\.4/);
  assert.doesNotMatch(
    html,
    /Живой мини‑редактор|Сделано для реальной работы|Твои файлы остаются твоими/,
  );
});

test("keeps the repository focused on the static showcase", async () => {
  const [page, layout, packageJson, workflow] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
  ]);

  assert.match(page, /ZFree Cutter/);
  assert.match(page, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(page, /zfree-locale/);
  assert.match(page, /searchParams\.set\("lang", "ru"\)/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /canonical/);
  assert.match(layout, /x-default/);
  assert.match(packageJson, /"dev": "next dev"/);
  assert.match(packageJson, /"build": "next build"/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});
