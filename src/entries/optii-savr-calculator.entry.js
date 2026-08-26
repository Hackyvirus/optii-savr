// Bundled to scripts/optii-savr-calculator.js.
import "../wizard/navigation.js";
import { formatNumber } from "../wizard/formatting.js";

// formatNumber must stay on `window`: the wizard's amount inputs call it via
// inline oninput="formatNumber(...)" HTML attributes.
window.formatNumber = formatNumber;

// `domestic`/`imported` were previously assigned with no declaration
// (`domestic = true`), an implicit global in the original classic script.
// Nothing in the codebase ever reads them (confirmed dead, write-only state)
// -- declaring them here preserves that exact behavior without relying on
// implicit globals, which throw in strict-mode ES modules.
let domestic, imported;

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

let newTab;

$("#calculate").click(() => {
  newTab = window.open("/viewer", "_blank");

  if (!newTab) {
    alert("Popup blocked! Enable popups for this site.");
    return;
  }

  var script = document.createElement("script");
  script.src =
    "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/scripts/main.js";
  document.body.appendChild(script);

  window.onPdfReady = function (finalUrl) {
    newTab.location.href = "/viewer";
  };

  script.onload = async function () {
    await getAllInputValues();
    document.body.removeChild(script);
  };
});
