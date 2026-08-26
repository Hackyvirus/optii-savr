(() => {
  // src/usermanual/scroll-to-top.js
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function initScrollToTopButton() {
    document.getElementById("year").textContent = (/* @__PURE__ */ new Date()).getFullYear();
    const topBtn = document.getElementById("backToTopBtn");
    window.onscroll = function() {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        topBtn.style.display = "block";
      } else {
        topBtn.style.display = "none";
      }
    };
  }

  // src/entries/optii-savr-usermanual.entry.js
  window.scrollToTop = scrollToTop;
  initScrollToTopButton();
})();
