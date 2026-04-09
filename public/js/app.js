
function applyTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}
document.addEventListener("DOMContentLoaded", applyTheme);
// ---------- SUPABASE AUTH ----------
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const errorEl = document.getElementById("error");

  if (!email || !password) {
    if (errorEl) errorEl.innerText = "Please enter both email and password";
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (errorEl) errorEl.innerText = error.message;
  } else {
    localStorage.setItem("dinero_session", JSON.stringify(data.session));
    window.location.href = "dashboard.html";
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
  localStorage.removeItem("dinero_session");
  window.location.href = "login.html";
}

function authGuard() {
  const sessionRaw = localStorage.getItem("dinero_session");
  if (!sessionRaw) {
    window.location.href = "login.html";
    return null;
  }
  return JSON.parse(sessionRaw);
}



// ---------- PROFILES ----------
const DEFAULT_PROFILES = [
  { name: "Zeph", avatar: "assets/avatars/avatar1.png" },
  { name: "Tejas", avatar: "assets/avatars/avatar2.png" },
  { name: "Andrea", avatar: "assets/avatars/avatar3.png" },
  { name: "Mrini", avatar: "assets/avatars/avatar4.png" },
  { name: "Thanu", avatar: "assets/avatars/avatar5.png" },
  { name: "Tani", avatar: "assets/avatars/avatar1.png" },
  { name: "Div", avatar: "assets/avatars/avatar2.png" },
  { name: "Sam", avatar: "assets/avatars/avatar3.png" },
  { name: "Daniel", avatar: "assets/avatars/avatar4.png" },
  { name: "Zahra", avatar: "assets/avatars/avatar5.png" },
  { name: "Aditi", avatar: "assets/avatars/avatar1.png" },
];

let isManagingProfiles = false;

function getProfiles() {
  try {
    const stored = localStorage.getItem("profiles");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {
    console.warn("Failed to read profiles from storage", e);
  }
  return DEFAULT_PROFILES;
}

function saveProfiles(list) {
  localStorage.setItem("profiles", JSON.stringify(list));
}

function selectProfile(profile) {
  localStorage.setItem("profile", JSON.stringify(profile));
}

function renderProfiles() {
  const grid = document.querySelector(".profiles-grid");
  if (!grid) return;

  const manageBtn = document.querySelector(".manage-btn");
  if (manageBtn) {
    manageBtn.textContent = isManagingProfiles ? "DONE" : "MANAGE ACCOUNTS";
  }

  const profiles = getProfiles();
  grid.innerHTML = "";

  profiles.forEach((profile, index) => {
    const card = document.createElement("a");
    card.href = "auth-method.html";
    card.className = "profile-card";

    card.addEventListener("click", (e) => {
      if (isManagingProfiles) {
        e.preventDefault();
        return;
      }
      selectProfile(profile);
    });

    const avatar = document.createElement("div");
    avatar.className = "profile-avatar";
    const img = document.createElement("img");
    img.src = profile.avatar;
    img.alt = profile.name;
    avatar.appendChild(img);

    const label = document.createElement("p");
    label.textContent = profile.name;

    card.appendChild(avatar);
    card.appendChild(label);

    if (isManagingProfiles) {
      const del = document.createElement("button");
      del.className = "profile-delete";
      del.type = "button";
      del.textContent = "×";
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const list = getProfiles();
        list.splice(index, 1);
        saveProfiles(list);
        renderProfiles();
      });
      card.appendChild(del);
    }

    grid.appendChild(card);
  });

  const addCard = document.createElement("div");
  addCard.className = "profile-card add";
  addCard.addEventListener("click", addProfile);

  const addAvatar = document.createElement("div");
  addAvatar.className = "profile-avatar add-avatar";
  addAvatar.textContent = "+";

  const addLabel = document.createElement("p");
  addLabel.textContent = "Add Profile";

  addCard.appendChild(addAvatar);
  addCard.appendChild(addLabel);

  grid.appendChild(addCard);
}

