const fileInput = document.getElementById("resume-upload");
const uploadLabel = document.querySelector(".upload-text");
const nextButton = document.getElementById("next-button");
const manualEntry = document.querySelector(".manual-entry");

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
        const fileBase64 = await fileToBase64(file);
        const fileType = file.name.split(".").pop().toLowerCase(); // Extract file extension
        if (!["pdf", "doc", "docx"].includes(fileType)) {
            alert("Only PDF, DOC, or DOCX files are supported. Please upload a valid file.");
            return;
        }
        await sendResumeData(fileBase64, fileType);
    } catch (error) {
        console.error("Error reading file:", error);
        alert("There was an error reading the file. Please try again.");
    }
});

// Manual entry redirection
manualEntry.addEventListener("click", () => {
    // Clear any stored data in sessionStorage
    sessionStorage.removeItem("resumeData");

    // Redirect to long_form.html
    window.location.href = "long_form.html";
});
