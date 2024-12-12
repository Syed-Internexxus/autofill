document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".form-section");
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const nextButtons = document.querySelectorAll(".next-button");
    let currentSectionIndex = 0;

    // Function to update section visibility
    function showSection(index) {
        sections.forEach((section, i) => {
            section.classList.toggle("active", i === index);
        });
        sidebarItems.forEach((item, i) => {
            item.classList.toggle("active", i === index);
        });
        currentSectionIndex = index;
    }

    // Sidebar click navigation
    sidebarItems.forEach((item, index) => {
        item.addEventListener("click", () => showSection(index));
    });

    // Next button navigation
    nextButtons.forEach((button) => {
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

    // Add, Save, and Delete functionalities for Education, Work, and Links sections
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

        // Delete entry
        if (target.classList.contains("delete-btn")) {
            const parentForm = target.closest(".education-entry, .work-entry, .link-entry");
            if (parentForm) parentForm.remove();
        }

        // Save or Edit entry
        if (target.classList.contains("save-btn")) {
            const parentForm = target.closest(".education-entry, .work-entry, .link-entry");
            const inputs = parentForm.querySelectorAll("input, textarea, select");
            const isEditable = !target.classList.contains("edit-mode");

            inputs.forEach((input) => {
                input.disabled = isEditable;
            });

            target.textContent = isEditable ? "Edit" : "Save";
            target.classList.toggle("edit-mode", isEditable);
        }
    });

    function addEducationSection() {
        const educationForm = document.querySelector(".education-form");
        const template = `
            <div class="education-entry">
                <div class="form-grid">
                    <div>
                        <label for="school-name">School Name</label>
                        <input type="text" placeholder="Stanford University">
                    </div>
                    <div>
                        <label for="degree">Degree</label>
                        <input type="text" placeholder="ex. Bachelors of Science in Biology">
                    </div>
                </div>
                <div class="form-grid">
                    <div>
                        <label for="edu-start-date">Start</label>
                        <input type="month">
                    </div>
                    <div>
                        <label for="edu-end-date">End</label>
                        <input type="month">
                    </div>
                    <div>
                        <label for="gpa">GPA</label>
                        <input type="text" placeholder="ex. 4.0">
                    </div>
                </div>
                <div class="form-grid full-width">
                    <label for="details">Details</label>
                    <textarea placeholder="Include relevant coursework, honors, achievements, research, etc."></textarea>
                </div>
                <div class="form-actions">
                    <button class="delete-btn">Delete</button>
                    <button class="save-btn">Save</button>
                </div>
            </div>`;
        educationForm.insertAdjacentHTML("beforeend", template);
    }

    function addExperienceSection() {
        const workForm = document.querySelector(".work-form");
        const template = `
            <div class="work-entry">
                <div class="form-grid">
                    <div>
                        <label for="company-name">Company Name</label>
                        <input type="text" placeholder="Stripe">
                    </div>
                    <div>
                        <label for="job-title">Title</label>
                        <input type="text" placeholder="ex. Software Engineer">
                    </div>
                </div>
                <div class="form-grid">
                    <div>
                        <label for="start-date">Start</label>
                        <input type="month">
                    </div>
                    <div>
                        <label for="end-date">End</label>
                        <input type="month">
                    </div>
                    <div>
                        <label for="location">Location</label>
                        <input type="text" placeholder="San Francisco, CA">
                    </div>
                </div>
                <div class="form-grid full-width">
                    <label for="responsibilities">Description of Responsibilities</label>
                    <textarea placeholder="Include relevant responsibilities, achievements, contributions, research, etc."></textarea>
                </div>
                <div class="form-actions">
                    <button class="delete-btn">Delete</button>
                    <button class="save-btn">Save</button>
                </div>
            </div>`;
        workForm.insertAdjacentHTML("beforeend", template);
    }

    function addLinkSection() {
        const linkForm = document.querySelector(".link-form");
        const template = `
            <div class="link-entry">
                <div class="form-grid">
                    <div>
                        <label for="link-type">Link Type</label>
                        <select>
                            <option value="Portfolio">Portfolio</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="GitHub">GitHub</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label for="link-url">Link URL</label>
                        <input type="url" placeholder="ex. www.example.com">
                    </div>
                </div>
                <div class="form-actions">
                    <button class="delete-btn">Delete</button>
                    <button class="save-btn">Save</button>
                </div>
            </div>`;
        linkForm.insertAdjacentHTML("beforeend", template);
    }
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
