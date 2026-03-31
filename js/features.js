/**
 * Dinero Features Logic
 * 
 * This file handles the logic for:
 * 1. Transaction & Budget Engine
 * 2. Bill Calendar
 * 3. Split Expense Tracker
 * 4. Net Worth & Debt Tracking
 * 5. Spending Anomaly Alerts
 * 6. Monthly Financial Report Card
 * 7. Savings Goals
 * 8. PDF/CSV Export
 */

/* ---------- SHARED UTILITIES ---------- */
function formatCurrency(cents) {
  return `₹${Math.abs(cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ---------- FEATURE 1: TRANSACTION & BUDGET ENGINE ---------- */

const DEFAULT_TRANSACTIONS = [
  { id: "tx-1", date: "2026-02-11", description: "Salary • NeoBank", category: "Income", amountCents: 640000 },
  { id: "tx-2", date: "2026-02-10", description: "Rent • Landlord", category: "Housing", amountCents: -185000 },
  { id: "tx-3", date: "2026-02-09", description: "Groceries • FreshMart", category: "Food", amountCents: -9642 },
  { id: "tx-4", date: "2026-02-08", description: "Streaming • DineroFlix", category: "Subscriptions", amountCents: -1299 },
  { id: "tx-5", date: "2026-02-06", description: "Card Refund • NeoShop", category: "Refund", amountCents: 2415 },
];

const BUDGET_CATEGORIES = ["Housing", "Food", "Subscriptions", "Transportation", "Entertainment", "Utilities", "Shopping", "Misc"];

function getTransactions() {
  const stored = localStorage.getItem("transactions");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
  return DEFAULT_TRANSACTIONS;
}

function saveTransactions(list) {
  localStorage.setItem("transactions", JSON.stringify(list));
}

// Budget Storage & Logic
function getBudgets() {
  const stored = localStorage.getItem("budgets");
  return stored ? JSON.parse(stored) : {};
}

function saveBudgets(budgets) {
  localStorage.setItem("budgets", JSON.stringify(budgets));
}

function getSpendingByCategory() {
  const txs = getTransactions();
  const spending = {};
  txs.forEach(tx => {
    if (tx.amountCents < 0) {
      const cat = tx.category;
      spending[cat] = (spending[cat] || 0) + Math.abs(tx.amountCents);
    }
  });
  return spending;
}

function renderTransactions(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const txs = getTransactions();
  container.innerHTML = "";

  txs.forEach(tx => {
    const tr = document.createElement("tr");
    
    const dateTd = document.createElement("td");
    const d = new Date(tx.date);
    dateTd.textContent = d.toLocaleString('default', { month: 'short', day: '2-digit' });

    const descTd = document.createElement("td");
    descTd.textContent = tx.description;

    const catTd = document.createElement("td");
    catTd.textContent = tx.category;

    const amtTd = document.createElement("td");
    amtTd.className = `amount ${tx.amountCents >= 0 ? 'positive' : 'negative'}`;
    amtTd.style.textAlign = "right";
    amtTd.textContent = (tx.amountCents >= 0 ? '+' : '-') + formatCurrency(tx.amountCents);

    tr.appendChild(dateTd);
    tr.appendChild(descTd);
    tr.appendChild(catTd);
    tr.appendChild(amtTd);
    container.appendChild(tr);
  });
}

function checkBudgetAlerts() {
  const budgets = getBudgets();
  const spending = getSpendingByCategory();
  const alerts = [];

  for (const [category, limitCents] of Object.entries(budgets)) {
    const spent = spending[category] || 0;
    const ratio = spent / limitCents;

    if (ratio >= 1.0) {
      alerts.push({ category, type: 'critical', spent, limit: limitCents });
    } else if (ratio >= 0.8) {
      alerts.push({ category, type: 'warning', spent, limit: limitCents });
    }
  }
  return alerts;
}

function openBudgetModal() {
  const modal = document.getElementById("budgetModal");
  const list = document.getElementById("budgetList");
  if (!modal || !list) return;

  const currentBudgets = getBudgets();
  list.innerHTML = "";

  BUDGET_CATEGORIES.forEach(cat => {
    const item = document.createElement("div");
    item.className = "budget-item";
    
    const name = document.createElement("span");
    name.className = "budget-cat-name";
    name.textContent = cat;

    const input = document.createElement("input");
    input.type = "number";
    input.className = "budget-input";
    input.dataset.category = cat;
    input.placeholder = "Limit (₹)";
    input.value = currentBudgets[cat] ? currentBudgets[cat] / 100 : "";

    item.appendChild(name);
    item.appendChild(input);
    list.appendChild(item);
  });

  modal.classList.add("active");
}

function closeBudgetModal() {
  const modal = document.getElementById("budgetModal");
  if (modal) modal.classList.remove("active");
}

function saveBudgetSettings() {
  const inputs = document.querySelectorAll(".budget-input");
  const budgets = {};
  inputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val) && val > 0) {
      budgets[input.dataset.category] = Math.round(val * 100);
    }
  });
  saveBudgets(budgets);
  closeBudgetModal();
  checkBlockedView(); // Check if we just exceeded something
  renderTransactions("transactionsBody");
}

function checkBlockedView() {
  const alerts = checkBudgetAlerts();
  const critical = alerts.filter(a => a.type === 'critical');
  
  if (critical.length > 0) {
    const existing = document.getElementById("blockedOverlay");
    if (existing) return;

    const overlay = document.createElement("div");
    overlay.id = "blockedOverlay";
    overlay.className = "blocked-view";
    
    const h1 = document.createElement("h1");
    h1.textContent = "Budget Exceeded!";
    
    const p = document.createElement("p");
    p.textContent = `You have reached your limit for: ${critical.map(a => a.category).join(", ")}. Please acknowledge this to continue.`;
    
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.style.background = "white";
    btn.style.color = "var(--error)";
    btn.style.fontWeight = "bold";
    btn.textContent = "I AKNOWLEDGE THIS";
    btn.addEventListener("click", () => {
      overlay.remove();
      sessionStorage.setItem("budget_acknowledged", "true");
    });

    overlay.appendChild(h1);
    overlay.appendChild(p);
    overlay.appendChild(btn);
    document.body.appendChild(overlay);
  }
}

/* ---------- FEATURE 2: CALENDAR ---------- */
let currentCalendarDate = new Date();

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  const label = document.getElementById("calendarMonthLabel");
  if (!grid || !label) return;

  grid.innerHTML = "";
  
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  label.textContent = currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Day headers
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(d => {
    const head = document.createElement("div");
    head.className = "calendar-day-head";
    head.textContent = d;
    grid.appendChild(head);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Padding for first week
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day";
    grid.appendChild(empty);
  }

  const bills = (typeof getBills === 'function') ? getBills() : [];
  const today = new Date();
  today.setHours(0,0,0,0);

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cellDate = new Date(year, month, day);
    if (cellDate.getTime() === today.getTime()) {
      dayDiv.classList.add("today");
    }

    const num = document.createElement("div");
    num.className = "calendar-date-num";
    num.textContent = day;
    dayDiv.appendChild(num);

    // Find bills for this day
    const dayBills = bills.filter(b => b.due === dateStr);
    dayBills.forEach(bill => {
      const bDiv = document.createElement("div");
      const status = (typeof computeBillStatus === 'function') ? computeBillStatus(bill) : 'upcoming';
      
      // Visual indicators for upcoming within 7 days
      let finalStatus = status;
      if (status === 'upcoming') {
        const diff = (new Date(bill.due) - today) / (1000 * 60 * 60 * 24);
        if (diff >= 0 && diff <= 7) finalStatus = 'upcoming'; // Already upcoming, but could be 'near'
        if (diff === 0) finalStatus = 'today-due'; // Custom indicator for today
      }

      bDiv.className = `calendar-bill ${finalStatus}`;
      bDiv.textContent = `${bill.name.split('•')[0]} ${formatCurrency(bill.amountCents)}`;
      bDiv.title = bill.name;
      bDiv.onclick = (e) => {
        e.stopPropagation();
        if (typeof payBill === 'function') {
          payBill(bill.id);
          renderCalendar();
        }
      };
      dayDiv.appendChild(bDiv);
    });

    grid.appendChild(dayDiv);
  }
}

function changeMonth(delta) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
  renderCalendar();
}

/* ---------- FEATURE 3: SPLIT TRACKER ---------- */
function getSplits() {
  const stored = localStorage.getItem("splits");
  return stored ? JSON.parse(stored) : [];
}

function saveSplits(list) {
  localStorage.setItem("splits", JSON.stringify(list));
}

function renderSplits() {
  const body = document.getElementById("splitsBody");
  if (!body) return;

  const splits = getSplits();
  body.innerHTML = "";

  const summary = {};
  let totalOWE = 0; // Owed to you (positive)
  let totalYOU = 0; // You owe (negative)

  splits.forEach(s => {
    const tr = document.createElement("tr");
    
    // We store person sums
    if (!summary[s.person]) summary[s.person] = 0;
    summary[s.person] += s.amountCents;

    if (s.amountCents > 0) totalOWE += s.amountCents;
    else totalYOU += Math.abs(s.amountCents);

    const personTd = document.createElement("td");
    personTd.textContent = s.person;

    const descTd = document.createElement("td");
    descTd.textContent = s.description;

    const amtTd = document.createElement("td");
    amtTd.className = `amount ${s.amountCents >= 0 ? 'positive' : 'negative'}`;
    amtTd.style.textAlign = "right";
    amtTd.textContent = (s.amountCents >= 0 ? '+' : '-') + formatCurrency(s.amountCents);

    const statusTd = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${s.settled ? 'paid' : 'upcoming'}`;
    badge.textContent = s.settled ? "Settled" : "Pending";
    badge.style.cursor = "pointer";
    badge.onclick = () => {
      s.settled = !s.settled;
      saveSplits(splits);
      renderSplits();
    };
    statusTd.appendChild(badge);

    tr.appendChild(personTd);
    tr.appendChild(descTd);
    tr.appendChild(amtTd);
    tr.appendChild(statusTd);
    body.appendChild(tr);
  });

  const owedEl = document.getElementById("totalOwedToYou");
  const youOweEl = document.getElementById("totalYouOwe");
  if (owedEl) owedEl.textContent = formatCurrency(totalOWE);
  if (youOweEl) youOweEl.textContent = formatCurrency(totalYOU);

  renderSplitSummary(summary);
}

