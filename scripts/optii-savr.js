(() => {
  // src/home/terms-modal.js
  $("#calculate-btn").on("click", function() {
    $("#termsModal").css("display", "block");
    $(".modal-content").css("display", "block");
  });
  $("#acceptBtn").on("click", function() {
    if ($("#checkbox").is(":checked")) {
      window.location.href = "https://optitaxs.com/optii-savr-calculator/";
    } else {
      alert("Please accept the terms and conditions");
    }
  });
  $("#close").on("click", function() {
    $("#termsModal").css("display", "none");
    $(".modal-content").css("display", "none");
  });

  // src/home/learn-more-popups.js
  var learnMoreBtn = document.getElementById("learn-more-btn");
  var comparisonOfSchemeBtn = document.getElementById("comparison-of-scheme");
  var learnMoreRelevantBtn = document.getElementById("learn-more-relevant");
  var popupBox = document.getElementById("popup-box");
  var popupBox2 = document.getElementById("popup-box2");
  var popupBox3 = document.getElementById("popup-box3");
  var closeBtn = document.querySelector(".close-btn3");
  var closeBtn2 = document.querySelector(".close-btn32");
  var closeBtn3 = document.querySelector(".close-btn33");
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
})();
