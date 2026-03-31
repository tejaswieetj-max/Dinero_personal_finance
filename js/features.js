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

/* ---------- INITIALIZATION ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Seed transactions if needed
  getTransactions();
});
