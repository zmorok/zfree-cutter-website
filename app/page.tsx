"use client";

import { CSSProperties, PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type Locale = "ru" | "en";
type MediaKind = "video" | "photo" | "gif";
type DemoTool = "crop" | "glitch" | "tint";

const REPOSITORY_URL = "https://github.com/zmorok/zfree-cutter";
const RELEASE_URL = `${REPOSITORY_URL}/releases/latest`;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const copy = {
  ru: {
    nav: {
      features: "Возможности",
      demo: "Попробовать",
      gallery: "Интерфейс",
      download: "Скачать",
      github: "GitHub",
    },
    hero: {
      eyebrow: "Свободный редактор для Android 10+",
      titleA: "Обрежь лишнее.",
      titleB: "Оставь момент.",
      text: "Видео, фото и GIF — в одном спокойном редакторе. Кадрируй точно, добавляй эффекты и экспортируй прямо на устройстве.",
      download: "Скачать v0.3.0",
      source: "Открыть код",
      note: "Бесплатно · Open source · без подписки",
      local: "Обработка на устройстве",
      output: "MP4 · H.264 · AAC",
      ready: "готово к экспорту",
    },
    ticker: ["Точная обрезка", "Видео ↔ GIF", "RGB Glitch", "История действий", "Текст и слои", "Сжатие медиа"],
    intro: {
      kicker: "Один рабочий процесс",
      title: "Не набор фильтров. Нормальный мобильный редактор.",
      text: "ZFree Cutter держит главное перед глазами: медиа, таймлайн и выбранный инструмент. Проекты сохраняются, исходники остаются нетронутыми.",
    },
    media: {
      video: {
        label: "Видео",
        title: "Монтаж без тяжёлого интерфейса",
        text: "Обрезка, скорость, эффекты, текст, изображения и несколько аудиодорожек — с общим таймлайном и историей действий.",
        points: ["MP4 / H.264 / AAC", "Точный trim и crop", "Undo / redo"],
      },
      photo: {
        label: "Фото",
        title: "Точная геометрия и цвет",
        text: "Кадрируй жестами или вводи координаты в пикселях. Поворачивай, отражай и совмещай несколько цветовых эффектов.",
        points: ["JPEG / PNG / WebP", "Свободные пропорции", "Неразрушающий проект"],
      },
      gif: {
        label: "GIF",
        title: "Анимация остаётся живой",
        text: "Предпросмотр с управлением циклом, кадрирование и эффекты для всей анимации, а ещё конвертация видео в GIF и обратно.",
        points: ["GIF ↔ MP4", "Покадровый прогресс", "Контроль размера"],
      },
    },
    demo: {
      kicker: "Живой мини‑редактор",
      title: "Потрогай идею до установки",
      text: "Переключай инструменты и интенсивность. Это не копия Android‑экрана, а интерактивная зарисовка логики ZFree Cutter.",
      crop: "Кадр",
      glitch: "Glitch",
      tint: "Тон",
      intensity: "Интенсивность",
      hintCrop: "Потяни рамку внутри превью",
      hintEffect: "Двигай ползунок, чтобы изменить эффект",
      preview: "Интерактивный предпросмотр",
    },
    features: {
      kicker: "Сделано для реальной работы",
      title: "Мелочи, из которых складывается хороший инструмент.",
      cards: [
        {
          number: "01",
          title: "Точность до пикселя",
          text: "Свободный crop, готовые и пользовательские пропорции, точные X, Y, ширина и высота.",
        },
        {
          number: "02",
          title: "Эффекты можно сочетать",
          text: "RGB split, Cyberpunk, направленный glitch, оттенки, поворот, свет, контраст и насыщенность.",
        },
        {
          number: "03",
          title: "Проект помнит всё",
          text: "Недавние проекты, реальные обложки результата, undo, redo и история текущей сессии.",
        },
        {
          number: "04",
          title: "Экспорт без сюрпризов",
          text: "Профиль качества, оценка результата, промежуточный кадр, прогресс и безопасная отмена.",
        },
      ],
    },
    gallery: {
      kicker: "Настоящее приложение",
      title: "Шесть экранов. Один визуальный ритм.",
      text: "Сайт использует реальные скриншоты версии 0.3.0 — без концептов функций, которых ещё нет.",
      names: ["Главная", "Медиатека", "Редактор", "Эффекты", "Экспорт", "Настройки"],
    },
    trust: {
      title: "Твои файлы остаются твоими.",
      text: "ZFree Cutter обрабатывает медиа локально, не меняет исходный файл и сохраняет результат в стандартные папки Android.",
      source: "Проверить исходный код",
      issues: "Сообщить о проблеме",
      stats: [
        ["3", "типа медиа"],
        ["2", "языка интерфейса"],
        ["0", "обязательных аккаунтов"],
      ],
    },
    final: {
      eyebrow: "Версия 0.3.0 · Android 10+",
      title: "Медиа уже на телефоне. Редактор тоже может быть там.",
      download: "Скачать APK",
      changelog: "Что нового",
      note: "Выбери APK под архитектуру устройства или универсальную сборку.",
    },
    footer: {
      line: "Свободный мобильный медиаредактор.",
      made: "Сделано открыто, собрано на Kotlin и Jetpack Compose.",
    },
  },
  en: {
    nav: {
      features: "Features",
      demo: "Try it",
      gallery: "Interface",
      download: "Download",
      github: "GitHub",
    },
    hero: {
      eyebrow: "Open-source editor for Android 10+",
      titleA: "Cut the noise.",
      titleB: "Keep the moment.",
      text: "Video, photo, and GIF in one focused editor. Crop precisely, layer effects, and export right on your device.",
      download: "Download v0.3.0",
      source: "View source",
      note: "Free · Open source · no subscription",
      local: "On-device processing",
      output: "MP4 · H.264 · AAC",
      ready: "ready to export",
    },
    ticker: ["Pixel-perfect crop", "Video ↔ GIF", "RGB Glitch", "Action history", "Text & layers", "Media compression"],
    intro: {
      kicker: "One clear workflow",
      title: "Not a bag of filters. A proper mobile editor.",
      text: "ZFree Cutter keeps the media, timeline, and active tool in view. Projects persist, while source files stay untouched.",
    },
    media: {
      video: {
        label: "Video",
        title: "Editing without the heavy chrome",
        text: "Trim, speed, effects, text, image overlays, and multiple audio tracks — with a shared timeline and action history.",
        points: ["MP4 / H.264 / AAC", "Precise trim and crop", "Undo / redo"],
      },
      photo: {
        label: "Photo",
        title: "Precise geometry and color",
        text: "Crop by gesture or enter exact pixel coordinates. Rotate, mirror, and combine multiple color effects.",
        points: ["JPEG / PNG / WebP", "Custom aspect ratios", "Non-destructive project"],
      },
      gif: {
        label: "GIF",
        title: "Animation stays alive",
        text: "Loop-aware preview, crop and effects for every frame, plus video-to-GIF and GIF-to-video conversion.",
        points: ["GIF ↔ MP4", "Frame-level progress", "Size control"],
      },
    },
    demo: {
      kicker: "Live mini editor",
      title: "Feel the idea before installing",
      text: "Switch tools and intensity. This is an interactive sketch of ZFree Cutter’s logic, not a replica of the Android screen.",
      crop: "Crop",
      glitch: "Glitch",
      tint: "Tint",
      intensity: "Intensity",
      hintCrop: "Drag the frame inside the preview",
      hintEffect: "Move the slider to shape the effect",
      preview: "Interactive preview",
    },
    features: {
      kicker: "Built for real work",
      title: "Small details that make a good tool.",
      cards: [
        {
          number: "01",
          title: "Pixel-level precision",
          text: "Free crop, presets, custom aspect ratios, and exact X, Y, width, and height values.",
        },
        {
          number: "02",
          title: "Effects can be combined",
          text: "RGB split, Cyberpunk, directional glitch, tints, rotation, brightness, contrast, and saturation.",
        },
        {
          number: "03",
          title: "Projects remember",
          text: "Recent projects, true result covers, undo, redo, and a clear history for the current session.",
        },
        {
          number: "04",
          title: "Export without surprises",
          text: "Quality profiles, result estimates, processed-frame previews, progress, and safe cancellation.",
        },
      ],
    },
    gallery: {
      kicker: "The actual app",
      title: "Six screens. One visual rhythm.",
      text: "The site uses real screenshots from version 0.3.0 — no concept features and no vaporware.",
      names: ["Home", "Library", "Editor", "Effects", "Export", "Settings"],
    },
    trust: {
      title: "Your files stay yours.",
      text: "ZFree Cutter processes media locally, never modifies the source file, and saves results into standard Android media folders.",
      source: "Inspect the source",
      issues: "Report an issue",
      stats: [
        ["3", "media types"],
        ["2", "interface languages"],
        ["0", "required accounts"],
      ],
    },
    final: {
      eyebrow: "Version 0.3.0 · Android 10+",
      title: "Your media lives on your phone. Your editor can too.",
      download: "Download APK",
      changelog: "What’s new",
      note: "Choose an APK for your device architecture or use the universal build.",
    },
    footer: {
      line: "An open mobile media editor.",
      made: "Built in the open with Kotlin and Jetpack Compose.",
    },
  },
} as const;

const screenshotFiles = ["home", "library", "editor", "effects", "export", "settings"] as const;

function asset(path: string) {
  return `${BASE_PATH}${path}`;
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [media, setMedia] = useState<MediaKind>("video");
  const [tool, setTool] = useState<DemoTool>("crop");
  const [intensity, setIntensity] = useState(58);
  const [shot, setShot] = useState(2);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const heroVisual = useRef<HTMLDivElement>(null);
  const dragging = useRef({ active: false, originX: 0, originY: 0, startX: 0, startY: 0 });
  const t = copy[locale];

  const selectedMedia = t.media[media];
  const selectedShot = useMemo(
    () => asset(`/screenshots/${locale}/${screenshotFiles[shot]}.png`),
    [locale, shot],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [locale]);

  function handleHeroPointer(event: PointerEvent<HTMLDivElement>) {
    if (!heroVisual.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const rect = heroVisual.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroVisual.current.style.setProperty("--tilt-x", `${y * -5}deg`);
    heroVisual.current.style.setProperty("--tilt-y", `${x * 7}deg`);
  }

  function resetHeroTilt() {
    heroVisual.current?.style.setProperty("--tilt-x", "0deg");
    heroVisual.current?.style.setProperty("--tilt-y", "0deg");
  }

  function startCropDrag(event: PointerEvent<HTMLDivElement>) {
    if (tool !== "crop") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = {
      active: true,
      originX: event.clientX,
      originY: event.clientY,
      startX: cropOffset.x,
      startY: cropOffset.y,
    };
  }

  function moveCrop(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current.active || tool !== "crop") return;
    const nextX = Math.max(-28, Math.min(28, dragging.current.startX + event.clientX - dragging.current.originX));
    const nextY = Math.max(-20, Math.min(20, dragging.current.startY + event.clientY - dragging.current.originY));
    setCropOffset({ x: nextX, y: nextY });
  }

  function stopCropDrag(event: PointerEvent<HTMLDivElement>) {
    dragging.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const demoStyle = {
    "--effect-strength": intensity / 100,
    "--crop-x": `${cropOffset.x}px`,
    "--crop-y": `${cropOffset.y}px`,
  } as CSSProperties;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ZFree Cutter">
          <img src={asset("/app-icon.svg")} width="38" height="38" alt="" />
          <span>ZFree Cutter</span>
        </a>
        <nav className="desktop-nav" aria-label={locale === "ru" ? "Основная навигация" : "Main navigation"}>
          <a href="#features">{t.nav.features}</a>
          <a href="#demo">{t.nav.demo}</a>
          <a href="#gallery">{t.nav.gallery}</a>
        </nav>
        <div className="header-actions">
          <button
            className="language-toggle"
            type="button"
            onClick={() => setLocale(locale === "ru" ? "en" : "ru")}
            aria-label={locale === "ru" ? "Switch to English" : "Переключить на русский"}
          >
            <span className={locale === "ru" ? "active" : ""}>RU</span>
            <span className={locale === "en" ? "active" : ""}>EN</span>
          </button>
          <a className="header-github" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
            {t.nav.github} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow"><span />{t.hero.eyebrow}</p>
          <h1>
            {t.hero.titleA}
            <span>{t.hero.titleB}</span>
          </h1>
          <p className="hero-description">{t.hero.text}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={RELEASE_URL} target="_blank" rel="noreferrer">
              {t.hero.download} <span aria-hidden="true">↓</span>
            </a>
            <a className="button button-ghost" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
              {t.hero.source} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="hero-note"><span aria-hidden="true">✦</span>{t.hero.note}</p>
        </div>

        <div
          className="hero-visual"
          ref={heroVisual}
          onPointerMove={handleHeroPointer}
          onPointerLeave={resetHeroTilt}
          data-reveal
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="phone-shadow" />
          <div className="phone-frame">
            <div className="phone-speaker" />
            <img src={asset(`/screenshots/${locale}/editor.png`)} alt={locale === "ru" ? "Редактор ZFree Cutter" : "ZFree Cutter editor"} />
            <div className="hero-scanline" />
          </div>
          <div className="floating-card floating-local">
            <span className="status-dot" />
            <div><strong>{t.hero.local}</strong><small>100% local</small></div>
          </div>
          <div className="floating-card floating-output">
            <span className="mini-wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            <div><strong>{t.hero.output}</strong><small>{t.hero.ready}</small></div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...t.ticker, ...t.ticker].map((item, index) => (
            <span key={`${item}-${index}`}>{item}<i>✦</i></span>
          ))}
        </div>
      </div>

      <section className="intro section-shell" id="features">
        <div className="section-heading" data-reveal>
          <p className="kicker">{t.intro.kicker}</p>
          <h2>{t.intro.title}</h2>
          <p>{t.intro.text}</p>
        </div>

        <div className="media-showcase" data-reveal>
          <div className="media-tabs" role="tablist" aria-label={locale === "ru" ? "Тип медиа" : "Media type"}>
            {(["video", "photo", "gif"] as MediaKind[]).map((kind) => (
              <button
                key={kind}
                type="button"
                role="tab"
                aria-selected={media === kind}
                onClick={() => setMedia(kind)}
                className={media === kind ? "active" : ""}
              >
                <span className={`media-glyph media-glyph-${kind}`} aria-hidden="true" />
                {t.media[kind].label}
              </button>
            ))}
          </div>
          <div className="media-panel">
            <div className="media-copy" key={`${locale}-${media}`}>
              <span className="panel-index">0{(["video", "photo", "gif"] as MediaKind[]).indexOf(media) + 1}</span>
              <h3>{selectedMedia.title}</h3>
              <p>{selectedMedia.text}</p>
              <ul>
                {selectedMedia.points.map((point) => <li key={point}><span>✓</span>{point}</li>)}
              </ul>
            </div>
            <div className={`media-art media-art-${media}`} aria-hidden="true">
              <div className="media-art-grid" />
              <div className="media-art-window">
                <span className="art-corner corner-a" />
                <span className="art-corner corner-b" />
                <span className="art-corner corner-c" />
                <span className="art-corner corner-d" />
                <div className="art-subject" />
                <div className="art-glow" />
              </div>
              <div className="art-timeline"><span /><i /><i /><i /><i /><i /><i /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-wrap" id="demo">
        <div className="section-shell demo-section">
          <div className="demo-heading" data-reveal>
            <p className="kicker">{t.demo.kicker}</p>
            <h2>{t.demo.title}</h2>
            <p>{t.demo.text}</p>
          </div>

          <div className="demo-app" data-reveal style={demoStyle}>
            <div className="demo-topbar">
              <div className="demo-dots" aria-hidden="true"><i /><i /><i /></div>
              <span>aurora_demo.mp4</span>
              <span className="demo-resolution">1920 × 1080</span>
            </div>
            <div className="demo-workspace">
              <div className={`demo-preview tool-${tool}`} aria-label={t.demo.preview}>
                <div className="demo-art">
                  <span className="demo-sun" />
                  <span className="demo-mountain mountain-one" />
                  <span className="demo-mountain mountain-two" />
                  <span className="demo-reflection" />
                  {tool === "glitch" && <><span className="glitch-slice slice-one" /><span className="glitch-slice slice-two" /></>}
                </div>
                <div
                  className="crop-frame"
                  onPointerDown={startCropDrag}
                  onPointerMove={moveCrop}
                  onPointerUp={stopCropDrag}
                  onPointerCancel={stopCropDrag}
                  role="img"
                  aria-label={t.demo.hintCrop}
                >
                  <i className="handle handle-a" /><i className="handle handle-b" />
                  <i className="handle handle-c" /><i className="handle handle-d" />
                  <span className="crop-label">16:9 · 1536 × 864</span>
                </div>
                <div className="demo-playhead"><span /></div>
              </div>
              <aside className="demo-controls">
                <div className="tool-buttons" role="tablist" aria-label={locale === "ru" ? "Инструменты демо" : "Demo tools"}>
                  {([
                    ["crop", t.demo.crop, "⌗"],
                    ["glitch", t.demo.glitch, "≋"],
                    ["tint", t.demo.tint, "◐"],
                  ] as [DemoTool, string, string][]).map(([value, label, glyph]) => (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={tool === value}
                      key={value}
                      className={tool === value ? "active" : ""}
                      onClick={() => setTool(value)}
                    >
                      <span aria-hidden="true">{glyph}</span>{label}
                    </button>
                  ))}
                </div>
                <div className="intensity-control">
                  <label htmlFor="intensity">
                    <span>{t.demo.intensity}</span><output>{intensity}%</output>
                  </label>
                  <input
                    id="intensity"
                    type="range"
                    min="0"
                    max="100"
                    value={intensity}
                    onChange={(event) => setIntensity(Number(event.target.value))}
                    disabled={tool === "crop"}
                  />
                </div>
                <p className="demo-hint">{tool === "crop" ? t.demo.hintCrop : t.demo.hintEffect}</p>
                <div className="demo-export-row">
                  <span><i /> MP4</span>
                  <button type="button" onClick={() => setIntensity((value) => value > 75 ? 32 : value + 18)}>
                    {locale === "ru" ? "Предпросмотр" : "Preview"} <span>▶</span>
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-grid-section section-shell">
        <div className="feature-grid-heading" data-reveal>
          <p className="kicker">{t.features.kicker}</p>
          <h2>{t.features.title}</h2>
        </div>
        <div className="feature-grid">
          {t.features.cards.map((card, index) => (
            <article className={`feature-card feature-card-${index + 1}`} key={card.number} data-reveal>
              <span className="feature-number">{card.number}</span>
              <div className={`feature-visual visual-${index + 1}`} aria-hidden="true">
                {index === 0 && <><span className="measure-x">1536 px</span><span className="measure-y">864 px</span><div className="measure-frame" /></>}
                {index === 1 && <><i /><i /><i /><b>RGB</b></>}
                {index === 2 && <><span>Crop adjusted</span><span>Glitch · 58%</span><span>Text layer added</span></>}
                {index === 3 && <><div className="progress-ring">84<small>%</small></div><span>≈ 18.4 MB</span></>}
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="section-shell">
          <div className="gallery-heading" data-reveal>
            <div>
              <p className="kicker">{t.gallery.kicker}</p>
              <h2>{t.gallery.title}</h2>
            </div>
            <p>{t.gallery.text}</p>
          </div>
          <div className="gallery-layout" data-reveal>
            <div className="gallery-phone">
              <div className="gallery-glow" />
              <div className="phone-frame gallery-device">
                <div className="phone-speaker" />
                <img src={selectedShot} alt={t.gallery.names[shot]} key={selectedShot} />
              </div>
            </div>
            <div className="gallery-nav" role="tablist" aria-label={locale === "ru" ? "Скриншоты приложения" : "App screenshots"}>
              {screenshotFiles.map((file, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={shot === index}
                  className={shot === index ? "active" : ""}
                  onClick={() => setShot(index)}
                  key={file}
                >
                  <span>0{index + 1}</span>
                  <strong>{t.gallery.names[index]}</strong>
                  <i aria-hidden="true">→</i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section section-shell" data-reveal>
        <div className="trust-copy">
          <span className="trust-lock" aria-hidden="true">⌂</span>
          <h2>{t.trust.title}</h2>
          <p>{t.trust.text}</p>
          <div className="trust-actions">
            <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">{t.trust.source} ↗</a>
            <a href={`${REPOSITORY_URL}/issues`} target="_blank" rel="noreferrer">{t.trust.issues} ↗</a>
          </div>
        </div>
        <div className="trust-stats">
          {t.trust.stats.map(([value, label]) => (
            <div key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      </section>

      <section className="final-section section-shell" data-reveal>
        <div className="final-card">
          <div className="final-copy">
            <p className="eyebrow"><span />{t.final.eyebrow}</p>
            <h2>{t.final.title}</h2>
            <div className="hero-actions">
              <a className="button button-light" href={RELEASE_URL} target="_blank" rel="noreferrer">
                {t.final.download} <span>↓</span>
              </a>
              <a className="button button-dark-ghost" href={`${REPOSITORY_URL}/releases/tag/v0.3.0`} target="_blank" rel="noreferrer">
                {t.final.changelog} <span>↗</span>
              </a>
            </div>
            <p className="final-note">{t.final.note}</p>
          </div>
          <div className="final-mark" aria-hidden="true">
            <img src={asset("/app-icon.svg")} alt="" />
            <span>Z</span>
          </div>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <div className="footer-brand">
          <img src={asset("/app-icon.svg")} width="42" height="42" alt="" />
          <div><strong>ZFree Cutter</strong><span>{t.footer.line}</span></div>
        </div>
        <p>{t.footer.made}</p>
        <div className="footer-links">
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`${REPOSITORY_URL}/releases`} target="_blank" rel="noreferrer">Releases</a>
          <a href="https://t.me/zmorok" target="_blank" rel="noreferrer">Telegram</a>
        </div>
      </footer>
    </main>
  );
}
