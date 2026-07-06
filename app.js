// Global State Management
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let currentCurrency = localStorage.getItem('currentCurrency') || 'USD';
let monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 2000.00;
let gitHubLink = localStorage.getItem('gitHubLink') || '';

// Currency Config Map
const currencyConfigs = {
  USD: { symbol: '$', name: 'Dollars ($)' },
  INR: { symbol: '₹', name: 'Rupees (₹)' },
  EUR: { symbol: '€', name: 'Euros (€)' },
  GBP: { symbol: '£', name: 'Pounds (£)' }
};

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseIdInput = document.getElementById('expense-id');
const amountInput = document.getElementById('expense-amount');
const categoryInput = document.getElementById('expense-category');
const dateInput = document.getElementById('expense-date');
const locationInput = document.getElementById('expense-location');
const descInput = document.getElementById('expense-desc');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Currency Labels
const amountLabelSymbol = document.getElementById('amount-label-symbol');
const amountPrefixSymbol = document.getElementById('amount-prefix-symbol');
const currencySelect = document.getElementById('currency-select');
const budgetModalSymbol = document.getElementById('budget-modal-symbol');
const budgetPrefixSymbol = document.getElementById('budget-prefix-symbol');

// Dashboard Stats
const monthlyTotalEl = document.getElementById('monthly-total');
const yearlyTotalEl = document.getElementById('yearly-total');
const budgetRemainingEl = document.getElementById('budget-remaining');
const budgetProgressBar = document.getElementById('budget-progress-bar');
const budgetProgressText = document.getElementById('budget-progress-text');
const transactionCountEl = document.getElementById('transaction-count');
const budgetDisplayVal = document.getElementById('budget-display-val');

// Lists and Filters
const expensesList = document.getElementById('expenses-list');
const emptyState = document.getElementById('empty-state');
const registerCountBadge = document.getElementById('register-count-badge');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const filterStartDate = document.getElementById('filter-start-date');
const filterEndDate = document.getElementById('filter-end-date');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

// Modals
const budgetModal = document.getElementById('budget-modal');
const editBudgetBtn = document.getElementById('edit-budget-btn');
const closeBudgetModal = document.getElementById('close-budget-modal');
const cancelBudgetBtn = document.getElementById('cancel-budget-btn');
const saveBudgetBtn = document.getElementById('save-budget-btn');
const budgetAmountInput = document.getElementById('budget-amount-input');

// Theme Toggle Button
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Initialize lucide icons
  if (window.lucide) window.lucide.createIcons();
  
  // Set initial currency dropdown value
  currencySelect.value = currentCurrency;
  
  // Load UI components
  updateCurrencyUI();
  renderDashboard();
  
  // Form Submit Event Handler (Prevents Page Reload)
  expenseForm.addEventListener('submit', handleFormSubmit);
  
  // Currency Change Listener
  currencySelect.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem('currentCurrency', currentCurrency);
    updateCurrencyUI();
    renderDashboard();
    showToast('Currency updated successfully!');
  });

  // Theme Toggle Event Listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
      }
    });
  }

  // --- Magic Bento Mouse Spotlight Tracking Trigger ---
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Filter Event Listeners
  searchInput.addEventListener('input', renderDashboard);
  filterCategory.addEventListener('change', renderDashboard);
  filterStartDate.addEventListener('change', renderDashboard);
  filterEndDate.addEventListener('change', renderDashboard);
  clearFiltersBtn.addEventListener('click', clearFilters);

  // Budget Modal Listeners
  editBudgetBtn.addEventListener('click', openBudgetModal);
  closeBudgetModal.addEventListener('click', () => budgetModal.classList.add('hidden'));
  cancelBudgetBtn.addEventListener('click', () => budgetModal.classList.add('hidden'));
  saveBudgetBtn.addEventListener('click', handleSaveBudget);
  
  cancelEditBtn.addEventListener('click', resetForm);
});

