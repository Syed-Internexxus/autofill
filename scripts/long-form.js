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

    // Function to populate fields with response data
    const populateFields = (data) => {
        // Personal Details
        if (data.personal_details) {
            document.getElementById("first-name").value = data.personal_details.first_name || "";
            document.getElementById("last-name").value = data.personal_details.last_name || "";
            document.getElementById("primary-phone").value = data.personal_details.primary_phone || "";
            document.getElementById("secondary-phone").value = data.personal_details.secondary_phone || "";
            document.getElementById("primary-email").value = data.personal_details.primary_email || "";
            document.getElementById("backup-email").value = data.personal_details.backup_email || "";
            document.getElementById("location").value = data.personal_details.location || "";
        }

        // Education
        if (data.education && Array.isArray(data.education)) {
            data.education.forEach((edu, index) => {
                if (index === 0) {
                    // Populate the first education section
                    document.getElementById("school-name").value = edu.school_name || "";
                    document.getElementById("degree").value = edu.degree || "";
                    document.getElementById("edu-start-date").value = edu.start_date || "";
                    document.getElementById("edu-end-date").value = edu.end_date || "";
                    document.getElementById("gpa").value = edu.gpa || "";
                    document.getElementById("details").value = edu.details || "";
                } else {
                    // Add additional education sections for subsequent entries
                    addEducationSection(edu);
                }
            });
        }

        // Work Experience
        if (data.work_experience && Array.isArray(data.work_experience)) {
            data.work_experience.forEach((exp, index) => {
                if (index === 0) {
                    // Populate the first work experience section
                    document.getElementById("company-name").value = exp.company_name || "";
                    document.getElementById("job-title").value = exp.job_title || "";
                    document.getElementById("start-date").value = exp.start_date || "";
                    document.getElementById("end-date").value = exp.end_date || "";
                    document.getElementById("location").value = exp.location || "";
                    document.getElementById("responsibilities").value = exp.responsibilities || "";
                } else {
                    // Add additional work experience sections for subsequent entries
                    addExperienceSection(exp);
                }
            });
        }

        // Skills
        if (data.skills && Array.isArray(data.skills)) {
            const skillsTagsContainer = document.querySelector(".skills-tags");
            data.skills.forEach((skill) => {
                const skillTag = document.createElement("span");
                skillTag.className = "skill-tag";
                skillTag.textContent = skill;
                skillsTagsContainer.appendChild(skillTag);
            });
        }

        // Links
        if (data.links && Array.isArray(data.links)) {
            data.links.forEach((link) => {
                addLinkSection(link);
            });
        }
    };

    // Helper function to add new education section
    const addEducationSection = (edu) => {
        const template = `
            <div class="form-grid">
                <div>
                    <label for="school-name">School Name</label>
                    <input type="text" placeholder="Stanford University" value="${edu.school_name || ""}">
                </div>
                <div>
                    <label for="degree">Degree</label>
                    <input type="text" placeholder="ex. Bachelors of Science in Biology" value="${edu.degree || ""}">
                </div>
            </div>
            <div class="form-grid">
                <div>
                    <label for="edu-start-date">Start</label>
                    <input type="month" value="${edu.start_date || ""}">
                </div>
                <div>
                    <label for="edu-end-date">End</label>
                    <input type="month" value="${edu.end_date || ""}">
                </div>
                <div>
                    <label for="gpa">GPA</label>
                    <input type="text" placeholder="ex. 4.0" value="${edu.gpa || ""}">
                </div>
            </div>
            <div class="form-grid full-width">
                <label for="details">Details</label>
                <textarea placeholder="Include relevant coursework, honors, achievements, research, etc.">${edu.details || ""}</textarea>
            </div>
        `;
        const educationFormContainer = document.querySelector(".education-form");
        const div = document.createElement("div");
        div.className = "form-grid";
        div.innerHTML = template;
        educationFormContainer.appendChild(div);
    };

    // Helper function to add new work experience section
    const addExperienceSection = (exp) => {
        const template = `
            <div class="form-grid">
                <div>
                    <label for="company-name">Company Name</label>
                    <input type="text" placeholder="Stripe" value="${exp.company_name || ""}">
                </div>
                <div>
                    <label for="job-title">Title</label>
                    <input type="text" placeholder="ex. Software Engineer" value="${exp.job_title || ""}">
                </div>
            </div>
            <div class="form-grid">
                <div>
                    <label for="start-date">Start</label>
                    <input type="month" value="${exp.start_date || ""}">
                </div>
                <div>
                    <label for="end-date">End</label>
                    <input type="month" value="${exp.end_date || ""}">
                </div>
                <div>
                    <label for="location">Location</label>
                    <input type="text" placeholder="San Francisco, CA" value="${exp.location || ""}">
                </div>
            </div>
            <div class="form-grid full-width">
                <label for="responsibilities">Description of Responsibilities</label>
                <textarea placeholder="Include relevant responsibilities, achievements, contributions, research, etc.">${exp.responsibilities || ""}</textarea>
            </div>
        `;
        const workFormContainer = document.querySelector(".work-form");
        const div = document.createElement("div");
        div.className = "form-grid";
        div.innerHTML = template;
        workFormContainer.appendChild(div);
    };

    // Helper function to add a new link section
    const addLinkSection = (link) => {
        const linkFormContainer = document.querySelector(".link-form");
        const template = `
            <div class="form-grid">
                <div>
                    <label for="link-type">Link Type</label>
                    <select>
                        <option value="Portfolio" ${link.type === "Portfolio" ? "selected" : ""}>Portfolio</option>
                        <option value="LinkedIn" ${link.type === "LinkedIn" ? "selected" : ""}>LinkedIn</option>
                        <option value="GitHub" ${link.type === "GitHub" ? "selected" : ""}>GitHub</option>
                        <option value="Other" ${link.type === "Other" ? "selected" : ""}>Other</option>
                    </select>
                </div>
                <div>
                    <label for="link-url">Link URL</label>
                    <input type="url" placeholder="ex. www.mylink.com" value="${link.url || ""}">
                </div>
            </div>
        `;
        const div = document.createElement("div");
        div.className = "form-grid";
        div.innerHTML = template;
        linkFormContainer.appendChild(div);
    };

    // Main logic to populate data on page load
    const resumeData = JSON.parse(sessionStorage.getItem("resumeData"));
    if (resumeData) {
        populateFields(resumeData);
    }
});
