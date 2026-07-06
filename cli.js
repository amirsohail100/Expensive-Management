#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI escape codes for beautiful styling
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  underline: '\x1b[4m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  bgBlue: '\x1b[44m',
  white: '\x1b[37m'
};

const printBanner = () => {
  console.log(`
${colors.bold}${colors.cyan}   ___        _   _       ____                 _ _        
  / _ \\ _ __ | |_(_)     / ___|_ __ __ ___   _(_) |_ _   _ 
 | | | | '_ \\| __| |    | |  _| '__/ _\` \\ \\ / / | __| | | |
 | |_| | | | | |_| |    | |_| | | | (_| |\\ V /| | |_| |_| |
  \\___/|_| |_|\\__|_|     \\____|_|  \\__,_| \\_/ |_|\\__|\\__, |
                                                     |___/ 
${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}   🛰️  Scaffold Tool: Expensive Management App Generator${colors.reset}`);
  console.log(`${colors.dim}------------------------------------------------------------${colors.reset}\n`);
};

// --- TEMPLATES DEFINITION ---

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expensive Management | Dashboard</title>
  <meta name="description" content="A modern, high-performance, glassmorphism expense manager web app called Expensive Management">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
  <link rel="stylesheet" href="styles.css">
</head>
<body class="dark-mode">
  <div class="app-layout">
    
    <!-- Top Header -->
    <header class="app-header">
      <div class="header-logo">
        <div class="logo-icon">
          <i data-lucide="orbit"></i>
        </div>
        <div class="logo-text">
          <h1>Expensive Management</h1>
          <span class="subtext">Expense Management</span>
        </div>
      </div>
      
      <div class="header-actions">
        <!-- Project Github badge container -->
        <div id="github-badge-container" class="github-badge-container"></div>
        
        <!-- Theme Toggle -->
        <button id="theme-toggle-btn" class="icon-btn" aria-label="Toggle Theme">
          <i data-lucide="sun" class="sun-icon"></i>
          <i data-lucide="moon" class="moon-icon"></i>
        </button>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="app-main">
      <div class="main-grid">
        
        <!-- Sidebar Panel: Inputs and Configurations -->
        <aside class="sidebar-panel">
          
          <!-- Expense Form Card -->
          <div class="card glass-card form-card">
            <div class="card-header">
              <h2 id="form-title"><i data-lucide="plus-circle"></i> Log Expense</h2>
              <p class="card-subtitle">Keep track of your financial outflows</p>
            </div>
            
            <form id="expense-form" novalidate>
              <input type="hidden" id="expense-id">
              
              <div class="form-group">
                <label for="expense-amount">Amount (<span id="amount-label-symbol">$</span>)</label>
                <div class="input-wrapper prefix-wrapper">
                  <span class="input-prefix" id="amount-prefix-symbol">$</span>
                  <input type="number" id="expense-amount" placeholder="0.00" step="0.01" min="0.01" required>
                </div>
                <div class="error-msg" id="amount-error">Enter a valid amount greater than 0</div>
              </div>

              <div class="form-group">
                <label for="expense-category">Category</label>
                <select id="expense-category" required>
                  <option value="" disabled selected>Select category</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Travel & Transport">Travel & Transport</option>
                  <option value="Utilities & Rent">Utilities & Rent</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Education">Education</option>
                  <option value="Others">Others</option>
                </select>
                <div class="error-msg" id="category-error">Please select a category</div>
              </div>

              <div class="form-group">
                <label for="expense-date">Date</label>
                <input type="date" id="expense-date" required>
                <div class="error-msg" id="date-error">Select a valid date</div>
              </div>

              <div class="form-group">
                <label for="expense-location">Location / Merchant</label>
                <div class="input-wrapper">
                  <i data-lucide="map-pin" class="input-icon"></i>
                  <input type="text" id="expense-location" placeholder="e.g., Target, Airport" required>
                </div>
                <div class="error-msg" id="location-error">Location is required</div>
              </div>

              <div class="form-group">
                <label for="expense-desc">Description</label>
                <div class="input-wrapper">
                  <i data-lucide="align-left" class="input-icon"></i>
                  <input type="text" id="expense-desc" placeholder="e.g., Weekly groceries, Flight ticket" required>
                </div>
                <div class="error-msg" id="desc-error">Description is required</div>
              </div>

              <div class="form-actions">
                <button type="button" id="cancel-edit-btn" class="btn btn-secondary hidden">Cancel</button>
                <button type="submit" id="submit-btn" class="btn btn-primary">Save Expense</button>
              </div>
            </form>
          </div>

          <!-- Configuration and Settings Card -->
          <div class="card glass-card config-card">
            <h2 class="section-title"><i data-lucide="sliders"></i> Settings</h2>
            
            <div class="config-item">
              <div class="config-info">
                <span class="config-label">Monthly Target Budget</span>
                <span id="budget-display-val" class="config-value">$2,000.00</span>
              </div>
              <button id="edit-budget-btn" class="btn-sm btn-outline"><i data-lucide="edit-3"></i> Edit</button>
            </div>

            <div class="config-item">
              <div class="config-info">
                <span class="config-label">Project GitHub Link</span>
                <span id="github-display-val" class="config-value text-truncate">Not Set</span>
              </div>
              <button id="edit-github-btn" class="btn-sm btn-outline"><i data-lucide="link-2"></i> Configure</button>
            </div>

            <div class="config-item">
              <div class="config-info">
                <span class="config-label">Global Currency</span>
                <select id="currency-select" class="currency-select-dropdown" aria-label="Select Currency">
                  <option value="USD">Dollars ($)</option>
                  <option value="INR">Rupees (₹)</option>
                  <option value="EUR">Euros (€)</option>
                  <option value="GBP">Pounds (£)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Quick Shopping Links Card -->
          <div class="card glass-card shopping-card">
            <h2 class="section-title"><i data-lucide="shopping-cart"></i> Quick Shopping</h2>
            <p class="card-subtitle">Direct links to popular platforms</p>
            <div class="shopping-links-grid">
              <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" class="shopping-btn btn-amazon">
                <i data-lucide="external-link"></i> Amazon
              </a>
              <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" class="shopping-btn btn-flipkart">
                <i data-lucide="external-link"></i> Flipkart
              </a>
              <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" class="shopping-btn btn-myntra">
                <i data-lucide="external-link"></i> Myntra
              </a>
              <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" class="shopping-btn btn-meesho">
                <i data-lucide="external-link"></i> Meesho
              </a>
            </div>
          </div>
          
        </aside>

        <!-- Main Dashboard Column -->
        <section class="dashboard-panel">
          
          <!-- Key Metrics / Stats Row -->
          <div class="stats-grid">
            
            <!-- Month spend -->
            <div class="stat-card card glass-card">
              <div class="stat-header">
                <span class="stat-label">This Month</span>
                <div class="stat-icon icon-monthly">
                  <i data-lucide="calendar"></i>
                </div>
              </div>
              <div class="stat-content">
                <h3 id="monthly-total">$0.00</h3>
                <span class="stat-subtext" id="monthly-compare">Current billing period</span>
              </div>
            </div>

            <!-- Year spend -->
            <div class="stat-card card glass-card">
              <div class="stat-header">
                <span class="stat-label">This Year</span>
                <div class="stat-icon icon-yearly">
                  <i data-lucide="line-chart"></i>
                </div>
              </div>
              <div class="stat-content">
                <h3 id="yearly-total">$0.00</h3>
                <span class="stat-subtext">Cumulative yearly spending</span>
              </div>
            </div>

            <!-- Budget remaining -->
            <div class="stat-card card glass-card" id="budget-stat-card">
              <div class="stat-header">
                <span class="stat-label" id="budget-card-label">Budget Limit Status</span>
                <div class="stat-icon icon-budget" id="budget-status-icon">
                  <i data-lucide="wallet"></i>
                </div>
              </div>
              <div class="stat-content">
                <h3 id="budget-remaining">$0.00</h3>
                <div class="budget-progress-container">
                  <div class="budget-progress-bar" id="budget-progress-bar"></div>
                </div>
                <span class="stat-subtext" id="budget-progress-text">0% of budget spent</span>
              </div>
            </div>

            <!-- Total Transactions logged -->
            <div class="stat-card card glass-card">
              <div class="stat-header">
                <span class="stat-label">Total Logs</span>
                <div class="stat-icon icon-transactions">
                  <i data-lucide="hash"></i>
                </div>
              </div>
              <div class="stat-content">
                <h3 id="transaction-count">0</h3>
                <span class="stat-subtext">Expenses logged on device</span>
              </div>
            </div>
            
          </div>

          <!-- Interactive Analytics Charts Grid -->
          <div class="charts-grid">
            
            <div class="chart-card card glass-card">
              <h3>Category Share</h3>
              <div class="chart-container">
                <canvas id="category-chart"></canvas>
                <div id="category-chart-empty" class="chart-empty">
                  <i data-lucide="pie-chart"></i>
                  <span>No data to display. Add expenses to generate insights.</span>
                </div>
              </div>
            </div>

            <div class="chart-card card glass-card">
              <h3>Monthly Expense Trend</h3>
              <div class="chart-container">
                <canvas id="history-chart"></canvas>
                <div id="history-chart-empty" class="chart-empty">
                  <i data-lucide="trending-up"></i>
                  <span>No data to display. Add expenses to generate insights.</span>
                </div>
              </div>
            </div>
            
          </div>

          <!-- Main List / Register Card -->
          <div class="card glass-card register-card">
            
            <div class="register-header">
              <div class="register-title-section">
                <h3>Expense Register</h3>
                <span class="register-count" id="register-count-badge">0 items</span>
              </div>
              
              <div class="register-filters">
                <div class="search-box">
                  <i data-lucide="search"></i>
                  <input type="text" id="search-input" placeholder="Search description, location...">
                </div>

                <div class="filter-controls">
                  <select id="filter-category" aria-label="Category Filter">
                    <option value="all">All Categories</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Travel & Transport">Travel & Transport</option>
                    <option value="Utilities & Rent">Utilities & Rent</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Education">Education</option>
                    <option value="Others">Others</option>
                  </select>

                  <div class="date-range-picker">
                    <input type="date" id="filter-start-date" aria-label="Start Date">
                    <span class="range-to">to</span>
                    <input type="date" id="filter-end-date" aria-label="End Date">
                  </div>

                  <button id="clear-filters-btn" class="btn-sm btn-icon" title="Clear Filters" aria-label="Clear Filters">
                    <i data-lucide="filter-x"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="table-container">
              <table id="expenses-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Amount</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody id="expenses-list">
                  <!-- JS inserts list here -->
                </tbody>
              </table>

              <!-- Empty state wrapper -->
              <div id="empty-state" class="empty-state">
                <div class="empty-icon">
                  <i data-lucide="receipt"></i>
                </div>
                <h4>No Logged Expenses</h4>
                <p>Add expenses using the log form or reset active search filters to refresh the view.</p>
              </div>
            </div>
          </div>
          
        </section>
      </div>
    </main>

    <!-- Permanent Footer -->
    <footer class="app-footer">
      <div class="footer-info">
        <p>📡 Scaffolded via <strong>anti-gravity</strong> CLI</p>
      </div>
      <div class="footer-action">
        <a href="https://github.com/amirsohail100" target="_blank" rel="noopener noreferrer" class="btn-profile">
          <i data-lucide="github"></i> Developer Profile
        </a>
      </div>
    </footer>
  </div>

  <!-- Modal: Configure GitHub Repo -->
  <div id="github-modal" class="modal-backdrop hidden">
    <div class="modal card glass-card">
      <div class="modal-header">
        <h3>GitHub Project Repository</h3>
        <button id="close-github-modal" class="icon-btn-sm" aria-label="Close Modal"><i data-lucide="x"></i></button>
      </div>
      <div class="modal-body">
        <p class="modal-desc">Adding your repository URL links this local interface to your online source code, showing a link dynamically in the header.</p>
        <div class="form-group">
          <label for="github-url-input">GitHub Repository URL</label>
          <div class="input-wrapper">
            <i data-lucide="github" class="input-icon"></i>
            <input type="url" id="github-url-input" placeholder="https://github.com/username/repository" required>
          </div>
          <div class="error-msg" id="github-error">Invalid URL. Must begin with http:// or https://</div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="clear-github-btn" class="btn btn-danger-outline">Disconnect Link</button>
        <button id="save-github-btn" class="btn btn-primary">Save Repository</button>
      </div>
    </div>
  </div>

  <!-- Modal: Edit Monthly Spending Limit -->
  <div id="budget-modal" class="modal-backdrop hidden">
    <div class="modal card glass-card">
      <div class="modal-header">
        <h3>Edit Monthly Spending Limit</h3>
        <button id="close-budget-modal" class="icon-btn-sm" aria-label="Close Modal"><i data-lucide="x"></i></button>
      </div>
      <div class="modal-body">
        <p class="modal-desc">Configure a target monthly budget. The remaining budget card and progress indicator will dynamically react as expenses are logged.</p>
        <div class="form-group">
          <label for="budget-amount-input">Target Budget Limit (<span id="budget-modal-symbol">$</span>)</label>
          <div class="input-wrapper prefix-wrapper">
            <span class="input-prefix" id="budget-prefix-symbol">$</span>
            <input type="number" id="budget-amount-input" placeholder="2000.00" min="1" step="10" required>
          </div>
          <div class="error-msg" id="budget-error">Budget must be at least $1.</div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="cancel-budget-btn" class="btn btn-secondary">Cancel</button>
        <button id="save-budget-btn" class="btn btn-primary">Save Budget Limit</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div id="toast-container" class="toast-container"></div>
  
  <script src="app.js"></script>
