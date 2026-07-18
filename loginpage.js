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

  function render() {
    ensureCss();
    document.title = "Admin Login";
    document.body.innerHTML = `
      <main class="app-shell">
        <section class="phone" aria-label="Admin login">
          <div class="screen">
            <section class="search-view">
              <form class="search-panel">
                <h1>Login</h1>
                <input class="field" type="text" placeholder="Username" autocomplete="username">
                <input class="field" type="password" placeholder="Password" autocomplete="current-password">
                <div class="form-actions">
                  <button class="primary-button" type="button" data-action="login">Login</button>
                  <button class="pill-button" type="button" data-action="search">Search</button>
                </div>
                <button class="ghost-button full-width" type="button" data-action="create-account">Create new account</button>
              </form>
            </section>
          </div>
        </section>
      </main>
    `;

    document.querySelector('[data-action="login"]').addEventListener("click", () => {
      showPlaceholder("Would check login details and direct to admin_homepage.js.");
    });
    document.querySelector('[data-action="search"]').addEventListener("click", () => {
      showPlaceholder("Would direct to searchpage.js.");
    });
    document.querySelector('[data-action="create-account"]').addEventListener("click", () => {
      showPlaceholder("Would open the create account form.");
    });
  }

  window.addEventListener("DOMContentLoaded", render);
})();