function renderSplitSummary(summary) {
  const container = document.getElementById("splitSummaryCards");
  if (!container) return;
  container.innerHTML = "";

  for (const [person, balance] of Object.entries(summary)) {
    const card = document.createElement("div");
    card.className = "pill";
    card.style.justifyContent = "space-between";
    card.style.minWidth = "200px";
    
    const nameSpan = document.createElement("span");
    nameSpan.textContent = person;
    
    const balSpan = document.createElement("strong");
    balSpan.className = balance >= 0 ? "positive" : "negative";
    balSpan.textContent = (balance >= 0 ? "Owes you " : "You owe ") + formatCurrency(balance);
    
    card.appendChild(nameSpan);
    card.appendChild(balSpan);
    container.appendChild(card);
  }
}

function promptAddSplit() {
  const person = prompt("Person name:");
  if (!person) return;
  const desc = prompt("Description:");
  if (!desc) return;
  const amtStr = prompt("Amount (use negative if you owe them, e.g. -50.00):");
  if (!amtStr) return;
  const amt = parseFloat(amtStr);
  if (isNaN(amt)) return;

  const splits = getSplits();
  splits.push({
    person: person.trim(),
    description: desc.trim(),
    amountCents: Math.round(amt * 100),
    date: new Date().toISOString().split('T')[0],
    settled: false
  });
  saveSplits(splits);
  renderSplits();
}

