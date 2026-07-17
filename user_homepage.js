let userHomepageRoot;

const userTasks = [
  {
    id: 'jo-visit',
    time: '7:30am',
    title: 'Jo is coming',
    details: 'Do before she comes',
    accountPhotoText: 'Jo\naccount\nphoto',
    checklist: [
      { id: 'breakfast', label: 'eat breakfast', finished: false },
      { id: 'paper', label: 'pick up paper', finished: true },
    ],
  },
  {
    id: 'shopping',
    time: '10:00am',
    title: 'Go grocery shopping',
    details: '',
    accountPhotoText: '',
    checklist: [],
  },
  {
    id: 'brush-teeth',
    time: '7:00am',
    title: 'Brush teeth',
    details: '',
    accountPhotoText: '',
    checklist: [{ id: 'brush', label: 'Brush teeth', finished: true }],
    finishedAt: Date.now() - 60_000,
  },
];

let selectedDate = new Date(2026, 2, 17, 8, 39);
let expandedTaskId = 'jo-visit';
let finishedSequence = 0;

function injectUserHomepageStyles() {
  if (document.getElementById('user-homepage-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'user-homepage-styles';
  style.textContent = `
    :root {
      --user-screen-black: #101114;
      --user-panel-white: #f7f7f7;
      --user-grey: #777777;
      --user-dark-grey: #2d2d2d;
      --user-blue: #38a7f2;
    }

    * {
      box-sizing: border-box;
    }

    body {
      align-items: center;
      background: #ffffff;
      display: flex;
      font-family: Arial, Helvetica, sans-serif;
      justify-content: center;
      margin: 0;
      min-height: 100vh;
    }

    .elderly-home-screen {
      background: var(--user-screen-black);
      border: 10px solid #333638;
      border-radius: 18px;
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
      color: var(--user-panel-white);
      height: 620px;
      overflow: hidden;
      padding: 8px;
      width: 320px;
    }

    .elderly-clock {
      color: #cfcfcf;
      font-size: 16px;
      margin: 0 0 4px;
      text-align: center;
    }

    .elderly-date-row {
      align-items: center;
      display: grid;
      gap: 8px;
      grid-template-columns: 42px 1fr 42px;
    }

    .day-arrow {
      align-items: center;
      background: #7f7f7f;
      border: 0;
      border-radius: 50%;
      color: var(--user-panel-white);
      cursor: pointer;
      display: flex;
      font-size: 34px;
      font-weight: 900;
      height: 42px;
      justify-content: center;
      width: 42px;
    }

    .elderly-date {
      display: flex;
      flex-direction: column;
      font-weight: 900;
      line-height: 0.86;
      text-align: center;
    }

    .elderly-date strong {
      font-size: 82px;
    }

    .elderly-date span {
      font-size: 40px;
    }

    .user-task-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 380px;
      margin-top: 16px;
      overflow-y: auto;
      padding-right: 4px;
    }

    .user-task {
      background: var(--user-panel-white);
      border: 3px solid #dddddd;
      border-radius: 14px;
      color: #020202;
      overflow: hidden;
    }

    .user-task--finished {
      background: #1e1e1e;
      border-color: #3b3b3b;
      color: #5d5d5d;
      order: 10;
    }

    .user-task__header {
      align-items: center;
      background: transparent;
      border: 0;
      color: inherit;
      cursor: pointer;
      display: flex;
      font-size: 21px;
      font-weight: 900;
      justify-content: space-between;
      padding: 6px 10px 0;
      text-align: left;
      width: 100%;
    }

    .user-task__arrow {
      font-size: 30px;
      line-height: 1;
    }

    .user-task__summary {
      font-size: 21px;
      font-weight: 700;
      padding: 0 10px 8px;
    }

    .user-task__body {
      display: grid;
      gap: 8px;
      grid-template-columns: 1fr 78px;
      padding: 0 10px 8px;
    }

    .user-task__details {
      font-size: 21px;
      line-height: 1.35;
    }

    .account-photo {
      align-items: center;
      align-self: start;
      background: var(--user-blue);
      border-radius: 50%;
      display: flex;
      font-size: 15px;
      height: 78px;
      justify-content: center;
      line-height: 1.1;
      text-align: center;
      white-space: pre-line;
      width: 78px;
    }

    .finish-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      grid-column: 1 / -1;
    }

    .finish-row {
      align-items: center;
      display: grid;
      gap: 6px;
      grid-template-columns: 1fr auto;
    }

    .finish-row span {
      background: var(--user-grey);
      border-radius: 8px;
      color: #ffffff;
      font-size: 18px;
      padding: 3px 6px;
    }

    .finish-button {
      background: var(--user-panel-white);
      border: 0;
      border-radius: 999px;
      color: #1e1e1e;
      cursor: pointer;
      font-size: 17px;
      font-weight: 900;
      padding: 4px 10px;
    }

    .finish-button--finished {
      background: #4b4b4b;
      color: #ffffff;
    }
  `;

  document.head.append(style);
}

function getDisplayTime() {
  return selectedDate.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(' ', '');
}

function getOrderedTasks() {
  return [...userTasks].sort((first, second) => {
    const firstFinished = isTaskFinished(first);
    const secondFinished = isTaskFinished(second);

    if (firstFinished && secondFinished) {
      return (second.finishedAt || 0) - (first.finishedAt || 0);
    }

    if (firstFinished !== secondFinished) {
      return firstFinished ? 1 : -1;
    }

    return getTaskMinutes(first.time) - getTaskMinutes(second.time);
  });
}

function getTaskMinutes(time) {
  const [, hourText, minuteText, period] = time.match(/(\d+):(\d+)(am|pm)/i) || [];
  const hour = Number(hourText || 0) % 12;
  const minute = Number(minuteText || 0);
  return hour * 60 + minute + (period && period.toLowerCase() === 'pm' ? 720 : 0);
}

function isTaskFinished(task) {
  return task.checklist.length > 0 && task.checklist.every((item) => item.finished);
}

function moveDate(dayOffset) {
  selectedDate = new Date(selectedDate);
  selectedDate.setDate(selectedDate.getDate() + dayOffset);
  renderUserHomepage();
}

function toggleTask(taskId) {
  expandedTaskId = expandedTaskId === taskId ? '' : taskId;
  renderUserHomepage();
}

function finishChecklistItem(taskId, itemId) {
  const task = userTasks.find((currentTask) => currentTask.id === taskId);

  if (!task) {
    return;
  }

  const item = task.checklist.find((currentItem) => currentItem.id === itemId);

  if (!item) {
    return;
  }

  item.finished = true;

  if (isTaskFinished(task)) {
    finishedSequence += 1;
    task.finishedAt = Date.now() + finishedSequence;
    expandedTaskId = '';
  }

  renderUserHomepage();
}

function buildTask(task) {
  const finished = isTaskFinished(task);
  const expanded = expandedTaskId === task.id && !finished;
  const headerArrow = expanded ? '∨' : '<';

  return `
    <article class="user-task ${finished ? 'user-task--finished' : ''}" data-task-id="${task.id}">
      <button class="user-task__header" type="button" data-task-toggle="${task.id}" aria-expanded="${expanded}">
        <span>${task.time}</span>
        <span class="user-task__arrow" aria-hidden="true">${headerArrow}</span>
      </button>
      ${expanded ? buildExpandedTask(task) : `<div class="user-task__summary">${task.title}</div>`}
    </article>
  `;
}

function buildExpandedTask(task) {
  return `
    <div class="user-task__body">
      <div class="user-task__details">
        <div>${task.title}</div>
        ${task.details ? `<div>${task.details}</div>` : ''}
      </div>
      ${task.accountPhotoText ? `<div class="account-photo">${task.accountPhotoText}</div>` : ''}
      <div class="finish-list">
        ${task.checklist.map((item) => buildChecklistItem(task.id, item)).join('')}
      </div>
    </div>
  `;
}

function buildChecklistItem(taskId, item) {
  return `
    <div class="finish-row">
      <span>${item.label}</span>
      <button
        class="finish-button ${item.finished ? 'finish-button--finished' : ''}"
        type="button"
        data-finish-task="${taskId}"
        data-finish-item="${item.id}"
        ${item.finished ? 'disabled' : ''}
      >${item.finished ? 'Finished' : 'Finish'}</button>
    </div>
  `;
}

function bindUserHomepageEvents() {
  userHomepageRoot.querySelector('[data-day-back]')?.addEventListener('click', () => moveDate(-1));
  userHomepageRoot.querySelector('[data-day-forward]')?.addEventListener('click', () => moveDate(1));

  userHomepageRoot.querySelectorAll('[data-task-toggle]').forEach((button) => {
    button.addEventListener('click', () => toggleTask(button.dataset.taskToggle));
  });

  userHomepageRoot.querySelectorAll('[data-finish-task]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      finishChecklistItem(button.dataset.finishTask, button.dataset.finishItem);
    });
  });
}

function renderUserHomepage() {
  if (!userHomepageRoot) {
    return;
  }

  injectUserHomepageStyles();

  userHomepageRoot.innerHTML = `
    <main class="elderly-home-screen" aria-label="Elderly user home screen">
      <p class="elderly-clock">The time: ${getDisplayTime()}</p>
      <header class="elderly-date-row">
        <button class="day-arrow" type="button" data-day-back aria-label="Previous day">‹</button>
        <div class="elderly-date">
          <strong>${selectedDate.getDate()}</strong>
          <span>${selectedDate.toLocaleString('en-GB', { month: 'long' }).toUpperCase()}</span>
        </div>
        <button class="day-arrow" type="button" data-day-forward aria-label="Next day">›</button>
      </header>
      <section class="user-task-list" aria-label="Tasks for the selected day">
        ${getOrderedTasks().map((task) => buildTask(task)).join('')}
      </section>
    </main>
  `;

  bindUserHomepageEvents();
}

function startUserHomepage() {
  userHomepageRoot = document.getElementById('user-homepage') || document.body;
  renderUserHomepage();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startUserHomepage, { once: true });
} else {
  startUserHomepage();
}