// Format Money Utility
function formatMoney(amount) {
  const symbol = currencyConfigs[currentCurrency].symbol;
  return `${symbol}${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Update UI Text Elements for Currency Symbols
function updateCurrencyUI() {
  const symbol = currencyConfigs[currentCurrency].symbol;
  if (amountLabelSymbol) amountLabelSymbol.textContent = symbol;
  if (amountPrefixSymbol) amountPrefixSymbol.textContent = symbol;
  if (budgetModalSymbol) budgetModalSymbol.textContent = symbol;
  if (budgetPrefixSymbol) budgetPrefixSymbol.textContent = symbol;
}

// Form Validation and Submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  let hasError = false;
  
  if (!amountInput.value || parseFloat(amountInput.value) <= 0) {
    document.getElementById('amount-error').style.display = 'block';
    hasError = true;
  } else {
    document.getElementById('amount-error').style.display = 'none';
  }

  if (!categoryInput.value) {
    document.getElementById('category-error').style.display = 'block';
    hasError = true;
  } else {
    document.getElementById('category-error').style.display = 'none';
  }

  if (!dateInput.value) {
    document.getElementById('date-error').style.display = 'block';
    hasError = true;
  } else {
    document.getElementById('date-error').style.display = 'none';
  }

  if (!locationInput.value.trim()) {
    document.getElementById('location-error').style.display = 'block';
    hasError = true;
  } else {
    document.getElementById('location-error').style.display = 'none';
  }

  if (!descInput.value.trim()) {
    document.getElementById('desc-error').style.display = 'block';
    hasError = true;
  } else {
    document.getElementById('desc-error').style.display = 'none';
  }

  if (hasError) return;

  const expenseData = {
    id: expenseIdInput.value || Date.now().toString(),
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    date: dateInput.value,
    location: locationInput.value.trim(),
    description: descInput.value.trim()
  };

  if (expenseIdInput.value) {
    expenses = expenses.map(exp => exp.id === expenseData.id ? expenseData : exp);
    showToast('Expense updated successfully!');
  } else {
    expenses.push(expenseData);
    showToast('Expense added successfully!');
  }

  localStorage.setItem('expenses', JSON.stringify(expenses));
  resetForm();
  renderDashboard();
}

// Reset Form State
function resetForm() {
  expenseForm.reset();
  expenseIdInput.value = '';
  submitBtn.textContent = 'Save Expense';
  cancelEditBtn.classList.add('hidden');
  document.getElementById('form-title').innerHTML = '<i data-lucide="plus-circle"></i> Log Expense';
  if (window.lucide) window.lucide.createIcons();
}

// Render Table Logs and Stats Cards
function renderDashboard() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let monthlyTotal = 0;
  let yearlyTotal = 0;

  expenses.forEach(exp => {
    const expDate = new Date(exp.date);
    if (expDate.getFullYear() === currentYear) {
      yearlyTotal += exp.amount;
      if (expDate.getMonth() === currentMonth) {
        monthlyTotal += exp.amount;
      }
    }
  });

  const searchVal = searchInput.value.toLowerCase();
  const catVal = filterCategory.value;
  const startVal = filterStartDate.value;
  const endVal = filterEndDate.value;

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(searchVal) || exp.location.toLowerCase().includes(searchVal);
    const matchesCategory = catVal === 'all' || exp.category === catVal;
    const matchesStart = !startVal || exp.date >= startVal;
    const matchesEnd = !endVal || exp.date <= endVal;
    return matchesSearch && matchesCategory && matchesStart && matchesEnd;
  });

  filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  monthlyTotalEl.textContent = formatMoney(monthlyTotal);
  yearlyTotalEl.textContent = formatMoney(yearlyTotal);
  budgetDisplayVal.textContent = formatMoney(monthlyBudget);
  transactionCountEl.textContent = expenses.length;

  const remainingBudget = monthlyBudget - monthlyTotal;
  budgetRemainingEl.textContent = formatMoney(remainingBudget);
  
  const progressPercent = Math.min((monthlyTotal / monthlyBudget) * 100, 100);
  budgetProgressBar.style.width = `${progressPercent}%`;
  budgetProgressText.textContent = `${Math.round(progressPercent)}% of budget spent`;

  expensesList.innerHTML = '';
  registerCountBadge.textContent = `${filteredExpenses.length} items`;

  if (filteredExpenses.length === 0) {
    emptyState.style.display = 'flex';
  } else {
    emptyState.style.display = 'none';
    filteredExpenses.forEach(exp => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${exp.date}</td>
        <td><span class="category-badge">${exp.category}</span></td>
        <td>${exp.description}</td>
        <td>${exp.location}</td>
        <td class="font-semibold">${formatMoney(exp.amount)}</td>
        <td class="text-right actions-cell">
          <button class="icon-btn-sm edit-log-btn" data-id="${exp.id}" title="Edit"><i data-lucide="edit-3"></i></button>
          <button class="icon-btn-sm delete-log-btn text-danger" data-id="${exp.id}" title="Delete"><i data-lucide="trash-2"></i></button>
        </td>
      `;
      expensesList.appendChild(tr);
    });

    document.querySelectorAll('.edit-log-btn').forEach(btn => btn.addEventListener('click', handleEditClick));
    document.querySelectorAll('.delete-log-btn').forEach(btn => btn.addEventListener('click', handleDeleteClick));
  }

  if (window.lucide) window.lucide.createIcons();
}

// Edit Log Trigger
function handleEditClick(e) {
  const id = e.currentTarget.getAttribute('data-id');
  const target = expenses.find(exp => exp.id === id);
  if (!target) return;

  expenseIdInput.value = target.id;
  amountInput.value = target.amount;
  categoryInput.value = target.category;
  dateInput.value = target.date;
  locationInput.value = target.location;
  descInput.value = target.description;

  submitBtn.textContent = 'Update Expense';
  cancelEditBtn.classList.remove('hidden');
  document.getElementById('form-title').innerHTML = '<i data-lucide="edit"></i> Edit Expense';
  if (window.lucide) window.lucide.createIcons();
  
  document.querySelector('.sidebar-panel').scrollIntoView({ behavior: 'smooth' });
}

// Delete Log Event
function handleDeleteClick(e) {
  const id = e.currentTarget.getAttribute('data-id');
  if (confirm('Are you sure you want to delete this expense log?')) {
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderDashboard();
    showToast('Expense log removed.');
  }
}

// Clear Filters Engine
function clearFilters() {
  searchInput.value = '';
  filterCategory.value = 'all';
  filterStartDate.value = '';
  filterEndDate.value = '';
  renderDashboard();
  showToast('Active filters cleared.');
}

// Budget Modification Handlers
function openBudgetModal() {
  budgetAmountInput.value = monthlyBudget;
  budgetModal.classList.remove('hidden');
}

function handleSaveBudget() {
  const amt = parseFloat(budgetAmountInput.value);
  if (!amt || amt < 1) {
    document.getElementById('budget-error').style.display = 'block';
    return;
  }
  document.getElementById('budget-error').style.display = 'none';
  monthlyBudget = amt;
  localStorage.setItem('monthlyBudget', monthlyBudget);
  budgetModal.classList.add('hidden');
  renderDashboard();
  showToast('Monthly target limit revised.');
}

// Toast Notification Mechanism
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast-alert card glass-card';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}