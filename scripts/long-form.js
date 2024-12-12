document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".form-section");
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const nextButtons = document.querySelectorAll(".next-button");
    let currentSectionIndex = 0;

    function showSection(index) {
        sections.forEach((section, i) => {
            section.classList.toggle("active", i === index);
        });
        sidebarItems.forEach((item, i) => {
            item.classList.toggle("active", i === index);
        });
        currentSectionIndex = index;
    }

    sidebarItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            showSection(index);
        });
    });

    nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentSectionIndex < sections.length - 1) {
                showSection(currentSectionIndex + 1);
            }
        });
    });

    showSection(0);

    // Skills Section
    const newSkillInput = document.getElementById("new-skill");
    const skillsTagsContainer = document.querySelector(".skills-tags");

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
        Object.assign(removeButton.style, {
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            marginLeft: "8px"
        });
        removeButton.addEventListener("click", () => {
            skillsTagsContainer.removeChild(tag);
        });

        tag.appendChild(removeButton);
        skillsTagsContainer.appendChild(tag);
    }

    document.body.addEventListener("click", (event) => {
        const target = event.target;

        // Add new education entry
        if (target.classList.contains("add-education-btn")) {
            addEducationSection();
        }

        // Add new work experience entry
        if (target.classList.contains("add-experience-btn")) {
            addExperienceSection();
        }

        // Add new link entry
        if (target.classList.contains("add-link-btn")) {
            addLinkSection();
        }

        // Delete entry (only if more than one is present)
        if (target.classList.contains("delete-btn")) {
            const parentEntry = target.closest(".education-entry, .work-entry, .link-entry");
            if (parentEntry) {
                const container = parentEntry.parentElement;
                // Only delete if more than one entry
                if (container.querySelectorAll(".education-entry, .work-entry, .link-entry").length > 1) {
                    parentEntry.remove();
                    ensureAddButtonVisibility();
                } else {
                    // If there's only one entry, do not delete. Optionally show a message or do nothing.
                }
            }
        }

        // Save or Edit entry
        if (target.classList.contains("save-btn")) {
            const parentEntry = target.closest(".education-entry, .work-entry, .link-entry");
            if (parentEntry) {
                // Check if currently editing or currently viewing
                const isDisabled = parentEntry.querySelector("input:disabled, textarea:disabled, select:disabled");
                
                if (isDisabled) {
                    // Currently in 'view' mode (Edit mode was off, fields disabled), switch to 'edit' mode
                    parentEntry.querySelectorAll("input, textarea, select").forEach((input) => {
                        input.removeAttribute("disabled");
                    });
                    target.textContent = "Save";
                } else {
                    // Currently in 'edit' mode, switch to 'view' mode
                    parentEntry.querySelectorAll("input, textarea, select").forEach((input) => {
                        input.setAttribute("disabled", true);
                    });
                    target.textContent = "Edit";
                }
            }
        }
    });

    function ensureAddButtonVisibility() {
        [".education-form", ".work-form", ".link-form"].forEach((selector) => {
            const forms = document.querySelector(selector);
            if (forms) {
                // Show add button if at least one entry is present (or always show it)
                // If you want to hide it when there's at least one entry, adjust logic accordingly.
                const sectionName = selector.split("-")[1]; // "education", "work", "link"
                const addButton = document.querySelector(`.add-${sectionName}-btn`);
                if (addButton) addButton.style.display = "block";
            }
        });
    }

    // Dynamically add entries
    function addEducationSection(edu = {}) {
        const educationForm = document.querySelector(".education-form");
        if (!educationForm) return;
        const newForm = document.createElement("div");
        newForm.classList.add("education-entry");
        newForm.innerHTML = `
            <div class="form-grid">
                <div>
                    <label>School Name</label>
                    <input type="text" placeholder="Stanford University" value="${edu.school_name || ""}">
                </div>
                <div>
                    <label>Degree</label>
                    <input type="text" placeholder="ex. Bachelors of Science in Biology" value="${edu.degree || ""}">
                </div>
            </div>
            <div class="form-grid">
                <div>
                    <label>Start</label>
                    <input type="month" value="${edu.start_date || ""}">
                </div>
                <div>
                    <label>End</label>
                    <input type="month" value="${edu.end_date || ""}">
                </div>
                <div>
                    <label>GPA</label>
                    <input type="text" placeholder="ex. 4.0" value="${edu.gpa || ""}">
                </div>
            </div>
            <div class="form-grid full-width">
                <label>Details</label>
                <textarea placeholder="Include relevant coursework, honors, achievements, research, etc.">${edu.details || ""}</textarea>
            </div>
            <div class="form-actions">
                <button class="delete-btn">Delete</button>
                <button class="save-btn">Save</button>
            </div>
        `;
        educationForm.appendChild(newForm);
    }

    function addExperienceSection(exp = {}) {
        const workForm = document.querySelector(".work-form");
        if (!workForm) return;
        const newForm = document.createElement("div");
        newForm.classList.add("work-entry");
        newForm.innerHTML = `
            <div class="form-grid">
                <div>
                    <label>Company Name</label>
                    <input type="text" placeholder="Stripe" value="${exp.company || ""}">
                </div>
                <div>
                    <label>Title</label>
                    <input type="text" placeholder="ex. Software Engineer" value="${exp.title || ""}">
                </div>
            </div>
            <div class="form-grid">
                <div>
                    <label>Start</label>
                    <input type="month" value="${exp.start_date || ""}">
                </div>
                <div>
                    <label>End</label>
                    <input type="month" value="${exp.end_date || ""}">
                </div>
                <div>
                    <label>Location</label>
                    <input type="text" placeholder="San Francisco, CA" value="${exp.location || ""}">
                </div>
            </div>
            <div class="form-grid full-width">
                <label>Description of Responsibilities</label>
                <textarea placeholder="Include relevant responsibilities, achievements, contributions, research, etc.">${exp.description || ""}</textarea>
            </div>
            <div class="form-actions">
                <button class="delete-btn">Delete</button>
                <button class="save-btn">Save</button>
            </div>
        `;
        workForm.appendChild(newForm);
    }

    function addLinkSection(link = {}) {
        const linkForm = document.querySelector(".link-form");
        if (!linkForm) return;
        const newForm = document.createElement("div");
        newForm.classList.add("link-entry");
        newForm.innerHTML = `
            <div class="form-grid">
                <div>
                    <label>Type</label>
                    <input type="text" placeholder="LinkedIn" value="${link.type || ""}">
                </div>
                <div>
                    <label>URL</label>
                    <input type="url" placeholder="https://linkedin.com/in/your-profile" value="${link.url || ""}">
                </div>
            </div>
            <div class="form-actions">
                <button class="delete-btn">Delete</button>
                <button class="save-btn">Save</button>
            </div>
        `;
        linkForm.appendChild(newForm);
    }

    // Populate fields with resumeData if available
    const resumeData = JSON.parse(sessionStorage.getItem("resumeData"));
    if (resumeData) {
        populateFields(resumeData);
    }

    function populateFields(data) {
        // Personal details
        const firstName = document.getElementById("first-name");
        const lastName = document.getElementById("last-name");
        const phone = document.getElementById("primary-phone");
        const email = document.getElementById("primary-email");

        if (firstName) firstName.value = data["First Name"] || "";
        if (lastName) lastName.value = data["Last Name"] || "";
        if (phone) phone.value = data["Contact Number"] || "";
        if (email) email.value = data["Email"] || "";

        if (data["Website Profile"]) {
            addLinkSection({
                type: "LinkedIn",
                url: data["Website Profile"]
            });
        } else {
            // Ensure at least one link entry
            addLinkSection();
        }

        // Education
        if (data["Education"] && Array.isArray(data["Education"]) && data["Education"].length > 0) {
            data["Education"].forEach((edu) => addEducationSection(edu));
        } else {
            // Ensure at least one education entry
            addEducationSection();
        }

        // Work Experience
        if (data["experience"] && Array.isArray(data["experience"]) && data["experience"].length > 0) {
            data["experience"].forEach((exp) => addExperienceSection(exp));
        } else {
            // Ensure at least one work experience entry
            addExperienceSection();
        }

        // Skills
        if (data["core_skills"]) {
            data["core_skills"].split(",").forEach((skill) => addSkillTag(skill.trim()));
        }
    }
});
