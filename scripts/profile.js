const fileInput = document.getElementById("resume-upload");
const uploadLabel = document.querySelector(".upload-text");
const nextButton = document.getElementById("next-button");
const manualEntry = document.querySelector(".manual-entry");
const loader = document.getElementById("loader"); // Select the loader element
const logoutLink = document.getElementById("logout-link");
// Function to hide the loader
const hideLoader = () => {
    loader.style.transition = 'opacity 0.5s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500); // Match the transition duration
};

const logout = () => {
    // Optional: Confirm logout action
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    // Clear all session data
    sessionStorage.clear(); // Clears all data in sessionStorage
    // If you're using localStorage for any data, clear it as well:
    // localStorage.clear();

    // Redirect to index.html
    window.location.href = "index.html";
};

// Attach the logout function to the Logout link's click event
logoutLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default link behavior
    logout();
});
// Hide the loader once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    hideLoader();
});

// Update label when a file is selected
fileInput.addEventListener("change", (event) => {
    const fileName = event.target.files[0]?.name || "Upload File";
    uploadLabel.textContent = fileName;
});

// Convert file to Base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // Extract base64 data
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

// Send request to API
const sendResumeData = async (base64File, fileType) => {
    const apiEndpoint = "https://ehadvjcc5e.execute-api.us-west-1.amazonaws.com/default/resume_parser_extension";
    const requestBody = {
        file_base64: base64File,
        file_type: fileType
    };

    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Resume data processed successfully:", responseData);

        // Store the response in sessionStorage and redirect to long_form.html
        sessionStorage.setItem("resumeData", JSON.stringify(responseData));
        window.location.href = "long_form.html";
    } catch (error) {
        console.error("Error processing resume:", error);
        alert("There was an error processing your resume. Please try again.");
    }
};

// Next button action
nextButton.addEventListener("click", async () => {
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a file before proceeding.");
        return;
    }

    try {
        // Show the loader when processing starts
        loader.style.display = 'flex';
        loader.style.opacity = '1';

        const fileBase64 = await fileToBase64(file);
        const fileType = file.name.split(".").pop().toLowerCase(); // Extract file extension
        if (!["pdf", "doc", "docx"].includes(fileType)) {
            alert("Only PDF, DOC, or DOCX files are supported. Please upload a valid file.");
            hideLoader(); // Hide loader if invalid file
            return;
        }
        await sendResumeData(fileBase64, fileType);
    } catch (error) {
        console.error("Error reading file:", error);
        alert("There was an error reading the file. Please try again.");
        hideLoader(); // Hide loader in case of error
    }
});

// Manual entry redirection
manualEntry.addEventListener("click", () => {
    // Clear any stored data in sessionStorage
    sessionStorage.removeItem("resumeData");

    // Show the loader before redirection
    loader.style.display = 'flex';
    loader.style.opacity = '1';

    // Redirect to long_form.html after showing loader briefly
    setTimeout(() => {
        window.location.href = "long_form.html";
    }, 500); // Adjust the timeout as needed
});
