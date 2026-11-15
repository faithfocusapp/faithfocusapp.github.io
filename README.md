# FaithFocus website (GitHub Pages)

A small static site with two jobs:

- `index.html`: the landing page. `?ref=invite` (from `ShareLinks.invite()`) adds "A friend invited you to FaithFocus".
- `v/index.html`: the shared verse page, `v/?r=JHN.3.16&t=web|lsg&s=<scene>` (from `ShareLinks.verse(_:french:scene:)`).
  It shows the verse over the chosen nature scene, with "Get FaithFocus free" (App Store), "Open in FaithFocus"
  (`faithfocus://bible/JHN/3/16`, on iPhone and iPad only), Copy, Share and "Read the whole chapter".
  A range such as `r=PSA.23.1-6` also works (up to 30 verses). A bad or missing reference shows a friendly message
  and the App Store button.

No frameworks, no build step, no analytics, no cookies, no local storage, and no third-party requests
(system fonts only). English, plus French when the browser's first
language is French (`?lang=fr` or `?lang=en` forces one, for testing).

## Files

| Path | What | Made by |
| --- | --- | --- |
| `index.html`, `v/index.html`, `404.html` | pages | hand |
| `assets/site.css`, `site.js`, `home.js`, `verse.js` | style and scripts | hand |
| `assets/scenes.js` | the 20 scenes (id, title, isDark) and the day anchor that matches the app's Verse of the Day picture | script |
| `assets/books.js` | the 66 book names in English and French, from the app's `Resources/WEB` and `LSG` `books.json` | script |
| `scenes/<scene>.jpg`, `scenes/wide/<scene>.jpg` | 1080x1920 and 1920x1080 scenes drawn by `Shared/Scenery.swift` | script |
| `og/invite.jpg`, `og/verse.jpg` | 1200x630 link preview cards | script |
| `img/` | app icon at 256, 180 (Apple touch) and 64 (favicon) | script |
| `bible/web/*.json`, `bible/lsg/*.json` | the app's bundled World English Bible and Louis Segond 1910, copied as-is (both public domain) | script |
| `.nojekyll` | tells GitHub Pages to serve the files untouched | hand |

Regenerate everything the script makes (about 10 seconds on a Mac with Xcode; run it after changing
`Shared/Scenery.swift`, the app icon or the bundled Bible):

```bash
scripts/scenery_preview/render_web.sh        # optional argument: scene seed (default 1, same as the app)
```

The whole site is about 14 MB (Bible text 9 MB, pictures 5 MB). A verse page downloads one book of the Bible
(usually 10 to 280 KB) and one picture.

## Publish on GitHub Pages

The links in the app point at `https://faithfocusapp.github.io` (`ShareLinks.base`).

1. Create a GitHub account or organization named `faithfocusapp`, and in it a public repository named
   `faithfocusapp.github.io` (a "user site", served at the domain root).
2. Copy the contents of this `web/` folder (including the hidden `.nojekyll`) to the root of that repository:

   ```bash
   git clone https://github.com/faithfocusapp/faithfocusapp.github.io.git /tmp/ff-site
   rsync -a --delete --exclude .git web/ /tmp/ff-site/
   cd /tmp/ff-site && git add -A && git commit -m "Update website" && git push
   ```

3. In the repository: Settings, Pages, Source "Deploy from a branch", branch `main`, folder `/ (root)`. Tick
   "Enforce HTTPS". The site is live a minute or two later.
4. Check it: open `https://faithfocusapp.github.io/?ref=invite` and
   `https://faithfocusapp.github.io/v/?r=JHN.3.16&t=web&s=sunriseMountains`, then paste a verse link into
   Messages to see the preview card. (Messages, WhatsApp and Facebook cache previews; their debuggers can refresh them.)

To test on your Mac before publishing: `cd web && python3 -m http.server 8080`, then open
`http://localhost:8080/v/?r=PSA.23.1&t=web`. (Link previews and the 404 page use the published address, so their
pictures appear only once the site is live.)

## Changing the base URL

The base URL is written in two kinds of places:

1. The app: `ShareLinks.base` in `FaithFocus/Services/ShareLinks.swift` (a path such as
   `https://example.github.io/faithfocus` works; the app keeps it).
2. The site: absolute addresses that link-preview robots and the 404 page need, in `index.html`, `v/index.html`
   and `404.html` (each marked with a `SITE BASE URL` comment). Replace them all at once:

   ```bash
   cd web
   NEW="https://www.example.com"     # no trailing slash
   grep -rl "https://faithfocusapp.github.io" --include=*.html . | xargs sed -i '' "s#https://faithfocusapp.github.io#$NEW#g"
   ```

Everything else (pages, scripts, Bible files, pictures) uses relative addresses and works at a domain root or under
a project path such as `/faithfocus/`. With a custom domain, add a `CNAME` file containing the domain to this folder
and set it in Settings, Pages.

## Privacy

Shared links carry only the verse reference, the Bible edition and the picture name. The pages set no cookies, keep
nothing in the browser, send `no-referrer`, and load only their own files (system fonts, no third-party requests).
