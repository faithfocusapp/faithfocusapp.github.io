// Shared verse page: /v/?r=JHN.3.16&t=web|lsg&s=<scene>
// r: the app's book code, chapter and verse joined by dots (a range such as JHN.3.16-18 also works).
// t: "web" (World English Bible) or "lsg" (Louis Segond 1910). s: a SceneryKind raw value (site.js paints it).
// Loaded in <head>: the reference is read at once (title, Smart App Banner); the page fills in when the DOM is ready.
(function () {
  "use strict";
  var FF = window.FF;
  var BOOKS = window.FF_BOOKS || {};
  var MAX_VERSES = 30;

  var tParam = (FF.params.get("t") || "").toLowerCase();
  var edition = tParam === "lsg" || tParam === "web" ? tParam : FF.lang === "fr" ? "lsg" : "web";
  var ref = parseRef(FF.params.get("r"));

  function parseRef(s) {
    if (!s) return null;
    var m = /^([0-9A-Z]{3})[.:\s](\d{1,3})(?:[.:](\d{1,3})(?:-(\d{1,3}))?)?$/i.exec(String(s).trim());
    if (!m) return null;
    var book = m[1].toUpperCase();
    var info = BOOKS[book];
    var chapter = parseInt(m[2], 10);
    var verse = m[3] ? parseInt(m[3], 10) : 1;
    var end = m[4] ? parseInt(m[4], 10) : verse;
    if (!info || chapter < 1 || chapter > info[2] || verse < 1 || end < verse) return null;
    return { book: book, chapter: chapter, verse: verse, end: Math.min(end, verse + MAX_VERSES - 1) };
  }

  function bookName(id) {
    if (id === "PSA") return edition === "lsg" ? "Psaume" : "Psalm";
    var info = BOOKS[id];
    return info ? (edition === "lsg" ? info[1] : info[0]) : id;
  }

  function refLabel(r, end) {
    return bookName(r.book) + " " + r.chapter + ":" + r.verse + (end > r.verse ? "-" + end : "");
  }

  // The app's inline marks (words of Jesus, footnote and cross-reference anchors, poetry indents) are not shown.
  function plain(s) {
    return String(s)
      .replace(/[\uE000-\uE003\u2003]/g, "")
      .replace(/[\u2028\u2029]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  // Head-time work: the tab title and Safari's Smart App Banner ("Open" goes straight to the verse).
  if (ref) {
    document.title = refLabel(ref, ref.end) + " · FaithFocus";
    var banner = document.querySelector('meta[name="apple-itunes-app"]');
    if (banner) {
      banner.setAttribute("content", "app-id=" + FF.APP_ID + ", app-argument=faithfocus://bible/" + ref.book + "/" + ref.chapter + "/" + ref.verse);
    }
  }

  // Start the download while the page is still parsing.
  var chapterPromise = ref
    ? fetch(new URL("bible/" + edition + "/" + ref.book + ".json", FF.root).href, { credentials: "omit" })
        .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
        .then(function (book) {
          var ch = book[ref.chapter - 1];
          if (!ch || !Array.isArray(ch.v)) throw new Error("no chapter");
          return ch.v.map(plain);
        })
    : Promise.reject(new Error("bad reference"));
  chapterPromise.catch(function () {}); // handled below; avoids an unhandled-rejection warning before the DOM is ready

  function $(id) { return document.getElementById(id); }

  function announce(text) {
    var live = $("announce");
    live.textContent = "";
    window.setTimeout(function () { live.textContent = text; }, 50);
  }

  function showError() {
    $("loading").hidden = true;
    $("verse").hidden = true;
    $("tools").hidden = true;
    $("error").hidden = false;
    document.title = FF.t("verseFor") + " · FaithFocus";
  }

  function render(verses) {
    var last = Math.min(ref.end, verses.length);
    if (ref.verse > verses.length) return showError();
    var picked = verses.slice(ref.verse - 1, last);
    var quote = $("verse-text");
    quote.lang = edition === "lsg" ? "fr" : "en";
    quote.textContent = "";
    var total = 0;
    picked.forEach(function (text, i) {
      total += text.length;
      if (picked.length > 1) {
        var sup = document.createElement("sup");
        sup.textContent = String(ref.verse + i);
        quote.appendChild(sup);
      }
      quote.appendChild(document.createTextNode(text + (i < picked.length - 1 ? " " : "")));
    });
    if (total > 420) quote.classList.add("very-long");
    else if (total > 200) quote.classList.add("long");

    var label = refLabel(ref, last);
    $("verse-ref").textContent = label;
    $("verse-edition").textContent = FF.t("edition_" + edition);
    $("loading").hidden = true;
    $("verse").hidden = false;
    $("tools").hidden = false;
    document.title = label + " · FaithFocus";

    var shareText = picked.join(" ") + "\n— " + label + " (" + edition.toUpperCase() + ")";
    wireCopy(shareText);
    wireShare(label, shareText);
    wireChapter(verses);
  }

  function wireCopy(text) {
    var button = $("copy");
    button.addEventListener("click", function () {
      var full = text + "\n" + window.location.href;
      var done = function () {
        $("copy-label").textContent = FF.t("copied");
        announce(FF.t("copied"));
        window.setTimeout(function () { $("copy-label").textContent = FF.t("copy"); }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(full).then(done, function () { legacyCopy(full) && done(); });
      } else if (legacyCopy(full)) {
        done();
      }
    });
  }

  function legacyCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  function wireShare(title, text) {
    if (!navigator.share) return;
    var button = $("share");
    button.hidden = false;
    button.addEventListener("click", function () {
      navigator.share({ title: title, text: text, url: window.location.href }).catch(function () {});
    });
  }

  function wireChapter(verses) {
    var toggle = $("chapter-toggle");
    var section = $("chapter");
    var built = false;
    toggle.addEventListener("click", function () {
      var open = section.hidden;
      if (open && !built) {
        built = true;
        $("chapter-title").textContent = bookName(ref.book) + " " + ref.chapter;
        var list = $("chapter-verses");
        list.lang = edition === "lsg" ? "fr" : "en";
        verses.forEach(function (text, i) {
          var li = document.createElement("li");
          var n = i + 1;
          if (n >= ref.verse && n <= ref.end) li.className = "mark";
          var b = document.createElement("b");
          b.textContent = String(n);
          li.appendChild(b);
          li.appendChild(document.createTextNode(text));
          list.appendChild(li);
        });
      }
      section.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      $("chapter-label").textContent = FF.t(open ? "hideChapter" : "readChapter");
      if (open) {
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var target = section.querySelector("li.mark") || section;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    FF.applyI18n();
    FF.wireStoreLinks();
    $("brand").href = FF.root;
    $("stage").setAttribute("data-dark", FF.pageScene.isDark ? "true" : "false");

    if (ref && FF.isAppleMobile) {
      var open = $("open-app");
      open.href = "faithfocus://bible/" + ref.book + "/" + ref.chapter + "/" + ref.verse;
      open.hidden = false;
    }

    chapterPromise.then(render, showError);
  });
})();