/* ---------- FEATURE 4: NET WORTH ---------- */
function getNetWorthData() {
  const stored = localStorage.getItem("netWorth");
  if (stored) return JSON.parse(stored);
  // Default values: 24,562.00 total usually, let's seed with something
  const initial = {
    assets: { cash: 56200, savings: 2400000, investments: 0 },
    liabilities: { loans: 0, creditCards: 0, emis: 0 }
  };
  localStorage.setItem("netWorth", JSON.stringify(initial));
  return initial;
}

function saveNetWorthData(data) {
  localStorage.setItem("netWorth", JSON.stringify(data));
}

function renderNetWorth() {
  const valEl = document.getElementById("netWorthValue");
  if (!valEl) return;

  const data = getNetWorthData();
  const totalAssets = Object.values(data.assets).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(data.liabilities).reduce((a, b) => a + b, 0);
  const netWorth = totalAssets - totalLiabilities;

  valEl.textContent = formatCurrency(netWorth);
  
  const assetEl = document.getElementById("totalAssets");
  const liabEl = document.getElementById("totalLiabilities");
  if (assetEl) assetEl.textContent = formatCurrency(totalAssets);
  if (liabEl) liabEl.textContent = formatCurrency(totalLiabilities);
}

function openNetWorthModal() {
  const modal = document.getElementById("netWorthModal");
  if (!modal) return;

  const data = getNetWorthData();
  
  // Fill assets
  document.querySelectorAll(".nw-asset").forEach(input => {
    input.value = (data.assets[input.dataset.key] || 0) / 100;
  });
  
  // Fill liabilities
  document.querySelectorAll(".nw-liab").forEach(input => {
    input.value = (data.liabilities[input.dataset.key] || 0) / 100;
  });

  modal.classList.add("active");
}

