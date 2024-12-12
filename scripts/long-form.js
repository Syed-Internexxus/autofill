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
        removeButton.style.background = "none";
        removeButton.style.border = "none";
        removeButton.style.color = "#fff";
        removeButton.style.cursor = "pointer";
        removeButton.style.marginLeft = "8px";
        removeButton.addEventListener("click", () => {
            skillsTagsContainer.removeChild(tag);
        });

        tag.appendChild(removeButton);
        skillsTagsContainer.appendChild(tag);
    }

    // Add functionality for Add, Save/Edit, and Delete buttons in Education, Work, and Links sections
    document.body.addEventListener("click", (event) => {
        const target = event.target;

        // Add new education entry
        if (target.classList.contains("add-education-btn")) {
            const educationForm = document.querySelector(".education-form");
            const newForm = document.createElement("div");
            newForm.classList.add("education-entry");
            newForm.innerHTML = `
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
            `;
            educationForm.appendChild(newForm);
        }

        // Add new work experience entry
        if (target.classList.contains("add-experience-btn")) {
            const workForm = document.querySelector(".work-form");
            const newForm = document.createElement("div");
            newForm.classList.add("work-entry");
            newForm.innerHTML = `
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
            `;
            workForm.appendChild(newForm);
        }

        // Add new link entry
        if (target.classList.contains("add-link-btn")) {
            const linkForm = document.querySelector(".link-form");
            const newForm = document.createElement("div");
            newForm.classList.add("link-entry");
            newForm.innerHTML = `
                <div class="form-grid">
                    <div>
                        <label for="link-type">Link Type</label>
                        <select>
                            <option value="" disabled selected>Select an option...</option>
                            <option value="Portfolio">Portfolio</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="GitHub">GitHub</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label for="link-url">Link URL</label>
                        <input type="url" placeholder="ex. www.mylink.com">
                    </div>
                </div>
                <div class="form-actions">
                    <button class="delete-btn">Delete</button>
                    <button class="save-btn">Save</button>
                </div>
            `;
            linkForm.appendChild(newForm);
        }

        // Delete entry
        if (target.classList.contains("delete-btn")) {
            const parentForm = target.closest(".education-entry, .work-entry, .link-entry");
            if (parentForm) {
                parentForm.remove();
                ensureAddButtonVisibility();
            }
        }

        // Save/Edit entry
        if (target.classList.contains("save-btn")) {
            const parentForm = target.closest(".education-entry, .work-entry, .link-entry");
            if (parentForm) {
                const inputs = parentForm.querySelectorAll("input, textarea, select");
                if (target.textContent === "Save") {
                    inputs.forEach((input) => input.setAttribute("disabled", true));
                    target.textContent = "Edit";
                } else {
                    inputs.forEach((input) => input.removeAttribute("disabled"));
                    target.textContent = "Save";
                }
            }
        }
    });

    // Ensure Add button remains visible even when all forms are deleted
    function ensureAddButtonVisibility() {
        [".education-form", ".work-form", ".link-form"].forEach((selector) => {
            const forms = document.querySelector(selector);
            if (!forms.children.length) {
                const addButton = document.querySelector(`.add-${selector.split("-")[1]}-btn`);
                if (addButton) addButton.style.display = "block";
            }
        });
    }
});
