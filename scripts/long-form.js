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

        // Delete entry
        if (target.classList.contains("delete-btn")) {
            const parentEntry = target.closest(".education-entry, .work-entry, .link-entry, .education-form, .work-form, .link-form");
            if (parentEntry) {
                // If it's the base form container (no .entry), just clear fields
                if (parentEntry.classList.contains("education-form") || 
                    parentEntry.classList.contains("work-form") || 
                    parentEntry.classList.contains("link-form")) {
                    clearFormFields(parentEntry);
                } else {
                    // Dynamically added entry
                    parentEntry.remove();
                }
            }
        }

        // Toggle Save/Edit on each section
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

        // Final "Save and Finish" button
        if (target.classList.contains("save-button")) {
            const data = gatherAllData();
            displaySummary(data);
        }
    });

    function clearFormFields(formContainer) {
        const inputs = formContainer.querySelectorAll("input, textarea, select");
        inputs.forEach(input => {
            if (input.tagName.toLowerCase() === 'select') {
                input.selectedIndex = 0;
            } else {
                input.value = "";
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
                    <input type="text" id="work-location" placeholder="San Francisco, CA" value="${exp.location || ""}">
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

    function populateFields(data) {
        // Personal Details
        const firstName = document.getElementById("first-name");
        const lastName = document.getElementById("last-name");
        const primaryPhone = document.getElementById("primary-phone");
        const secondaryPhone = document.getElementById("secondary-phone");
        const primaryEmail = document.getElementById("primary-email");
        const backupEmail = document.getElementById("backup-email");
        const location = document.getElementById("location");

        if (firstName) firstName.value = data["First Name"] || "";
        if (lastName) lastName.value = data["Last Name"] || "";
        if (primaryPhone) primaryPhone.value = data["Contact Number"] || "";
        if (secondaryPhone) secondaryPhone.value = data["Secondary Number"] || "";
        if (primaryEmail) primaryEmail.value = data["Email"] || "";
        if (backupEmail) backupEmail.value = data["Backup Email"] || "";
        if (location) location.value = data["Location"] || "";

        // Education
        const educationData = data["Education"] || [];
        const firstEdu = educationData[0];
        const eduForm = document.querySelector(".education-form");
        if (eduForm) {
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

            // Additional entries if more than one
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
            const workLocation = workForm.querySelector("#work-location");
            const responsibilities = workForm.querySelector("#responsibilities");

            if (firstExp) {
                if (companyName) companyName.value = firstExp.company || "";
                if (jobTitle) jobTitle.value = firstExp.title || "";
                if (workStart) workStart.value = firstExp.start_date || "";
                if (workEnd) workEnd.value = firstExp.end_date || "";
                if (workLocation) workLocation.value = firstExp.location || "";
                if (responsibilities) responsibilities.value = firstExp.description || "";
            }

            // Additional work experiences
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
            const linkTypeSelect = linkForm.querySelector("#link-type");
            const linkUrl = linkForm.querySelector("#link-url");
            const firstLink = linkData[0];
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

    function gatherAllData() {
        const data = {};

        // Personal Information
        data.firstName = document.getElementById("first-name")?.value || "";
        data.lastName = document.getElementById("last-name")?.value || "";
        data.primaryPhone = document.getElementById("primary-phone")?.value || "";
        data.secondaryPhone = document.getElementById("secondary-phone")?.value || "";
        data.primaryEmail = document.getElementById("primary-email")?.value || "";
        data.backupEmail = document.getElementById("backup-email")?.value || "";
        data.location = document.getElementById("location")?.value || "";

        // Education
        data.educations = [];
        const educationForm = document.querySelector(".education-form");
        if (educationForm) {
            const eduEntries = educationForm.querySelectorAll(".education-entry");
            if (eduEntries.length > 0) {
                eduEntries.forEach(entry => {
                    data.educations.push(getEducationDataFromEntry(entry));
                });
            } else {
                data.educations.push(getEducationDataFromEntry(educationForm));
            }
        }

        // Work Experience
        data.experiences = [];
        const workForm = document.querySelector(".work-form");
        if (workForm) {
            const workEntries = workForm.querySelectorAll(".work-entry");
            if (workEntries.length > 0) {
                workEntries.forEach(entry => {
                    data.experiences.push(getWorkDataFromEntry(entry));
                });
            } else {
                data.experiences.push(getWorkDataFromEntry(workForm));
            }
        }

        // Skills
        data.skills = [];
        const skillTags = document.querySelectorAll(".skills-tags .skill-tag");
        skillTags.forEach(tag => {
            const skillName = tag.firstChild?.textContent.trim();
            if (skillName) data.skills.push(skillName);
        });

        // Links
        data.links = [];
        const linkForm = document.querySelector(".link-form");
        if (linkForm) {
            const linkEntries = linkForm.querySelectorAll(".link-entry");
            if (linkEntries.length > 0) {
                linkEntries.forEach(entry => {
                    data.links.push(getLinkDataFromEntry(entry));
                });
            } else {
                data.links.push(getLinkDataFromEntry(linkForm));
            }
        }

        // EEO & Work Authorization
        data.authorized = document.getElementById("authorized-to-work")?.value || "";
        data.requireSponsorship = document.getElementById("require-sponsorship")?.value || "";
        data.genderIdentity = document.getElementById("gender-identity")?.value || "";
        data.preferredPronouns = document.getElementById("preferred-pronouns")?.value || "";
        data.lgbtqia = document.getElementById("lgbtqia")?.value || "";
        data.racialIdentity = document.getElementById("racial-identity")?.value || "";
        data.hispanic = document.getElementById("hispanic")?.value || "";
        data.disability = document.getElementById("disability")?.value || "";
        data.veteranStatus = document.getElementById("veteran-status")?.value || "";

        return data;
    }

    function getEducationDataFromEntry(entry) {
        return {
            school_name: entry.querySelector("input[placeholder='Stanford University']")?.value || "",
            degree: entry.querySelector("input[placeholder='ex. Bachelors of Science in Biology']")?.value || "",
            start_date: entry.querySelectorAll("input[type='month']")[0]?.value || "",
            end_date: entry.querySelectorAll("input[type='month']")[1]?.value || "",
            gpa: entry.querySelector("input[placeholder='ex. 4.0']")?.value || "",
            details: entry.querySelector("textarea")?.value || ""
        };
    }

    function getWorkDataFromEntry(entry) {
        return {
            company: entry.querySelector("input[placeholder='Stripe']")?.value || "",
            title: entry.querySelector("input[placeholder='ex. Software Engineer']")?.value || "",
            start_date: entry.querySelectorAll("input[type='month']")[0]?.value || "",
            end_date: entry.querySelectorAll("input[type='month']")[1]?.value || "",
            location: entry.querySelector("input[placeholder='San Francisco, CA']")?.value || "",
            description: entry.querySelector("textarea")?.value || ""
        };
    }

    function getLinkDataFromEntry(entry) {
        return {
            type: entry.querySelector("select")?.value || "",
            url: entry.querySelector("input[type='url']")?.value || "",
        };
    }

    function displaySummary(data) {
        const profileForm = document.querySelector(".profile-form");
        const summaryView = document.querySelector(".summary-view");
        if (!summaryView || !profileForm) return;
    
        // Add summary-active class to .profile-form to hide everything except summary
        profileForm.classList.add("summary-active");
    
        let html = `
            <h2>Current Information</h2>
            <button class="edit-information">Edit information</button>
            <h3>Personal Information</h3>
            <p><strong>First Name:</strong> ${data.firstName}</p>
            <p><strong>Last Name:</strong> ${data.lastName}</p>
            <p><strong>Primary Phone:</strong> ${data.primaryPhone}</p>
            <p><strong>Secondary Phone:</strong> ${data.secondaryPhone}</p>
            <p><strong>Primary Email:</strong> ${data.primaryEmail}</p>
            <p><strong>Backup Email:</strong> ${data.backupEmail}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            
            <h3>Education Details</h3>
        `;
    
        data.educations.forEach(edu => {
            html += `
                <p><strong>${edu.degree}</strong>, ${edu.school_name}</p>
                <p><em>${edu.start_date} - ${edu.end_date}, GPA: ${edu.gpa}</em></p>
                <p>${edu.details}</p>
            `;
        });
    
        html += `<h3>Work Experience</h3>`;
        data.experiences.forEach(exp => {
            html += `
                <p><strong>${exp.title}</strong>, ${exp.company}</p>
                <p><em>${exp.start_date} - ${exp.end_date}, ${exp.location}</em></p>
                <p>${exp.description}</p>
            `;
        });
    
        html += `<h3>Skills</h3>`;
        html += `<p>${data.skills.join(", ")}</p>`;
    
        html += `<h3>Links</h3>`;
        data.links.forEach(link => {
            html += `<p><strong>${link.type}:</strong> ${link.url}</p>`;
        });
    
        html += `<h3>EEO & Work Authorization</h3>
            <p><strong>Authorized to work in the U.S.:</strong> ${data.authorized}</p>
            <p><strong>Requires Sponsorship:</strong> ${data.requireSponsorship}</p>
            <p><strong>Gender Identity:</strong> ${data.genderIdentity}</p>
            <p><strong>Preferred Pronouns:</strong> ${data.preferredPronouns}</p>
            <p><strong>LGBTQIA+ identity:</strong> ${data.lgbtqia}</p>
            <p><strong>Racial Identity:</strong> ${data.racialIdentity}</p>
            <p><strong>Hispanic:</strong> ${data.hispanic}</p>
            <p><strong>Disability Status:</strong> ${data.disability}</p>
            <p><strong>Veteran Status:</strong> ${data.veteranStatus}</p>
        `;
    
        summaryView.innerHTML = html;
    
        const editButton = summaryView.querySelector(".edit-information");
        editButton.addEventListener("click", () => {
            // Reload the page on clicking edit information
            location.reload();
        });
    }        
});