function closeNetWorthModal() {
  const modal = document.getElementById("netWorthModal");
  if (modal) modal.classList.remove("active");
}

function saveNetWorthSettings() {
  const data = { assets: {}, liabilities: {} };
  
  document.querySelectorAll(".nw-asset").forEach(input => {
    const val = parseFloat(input.value) || 0;
    data.assets[input.dataset.key] = Math.round(val * 100);
  });
  
  document.querySelectorAll(".nw-liab").forEach(input => {
    const val = parseFloat(input.value) || 0;
    data.liabilities[input.dataset.key] = Math.round(val * 100);
  });

  saveNetWorthData(data);
  closeNetWorthModal();
  renderNetWorth();
}

/* ---------- FEATURE 5: ANOMALY DETECTION ---------- */
function getAnomalyAlerts() {
  const txs = getTransactions();
  const now = new Date();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  
  const currentWeekStart = now.getTime() - oneWeek;
  const week2Start = now.getTime() - 2 * oneWeek;
  const week3Start = now.getTime() - 3 * oneWeek;
  const week4Start = now.getTime() - 4 * oneWeek;

  const spending = { current: {}, prev1: {}, prev2: {}, prev3: {} };

  txs.forEach(tx => {
    if (tx.amountCents >= 0) return;
    const d = new Date(tx.date).getTime();
    const amt = Math.abs(tx.amountCents);
    const cat = tx.category;

    if (d >= currentWeekStart) spending.current[cat] = (spending.current[cat] || 0) + amt;
    else if (d >= week2Start) spending.prev1[cat] = (spending.prev1[cat] || 0) + amt;
    else if (d >= week3Start) spending.prev2[cat] = (spending.prev2[cat] || 0) + amt;
    else if (d >= week4Start) spending.prev3[cat] = (spending.prev3[cat] || 0) + amt;
  });

  const alerts = [];
  const allCats = new Set([...Object.keys(spending.current), ...Object.keys(spending.prev1), ...Object.keys(spending.prev2), ...Object.keys(spending.prev3)]);

  allCats.forEach(cat => {
    const current = spending.current[cat] || 0;
    const avg = ((spending.prev1[cat] || 0) + (spending.prev2[cat] || 0) + (spending.prev3[cat] || 0)) / 3;
    
    if (avg > 0 && current > 2 * avg) {
      alerts.push({ category: cat, multiplier: (current / avg).toFixed(1) });
    }
  });
  return alerts;
}

