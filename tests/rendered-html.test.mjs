import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports the ZFree Cutter landing page", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>ZFree Cutter — media editor for Android<\/title>/i);
  assert.match(html, /Обрежь лишнее/);
  assert.match(html, /Один редактор для видео, фото и GIF/);
  assert.match(html, /Так выглядит ZFree Cutter/);
  assert.match(html, /Скачать v0\.5\.1/);
  assert.match(html, /Включить светлую тему/);
  assert.match(html, /Онлайн-медиа/);
  assert.match(html, /Проверить исходный код/);
  assert.match(html, /Сообщить о проблеме/);
  assert.match(html, /github\.com\/zmorok\/zfree-cutter/);
  assert.match(html, /releases\/tag\/v0\.5\.1/);
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
  assert.match(layout, /openGraph/);
  assert.match(packageJson, /"dev": "next dev"/);
  assert.match(packageJson, /"build": "next build"/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});
