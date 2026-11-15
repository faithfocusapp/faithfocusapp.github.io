// Landing page: language, today's scene (same as the app's Verse of the Day picture), invite banner.
(function () {
  "use strict";
  var FF = window.FF;
  FF.applyI18n();
  FF.wireStoreLinks();

  var invited = (FF.params.get("ref") || "").toLowerCase() === "invite";
  if (invited) {
    document.getElementById("invite").hidden = false;
    document.title = FF.t("invited");
  } else {
    document.title = "FaithFocus · " + (FF.lang === "fr" ? "Appli Bible gratuite" : "Free Bible app");
  }

  var scene = FF.pageScene;
  document.getElementById("hero").setAttribute("data-dark", scene.isDark ? "true" : "false");
  var caption = document.getElementById("scene-caption");
  caption.textContent = FF.t("todayPicture") + FF.sceneTitle(scene);
  caption.hidden = false;

  // The closing card uses a calm second scene (a few days on, so it differs from the hero).
  var all = window.FF_SCENES && window.FF_SCENES.scenes;
  if (all && all.length > 1) {
    var i = all.findIndex(function (s) { return s.id === scene.id; });
    FF.paintScene(document.getElementById("cta-scene"), all[(i + 3) % all.length]);
  }
})();
