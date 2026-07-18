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

userTasks.forEach((task) => Object.seal(task.checklist));
Object.seal(userTasks);

let selectedDate = new Date(2026, 2, 17);
let liveTime = new Date();
let expandedTaskId = 'jo-visit';
let finishedSequence = 0;
let liveClockTimer;

function getDisplayTime() {
  return liveTime.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).replace(' ', '');
}

function updateLiveTime() {
  liveTime = new Date();

  const clock = userHomepageRoot?.querySelector('.elderly-clock');

  if (clock) {
    clock.textContent = `The time: ${getDisplayTime()}`;
  }
}

function startLiveClock() {
  updateLiveTime();

  if (!liveClockTimer) {
    liveClockTimer = setInterval(updateLiveTime, 1000);
  }
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
  startLiveClock();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startUserHomepage, { once: true });
} else {
  startUserHomepage();
}
