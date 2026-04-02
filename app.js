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

const VERSION = 'shakir_portfolio_v10_live';
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
        logoText: "SP.",
        tagline: "Med-Tech Innovator",
        availability: "Available for Consultation"
    },
    sections: {
        hero: { visible: true, order: 1 },
        about: { visible: true, order: 2 },
        experience: { visible: true, order: 3 },
        education: { visible: true, order: 4 },
        competencies: { visible: true, order: 5 },
        certificates: { visible: true, order: 6 },
        software: { visible: true, order: 7 },
        publications: { visible: true, order: 8 },
        conferences: { visible: true, order: 9 },
        skills: { visible: true, order: 10 },
        contact: { visible: true, order: 11 }
    },
    experience: [
        { id: 1, year: "Nov 2025 - Present", role: "Lead Associate Medical Trainer", company: "Innodata Inc.", desc: "Leading medical AI training teams." }
    ],
    education: [
        { id: 1, year: "2023", degree: "MBBS", institution: "Government Medical College, Kota", location: "Rajasthan, India", grade: "First Division" }
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
    publications: [
        { id: 1, title: "AI in Emergency Diagnostics", journal: "Journal of Medical Innovation", year: "2024", link: "#" }
    ],
    conferences: [
        { id: 1, title: "International Healthcare AI Summit", role: "Speaker", location: "Delhi NCR", year: "2024" }
    ],
    skills: [
        { id: 1, name: "Critical Care", level: 95 },
        { id: 2, name: "Emergency Medicine", level: 90 },
        { id: 3, name: "Medical AI", level: 85 },
        { id: 4, name: "Python Programming", level: 75 },
        { id: 5, name: "Research", level: 80 }
    ],
    interests: ["Bird Watching", "AI Research"],
    contact: {
        email: "acadmiana@gmail.com",
        phone: "+91 77 2793 0382",
        whatsapp: "https://wa.me/917727930382",
        linkedin: "https://linkedin.com/in/shakir-parvej",
        twitter: "",
        github: ""
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

    // Education Section
    inject('education-list', state.education || [], edu => `
        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
            <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-bl-full"></div>
            <div class="relative z-10">
                <p class="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">${edu.year}</p>
                <h4 class="text-lg font-bold mb-1">${edu.degree}</h4>
                <p class="text-sm text-gray-300 mb-2">${edu.institution}</p>
                <div class="flex items-center text-xs text-gray-500 space-x-2">
                    <i data-lucide="map-pin" class="h-3 w-3"></i>
                    <span>${edu.location}</span>
                </div>
                ${edu.grade ? `<p class="text-xs text-purple-400 mt-3 font-semibold">${edu.grade}</p>` : ''}
            </div>
        </div>
    `);

    // Publications Section
    inject('publications-list', state.publications || [], pub => `
        <div class="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-cyan-500/30 transition-all">
            <div class="flex-1">
                <h4 class="text-lg font-bold mb-1 group-hover:text-cyan-400 transition-colors">${pub.title}</h4>
                <p class="text-sm text-gray-400 italic">${pub.journal}</p>
            </div>
            <div class="flex items-center space-x-4">
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">${pub.year}</span>
                ${pub.link && pub.link !== '#' ? `<a href="${pub.link}" target="_blank" class="px-4 py-2 glass-card rounded-xl text-[8px] uppercase font-bold tracking-widest hover:bg-cyan-500/10 transition-all">Read More</a>` : ''}
            </div>
        </div>
    `);

    // Conferences Section
    inject('conferences-list', state.conferences || [], conf => `
        <div class="glass-card p-6 rounded-2xl group hover:border-purple-500/30 transition-all">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <h4 class="text-base font-bold mb-1">${conf.title}</h4>
                    <p class="text-sm text-gray-400">${conf.location}</p>
                </div>
                <span class="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full">${conf.year}</span>
            </div>
            <p class="text-xs text-cyan-400 uppercase tracking-widest font-semibold">${conf.role}</p>
        </div>
    `);

    // Skills Section with Progress Bars
    inject('skills-list', state.skills || [], skill => `
        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <span class="text-sm font-medium">${skill.name}</span>
                <span class="text-xs text-cyan-400 font-bold">${skill.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: 0%" data-width="${skill.level}%"></div>
            </div>
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
    
    // Animate skill bars on load
    setTimeout(() => {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    }, 500);
}

// --- Dynamic PDF Resume Engine (Modern Elegant Design) ---
window.generateResumePDF = async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ format: 'a4', orientation: 'portrait' });
    
    // Color scheme
    const primaryColor = [6, 182, 212];   // Cyan
    const secondaryColor = [139, 92, 246]; // Purple
    const darkBg = [15, 15, 20];
    const textGray = [120, 120, 130];
    
    // Header with gradient effect simulation
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, 210, 55, 'F');
    
    // Accent line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(3);
    doc.line(0, 55, 210, 55);
    
    // Name - Large and bold
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(state.profile.name, 20, 25);
    
    // Title
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...primaryColor);
    doc.text(state.profile.title, 20, 35);
    
    // Contact info row
    doc.setTextColor(180, 180, 190);
    doc.setFontSize(9);
    const contactLine = `${state.contact.email}  |  ${state.contact.phone}  |  ${state.profile.location}`;
    doc.text(contactLine, 20, 45);
    
    // Add profile photo if available
    if (state.profile.photo && state.profile.photo.length > 100) {
        try {
            doc.addImage(state.profile.photo, 'JPEG', 170, 10, 30, 30);
        } catch(e) { /* ignore image errors */ }
    }
    
    let y = 70;
    const leftMargin = 20;
    const rightMargin = 190;
    const contentWidth = 170;
    
    const addModernSection = (title, items, renderFn, icon) => {
        if (!items || items.length === 0) return;
        
        // Section header with icon
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.text(title.toUpperCase(), leftMargin, y);
        
        // Underline
        doc.setDrawColor(...textGray);
        doc.setLineWidth(0.5);
        doc.line(leftMargin, y + 1, rightMargin, y + 1);
        
        y += 10;
        doc.setTextColor(50, 50, 55);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        items.forEach(item => {
            if (y > 275) { 
                doc.addPage(); 
                y = 25; 
            }
            y = renderFn(item, y, leftMargin, contentWidth);
        });
        y += 8;
    };

    // Experience Section
    addModernSection("Professional Experience", state.experience, (exp, currY, margin, width) => {
        // Role
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 35);
        doc.text(exp.role, margin, currY);
        
        // Year - right aligned
        doc.setFont("helvetica", "italic");
        doc.setTextColor(...secondaryColor);
        doc.text(exp.year, margin + width, currY, { align: 'right' });
        
        currY += 5;
        
        // Company
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 110);
        doc.text(exp.company, margin, currY);
        
        currY += 5;
        
        // Description
        doc.setTextColor(60, 60, 65);
        const lines = doc.splitTextToSize(exp.desc, width);
        doc.text(lines, margin + 2, currY);
        
        return currY + (lines.length * 5) + 6;
    }, 'briefcase');

    // Education Section
    addModernSection("Education", state.education || [], (edu, currY, margin, width) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 35);
        doc.text(`${edu.degree}`, margin, currY);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 110);
        doc.text(edu.institution, margin, currY + 4);
        
        doc.setTextColor(...primaryColor);
        doc.text(`${edu.year} | ${edu.grade || ''}`, margin + width, currY, { align: 'right' });
        
        return currY + 12;
    }, 'graduation-cap');

    // Core Competencies
    addModernSection("Core Competencies", state.competencies, (comp, currY, margin, width) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 35);
        doc.text(`${comp.category}`, margin, currY);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 65);
        const lines = doc.splitTextToSize(comp.items, width - 40);
        doc.text(lines, margin, currY + 5);
        
        return currY + 5 + (lines.length * 5) + 3;
    }, 'activity');

    // Skills with Progress Bars
    addModernSection("Skills Assessment", state.skills || [], (skill, currY, margin, width) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 55);
        doc.text(skill.name, margin, currY);
        
        // Progress bar background
        doc.setFillColor(230, 230, 235);
        doc.roundedRect(margin + 80, currY - 3, 80, 4, 1, 1, 'F');
        
        // Progress bar fill
        doc.setFillColor(...primaryColor);
        const barWidth = (skill.level / 100) * 80;
        doc.roundedRect(margin + 80, currY - 3, barWidth, 4, 1, 1, 'F');
        
        // Percentage
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...secondaryColor);
        doc.text(`${skill.level}%`, margin + width, currY, { align: 'right' });
        
        return currY + 8;
    }, 'trending-up');

    // Publications
    addModernSection("Publications", state.publications || [], (pub, currY, margin, width) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 35);
        doc.text(pub.title, margin, currY);
        
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 110);
        doc.text(pub.journal, margin, currY + 4);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...primaryColor);
        doc.text(pub.year, margin + width, currY, { align: 'right' });
        
        return currY + 10;
    }, 'book-open');

    // Conferences
    addModernSection("Conference Participation", state.conferences || [], (conf, currY, margin, width) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 35);
        doc.text(conf.title, margin, currY);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 110);
        doc.text(`${conf.location} - ${conf.role}`, margin, currY + 4);
        
        doc.setTextColor(...secondaryColor);
        doc.text(conf.year, margin + width, currY, { align: 'right' });
        
        return currY + 10;
    }, 'mic');

    // Software & Tools
    addModernSection("Technical Proficiency", state.software || [], (soft, currY, margin, width) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...secondaryColor);
        doc.text(`${soft.level}:`, margin, currY);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 65);
        doc.text(soft.tools, margin + 25, currY);
        
        return currY + 6;
    }, 'code');

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 160);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    doc.save(`Resume_${state.profile.name.replace(/ /g, '_')}_Professional.pdf`);
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
    setVal('edit-tagline', state.profile.tagline);
    setVal('edit-email', state.contact.email);
    setVal('edit-phone', state.contact.phone);
    setVal('edit-linkedin', state.contact.linkedin);
    setVal('edit-twitter', state.contact.twitter || '');
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
    renderListEditor('education-editor-list', state.education || [], ['year', 'degree', 'institution', 'location', 'grade'], 'education');
    renderListEditor('competencies-editor-list', state.competencies, ['icon', 'category', 'items'], 'competencies');
    renderListEditor('software-editor-list', state.software || [], ['level', 'tools'], 'software');
    renderListEditor('skills-editor-list', state.skills || [], ['name', 'level'], 'skills');
    renderListEditor('publications-editor-list', state.publications || [], ['title', 'journal', 'year', 'link'], 'publications');
    renderListEditor('conferences-editor-list', state.conferences || [], ['title', 'role', 'location', 'year'], 'conferences');
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
        'education': { year: '2024', degree: 'Degree Name', institution: 'Institution Name', location: 'City, Country', grade: 'First Division' },
        'competencies': { icon: 'activity', category: 'New Category', items: 'Skill 1, Skill 2' },
        'certificates': { title: 'New Certificate', issuer: 'Issuer', image: '' },
        'software': { level: 'Advanced', tools: 'New Tool' },
        'skills': { name: 'New Skill', level: 75 },
        'publications': { title: 'Publication Title', journal: 'Journal Name', year: '2024', link: '#' },
        'conferences': { title: 'Conference Name', role: 'Speaker', location: 'City', year: '2024' }
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
        state.profile.tagline = document.getElementById('edit-tagline')?.value || state.profile.tagline;
        state.contact.email = document.getElementById('edit-email').value;
        state.contact.phone = document.getElementById('edit-phone').value;
        state.contact.linkedin = document.getElementById('edit-linkedin').value;
        state.contact.twitter = document.getElementById('edit-twitter')?.value || '';

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