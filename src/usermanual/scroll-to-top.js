export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function initScrollToTopButton() {
  document.getElementById("year").textContent = new Date().getFullYear();

  const topBtn = document.getElementById("backToTopBtn");
  topBtn.addEventListener("click", scrollToTop);
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
