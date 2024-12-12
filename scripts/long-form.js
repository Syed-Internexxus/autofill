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

    if (newSkillInput) {
        newSkillInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && newSkillInput.value.trim() !== "") {
                event.preventDefault();
                addSkillTag(newSkillInput.value.trim());
                newSkillInput.value = "";
            }
        });
    }

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
            const parentEntry = target.closest(".education-entry, .work-entry, .link-entry, .education-form, .work-form, .link-form");
            if (parentEntry) {
                // Determine the container
                let container = parentEntry.closest(".education-form, .work-form, .link-form");
                if (!container) {
                    // If parentEntry itself is .education-form etc.
                    container = parentEntry;
                }

                const entries = container.querySelectorAll(".education-entry, .work-entry, .link-entry");
                // If there's no class like above, it means it's the initial form (no extra added entries)
                // We handle that differently:
                const isInitialForm = entries.length === 0 && container.matches(".education-form, .work-form, .link-form");

                if (isInitialForm) {
                    // If it's the original single form, do not delete it.
                    // Instead, maybe clear the fields if you want that behavior.
                    return;
                } else {
                    // If we have multiple entries, we can safely remove the chosen one if there's more than one
                    const allEntries = entries.length > 0 ? entries : [container];
                    if (allEntries.length > 1) {
                        parentEntry.remove();
                    } else {
                        // Only one entry left, do not delete
                    }
                }
            }
        }

        // Save or Edit entry
        if (target.classList.contains("save-btn")) {
            const parentEntry = target.closest(".education-entry, .work-entry, .link-entry, .education-form, .work-form, .link-form");
            if (parentEntry) {
                const inputs = parentEntry.querySelectorAll("input, textarea, select");
                const isDisabled = Array.from(inputs).some(input => input.disabled);

                if (isDisabled) {
                    // Currently in 'view' mode -> Switch to 'edit' mode
                    inputs.forEach((input) => {
                        input.removeAttribute("disabled");
                    });
                    target.textContent = "Save";
                } else {
                    // Currently in 'edit' mode -> Switch to 'view' mode
                    inputs.forEach((input) => {
                        input.setAttribute("disabled", true);
                    });
                    target.textContent = "Edit";
                }
            }
        }
    });

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
                    <label>Link Type</label>
                    <select>
                        <option value="" disabled>Select an option...</option>
                        <option value="Portfolio" ${link.type === "Portfolio" ? "selected" : ""}>Portfolio</option>
                        <option value="LinkedIn" ${link.type === "LinkedIn" ? "selected" : ""}>LinkedIn</option>
                        <option value="GitHub" ${link.type === "GitHub" ? "selected" : ""}>GitHub</option>
                        <option value="Other" ${link.type === "Other" ? "selected" : ""}>Other</option>
                    </select>
                </div>
                <div>
                    <label>Link URL</label>
                    <input type="url" placeholder="ex. www.mylink.com" value="${link.url || ""}">
                </div>
            </div>
            <div class="form-actions">
                <button class="delete-btn">Delete</button>
                <button class="save-btn">Save</button>
            </div>
        `;
        linkForm.appendChild(newForm);
    }

    // Fetch data from session storage
    let resumeData;
    try {
        resumeData = JSON.parse(sessionStorage.getItem("resumeData"));
    } catch (error) {
        console.error("Invalid JSON in sessionStorage:", error);
        resumeData = null;
    }

    if (resumeData) {
        populateFields(resumeData);
    }

    // Populate fields function
    function populateFields(data) {
        // Personal Details
        const firstName = document.getElementById("first-name");
        const lastName = document.getElementById("last-name");
        const primaryPhone = document.getElementById("primary-phone");
        const secondaryPhone = document.getElementById("secondary-phone");
        const primaryEmail = document.getElementById("primary-email");
        const backupEmail = document.getElementById("backup-email");
        const location = document.getElementById("location"); // personal location

        if (firstName) firstName.value = data["First Name"] || "";
        if (lastName) lastName.value = data["Last Name"] || "";
        if (primaryPhone) primaryPhone.value = data["Contact Number"] || "";
        if (secondaryPhone) secondaryPhone.value = data["Secondary Number"] || "";
        if (primaryEmail) primaryEmail.value = data["Email"] || "";
        if (backupEmail) backupEmail.value = data["Backup Email"] || "";
        if (location) location.value = data["Location"] || "";

        // Education
        // Fill the first education entry
        const educationData = data["Education"] || [];
        const firstEdu = educationData[0];
        const eduForm = document.querySelector(".education-form");

        if (eduForm) {
            // Initial fields
            const schoolName = eduForm.querySelector("#school-name");
            const degree = eduForm.querySelector("#degree");
            const eduStart = eduForm.querySelector("#edu-start-date");
            const eduEnd = eduForm.querySelector("#edu-end-date");
            const gpa = eduForm.querySelector("#gpa");
            const details = eduForm.querySelector("#details");

            if (firstEdu) {
                if (schoolName) schoolName.value = firstEdu.school_name || "";
                if (degree) degree.value = firstEdu.degree || "";
                if (eduStart) eduStart.value = firstEdu.start_date || "";
                if (eduEnd) eduEnd.value = firstEdu.end_date || "";
                if (gpa) gpa.value = firstEdu.gpa || "";
                if (details) details.value = firstEdu.details || "";
            }

            // If there's more than one education entry, add them
            for (let i = 1; i < educationData.length; i++) {
                addEducationSection(educationData[i]);
            }
        }

        // Work Experience
        const experienceData = data["experience"] || [];
        const firstExp = experienceData[0];
        const workForm = document.querySelector(".work-form");

        if (workForm) {
            const companyName = workForm.querySelector("#company-name");
            const jobTitle = workForm.querySelector("#job-title");
            const workStart = workForm.querySelector("#start-date");
            const workEnd = workForm.querySelector("#end-date");
            const workLocation = workForm.querySelector("#work-experience [id='location']"); 
            const responsibilities = workForm.querySelector("#responsibilities");

            if (firstExp) {
                if (companyName) companyName.value = firstExp.company || "";
                if (jobTitle) jobTitle.value = firstExp.title || "";
                if (workStart) workStart.value = firstExp.start_date || "";
                if (workEnd) workEnd.value = firstExp.end_date || "";
                if (workLocation) workLocation.value = firstExp.location || "";
                if (responsibilities) responsibilities.value = firstExp.description || "";
            }

            // Add additional experiences if any
            for (let i = 1; i < experienceData.length; i++) {
                addExperienceSection(experienceData[i]);
            }
        }

        // Skills
        if (data["core_skills"]) {
            data["core_skills"].split(",").forEach((skill) => addSkillTag(skill.trim()));
        }

        // Links
        const linkData = data["Links"] || [];
        const linkForm = document.querySelector(".link-form");

        if (linkForm) {
            // Fill the first link entry
            // The existing HTML for links: has a select #link-type, and input #link-url
            const firstLink = linkData[0];
            const linkTypeSelect = linkForm.querySelector("#link-type");
            const linkUrl = linkForm.querySelector("#link-url");

            if (firstLink) {
                if (linkTypeSelect) {
                    linkTypeSelect.value = firstLink.type || "";
                }
                if (linkUrl) {
                    linkUrl.value = firstLink.url || "";
                }
            }

            // Additional links
            for (let i = 1; i < linkData.length; i++) {
                addLinkSection(linkData[i]);
            }
        }

        // EEO Fields
        const eeoFields = [
            {id: "authorized-to-work", key: "Authorized to Work"},
            {id: "require-sponsorship", key: "Require Sponsorship"},
            {id: "gender-identity", key: "Gender Identity"},
            {id: "preferred-pronouns", key: "Preferred Pronouns"},
            {id: "lgbtqia", key: "LGBTQIA"},
            {id: "racial-identity", key: "Racial Identity"},
            {id: "hispanic", key: "Hispanic"},
            {id: "disability", key: "Disability"},
            {id: "veteran-status", key: "Veteran Status"}
        ];

        eeoFields.forEach(field => {
            const elem = document.getElementById(field.id);
            if (elem && data[field.key]) {
                elem.value = data[field.key];
            }
        });
    }
});
