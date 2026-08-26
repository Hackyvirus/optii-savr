// Step/box navigation for the Capital Goods / Raw Material / Common
// Questions wizard. Self-initializing: wires up its own DOM listeners and
// renders the initial state as soon as it's imported, matching the original
// classic script's top-level side effects.
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
document.getElementById("calculate").addEventListener("click", function () {
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
