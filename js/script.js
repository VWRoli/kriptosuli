'use strict';
//Variables
const burgerIcon = document.querySelector('#burger-icon');
const navbarEl = document.querySelector('.navbar');

const themeStyle = document.querySelector('#theme-style');
const themeBtn = document.querySelector('.theme-btn');

const body = document.querySelector('body');
const slogan = document.querySelector('#slogan-cont');

//Toggle navbar
burgerIcon.addEventListener('click', function () {
  navbarEl.classList.toggle('active-nav');
});

//Change theme
let theme = localStorage.getItem('theme');

const setTheme = () => {
  if (themeBtn.checked) {
    themeStyle.href = 'css/dark.css';
    localStorage.setItem('theme', 'true');
  } else {
    themeStyle.href = 'css/style.css';
    localStorage.setItem('theme', 'false');
  }
};
//Get theme from localstorage
if (theme === 'true') themeBtn.setAttribute('checked', 'checked');
setTheme();

//Change theme with button
themeBtn.addEventListener('change', function () {
  setTheme();
});

//Scroll to top button with Intersection observer API
const obsCallback = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      const html = `<div class="to-top">
         <a href="#top"><i class="fas fa-angle-double-up fa-2x"></i></a>
        </div> `;
      body.insertAdjacentHTML('afterbegin', html);
      //Smooth scroll
      document.querySelector('.to-top').addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else if (entry.isIntersecting) {
      const toTopBtn = document.querySelector('.to-top');
      if (!toTopBtn) return;
      toTopBtn.remove();
    }
  });
};

const obsOptions = {
  root: null,
  threshold: 0,
};

const scrollToTopObserver = new IntersectionObserver(obsCallback, obsOptions);
scrollToTopObserver.observe(slogan);

////////////////////////////////////////////////////////////////////////
//Infinite scroll on main page
const footer = document.querySelector('footer');
const mediumArticles = document.querySelectorAll('.medium-article');
let articleCounter = 5;

const articleCallback = function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      articleCounter++;

      if (mediumArticles[articleCounter] === undefined) {
        articleObserver.unobserve(footer);
        return;
      }
      mediumArticles[articleCounter].classList.remove('hidden-articles');
    }
  });
};

const articleOptions = {
  root: null,
  threshold: 0.5,
};

const articleObserver = new IntersectionObserver(
  articleCallback,
  articleOptions
);

articleObserver.observe(footer);
