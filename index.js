const getData = async (url = './data.json') => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const viewButtons = document.querySelectorAll('.dashboard__selector__item');

const changeActiveButton = () => {
  viewButtons.forEach((button) => {
    button.classList.remove('dashboard__selector__item--active');
    if (button.innerText === localStorage.getItem('currentView')) {
      button.classList.add('dashboard__selector__item--active');
    }
  });
};
changeActiveButton();
const nameMap = {
  Daily: 'day',
  Weekly: 'week',
  Monthly: 'month',
};

class DashBoard {
  constructor(
    data,
    view = localStorage.getItem('currentView') || 'Weekly',
    container = '.dashboard__content',
  ) {
    this.data = data;
    this.view = view;
    this.container = document.querySelector(container);

    this.createMarkup();
  }

  createMarkup() {
    const { title, timeframes } = this.data;
    const id = title.toLocaleLowerCase().replace(/ /g, '-');
    const { current, previous } = timeframes[this.view.toLocaleLowerCase()];
    this.container.insertAdjacentHTML(
      'beforeend',

      `<div class="dashboard__item dashboard__item--${id}">
    <div class="tracking-card">
      <header class="tracking-card__header">
        <h3 class="tracking-card__name">${title}</h3>
        <img class="tracking-card__menu" src="./images/icon-ellipsis.svg" alt="menu" />
      </header>
      <div class="tracking-card__info">
        <div class="tracking-card__time">${current}hrs</div>
        <div class="tracking-card__prev-time">Last ${nameMap[this.view]} - ${previous}hrs</div>
      </div>
    </div>
  </div>`,
    );

    this.currentDom = this.container.querySelector(`.dashboard__item--${id} .tracking-card__time`);
    this.previousDom = this.container.querySelector(
      `.dashboard__item--${id} .tracking-card__prev-time`,
    );
  }

  changeTime(view) {
    this.view = view.toLocaleLowerCase();

    const { timeframes } = this.data;
    const { current, previous } = timeframes[this.view.toLocaleLowerCase()];

    this.currentDom.innerText = `${current}hrs`;
    this.previousDom.innerText = `Last ${nameMap[view]} - ${previous}hrs`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getData().then((data) => {
    const activities = data.map((el) => new DashBoard(el));
    viewButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        localStorage.setItem('currentView', button.innerText);
        changeActiveButton();
        activities.forEach((activity) => {
          activity.changeTime(e.currentTarget.innerText);
        });
      });
    });
  });
});
