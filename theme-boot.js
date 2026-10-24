// Runs before the page draws: applies dark mode and Calm mode from this person's saved choice, so there is no white flash.
(function () {
  try {
    var p = localStorage.getItem("zero.theme");
    var dark = p === "dark" || (p !== "light" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var r = document.documentElement;
    if (dark) { r.classList.add("dark"); var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", "#0b1020"); }
    if (localStorage.getItem("zero.calm") === "1") r.classList.add("calm");
  } catch (e) { /* storage blocked: stay light */ }
})();
