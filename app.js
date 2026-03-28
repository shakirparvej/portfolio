import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const PASSWORD = "admin123";

const firebaseConfig = {
  apiKey: "AIzaSyCS488771dGxCZujO5GdLb4GQ__koM215Q",
  authDomain: "portfolio-52a6e.firebaseapp.com",
  projectId: "portfolio-52a6e",
  storageBucket: "portfolio-52a6e.firebasestorage.app",
  messagingSenderId: "25182923540",
  appId: "1:25182923540:web:9cc9b0a418947e96b23001",
  measurementId: "G-4YBPVXS2ZQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("App started");

let state = {
  name: "Shakir Parvej",
  bio: "Software Engineer | Full Stack Developer specializing in high-performance web applications and cloud architecture.",
  links: {
    "GitHub": "https://github.com/",
    "LinkedIn": "https://linkedin.com/in/",
    "Email": "mailto:shakir@example.com"
  },
  sections: [
    { title: "Experience", content: "Senior Developer with 5+ years of experience building scalable systems.", visible: true },
    { title: "Skills", content: "React, Node.js, Firebase, Tailwind CSS, PostgreSQL, Cloud Architecture.", visible: true },
    { title: "Education", content: "Bachelor of Computer Science - Graduate with Honors.", visible: true }
  ]
};

async function loadData(){
  console.log("Loading Firebase...");
  try {
    const snap = await getDoc(doc(db,"portfolio","main"));
    if(snap.exists()){
      state = snap.data();
      console.log("Firebase loaded");
    }
  } catch (err) {
    console.error("Firebase error or not configured:", err);
  }
  render();
}

function render(){
  console.log("Render called");
  const el = document.getElementById("app");

  const links = state.links || {};
  const sections = state.sections || [];

  el.innerHTML = `
    <header class="pb-8 border-b border-white/10 mb-8">
      <h1 class="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">${state.name || "Portfolio"}</h1>
      <p class="text-xl text-gray-400 mt-4 leading-relaxed max-w-2xl">${state.bio || ""}</p>

      ${Object.keys(links).length > 0 ? `
      <div class="flex flex-wrap gap-4 mt-8">
        ${Object.entries(links).map(([k,v])=> v? `
          <a href="${v}" target="_blank" class="glass px-5 py-2 rounded-full text-sm font-medium hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all">
            ${k}
          </a>`:"").join("")}
      </div>
      ` : ""}
    </header>

    <main class="grid gap-8">
      ${sections.filter(s=>s.visible!==false).map(s=>`
        <div class="glass p-8 rounded-3xl group transition-all duration-500">
          <div class="flex items-center gap-4 mb-4">
             <div class="h-1 w-8 bg-cyan-500 rounded-full group-hover:w-12 transition-all"></div>
             <h2 class="text-2xl font-bold text-white/90">${s.title}</h2>
          </div>
          <p class="text-gray-400 text-lg leading-relaxed">${s.content}</p>
        </div>
      `).join("")}

      ${sections.length === 0 ? `
        <div class="p-16 border-2 border-dashed border-white/5 rounded-3xl text-center">
          <p class="text-gray-500 text-lg">Your professional story starts here. Add your first section from the admin panel.</p>
        </div>
      ` : ""}
    </main>
  `;
}

function renderAdmin(){
  const ed = document.getElementById("adminContent");

  const name = state.name || "";
  const bio = state.bio || "";
  const links = state.links || {};
  const sections = state.sections || [];

  ed.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between pb-6 border-b border-white/10 mb-6 sticky top-0 bg-black/95 z-10">
        <h2 class="text-2xl font-bold text-white">Admin Control Panel</h2>
        <button onclick="document.getElementById('adminPanel').classList.add('hidden')" class="px-6 py-2 border border-white/20 rounded-xl text-sm hover:bg-white/5 transition-all">← Back to Portfolio</button>
      </div>

      <div class="grid gap-4">
        <label class="text-cyan-400 font-bold uppercase text-xs tracking-widest">Basic Information</label>
        <input id="name" value="${name}" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="Full Name"/>
        <textarea id="bio" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white h-32 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="Bio">${bio}</textarea>
      </div>

      <div class="grid gap-4">
        <label class="text-cyan-400 font-bold uppercase text-xs tracking-widest">Connect Links</label>
        ${Object.entries(links).map(([k,v])=>`
          <div class="flex gap-2">
            <input value="${k}" class="key w-1/3 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="Label"/>
            <input value="${v}" class="val flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="URL"/>
          </div>
        `).join("")}
        <button onclick="addLink()" class="w-max px-4 py-2 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm hover:bg-cyan-500/10 transition-all">+ Add Link</button>
      </div>

      <div class="grid gap-4">
        <label class="text-cyan-400 font-bold uppercase text-xs tracking-widest">Content Sections</label>
        ${sections.map((s,i)=>`
          <div class="bg-white/5 border border-white/10 p-6 rounded-2xl relative group">
            <input value="${s.title}" class="title w-full bg-transparent text-xl font-bold text-white mb-2 focus:outline-none" placeholder="Section Title"/>
            <textarea class="content w-full bg-transparent text-gray-400 h-24 focus:outline-none resize-none" placeholder="Section Content">${s.content}</textarea>

            <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <label class="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input type="checkbox" ${s.visible!==false?"checked":""} class="visible accent-cyan-500"/> Visible
              </label>
              <div class="flex gap-2">
                <button onclick="moveUp(${i})" class="p-2 hover:bg-white/5 rounded-lg transition-all">↑</button>
                <button onclick="moveDown(${i})" class="p-2 hover:bg-white/5 rounded-lg transition-all">↓</button>
                <button onclick="removeSection(${i})" class="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all">Delete</button>
              </div>
            </div>
          </div>
        `).join("")}
        <button onclick="addSection()" class="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:border-cyan-500/30 hover:text-cyan-400 transition-all">+ Add New Section</button>
      </div>

      <button onclick="saveData()" class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all">Save Changes</button>
    </div>
  `;
}

window.addLink = () => { state.links["new"] = ""; renderAdmin(); }
window.addSection = () => { state.sections.push({ title: "New", content: "Edit", visible: true }); renderAdmin(); }
window.removeSection = (i) => { state.sections.splice(i, 1); renderAdmin(); }

window.moveUp = (i) => { if (i > 0) { [state.sections[i - 1], state.sections[i]] = [state.sections[i], state.sections[i - 1]]; renderAdmin(); } }
window.moveDown = (i) => { if (i < state.sections.length - 1) { [state.sections[i + 1], state.sections[i]] = [state.sections[i], state.sections[i + 1]]; renderAdmin(); } }

window.saveData = async () => {
  try {
    console.log("Attempting to save state:", state);

    state.name = document.getElementById("name").value;
    state.bio = document.getElementById("bio").value;

    const keys = document.querySelectorAll(".key");
    const vals = document.querySelectorAll(".val");
    state.links = {};
    keys.forEach((k, i) => {
      if(k.value) state.links[k.value] = vals[i].value;
    });

    const titles = document.querySelectorAll(".title");
    const contents = document.querySelectorAll(".content");
    const visibles = document.querySelectorAll(".visible");

    state.sections = [];
    titles.forEach((t, i) => {
      if(t.value){
        state.sections.push({ title: t.value, content: contents[i].value, visible: visibles[i].checked });
      }
    });

    await setDoc(doc(db, "portfolio", "main"), state);
    console.log("Save successful");
    alert("Saved Successfully!");
    
    // Automatically close admin panel and return to portfolio
    document.getElementById("adminPanel").classList.add("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    render();
  } catch (error) {
    console.error("Save Error:", error);
    alert("Save Failed: " + error.message + "\nCheck console for details.");
  }
}

window.checkPass = () => {
  const val = document.getElementById("adminPass").value;
  if (val === PASSWORD) {
    sessionStorage.setItem("admin", "true");
    unlock();
  } else {
    alert("Wrong");
  }
};

function unlock() {
  document.getElementById("adminContent").classList.remove("hidden");
  renderAdmin();
}

window.downloadPDF = () => {
  const el = document.getElementById("resumeA4");

  el.innerHTML = `
    <div class="a4">
      <h1>${state.name}</h1>
      <p>${state.bio}</p>
      ${state.sections.filter(s => s.visible !== false).map(s => `
        <h2>${s.title}</h2>
        <p>${s.content}</p>
      `).join("")}
    </div>
  `;

  html2pdf().set({ jsPDF: { format: "a4" } }).from(el).save();
}

document.getElementById("adminBtn").onclick = () => {
  document.getElementById("adminPanel").classList.toggle("hidden");
};

if(sessionStorage.getItem("admin")==="true"){ unlock(); }

render();
loadData();
