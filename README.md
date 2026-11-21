# jessicaxtang.github.io

Static site, no build step. Edit the HTML and push.

```
index.html        about (dark)
writing/          papers (warm brown)
talks/            interviews + talks (black)
music/            performances (cream)
styles.css        all styling; page colours come from the theme class on <body>
site.js           load fade + custom cursor
media/            images and gifs
docs/             CV and papers
```

Local preview:

```bash
python3 -m http.server 8000
```

then open http://localhost:8000.

The previous design (and the retired markdown blog with its `npm run build` step)
lives on the `editorial-archive` branch.
