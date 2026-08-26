$("#calculate-btn").on("click", function () {
  $("#termsModal").css("display", "block");
  $(".modal-content").css("display", "block");
});

$("#acceptBtn").on("click", function () {
  if ($("#checkbox").is(":checked")) {
    window.location.href = "https://optitaxs.com/optii-savr-calculator/";
  } else {
    alert("Please accept the terms and conditions");
  }
});

$("#close").on("click", function () {
  $("#termsModal").css("display", "none");
  $(".modal-content").css("display", "none");
});
