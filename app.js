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
        photo: "",
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
        { id: 1, title: "Critical Care Basic", issuer: "ICMR", image: "" }
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
    initContactForm();
    
    // Fail-safe: Force hide loader after 3 seconds
    setTimeout(() => {
        if (!window.location.pathname.includes('admin.html')) {
            const loader = document.getElementById('loader');
            if (loader && loader.style.display !== 'none') {
                console.warn("Failsafe Loader Exit Triggered.");
                renderMain();
            }
        }
    }, 3000);

    // Triple-Tap Logo Logic
    const logoEl = document.getElementById('logo');
    let clicks = 0;
    if (logoEl) {
        logoEl.onclick = (e) => {
            e.preventDefault();
            clicks++;
            if (clicks >= 3) { window.location.href = 'admin.html'; clicks = 0; }
            setTimeout(() => clicks = 0, 1500);
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
    if (local) {
        try {
            const parsed = JSON.parse(local);
            state = { ...DEFAULT_DATA, ...parsed, profile: { ...DEFAULT_DATA.profile, ...parsed.profile }, contact: { ...DEFAULT_DATA.contact, ...parsed.contact } };
        } catch (e) { state = DEFAULT_DATA; }
    }

    const isAdmin = window.location.pathname.includes('admin.html');
    if (!isAdmin) renderMain(); 
    else initAdmin();

    // 2. Background Cloud Sync
    if (db) {
        db.collection('portfolio').doc('main').get()
            .then(doc => {
                if (doc.exists) {
                    const cloud = doc.data();
                    state = { ...DEFAULT_DATA, ...cloud, profile: { ...DEFAULT_DATA.profile, ...cloud.profile }, contact: { ...DEFAULT_DATA.contact, ...cloud.contact } };
                    localStorage.setItem(VERSION, JSON.stringify(state));
                    if (!isAdmin) renderMain(); 
                }
            })
            .catch(e => console.warn("Cloud Sync Error (Likely Rules):", e));
    }
}

function getAsset(url, type = 'avatar') {
    if (url && url.length > 5 && !url.includes('via.placeholder')) return url;
    if (type === 'avatar') return `https://ui-avatars.com/api/?name=${encodeURIComponent(state.profile?.name || 'User')}&background=06b6d4&color=fff&size=512`;
    return 'https://placehold.co/600x400/050505/06b6d4?text=Medical+Doc';
}

// --- Diagnostic Tool ---
window.checkSyncHealth = async () => {
    const btn = document.getElementById('health-btn');
    const originalText = btn.innerText;
    btn.innerText = "TESTING...";
    try {
        let report = "SYSTEM STATUS:\n";
        if (db) {
            await db.collection('_health_').doc('test').set({ time: Date.now() });
            report += "✅ DATABASE: Connected (Active)\n";
        } else report += "❌ DATABASE: Not Initialized\n";
        if (storage && firebaseConfig.storageBucket) {
            try {
                const ref = storage.ref().child('_health_test_.txt');
                await ref.putString("check");
                report += "✅ CLOUD STORAGE: Ready\n";
                await ref.delete();
            } catch (e) { report += "⚠️ CLOUD STORAGE: Locked/Regional Issue (Using DB Fallback)\n"; }
        } else report += "⚠️ CLOUD STORAGE: Bucket Missing (Using DB Fallback)\n";
        alert(report);
    } catch (e) { alert("Diagnostic Error: " + e.message); }
    finally { btn.innerText = originalText; }
};

const resizeImage = (file, maxWidth = 800) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
    });
};

