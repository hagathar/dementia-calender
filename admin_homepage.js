(() => {
  const assignedTasks = [
    { title: "first task", owner: "Grandpa", done: false },
    { title: "first list item", owner: "Grandpa", done: true },
    { title: "first list item", owner: "Grandpa", done: false },
  ];

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

  function renderCalendar() {
    const grid = document.querySelector("#month-grid");
    grid.innerHTML = '<div class="month-title">MARCH</div>';
    Array.from({ length: 31 }, (_, i) => i + 1).forEach((day) => {
      const button = document.createElement("button");
      button.className = `day-cell${day === 17 ? " active" : ""}`;
      button.type = "button";
      button.textContent = day;
      button.addEventListener("click", () => showPlaceholder(`Would show tasks for March ${day}.`));
      grid.appendChild(button);
    });
  }

  function renderTasks() {
    const list = document.querySelector("#admin-task-list");
    list.innerHTML = "";
    assignedTasks.forEach((task, index) => {
      const item = document.createElement("article");
      item.className = "admin-task";
      item.innerHTML = `
        <span class="status-dot${task.done ? " done" : ""}" aria-hidden="true"></span>
        <div>
          <strong>${task.title}</strong><br>
          <span>${task.owner}</span>
        </div>
      `;

      const toggle = document.createElement("button");
      toggle.className = `tick-box${task.done ? " checked" : ""}`;
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Toggle task completion");
      toggle.addEventListener("click", () => {
        assignedTasks[index].done = !assignedTasks[index].done;
        showPlaceholder(assignedTasks[index].done ? "Would mark this task complete." : "Would reopen this task.");
        renderTasks();
      });
      item.appendChild(toggle);

      item.addEventListener("dblclick", () => showPlaceholder(`Would open task detail for ${task.title}.`));
      list.appendChild(item);
    });
  }

  function renderCreateTask() {
    const screen = document.querySelector(".screen");
    screen.className = "screen";
    screen.innerHTML = `
      <section class="form-view">
        <form class="form-panel">
          <button class="danger-button" type="button" data-action="cancel-task">Cancel</button>
          <h1>Create new Task</h1>
          <input class="field" type="text" placeholder="Task title">
          <textarea class="field" placeholder="Description"></textarea>
          <input class="field" type="date" aria-label="Date">
          <div class="form-actions">
            <input class="field" type="time" aria-label="Time">
            <select class="field" aria-label="AM or PM">
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
          <div class="setting-row">
            <strong>Checklist</strong>
            <div class="form-actions">
              <input class="field" type="text" placeholder="Enter new item">
              <button class="primary-button" type="button" data-action="add-item">+</button>
            </div>
            <div class="admin-task">
              <span class="status-dot done" aria-hidden="true"></span>
              <strong>Checklist item</strong>
              <button class="danger-button" type="button" data-action="remove-item">X</button>
            </div>
          </div>
          <button class="account-chip full-width" type="button" data-action="add-account">add account</button>
          <button class="primary-button full-width" type="button" data-action="create-task-now">Create</button>
        </form>
      </section>
    `;

    document.querySelector('[data-action="cancel-task"]').addEventListener("click", render);
    document.querySelector('[data-action="add-item"]').addEventListener("click", () => {
      showPlaceholder("Would add the typed checklist item.");
    });
    document.querySelector('[data-action="remove-item"]').addEventListener("click", () => {
      showPlaceholder("Would remove this checklist item.");
    });
    document.querySelector('[data-action="add-account"]').addEventListener("click", () => {
      showPlaceholder("Would open account selection for this task.");
    });
    document.querySelector('[data-action="create-task-now"]').addEventListener("click", () => {
      showPlaceholder("Would validate and create the task.");
    });
  }

  function openDrawer() {
    document.querySelector("#settings-drawer").classList.add("is-open");
  }

  function closeDrawer() {
    document.querySelector("#settings-drawer").classList.remove("is-open");
  }

  function render() {
    ensureCss();
    document.title = "Admin Home";
    document.body.innerHTML = `
      <main class="app-shell">
        <section class="phone" aria-label="Admin calendar and account manager">
          <div class="screen admin-layout">
            <nav class="side-menu" aria-label="Admin navigation">
              <button class="settings-gear" type="button" data-action="settings" aria-label="Settings">&#9881;</button>
              <button class="side-link" type="button" data-action="tasks">All tasks</button>
              <button class="side-link" type="button" data-action="lists">All lists</button>
              <button class="side-link" type="button" data-action="calendars">Calendars</button>
              <button class="side-link" type="button" data-action="users">Users</button>
              <button class="account-chip" type="button" data-action="grandpa">
                <span class="small-avatar">G</span>
                <span>Grandpa</span>
              </button>
              <button class="account-chip" type="button" data-action="admin">
                <span class="small-avatar">A</span>
                <span>Admin 1</span>
              </button>
            </nav>
            <section class="admin-main">
              <header class="compact-hero">
                <div>
                  <div class="compact-date">17</div>
                  <div class="compact-month">MARCH</div>
                </div>
                <button class="menu-stack" type="button" data-action="menu" aria-label="Open menu">&#9776;</button>
                <div class="today-panel">TASKS ASSIGNED FOR TODAY</div>
              </header>
              <div class="month-grid" id="month-grid" aria-label="March calendar"></div>
              <div class="task-list" id="admin-task-list" aria-label="Assigned tasks"></div>
            </section>
            <button class="floating-add" type="button" data-action="create-task" aria-label="Create task">+</button>
            <aside class="drawer" id="settings-drawer" aria-label="Settings panel">
              <div class="drawer-panel">
                <h2>Settings</h2>
                <div class="setting-row">
                  <label for="text-size">Text size</label>
                  <div class="range-row">
                    <input id="text-size" type="range" min="30" max="90" value="60">
                    <strong>60</strong>
                  </div>
                </div>
                <div class="setting-row">
                  <span>Theme</span>
                  <div class="theme-options">
                    <button class="theme-dot white" type="button" aria-label="White theme"></button>
                    <button class="theme-dot blue" type="button" aria-label="Blue theme"></button>
                    <button class="theme-dot orange" type="button" aria-label="Orange theme"></button>
                  </div>
                </div>
                <button class="primary-button" type="button" data-action="search">Search accounts</button>
                <button class="primary-button success-button" type="button" data-action="create-account">Create new account</button>
                <button class="danger-button" type="button" data-action="close-settings">Close</button>
              </div>
            </aside>
          </div>
        </section>
      </main>
    `;

    renderCalendar();
    renderTasks();

    document.querySelector('[data-action="settings"]').addEventListener("click", openDrawer);
    document.querySelector('[data-action="menu"]').addEventListener("click", openDrawer);
    document.querySelector('[data-action="close-settings"]').addEventListener("click", closeDrawer);
    document.querySelector('[data-action="create-task"]').addEventListener("click", () => {
      renderCreateTask();
    });
    document.querySelector('[data-action="search"]').addEventListener("click", () => {
      showPlaceholder("Would open searchpage.js to search accounts.");
    });
    document.querySelector('[data-action="create-account"]').addEventListener("click", () => {
      showPlaceholder("Would open the create account form.");
    });

    document.querySelectorAll(".side-link, .account-chip, .theme-dot").forEach((button) => {
      button.addEventListener("click", () => showPlaceholder(`Would open or activate: ${button.textContent.trim() || button.ariaLabel}.`));
    });

    document.querySelector("#text-size").addEventListener("input", (event) => {
      event.target.nextElementSibling.textContent = event.target.value;
      showPlaceholder(`Would set standard text size to ${event.target.value}.`);
    });
  }

  window.addEventListener("DOMContentLoaded", render);
})();
