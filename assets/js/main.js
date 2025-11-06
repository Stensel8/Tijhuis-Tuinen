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

  const queueAOSRefresh = debounce(() => {
    if (window.AOS && typeof AOS.refreshHard === 'function') {
      AOS.refreshHard();
    }
  }, 150);

  function getHeaderOffset() {
    const header = document.querySelector('#header');
    return header ? header.offsetHeight : 0;
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

  window.addEventListener('scroll', toggleScrolled, { passive: true });
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
    navmenu.classList.add('nav-link');
    if (navmenu.hash) {
      navmenu.setAttribute('data-bs-target', navmenu.hash);
    }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('load', toggleScrollTop);
  window.addEventListener('scroll', toggleScrollTop, { passive: true });

  /**
   * Animation on scroll function and init
   */
  let currentAOSOffset = null;

  function initAOS() {
    if (typeof AOS === 'undefined') return;

    const computedOffset = Math.min(80, Math.max(24, Math.round(window.innerHeight * 0.08)));

    if (currentAOSOffset !== computedOffset) {
      currentAOSOffset = computedOffset;
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: false,
        offset: computedOffset
      });
    }

    queueAOSRefresh();
  }

  document.addEventListener('DOMContentLoaded', initAOS);
  window.addEventListener('load', initAOS);
  window.addEventListener('resize', debounce(initAOS, 200));

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach((isotopeItem) => {
    const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    const defaultFilter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    const sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
    const isotopeContainer = isotopeItem.querySelector('.isotope-container');
    const filterButtons = Array.from(isotopeItem.querySelectorAll('.isotope-filters li'));

    if (!isotopeContainer || typeof Isotope === 'undefined') {
      return;
    }

    const isoInstance = new Isotope(isotopeContainer, {
      itemSelector: '.isotope-item',
      layoutMode: layout,
      filter: defaultFilter,
      sortBy: sort
    });

    const requestLayout = () => requestAnimationFrame(() => isoInstance.layout());

    const setActiveButton = (button) => {
      const active = isotopeItem.querySelector('.isotope-filters .filter-active');
      if (active === button) return;
      if (active) active.classList.remove('filter-active');
      if (button) button.classList.add('filter-active');
    };

    const arrangeWithFilter = (filterValue) => {
      isoInstance.arrange({ filter: filterValue || '*' });
    };

    const activateButton = (button) => {
      if (!button) return;
      const filterValue = button.getAttribute('data-filter') || '*';
      setActiveButton(button);
      arrangeWithFilter(filterValue);
      requestLayout();
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (button.classList.contains('filter-active')) return;
        activateButton(button);
      });
    });

    const applyHashFilter = () => {
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return false;
      const normalized = hash.substring(1);
      const button = isotopeItem.querySelector(`.isotope-filters li[data-filter=".filter-${normalized}"]`);
      if (button) {
        activateButton(button);
        return true;
      }
      return false;
    };

    if (!applyHashFilter()) {
      const initialActive = isotopeItem.querySelector('.isotope-filters .filter-active');
      if (initialActive) {
        arrangeWithFilter(initialActive.getAttribute('data-filter'));
      } else {
        const defaultButton = isotopeItem.querySelector(`.isotope-filters li[data-filter="${defaultFilter}"]`);
        if (defaultButton) {
          activateButton(defaultButton);
        } else {
          arrangeWithFilter(defaultFilter);
        }
      }
    }

    window.addEventListener('hashchange', applyHashFilter);

    if (typeof imagesLoaded === 'function') {
      imagesLoaded(isotopeContainer).on('progress', requestLayout).on('always', () => queueAOSRefresh());
    }

    isoInstance.on('arrangeComplete', () => {
      queueAOSRefresh();
    });

    window.addEventListener('load', requestLayout);
    requestLayout();
    queueAOSRefresh();
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
   * Bootstrap ScrollSpy for nav menu
   */
  let scrollSpyInstance = null;

  const initScrollSpy = () => {
    if (typeof bootstrap === 'undefined' || !bootstrap.ScrollSpy) return;
    if (scrollSpyInstance) {
      scrollSpyInstance.dispose();
    }
    scrollSpyInstance = new bootstrap.ScrollSpy(document.body, {
      target: '#navmenu',
      offset: getHeaderOffset() + 16
    });
  };

  window.addEventListener('load', initScrollSpy);
  window.addEventListener('resize', debounce(initScrollSpy, 200));
  window.addEventListener('hashchange', () => {
    if (scrollSpyInstance) {
      scrollSpyInstance.refresh();
    }
  });

  /**
   * Native image priority hints for portfolio
   */
  function prioritizePortfolioImages() {
    const portfolioImages = document.querySelectorAll('.portfolio .portfolio-item img');
    if (!portfolioImages.length) return;

    const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;

    portfolioImages.forEach((img, index) => {
      img.decoding = 'async';

      if (!img.hasAttribute('sizes')) {
        img.setAttribute('sizes', '(min-width: 992px) 33vw, (min-width: 768px) 50vw, 100vw');
      }

      if (supportsNativeLazy) {
        if (index < 6) {
          img.loading = 'eager';
          img.setAttribute('fetchpriority', 'high');
        } else {
          img.loading = 'lazy';
          img.setAttribute('fetchpriority', 'low');
        }
      }
    });

    queueAOSRefresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prioritizePortfolioImages);
  } else {
    prioritizePortfolioImages();
  }

})();
