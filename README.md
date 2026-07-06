# 🛰️ anti-gravity

`anti-gravity` is a premium Node.js-based CLI tool designed to instantly scaffold and deploy a zero-gravity, high-performance, and visually stunning client-side **Expense Management App** in your current working directory.

Featuring custom glassmorphism design, theme customization, dynamic statistics, and interactive Chart.js visualizations, the generated app is fully functional out of the box using client-side LocalStorage for data persistence.

---

## 🚀 Features of the Scaffolded Web App

* **Complete Expense Registry (CRUD):** Log, edit, and remove expense records.
* **Granular Records:** Each expense tracks **Amount**, **Category**, **Date**, **Merchant / Location**, and **Description**.
* **Real-time Analytics Dashboard:**
  * Displays dynamic Monthly & Yearly total spending statistics.
  * Interactive **Category Breakdown** (Doughnut Chart) powered by Chart.js.
  * Interactive **Expense Trend** (Line Chart) showing the last 6 months of logging.
* **Target Budget Controls:** Set monthly budgets. The UI dynamically warning-colors the progress bars and triggers warning alerts as you approach/exceed your goals.
* **Brand Integration:** Configure a dedicated **Project GitHub Repository Link** displayed in the app header. Includes a permanent, sleek footer button directing users to the [Developer Profile (Amir Sohail)](https://github.com/amirsohail100).
* **Responsive Visuals:** Glassmorphism dashboard looks stunning on mobile, tablet, and desktop monitors, with support for system dark/light theme switching.

---

## 🛠️ CLI Installation & Execution

Follow these instructions to set up the CLI tool and scaffold the Expense Web App:

### Option A: Local Execution (No Global Installation)
If you want to run the script directly from the source directory:
1. Navigate to the root directory where the codebase was generated.
2. Run the executable using Node.js:
   ```bash
   node cli.js
   ```

### Option B: Local Linking (Global Binary Installation)
To install the CLI locally on your machine so that you can run `anti-gravity` in any directory:
1. Open your terminal in the directory containing `package.json` and `cli.js`.
2. Run the linking command:
   ```bash
   npm link
   ```
3. Now, you can navigate to any directory (e.g., `expensive-project`) and run the scaffolding command:
   ```bash
   anti-gravity
   ```

---

## 🌐 Deploying the Generated Web App to GitHub Pages

Since the scaffolded web application is a static page (HTML, CSS, and Vanilla JavaScript with CDN dependencies), you can host it for free on **GitHub Pages** within seconds!

### Step 1: Initialize Git
Run the following commands inside the directory where the web app was scaffolded:
```bash
git init
git add .
git commit -m "Scaffold Expense App via anti-gravity CLI"
```

### Step 2: Create a GitHub Repository
1. Go to your [GitHub profile](https://github.com/) and create a new public repository (e.g., `expense-manager`).
2. Do **not** initialize it with a README, `.gitignore`, or license.

### Step 3: Link and Push to GitHub
Copy the remote repository commands from your GitHub page and run them in your terminal:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-manager.git
git push -u origin main
```

### Step 4: Configure GitHub Pages
1. Navigate to your repository page on GitHub.
2. Go to **Settings** (gear icon) > **Pages** (in the left sidebar).
3. Under **Build and deployment**, change the Source dropdown to **Deploy from a branch**.
4. Under **Branch**, select **`main`** and select `/root` as the folder.
5. Click **Save**.

Within a couple of minutes, your website will be live at:
`https://YOUR_USERNAME.github.io/expense-manager/`

---

## 🏗️ Project Architecture

Once executed, `anti-gravity` creates the following client structures in the target directory:

```text
├── index.html     # HTML5 Semantic structure, modal overlays, and CDN imports
├── styles.css     # Glassmorphic responsive dark/light styling rules and variables
└── app.js         # State machine, LocalStorage synchronization, and chart bindings
```

---

## 🧑‍💻 Creator Profile

* **Developer Profile:** [Amir Sohail](https://github.com/amirsohail100)
* **Scaffold Utility:** `anti-gravity`
