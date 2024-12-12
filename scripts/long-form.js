document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".form-section");
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const nextButtons = document.querySelectorAll(".next-button");
    let currentSectionIndex = 0;

    // Function to update section visibility
    function showSection(index) {
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }
        });

        sidebarItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        currentSectionIndex = index;
    }

    // Sidebar click navigation
    sidebarItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            showSection(index);
        });
    });

    // Next button navigation
    nextButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            if (currentSectionIndex < sections.length - 1) {
                showSection(currentSectionIndex + 1);
            }
        });
    });

    // Initialize the first section as active
    showSection(0);

    // Skills Section Functionality
    const newSkillInput = document.getElementById("new-skill");
    const skillsTagsContainer = document.querySelector(".skills-tags");

    // Add skill as a tag on pressing Enter
    newSkillInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && newSkillInput.value.trim() !== "") {
            event.preventDefault();
            addSkillTag(newSkillInput.value.trim());
            newSkillInput.value = "";
        }
    });

    function addSkillTag(skill) {
        const tag = document.createElement("span");
        tag.classList.add("skill-tag");
        tag.textContent = skill;

        const removeButton = document.createElement("button");
        removeButton.textContent = "×";
        removeButton.classList.add("remove-skill");
        removeButton.addEventListener("click", () => {
            skillsTagsContainer.removeChild(tag);
        });

        tag.appendChild(removeButton);
        skillsTagsContainer.appendChild(tag);
    }

    // Add functionality for Add, Save, and Delete buttons in Education and Work sections
    document.body.addEventListener("click", (event) => {
        const target = event.target;

        // Add new education entry
        if (target.classList.contains("add-education-btn")) {
            const educationForm = document.querySelector(".education-form");
            const newForm = educationForm.cloneNode(true);
            newForm.querySelectorAll("input, textarea").forEach((input) => {
                input.value = "";
            });
            educationForm.parentNode.insertBefore(newForm, target);
        }

        // Add new work experience entry
        if (target.classList.contains("add-experience-btn")) {
            const workForm = document.querySelector(".work-form");
            const newForm = workForm.cloneNode(true);
            newForm.querySelectorAll("input, textarea").forEach((input) => {
                input.value = "";
            });
            workForm.parentNode.insertBefore(newForm, target);
        }

        // Delete entry
        if (target.classList.contains("delete-btn")) {
            const parentForm = target.closest(".education-form, .work-form");
            if (parentForm) {
                parentForm.remove();
            }
        }

        // Save entry (for demonstration purposes, log the saved data)
        if (target.classList.contains("save-btn")) {
            const parentForm = target.closest(".education-form, .work-form");
            if (parentForm) {
                const formData = {};
                parentForm.querySelectorAll("input, textarea").forEach((input) => {
                    formData[input.name || input.id] = input.value;
                });
                console.log("Saved data:", formData);
            }
        }
    });

    // Function to populate fields with response data
    const populateFields = (data) => {
        // Personal Details
        document.getElementById("first-name").value = data["First Name"] || "";
        document.getElementById("last-name").value = data["Last Name"] || "";
        document.getElementById("primary-phone").value = data["Contact Number"] || "";
        document.getElementById("primary-email").value = data["Email"] || "";
        document.getElementById("location").value = ""; // Location not provided in response
        if (data["Website Profile"]) {
            addLinkSection({
                type: "LinkedIn",
                url: data["Website Profile"]
            });
        }

        // Education
        if (data["Education"] && data["Education"].length > 0) {
            data["Education"].forEach((edu) => addEducationSection(edu));
        }

        // Work Experience
        if (data["experience"] && Array.isArray(data["experience"])) {
            data["experience"].forEach((exp) => addExperienceSection(exp));
        }

        // Skills
        if (data["core_skills"]) {
            data["core_skills"].split(",").forEach((skill) => addSkillTag(skill.trim()));
        }
    };

    const addEducationSection = (edu) => {
        const template = `
            <div class="form-grid">
                <input type="text" placeholder="School Name" value="${edu.school_name || ""}">
                <input type="text" placeholder="Degree" value="${edu.degree || ""}">
            </div>
            <div class="form-grid">
                <input type="month" value="${edu.start_date || ""}">
                <input type="month" value="${edu.end_date || ""}">
                <input type="text" placeholder="GPA" value="${edu.gpa || ""}">
            </div>`;
        document.querySelector(".education-form").insertAdjacentHTML("beforeend", template);
    };

    const addExperienceSection = (exp) => {
        const template = `
            <div class="form-grid">
                <input type="text" placeholder="Company Name" value="${exp.company || ""}">
                <input type="text" placeholder="Job Title" value="${exp.title || ""}">
            </div>`;
        document.querySelector(".work-form").insertAdjacentHTML("beforeend", template);
    };

    const addLinkSection = (link) => {
        const template = `
            <div class="form-grid">
                <input type="text" value="${link.type || ""}">
                <input type="url" value="${link.url || ""}">
            </div>`;
        document.querySelector(".link-form").insertAdjacentHTML("beforeend", template);
    };

    // Fetch data from session storage
    const resumeData = JSON.parse(sessionStorage.getItem("resumeData"));
    if (resumeData) {
        populateFields(resumeData);
    }
});
