(() => {
  // src/wizard/navigation.js
  var sections = ["cap-good-que", "raw-good-que", "common-questions"];
  var navIds = ["first-nav-item", "second-nav-item", "third-nav-item"];
  var sectionIndex = 0;
  var boxIndex = 0;
  function showCurrentBox() {
    sections.forEach((sectionId, sIdx) => {
      const section = document.getElementById(sectionId);
      const boxes = section.children;
      for (let i = 0; i < boxes.length; i++) {
        const isCurrent = sIdx === sectionIndex && i === boxIndex;
        boxes[i].style.display = isCurrent && sectionId === "cap-good-que" ? "grid" : isCurrent ? "block" : "none";
      }
    });
    const isLastSection = sectionIndex === sections.length - 1;
    const currentSection = document.getElementById(sections[sectionIndex]);
    const isLastBox = boxIndex === currentSection.children.length - 1;
    const calculateBtn = document.getElementById("calculate");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("Prev");
    calculateBtn.style.display = isLastSection && isLastBox ? "inline-block" : "none";
    if (isLastSection && isLastBox) {
      nextBtn.disabled = true;
      nextBtn.style.backgroundColor = "#ccc";
      nextBtn.style.cursor = "not-allowed";
    } else {
      nextBtn.disabled = false;
      nextBtn.style.backgroundColor = "";
      nextBtn.style.cursor = "";
    }
    if (sectionIndex === 0 && boxIndex === 0) {
      prevBtn.disabled = true;
      prevBtn.style.backgroundColor = "#ccc";
      prevBtn.style.cursor = "not-allowed";
    } else {
      prevBtn.disabled = false;
      prevBtn.style.backgroundColor = "";
      prevBtn.style.cursor = "";
    }
  }
  function updateProgress(isFinal = false) {
    const sectionBoxCounts = sections.map((id) => {
      const section = document.getElementById(id);
      return section ? section.children.length : 0;
    });
    let totalBoxes = sectionBoxCounts.reduce((sum, count) => sum + count, 0);
    let completedBoxes = 0;
    for (let i = 0; i < sectionIndex; i++) {
      completedBoxes += sectionBoxCounts[i];
    }
    completedBoxes += boxIndex;
    const percentage = isFinal ? 100 : Math.round(completedBoxes / totalBoxes * 100);
    document.getElementById("progressBar").style.width = percentage + "%";
    document.getElementById("progressText").innerText = percentage + "%";
    navIds.forEach((navId, idx) => {
      const navItem = document.getElementById(navId);
      if (idx === sectionIndex) {
        navItem.classList.add("active");
      } else {
        navItem.classList.remove("active");
      }
    });
  }
  function goNext() {
    const textInput = document.getElementById("first-left-input");
    const selectInput = document.getElementById("third-right-input");
    const selectError = document.getElementById("third-right-input-error");
    if (sectionIndex === 0 && boxIndex === 0) {
      const textValue = textInput.value.trim();
      if (textValue !== "") {
        selectInput.setAttribute("required", "required");
        const selectValue = selectInput.value;
        if (selectValue === "Choose" || selectValue === "") {
          selectInput.setAttribute("aria-invalid", "true");
          if (selectError) selectError.style.display = "block";
          selectInput.focus();
          return;
        }
      } else {
        selectInput.removeAttribute("required");
      }
    }
    selectInput.removeAttribute("aria-invalid");
    if (selectError) selectError.style.display = "none";
    const currentSection = document.getElementById(sections[sectionIndex]);
    const boxCount = currentSection.children.length;
    if (boxIndex < boxCount - 1) {
      boxIndex++;
    } else if (sectionIndex < sections.length - 1) {
      sectionIndex++;
      boxIndex = 0;
    }
    showCurrentBox();
    updateProgress();
  }
  function goPrev() {
    if (boxIndex > 0) {
      boxIndex--;
    } else if (sectionIndex > 0) {
      sectionIndex--;
      const previousSection = document.getElementById(sections[sectionIndex]);
      boxIndex = previousSection.children.length - 1;
    }
    showCurrentBox();
    updateProgress();
  }
  document.getElementById("third-right-input").addEventListener("change", () => {
    const selectInput = document.getElementById("third-right-input");
    const selectError = document.getElementById("third-right-input-error");
    if (selectInput.value !== "Choose" && selectInput.value !== "") {
      selectInput.removeAttribute("aria-invalid");
      if (selectError) selectError.style.display = "none";
    }
  });
  document.getElementById("next").addEventListener("click", goNext);
  document.getElementById("Prev").addEventListener("click", goPrev);
  document.getElementById("calculate").addEventListener("click", function() {
    updateProgress(true);
  });
  showCurrentBox();
  updateProgress();
  function setupDisposalListeners() {
    document.querySelectorAll('select[id$="ms"]').forEach((select, index) => {
      select.addEventListener("change", () => {
        let rowLetter = String.fromCharCode(97 + index);
        let intendedPeriodElement = document.querySelector(`#${rowLetter}ip`);
        if (select.value === "Sale in DTA") {
          intendedPeriodElement.style.display = "block";
        } else {
          intendedPeriodElement.style.display = "none";
        }
      });
    });
  }
  document.addEventListener("DOMContentLoaded", setupDisposalListeners);

  // src/wizard/formatting.js
  function formatIndianNumber(rawValue) {
    let value = rawValue.replace(/[^\d.]/g, "");
    if ((value.match(/\./g) || []).length > 1) {
      value = value.replace(/(?!^)\./g, "");
    }
    let [integerPart, decimalPart] = value.split(".");
    let lastThree = integerPart.slice(-3);
    let otherNumbers = integerPart.slice(0, -3);
    if (otherNumbers !== "") {
      lastThree = "," + lastThree;
    }
    let formattedValue = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    if (decimalPart !== void 0) {
      formattedValue += "." + decimalPart;
    }
    return formattedValue;
  }
  function formatNumber(id) {
    const input = document.getElementById(id);
    input.value = formatIndianNumber(input.value);
  }

  // src/entries/optii-savr-calculator.entry.js
  window.formatNumber = formatNumber;
  var domestic;
  var imported;
  $("#being-procured-yes").click(() => {
    $("#being-procured-no").removeClass("active");
    $("#being-procured-yes").addClass("active");
    $("#cap-que-domestic").css("display", "flex");
    $("#CapitalGoods").removeClass("inactive-box");
  });
  $("#being-procured-no").click(() => {
    $("#being-procured-no").addClass("active");
    $("#cap-que-domestic").css("display", "none");
    $("#being-procured-yes").removeClass("active");
    $("#CapitalGoods").addClass("inactive-box");
    $("#domestic-goods-box").addClass("inactive-box");
    $("#domesticCapitalGoods").val("");
  });
  $("#cap-que-domestic-yes").click(() => {
    $("#cap-que-domestic-yes").addClass("active");
    domestic = true;
    $("#cap-que-domestic-no").removeClass("active");
    imported = false;
    $("#domestic-goods-title").removeClass("inactive-box");
    $("#domestic-goods-box").removeClass("inactive-box");
  });
  $("#cap-que-domestic-no").click(() => {
    $("#cap-que-domestic-no").addClass("active");
    domestic = false;
    $("#cap-que-domestic-yes").removeClass("active");
    imported = true;
    $("#domestic-goods-title").addClass("inactive-box");
    $("#domestic-goods-box").addClass("inactive-box");
    $("#Dfirst-left-input").val("");
    $("#Dfirst-right-input").val("");
    $("#Dsecond-left-input").val("");
    $("#Dsecond-right-input").val("");
    $("#Dsgd").val("");
    $("#Dcwd").val("");
  });
  $("#Raw-being-procured-yes").click(() => {
    $("#raw-materials-inputs").css("display", "flex");
    $("#Raw-being-procured-yes").addClass("active");
    $(".raw-que-domestic").css("display", "flex");
    $("#Raw-being-procured-no").removeClass("active");
  });
  $("#Raw-being-procured-no").click(() => {
    $("#raw-materials-inputs").css("display", "none");
    $(".raw-que-domestic").css("display", "none");
    $("#Raw-being-procured-yes").removeClass("active");
    $("#Raw-being-procured-no").addClass("active");
    $("#DomesticRawMaterialValueSEZ").val("");
    $("#DomesticRawMaterialValueDomesticSale").val("");
  });
  $("#raw-que-domestic-yes").click(() => {
    $("#raw-que-domestic-yes").toggleClass("active");
    domestic = true;
    $("#raw-que-domestic-no").removeClass("active");
    imported = false;
    $("#domestic-raw-goods-title").removeClass("inactive-box");
    $("#raw-domestic-box").removeClass("inactive-box");
  });
  $("#raw-que-domestic-no").click(() => {
    $("#raw-que-domestic-no").toggleClass("active");
    domestic = false;
    $("#raw-que-domestic-yes").removeClass("active");
    imported = true;
    $("#domestic-raw-goods-title").addClass("inactive-box");
    $("#raw-domestic-box").addClass("inactive-box");
    $("#GrossRawDomesticCIF").val("");
    $("#GrossRawDomesticBCD").val("");
    $("#GrossRawDomesticAIDC").val("");
    $("#GrossRawDomesticADD").val("");
    $("#GrossRawDomesticSGD").val("");
    $("#GrossRawDomesticCWD").val("");
  });
  $(function() {
    const PLUS_ICON = "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/plus.png";
    const MINUS_ICON = "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/minus.png";
    $(".title-q .add").click(function() {
      const sectionId = "#section" + this.id.replace("title", "");
      const $section = $(sectionId);
      const $icon = $(this);
      $(".title-q .add").each(function() {
        if (this === $icon[0]) return;
        const $otherSection = $("#section" + this.id.replace("title", ""));
        if ($otherSection.is(":visible")) {
          $otherSection.slideUp(200);
          $(this).attr("src", PLUS_ICON);
        }
      });
      $section.slideToggle(200).promise().done(function() {
        const isVisible = $section.is(":visible");
        $icon.attr("src", isVisible ? MINUS_ICON : PLUS_ICON);
      });
    });
    $(".faq-div .add").click(function() {
      const $answer = $(this).closest(".faq-div").find(".ans");
      const $icon = $(this);
      $(".faq-div .add").each(function() {
        if (this === $icon[0]) return;
        const $otherAnswer = $(this).closest(".faq-div").find(".ans");
        if ($otherAnswer.is(":visible")) {
          $otherAnswer.slideUp(200);
          $(this).attr("src", PLUS_ICON);
        }
      });
      $answer.slideToggle(200).promise().done(function() {
        const isVisible = $answer.is(":visible");
        $icon.attr("src", isVisible ? MINUS_ICON : PLUS_ICON);
      });
    });
  });
  var newTab;
  var VIEWER_URL_BY_HOST = {
    localhost: "/viewer",
    "eversity.co.in": "/tools/optii-savr/viewer/",
    "hackyvirus.github.io": "preview-viewer.html"
  };
  $("#calculate").click(() => {
    const viewerUrl = VIEWER_URL_BY_HOST[window.location.hostname] || "/viewer";
    newTab = window.open(viewerUrl, "_blank");
    if (!newTab) {
      alert("Popup blocked! Enable popups for this site.");
      return;
    }
    const MAIN_JS_BY_HOST = {
      localhost: "/scripts/main.js",
      "eversity.co.in": "/wp-content/themes/hostinger-ai-theme/tools/optii-savr/scripts/main.js",
      "hackyvirus.github.io": "scripts/main.js"
    };
    var script = document.createElement("script");
    script.src = MAIN_JS_BY_HOST[window.location.hostname] || "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/scripts/main.js";
    document.body.appendChild(script);
    window.onPdfReady = function(finalUrl) {
      newTab.location.href = viewerUrl;
    };
    script.onload = async function() {
      await getAllInputValues();
      document.body.removeChild(script);
    };
  });
})();