function addProfile() {
  const name = prompt("Enter a name for the new profile:");
  if (!name) return;

  const trimmed = name.trim();
  if (!trimmed) return;

  const profiles = getProfiles();
  const avatarIndex = (profiles.length % 5) + 1;
  const avatar = `assets/avatars/avatar${avatarIndex}.png`;

  profiles.push({ name: trimmed, avatar });
  saveProfiles(profiles);
  renderProfiles();
}

function toggleManageAccounts() {
  isManagingProfiles = !isManagingProfiles;
  renderProfiles();
}


// ---------- SECURITY ----------
let enteredPin = "";

function pressKey(num) {
  if (enteredPin.length < 4) {
    enteredPin += num;
    updateDots();
  }
}

function deleteKey() {
  enteredPin = enteredPin.slice(0, -1);
  updateDots();
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById("dot" + i);
    if (i < enteredPin.length) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  }
}

function verifyPin() {
  if (enteredPin.length !== 4) {
    alert("Enter 4 digits");
    return;
  }

  if (enteredPin === "1234") {
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect PIN");
    enteredPin = "";
    updateDots();
  }
}

// ---------- DASHBOARD ----------
async function loadUser() {
  const session = authGuard();
  if (!session) return;

  const user = session.user;

  const username = document.getElementById("username");
  if (username) {
    username.innerText = user.email.split('@')[0];
  }

  const avatar = document.getElementById("userAvatar");
  if (avatar) {
    // Default avatar
    avatar.src = "assets/avatars/avatar1.png";
  }

  const cardHolder = document.getElementById("cardHolderName");
  if (cardHolder) {
    cardHolder.innerText = user.email.split('@')[0];
  }

  // Account balance (for dashboard + bills)
  const state = getAccountState();
  const totalBalance = document.getElementById("totalBalance");
  if (totalBalance) {
    totalBalance.innerText = formatCurrency(state.balanceCents);
  }
}

document.addEventListener("DOMContentLoaded", loadUser);
document.addEventListener("DOMContentLoaded", renderProfiles);
// ---------- FACE ID ----------
document.addEventListener("DOMContentLoaded", function () {
  const faceContainer = document.getElementById("faceContainer");
  if (!faceContainer) return;

  setTimeout(() => {
    const icon = document.querySelector(".face-icon");
    const title = document.getElementById("faceTitle");
    const sub = document.getElementById("faceSub");
    const btn = document.getElementById("dashboardBtn");

    icon.classList.add("success");
    icon.innerHTML = "✔";

    title.innerText = "Authentication Successful";
    sub.innerText = "Your identity has been verified. Welcome back!";

    btn.style.display = "inline-block";

  }, 2000); // 2 seconds scanning
});


// ---------- ACCOUNT & BILLS ----------
function getAccountState() {
  const raw = localStorage.getItem("accountState");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.balanceCents === "number") return parsed;
    } catch (e) {
      console.warn("Failed to parse accountState", e);
    }
  }
  // default starting balance: 24,562.00
  const initial = { balanceCents: 2456200 };
  localStorage.setItem("accountState", JSON.stringify(initial));
  return initial;
}

function saveAccountState(state) {
  localStorage.setItem("accountState", JSON.stringify(state));
}

function formatCurrency(cents) {
  return `₹${(cents / 100).toFixed(2)}`;
}

const DEFAULT_BILLS = [
  { id: "bill-1", name: "Electricity • City Power", due: "2026-02-14", amountCents: 12840, paid: false },
  { id: "bill-2", name: "Internet • FiberNet", due: "2026-02-16", amountCents: 7999, paid: false },
  { id: "bill-3", name: "Credit Card • NeoBank", due: "2026-02-20", amountCents: 20386, paid: false },
  { id: "bill-4", name: "Streaming • DineroFlix", due: "2026-02-02", amountCents: 1299, paid: true },
  { id: "bill-5", name: "Phone • MobileCo", due: "2026-01-29", amountCents: 8701, paid: false },
];

function getBills() {
  const raw = localStorage.getItem("bills");
  if (raw) {
    try {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    } catch (e) {
      console.warn("Failed to parse bills", e);
    }
  }
  localStorage.setItem("bills", JSON.stringify(DEFAULT_BILLS));
  return DEFAULT_BILLS;
}

