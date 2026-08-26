// scrollToTop must stay on `window`: called from an inline
// onclick="scrollToTop()" HTML attribute.
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function initScrollToTopButton() {
  document.getElementById("year").textContent = new Date().getFullYear();

  const topBtn = document.getElementById("backToTopBtn");
  window.onscroll = function () {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
  };
}