</body>
</html>`;

const cssTemplate = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  
  /* Dark Mode Palette Default */
  --bg-base: #080b11;
  --bg-surface: #101622;
  --bg-surface-hover: #172032;
  --border-color: rgba(255, 255, 255, 0.08);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  
  --primary: #8b5cf6;
  --primary-rgb: 139, 92, 246;
  --primary-hover: #7c3aed;
  --success: #10b981;
  --success-rgb: 16, 185, 129;
  --warning: #f59e0b;
  --danger: #ef4444;
  --danger-rgb: 239, 68, 68;
  
  --shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6);
  --shadow-sm: 0 4px 12px -2px rgba(0, 0, 0, 0.3);
  --transition: all 0.3s ease;
  --glass-bg: rgba(16, 22, 34, 0.7);
}

body.light-mode {
  /* Light Mode Palette */
  --bg-base: #f3f4f6;
  --bg-surface: #ffffff;
  --bg-surface-hover: #f9fafb;
  --border-color: rgba(0, 0, 0, 0.08);
  --text-main: #1f2937;
  --text-muted: #6b7280;
  
  --primary: #6366f1;
  --primary-rgb: 99, 102, 241;
  --primary-hover: #4f46e5;
  --success: #10b981;
  --success-rgb: 16, 185, 129;
  --warning: #d97706;
  --danger: #dc2626;
  --danger-rgb: 220, 38, 38;
  
  --shadow: 0 12px 30px -10px rgba(99, 102, 241, 0.08);
  --shadow-sm: 0 4px 12px -2px rgba(99, 102, 241, 0.03);
  --glass-bg: rgba(255, 255, 255, 0.8);
}

/* Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-base);
  color: var(--text-main);
  transition: var(--transition);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Layout */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  z-index: 10;
  transition: var(--transition);
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, var(--primary), #d946ef);
  color: #fff;
  border-radius: 10px;
}

.logo-text h1 {
  font-size: 1.2rem;
  line-height: 1.2;
}

.logo-text .subtext {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

/* GitHub Display badge */
.github-badge-container {
  display: flex;
  align-items: center;
}

.github-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  font-size: 0.8rem;
  color: var(--text-main);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.github-pill:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
}

.github-pill i {
  color: var(--text-main);
}

.github-pill-edit {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.2rem;
  margin-left: 0.25rem;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: var(--transition);
}

.github-pill-edit:hover {
  color: var(--primary);
  background: rgba(255, 255, 255, 0.05);
  transform: scale(1.1);
}

/* App Main Content */
.app-main {
  flex-grow: 1;
  padding: 2rem;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}

.main-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

/* Card General Styling */
.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

/* SLEEK HOVER INTERACTION FOR CARDS */
.card:hover {
  transform: translateY(-3px);
  border-color: rgba(var(--primary-rgb), 0.35);
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.4);
}

body.light-mode .card:hover {
  box-shadow: 0 16px 36px -8px rgba(99, 102, 241, 0.08);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.card-header {
  margin-bottom: 1.25rem;
}

.card-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* Inputs and Forms */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--text-muted);
  pointer-events: none;
}

.input-wrapper input {
  padding-left: 2.5rem;
}

.prefix-wrapper {
  position: relative;
}

.input-prefix {
  position: absolute;
  left: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
}

.prefix-wrapper input {
  padding-left: 2rem;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-main);
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
  outline: none;
}

body.light-mode input, 
body.light-mode select {
  background-color: #f1f5f9;
}

/* INPUT HOVER EFFECTS */
input:hover, select:hover, textarea:hover {
  border-color: rgba(var(--primary-rgb), 0.45);
  background-color: rgba(255, 255, 255, 0.03);
}

body.light-mode input:hover, body.light-mode select:hover {
  background-color: #f8fafc;
}

input:focus, select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.15);
  background-color: rgba(0, 0, 0, 0.2);
}

body.light-mode input:focus, body.light-mode select:focus {
  background-color: #ffffff;
}

.error-msg {
  display: none;
  font-size: 0.75rem;
  color: var(--danger);
  margin-top: 0.35rem;
  font-weight: 500;
}

.form-group.has-error .error-msg {
  display: block;
}

.form-group.has-error input,
.form-group.has-error select {
  border-color: var(--danger) !important;
  box-shadow: 0 0 0 3px rgba(var(--danger-rgb), 0.1) !important;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  gap: 0.5rem;
}

.btn-primary {
  background-color: var(--primary);
  color: #fff;
}

/* BUTTON HOVER EFFECTS */
.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--primary-rgb), 0.3);
}

.btn-primary:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.2);
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.btn-danger-outline {
  background: transparent;
  color: var(--danger);
  border: 1px solid rgba(var(--danger-rgb), 0.2);
}

.btn-danger-outline:hover {
  background-color: rgba(var(--danger-rgb), 0.1);
  border-color: var(--danger);
  transform: translateY(-1px);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-main);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.1);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
}

.btn-icon:hover {
  color: var(--text-main);
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.form-actions button {
  flex-grow: 1;
}

.hidden {
  display: none !important;
}

/* Settings and Configuration Card */
.config-card h2 {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--border-color);
}

.config-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.config-info {
  display: flex;
  flex-direction: column;
  max-width: 60%;
}

.config-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.config-value {
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.15rem;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Global Currency Dropdown Select Styling */
.currency-select-dropdown {
  width: auto;
  min-width: 120px;
  padding: 0.35rem 0.65rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-main);
  font-family: var(--font-family);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: var(--transition);
}

body.light-mode .currency-select-dropdown {
  background-color: #f1f5f9;
}

.currency-select-dropdown:hover {
  border-color: var(--primary);
}

.currency-select-dropdown:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.15);
}

/* Quick Shopping links grid design */
.shopping-card {
  margin-top: 0rem;
}

.shopping-card h2 {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.shopping-links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.shopping-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.65rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition: var(--transition);
}

/* BRAND COLOR DEFINITIONS WITH GLASS EFFECTS */
.btn-amazon {
  background: rgba(255, 153, 0, 0.08);
  border: 1px solid rgba(255, 153, 0, 0.25);
  color: #ff9900;
}
.btn-amazon:hover {
  background: rgba(255, 153, 0, 0.18);
  border-color: #ff9900;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.15);
}

.btn-flipkart {
  background: rgba(40, 116, 240, 0.08);
  border: 1px solid rgba(40, 116, 240, 0.25);
  color: #2874f0;
}
.btn-flipkart:hover {
  background: rgba(40, 116, 240, 0.18);
  border-color: #2874f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 116, 240, 0.15);
}

.btn-myntra {
  background: rgba(255, 63, 108, 0.08);
  border: 1px solid rgba(255, 63, 108, 0.25);
  color: #ff3f6c;
}
.btn-myntra:hover {
  background: rgba(255, 63, 108, 0.18);
  border-color: #ff3f6c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 63, 108, 0.15);
}

.btn-meesho {
  background: rgba(244, 51, 151, 0.08);
  border: 1px solid rgba(244, 51, 151, 0.25);
  color: #f43397;
}
.btn-meesho:hover {
  background: rgba(244, 51, 151, 0.18);
  border-color: #f43397;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 51, 151, 0.15);
}

/* Stats Dashboard Panel */
.dashboard-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
}

.icon-monthly {
  background: rgba(139, 92, 246, 0.15);
  color: var(--primary);
}

.icon-yearly {
  background: rgba(217, 70, 239, 0.15);
  color: #d946ef;
}

.icon-budget {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.icon-budget.budget-warning {
  background: rgba(245, 158, 11, 0.15);
  color: var(--warning);
  animation: pulse 2s infinite;
}

.icon-budget.budget-danger {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
  animation: shake 0.5s ease-in-out infinite;
}

.icon-transactions {
  background: rgba(14, 165, 233, 0.15);
  color: #0ea5e9;
}

.stat-content h3 {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.1;
}

.stat-subtext {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.budget-progress-container {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 0.5rem;
}

body.light-mode .budget-progress-container {
  background: rgba(0, 0, 0, 0.05);
}

.budget-progress-bar {
  height: 100%;
  background-color: var(--success);
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 0%;
}

.budget-progress-bar.warning {
  background-color: var(--warning);
}

.budget-progress-bar.danger {
  background-color: var(--danger);
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.chart-card h3 {
  font-size: 1rem;
}

.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  padding: 1.5rem;
}

.chart-empty i {
  width: 2.5rem;
  height: 2.5rem;
  stroke-width: 1.5;
}

.chart-empty span {
  font-size: 0.8rem;
  max-width: 200px;
}

/* Register Register Details */
.register-card {
  padding: 0;
  overflow: hidden;
}

.register-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.register-count {
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.register-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.search-box {
  position: relative;
  flex-grow: 2;
  min-width: 220px;
}

.search-box i {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: var(--text-muted);
}

.search-box input {
  padding-left: 2.5rem;
}

.filter-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  flex-grow: 1;
}

.filter-controls select {
  width: auto;
  min-width: 150px;
}

.date-range-picker {
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 0.5rem;
  gap: 0.5rem;
  height: 42px;
}

body.light-mode .date-range-picker {
  background-color: #f1f5f9;
}

.date-range-picker input {
  border: none;
  background: transparent;
  padding: 0 0.25rem;
  width: 120px;
  height: 100%;
}

.date-range-picker input:focus {
  box-shadow: none;
}

.range-to {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* Expenses Register Table */
.table-container {
  overflow-x: auto;
  position: relative;
  min-height: 200px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-color);
}

body.light-mode th {
  background-color: rgba(0, 0, 0, 0.02);
}

td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;
}

tr:last-child td {
  border-bottom: none;
}

tr {
  transition: var(--transition);
}

tr:hover td {
  background-color: rgba(255, 255, 255, 0.01);
}

body.light-mode tr:hover td {
  background-color: rgba(0, 0, 0, 0.01);
}

.text-right {
  text-align: right;
}

.expense-amount-val {
  font-family: var(--font-family);
  font-weight: 700;
  color: var(--text-main);
}

/* Category Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-food {
  background-color: rgba(249, 115, 22, 0.15);
  color: #f97316;
}

.badge-shopping {
  background-color: rgba(236, 72, 153, 0.15);
  color: #ec4899;
}

.badge-travel {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.badge-utilities {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.badge-entertainment {
  background-color: rgba(168, 85, 247, 0.15);
  color: #a855f7;
}

.badge-health {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.badge-education {
  background-color: rgba(14, 165, 233, 0.15);
  color: #0ea5e9;
}

.badge-others {
  background-color: rgba(107, 114, 128, 0.15);
  color: #94a3b8;
}

/* Action buttons in rows */
.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.icon-btn-sm {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
}

.icon-btn-sm:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
  border-color: var(--border-color);
  transform: scale(1.1);
}

.btn-edit-row:hover {
  color: var(--primary);
  border-color: rgba(var(--primary-rgb), 0.2);
}

.btn-delete-row:hover {
  color: var(--danger);
  border-color: rgba(var(--danger-rgb), 0.2);
}

/* Empty State Table */
.empty-state {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.empty-icon i {
  width: 1.75rem;
  height: 1.75rem;
  stroke-width: 1.5;
}

.empty-state h4 {
  font-size: 1rem;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.empty-state p {
  font-size: 0.8rem;
  max-width: 300px;
}

/* Modal Backdrops */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  transition: var(--transition);
}

.modal {
  width: 100%;
  max-width: 480px;
  padding: 1.75rem;
  border-radius: 16px;
  animation: modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.modal-footer button {
  flex-grow: 1;
}

/* Toast System */
.toast-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 200;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary);
  border-radius: 10px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
  color: var(--text-main);
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 280px;
  max-width: 400px;
  animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: var(--transition);
}

.toast-success {
  border-left-color: var(--success);
}

.toast-error {
  border-left-color: var(--danger);
}

.toast-info {
  border-left-color: var(--primary);
}

.toast-icon {
  flex-shrink: 0;
  width: 1.2rem;
  height: 1.2rem;
}

.toast-success .toast-icon { color: var(--success); }
.toast-error .toast-icon { color: var(--danger); }
.toast-info .toast-icon { color: var(--primary); }

.toast-fadeout {
  opacity: 0;
  transform: translateY(-8px);
}

/* Global Footer styling */
.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  transition: var(--transition);
}

.footer-info p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.btn-profile {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #1b202c, #111520);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

body.light-mode .btn-profile {
  background: linear-gradient(135deg, #24292e, #1f2327);
}

.btn-profile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  border-color: var(--primary);
}

.btn-profile i {
  color: #fff;
}

/* Icon Buttons General */
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-main);
  cursor: pointer;
  transition: var(--transition);
}

.icon-btn:hover {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.sun-icon { display: none; }
body.light-mode .sun-icon { display: block; }
body.light-mode .moon-icon { display: none; }

/* Animations */
@keyframes modalScaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
`;