function saveBills(list) {
  localStorage.setItem("bills", JSON.stringify(list));
}

function computeBillStatus(bill) {
  if (bill.paid) return "paid";
  const today = new Date();
  const due = new Date(bill.due + "T00:00:00");
  return due < new Date(today.getFullYear(), today.getMonth(), today.getDate()) ? "overdue" : "upcoming";
}

function renderBills() {
  const body = document.getElementById("billsBody");
  if (!body) return;

  const bills = getBills();
  body.innerHTML = "";

  let upcomingCount = 0;
  let paidCount = 0;
  let totalDueCents = 0;

  bills.forEach((bill) => {
    const status = computeBillStatus(bill);
    if (status === "upcoming") {
      upcomingCount += 1;
      totalDueCents += bill.amountCents;
    } else if (status === "overdue") {
      totalDueCents += bill.amountCents;
    } else if (status === "paid") {
      paidCount += 1;
    }

    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = bill.name;

    const dueTd = document.createElement("td");
    dueTd.textContent = bill.due;

    const statusTd = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + status;
    badge.textContent =
      status === "paid" ? "Paid" : status === "overdue" ? "Overdue" : "Upcoming";
    if (status !== "paid") {
      badge.style.cursor = "pointer";
      badge.title = "Click to pay this bill";
      badge.addEventListener("click", function () {
        payBill(bill.id);
      });
    }
    statusTd.appendChild(badge);

    const amountTd = document.createElement("td");
    amountTd.className = "amount";
    amountTd.style.textAlign = "right";
    amountTd.textContent = formatCurrency(bill.amountCents);

    tr.appendChild(nameTd);
    tr.appendChild(dueTd);
    tr.appendChild(statusTd);
    tr.appendChild(amountTd);

    body.appendChild(tr);
  });

  const upcomingEl = document.getElementById("billsUpcomingCount");
  const paidEl = document.getElementById("billsPaidCount");
  const totalDueEl = document.getElementById("billsTotalDue");

  if (upcomingEl) upcomingEl.innerText = String(upcomingCount);
  if (paidEl) paidEl.innerText = String(paidCount);
  if (totalDueEl) totalDueEl.innerText = formatCurrency(totalDueCents);
}

function promptAddBill() {
  const name = prompt("Bill name (e.g. Electricity • City Power):");
  if (!name) return;

  const amountStr = prompt("Amount (e.g. 120.50):");
  if (!amountStr) return;
  const parsedAmount = parseFloat(amountStr);
  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    alert("Please enter a valid positive amount.");
    return;
  }

  const due = prompt("Due date (YYYY-MM-DD):");
  if (!due || !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    alert("Please use date format YYYY-MM-DD.");
    return;
  }

  const bills = getBills();
  bills.push({
    id: "bill-" + Date.now(),
    name: name.trim(),
    due,
    amountCents: Math.round(parsedAmount * 100),
    paid: false,
  });
  saveBills(bills);
  renderBills();
}

function payBill(id) {
  const bills = getBills();
  const bill = bills.find((b) => b.id === id);
  if (!bill) return;

  const status = computeBillStatus(bill);
  if (status === "paid") {
    alert("This bill is already paid.");
    return;
  }

  if (!confirm(`Pay ${bill.name} (${formatCurrency(bill.amountCents)}) now?`)) {
    return;
  }

  const state = getAccountState();
  state.balanceCents = Math.max(0, state.balanceCents - bill.amountCents);
  saveAccountState(state);

  bill.paid = true;
  saveBills(bills);

  renderBills();

  const totalBalance = document.getElementById("totalBalance");
  if (totalBalance) {
    totalBalance.innerText = formatCurrency(state.balanceCents);
  }
}

document.addEventListener("DOMContentLoaded", renderBills);
// --- ATTACH EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  // Check if we are on the login page by looking for the email input
  const emailInput = document.getElementById("email");
  if (emailInput) {
    // Look for the login button or the form itself
    const loginBtn = document.querySelector('button[onclick="login()"]') || document.querySelector('form');

    // If you have <button onclick="login()"> in HTML, this ensures it works in Vite
    if (loginBtn) {
      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        login();
      });
    }
  }
});