'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const nav = document.querySelector('.nav');
const logos = document.querySelector('.nav__logo');
const header = document.querySelector('header');
///////////////////////////////////////
logos.addEventListener('click', function (e) {
  e.preventDefault();

  header.scrollIntoView({ behavior: 'smooth' });
});

//------------------------------Modal window Start---------------------------------------------------
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//------------------------------Modal window End---------------------------------------------------

//smooth Scrolling
btnScrollTo.addEventListener('click', function (e) {
  //smooth Scrolling(Old School Way)
  const s1Coords = section1.getBoundingClientRect();
  /*window.scrollTo({
    left: s1Coords.left + window.pageXOffset,
    top: s1Coords.top + window.pageYOffset,
    behavior: 'smooth',
  });*/

  //smooth Scrolling(New School Way and the better one)
  section1.scrollIntoView({ behavior: 'smooth' });
});

//------------------------------Page Navigation Start---------------------------------------------------
//Page Navigation
//1-add event listener to the parent
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //this to prevent the main scrooling tha is made in HTML
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    //this is to extract the section like this will give us section1 or section2 or section3
    const id = e.target.getAttribute('href');
    //here after i get the section i wanna go to so i perform the scrolling behavior on it
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//انا ليه في اللي فوقي دا ماستخدمتش لووب فور ايتش لأن ببساطة لو عندي 10000 عنصر دي كده هتعملي 10000 فانكشن يعني كل عنصر ليه فانكشن اكيد انا مش عايز كده
//--------------------------------Page Navigation End-----------------------------------------------------

//------------------------------Tabbed Components Start---------------------------------------------------
//Tabbed Components
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard Clause
  if (!clicked) return;
  //first remove class active from all
  //معني الكلام دا ان انا شيلت الكلاس دا من عليهم كلهم وبعد كده بضيفه في اللي دوست عليه بس
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //first remove class active from all
  //Active Content
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  const content = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  content.classList.add('operations__content--active');
});
//--------------------------------Tabbed Components End-----------------------------------------------------

//------------------------------Menu Fade Animation Start---------------------------------------------------
//Menu Fade Animation (Using Event delegtion)
function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
//--------------------------------Menu Fade Animation End-------------------------------------------------

//--------------------------------Sticky Navigation  Start-------------------------------------------------
//Sticky Navigation (old way and not so good for mobiles)

/*const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function () {
  if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});*/

//--------------------------------Sticky Navigation End-------------------------------------------------

//--------------------------------Sticky Navigation Start-------------------------------------------------
function stickyNav(entries) {
  //getting first element we can do it like this entries[0] but using destructing is better
  const [entry] = entries;

  //while header is not intersecting header make it sticky
  //ودا اللي احنا عايزين نعمله فعلا احنا عايزينه يظهر من اول القسم اللي بعد الهيدر لأنه كده كده ظاهر في الهيدر اصلا
  //be carefull it always has to be this name isIntersecting because it's an implementation in the IntersectionObserver we do not made it
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const navHieght = nav.getBoundingClientRect().height;

const obsObject = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHieght}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, obsObject);
headerObserver.observe(header);
//--------------------------------Sticky Navigation  End-------------------------------------------------

//--------------------------------Reveal Sections Start-----------------------------------------------
const allSections = document.querySelectorAll('.section');
function revealSection(entries, obs) {
  const [entry] = entries;

  //to know which section is intersecting the viewport we need to use terget

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  obs.unobserve(entry.target);
}

const sectionsObject = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, sectionsObject);
allSections.forEach(function (section) {
  sectionObserver.observe(section);
});
//--------------------------------Reveal Sections End-------------------------------------------------

//--------------------------------Lazy Loading Images Start-----------------------------------------------

function loadImg(entries, observer) {
  //in all we used one entry because we have only one threshold if we have array with 4 threshould so we will do 4 entries
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');

    observer.unobserve(entry.target);
  });
}

const imgObject = {
  root: null,
  threshold: 0.5,
};
const imgTargets = document.querySelectorAll('img[data-src]');

const imgObserver = new IntersectionObserver(loadImg, imgObject);

imgTargets.forEach(img => imgObserver.observe(img));

//--------------------------------Lazy Loading Images End-------------------------------------------------

//--------------------------------SLider Start-------------------------------------------------

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

function createDots() {
  slides.forEach((s, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class ="dots__dot" data-slide="${i}"></button>`
    );
  });
}
createDots();

function activateDots(slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  //we will know which slide is active to make it's own dot active using data-slide
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}

function goToSlide(slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
}

goToSlide(0);
activateDots(0);

function nextSlide() {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDots(curSlide);
}
function previousSlide() {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activateDots(curSlide);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  else if (e.key === 'ArrowLeft') previousSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDots(slide);
  }
});
//--------------------------------SLider End-------------------------------------------------

//rgb(255,255,255)
//let's Make a random color
/*const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor());*/

//going downwards: child
const h1 = document.querySelector('h1');
h1.firstElementChild.style.color = 'white';

//Going Upwards: parents
//use closest

//Going Sideways: siblings
//use previousElemntSibling and nextElemntSibling
