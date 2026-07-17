(() => {
  function ensureCss() {
    if (document.querySelector('link[href="standardcolours.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "standardcolours.css";
    document.head.appendChild(link);
  }

  function showPlaceholder(message) {
    const oldToast = document.querySelector(".toast");
    if (oldToast) oldToast.remove();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2400);
  }

  function renderSearch() {
    document.querySelector(".screen").innerHTML = `
      <section class="search-view">
        <div class="search-panel">
          <h1>SEARCH</h1>
          <div class="search-card">
            <input class="field" id="account-search" type="search" placeholder="Search by username">
            <button class="primary-button" type="button" data-action="run-search">Search</button>
            <button class="primary-button success-button" type="button" data-action="create-account">Create new account</button>
            <button class="ghost-button" type="button" data-action="login">Admin login</button>
            <div id="search-results" aria-live="polite"></div>
          </div>
        </div>
      </section>
    `;

    document.querySelector('[data-action="run-search"]').addEventListener("click", () => {
      const term = document.querySelector("#account-search").value.trim() || "Grandpa";
      document.querySelector("#search-results").innerHTML = `
        <button class="account-chip" type="button" data-action="result">
          <span class="small-avatar">G</span>
          <span>${term}<br><small>Would open account profile</small></span>
        </button>
      `;
      document.querySelector('[data-action="result"]').addEventListener("click", () => {
        showPlaceholder(`Would open ${term}'s account.`);
      });
      showPlaceholder("Would search the account database.");
    });

    document.querySelector('[data-action="create-account"]').addEventListener("click", renderCreateAccount);
    document.querySelector('[data-action="login"]').addEventListener("click", renderLogin);
  }

  function renderLogin() {
    document.querySelector(".screen").innerHTML = `
      <section class="search-view">
        <div class="search-panel">
          <h1>Login</h1>
          <input class="field" type="text" placeholder="Username">
          <input class="field" type="password" placeholder="Password">
          <div class="form-actions">
            <button class="primary-button" type="button" data-action="submit-login">Login</button>
            <button class="pill-button" type="button" data-action="back-search">Search</button>
          </div>
        </div>
      </section>
    `;

    document.querySelector('[data-action="submit-login"]').addEventListener("click", () => {
      showPlaceholder("Would authenticate the admin and open admin_homepage.js.");
    });
    document.querySelector('[data-action="back-search"]').addEventListener("click", renderSearch);
  }

  function renderCreateAccount() {
    document.querySelector(".screen").innerHTML = `
      <section class="form-view">
        <form class="form-panel">
          <button class="danger-button" type="button" data-action="cancel">Cancel</button>
          <h1>Create new account</h1>
          <input class="field" type="email" placeholder="Email">
          <input class="field" type="tel" placeholder="Phone number">
          <input class="field" type="text" placeholder="Name">
          <input class="field" type="password" placeholder="Password">
          <label class="setting-row">
            Admin?
            <input type="checkbox" aria-label="Admin permissions">
          </label>
          <div class="form-actions">
            <button class="primary-button" type="button" data-action="create">Create</button>
            <button class="pill-button" type="button" data-action="account-search">Search accounts</button>
          </div>
        </form>
      </section>
    `;

    document.querySelector('[data-action="cancel"]').addEventListener("click", renderSearch);
    document.querySelector('[data-action="account-search"]').addEventListener("click", renderSearch);
    document.querySelector('[data-action="create"]').addEventListener("click", () => {
      showPlaceholder("Would validate and create the account.");
    });
  }

  function render() {
    ensureCss();
    document.title = "Search Accounts";
    document.body.innerHTML = `
      <main class="app-shell">
        <section class="phone" aria-label="Search and account management">
          <div class="screen"></div>
        </section>
      </main>
    `;
    renderSearch();
  }

  window.addEventListener("DOMContentLoaded", render);
})();
