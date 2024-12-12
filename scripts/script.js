document.addEventListener("DOMContentLoaded", async () => {
  // Firebase Imports
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
  const { getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js");

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDyIZIJr1uoGlIgauMTqLGiYDWXKzdu1L4",
    authDomain: "autofill-4da48.firebaseapp.com",
    projectId: "autofill-4da48",
    storageBucket: "autofill-4da48.firebasestorage.app",
    messagingSenderId: "206724954770",
    appId: "1:206724954770:web:45e0249242cfac6e49844b",
    measurementId: "G-7CQTP9NR81",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  // Selecting elements
  const modal = document.querySelector(".modal");
  const modalContent = document.querySelector(".modal-content");
  const signupBtn = document.querySelector("label.signup");
  const loginBtn = document.querySelector("label.login");
  const signupLinkForm = document.querySelector("form .signup-link a");
  const getStartedBtn = document.querySelector(".hero-content button");
  const signupModalBtn = document.querySelector(".navbar nav .signup-btn");
  const loginForm = document.querySelector("form.login");
  const signupForm = document.querySelector("form.signup");
  const sliderTab = document.querySelector(".slider-tab");
  const googleLoginBtns = document.querySelectorAll(".google-btn");
  const forgotPasswordLink = document.querySelector("form.login .pass-link a");
  const authBtn = document.querySelector("#auth-btn"); // Sign Up / Logout button

  // Email/password form fields
  const emailInput = {
    signup: document.querySelector("form.signup input[placeholder='Email Address']"),
    login: document.querySelector("form.login input[placeholder='Email Address']"),
  };
  const passwordInput = {
    signup: document.querySelector("form.signup input[placeholder='Password']"),
    login: document.querySelector("form.login input[placeholder='Password']"),
  };
  const confirmPasswordInput = document.querySelector("form.signup input[placeholder='Confirm password']");
  const emailAuthBtns = {
    signup: document.querySelector("form.signup .btn input[type='submit']"),
    login: document.querySelector("form.login .btn input[type='submit']"),
  };

  // Show the modal for signup/login
  const showModal = () => {
    modal.classList.remove("hidden");
  };

  // Hide the modal
  const hideModal = () => {
    modal.classList.add("hidden");
  };

  // Toggle between Sign Up and Logout
  const updateAuthButton = (isLoggedIn) => {
    if (isLoggedIn) {
      authBtn.textContent = "Logout";
      authBtn.removeEventListener("click", showModal);
      authBtn.addEventListener("click", handleLogout);
    } else {
      authBtn.textContent = "Sign Up";
      authBtn.removeEventListener("click", handleLogout);
      authBtn.addEventListener("click", showModal);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("You have successfully logged out.");
      updateAuthButton(false);
    } catch (error) {
      console.error("Logout Error:", error);
      alert(error.message);
    }
  };

  // Event listener for "Get Started" button
  getStartedBtn.addEventListener("click", () => {
    showModal();
    signupBtn.click();
  });

  // Event listener for "Sign Up" button in navbar
  authBtn.addEventListener("click", showModal);

  // Event listener for switching to the Signup form
  signupBtn.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    sliderTab.style.left = "50%";
  });

  // Event listener for switching to the Login form
  loginBtn.addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    sliderTab.style.left = "0%";
  });

  // Event listener for "Signup" link in Login form
  signupLinkForm.addEventListener("click", (e) => {
    e.preventDefault();
    signupBtn.click();
  });

  // Close the modal when clicking outside the modal content
  modal.addEventListener("click", (e) => {
    if (!modalContent.contains(e.target)) {
      hideModal();
    }
  });

  // Google SSO login handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google Login Success:", user);
      alert(`Welcome ${user.displayName}`);
      updateAuthButton(true);
      hideModal();
      window.location.href = "profile.html";
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Failed to sign in with Google.");
    }
  };

  // Attach event listeners to Google login buttons
  googleLoginBtns.forEach((btn) =>
    btn.addEventListener("click", handleGoogleLogin)
  );

  // Email/password signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    const email = emailInput.signup.value.trim();
    const password = passwordInput.signup.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signup Success:", userCredential.user);
      alert("Signup successful! Redirecting...");
      updateAuthButton(true);
      window.location.href = "profile.html";
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.message);
    }
  };

  // Email/password login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailInput.login.value.trim();
    const password = passwordInput.login.value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Success:", userCredential.user);
      alert("Welcome back! Redirecting...");
      updateAuthButton(true);
      hideModal();
      window.location.href = "profile.html";
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  // Password reset handler
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const email = emailInput.login.value.trim();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Password Reset Error:", error);
      alert(error.message);
    }
  };

  // Attach event listeners to email auth buttons
  emailAuthBtns.signup.addEventListener("click", handleSignup);
  emailAuthBtns.login.addEventListener("click", handleLogin);
  forgotPasswordLink.addEventListener("click", handlePasswordReset);

  // Check user authentication state
  auth.onAuthStateChanged((user) => {
    updateAuthButton(!!user);
  });
});