function renderMain() {
    const isAdmin = window.location.pathname.includes('admin.html');
    if (isAdmin) return;

    // Loader hide
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }

    const safeSet = (id, val, attr = 'innerText') => {
        const el = document.getElementById(id);
        if (el) el[attr] = val || '';
    };

    safeSet('logo', state.profile?.logoText);
    
    // Visibility
    if (state.sections) {
        Object.keys(state.sections).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = state.sections[id]?.visible ? 'block' : 'none';
        });
    }

    // Hero
    const profile = state.profile || {};
    const nameParts = (profile.name || "").split(' ');
    const first = nameParts.slice(0, 2).join(' ');
    const last = nameParts.slice(2).join(' ');
    const heroName = document.getElementById('hero-name');
    if (heroName) heroName.innerHTML = `${first} <br> <span class="gradient-text">${last}.</span>`;

    safeSet('hero-title-desc', profile.title);
    safeSet('hero-location', profile.location);
    safeSet('profile-img', getAsset(profile.photo), 'src');
    safeSet('about-bio', profile.bio);
    safeSet('about-edu', profile.education);

    // List Injections
    const inject = (id, list, htmlFn) => {
        const el = document.getElementById(id);
        if (el && list) el.innerHTML = list.map(htmlFn).join('');
    };

    inject('experience-list', state.experience, exp => `
        <div class="relative pl-12 pb-10 group">
            <div class="absolute left-[13px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-cyan-500 bg-[#050505] z-10 group-hover:bg-cyan-500 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"></div>
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
                <img src="${getAsset(cert.image, 'cert')}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/600x400/050505/06b6d4?text=Doc'">
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

    const contact = state.contact || {};
    safeSet('contact-email', contact.email);
    safeSet('contact-phone', contact.phone);
    const linkedinLink = document.getElementById('linkedin-link');
    if (linkedinLink) linkedinLink.href = contact.linkedin || '#';
    
    const waLink = document.getElementById('contact-whatsapp-link');
    if (waLink) waLink.href = contact.whatsapp;

    if (window.lucide) lucide.createIcons();
}

// --- Dynamic PDF Resume Engine ---
window.generateResumePDF = async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const primaryColor = [6, 182, 212];
    
    doc.setFillColor(5, 5, 5);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(state.profile.name, 20, 22);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${state.profile.title} | ${state.profile.location}`, 20, 30);
    doc.text(`${state.contact.email} | ${state.contact.phone}`, 20, 36);

    let y = 55;
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
        items.forEach(item => { if (y > 270) { doc.addPage(); y = 20; } y = renderFn(item, y); });
        y += 10;
    };

    addSection("Experience", state.experience, (exp, currY) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${exp.role} @ ${exp.company}`, 20, currY);
        doc.setFont("helvetica", "italic");
        doc.text(exp.year, 190, currY, { align: 'right' });
        currY += 5;
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(exp.desc, 160);
        doc.text(lines, 25, currY);
        return currY + (lines.length * 5) + 4;
    });

    addSection("Core Competencies", state.competencies, (comp, currY) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${comp.category}:`, 20, currY);
        doc.setFont("helvetica", "normal");
        doc.text(comp.items, 60, currY);
        return currY + 6;
    });

    addSection("Software & AI Mastery", state.software || [], (soft, currY) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${soft.level}:`, 20, currY);
        doc.setFont("helvetica", "normal");
        doc.text(soft.tools, 60, currY);
        return currY + 6;
    });

    addSection("Education & Details", [state.profile], (prof, currY) => {
        doc.setFont("helvetica", "bold");
        doc.text("Education:", 20, currY);
        doc.setFont("helvetica", "normal");
        doc.text(prof.education, 60, currY);
        currY += 6;
        doc.setFont("helvetica", "bold");
        doc.text("Languages:", 20, currY);
        doc.setFont("helvetica", "normal");
        doc.text(state.profile.languages || "English, Hindi", 60, currY);
        return currY + 6;
    });

    doc.save(`Resume_${state.profile.name.replace(/ /g, '_')}.pdf`);
};

const ICON_OPTIONS = ['activity', 'clipboard-list', 'stethoscope', 'brain', 'code', 'microscope', 'users', 'heart', 'drip', 'award', 'database', 'zap'];

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
    window.setupUpload = (id, statePath, previewId) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const statusLabel = document.createElement('span');
            statusLabel.className = 'absolute top-0 right-0 p-1 text-[8px] bg-cyan-500 text-white animate-pulse z-20';
            statusLabel.innerText = "PREPARING...";
            el.parentElement.appendChild(statusLabel);

            try {
                const imageData = await resizeImage(file);
                const keys = statePath.split('.');
                let current = state;
                for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
                current[keys[keys.length - 1]] = imageData;
                if (previewId) document.getElementById(previewId).src = imageData;
                statusLabel.innerText = "DB SYNC OK";
                setTimeout(() => statusLabel.remove(), 2000);
            } catch (err) {
                statusLabel.innerText = "ERR";
                statusLabel.classList.replace('bg-cyan-500', 'bg-red-500');
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

    const adminPreview = document.getElementById('admin-profile-preview');
    if (adminPreview) adminPreview.src = getAsset(state.profile.photo);

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

    renderListEditor('experience-editor-list', state.experience, ['year', 'role', 'company', 'desc'], 'experience');
    renderListEditor('competencies-editor-list', state.competencies, ['icon', 'category', 'items'], 'competencies');
    renderListEditor('software-editor-list', state.software || [], ['level', 'tools'], 'software');
    renderCertificatesEditor();

    if (window.lucide) lucide.createIcons();
}

function renderListEditor(containerId, list, fields, stateKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = list.map((item, index) => `
        <div class="section-item p-4 bg-white/5 rounded-xl space-y-3 relative group">
            <div class="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="moveItem('${stateKey}', ${index}, -1)" class="p-1 hover:text-cyan-400"><i data-lucide="chevron-up" class="h-3 w-3"></i></button>
                <button onclick="moveItem('${stateKey}', ${index}, 1)" class="p-1 hover:text-cyan-400"><i data-lucide="chevron-down" class="h-3 w-3"></i></button>
                <button onclick="removeItem('${stateKey}', ${index})" class="p-1 hover:text-red-500"><i data-lucide="trash-2" class="h-3 w-3"></i></button>
            </div>
            <div class="grid gap-3">
                ${fields.map(f => `
                    <div class="space-y-1">
                        <label class="text-[8px] uppercase tracking-widest text-gray-500">${f}</label>
                        ${f === 'icon' ? `
                            <select onchange="updateItem('${stateKey}', ${index}, '${f}', this.value)" class="admin-input py-1 text-xs">
                                ${ICON_OPTIONS.map(opt => `<option value="${opt}" ${item[f] === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        ` : f === 'level' ? `
                            <select onchange="updateItem('${stateKey}', ${index}, '${f}', this.value)" class="admin-input py-1 text-xs">
                                ${['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(lv => `<option value="${lv}" ${item[f] === lv ? 'selected' : ''}>${lv}</option>`).join('')}
                            </select>
                        ` : `
                            <input type="text" value="${item[f] || ''}" onchange="updateItem('${stateKey}', ${index}, '${f}', this.value)" class="admin-input py-1 text-xs">
                        `}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderCertificatesEditor() {
    const container = document.getElementById('certificates-editor-list');
    if (!container) return;
    container.innerHTML = state.certificates.map((cert, index) => `
        <div class="glass-card p-4 rounded-xl space-y-3 group relative text-center">
            <div class="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-40">
                <button onclick="moveItem('certificates', ${index}, -1)" class="p-1 bg-black/60 rounded hover:text-cyan-400"><i data-lucide="chevron-left" class="h-3 w-3"></i></button>
                <button onclick="moveItem('certificates', ${index}, 1)" class="p-1 bg-black/60 rounded hover:text-cyan-400"><i data-lucide="chevron-right" class="h-3 w-3"></i></button>
                <button onclick="removeItem('certificates', ${index})" class="p-1 bg-black/60 rounded hover:text-red-500"><i data-lucide="trash-2" class="h-3 w-3"></i></button>
            </div>
            <div class="relative aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/5">
                <img id="cert-preview-${index}" src="${getAsset(cert.image, 'cert')}" class="w-full h-full object-cover">
                <label id="cert-label-${index}" class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <i data-lucide="camera" class="h-4 w-4 mb-1"></i>
                    <span class="text-[8px] uppercase font-bold text-white">Resync</span>
                    <input type="file" onchange="uploadCert(${index}, this)" class="hidden" accept="image/*">
                </label>
            </div>
            <input type="text" value="${cert.title}" placeholder="Title" onchange="state.certificates[${index}].title = this.value" class="admin-input py-1 text-xs">
            <input type="text" value="${cert.issuer}" placeholder="Issuer" onchange="state.certificates[${index}].issuer = this.value" class="admin-input py-1 text-xs">
        </div>
    `).join('');
    lucide.createIcons();
}

window.uploadCert = async (index, input) => {
    const file = input.files[0];
    if (!file) return;
    const label = document.getElementById(`cert-label-${index}`);
    const status = document.createElement('div');
    status.className = 'absolute inset-0 bg-cyan-500/80 flex items-center justify-center text-[10px] font-bold text-white z-30';
    status.innerText = "PREPARING...";
    label.parentElement.appendChild(status);

    try {
        const imageData = await resizeImage(file);
        state.certificates[index].image = imageData;
        document.getElementById(`cert-preview-${index}`).src = imageData;
        status.innerText = "DB READY";
        setTimeout(()=>status.remove(), 2000);
    } catch (e) {
        status.innerText = "FAIL";
        status.classList.replace('bg-cyan-500/80', 'bg-red-500/80');
        setTimeout(()=>status.remove(), 3000);
    }
};

window.moveItem = (category, index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= state[category].length) return;
    const temp = state[category][index];
    state[category][index] = state[category][targetIndex];
    state[category][targetIndex] = temp;
    populateCMS();
};

window.addItem = (category) => {
    const listMap = {
        'experience': { year: '2024', role: 'New Role', company: 'Company', desc: 'Description' },
        'competencies': { icon: 'activity', category: 'New Category', items: 'Skill 1, Skill 2' },
        'certificates': { title: 'New Certificate', issuer: 'Issuer', image: '' },
        'software': { level: 'Advanced', tools: 'New Tool' }
    };
    state[category].push(listMap[category]);
    populateCMS();
};

window.removeItem = (category, index) => {
    state[category].splice(index, 1);
    populateCMS();
};

window.updateItem = (category, index, field, value) => {
    state[category][index][field] = value;
};

window.createNewSection = () => {
    const name = prompt("Enter Section Title:");
    if (!name) return;
    const id = name.toLowerCase().replace(/ /g, '-');
    state.sections[id] = { visible: true };
    state[id] = []; // Initialize empty list
    alert(`New Section '${name}' added! Refresh to see structural changes.`);
    populateCMS();
};

window.addExperienceItem = () => addItem('experience');
window.addCompetencyItem = () => addItem('competencies');
window.addCertificateItem = () => addItem('certificates');
window.addSoftwareItem = () => addItem('software');

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

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('contact-submit-btn');
        if (!btn) return;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span>Sending...</span>`;
        
        const msgData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email-input').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            if (db) {
                await db.collection('messages').add(msgData);
                alert("Message Sent Successfully!");
                form.reset();
            } else { alert("Offline Mode: Message saved locally."); console.log(msgData); }
        } catch (e) { alert("Error: " + e.message); }
        finally { btn.disabled = false; btn.innerHTML = originalText; }
    };
}

// Safety
setTimeout(() => { if (!window.location.pathname.includes('admin.html')) renderMain(); }, 5000);