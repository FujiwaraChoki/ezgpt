const { shell } = require("electron");

document.addEventListener("DOMContentLoaded", function () {
  // Clear clipboard on button click
  const clearButton = document.querySelector(".clear-clipboard-button");
  const goToGithub = document.querySelector(".github-button");

  clearButton.addEventListener("click", function () {
    // Clear the clipboard
    writeText("");
  });
});
