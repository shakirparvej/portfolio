import os

# Prepare the JS content for the optimized app.js
js_content = r'''
// Firebase Configuration Placeholder
// REPLACE with your actual config from Firebase Console
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
if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();
    console.log("Firebase Initialized");
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
        { id: 1, year: "Nov 2025 - Present", role: "Lead Associate Medical Trainer", company: "Innodata Inc. | Kota", desc: "Lead and train cross-functional teams on complex data annotation and AI tasks tailored for the medical domain. Ensure high accuracy and compliance with medical standards." },
        { id: 2, year: "July 2025 - Present", role: "Founder", company: "MedicMart | Kota", desc: "Spearhead the development and implementation of a new healthcare initiative. Oversee project management and operational workflows." },
        { id: 3, year: "July 2025 - Dec 2025", role: "Duty Doctor", company: "Sri Ram Hospital | Jhalawar", desc: "Provided emergency medical care and managed patient flows. Conducted General OPD consultations." },
        { id: 4, year: "July 2024 - Jan 2025", role: "ICU Resident", company: "Govind Hospital | Rajgarh", desc: "Delivered critical care for ICU patients. Conducted thorough clinical assessments to improve outcomes." },
        { id: 5, year: "March 2023 - March 2024", role: "Medical Intern", company: "MBS Hospital Kota", desc: "Completed comprehensive clinical rotations, assisting in diverse medical procedures and emergency responses." }
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
    certificates: [
        { name: "Medical AI Ethics Certificate", issuer: "Coursera/Stanford" },
        { name: "Advanced Trauma Life Support", issuer: "AHA" }
    ],
    interests: ["Avid Bird Watcher", "Bird Painting", "Nature Enthusiast", "Medical Ethics"],
    contact: {
        email: "acadmiana@gmail.com",
        phone: "+91 77 2793 0382",
        whatsapp: "https://wa.me/917727930382",
        linkedin: "https://linkedin.com",
        website: "https://medexjob.com"
    }
};

let state = JSON.parse(localStorage.getItem('shakir_portfolio_v5')) || DEFAULT_DATA;

function saveStateToLocal() {
    localStorage.setItem('shakir_portfolio_v5', JSON.stringify(state));
    
    // Sync to Firebase if cloud is ready
    if (db) {
        db.collection('portfolios').doc('shakir').set(state)
            .then(() => console.log("Cloud Sync Successful"))
            .catch(e => console.error("Cloud Sync Error", e));
    }
}

async function loadFromCloud() {
    if (db) {
        try {
            const doc = await db.collection('portfolios').doc('shakir').get();
            if (doc.exists) {
                state = doc.data();
                render();
            }
        } catch (e) {
            console.error("Error loading from cloud", e);
        }
    }
}

function render() {
    document.title = `${state.profile.name} | Portfolio`;
    document.getElementById('hero-name').innerHTML = `${state.profile.name.split(' ').slice(0,2).join(' ')} <br> <span class="gradient-text">${state.profile.name.split(' ').slice(2).join(' ')}.</span>`;
    document.getElementById('hero-title-desc').innerText = state.profile.title;
    document.getElementById('hero-location').innerText = state.profile.location;
    document.getElementById('profile-img').src = state.profile.photo;

    document.getElementById('about-bio').innerText = state.profile.bio;
    document.getElementById('about-edu').innerText = state.profile.education;
    document.getElementById('about-lang').innerText = state.profile.languages;

    const expList = document.getElementById('experience-list');
    expList.innerHTML = state.experience.map(exp => `
        <div class="relative pl-12 timeline-item group pb-12">
            <div class="absolute left-[20px] top-1.5 w-5 h-5 rounded-full border-2 border-cyan-500 bg-[#0a0a0a] z-20 group-hover:bg-cyan-500 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            <div class="space-y-1">
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest font-display">${exp.year}</span>
                <h4 class="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">${exp.role}</h4>
                <p class="text-sm font-medium text-gray-300">${exp.company}</p>
                <p class="text-sm text-gray-500 leading-relaxed font-light">${exp.desc}</p>
            </div>
        </div>
    `).join('');

    const compGrid = document.getElementById('competencies-grid');
    compGrid.innerHTML = state.competencies.map(comp => `
        <div class="glass-card p-8 rounded-3xl space-y-4 hover:border-cyan-500/40 transition-all group">
            <div class="flex justify-between items-center">
                <h4 class="text-xl font-bold">${comp.category}</h4>
                <div class="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-cyan-500/30 transition-all">
                    <i data-lucide="${comp.icon}" class="h-5 w-5 text-gray-400 group-hover:text-cyan-400"></i>
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                ${comp.items.split(',').map(item => `
                    <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-400">
                        ${item.trim()}
                    </span>
                `).join('')}
            </div>
        </div>
    `).join('');

    const softGrid = document.getElementById('software-grid');
    softGrid.innerHTML = state.software.map(soft => `
        <div class="glass-card p-8 rounded-3xl space-y-4">
            <h5 class="text-cyan-400 font-bold text-xs uppercase tracking-widest">${soft.level}</h5>
            <div class="space-y-2">
                ${soft.tools.split(',').map(tool => `
                    <div class="flex items-center space-x-2">
                        <i data-lucide="check" class="h-3 w-3 text-cyan-500"></i>
                        <span class="text-sm text-gray-300 font-medium">${tool.trim()}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    const intGrid = document.getElementById('interests-grid');
    intGrid.innerHTML = state.interests.map(interest => `
        <span class="px-4 py-2 glass-card rounded-full text-xs font-medium text-gray-400">${interest}</span>
    `).join('');

    document.getElementById('contact-email').innerText = state.contact.email;
    document.getElementById('contact-phone').innerText = state.contact.phone;

    const contactWA = document.getElementById('contact-whatsapp-link');
    if (contactWA) { contactWA.href = state.contact.whatsapp; }

    lucide.createIcons();

    // Hide Loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 800);
        }
    }, 500);
}

function downloadResumePDF() {
    window.print();
}

function openAdmin() { document.getElementById('admin-modal').classList.remove('hidden'); }
function closeAdmin() { document.getElementById('admin-modal').classList.add('hidden'); }

function verifyAuth() {
    if (document.getElementById('admin-password').value === 'Ramsar@305402') {
        document.getElementById('admin-auth').classList.add('hidden');
        document.getElementById('admin-editor').classList.remove('hidden');
        populateFields();
    } else {
        showToast('Invalid Password', 'error');
    }
}

function populateFields() {
    document.getElementById('edit-name').value = state.profile.name;
    document.getElementById('edit-title').value = state.profile.title;
    document.getElementById('edit-bio').value = state.profile.bio;
    document.getElementById('edit-location').value = state.profile.location;
    document.getElementById('edit-edu').value = state.profile.education;
    document.getElementById('edit-lang').value = state.profile.languages;
    document.getElementById('edit-photo').value = state.profile.photo;
    document.getElementById('edit-email').value = state.contact.email;
    document.getElementById('edit-phone').value = state.contact.phone;
    document.getElementById('edit-experience').value = JSON.stringify(state.experience, null, 2);
    document.getElementById('edit-competencies').value = JSON.stringify(state.competencies, null, 2);
    document.getElementById('edit-software').value = JSON.stringify(state.software, null, 2);
    document.getElementById('edit-interests').value = JSON.stringify(state.interests, null, 2);
    document.getElementById('edit-certificates').value = JSON.stringify(state.certificates || [], null, 2);
}

async function uploadFile(file) {
    if (!storage) return null;
    const ref = storage.ref().child('uploads/' + file.name);
    const snapshot = await ref.put(file);
    return await snapshot.ref.getDownloadURL();
}

async function saveChanges() {
    try {
        const newData = {
            profile: {
                name: document.getElementById('edit-name').value,
                title: document.getElementById('edit-title').value,
                bio: document.getElementById('edit-bio').value,
                location: document.getElementById('edit-location').value,
                education: document.getElementById('edit-edu').value,
                languages: document.getElementById('edit-lang').value,
                photo: document.getElementById('edit-photo').value
            },
            experience: JSON.parse(document.getElementById('edit-experience').value),
            competencies: JSON.parse(document.getElementById('edit-competencies').value),
            software: JSON.parse(document.getElementById('edit-software').value),
            interests: JSON.parse(document.getElementById('edit-interests').value),
            certificates: JSON.parse(document.getElementById('edit-certificates').value),
            contact: {
                email: document.getElementById('edit-email').value,
                phone: document.getElementById('edit-phone').value,
                whatsapp: state.contact.whatsapp,
                linkedin: state.contact.linkedin,
                website: state.contact.website
            }
        };
        state = newData;
        saveStateToLocal();
        render();
        showToast('Success: Updates Published', 'success');
        setTimeout(closeAdmin, 800);
    } catch (e) {
        showToast('Error: Invalid JSON Format', 'error');
    }
}

function showToast(m, t) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `glass-card px-6 py-4 rounded-2xl mb-4 flex items-center space-x-3 animate-fade-in-right ${t === 'error' ? 'border-red-500/50' : 'border-green-500/50'}`;
    toast.innerHTML = `<i data-lucide="${t === 'success' ? 'check-circle' : 'alert-circle'}" class="${t === 'success' ? 'text-green-400' : 'text-red-400'}"></i><span class="text-sm font-medium">${m}</span>`;
    container.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => toast.remove(), 4000);
}

document.getElementById('logo').onclick = (e) => {
    let clicks = parseInt(localStorage.getItem('admin_clicks') || '0') + 1;
    localStorage.setItem('admin_clicks', clicks);
    if (clicks >= 3) { openAdmin(); localStorage.setItem('admin_clicks', '0'); }
    setTimeout(() => localStorage.setItem('admin_clicks', '0'), 2000);
};

document.addEventListener('DOMContentLoaded', () => {
    loadFromCloud().then(render);
});
'''

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js_content.strip())
