// JavaScript for handling login/signup form transitions

// Selecting elements
const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const signupForm = document.querySelector("form.signup");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLinkForm = document.querySelector("form .signup-link a");
const sliderTab = document.querySelector(".slider-tab");

// Add event listener for the Signup button
signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-100%"; // Move the login form out of view
  loginText.style.marginLeft = "-100%"; // Move the login title
  sliderTab.style.left = "50%"; // Move the slider tab to the Signup position
};

// Add event listener for the Login button
loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%"; // Reset the login form position
  loginText.style.marginLeft = "0%"; // Reset the login title position
  sliderTab.style.left = "0%"; // Reset the slider tab to the Login position
};

// Add event listener for the "Signup" link in the login form
signupLinkForm.onclick = (e) => {
  e.preventDefault(); // Prevent default link behavior
  signupBtn.click(); // Simulate clicking the Signup button
};
