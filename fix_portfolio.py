import os
import re

# 1. Update index.html - Remove the huge internal script and base64 string
index_path = 'index.html'
if os.path.exists(index_path):
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the script block at the end (finding <script> after the last glass-card or admin-modal)
    # We'll look for everything between the last admin-modal div and </body>
    new_content = re.sub(r'(<div id="admin-modal".*?</div>)\s*<script.*?</script>\s*</body>', 
                         r'\1\n    <script src="app.js"></script>\n</body>', 
                         content, flags=re.DOTALL)
    
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Cleaned up index.html and removed internal scripts.")

# 2. Write the ROBUST app.js (V7)
js_content = r'''
// Firebase Configuration Placeholder
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (Conditional)
let db, storage;
try {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        storage = firebase.storage();
        console.log("Firebase initialized successfully");
    } else {
        console.warn("Firebase configuration missing. Running in Local Mode.");
    }
} catch (e) {
    console.error("Firebase initialization failed:", e);
}

const DEFAULT_DATA = {
    profile: {
        name: "DR. SHAKIR PARVEJ",
        title: "ICU & EMERGENCY PHYSICIAN | HEALTHCARE AI ENTHUSIAST",
        location: "Noida Sector 62, 202010 | Ramsar 305402",
        bio: "Forward-thinking medical professional (MBBS, GMC Kota) with hands-on clinical experience in intensive care and emergency medicine across both public and private sector hospitals. Deeply passionate about the intersection of pathology, clinical care, and artificial intelligence. Proficient in Python and Rust, with a strategic vision to integrate advanced technology, data analytics, and programming into modern diagnostics and patient care.",
        photo: "./portrait.jpg",
        education: "MBBS, GMC Kota, India (Graduated: July 2023)",
        languages: "English, Hindi, Urdu, Arabic"
    },
    experience: [
        { id: 1, year: "Nov 2025 - Present", role: "Lead Associate Medical Trainer", company: "Innodata Inc. | Kota", desc: "Lead and train cross-functional teams on complex data annotation and AI tasks tailored for the medical domain." },
        { id: 2, year: "July 2025 - Present", role: "Founder", company: "MedicMart | Kota", desc: "Spearhead the development and implementation of a new healthcare initiative." },
        { id: 3, year: "July 2025 - Dec 2025", role: "Duty Doctor", company: "Sri Ram Hospital | Jhalawar", desc: "Provided emergency medical care and managed patient flows." },
        { id: 4, year: "July 2024 - Jan 2025", role: "ICU Resident", company: "Govind Hospital | Rajgarh", desc: "Delivered critical care for ICU patients." },
        { id: 5, year: "March 2023 - March 2024", role: "Medical Intern", company: "MBS Hospital Kota", desc: "Completed comprehensive clinical rotations, assisting in diverse medical procedures." }
    ],
    competencies: [
        { id: 1, icon: "heart-pulse", category: "Clinical Skills", items: "ICU & Emergency Care, Intubation, Central Line, General OPD" },
        { id: 2, icon: "activity", category: "Healthcare IT", items: "Pharmacovigilance, Data Analytics, Medical AI Annotation, FHIR" },
        { id: 3, icon: "database", category: "Technical Skills", items: "Rust, Python, Data Systems, Web Development" }
    ],
    software: [
        { level: "Advanced", tools: "ICD-11, SNOMED, LOINC" },
        { level: "Upper Intermediate", tools: "Medidata Rave EDC, ArisGlobal Lifesphere, FHIR" },
        { level: "Intermediate", tools: "Rust, Python, Veeva Vault RIM" }
    ],
    certificates: [],
    interests: ["Avid Bird Watcher", "Bird Painting", "Nature Enthusiast", "Medical Ethics"],
    contact: {
        email: "acadmiana@gmail.com",
        phone: "+91 77 2793 0382",
        whatsapp: "https://wa.me/917727930382",
        linkedin: "https://linkedin.com",
        website: "https://medexjob.com"
    }
};

// V7 State Migration
let state;
const VERSION = 'shakir_portfolio_v7';
const oldState = localStorage.getItem(VERSION);

if (oldState) {
    try {
        state = JSON.parse(oldState);
    } catch (e) {
        state = DEFAULT_DATA;
    }
} else {
    state = DEFAULT_DATA;
    localStorage.setItem(VERSION, JSON.stringify(state));
}

// Safety Helpers
const safeSetText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val || '';
};

const safeSetHTML = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val || '';
};

const safeSetSrc = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.src = val || './portrait.jpg';
};

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(() => { 
            loader.style.display = 'none';
            console.log("Loader hidden successfully.");
        }, 800);
    }
}

function render() {
    try {
        console.log("Starting render V7...");
        document.title = `${state.profile.name} | Portfolio`;
        
        // Hero
        const nameParts = (state.profile.name || "SHAKIR PARVEJ").split(' ');
        const firstPart = nameParts.slice(0, 2).join(' ');
        const secondPart = nameParts.slice(2).join(' ');
        safeSetHTML('hero-name', `${firstPart} <br> <span class="gradient-text">${secondPart}.</span>`);
        safeSetText('hero-title-desc', state.profile.title);
        safeSetText('hero-location', state.profile.location);
        safeSetSrc('profile-img', state.profile.photo);

        // About
        safeSetText('about-bio', state.profile.bio);
        safeSetText('about-edu', state.profile.education);
        safeSetText('about-lang', state.profile.languages);

        // Sections
        const renderList = (id, list, mapper) => {
            const el = document.getElementById(id);
            if (el && list) el.innerHTML = list.map(mapper).join('');
        };

        renderList('experience-list', state.experience, exp => `
            <div class="relative pl-12 timeline-item group pb-12">
                <div class="absolute left-[20px] top-1.5 w-5 h-5 rounded-full border-2 border-cyan-500 bg-[#0a0a0a] z-20 group-hover:bg-cyan-500 transition-colors"></div>
                <div class="space-y-1">
                    <span class="text-xs font-bold text-cyan-400 uppercase font-display">${exp.year}</span>
                    <h4 class="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">${exp.role}</h4>
                    <p class="text-sm font-medium text-gray-300">${exp.company}</p>
                    <p class="text-sm text-gray-500 leading-relaxed font-light">${exp.desc}</p>
                </div>
            </div>
        `);

        renderList('competencies-grid', state.competencies, comp => `
            <div class="glass-card p-8 rounded-3xl space-y-4 hover:border-cyan-500/40 transition-all group">
                <div class="flex justify-between items-center">
                    <h4 class="text-xl font-bold">${comp.category}</h4>
                    <div class="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-cyan-500/30 transition-all">
                        <i data-lucide="${comp.icon}" class="h-5 w-5 text-gray-400 group-hover:text-cyan-400"></i>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${(comp.items || "").split(',').map(item => `<span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-400">${item.trim()}</span>`).join('')}
                </div>
            </div>
        `);

        renderList('software-grid', state.software, soft => `
            <div class="glass-card p-8 rounded-3xl space-y-4">
                <h5 class="text-cyan-400 font-bold text-xs uppercase tracking-widest">${soft.level}</h5>
                <div class="space-y-2">
                    ${(soft.tools || "").split(',').map(tool => `<div class="flex items-center space-x-2"><i data-lucide="check" class="h-3 w-3 text-cyan-500"></i><span class="text-sm text-gray-300 font-medium">${tool.trim()}</span></div>`).join('')}
                </div>
            </div>
        `);

        // Interests
        renderList('interests-grid', state.interests, interest => `
            <span class="px-4 py-2 glass-card rounded-full text-xs font-medium text-gray-400">${interest}</span>
        `);

        // Contact
        safeSetText('contact-email', state.contact.email);
        safeSetText('contact-phone', state.contact.phone);
        const contactWA = document.getElementById('contact-whatsapp-link');
        if (contactWA) contactWA.href = state.contact.whatsapp;

        if (window.lucide) lucide.createIcons();
        console.log("Render V7 complete.");
    } catch (e) {
        console.error("Render failed but continuing:", e);
    } finally {
        hideLoader();
    }
}

// Global safety timeout (Increased to 5s to be safe)
setTimeout(() => {
    console.log("Global safety timeout - forcing loader hide.");
    hideLoader();
}, 5000);

// Admin Controls
window.openAdmin = () => document.getElementById('admin-modal').classList.remove('hidden');
window.closeAdmin = () => document.getElementById('admin-modal').classList.add('hidden');
window.verifyAuth = () => {
    const pwd = document.getElementById('admin-password').value;
    if (pwd === 'Ramsar@305402') {
        document.getElementById('admin-auth').classList.add('hidden');
        document.getElementById('admin-editor').classList.remove('hidden');
        populateFields();
    } else {
        alert('Invalid Password');
    }
};

function populateFields() {
    document.getElementById('edit-name').value = state.profile.name;
    document.getElementById('edit-title').value = state.profile.title;
    document.getElementById('edit-bio').value = state.profile.bio;
    document.getElementById('edit-location').value = state.profile.location || '';
    document.getElementById('edit-edu').value = state.profile.education || '';
    document.getElementById('edit-lang').value = state.profile.languages || '';
    document.getElementById('edit-email').value = state.contact.email;
    document.getElementById('edit-phone').value = state.contact.phone;
    document.getElementById('edit-experience').value = JSON.stringify(state.experience, null, 2);
    document.getElementById('edit-competencies').value = JSON.stringify(state.competencies, null, 2);
    document.getElementById('edit-software').value = JSON.stringify(state.software, null, 2);
    document.getElementById('edit-interests').value = JSON.stringify(state.interests, null, 2);
}

window.saveChanges = () => {
    try {
        state.profile.name = document.getElementById('edit-name').value;
        state.profile.title = document.getElementById('edit-title').value;
        state.profile.bio = document.getElementById('edit-bio').value;
        state.profile.location = document.getElementById('edit-location').value;
        state.profile.education = document.getElementById('edit-edu').value;
        state.profile.languages = document.getElementById('edit-lang').value;
        state.contact.email = document.getElementById('edit-email').value;
        state.contact.phone = document.getElementById('edit-phone').value;
        state.experience = JSON.parse(document.getElementById('edit-experience').value);
        state.competencies = JSON.parse(document.getElementById('edit-competencies').value);
        state.software = JSON.parse(document.getElementById('edit-software').value);
        state.interests = JSON.parse(document.getElementById('edit-interests').value);
        
        localStorage.setItem(VERSION, JSON.stringify(state));
        render();
        alert('Saved locally!');
        closeAdmin();
    } catch (e) {
        alert('Invalid data format!');
    }
};

// Initial Events
document.addEventListener('DOMContentLoaded', () => {
    render();
    
    // Logo Click for Admin
    const logo = document.getElementById('logo');
    let logoClicks = 0;
    if (logo) {
        logo.onclick = (e) => {
            e.preventDefault();
            logoClicks++;
            if (logoClicks >= 3) { openAdmin(); logoClicks = 0; }
            setTimeout(() => { logoClicks = 0; }, 2000);
        };
    }
    
    const adminTrigger = document.getElementById('admin-trigger');
    if (adminTrigger) adminTrigger.onclick = openAdmin;
});
'''

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js_content.strip())
print("Wrote robust app.js (V7).")
