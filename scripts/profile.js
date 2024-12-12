const fileInput = document.getElementById("resume-upload");
const uploadLabel = document.querySelector(".upload-text");

// Update label when a file is selected
fileInput.addEventListener("change", (event) => {
    const fileName = event.target.files[0]?.name || "Upload File";
    uploadLabel.textContent = fileName;
});

// Next button action
const nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", () => {
    alert("Next step triggered!");
    // Replace this alert with navigation or form submission logic
});
