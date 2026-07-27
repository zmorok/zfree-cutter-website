# ZFree Cutter website

Adaptive product website for [ZFree Cutter](https://github.com/zmorok/zfree-cutter), an open-source Android editor for video, photos, and GIFs.

## Local development

```bash
npm install
npm run dev
```

The main deployment build is:

```bash
npm run build
```

The static GitHub Pages build is:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/zfree-cutter-website npm run build:pages
```

## Deployment

Pushes to `main` are published by GitHub Actions to:

<https://zmorok.github.io/zfree-cutter-website/>

The source is also compatible with the Codex Sites deployment configured in `.openai/hosting.json`.
