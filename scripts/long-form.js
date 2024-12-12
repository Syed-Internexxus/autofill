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
        removeButton.style.padding = "0 5px";
        removeButton.style.border = "none";
        removeButton.style.backgroundColor = "transparent";
        removeButton.style.cursor = "pointer";
        removeButton.style.color = "red";
        removeButton.style.fontSize = "16px";

        removeButton.addEventListener("click", () => {
            skillsTagsContainer.removeChild(tag);
        });

        tag.appendChild(removeButton);
        skillsTagsContainer.appendChild(tag);
    }

    // Add functionality for Add, Save, and Delete buttons in Education, Work Experience, and Links sections
    document.body.addEventListener("click", (event) => {
        const target = event.target;

        // Add new education entry
        if (target.classList.contains("add-education-btn")) {
            const educationFormContainer = document.querySelector(".education-form");
            if (!educationFormContainer.querySelector("input")) {
                addEducationSection();
            }
        }

        // Add new work experience entry
        if (target.classList.contains("add-experience-btn")) {
            const workFormContainer = document.querySelector(".work-form");
            if (!workFormContainer.querySelector("input")) {
                addExperienceSection();
            }
        }

        // Add new link entry
        if (target.classList.contains("add-link-btn")) {
            const linkFormContainer = document.querySelector(".link-form");
            if (!linkFormContainer.querySelector("input")) {
                addLinkSection();
            }
        }

        // Delete entry
        if (target.classList.contains("delete-btn")) {
            const parentForm = target.closest(".education-form, .work-form, .link-form");
            if (parentForm) {
                parentForm.remove();
            }
        }

        // Save entry (make fields non-editable in Links section)
        if (target.classList.contains("save-btn")) {
            const parentForm = target.closest(".link-form");
            if (parentForm) {
                parentForm.querySelectorAll("input, select").forEach((input) => {
                    input.setAttribute("readonly", true);
                    input.setAttribute("disabled", true);
                });
                target.remove(); // Remove the save button
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
    // Function to add a new education section
    const addEducationSection = () => {
        const template = `
            <div class="education-entry">
                <div class="form-grid">
                    <input type="text" placeholder="School Name">
                    <input type="text" placeholder="Degree">
                </div>
                <div class="form-grid">
                    <input type="month">
                    <input type="month">
                    <input type="text" placeholder="GPA">
                </div>
                <div class="form-grid">
                    <textarea placeholder="Details"></textarea>
                </div>
                <button class="delete-btn">Delete</button>
            </div>`;
        const educationFormContainer = document.querySelector(".education-form");
        educationFormContainer.insertAdjacentHTML("beforeend", template);
    };

    // Function to add a new work experience section
    const addExperienceSection = () => {
        const template = `
            <div class="work-entry">
                <div class="form-grid">
                    <input type="text" placeholder="Company Name">
                    <input type="text" placeholder="Job Title">
                </div>
                <div class="form-grid">
                    <input type="month">
                    <input type="month">
                    <input type="text" placeholder="Location">
                </div>
                <div class="form-grid">
                    <textarea placeholder="Description of Responsibilities"></textarea>
                </div>
                <button class="delete-btn">Delete</button>
            </div>`;
        const workFormContainer = document.querySelector(".work-form");
        workFormContainer.insertAdjacentHTML("beforeend", template);
    };

    // Function to add a new link section
    const addLinkSection = () => {
        const template = `
            <div class="link-entry">
                <div class="form-grid">
                    <select>
                        <option value="" disabled selected>Select Link Type</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="GitHub">GitHub</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="url" placeholder="Link URL">
                </div>
                <button class="save-btn">Save</button>
                <button class="delete-btn">Delete</button>
            </div>`;
        const linkFormContainer = document.querySelector(".link-form");
        linkFormContainer.insertAdjacentHTML("beforeend", template);
    };

    // Populate fields with data from sessionStorage
    const resumeData = JSON.parse(sessionStorage.getItem("resumeData"));
    if (resumeData) {
        populateFields(resumeData);
    }
});
