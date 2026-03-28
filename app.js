import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const HASHED_PASSWORD = "5e884898da28047151d0e56f8dc6292773603d0d6aabbddc3b6f3d6f6a6c6b8";

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
  name: "Your Name",
  bio: "Portfolio loading...",
  links: {},
  sections: []
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
    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tight">${state.name || "Portfolio"}</h1>
      <p class="text-gray-400">${state.bio || ""}</p>
    </div>

    ${Object.keys(links).length > 0 ? `
    <div class="flex flex-wrap gap-3 mt-3">
      ${Object.entries(links).map(([k,v])=> v? `<a href="${v}" target="_blank" class="px-3 py-1 border border-cyan-400/30 rounded-full text-sm hover:bg-cyan-400/10">${k}</a>`:"").join("")}
    </div>
    ` : ""}

    <div class="grid gap-6 mt-6">
      ${sections.filter(s=>s.visible!==false).map(s=>`
        <div class="glass p-6 rounded-2xl">
          <h2 class="text-lg font-semibold text-cyan-400">${s.title}</h2>
          <p class="text-gray-300 mt-2 leading-relaxed">${s.content}</p>
        </div>
      `).join("")}
    </div>

    ${sections.length === 0 ? `
      <div class="p-8 border border-dashed border-white/10 rounded-2xl text-center text-gray-500">
        Portfolio is loading or not configured yet
      </div>
    ` : ""}
  `;
}

function renderAdmin(){
  const ed = document.getElementById("adminContent");

  const name = state.name || "";
  const bio = state.bio || "";
  const links = state.links || {};
  const sections = state.sections || [];

  ed.innerHTML = `
    <input id="name" value="${name}" class="text-black w-full p-2" placeholder="Full Name"/>
    <textarea id="bio" class="text-black w-full p-2" placeholder="Bio">${bio}</textarea>

    <h3 class="text-lg">Links</h3>
    ${Object.entries(links).map(([k,v])=>`
      <div class="flex gap-2">
        <input value="${k}" class="key text-black p-1"/>
        <input value="${v}" class="val text-black p-1 flex-1"/>
      </div>
    `).join("")}

    <button onclick="addLink()" class="bg-blue-500 p-2 rounded">+ Link</button>

    <h3 class="text-lg mt-4">Sections</h3>
    ${sections.map((s,i)=>`
      <div class="border p-3 rounded mb-2">
        <input value="${s.title}" class="title text-black w-full mb-1"/>
        <textarea class="content text-black w-full">${s.content}</textarea>

        <div class="flex items-center gap-3 mt-2">
          <label>Visible <input type="checkbox" ${s.visible!==false?"checked":""} class="visible"/></label>
          <button onclick="moveUp(${i})">↑</button>
          <button onclick="moveDown(${i})">↓</button>
          <button onclick="removeSection(${i})" class="text-red-500">Delete</button>
        </div>
      </div>
    `).join("")}

    <button onclick="addSection()" class="bg-blue-500 p-2 rounded">+ Section</button>
    <button onclick="saveData()" class="bg-green-500 p-2 rounded">Save</button>
  `;
}

window.addLink = () => { state.links["new"] = ""; renderAdmin(); }
window.addSection = () => { state.sections.push({ title: "New", content: "Edit", visible: true }); renderAdmin(); }
window.removeSection = (i) => { state.sections.splice(i, 1); renderAdmin(); }

window.moveUp = (i) => { if (i > 0) { [state.sections[i - 1], state.sections[i]] = [state.sections[i], state.sections[i - 1]]; renderAdmin(); } }
window.moveDown = (i) => { if (i < state.sections.length - 1) { [state.sections[i + 1], state.sections[i]] = [state.sections[i], state.sections[i + 1]]; renderAdmin(); } }

window.saveData = async () => {
  state.name = document.getElementById("name").value;
  state.bio = document.getElementById("bio").value;

  const keys = document.querySelectorAll(".key");
  const vals = document.querySelectorAll(".val");
  state.links = {};
  keys.forEach((k, i) => state.links[k.value] = vals[i].value);

  const titles = document.querySelectorAll(".title");
  const contents = document.querySelectorAll(".content");
  const visibles = document.querySelectorAll(".visible");

  state.sections = [];
  titles.forEach((t, i) => {
    state.sections.push({ title: t.value, content: contents[i].value, visible: visibles[i].checked });
  });

  await setDoc(doc(db, "portfolio", "main"), state);
  alert("Saved");
  render();
}

async function hash(val) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(val));
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, "0")).join("");
}

window.checkPass = async () => {
  const val = document.getElementById("adminPass").value;
  const h = await hash(val);
  if (h === HASHED_PASSWORD) {
    sessionStorage.setItem("admin", "true");
    unlock();
  } else alert("Wrong");
}

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
