const sections = ["cap-good-que", "raw-good-que", "common-questions"];
const navIds = ["first-nav-item", "second-nav-item", "third-nav-item"];
let sectionIndex = 0;
let boxIndex = 0;

function showCurrentBox() {
  sections.forEach((sectionId, sIdx) => {
    const section = document.getElementById(sectionId);
    const boxes = section.children;
    for (let i = 0; i < boxes.length; i++) {
      const isCurrent = sIdx === sectionIndex && i === boxIndex;
      boxes[i].style.display =
        isCurrent && sectionId === "cap-good-que"
          ? "grid"
          : isCurrent
          ? "block"
          : "none";
    }
  });

  const isLastSection = sectionIndex === sections.length - 1;
  const currentSection = document.getElementById(sections[sectionIndex]);
  const isLastBox = boxIndex === currentSection.children.length - 1;

  const calculateBtn = document.getElementById("calculate");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("Prev");

  calculateBtn.style.display =
    isLastSection && isLastBox ? "inline-block" : "none";

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

  const percentage = isFinal
    ? 100
    : Math.round((completedBoxes / totalBoxes) * 100);
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

  if (sectionIndex === 0 && boxIndex === 0) {
    const textValue = textInput.value.trim();

    if (textValue !== "") {
      selectInput.setAttribute("required", "required");

      const selectValue = selectInput.value;
      if (selectValue === "Choose" || selectValue === "") {
        alert('Please select a "Disposal of capital goods by way of ".');
        return; 
      }
    } else {
      selectInput.removeAttribute("required");
    }
  }

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

document.getElementById("next").addEventListener("click", goNext);
document.getElementById("Prev").addEventListener("click", goPrev);
document.getElementById("calculate").addEventListener("click", function () {
  updateProgress(true);
});

showCurrentBox();
updateProgress();

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

$(function () {
  $(".title-q .add").click(function () {
    const sectionId = "#section" + this.id.replace("title", "");
    const $section = $(sectionId);
    const $icon = $(this);

    $section
      .slideToggle(200)
      .promise()
      .done(function () {
        const isVisible = $section.is(":visible");
        $icon.attr(
          "src",
          isVisible
            ? "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/minus.png"
            : "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/plus.png"
        );
      });
  });

  $(".faq-div .add").click(function () {
    const $answer = $(this).closest(".faq-div").find(".ans");
    const $icon = $(this);

    $answer
      .slideToggle(200)
      .promise()
      .done(function () {
        const isVisible = $answer.is(":visible");
        $icon.attr(
          "src",
          isVisible
            ? "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/minus.png"
            : "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/plus.png"
        );
      });
  });
});
const learnMoreBtn = document.getElementById("learn-more-btn");
const popupBox = document.getElementById("popup-box");
const closeBtn = document.querySelector(".close-btn3");

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

let newTab;

$("#calculate").click(() => {

  newTab = window.open("/viewer", "_blank");

  if (!newTab) {
    alert("Popup blocked! Enable popups for this site.");
    return;
  }

  var script = document.createElement("script");
  script.src = "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/scripts/main.js";
  document.body.appendChild(script);

  window.onPdfReady = function (finalUrl) {
    newTab.location.href = "/viewer"; 
  };

  script.onload = async function () {
    await getAllInputValues();
    document.body.removeChild(script);
  };
});



function formatNumber(id) {
  const input = document.getElementById(id);
  let value = input.value.replace(/[^\d.]/g, "");
  if ((value.match(/\./g) || []).length > 1) {
    value = value.replace(/(?!^)\./g, "");
  }
  let [integerPart, decimalPart] = value.split(".");
  let lastThree = integerPart.slice(-3);
  let otherNumbers = integerPart.slice(0, -3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  let formattedValue =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  if (decimalPart !== undefined) {
    formattedValue += "." + decimalPart;
  }
  input.value = formattedValue;
}