const jsTemplate = `document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  let budget = parseFloat(localStorage.getItem('monthlyBudget')) || 2000.00;
  let githubLink = localStorage.getItem('projectGithubLink') || '';
  let theme = localStorage.getItem('appTheme') || 'dark';
  let currentCurrency = localStorage.getItem('appCurrency') || 'USD';
  
  // Global Currency Symbol State
  const currencySymbols = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£'
  };
  let currentCurrencySymbol = currencySymbols[currentCurrency] || '$';
  let currentEditId = null;

  // Charts references
  let categoryChartInstance = null;
  let historyChartInstance = null;

  // --- DOM ELEMENTS ---
  const expenseForm = document.getElementById('expense-form');
  const expenseIdInput = document.getElementById('expense-id');
  const amountInput = document.getElementById('expense-amount');
  const categoryInput = document.getElementById('expense-category');
  const dateInput = document.getElementById('expense-date');
  const locationInput = document.getElementById('expense-location');
  const descInput = document.getElementById('expense-desc');
  
  const submitBtn = document.getElementById('submit-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const formTitle = document.getElementById('form-title');

  // Stats
  const monthlyTotalEl = document.getElementById('monthly-total');
  const yearlyTotalEl = document.getElementById('yearly-total');
  const budgetRemainingEl = document.getElementById('budget-remaining');
  const transactionCountEl = document.getElementById('transaction-count');
  
  const budgetProgressBar = document.getElementById('budget-progress-bar');
  const budgetProgressText = document.getElementById('budget-progress-text');
  const budgetStatusIcon = document.getElementById('budget-status-icon');
  const budgetStatCard = document.getElementById('budget-stat-card');
  const budgetCardLabel = document.getElementById('budget-card-label');

  // Settings displays & selectors
  const budgetDisplayVal = document.getElementById('budget-display-val');
  const githubDisplayVal = document.getElementById('github-display-val');
  const githubBadgeContainer = document.getElementById('github-badge-container');
  const currencySelect = document.getElementById('currency-select');

  // Modals
  const budgetModal = document.getElementById('budget-modal');
  const editBudgetBtn = document.getElementById('edit-budget-btn');
  const closeBudgetModal = document.getElementById('close-budget-modal');
  const cancelBudgetBtn = document.getElementById('cancel-budget-btn');
  const saveBudgetBtn = document.getElementById('save-budget-btn');
  const budgetAmountInput = document.getElementById('budget-amount-input');
  const budgetError = document.getElementById('budget-error');

  const githubModal = document.getElementById('github-modal');
  const editGithubBtn = document.getElementById('edit-github-btn');
  const closeGithubModal = document.getElementById('close-github-modal');
  const clearGithubBtn = document.getElementById('clear-github-btn');
  const saveGithubBtn = document.getElementById('save-github-btn');
  const githubUrlInput = document.getElementById('github-url-input');
  const githubError = document.getElementById('github-error');

  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // Filter Register elements
  const searchInput = document.getElementById('search-input');
  const filterCategory = document.getElementById('filter-category');
  const filterStartDate = document.getElementById('filter-start-date');
  const filterEndDate = document.getElementById('filter-end-date');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const expensesList = document.getElementById('expenses-list');
  const emptyState = document.getElementById('empty-state');
  const expensesTable = document.getElementById('expenses-table');
  const registerCountBadge = document.getElementById('register-count-badge');

  // Set default date input value to today
  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    if (dateInput) dateInput.value = today;
  };

  // --- SAFE ICON CREATOR FOR CDN RESILIENCE ---
  const safeCreateIcons = () => {
    try {
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    } catch (e) {
      console.warn("Lucide icons failed to load: ", e);
    }
  };

  // --- THEME SETUP ---
  const applyTheme = (newTheme) => {
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
    theme = newTheme;
    localStorage.setItem('appTheme', newTheme);
    renderCharts(); // Redraw with new theme colors
  };
  
  applyTheme(theme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // --- TOAST NOTIFICATIONS ---
  const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = \`toast toast-\${type}\`;
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';
    
    toast.innerHTML = \`
      <i class="toast-icon" data-lucide="\${iconName}"></i>
      <span class="toast-msg">\${message}</span>
    \`;
    container.appendChild(toast);
    safeCreateIcons();
    
    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 3500);
  };

  // --- MATHS & DATA HELPERS ---
  const formatCurrency = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return currentCurrencySymbol + '0.00';
    return currentCurrencySymbol + num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getCategoryIcon = (category) => {
    const mapping = {
      'Food & Dining': 'utensils',
      'Shopping': 'shopping-bag',
      'Travel & Transport': 'car',
      'Utilities & Rent': 'home',
      'Entertainment': 'film',
      'Health & Fitness': 'heart',
      'Education': 'book',
      'Others': 'credit-card'
    };
    return mapping[category] || 'receipt';
  };

  // --- CURRENCY SYMBOL UPDATE FOR INPUT LABELS ---
  const updateCurrencyLabels = () => {
    const symbol = currentCurrencySymbol;
    
    const amountLabelSymbol = document.getElementById('amount-label-symbol');
    const amountPrefixSymbol = document.getElementById('amount-prefix-symbol');
    const budgetModalSymbol = document.getElementById('budget-modal-symbol');
    const budgetPrefixSymbol = document.getElementById('budget-prefix-symbol');
    
    if (amountLabelSymbol) amountLabelSymbol.textContent = symbol;
    if (amountPrefixSymbol) amountPrefixSymbol.textContent = symbol;
    if (budgetModalSymbol) budgetModalSymbol.textContent = symbol;
    if (budgetPrefixSymbol) budgetPrefixSymbol.textContent = symbol;
  };

  // --- SYNCHRONIZE DATA & VISUALS ---
  const updateSettingsDisplay = () => {
    if (budgetDisplayVal) budgetDisplayVal.textContent = formatCurrency(budget);
    
    if (githubDisplayVal && githubBadgeContainer) {
      if (githubLink) {
        githubDisplayVal.textContent = githubLink;
        githubBadgeContainer.innerHTML = \`
          <a href="\${githubLink}" target="_blank" rel="noopener noreferrer" class="github-pill">
            <i data-lucide="github"></i> Repository
          </a>
          <button id="github-quick-edit" class="github-pill-edit" title="Edit Repository URL">
            <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
          </button>
        \`;
        const quickEditBtn = document.getElementById('github-quick-edit');
        if (quickEditBtn) {
          quickEditBtn.addEventListener('click', () => {
            if (githubUrlInput) githubUrlInput.value = githubLink;
            if (githubModal) githubModal.classList.remove('hidden');
          });
        }
      } else {
        githubDisplayVal.textContent = 'Not Set';
        githubBadgeContainer.innerHTML = '';
      }
    }
    safeCreateIcons();
  };

  const updateDashboardStats = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    let totalThisMonth = 0;
    let totalThisYear = 0;

    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      if (isNaN(expDate.getTime())) return;

      if (expDate.getFullYear() === currentYear) {
        totalThisYear += exp.amount;
        if (expDate.getMonth() === currentMonth) {
          totalThisMonth += exp.amount;
        }
      }
    });

    if (monthlyTotalEl) monthlyTotalEl.textContent = formatCurrency(totalThisMonth);
    if (yearlyTotalEl) yearlyTotalEl.textContent = formatCurrency(totalThisYear);
    if (transactionCountEl) transactionCountEl.textContent = expenses.length;

    // Budget math
    const budgetRemaining = budget - totalThisMonth;
    if (budgetRemainingEl) budgetRemainingEl.textContent = formatCurrency(budgetRemaining);
    
    const percentageSpent = Math.min((totalThisMonth / budget) * 100, 100);
    
    if (budgetProgressBar) budgetProgressBar.style.width = \`\${percentageSpent}%\`;
    if (budgetProgressText) budgetProgressText.textContent = \`\${percentageSpent.toFixed(0)}% of monthly budget spent\`;

    // Visual indicators on budget status
    if (budgetStatusIcon && budgetProgressBar && budgetStatCard && budgetCardLabel) {
      budgetStatusIcon.className = 'stat-icon icon-budget';
      budgetProgressBar.className = 'budget-progress-bar';
      budgetStatCard.style.border = '';
      budgetCardLabel.textContent = 'Budget Remaining';
      
      if (percentageSpent >= 100) {
        budgetStatusIcon.classList.add('budget-danger');
        budgetProgressBar.classList.add('danger');
        budgetCardLabel.textContent = 'Budget Exceeded';
        budgetStatCard.style.border = '1px solid rgba(239, 68, 68, 0.4)';
      } else if (percentageSpent >= 80) {
        budgetStatusIcon.classList.add('budget-warning');
        budgetProgressBar.classList.add('warning');
        budgetCardLabel.textContent = 'Close to Budget';
        budgetStatCard.style.border = '1px solid rgba(245, 158, 11, 0.4)';
      }
    }
  };

  const renderExpensesList = () => {
    // Collect active filter values
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cat = filterCategory ? filterCategory.value : 'all';
    const start = (filterStartDate && filterStartDate.value) ? new Date(filterStartDate.value) : null;
    const end = (filterEndDate && filterEndDate.value) ? new Date(filterEndDate.value) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    // Apply sorting (Date descending)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter
    const filtered = sortedExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      
      const matchesSearch = exp.description.toLowerCase().includes(query) || 
                            exp.location.toLowerCase().includes(query);
      const matchesCategory = cat === 'all' || exp.category === cat;
      const matchesStart = !start || expDate >= start;
      const matchesEnd = !end || expDate <= end;

      return matchesSearch && matchesCategory && matchesStart && matchesEnd;
    });

    if (expensesList && registerCountBadge) {
      expensesList.innerHTML = '';
      registerCountBadge.textContent = \`\${filtered.length} items\`;

      if (filtered.length === 0) {
        if (expensesTable) expensesTable.classList.add('hidden');
        if (emptyState) emptyState.style.display = 'flex';
        return;
      }

      if (expensesTable) expensesTable.classList.remove('hidden');
      if (emptyState) emptyState.style.display = 'none';

      filtered.forEach(exp => {
        const tr = document.createElement('tr');
        tr.id = \`exp-row-\${exp.id}\`;
        
        const badgeClass = 'badge-' + exp.category.toLowerCase().replace('&', 'and').split(' ').join('-');
        const catIcon = getCategoryIcon(exp.category);

        tr.innerHTML = \`
          <td>\${exp.date}</td>
          <td>
            <span class="badge \${badgeClass}">
              <i data-lucide="\${catIcon}" style="width: 12px; height: 12px;"></i>
              \${exp.category}
            </span>
          </td>
          <td class="font-bold">\${exp.description}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 4px;">
              <i data-lucide="map-pin" style="width: 12px; height: 12px; color: var(--text-muted);"></i
              \${exp.location}
            </div>
          </td>
          <td class="expense-amount-val">\${formatCurrency(exp.amount)}</td>
          <td>
            <div class="actions-cell">
              <button class="icon-btn-sm btn-edit-row" data-id="\${exp.id}" title="Edit log">
                <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
              </button>
              <button class="icon-btn-sm btn-delete-row" data-id="\${exp.id}" title="Delete log">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </td>
        \`;

        expensesList.appendChild(tr);
      });

      safeCreateIcons();

      // Event hooks on list action buttons
      document.querySelectorAll('.btn-edit-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          startEditMode(id);
        });
      });

      document.querySelectorAll('.btn-delete-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          handleDeleteExpense(id);
        });
      });
    }
  };

  // --- CHARTS CREATION (SAFE CDN INTEGRATION) ---
  const renderCharts = () => {
    // Check if Chart.js constructor exists on global scope
    if (typeof Chart === 'undefined') {
      console.warn("Chart.js constructor undefined. Skipping analytics chart rendering.");
      return;
    }

    try {
      // Destroy existing configurations to prevent memory leaks
      if (categoryChartInstance) categoryChartInstance.destroy();
      if (historyChartInstance) historyChartInstance.destroy();

      const emptyCatPlaceholder = document.getElementById('category-chart-empty');
      const emptyTrendPlaceholder = document.getElementById('history-chart-empty');
      const catCanvas = document.getElementById('category-chart');
      const historyCanvas = document.getElementById('history-chart');

      if (!catCanvas || !historyCanvas) return;

      if (expenses.length === 0) {
        if (emptyCatPlaceholder) emptyCatPlaceholder.classList.remove('hidden');
        if (emptyTrendPlaceholder) emptyTrendPlaceholder.classList.remove('hidden');
        catCanvas.style.display = 'none';
        historyCanvas.style.display = 'none';
        return;
      }

      if (emptyCatPlaceholder) emptyCatPlaceholder.classList.add('hidden');
      if (emptyTrendPlaceholder) emptyTrendPlaceholder.classList.add('hidden');
      catCanvas.style.display = 'block';
      historyCanvas.style.display = 'block';

      const getCSSVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();
      const textMainColor = getCSSVar('--text-main') || '#fff';
      const borderThemeColor = getCSSVar('--border-color') || 'rgba(255,255,255,0.1)';

      // Compute Category Totals
      const catData = {};
      expenses.forEach(exp => {
        catData[exp.category] = (catData[exp.category] || 0) + exp.amount;
      });

      const categoryLabels = Object.keys(catData);
      const categoryValues = Object.values(catData);
      const categoryColors = [
        '#f97316', // Food
        '#ec4899', // Shopping
        '#3b82f6', // Travel
        '#10b981', // Utilities
        '#a855f7', // Entertainment
        '#ef4444', // Health
        '#0ea5e9', // Education
        '#6b7280'  // Others
      ];

      categoryChartInstance = new Chart(catCanvas, {
        type: 'doughnut',
        data: {
          labels: categoryLabels,
          datasets: [{
            data: categoryValues,
            backgroundColor: categoryColors.slice(0, categoryLabels.length),
            borderColor: getCSSVar('--bg-surface') || '#101622',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: textMainColor,
                font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 },
                padding: 10
              }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const percent = ((ctx.raw / total) * 100).toFixed(1);
                  return \` \${ctx.label}: \${formatCurrency(ctx.raw)} (\${percent}%)\`;
                }
              }
            }
          }
        }
      });

      // Compute Monthly trend limits
      const monthlyGroups = {};
      expenses.forEach(exp => {
        const expDate = new Date(exp.date);
        if (isNaN(expDate.getTime())) return;
        const monthKey = expDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        const sortValue = expDate.getFullYear() * 12 + expDate.getMonth();
        
        if (!monthlyGroups[monthKey]) {
          monthlyGroups[monthKey] = { label: monthKey, total: 0, sortVal: sortValue };
        }
        monthlyGroups[monthKey].total += exp.amount;
      });

      // Sort months chronologically
      const sortedMonths = Object.values(monthlyGroups).sort((a, b) => a.sortVal - b.sortVal).slice(-6); // Last 6 months

      const trendLabels = sortedMonths.map(m => m.label);
      const trendValues = sortedMonths.map(m => m.total);

      historyChartInstance = new Chart(historyCanvas, {
        type: 'line',
        data: {
          labels: trendLabels,
          datasets: [{
            label: 'Total Expenses',
            data: trendValues,
            borderColor: getCSSVar('--primary') || '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.05)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: getCSSVar('--primary') || '#8b5cf6',
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  return \` Total Spend: \${formatCurrency(ctx.raw)}\`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: borderThemeColor },
              ticks: { color: textMainColor, font: { family: 'Plus Jakarta Sans', size: 10, weight: 600 } }
            },
            y: {
              grid: { color: borderThemeColor },
              ticks: {
                color: textMainColor,
                font: { family: 'Plus Jakarta Sans', size: 10 },
                callback: (val) => formatCurrency(val)
              }
            }
          }
        }
      });
    } catch (err) {
      console.error("Failed to render charts safely: ", err);
    }
  };

  // --- ACTIONS HANDLERS ---
  const saveExpensesData = () => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateDashboardStats();
    renderExpensesList();
    renderCharts();
  };

  const handleAddExpense = (amount, category, date, location, description) => {
    const newExp = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      amount: parseFloat(amount),
      category,
      date,
      location,
      description
    };

    expenses.push(newExp);
    saveExpensesData();
    showToast('Expense added successfully!', 'success');

    // Trigger Budget warnings instantly
    const now = new Date();
    const expDate = new Date(date);
    if (expDate.getFullYear() === now.getFullYear() && expDate.getMonth() === now.getMonth()) {
      const currentMonthExpenses = expenses
        .filter(e => {
          const d = new Date(e.date);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })
        .reduce((sum, e) => sum + e.amount, 0);

      if (currentMonthExpenses >= budget) {
        showToast(\`⚠️ Budget threshold exceeded! Spent \${formatCurrency(currentMonthExpenses)} of \${formatCurrency(budget)}\`, 'error');
      } else if (currentMonthExpenses >= budget * 0.8) {
        showToast(\`⚠️ Nearing monthly budget! Spent over 80%.\`, 'info');
      }
    }
  };

  const startEditMode = (id) => {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    currentEditId = id;
    if (expenseIdInput) expenseIdInput.value = exp.id;
    if (amountInput) amountInput.value = exp.amount;
    if (categoryInput) categoryInput.value = exp.category;
    if (dateInput) dateInput.value = exp.date;
    if (locationInput) locationInput.value = exp.location;
    if (descInput) descInput.value = exp.description;

    if (formTitle) formTitle.innerHTML = '<i data-lucide="edit"></i> Modify Log';
    if (submitBtn) submitBtn.textContent = 'Save Changes';
    if (cancelEditBtn) cancelEditBtn.classList.remove('hidden');
    safeCreateIcons();
    
    if (expenseForm) expenseForm.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEditMode = () => {
    currentEditId = null;
    if (expenseForm) expenseForm.reset();
    if (expenseIdInput) expenseIdInput.value = '';
    setTodayDate();

    if (formTitle) formTitle.innerHTML = '<i data-lucide="plus-circle"></i> Log Expense';
    if (submitBtn) submitBtn.textContent = 'Save Expense';
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    safeCreateIcons();

    // Clear form error styling
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
  };

  const handleUpdateExpense = (id, amount, category, date, location, description) => {
    const idx = expenses.findIndex(e => e.id === id);
    if (idx === -1) return;

    expenses[idx] = {
      id,
      amount: parseFloat(amount),
      category,
      date,
      location,
      description
    };

    saveExpensesData();
    cancelEditMode();
    showToast('Log entry updated successfully', 'success');
  };

  const handleDeleteExpense = (id) => {
    if (confirm('Are you sure you want to delete this expense registry?')) {
      expenses = expenses.filter(e => e.id !== id);
      saveExpensesData();
      showToast('Log entry removed', 'info');
      if (currentEditId === id) cancelEditMode();
    }
  };

  // --- SAFE ERROR HANDLER FOR FORMS ---
  const setGroupError = (elementId, hasError) => {
    const el = document.getElementById(elementId);
    if (el && el.parentElement) {
      if (hasError) {
        el.parentElement.classList.add('has-error');
      } else {
        el.parentElement.classList.remove('has-error');
      }
    }
  };

  // --- FORM SUBMIT LOGIC ---
  if (expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      const amountVal = amountInput ? amountInput.value : '';
      const catVal = categoryInput ? categoryInput.value : '';
      const dateVal = dateInput ? dateInput.value : '';
      const locVal = locationInput ? locationInput.value.trim() : '';
      const descVal = descInput ? descInput.value.trim() : '';

      // Amount checks (strict verification)
      const amountNum = parseFloat(amountVal);
      if (isNaN(amountNum) || amountNum <= 0) {
        setGroupError('amount-error', true);
        isValid = false;
      } else {
        setGroupError('amount-error', false);
      }

      // Category checks
      if (!catVal) {
        setGroupError('category-error', true);
        isValid = false;
      } else {
        setGroupError('category-error', false);
      }

      // Date checks
      if (!dateVal) {
        setGroupError('date-error', true);
        isValid = false;
      } else {
        setGroupError('date-error', false);
      }

      // Location checks
      if (!locVal) {
        setGroupError('location-error', true);
        isValid = false;
      } else {
        setGroupError('location-error', false);
      }

      // Desc checks
      if (!descVal) {
        setGroupError('desc-error', true);
        isValid = false;
      } else {
        setGroupError('desc-error', false);
      }

      if (!isValid) return;

      if (currentEditId) {
        handleUpdateExpense(currentEditId, amountVal, catVal, dateVal, locVal, descVal);
      } else {
        handleAddExpense(amountVal, catVal, dateVal, locVal, descVal);
        expenseForm.reset();
        setTodayDate();
      }
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', cancelEditMode);
  }

  // --- SETTINGS CONFIGURATION EVENT HOOKS ---
  // Budget settings modal
  if (editBudgetBtn) {
    editBudgetBtn.addEventListener('click', () => {
      if (budgetAmountInput) budgetAmountInput.value = budget;
      setGroupError('budget-error', false);
      if (budgetModal) budgetModal.classList.remove('hidden');
    });
  }

  if (closeBudgetModal) closeBudgetModal.addEventListener('click', () => budgetModal.classList.add('hidden'));
  if (cancelBudgetBtn) cancelBudgetBtn.addEventListener('click', () => budgetModal.classList.add('hidden'));

  if (saveBudgetBtn) {
    saveBudgetBtn.addEventListener('click', () => {
      if (!budgetAmountInput) return;
      const val = parseFloat(budgetAmountInput.value);
      if (isNaN(val) || val < 1) {
        setGroupError('budget-error', true);
        return;
      }

      budget = val;
      localStorage.setItem('monthlyBudget', val);
      updateSettingsDisplay();
      updateDashboardStats();
      if (budgetModal) budgetModal.classList.add('hidden');
      showToast('Budget configured successfully', 'success');
    });
  }

  // Github config modal
  if (editGithubBtn) {
    editGithubBtn.addEventListener('click', () => {
      if (githubUrlInput) githubUrlInput.value = githubLink;
      setGroupError('github-error', false);
      if (githubModal) githubModal.classList.remove('hidden');
    });
  }

  if (closeGithubModal) closeGithubModal.addEventListener('click', () => githubModal.classList.add('hidden'));

  if (clearGithubBtn) {
    clearGithubBtn.addEventListener('click', () => {
      githubLink = '';
      localStorage.removeItem('projectGithubLink');
      updateSettingsDisplay();
      if (githubModal) githubModal.classList.add('hidden');
      showToast('Repository link removed', 'info');
    });
  }

  if (saveGithubBtn) {
    saveGithubBtn.addEventListener('click', () => {
      if (!githubUrlInput) return;
      const val = githubUrlInput.value.trim();
      const lowerVal = val.toLowerCase();
      
      // Fixed: Escape Regular Expression issues inside scaffold template literals using startWith checks
      if (val !== '' && !lowerVal.startsWith('http://') && !lowerVal.startsWith('https://')) {
        setGroupError('github-error', true);
        return;
      }

      githubLink = val;
      if (val === '') {
        localStorage.removeItem('projectGithubLink');
      } else {
        localStorage.setItem('projectGithubLink', val);
      }
      updateSettingsDisplay();
      if (githubModal) githubModal.classList.add('hidden');
      showToast('Repository link updated successfully', 'success');
    });
  }

  // Global Currency select change listener (Fixing UI updates symbols dynamically)
  if (currencySelect) {
    currencySelect.value = currentCurrency;
    
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      currentCurrencySymbol = currencySymbols[currentCurrency] || '$';
      localStorage.setItem('appCurrency', currentCurrency);
      localStorage.setItem('appCurrencySymbol', currentCurrencySymbol);
      
      // Update form prefixes/labels
      updateCurrencyLabels();
      
      // Format target budgets display
      updateSettingsDisplay();
      
      // Reformat analytics cards and amount rows
      updateDashboardStats();
      renderExpensesList();
      
      // Re-initialize Chart.js configurations with new locales/symbols
      renderCharts();
      
      showToast(\`Currency updated to \${currencies[currentCurrency].code} (\${currentCurrencySymbol})\`, 'success');
    });
  }

  // --- FILTERS & SEARCH ACTIONS ---
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (filterCategory) filterCategory.addEventListener('change', applyFilters);
  if (filterStartDate) filterStartDate.addEventListener('change', applyFilters);
  if (filterEndDate) filterEndDate.addEventListener('change', applyFilters);

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (filterCategory) filterCategory.value = 'all';
      if (filterStartDate) filterStartDate.value = '';
      if (filterEndDate) filterEndDate.value = '';
      applyFilters();
      showToast('Active filters cleared', 'info');
    });
  }

  // --- BOOTSTRAP INITIAL VALUES ---
  setTodayDate();
  updateCurrencyLabels();
  updateSettingsDisplay();
  updateDashboardStats();
  renderExpensesList();
  renderCharts();
});`;

