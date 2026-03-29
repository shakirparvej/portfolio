/**
 * Dr. Shakir Parvej | Premium Portfolio CMS V9 (Stable)
 * Dynamic Form Editor + Section Visibility + Certificate Management
 */

const firebaseConfig = {
    apiKey: "AIzaSyCS488771dGxCZujO5GdLb4GQ__koM215Q",
    authDomain: "portfolio-52a6e.firebaseapp.com",
    projectId: "portfolio-52a6e",
    storageBucket: "portfolio-52a6e.firebasestorage.app",
    messagingSenderId: "25182923540",
    appId: "1:25182923540:web:9cc9b0a418947e96b23001",
    measurementId: "G-4YBPVXS2ZQ"
};

const VERSION = 'shakir_portfolio_v9_live';
const DEFAULT_DATA = {
    profile: {
        name: "DR. SHAKIR PARVEJ",
        title: "ICU & EMERGENCY PHYSICIAN | HEALTHCARE AI ARCHITECT",
        location: "Noida Sector 62 | Rajasthan",
        bio: "Forward-thinking medical professional specializing in intensive care. Building the future of tech-driven healthcare with Python and Rust.",
        photo: "https://ui-avatars.com/api/?name=Shakir+Parvej&background=06b6d4&color=fff&size=512",
        education: "MBBS, GMC Kota, India (2023)",
        languages: "English, Hindi, Urdu, Arabic",
        resumeUrl: "#",
        logoText: "SP."
    },
    sections: {
        hero: { visible: true, order: 1 },
        about: { visible: true, order: 2 },
        experience: { visible: true, order: 3 },
        competencies: { visible: true, order: 4 },
        certificates: { visible: true, order: 5 },
        software: { visible: true, order: 6 },
        contact: { visible: true, order: 7 }
    },
    experience: [
        { id: 1, year: "Nov 2025 - Present", role: "Lead Associate Medical Trainer", company: "Innodata Inc.", desc: "Leading medical AI training teams." }
    ],
    competencies: [
        { id: 1, icon: "activity", category: "Clinical", items: "Intubation, Central Line, ICU Care" }
    ],
    software: [
        { level: "Advanced", tools: "ICD-11, SNOMED, LOINC" }
    ],
    certificates: [
        { id: 1, title: "Critical Care Basic", issuer: "ICMR", image: "https://via.placeholder.com/600x400/06b6d4/ffffff?text=Certificate" }
    ],
    interests: ["Bird Watching", "AI Research"],
    contact: {
        email: "acadmiana@gmail.com",
        phone: "+91 77 2793 0382",
        whatsapp: "https://wa.me/917727930382",
        linkedin: "https://linkedin.com/in/shakir-parvej"
    }
};

let state = DEFAULT_DATA;
let db, storage;

document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    loadState();
    
    // Triple-Tap Logo Logic
    const logoEl = document.getElementById('logo');
    let clicks = 0;
    if (logoEl) {
        logoEl.onclick = (e) => {
            e.preventDefault();
            clicks++;
            if (clicks >= 3) { window.location.href = 'admin.html'; clicks = 0; }
            setTimeout(() => clicks = 0, 2000);
        };
    }
});

function initFirebase() {
    try {
        if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            storage = firebase.storage();
        }
    } catch (e) { console.error("Firebase Init Error:", e); }
}

async function loadState() {
    // 1. Load Local Immediately
    const local = localStorage.getItem(VERSION);
    if (local) state = JSON.parse(local);

    const isAdmin = window.location.pathname.includes('admin.html');
    if (!isAdmin) renderMain(); 
    else initAdmin();

    // 2. Background Cloud Sync
    if (db) {
        db.collection('portfolio').doc('main').get()
            .then(doc => {
                if (doc.exists) {
                    state = doc.data();
                    localStorage.setItem(VERSION, JSON.stringify(state));
                    if (!isAdmin) renderMain(); // Rerender with fresh cloud data
                }
            })
            .catch(e => {
                console.warn("Cloud Sync Unavailable (Likely Permissions):", e);
                // Fallback: Site is already rendered from local/default
            });
    }
}

