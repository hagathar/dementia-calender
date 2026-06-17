(() => {
  const tasks = [
    {
      time: "7:30am",
      title: "Jo is coming",
      note: "Do before she comes",
      person: "Jo",
      checklist: [
        { text: "eat breakfast", done: false },
        { text: "pick up paper", done: true },
      ],
      open: true,
      done: false,
    },
    {
      time: "10:00am",
      title: "Go grocery shopping",
      note: "Bring shopping bags and wallet",
      person: "",
      checklist: [],
      open: false,
      done: false,
    },
    {
      time: "7:00pm",
      title: "Brush teeth",
      note: "Use the blue toothbrush",
      person: "",
      checklist: [],
      open: false,
      done: true,
    },
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

  function renderTask(task, index) {
    const card = document.createElement("article");
    card.className = `task-card${task.open ? " is-open" : ""}${task.done ? " is-complete" : ""}`;

    const summary = document.createElement("div");
    summary.className = "task-summary";
    summary.innerHTML = `
      <div>
        <div class="task-time">${task.time}</div>
        <div class="task-title">${task.title}</div>
      </div>
    `;

    const toggle = document.createElement("button");
    toggle.className = "chevron-button";
    toggle.type = "button";
    toggle.textContent = task.open ? "v" : "<";
    toggle.addEventListener("click", () => {
      task.open = !task.open;
      render();
    });
    summary.appendChild(toggle);
    card.appendChild(summary);

    const details = document.createElement("div");
    details.className = "task-details";

    const contact = document.createElement("div");
    contact.className = "contact-row";
    const note = document.createElement("div");
    note.className = "task-title";
    note.textContent = task.note;
    contact.appendChild(note);

    if (task.person) {
      const avatar = document.createElement("button");
      avatar.className = "avatar";
      avatar.type = "button";
      avatar.innerHTML = `${task.person}<br>account<br>photo`;
      avatar.addEventListener("click", () => showPlaceholder(`Would open ${task.person}'s account details.`));
      contact.appendChild(avatar);
    }

    details.appendChild(contact);

    if (task.checklist.length) {
      const list = document.createElement("div");
      list.className = "checklist";
      task.checklist.forEach((item) => {
        const row = document.createElement("div");
        row.className = `check-row${item.done ? " done" : ""}`;
        row.innerHTML = `<span>${item.text}</span>`;

        const finish = document.createElement("button");
        finish.className = "finish-button";
        finish.type = "button";
        finish.textContent = item.done ? "Finished" : "Finish";
        finish.addEventListener("click", () => {
          item.done = !item.done;
          showPlaceholder(item.done ? "Checklist item marked complete." : "Checklist item marked incomplete.");
          render();
        });
        row.appendChild(finish);
        list.appendChild(row);
      });
      details.appendChild(list);
    } else {
      const finish = document.createElement("button");
      finish.className = "finish-button";
      finish.type = "button";
      finish.textContent = task.done ? "Finished" : "Finish";
      finish.addEventListener("click", () => {
        task.done = !task.done;
        showPlaceholder(task.done ? "Task marked complete." : "Task marked incomplete.");
        render();
      });
      details.appendChild(finish);
    }

    card.appendChild(details);

    card.addEventListener("dblclick", () => {
      showPlaceholder(`Would open full details for ${tasks[index].title}.`);
    });

    return card;
  }

  function render() {
    ensureCss();
    document.title = "Elderly User Home";
    document.body.innerHTML = `
      <main class="app-shell">
        <section class="phone" aria-label="Elderly user daily task calendar">
          <div class="screen">
            <header class="date-hero">
              <p class="time-label">The time: 8:39AM</p>
              <button class="icon-button hero-arrow left" type="button" data-action="previous-day" aria-label="Previous day">&larr;</button>
              <div class="day-number">17</div>
              <div class="month-label">MARCH</div>
              <button class="icon-button hero-arrow right" type="button" data-action="next-day" aria-label="Next day">&rarr;</button>
            </header>
            <div class="scroll-area" id="task-list"></div>
          </div>
        </section>
      </main>
    `;

    document.querySelector('[data-action="previous-day"]').addEventListener("click", () => {
      showPlaceholder("Would move to the previous day.");
    });
    document.querySelector('[data-action="next-day"]').addEventListener("click", () => {
      showPlaceholder("Would move to the next day.");
    });

    const taskList = document.querySelector("#task-list");
    tasks.forEach((task, index) => taskList.appendChild(renderTask(task, index)));
  }

  window.addEventListener("DOMContentLoaded", render);
})();
