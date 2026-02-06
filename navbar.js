const userToggle = document.querySelector(".user-toggle");
const userDropdown = document.querySelector(".user-dropdown");

userToggle.addEventListener("click", () => {
  userDropdown.classList.toggle("open");
});