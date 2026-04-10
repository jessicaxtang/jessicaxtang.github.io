const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'writing', 'posts');
const OUT_DIR  = path.join(__dirname, 'writing');

// ─── Helpers ────────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function displayDate(dateStr) {
  // "2024-12-01" → "Dec 2024"
  const [year, month] = dateStr.split('-');
  return `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
}

function longDate(dateStr) {
  // "2024-12-01" → "December 1, 2024"
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Shared HTML fragments ───────────────────────────────────────────────────

const GA = `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-1VYYLP2HSK"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-1VYYLP2HSK');
  </script>`;

const HEAD_COMMON = `  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/jt.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">
  <script src="../site.js" defer></script>`;

const NAV = `  <header class="site-header">
    <div class="site-shell site-header__inner">
      <a class="site-logo" href="/index.html">JT</a>
      <nav class="site-nav" aria-label="Primary">
        <ul class="site-nav__list">
          <li class="site-nav__item"><a href="/index.html" class="button nav-link" data-nav="about">about</a></li>
          <li class="site-nav__item"><a href="/index.html#research-list-title" class="button nav-link" data-nav="research">research</a></li>
          <li class="site-nav__item"><a href="/writing/" class="button nav-link" data-nav="writing" aria-current="page">writing</a></li>
          <li class="site-nav__item"><a href="/index.html#home-showcase" class="button nav-link" data-nav="showcase">showcase</a></li>
          <li class="site-nav__item"><a href="/index.html#home-music-showcase" class="button nav-link" data-nav="music">music</a></li>
          <li class="site-nav__item"><a href="/docs/JessicaTang_CV.pdf" class="button nav-link" data-nav="cv" target="_blank" rel="noopener">cv</a></li>
        </ul>
      </nav>
    </div>
  </header>`;

const FOOTER = `  <footer class="site-footer">
    <div class="site-shell site-footer__inner">
      <p class="site-footer__note">© jess 2026.</p>
      <div class="site-footer__links">
        <a href="mailto:jessicao.tang@mail.utoronto.ca" class="site-footer__link">email</a>
        <a href="https://www.linkedin.com/in/jessica-tang-532982194/" class="site-footer__link">linkedin</a>
        <a href="https://scholar.google.com/citations?user=IEvZRL8AAAAJ&hl=en&oi=sra" class="site-footer__link">google scholar</a>
      </div>
    </div>
  </footer>`;

// ─── Templates ───────────────────────────────────────────────────────────────

function renderPost(meta, htmlContent) {
  const subtitle = meta.subtitle ? ` &mdash; ${meta.subtitle}` : '';
  const pdfLink  = meta.pdf
    ? `<p><a href="${meta.pdf}" target="_blank" rel="noopener">${meta.title} &rarr;</a></p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
${GA}

${HEAD_COMMON}
  <title>${meta.title} — Jessica Tang</title>
  <meta name="description" content="${meta.description}">
  <meta property="og:title" content="${meta.title} — Jessica Tang">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:type" content="article">
</head>
<body class="site-page writing-page">
  <div class="cursor-dot-outline"></div>
  <div class="cursor-dot"></div>
${NAV}

  <main class="site-main">
    <article class="writing-post">
      <div class="site-shell">
        <a class="writing-post__back" href="/writing/">&larr; writing</a>

        <header class="writing-post__header">
          <p class="writing-post__tag">${meta.tag}</p>
          <h1 class="writing-post__title">${meta.title}</h1>
          <p class="writing-post__meta">${longDate(meta.date)}${subtitle}</p>
        </header>

        <hr class="writing-post__rule">

        <div class="writing-post__prose">
          ${htmlContent}
          ${pdfLink}
        </div>
      </div>
    </article>
  </main>

${FOOTER}
</body>
</html>`;
}

function renderEntry(meta) {
  return `
        <a class="writing-entry" href="/writing/${meta.slug}.html">
          <span class="writing-entry__date">${displayDate(meta.date)}</span>
          <span class="writing-entry__body">
            <span class="writing-entry__tag">${meta.tag}</span>
            <span class="writing-entry__title">${meta.title}</span>
            <span class="writing-entry__lede">${meta.description}</span>
          </span>
        </a>`;
}

function renderIndex(posts) {
  const entries = posts.map(renderEntry).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
${GA}

  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Writing — Jessica Tang</title>
  <meta name="description" content="Essays, notes, and miscellaneous writing by Jessica Tang.">
  <meta property="og:title" content="Writing — Jessica Tang">
  <meta property="og:description" content="Essays, notes, and miscellaneous writing by Jessica Tang.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://jessicaxtang.github.io/writing/">
  <link rel="icon" href="/jt.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">
  <script src="../site.js" defer></script>
</head>
<body class="site-page writing-page">
  <div class="cursor-dot-outline"></div>
  <div class="cursor-dot"></div>
  <header class="site-header">
    <div class="site-shell site-header__inner">
      <a class="site-logo" href="/index.html">JT</a>
      <nav class="site-nav" aria-label="Primary">
        <ul class="site-nav__list">
          <li class="site-nav__item"><a href="/index.html" class="button nav-link" data-nav="about">about</a></li>
          <li class="site-nav__item"><a href="/index.html#research-list-title" class="button nav-link" data-nav="research">research</a></li>
          <li class="site-nav__item"><a href="/writing/" class="button nav-link" data-nav="writing" aria-current="page">writing</a></li>
          <li class="site-nav__item"><a href="/index.html#home-showcase" class="button nav-link" data-nav="showcase">showcase</a></li>
          <li class="site-nav__item"><a href="/index.html#home-music-showcase" class="button nav-link" data-nav="music">music</a></li>
          <li class="site-nav__item"><a href="/docs/JessicaTang_CV.pdf" class="button nav-link" data-nav="cv" target="_blank" rel="noopener">cv</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="site-main">
    <section class="writing-index-hero" aria-labelledby="writing-hero-title">
      <div class="site-shell">
        <h1 class="writing-index-hero__title" id="writing-hero-title">Writing</h1>
        <p class="writing-index-hero__lede">Essays, notes, and miscellaneous pieces — things that don't fit neatly into a paper.</p>
      </div>
    </section>

    <section class="writing-list" aria-label="Posts">
      <div class="site-shell">
        ${entries}
      </div>
    </section>
  </main>

${FOOTER}
</body>
</html>`;
}

// ─── Build ───────────────────────────────────────────────────────────────────

function build() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Posts directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('No posts found in writing/posts/');
    return;
  }

  const posts = files.map(file => {
    const raw  = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data: meta, content } = matter(raw);
    meta.slug = meta.slug || path.basename(file, '.md');
    return { meta, content };
  });

  // Sort newest first
  posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));

  // Generate each post page
  for (const { meta, content } of posts) {
    const html = marked(content);
    const page = renderPost(meta, html);
    const outPath = path.join(OUT_DIR, `${meta.slug}.html`);
    fs.writeFileSync(outPath, page);
    console.log(`  ✓ ${meta.slug}.html`);
  }

  // Generate writing/index.html
  const indexPage = renderIndex(posts.map(p => p.meta));
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexPage);
  console.log(`  ✓ writing/index.html`);

  console.log(`\nBuilt ${posts.length} post${posts.length === 1 ? '' : 's'}.`);
}

build();
