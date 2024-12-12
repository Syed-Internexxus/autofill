// References to modal elements and buttons
const signupModal = document.getElementById("signup-modal");
const loginModal = document.getElementById("login-modal");
const signupLink = document.querySelector(".signup-btn");
const getStartedButton = document.getElementById("get-started");
const loginLink = document.getElementById("login-link");
const signupLinkFromLogin = document.getElementById("signup-link-from-login");

// Function to open the Sign Up modal
function openSignupModal() {
  signupModal.classList.remove("hidden");
  loginModal.classList.add("hidden"); // Ensure Login modal is hidden
}

// Function to open the Login modal
function openLoginModal() {
  loginModal.classList.remove("hidden");
  signupModal.classList.add("hidden"); // Ensure Sign Up modal is hidden
}

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === signupModal) {
    signupModal.classList.add("hidden");
  }
  if (event.target === loginModal) {
    loginModal.classList.add("hidden");
  }
});

// Event listeners for buttons and links
signupLink.addEventListener("click", openSignupModal);
getStartedButton.addEventListener("click", openSignupModal);
loginLink.addEventListener("click", openLoginModal);
signupLinkFromLogin.addEventListener("click", openSignupModal);
