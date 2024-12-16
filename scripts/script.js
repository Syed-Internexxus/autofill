// Ensure the script is treated as a module by using type="module" in your HTML:
// <script src="scripts/script.js" type="module"></script>

document.addEventListener("DOMContentLoaded", async () => {
  // Firebase Imports
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js");
  const {
    getAuth,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } = await import("https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js");
  const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js");

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDyIZIJr1uoGlIgauMTqLGiYDWXKzdu1L4",
    authDomain: "autofill-4da48.firebaseapp.com",
    projectId: "autofill-4da48",
    storageBucket: "autofill-4da48.appspot.com",
    messagingSenderId: "206724954770",
    appId: "1:206724954770:web:45e0249242cfac6e49844b",
    measurementId: "G-7CQTP9NR81",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const db = getFirestore(app);

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
  const authBtn = document.getElementById('auth-btn');

  // Email/password form fields
  const emailInput = {
    signup: signupForm.querySelector("input[placeholder='Email Address']"),
    login: loginForm.querySelector("input[placeholder='Email Address']"),
  };
  const passwordInput = {
    signup: signupForm.querySelector("input[placeholder='Password']"),
    login: loginForm.querySelector("input[placeholder='Password']"),
  };
  const confirmPasswordInput = signupForm.querySelector("input[placeholder='Confirm password']");
  const emailAuthBtns = {
    signup: signupForm.querySelector("button[type='submit']"),
    login: loginForm.querySelector("button[type='submit']"),
  };

  // Function to show modal
  const showModal = () => { modal.classList.remove("hidden"); };

  // Function to hide modal
  const hideModal = () => { modal.classList.add("hidden"); };

  // Fetch and display user data after login/signup
  const fetchAndDisplayUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "profiles", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        sessionStorage.setItem("resumeData", JSON.stringify(userData));
        window.location.href = "profile.html"; 
      } else {
        // No data yet; redirect to profile.html so user can fill their info
        window.location.href = "profile.html";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      window.location.href = "profile.html"; 
    }
  };

  // Google SSO login handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      alert(`Welcome ${user.displayName}`);
      await fetchAndDisplayUserData(user.uid);
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Failed to sign in with Google.");
    }
  };

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
      alert("Signup successful! Redirecting...");
      await fetchAndDisplayUserData(userCredential.user.uid);
      hideModal();
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
      alert("Welcome back! Redirecting...");
      await fetchAndDisplayUserData(userCredential.user.uid);
      hideModal();
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
      alert("Please enter your email address to reset your password.");
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

  // Function to update Auth Button based on login state
  const updateAuthButton = (user) => {
    if (user) {
      authBtn.textContent = 'Logout';
      authBtn.classList.remove('signup-btn');
      authBtn.classList.add('logout-btn');
    } else {
      authBtn.textContent = 'Sign Up';
      authBtn.classList.remove('logout-btn');
      authBtn.classList.add('signup-btn');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      // Optionally, redirect to home page or update UI
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Failed to log out.");
    }
  };

  // Event listeners

  // Open modal when clicking on "Get Started" or "Sign Up" in navbar
  getStartedBtn.addEventListener("click", () => {
    showModal();
    signupBtn.click();
  });

  signupModalBtn.addEventListener("click", () => {
    showModal();
    signupBtn.click();
  });

  // Toggle to Signup form
  signupBtn.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    sliderTab.style.left = "50%";
  });

  // Toggle to Login form
  loginBtn.addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    sliderTab.style.left = "0%";
  });

  // Switch to Signup form from Login form link
  signupLinkForm.addEventListener("click", (e) => {
    e.preventDefault();
    signupBtn.click();
  });

  // Close modal when clicking outside the modal content
  modal.addEventListener("click", (e) => {
    if (!modalContent.contains(e.target)) {
      hideModal();
    }
  });

  // Attach Google login handler
  googleLoginBtns.forEach((btn) => btn.addEventListener("click", handleGoogleLogin));

  // Attach form submission handlers
  signupForm.addEventListener("submit", handleSignup);
  loginForm.addEventListener("submit", handleLogin);

  // Attach password reset handler
  forgotPasswordLink.addEventListener("click", handlePasswordReset);

  // Auth Button (Sign Up / Logout) Handler
  authBtn.addEventListener("click", () => {
    if (auth.currentUser) {
      handleLogout();
    } else {
      showModal();
      signupBtn.click();
    }
  });

  // Firebase Auth State Listener
  onAuthStateChanged(auth, (user) => {
    updateAuthButton(user);
    if (user) {
      // User is signed in
      // Optionally, fetch and display user data or redirect
      // fetchAndDisplayUserData(user.uid);
    } else {
      // User is signed out
      // Optionally, clear session data or update UI
      sessionStorage.removeItem("resumeData");
    }
  });
});
