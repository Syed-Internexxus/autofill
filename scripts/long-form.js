document.addEventListener("DOMContentLoaded", async function () {
    // ===== FIREBASE CONFIGURATION START =====
    // Firebase Imports
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
    const { getAuth, GoogleAuthProvider } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js");
    const { getFirestore, collection, addDoc, doc, setDoc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js");

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDyIZIJr1uoGlIgauMTqLGiYDWXKzdu1L4",
        authDomain: "autofill-4da48.firebaseapp.com",
        projectId: "autofill-4da48",
        storageBucket: "autofill-4da48.firebasestorage.app",
        messagingSenderId: "206724954770",
        appId: "1:206724954770:web:45e0249242cfac6e49844b",
        measurementId: "G-7CQTP9NR81",
    };

    // Initialize Firebase App and Services
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();
    const db = getFirestore(app);
    // ===== FIREBASE CONFIGURATION END =====

    const populateFieldsFromFirestore = async (userId) => {
        try {
            const docSnap = await getDoc(doc(db, "profiles", userId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                sessionStorage.setItem("resumeData", JSON.stringify(data));
                console.log(data);
                populateFields(data);
            } else {
                console.warn("No user data found in Firestore for user:", userId);
                // User logged in but no data yet, fields remain blank until saved
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser?.uid) {
        // User is logged in, fetch their data from Firestore
        await populateFieldsFromFirestore(currentUser.uid);
    } else {
        // If user is not logged in, check if resumeData is in sessionStorage
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
    }

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

    document.body.addEventListener("click", async (event) => {
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
                if (parentEntry.classList.contains("education-form") ||
                    parentEntry.classList.contains("work-form") ||
                    parentEntry.classList.contains("link-form")) {
                    clearFormFields(parentEntry);
                } else {
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
        const extensionid = "gaojnnafdnhekfefcaifdajamcdnjkck";
        // Final "Save and Finish" button handler
        if (target.classList.contains("save-button")) {
            const data = gatherAllData();
            
            const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
            let docRef;

            try {
                if (currentUser && currentUser.uid) {
                    // User is logged in. Use setDoc with their uid to create/update doc
                    docRef = doc(db, "profiles", currentUser.uid);
                    await setDoc(docRef, data, { merge: true });
                    console.log("Document successfully written/updated for user:", currentUser.uid);
                } else {
                    // No user logged in, add a new doc
                    docRef = await addDoc(collection(db, "profiles"), data);
                    console.log("Document successfully written to Firestore!");
                }
                
                // After writing data to Firestore, read it back
                // If docRef is a DocumentReference (from setDoc), we have it directly
                // If docRef is from addDoc, docRef is returned by addDoc and is a DocumentReference
                const docSnap = await getDoc(docRef instanceof Function ? docRef() : docRef);
                if (docSnap.exists()) {
                    const savedData = docSnap.data();
                    console.log("Retrieved data from Firestore:", savedData);
                    
                    // Send message to extension with the updated data
                    chrome.runtime.sendMessage(extensionid, { 
                        action: "dataUpdated", 
                        payload: savedData 
                    }, (response) => {
                        console.log("Extension notified:", response);
                    });
                }
            } catch (e) {
                console.error("Error adding/updating document to Firestore: ", e);
            }

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
        // Helper function to safely retrieve values from either old or new keys
        const getVal = (oldKey, newKey) => data[oldKey] || data[newKey] || "";
    
        const firstName = document.getElementById("first-name");
        const lastName = document.getElementById("last-name");
        const primaryPhone = document.getElementById("primary-phone");
        const secondaryPhone = document.getElementById("secondary-phone");
        const primaryEmail = document.getElementById("primary-email");
        const backupEmail = document.getElementById("backup-email");
        const location = document.getElementById("location");
    
        if (firstName) firstName.value = getVal("First Name", "firstName");
        if (lastName) lastName.value = getVal("Last Name", "lastName");
        if (primaryPhone) primaryPhone.value = getVal("Contact Number", "primaryPhone");
        if (secondaryPhone) secondaryPhone.value = getVal("Secondary Number", "secondaryPhone");
        if (primaryEmail) primaryEmail.value = getVal("Email", "primaryEmail");
        if (backupEmail) backupEmail.value = getVal("Backup Email", "backupEmail");
        if (location) location.value = getVal("Location", "location");
    
        // Handle Education
        const educationData = data["Education"] || data["educations"] || [];
        const firstEdu = educationData[0];
        const eduForm = document.querySelector(".education-form");
        if (eduForm && firstEdu) {
            const schoolName = eduForm.querySelector("#school-name");
            const degree = eduForm.querySelector("#degree");
            const eduStart = eduForm.querySelector("#edu-start-date");
            const eduEnd = eduForm.querySelector("#edu-end-date");
            const gpa = eduForm.querySelector("#gpa");
            const details = eduForm.querySelector("#details");
    
            if (schoolName) schoolName.value = firstEdu.school_name || "";
            if (degree) degree.value = firstEdu.degree || "";
            if (eduStart) eduStart.value = firstEdu.start_date || "";
            if (eduEnd) eduEnd.value = firstEdu.end_date || "";
            if (gpa) gpa.value = firstEdu.gpa || "";
            if (details) details.value = firstEdu.details || "";
    
            for (let i = 1; i < educationData.length; i++) {
                addEducationSection(educationData[i]);
            }
        }
    
        // Handle Experience
        const experienceData = data["experience"] || data["experiences"] || [];
        const firstExp = experienceData[0];
        const workForm = document.querySelector(".work-form");
        if (workForm && firstExp) {
            const companyName = workForm.querySelector("#company-name");
            const jobTitle = workForm.querySelector("#job-title");
            const workStart = workForm.querySelector("#start-date");
            const workEnd = workForm.querySelector("#end-date");
            const workLocation = workForm.querySelector("#work-location");
            const responsibilities = workForm.querySelector("#responsibilities");
    
            if (companyName) companyName.value = firstExp.company || "";
            if (jobTitle) jobTitle.value = firstExp.title || "";
            if (workStart) workStart.value = firstExp.start_date || "";
            if (workEnd) workEnd.value = firstExp.end_date || "";
            if (workLocation) workLocation.value = firstExp.location || "";
            if (responsibilities) responsibilities.value = firstExp.description || "";
    
            for (let i = 1; i < experienceData.length; i++) {
                addExperienceSection(experienceData[i]);
            }
        }
    
        // Handle Skills
        const coreSkills = data["core_skills"] || data["skills"];
        if (coreSkills) {
            const skillArray = Array.isArray(coreSkills) ? coreSkills : coreSkills.split(",").map(s => s.trim());
            skillArray.forEach((skill) => addSkillTag(skill));
        }
    
        // Handle Links
        const linkData = data["Links"] || data["links"] || [];
        const linkForm = document.querySelector(".link-form");
        if (linkForm && linkData.length > 0) {
            const linkTypeSelect = linkForm.querySelector("#link-type");
            const linkUrl = linkForm.querySelector("#link-url");
            const firstLink = linkData[0];
            if (firstLink) {
                if (linkTypeSelect) linkTypeSelect.value = firstLink.type || "";
                if (linkUrl) linkUrl.value = firstLink.url || "";
            }
    
            for (let i = 1; i < linkData.length; i++) {
                addLinkSection(linkData[i]);
            }
        }
    
        // EEO & Work Authorization
        const eeoFields = [
            {id: "authorized-to-work", oldKey: "Authorized to Work", newKey: "authorized"},
            {id: "require-sponsorship", oldKey: "Require Sponsorship", newKey: "requireSponsorship"},
            {id: "gender-identity", oldKey: "Gender Identity", newKey: "genderIdentity"},
            {id: "preferred-pronouns", oldKey: "Preferred Pronouns", newKey: "preferredPronouns"},
            {id: "lgbtqia", oldKey: "LGBTQIA", newKey: "lgbtqia"},
            {id: "racial-identity", oldKey: "Racial Identity", newKey: "racialIdentity"},
            {id: "hispanic", oldKey: "Hispanic", newKey: "hispanic"},
            {id: "disability", oldKey: "Disability", newKey: "disability"},
            {id: "veteran-status", oldKey: "Veteran Status", newKey: "veteranStatus"}
        ];
    
        eeoFields.forEach(field => {
            const elem = document.getElementById(field.id);
            if (elem) elem.value = data[field.oldKey] || data[field.newKey] || "";
        });
    }
    

    function gatherAllData() {
        const data = {};

        data.firstName = document.getElementById("first-name")?.value || "";
        data.lastName = document.getElementById("last-name")?.value || "";
        data.primaryPhone = document.getElementById("primary-phone")?.value || "";
        data.secondaryPhone = document.getElementById("secondary-phone")?.value || "";
        data.primaryEmail = document.getElementById("primary-email")?.value || "";
        data.backupEmail = document.getElementById("backup-email")?.value || "";
        data.location = document.getElementById("location")?.value || "";

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

        data.skills = [];
        const skillTags = document.querySelectorAll(".skills-tags .skill-tag");
        skillTags.forEach(tag => {
            const skillName = tag.firstChild?.textContent.trim();
            if (skillName) data.skills.push(skillName);
        });

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

        profileForm.classList.add("summary-active");

        let html = `
            <p1>🎉 Review your information below. Click 'Edit information' to make changes. You can now return to the plugin to start autofilling jobs. 🎉</p1>
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
        summaryView.style.display = "block";

        const editButton = summaryView.querySelector(".edit-information");
        editButton.addEventListener("click", () => {
            location.reload();
        });
    }
});
