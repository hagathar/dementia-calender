let calendarRoot;

const monthNames = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const tasks = [
  { title: 'first task', items: ['first list item', 'first list item'] },
];

const newTaskDraft = {
  title: '',
  description: '',
  date: '',
  time: '',
  period: 'AM',
  checklistInput: '',
  checklist: ['Checklist item'],
};

let tasksOpen = false;
let activeScreen = 'calendar';

function buildCalendarMonth(year, monthIndex) {
  const firstDate = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const mondayFirstOffset = (firstDate.getDay() + 6) % 7;
  const cells = [];

  for (let index = 0; index < mondayFirstOffset; index += 1) {
    cells.push('<span class="calendar-day calendar-day--empty"></span>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`<button class="calendar-day" type="button">${day}</button>`);
  }

  return `
    <section class="calendar-month" aria-label="${monthNames[monthIndex]} ${year}">
      <h2>${monthNames[monthIndex]}</h2>
      <div class="calendar-weekdays" aria-hidden="true">
        ${dayLabels.map((label) => `<span>${label}</span>`).join('')}
      </div>
      <div class="calendar-grid">
        ${cells.join('')}
      </div>
    </section>
  `;
}

function buildCalendar() {
  const year = 2026;
  return monthNames.map((_, monthIndex) => buildCalendarMonth(year, monthIndex)).join('');
}

function buildClosedTaskBar() {
  return `
    <button class="task-dropdown" type="button" aria-expanded="false" data-toggle-tasks>
      <span>TASKS ASSIGNED FOR TODAY</span>
      <span class="task-dropdown__arrow" aria-hidden="true">⌄</span>
    </button>
  `;
}

function buildOpenTaskPanel() {
  return `
    <section class="task-panel" aria-label="Tasks assigned for today">
      <button class="task-dropdown task-dropdown--open" type="button" aria-expanded="true" data-toggle-tasks>
        <span>TASKS ASSIGNED FOR TODAY</span>
        <span class="task-dropdown__arrow" aria-hidden="true">⌃</span>
      </button>
      ${tasks
        .map(
          (task) => `
            <article class="task-card">
              <button class="task-card__title" type="button">
                <span>${task.title}</span>
                <span aria-hidden="true">⌄</span>
              </button>
              <ul>
                ${task.items
                  .map(
                    (item) => `
                      <li>
                        <span>${item}</span>
                        <button class="task-check" type="button" aria-label="Mark ${item} complete"></button>
                      </li>
                    `,
                  )
                  .join('')}
              </ul>
            </article>
          `,
        )
        .join('')}
    </section>
  `;
}

function buildAddTaskScreen() {
  return `
    <main class="admin-calendar-screen add-task-screen" aria-label="Create new task screen">
      <section class="create-task-panel">
        <button class="cancel-task" type="button" data-cancel-task>Cancel</button>
        <h1>Create new<br>Task</h1>
        <label>
          <span class="visually-hidden">Task title</span>
          <input class="task-input" name="title" placeholder="Task title" value="${newTaskDraft.title}">
        </label>
        <label>
          <span class="visually-hidden">Description</span>
          <textarea class="task-input task-description" name="description" placeholder="Description">${newTaskDraft.description}</textarea>
        </label>
        <label>
          <span class="visually-hidden">Date</span>
          <input class="task-input" name="date" placeholder="DD/MM/YY" value="${newTaskDraft.date}">
        </label>
        <div class="time-row">
          <label>
            <span class="visually-hidden">Time</span>
            <input class="task-input time-input" name="time" placeholder="Time" value="${newTaskDraft.time}">
          </label>
          <button class="period-button ${newTaskDraft.period === 'AM' ? 'period-button--selected' : ''}" type="button" data-period="AM">AM</button>
          <button class="period-button ${newTaskDraft.period === 'PM' ? 'period-button--selected' : ''}" type="button" data-period="PM">PM</button>
        </div>
        <section class="checklist-editor" aria-label="Checklist">
          <h2>Checklist</h2>
          <div class="new-checklist-row">
            <input name="checklistInput" placeholder="Enter new item" value="${newTaskDraft.checklistInput}">
            <button type="button" data-add-checklist-item aria-label="Add checklist item">+</button>
          </div>
          <ul>
            ${newTaskDraft.checklist
              .map(
                (item, index) => `
                  <li>
                    <span>${item}</span>
                    <button type="button" data-remove-checklist-item="${index}" aria-label="Remove ${item}">×</button>
                  </li>
                `,
              )
              .join('')}
          </ul>
        </section>
        <button class="add-account-button" type="button" data-add-account>Add account</button>
        <button class="create-task-button" type="button" data-create-task>Create</button>
      </section>
    </main>
  `;
}

function buildCalendarScreen() {
  return `
    <main class="admin-calendar-screen" aria-label="Admin calendar screen">
      <button class="menu-button" type="button" aria-label="Open settings">☰</button>
      <header class="date-header">
        <strong>17</strong>
        <span>MARCH</span>
      </header>
      ${tasksOpen ? buildOpenTaskPanel() : buildClosedTaskBar()}
      <section class="calendar-scroll" aria-label="Scrollable calendar months">
        ${buildCalendar()}
      </section>
      <button class="add-task" type="button" aria-label="Create new task" data-open-add-task>+</button>
    </main>
  `;
}

function syncDraftFromForm() {
  const form = calendarRoot.querySelector('.create-task-panel');

  if (!form) {
    return;
  }

  newTaskDraft.title = form.querySelector('[name="title"]').value;
  newTaskDraft.description = form.querySelector('[name="description"]').value;
  newTaskDraft.date = form.querySelector('[name="date"]').value;
  newTaskDraft.time = form.querySelector('[name="time"]').value;
  newTaskDraft.checklistInput = form.querySelector('[name="checklistInput"]').value;
}

function addChecklistItem() {
  syncDraftFromForm();
  const item = newTaskDraft.checklistInput.trim();

  if (item) {
    newTaskDraft.checklist.push(item);
    newTaskDraft.checklistInput = '';
  }

  renderHomepage();
}

function createTask() {
  syncDraftFromForm();
  tasks.push({
    title: newTaskDraft.title || 'New task',
    items: [...newTaskDraft.checklist],
  });
  resetTaskDraft();
  activeScreen = 'calendar';
  tasksOpen = true;
  renderHomepage();
}

function resetTaskDraft() {
  newTaskDraft.title = '';
  newTaskDraft.description = '';
  newTaskDraft.date = '';
  newTaskDraft.time = '';
  newTaskDraft.period = 'AM';
  newTaskDraft.checklistInput = '';
  newTaskDraft.checklist = ['Checklist item'];
}

function bindCalendarEvents() {
  const taskToggle = calendarRoot.querySelector('[data-toggle-tasks]');

  if (taskToggle) {
    taskToggle.addEventListener('click', () => {
      tasksOpen = !tasksOpen;
      renderHomepage();
    });
  }

  const openAddTask = calendarRoot.querySelector('[data-open-add-task]');

  if (openAddTask) {
    openAddTask.addEventListener('click', () => {
      activeScreen = 'addTask';
      renderHomepage();
    });
  }
}

function bindAddTaskEvents() {
  const cancelTask = calendarRoot.querySelector('[data-cancel-task]');

  if (cancelTask) {
    cancelTask.addEventListener('click', () => {
      resetTaskDraft();
      activeScreen = 'calendar';
      renderHomepage();
    });
  }

  calendarRoot.querySelectorAll('.create-task-panel input, .create-task-panel textarea').forEach((input) => {
    input.addEventListener('input', syncDraftFromForm);
  });

  calendarRoot.querySelectorAll('[data-period]').forEach((button) => {
    button.addEventListener('click', () => {
      syncDraftFromForm();
      newTaskDraft.period = button.dataset.period;
      renderHomepage();
    });
  });

  const addChecklist = calendarRoot.querySelector('[data-add-checklist-item]');

  if (addChecklist) {
    addChecklist.addEventListener('click', addChecklistItem);
  }

  calendarRoot.querySelectorAll('[data-remove-checklist-item]').forEach((button) => {
    button.addEventListener('click', () => {
      syncDraftFromForm();
      newTaskDraft.checklist.splice(Number(button.dataset.removeChecklistItem), 1);
      renderHomepage();
    });
  });

  const createTaskButton = calendarRoot.querySelector('[data-create-task]');

  if (createTaskButton) {
    createTaskButton.addEventListener('click', createTask);
  }
}

function renderHomepage() {
  if (!calendarRoot) {
    return;
  }

  calendarRoot.innerHTML = activeScreen === 'addTask' ? buildAddTaskScreen() : buildCalendarScreen();

  if (activeScreen === 'addTask') {
    bindAddTaskEvents();
  } else {
    bindCalendarEvents();
  }
}

function startHomepage() {
  calendarRoot = document.getElementById('homepage') || document.body;
  renderHomepage();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startHomepage, { once: true });
} else {
  startHomepage();
}