// --- Main Engine ---
function renderMain() {
    const isAdmin = window.location.pathname.includes('admin.html');
    if (isAdmin) return;

    // Logo & Navbar
    const safeSet = (id, val, attr = 'innerText') => {
        const el = document.getElementById(id);
        if (el) el[attr] = val || '';
    };

    safeSet('logo', state.profile.logoText);
    
    // Visibility Filters
    Object.keys(state.sections).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = state.sections[id].visible ? 'block' : 'none';
    });

    // Content
    const nameParts = (state.profile.name || "").split(' ');
    const first = nameParts.slice(0, 2).join(' ');
    const last = nameParts.slice(2).join(' ');
    const heroName = document.getElementById('hero-name');
    if (heroName) heroName.innerHTML = `${first} <br> <span class="gradient-text">${last}.</span>`;

    safeSet('hero-title-desc', state.profile.title);
    safeSet('hero-location', state.profile.location);
    safeSet('profile-img', state.profile.photo, 'src');
    safeSet('about-bio', state.profile.bio);
    safeSet('about-edu', state.profile.education);

    // List Injections
    const inject = (id, list, htmlFn) => {
        const el = document.getElementById(id);
        if (el && list) el.innerHTML = list.map(htmlFn).join('');
    };

    inject('experience-list', state.experience, exp => `
        <div class="relative pl-10 pb-10 group">
            <div class="absolute left-[-2px] top-1.5 w-3 h-3 rounded-full border border-cyan-500 bg-[#050505] z-10 group-hover:bg-cyan-500"></div>
            <p class="text-[10px] font-bold text-cyan-500/60 uppercase tracking-widest">${exp.year}</p>
            <h4 class="text-xl font-bold group-hover:text-cyan-400 transition-colors">${exp.role}</h4>
            <p class="text-xs text-gray-400 opacity-60">${exp.company}</p>
            <p class="text-xs text-gray-500 mt-2 font-light leading-relaxed">${exp.desc}</p>
        </div>
    `);

    inject('competencies-grid', state.competencies, comp => `
        <div class="glass-card p-6 rounded-2xl">
            <div class="flex items-center space-x-3 mb-4">
                <i data-lucide="${comp.icon}" class="h-4 w-4 text-cyan-400"></i>
                <h4 class="text-sm font-bold uppercase tracking-widest">${comp.category}</h4>
            </div>
            <p class="text-xs text-gray-500 leading-relaxed">${comp.items}</p>
        </div>
    `);

    inject('certificates-grid', state.certificates || [], cert => `
        <div class="glass-card p-4 rounded-2xl group cursor-pointer hover:border-cyan-500/40 transition-all">
            <div class="aspect-video rounded-xl overflow-hidden mb-4 border border-white/5 relative">
                <img src="${cert.image}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <i data-lucide="zoom-in" class="h-6 w-6 text-white"></i>
                </div>
            </div>
            <h4 class="font-bold text-sm mb-1">${cert.title}</h4>
            <p class="text-[10px] text-gray-500 uppercase tracking-widest">${cert.issuer}</p>
        </div>
    `);

    inject('software-grid', state.software, soft => `
        <div class="glass-card p-6 rounded-2xl">
            <p class="text-[10px] uppercase tracking-widest font-bold text-purple-400 mb-2">${soft.level}</p>
            <p class="text-sm text-gray-400 font-medium">${soft.tools}</p>
        </div>
    `);

    safeSet('contact-email', state.contact.email);
    safeSet('contact-phone', state.contact.phone);
    const linkedinLink = document.getElementById('linkedin-link');
    if (linkedinLink) linkedinLink.href = state.contact.linkedin || '#';
    
    const waLink = document.getElementById('contact-whatsapp-link');
    if (waLink) waLink.href = state.contact.whatsapp;

    if (window.lucide) lucide.createIcons();
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }
}

