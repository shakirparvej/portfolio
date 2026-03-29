/**
 * Dr. Shakir Parvej | Premium Portfolio Engine V8
 * Optimized for Mobile Responsiveness & Firebase Realtime-Sync
 */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

// State Versioning
const VERSION = 'shakir_portfolio_v8';
const DEFAULT_DATA = {
    profile: {
        name: "DR. SHAKIR PARVEJ",
        title: "ICU & EMERGENCY PHYSICIAN | HEALTHCARE AI ARCHITECT",
        location: "Noida Sector 62 | Rajasthan",
        bio: "Forward-thinking medical professional with hands-on clinical experience in intensive care. Deeply passionate about the intersection of pathology, clinical care, and artificial intelligence. Proficient in Python and Rust, building the future of diagnostics.",
        photo: "./portrait.jpg",
        education: "MBBS, GMC Kota, India (2023)",
        languages: "English, Hindi, Urdu, Arabic"
    },
    experience: [
        { id: 1, year: "Nov 2025 - Present", role: "Lead Associate Medical Trainer", company: "Innodata Inc.", desc: "Leading medical AI annotation and training teams." },
        { id: 2, year: "July 2025 - Present", role: "Founder", company: "MedicMart", desc: "Spearheading a new healthcare commerce initiative." },
        { id: 3, year: "July 2024 - Jan 2025", role: "ICU Resident", company: "Govind Hospital", desc: "Critical care management for ICU patients." }
    ],
    competencies: [
        { id: 1, icon: "activity", category: "Clinical", items: "Intubation, Central Line, ICU Care" },
        { id: 2, icon: "database", category: "Technical", items: "Rust, Python, Medical AI" }
    ],
    software: [
        { level: "Advanced", tools: "ICD-11, SNOMED, LOINC" },
        { level: "Intermediate", tools: "Medidata, FHIR, Python" }
    ],
    interests: ["Bird Watching", "Medical Ethics", "AI Research"],
    contact: {
        email: "acadmiana@gmail.com",
        phone: "+91 77 2793 0382",
        whatsapp: "https://wa.me/917727930382"
    }
};

let state = DEFAULT_DATA;
let db, storage;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    loadState();
    
    // Page Detection
    const isAdminPage = window.location.pathname.includes('admin.html');
    if (isAdminPage) {
        initAdmin();
    } else {
        renderMain();
    }
});

function initFirebase() {
    try {
        if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            storage = firebase.storage();
            console.log("Firebase Active");
        }
    } catch (e) { console.error("Firebase Error:", e); }
}

async function loadState() {
    // 1. Local Load
    const local = localStorage.getItem(VERSION);
    if (local) state = JSON.parse(local);

    // 2. Cloud Fallback/Sync
    if (db) {
        try {
            const doc = await db.collection('portfolio').doc('main').get();
            if (doc.exists) {
                state = doc.data();
                localStorage.setItem(VERSION, JSON.stringify(state));
                if (!window.location.pathname.includes('admin.html')) renderMain();
            }
        } catch (e) { console.warn("Cloud Sync Offline"); }
    }
}

