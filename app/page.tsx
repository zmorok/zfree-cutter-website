"use client";

import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type Locale = "ru" | "en";
type MediaKind = "video" | "photo" | "gif";
type Theme = "dark" | "light";

const REPOSITORY_URL = "https://github.com/zmorok/zfree-cutter";
const RELEASE_URL = `${REPOSITORY_URL}/releases/latest`;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const copy = {
  ru: {
    nav: {
      features: "Возможности",
      gallery: "Интерфейс",
      download: "Скачать",
      github: "GitHub",
      lightTheme: "Включить светлую тему",
      darkTheme: "Включить тёмную тему",
    },
    hero: {
      eyebrow: "Свободный редактор для Android 10+",
      titleA: "Обрежь лишнее.",
      titleB: "Оставь момент.",
      text: "Открой видео, фото или GIF, внеси нужные правки и сохрани результат. Всё происходит прямо на телефоне — понятно и без лишних шагов.",
      download: "Скачать v0.5.4",
      source: "Открыть код",
      note: "Бесплатно · Open source · без подписки",
      local: "Обработка на устройстве",
      output: "MP4 · H.264 · AAC",
      ready: "готово к экспорту",
    },
    intro: {
      kicker: "Всё в одном месте",
      title: "Один редактор для видео, фото и GIF.",
      text: "Выбери файл на устройстве или найди медиа с открытой лицензией в онлайн-каталоге. Избранное доступно в отдельной онлайн-медиатеке, а сохранённый проект можно открыть снова в любой момент.",
    },
    media: {
      video: {
        label: "Видео",
        title: "Всё нужное для короткого монтажа",
        text: "Обрежь фрагмент, измени скорость, добавь эффект, текст, изображение или звук. Все изменения собраны на одном таймлайне.",
        points: ["MP4 / H.264 / AAC", "Cyberpunk и Mixed glitch", "Фокус звука и фоновые уведомления"],
      },
      photo: {
        label: "Фото",
        title: "Быстрая правка фотографий",
        text: "Кадрируй жестами или укажи точные размеры. Поворачивай, отражай и настраивай цвет без изменения исходного файла.",
        points: ["JPEG / PNG / WebP", "Видимая прозрачность", "Исходник не изменяется"],
      },
      gif: {
        label: "GIF",
        title: "Работа с анимацией без обходных путей",
        text: "Просматривай GIF прямо в редакторе, применяй кадрирование и эффекты ко всей анимации или конвертируй её в видео.",
        points: ["Быстрый покадровый preview", "GIF ↔ MP4", "Alpha-канал без потерь"],
      },
    },
    gallery: {
      kicker: "Интерфейс",
      title: "Так выглядит ZFree Cutter.",
      text: "Это реальные экраны ZFree Cutter с Pixel 8. Выбери раздел, чтобы рассмотреть приложение до установки.",
      names: ["Главная", "Медиатека", "Онлайн-медиа", "Редактор", "Эффекты", "Экспорт", "Настройки"],
    },
    final: {
      eyebrow: "Версия 0.5.4 · Android 10+",
      title: "Медиа уже на телефоне. Редактор тоже может быть там.",
      download: "Скачать APK",
      changelog: "Что нового",
      source: "Проверить исходный код",
      issues: "Сообщить о проблеме",
      note: "Скачай подходящую сборку APK или универсальную версию. Если что-то работает не так, напиши об этом в GitHub.",
    },
    footer: {
      line: "Свободный мобильный медиаредактор.",
      made: "Сделано открыто, собрано на Kotlin и Jetpack Compose.",
    },
  },
  en: {
    nav: {
      features: "Features",
      gallery: "Interface",
      download: "Download",
      github: "GitHub",
      lightTheme: "Switch to light theme",
      darkTheme: "Switch to dark theme",
    },
    hero: {
      eyebrow: "Open-source editor for Android 10+",
      titleA: "Cut the noise.",
      titleB: "Keep the moment.",
      text: "Open a video, photo, or GIF, make the changes you need, and save the result. Everything happens right on your phone, without unnecessary steps.",
      download: "Download v0.5.4",
      source: "View source",
      note: "Free · Open source · no subscription",
      local: "On-device processing",
      output: "MP4 · H.264 · AAC",
      ready: "ready to export",
    },
    intro: {
      kicker: "Everything in one place",
      title: "One editor for video, photos, and GIFs.",
      text: "Choose a file on your device or find openly licensed media in the online catalog. Favorites stay in a dedicated online library, and saved projects can be reopened whenever you need them.",
    },
    media: {
      video: {
        label: "Video",
        title: "Everything you need for a quick edit",
        text: "Trim a clip, change its speed, and add effects, text, images, or audio. Every change lives on one timeline.",
        points: ["MP4 / H.264 / AAC", "Cyberpunk and Mixed glitch", "Audio focus and export notifications"],
      },
      photo: {
        label: "Photo",
        title: "Fast photo adjustments",
        text: "Crop by gesture or enter exact dimensions. Rotate, mirror, and adjust color without changing the source file.",
        points: ["JPEG / PNG / WebP", "Visible transparency", "Source stays untouched"],
      },
      gif: {
        label: "GIF",
        title: "Edit animation without workarounds",
        text: "Preview GIFs in the editor, apply crop and effects to the whole animation, or convert it into a video.",
        points: ["Responsive frame preview", "GIF ↔ MP4", "Lossless alpha preservation"],
      },
    },
    gallery: {
      kicker: "Interface",
      title: "This is ZFree Cutter.",
      text: "These are real ZFree Cutter screens captured on a Pixel 8. Choose a section to explore the app before installing it.",
      names: ["Home", "Library", "Online media", "Editor", "Effects", "Export", "Settings"],
    },
    final: {
      eyebrow: "Version 0.5.4 · Android 10+",
      title: "Your media lives on your phone. Your editor can too.",
      download: "Download APK",
      changelog: "What’s new",
      source: "Inspect the source",
      issues: "Report an issue",
      note: "Download the APK for your device or use the universal build. If something does not work as expected, tell us on GitHub.",
    },
    footer: {
      line: "An open mobile media editor.",
      made: "Built in the open with Kotlin and Jetpack Compose.",
    },
  },
} as const;