// --- Dynamic PDF Resume Engine ---
window.generateResumePDF = async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const primaryColor = [6, 182, 212]; // Cyan-500
    
    // Helper: Header
    doc.setFillColor(5, 5, 5);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(state.profile.name, 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${state.profile.title} | ${state.profile.location}`, 20, 28);
    doc.text(`${state.contact.email} | ${state.contact.phone}`, 20, 34);

    let y = 50;

    const addSection = (title, items, renderFn) => {
        if (!items || items.length === 0) return;
        doc.setTextColor(...primaryColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title.toUpperCase(), 20, y);
        y += 2;
        doc.setDrawColor(...primaryColor);
        doc.line(20, y, 190, y);
        y += 8;
        
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        items.forEach(item => {
            if (y > 270) { doc.addPage(); y = 20; }
            y = renderFn(item, y);
        });
        y += 10;
    };

    addSection("Professional Experience", state.experience, (exp, currY) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${exp.role} - ${exp.company}`, 20, currY);
        doc.setFont("helvetica", "italic");
        doc.text(exp.year, 190, currY, { align: 'right' });
        currY += 5;
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(exp.desc, 160);
        doc.text(lines, 25, currY);
        return currY + (lines.length * 5) + 5;
    });

    addSection("Education", [{ edu: state.profile.education }], (item, currY) => {
        doc.text(item.edu, 20, currY);
        return currY + 6;
    });

    addSection("Competencies", state.competencies, (comp, currY) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${comp.category}:`, 20, currY);
        doc.setFont("helvetica", "normal");
        doc.text(comp.items, 55, currY);
        return currY + 6;
    });

    doc.save(`Resume_Dr_Shakir_Parvej.pdf`);
};

// --- CMS Logic (admin.html) ---
function initAdmin() {
    const pwdInput = document.getElementById('admin-password');
    window.verifyAuth = () => {
        if (pwdInput.value === 'Ramsar@305402') {
            document.getElementById('admin-auth').classList.add('hidden');
            document.getElementById('admin-dashboard').classList.remove('hidden');
            populateCMS();
        } else { alert("Access Denied."); }
    };

    // File Handlers
    const setupUpload = (id, statePath, previewId) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (storage) {
                const ref = storage.ref().child(`${statePath}/${Date.now()}_${file.name}`);
                await ref.put(file);
                const url = await ref.getDownloadURL();
                
                const keys = statePath.split('.');
                let current = state;
                for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
                current[keys[keys.length - 1]] = url;
                
                if (previewId) document.getElementById(previewId).src = url;
                alert("Cloud Sync Successful!");
            } else {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const keys = statePath.split('.');
                    let current = state;
                    for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
                    current[keys[keys.length - 1]] = re.target.result;
                    if (previewId) document.getElementById(previewId).src = re.target.result;
                };
                reader.readAsDataURL(file);
                alert("Asset Loaded (Local Mode).");
            }
        };
    };

    setupUpload('photo-upload', 'profile.photo', 'admin-profile-preview');
}

function populateCMS() {
    const setVal = (id, val) => { if (document.getElementById(id)) document.getElementById(id).value = val || ''; };
    setVal('edit-name', state.profile.name);
    setVal('edit-title', state.profile.title);
    setVal('edit-bio', state.profile.bio);
    setVal('edit-location', state.profile.location);
    setVal('edit-edu-short', state.profile.education);
    setVal('edit-email', state.contact.email);
    setVal('edit-phone', state.contact.phone);
    setVal('edit-linkedin', state.contact.linkedin);
    setVal('edit-logo-text', state.profile.logoText);

    const toggleContainer = document.getElementById('section-toggles');
    if (toggleContainer) {
        toggleContainer.innerHTML = Object.keys(state.sections).map(sectionId => `
            <div class="flex items-center justify-between p-3 glass-card rounded-xl">
                <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">${sectionId}</span>
                <input type="checkbox" ${state.sections[sectionId].visible ? 'checked' : ''} 
                       onchange="state.sections['${sectionId}'].visible = this.checked" 
                       class="w-4 h-4 accent-cyan-500">
            </div>
        `).join('');
    }

    renderListEditor('experience-editor-list', state.experience, ['year', 'role', 'company', 'desc']);
    renderListEditor('competencies-editor-list', state.competencies, ['icon', 'category', 'items']);
    renderListEditor('certificates-editor-list', state.certificates, ['title', 'issuer', 'image']);

    if (window.lucide) lucide.createIcons();
}

function renderListEditor(containerId, list, fields) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = list.map((item, index) => `
        <div class="section-item p-4 bg-white/5 rounded-xl space-y-3 relative group">
            <button onclick="removeItem('${containerId}', ${index})" class="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <i data-lucide="trash-2" class="h-4 w-4"></i>
            </button>
            <div class="grid gap-3">
                ${fields.map(f => `
                    <div class="space-y-1">
                        <label class="text-[8px] uppercase tracking-widest text-gray-500">${f}</label>
                        <input type="text" value="${item[f] || ''}" onchange="updateItem('${containerId}', ${index}, '${f}', this.value)" class="admin-input py-1 text-xs">
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

window.addItem = (category) => {
    const listMap = {
        'experience-editor-list': { year: '2024', role: 'New Role', company: 'Company', desc: 'Description' },
        'competencies-editor-list': { icon: 'activity', category: 'New Category', items: 'Skill 1, Skill 2' },
        'certificates-editor-list': { title: 'New Certificate', issuer: 'Issuer', image: 'https://via.placeholder.com/600x400' }
    };
    const targetState = {
        'experience-editor-list': state.experience,
        'competencies-editor-list': state.competencies,
        'certificates-editor-list': state.certificates
    };
    targetState[category].push(listMap[category]);
    populateCMS();
};

window.removeItem = (category, index) => {
    const targetStateMap = {
        'experience-editor-list': 'experience',
        'competencies-editor-list': 'competencies',
        'certificates-editor-list': 'certificates'
    };
    state[targetStateMap[category]].splice(index, 1);
    populateCMS();
};

window.updateItem = (category, index, field, value) => {
    const targetStateMap = {
        'experience-editor-list': 'experience',
        'competencies-editor-list': 'competencies',
        'certificates-editor-list': 'certificates'
    };
    state[targetStateMap[category]][index][field] = value;
};

window.addExperienceItem = () => addItem('experience-editor-list');
window.addCompetencyItem = () => addItem('competencies-editor-list');
window.addCertificateItem = () => addItem('certificates-editor-list');

window.saveChanges = async () => {
    try {
        state.profile.name = document.getElementById('edit-name').value;
        state.profile.title = document.getElementById('edit-title').value;
        state.profile.bio = document.getElementById('edit-bio').value;
        state.profile.location = document.getElementById('edit-location').value;
        state.profile.education = document.getElementById('edit-edu-short').value;
        state.profile.logoText = document.getElementById('edit-logo-text').value;
        state.contact.email = document.getElementById('edit-email').value;
        state.contact.phone = document.getElementById('edit-phone').value;
        state.contact.linkedin = document.getElementById('edit-linkedin').value;

        localStorage.setItem(VERSION, JSON.stringify(state));
        if (db) await db.collection('portfolio').doc('main').set(state);
        alert("Portfolio Live & Synchronized!");
    } catch (e) { alert("Save Error"); console.error(e); }
};

// Safety
setTimeout(() => { if (!window.location.pathname.includes('admin.html')) renderMain(); }, 5000);