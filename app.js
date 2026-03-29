const DEFAULT_DATA = {
    profile: {
        name: "DR. SHAKIR PARVEJ",
        title: "ICU & EMERGENCY PHYSICIAN | HEALTHCARE AI ENTHUSIAST",
        location: "Noida Sector 62, 202010 | Ramsar 305402",
        bio: "Forward-thinking medical professional (MBBS, GMC Kota) with hands-on clinical experience in intensive care and emergency medicine across both public and private sector hospitals. Deeply passionate about the intersection of pathology, clinical care, and artificial intelligence. Proficient in Python and Rust, with a strategic vision to integrate advanced technology, data analytics, and programming into modern diagnostics and patient care.",
        photo: "data:image/png;base64,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",
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
    interests: ["Avid Bird Watcher", "Bird Painting", "Nature Enthusiast", "Medical Ethics"],
    contact: {
        email: "acadmiana@gmail.com",
        phone: "+91 77 2793 0382",
        linkedin: "https://linkedin.com",
        website: "https://medexjob.com"
    }
};

let state = JSON.parse(localStorage.getItem('shakir_portfolio_v3')) || DEFAULT_DATA;

function saveStateToLocal() {
    localStorage.setItem('shakir_portfolio_v3', JSON.stringify(state));
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
        <div class="relative pl-12 timeline-item group">
            <div class="absolute left-[23px] top-1.5 w-4 h-4 rounded-full border-2 border-cyan-500 bg-dark z-20 group-hover:bg-cyan-500 transition-colors"></div>
            <div class="space-y-1">
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">${exp.year}</span>
                <h4 class="text-xl font-bold">${exp.role}</h4>
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

    lucide.createIcons();
}

// Logic for Print/PDF
function downloadResumePDF() {
    window.print();
}

// Admin Panel Logic
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
    document.getElementById('edit-email').value = state.contact.email;
    document.getElementById('edit-phone').value = state.contact.phone;
    document.getElementById('edit-experience').value = JSON.stringify(state.experience, null, 2);
    document.getElementById('edit-competencies').value = JSON.stringify(state.competencies, null, 2);
    document.getElementById('edit-software').value = JSON.stringify(state.software, null, 2);
    document.getElementById('edit-interests').value = JSON.stringify(state.interests, null, 2);
}

function saveChanges() {
    try {
        const newData = {
            profile: {
                name: document.getElementById('edit-name').value,
                title: document.getElementById('edit-title').value,
                bio: document.getElementById('edit-bio').value,
                location: document.getElementById('edit-location').value,
                education: document.getElementById('edit-edu').value,
                languages: document.getElementById('edit-lang').value,
                photo: state.profile.photo
            },
            experience: JSON.parse(document.getElementById('edit-experience').value),
            competencies: JSON.parse(document.getElementById('edit-competencies').value),
            software: JSON.parse(document.getElementById('edit-software').value),
            interests: JSON.parse(document.getElementById('edit-interests').value),
            contact: {
                email: document.getElementById('edit-email').value,
                phone: document.getElementById('edit-phone').value,
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

document.addEventListener('DOMContentLoaded', render);
