import Swiper from 'swiper';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// The gallery lives inside a tab panel, so it is 0px wide until its tab is shown:
// create the carousel the first time it has a width (watched with a ResizeObserver).
const el = document.querySelector('.ja-gallery');
let gallery = null;

function init() {
  if (gallery || !el || !el.offsetWidth) return;
  gallery = new Swiper(el, {
    modules: [Autoplay, Keyboard, Navigation, Pagination],
    slidesPerView: 1,
    loop: true,
    speed: 600,
    autoplay: { delay: 5000, disableOnInteraction: false },
    keyboard: { enabled: true },
    navigation: { nextEl: '.ja-gallery .swiper-button-next', prevEl: '.ja-gallery .swiper-button-prev' },
    pagination: { el: '.ja-gallery .swiper-pagination', clickable: true },
  });
}

init();
if (el) {
  // Fires when the panel is shown (0px -> real width) and on later layout changes.
  new ResizeObserver(() => {
    init();
    gallery?.update();
  }).observe(el);
}