// --- Main Content Rendering (index.html) ---
function renderMain() {
    const safeSet = (id, val, attr = 'innerText') => {
        const el = document.getElementById(id);
        if (el) el[attr] = val || '';
    };

    // Hero Refinement
    const nameParts = (state.profile.name || "").split(' ');
    const first = nameParts.slice(0, 2).join(' ');
    const second = nameParts.slice(2).join(' ');
    const heroName = document.getElementById('hero-name');
    if (heroName) heroName.innerHTML = `${first} <br> <span class="gradient-text">${second}.</span>`;

    safeSet('hero-title-desc', state.profile.title);
    safeSet('hero-location', state.profile.location);
    safeSet('profile-img', state.profile.photo, 'src');

    // Stats/About
    safeSet('about-bio', state.profile.bio);
    safeSet('about-edu', state.profile.education);
    safeSet('about-lang', state.profile.languages);

    // Lists
    const inject = (id, list, htmlFn) => {
        const el = document.getElementById(id);
        if (el && list) el.innerHTML = list.map(htmlFn).join('');
    };

    inject('experience-list', state.experience, exp => `
        <div class="relative pl-10 pb-10 group">
            <div class="absolute left-[-2px] top-1.5 w-3 h-3 rounded-full border border-cyan-500 bg-[#050505] z-10 group-hover:bg-cyan-500 transition-colors"></div>
            <p class="text-[10px] font-bold text-cyan-500/60 uppercase tracking-widest">${exp.year}</p>
            <h4 class="text-xl font-bold group-hover:text-cyan-400 transition-colors">${exp.role}</h4>
            <p class="text-xs text-gray-500 font-medium">${exp.company}</p>
            <p class="text-xs text-gray-500 mt-2 font-light leading-relaxed">${exp.desc}</p>
        </div>
    `);

    inject('competencies-grid', state.competencies, comp => `
        <div class="glass-card p-6 rounded-2xl group">
            <div class="flex items-center space-x-3 mb-4">
                <div class="text-cyan-400"><i data-lucide="${comp.icon}" class="h-4 w-4"></i></div>
                <h4 class="text-sm font-bold uppercase tracking-widest">${comp.category}</h4>
            </div>
            <div class="flex flex-wrap gap-2">
                ${comp.items.split(',').map(i => `<span class="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] text-gray-400">${i.trim()}</span>`).join('')}
            </div>
        </div>
    `);

    inject('software-grid', state.software, soft => `
        <div class="glass-card p-6 rounded-2xl space-y-2">
            <p class="text-[10px] font-bold text-purple-400 uppercase tracking-widest">${soft.level}</p>
            <div class="flex flex-wrap gap-2 text-xs text-gray-400">
                ${soft.tools.split(',').map(t => `<span class="flex items-center"><i data-lucide="check" class="h-3 w-3 mr-1 text-cyan-500"></i>${t.trim()}</span>`).join(' ')}
            </div>
        </div>
    `);

    inject('interests-grid', state.interests, int => `
        <span class="px-3 py-1 glass-card rounded-full text-[10px] text-gray-500">${int}</span>
    `);

    // Contact
    safeSet('contact-email', state.contact.email);
    safeSet('contact-phone', state.contact.phone);
    const waLink = document.getElementById('contact-whatsapp-link');
    if (waLink) waLink.href = state.contact.whatsapp;

    if (window.lucide) lucide.createIcons();
    hideLoader();
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }
}

// --- Admin Console Logic (admin.html) ---
window.verifyAuth = () => {
    const pwd = document.getElementById('admin-password').value;
    if (pwd === 'Ramsar@305402') {
        document.getElementById('admin-auth').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        populateAdminFields();
    } else {
        alert("Authorization Failed.");
    }
};

function populateAdminFields() {
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    };

    setVal('edit-name', state.profile.name);
    setVal('edit-title', state.profile.title);
    setVal('edit-bio', state.profile.bio);
    setVal('edit-location', state.profile.location);
    setVal('edit-edu', state.profile.education);
    setVal('edit-lang', state.profile.languages);
    setVal('edit-email', state.contact.email);
    setVal('edit-phone', state.contact.phone);

    setVal('edit-experience', JSON.stringify(state.experience, null, 2));
    setVal('edit-competencies', JSON.stringify(state.competencies, null, 2));
    setVal('edit-software', JSON.stringify(state.software, null, 2));
    
    const preview = document.getElementById('admin-profile-preview');
    if (preview) preview.src = state.profile.photo;

    // File Upload Handler
    const fileIn = document.getElementById('photo-upload');
    if (fileIn) {
        fileIn.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (storage) {
                try {
                    const ref = storage.ref().child(`profile/${Date.now()}_${file.name}`);
                    await ref.put(file);
                    state.profile.photo = await ref.getDownloadURL();
                    document.getElementById('admin-profile-preview').src = state.profile.photo;
                    alert("Photo Uploaded to Cloud!");
                } catch (e) { alert("Upload Failed: Connect Firebase Storage."); }
            } else {
                // Local Preview Fallback
                const reader = new FileReader();
                reader.onload = (re) => {
                    state.profile.photo = re.target.result;
                    document.getElementById('admin-profile-preview').src = re.target.result;
                };
                reader.readAsDataURL(file);
                alert("Preview generated. Save to persist locally.");
            }
        };
    }
}

window.saveChanges = async () => {
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

        localStorage.setItem(VERSION, JSON.stringify(state));

        if (db) {
            await db.collection('portfolio').doc('main').set(state);
            alert("Success: Synced with Cloud & LocalStorage.");
        } else {
            alert("Saved: Using LocalStorage (Cloud offline).");
        }
    } catch (e) {
        alert("Format Error: Ensure JSON sections are valid.");
        console.error(e);
    }
};

// Safety Timeout
setTimeout(() => { if (!window.location.pathname.includes('admin.html')) hideLoader(); }, 5000);