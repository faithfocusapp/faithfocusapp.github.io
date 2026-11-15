// FaithFocus website: shared helpers (language, scenes, App Store link). No tracking, no cookies, no storage.
(function () {
  "use strict";

  var FF = (window.FF = {});

  // The site root, worked out from this script's own address (assets/site.js), so the pages work at a
  // domain root or under a project path such as /faithfocus/.
  var me = document.currentScript && document.currentScript.src;
  FF.root = me ? new URL("../", me).href : new URL("./", document.baseURI).href;

  FF.APP_STORE = "https://apps.apple.com/app/id6830991960";
  FF.APP_ID = "6830991960";

  // ?lang=fr or ?lang=en forces a language (handy for testing); otherwise the browser's first language.
  var params = new URLSearchParams(window.location.search);
  FF.params = params;
  var forced = (params.get("lang") || "").toLowerCase();
  var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  FF.lang = forced === "fr" || forced === "en" ? forced : /^fr\b/i.test(nav) ? "fr" : "en";
  document.documentElement.lang = FF.lang;

  // iPhone, iPod, iPad (iPadOS reports itself as a Mac with touch).
  var ua = navigator.userAgent || "";
  FF.isAppleMobile = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  var STRINGS = {
    en: {
      invited: "A friend invited you to FaithFocus",
      tagline: "The free Bible app that helps you put your phone down and spend time with God",
      storeTop: "Download on the",
      storeMain: "App Store",
      storeLabel: "Download FaithFocus on the App Store",
      freeNote: "Free · No ads · No tracking",
      devices: "For iPhone, iPad and Apple Watch",
      todayPicture: "Today’s picture: ",
      featuresEyebrow: "Inside the app",
      featuresTitle: "Everything you need to spend time with God",
      f1t: "Read and listen to the Bible",
      f1d: "The whole Bible in English and French, with a calm voice that reads it to you.",
      f2t: "Prayer timer",
      f2d: "Set aside a few quiet minutes and pray without interruptions.",
      f3t: "Block distracting apps",
      f3d: "Focus sessions pause the apps that pull you away, so you can be present with God.",
      f4t: "Heart check-in",
      f4d: "Say how you feel and receive a verse and a prayer for that moment.",
      f5t: "Play & Listen",
      f5d: "Bible games, stories and Christian podcasts for the whole family.",
      f6t: "Free, with no ads",
      f6d: "No ads and no tracking. Your time with God stays yours.",
      ctaTitle: "Ready to spend time with God?",
      ctaBody: "Download FaithFocus for free and start with today’s verse.",
      footerPromise: "No ads. No tracking. No cookies.",
      privacy: "Privacy",
      support: "Support",
      home: "FaithFocus home",
      credit: "Scripture: World English Bible and Louis Segond 1910, both in the public domain.",
      // Verse page
      verseFor: "A verse for you",
      loading: "Loading the verse…",
      getFree: "Get FaithFocus free",
      openApp: "Already have FaithFocus? Open it",
      storeCta: "Get FaithFocus on the App Store",
      copy: "Copy",
      copied: "Copied",
      share: "Share",
      readChapter: "Read the whole chapter",
      hideChapter: "Hide the chapter",
      errTitle: "This verse didn’t come through",
      errBody: "The link may be incomplete. You can read this verse, and the whole Bible, for free in FaithFocus.",
      edition_web: "World English Bible",
      edition_lsg: "Louis Segond 1910",
    },
    fr: {
      invited: "Un ami vous invite sur FaithFocus",
      tagline: "L’appli Bible gratuite qui vous aide à poser votre téléphone et à passer du temps avec Dieu",
      storeTop: "Télécharger dans l’",
      storeMain: "App Store",
      storeLabel: "Télécharger FaithFocus dans l’App Store",
      freeNote: "Gratuite · Sans pub · Sans pistage",
      devices: "Pour iPhone, iPad et Apple Watch",
      todayPicture: "L’image du jour : ",
      featuresEyebrow: "Dans l’appli",
      featuresTitle: "Tout ce qu’il faut pour passer du temps avec Dieu",
      f1t: "Lire et écouter la Bible",
      f1d: "Toute la Bible en français et en anglais, avec une voix paisible qui vous la lit.",
      f2t: "Minuteur de prière",
      f2d: "Réservez quelques minutes de calme et priez sans être interrompu.",
      f3t: "Bloquer les applis qui distraient",
      f3d: "Les sessions de concentration mettent en pause les applis qui vous accaparent, pour être pleinement avec Dieu.",
      f4t: "Ressenti du cœur",
      f4d: "Dites comment vous vous sentez et recevez un verset et une prière pour ce moment.",
      f5t: "Jouer et écouter",
      f5d: "Jeux bibliques, histoires et podcasts chrétiens pour toute la famille.",
      f6t: "Gratuite, sans publicité",
      f6d: "Ni publicité ni pistage. Votre temps avec Dieu reste à vous.",
      ctaTitle: "Prêt à passer du temps avec Dieu ?",
      ctaBody: "Téléchargez FaithFocus gratuitement et commencez par le verset du jour.",
      footerPromise: "Sans pub. Sans pistage. Sans cookies.",
      privacy: "Confidentialité",
      support: "Assistance",
      home: "Accueil FaithFocus",
      credit: "Écritures : World English Bible et Louis Segond 1910, toutes deux dans le domaine public.",
      verseFor: "Un verset pour vous",
      loading: "Chargement du verset…",
      getFree: "Obtenir FaithFocus gratuitement",
      openApp: "Vous avez déjà FaithFocus ? Ouvrir",
      storeCta: "Obtenir FaithFocus sur l’App Store",
      copy: "Copier",
      copied: "Copié",
      share: "Partager",
      readChapter: "Lire tout le chapitre",
      hideChapter: "Masquer le chapitre",
      errTitle: "Ce verset n’a pas pu s’afficher",
      errBody: "Le lien est peut-être incomplet. Vous pouvez lire ce verset, et toute la Bible, gratuitement dans FaithFocus.",
      edition_web: "World English Bible",
      edition_lsg: "Louis Segond 1910",
    }
  };

  // French names for the scenes (the English ones come from Shared/Scenery.swift via scenes.js).
  var SCENE_FR = {
    sunriseMountains: "Lever de soleil en montagne", mistyPines: "Pins dans la brume", sunsetLake: "Lac au coucher du soleil",
    springMeadow: "Prairie au printemps", desertStars: "Étoiles du désert", oceanSunset: "Coucher de soleil sur l’océan",
    snowyPeaks: "Sommets enneigés", autumnHills: "Collines d’automne", lavenderFields: "Champs de lavande",
    northernLights: "Aurore boréale", cherryBlossom: "Cerisiers en fleurs", goldenWheat: "Blé doré",
    tropicalBeach: "Plage tropicale", moonlitLake: "Lac au clair de lune", rainbowHills: "Collines arc-en-ciel",
    milkyWay: "Voie lactée", riverValley: "Vallée et rivière", foggyDawn: "Aube brumeuse",
    sunflowerField: "Champ de tournesols", canyonDusk: "Canyon au crépuscule"
  };

  FF.t = function (key) {
    var table = STRINGS[FF.lang] || STRINGS.en;
    return table[key] != null ? table[key] : STRINGS.en[key] != null ? STRINGS.en[key] : key;
  };

  // <x data-i18n="key"> sets text; data-i18n-label sets aria-label; data-i18n-alt sets alt.
  FF.applyI18n = function (root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = FF.t(el.getAttribute("data-i18n")); });
    root.querySelectorAll("[data-i18n-label]").forEach(function (el) { el.setAttribute("aria-label", FF.t(el.getAttribute("data-i18n-label"))); });
    root.querySelectorAll("[data-i18n-alt]").forEach(function (el) { el.setAttribute("alt", FF.t(el.getAttribute("data-i18n-alt"))); });
  };

  // ---------- Scenes ----------
  var SCENES = (window.FF_SCENES && window.FF_SCENES.scenes) || [{ id: "sunriseMountains", title: "Mountain sunrise", isDark: false }];

  FF.scene = function (id) {
    for (var i = 0; i < SCENES.length; i++) if (SCENES[i].id === id) return SCENES[i];
    return null;
  };

  FF.sceneTitle = function (scene) {
    return FF.lang === "fr" && SCENE_FR[scene.id] ? SCENE_FR[scene.id] : scene.title;
  };

  // Same picture as the app's Verse of the Day (SceneryKind.forDay: day number in the era x 7, mod count).
  FF.todayScene = function () {
    var anchor = (window.FF_SCENES && window.FF_SCENES.dayAnchor) || { date: "2026-01-01", ordinal: 739617 };
    var a = anchor.date.split("-");
    var now = new Date();
    var days = Math.round((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(+a[0], +a[1] - 1, +a[2])) / 86400000);
    var n = SCENES.length;
    var idx = ((((anchor.ordinal + days) * 7) % n) + n) % n;
    return SCENES[idx];
  };

  // Paints a scene behind `el` (portrait image on phones, landscape on wide screens).
  FF.paintScene = function (el, scene) {
    var root = FF.root;
    el.style.setProperty("--scene-tall", 'url("' + new URL("scenes/" + scene.id + ".jpg", root).href + '")');
    el.style.setProperty("--scene-wide", 'url("' + new URL("scenes/wide/" + scene.id + ".jpg", root).href + '")');
    el.setAttribute("data-dark", scene.isDark ? "true" : "false");
  };

  // The page's scene: ?s=<scene> when it names one, otherwise today's. Set on <html> while the head is still
  // loading, so the browser fetches only this picture (never the stylesheet's fallback first).
  FF.pageScene = FF.scene(params.get("s") || "") || FF.todayScene();
  FF.paintScene(document.documentElement, FF.pageScene);

  // Every App Store link on the page.
  FF.wireStoreLinks = function (root) {
    (root || document).querySelectorAll("[data-store]").forEach(function (a) {
      a.href = FF.APP_STORE;
      a.rel = "noopener";
    });
  };
})();