// --- MAIN CLI WORKFLOW ---

printBanner();

const projectDir = process.cwd();
const filesToScaffold = [
  { name: 'index.html', content: htmlTemplate },
  { name: 'styles.css', content: cssTemplate },
  { name: 'app.js', content: jsTemplate }
];

console.log(`${colors.bold}${colors.yellow}🔍  Scaffolding targets directory: ${colors.reset}${colors.underline}${projectDir}${colors.reset}\n`);

try {
  filesToScaffold.forEach((fileSpec) => {
    const targetPath = path.join(projectDir, fileSpec.name);
    console.log(` ⚙️  Creating ${colors.cyan}${fileSpec.name}${colors.reset}...`);
    fs.writeFileSync(targetPath, fileSpec.content, 'utf8');
  });

  console.log(`\n${colors.bold}${colors.green}✓  Project successfully generated!${colors.reset}`);
  console.log(`------------------------------------------------------------`);
  console.log(`Feel free to launch ${colors.cyan}index.html${colors.reset} in any browser, or deploy to production.`);
  console.log(`To configure repository linkages, enter setting controls on dashboard.`);
  console.log(`\n${colors.bold}${colors.magenta}Gravity controls: deactivated. Enjoy your dashboard! 🚀${colors.reset}\n`);

} catch (err) {
  console.error(`\n${colors.bold}${colors.red}✖  Error generating project files:${colors.reset}`);
  console.error(err);
  process.exit(1);
}