function renderAnomalyAlerts() {
  const container = document.getElementById("anomalyAlertsContainer");
  if (!container) return;

  const alerts = getAnomalyAlerts();
  const budgetAlerts = checkBudgetAlerts();

  container.innerHTML = "";
  if (alerts.length === 0 && budgetAlerts.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); font-size:14px;">Your spending looks normal. No alerts for now.</p>`;
    return;
  }

  budgetAlerts.forEach(a => {
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.marginBottom = "8px";
    div.style.borderRadius = "8px";
    div.style.background = a.type === 'critical' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(245, 158, 11, 0.1)';
    div.style.borderLeft = `4px solid ${a.type === 'critical' ? 'var(--error)' : '#f59e0b'}`;
    div.style.fontSize = "14px";
    div.innerHTML = `<strong>Budget ${a.type === 'critical' ? 'Exceeded' : 'Warning'}:</strong> ${a.category} (${(a.spent/a.limit*100).toFixed(0)}%)`;
    container.appendChild(div);
  });

  alerts.forEach(a => {
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.marginBottom = "8px";
    div.style.borderRadius = "8px";
    div.style.background = "rgba(59, 130, 246, 0.1)";
    div.style.borderLeft = "4px solid #3b82f6";
    div.style.fontSize = "14px";
    div.innerHTML = `<strong>Spending Anomaly:</strong> You spent <strong>${a.multiplier}x</strong> more on <strong>${a.category}</strong> than usual.`;
    container.appendChild(div);
  });
}

/* ---------- NAVIGATION ---------- */
function updateNavigation() {
  const nav = document.querySelector(".sidebar nav");
  if (!nav) return;

  // New items to add
  const extraItems = [
    { name: "Calendar", href: "calendar.html", icon: "📅" },
    { name: "Splits", href: "splits.html", icon: "👥" },
    { name: "Goals", href: "goals.html", icon: "🎯" },
    { name: "Report", href: "report.html", icon: "📊" }
  ];

  const currentPath = window.location.pathname.split("/").pop();

  // Find the 'Bills' link and insert after it, or append
  const links = Array.from(nav.querySelectorAll("a"));
  const logoutLink = links.find(l => l.classList.contains("logout-link"));

  extraItems.forEach(item => {
    // Check if already exists
    if (nav.querySelector(`a[href="${item.href}"]`)) return;

    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.name;
    if (currentPath === item.href) a.className = "active";

    if (logoutLink) {
      nav.insertBefore(a, logoutLink);
    } else {
      nav.appendChild(a);
    }
  });
}

/* ---------- INITIALIZATION ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Seed transactions if needed
  getTransactions();
  // Update sidebar on all pages
  updateNavigation();
  // Render transactions if on transactions page
  renderTransactions("transactionsBody");
  // Render calendar if on calendar page
  renderCalendar();
  // Render splits if on splits page
  renderSplits();
  // Render net worth if on dashboard
  renderNetWorth();
  // Render anomalies if on dashboard
  renderAnomalyAlerts();
  // Check for budget blockage
  if (!sessionStorage.getItem("budget_acknowledged")) {
    checkBlockedView();
  }
});
