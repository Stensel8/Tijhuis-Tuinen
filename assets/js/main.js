/**
* Website: Tijhuis Tuinen
* Based on: Append Bootstrap Template (https://bootstrapmade.com/append-bootstrap-website-template/)
* Updated: Oct 29 2025 with Bootstrap v5.3.8, Swiper v12.0.3
* Custom modifications for Tijhuis Tuinen landscaping company
*/

(function() {
  "use strict";

  /**
   * Debounce function to delay resize events
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Smooth scroll to top with easing animation
    const duration = 800; // Duration in milliseconds
    const start = window.scrollY;
    const startTime = performance.now();
    
    // Easing function for natural animation
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easing = easeInOutCubic(progress);
      
      window.scrollTo(0, start * (1 - easing));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: false,
      offset: window.innerWidth > 1200 ? 120 : 50
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    // Check for hash-based filter (all categories)
    if (window.location.hash === '#boomverzorging') {
      filter = '.filter-boomverzorging';
    } else if (window.location.hash === '#omheining') {
      filter = '.filter-omheining';
    } else if (window.location.hash === '#ontwerp') {
      filter = '.filter-ontwerp';
    } else if (window.location.hash === '#onderhoud-gazon') {
      filter = '.filter-onderhoud-gazon';
    } else if (window.location.hash === '#voortuin') {
      filter = '.filter-voortuin';
    } else if (window.location.hash === '#overkapping') {
      filter = '.filter-overkapping';
    } else if (window.location.hash === '#tuinaanleg') {
      filter = '.filter-tuinaanleg';
    }

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

    // Set active filter based on hash (all categories)
    const hashToFilter = {
      '#boomverzorging': '.filter-boomverzorging',
      '#omheining': '.filter-omheining',
      '#ontwerp': '.filter-ontwerp',
      '#onderhoud-gazon': '.filter-onderhoud-gazon',
      '#voortuin': '.filter-voortuin',
      '#overkapping': '.filter-overkapping',
      '#tuinaanleg': '.filter-tuinaanleg'
    };
    if (hashToFilter[window.location.hash]) {
      const activeFilter = isotopeItem.querySelector('.isotope-filters li[data-filter="' + hashToFilter[window.location.hash] + '"]');
      if (activeFilter) {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        activeFilter.classList.add('filter-active');
      }
    }

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init swiper sliders
   */
  let swiperInstances = [];
  
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      // Random start for hero slideshow
      if (swiperElement.classList.contains("hero-slideshow")) {
        const slideCount = swiperElement.querySelectorAll(".swiper-slide").length;
        config.initialSlide = Math.floor(Math.random() * slideCount);
      }

      let swiperInstance;
      if (swiperElement.classList.contains("swiper-tab")) {
        swiperInstance = initSwiperWithCustomPagination(swiperElement, config);
      } else {
        swiperInstance = new Swiper(swiperElement, config);
      }
      
      // Store instance for later use
      if (swiperInstance) {
        swiperInstances.push(swiperInstance);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Update Swiper on window resize (with debounce)
   */
  const handleResize = debounce(function() {
    swiperInstances.forEach(function(swiper) {
      if (swiper && swiper.update) {
        swiper.update();
      }
    });
  }, 250);

  window.addEventListener("resize", handleResize);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();