const learnMoreBtn = document.getElementById("learn-more-btn");
const comparisonOfSchemeBtn = document.getElementById("comparison-of-scheme");
const learnMoreRelevantBtn = document.getElementById("learn-more-relevant");
const popupBox = document.getElementById("popup-box");
const popupBox2 = document.getElementById("popup-box2");
const popupBox3 = document.getElementById("popup-box3");
const closeBtn = document.querySelector(".close-btn3");
const closeBtn2 = document.querySelector(".close-btn32");
const closeBtn3 = document.querySelector(".close-btn33");

learnMoreBtn.addEventListener("click", () => {
  popupBox.style.display = "flex";
});
learnMoreRelevantBtn.addEventListener("click", () => {
  popupBox2.style.display = "flex";
});
comparisonOfSchemeBtn.addEventListener("click", () => {
  popupBox3.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  popupBox.style.display = "none";
});
closeBtn2.addEventListener("click", () => {
  popupBox2.style.display = "none";
});
closeBtn3.addEventListener("click", () => {
  popupBox3.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === popupBox) {
    popupBox.style.display = "none";
  }
  if (event.target === popupBox2) {
    popupBox2.style.display = "none";
  }
  if (event.target === popupBox3) {
    popupBox3.style.display = "none";
  }
});