const screenshotFiles = ["home", "library", "catalog", "editor", "effects", "export", "settings"] as const;

function asset(path: string) {
  return `${BASE_PATH}${path}`;
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [media, setMedia] = useState<MediaKind>("video");
  const [shot, setShot] = useState(2);
  const heroVisual = useRef<HTMLDivElement>(null);
  const t = copy[locale];

  const selectedMedia = t.media[media];
  const selectedShot = useMemo(
    () => asset(`/screenshots/${locale}/${screenshotFiles[shot]}.png`),
    [locale, shot],
  );

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("zfree-theme");
    const requestedLocale = new URLSearchParams(window.location.search).get("lang");
    const storedLocale = window.localStorage.getItem("zfree-locale");
    const initialLocale: Locale =
      requestedLocale === "ru" || requestedLocale === "en"
        ? requestedLocale
        : storedLocale === "ru" || storedLocale === "en"
          ? storedLocale
          : "en";
    const initialTheme: Theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    const frame = window.requestAnimationFrame(() => {
      setTheme(initialTheme);
      setLocale(initialLocale);
      document.documentElement.dataset.theme = initialTheme;
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("zfree-locale", locale);
    const metadataFrame = window.requestAnimationFrame(() => {
      document.title =
        locale === "ru"
          ? "ZFree Cutter — медиаредактор для Android"
          : "ZFree Cutter — media editor for Android";
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (description) {
        description.content =
          locale === "ru"
            ? "ZFree Cutter 0.5.4 — открытый Android-редактор видео, фото и GIF с обрезкой таймлайна, быстрой конвертацией и онлайн-медиа."
            : "ZFree Cutter 0.5.4 is an open-source Android editor for video, photos, and GIFs with timeline trimming, faster conversion, and online media.";
      }
    });
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
    return () => {
      window.cancelAnimationFrame(metadataFrame);
      observer.disconnect();
    };
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

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("zfree-theme", nextTheme);
  }

  function toggleLocale() {
    const nextLocale: Locale = locale === "ru" ? "en" : "ru";
    setLocale(nextLocale);
    const url = new URL(window.location.href);
    if (nextLocale === "ru") {
      url.searchParams.set("lang", "ru");
    } else {
      url.searchParams.delete("lang");
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ZFree Cutter">
          <img src={asset("/app-icon.svg")} width="38" height="38" alt="" />
          <span>ZFree Cutter</span>
        </a>
        <nav className="desktop-nav" aria-label={locale === "ru" ? "Основная навигация" : "Main navigation"}>
          <a href="#features">{t.nav.features}</a>
          <a href="#gallery">{t.nav.gallery}</a>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t.nav.lightTheme : t.nav.darkTheme}
            title={theme === "dark" ? t.nav.lightTheme : t.nav.darkTheme}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
          <button
            className="language-toggle"
            type="button"
            onClick={toggleLocale}
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
                </button>
              ))}
            </div>
          </div>
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
              <a className="button button-dark-ghost" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
                {t.final.source} <span>↗</span>
              </a>
            </div>
            <p className="final-note">{t.final.note}</p>
            <div className="final-links">
              <a href={`${REPOSITORY_URL}/issues`} target="_blank" rel="noreferrer">{t.final.issues}</a>
              <a href={`${REPOSITORY_URL}/releases/tag/v0.5.4`} target="_blank" rel="noreferrer">{t.final.changelog}</a>
            </div>
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
