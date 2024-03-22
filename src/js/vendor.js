// WaitFor timeout helper function
const waitFor = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
// End WaitFor timeout helper function

// Throttle helper function
const throttle = (func, delay = 250) => {
  let isThrottled = false;
  let savedArgs = null;
  let savedThis = null;

  return function wrap(...args) {
    if (isThrottled) {
      (savedArgs = args), (savedThis = this);
      return;
    }

    func.apply(this, args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;

      if (savedThis) {
        wrap.apply(savedThis, savedArgs);
        savedThis = null;
        savedArgs = null;
      }
    }, delay);
  };
};
// End Throttle helper function

// Responsive helper function
function moveElementOnBreakpoint({ element: movedSelector, to: [toSelector, toPosition = 0], breakpoint }) {
  const movedNode = document.querySelector(movedSelector);

  if (!movedNode) {
    // console.error(`${movedSelector} is not valid selector!`)
    return;
  }

  let isMoved = false;

  const fromNode = movedNode.parentElement || document.body;
  const toNode = document.querySelector(toSelector);

  if (!toNode) {
    // console.error(`${toSelector} is not valid selector!`)
    return;
  }

  const initialIndex = Array.from(fromNode.children).indexOf(movedNode);

  function move() {
    const windowWidth = window.innerWidth;

    if (windowWidth <= breakpoint && !isMoved) {
      if (toNode.children.length > 0) {
        toNode.insertBefore(movedNode, toNode.children[toPosition]);
      } else {
        toNode.appendChild(movedNode);
      }
      isMoved = true;
    } else if (windowWidth > breakpoint && isMoved) {
      if (fromNode.children.length > 0) {
        const children = Array.from(fromNode.children);
        const newPosition = Math.min(initialIndex, children.length - 1);

        fromNode.insertBefore(movedNode, children[newPosition].nextSibling);
      } else {
        fromNode.appendChild(movedNode);
      }
      isMoved = false;
    }
  }

  window.addEventListener('resize', throttle(() => move()));

  move();
}


// Responsive helper function

// Mobile 100vh fix
function watchWindowHeight() {
  const updateWindowHeight = () => {
    document.documentElement.style.setProperty(
      '--window-height',
      `${window.innerHeight}px`
    );
  };
  updateWindowHeight();
  window.addEventListener('resize', throttle(updateWindowHeight));
}

// End Mobile 100vh fix

// Get and update header height
function watchHeaderHeight() {
  const updateHeaderHeight = () => {
    const headerHeight = document.querySelector('.header')?.offsetHeight;
  
    document.documentElement.style.setProperty(
      '--header-height',
      `${headerHeight}px`
    );
  };
  updateHeaderHeight();
  window.addEventListener('resize', throttle(updateHeaderHeight));
}

// End Get and update header height

// Menu
class Menu {
  constructor(options) {
    this.html = document.querySelector('html');
    this.isInit = false;
    this.isAnimating = false;

    const defaultOptions = {
      menu: document.querySelector('[data-menu]'),
      burger: document.querySelector('[data-burger]'),
      close: document.querySelector('[data-menu-close]'),
      overlay: document.querySelector('[data-menu-overlay]'),
      navLinks: document.querySelectorAll('[data-menu-item]'),
      burgerCaption: 'Открыть меню',
      burgerActiveCaption: 'Закрыть меню',
      transitionDelay: 400,
      transitionEasing: 'ease-in-out',
      breakpoint: 1024,
      display: 'block',
      disableScroll: true,
      onOpen: () => {},
      onClose: () => {},
    };
    this.options = { ...defaultOptions, ...options };

    this.closeHandler = this.close.bind(this, options);
    this.toggleHandler = this.toggle.bind(this, options);

    this._init();
  }

  async open() {
    if (this.isAnimating) return;

    this.isAnimating = true;

    this.options.onOpen();
    this.options.menu.style.transition =
      this.options.transitionDelay / 1000 + 's' + this.options.transitionEasing;
    this.options.burger.style.transition =
      this.options.transitionDelay / 1000 + 's' + this.options.transitionEasing;

    if (this.options.overlay) {
      this.options.overlay.style.transition =
        this.options.transitionDelay / 1000 +
        's' +
        this.options.transitionEasing;
      this.options.overlay.style.display = 'block';
    }

    this.options.menu.style.display = this.options.display;
    this.options.burger.setAttribute('aria-expanded', 'true');
    this.options.burger.setAttribute(
      'aria-label',
      this.options.burgerActiveCaption
    );

    if (this.options.disableScroll) {
      this.html.classList.add('disable-scroll');
    }

    await waitFor(1);

    if (this.options.overlay) {
      this.options.overlay.classList.add('is-active');
    }

    this.options.menu.classList.add('is-active');
    this.options.burger.classList.add('is-active');

    await waitFor(this.options.transitionDelay);

    this.options.menu.style.transition = '';
    this.options.burger.style.transition = '';

    if (this.options.overlay) {
      this.options.overlay.style.transition = '';
    }

    this.isAnimating = false;
  }

  async close() {
    if (this.isAnimating) return;

    this.isAnimating = true;

    this.options.onClose();

    this.options.menu.style.transition =
      this.options.transitionDelay / 1000 + 's' + this.options.transitionEasing;
    this.options.burger.style.transition =
      this.options.transitionDelay / 1000 + 's' + this.options.transitionEasing;

    if (this.options.overlay) {
      this.options.overlay.style.transition =
        this.options.transitionDelay / 1000 +
        's' +
        this.options.transitionEasing;
      this.options.overlay.classList.remove('is-active');
    }

    this.options.menu.classList.remove('is-active');
    this.options.burger.classList.remove('is-active');
    this.options.burger.setAttribute('aria-expanded', 'false');
    this.options.burger.setAttribute('aria-label', this.options.burgerCaption);

    if (this.options.disableScroll) {
      this.html.classList.remove('disable-scroll');
    }

    await waitFor(this.options.transitionDelay);

    if (this.options.overlay) {
      this.options.overlay.style.display = '';
      this.options.overlay.style.transition = '';
    }

    this.options.menu.style.display = '';

    this.options.menu.style.transition = '';
    this.options.burger.style.transition = '';

    this.isAnimating = false;
  }

  toggle() {
    this.options.menu.classList.contains('is-active')
      ? this.close()
      : this.open();
  }

  _init() {
    if (!this.options.menu) return;
    this.options.burger.setAttribute('aria-label', this.options.burgerCaption);
    this._events();
  }

  _addListeners() {
    this.options.burger?.addEventListener('click', this.toggleHandler);
    this.options.close?.addEventListener('click', this.closeHandler);
    this.options.overlay?.addEventListener('click', this.closeHandler);
    this.options.navLinks?.forEach((el) =>
      el.addEventListener('click', this.closeHandler)
    );
  }

  _removeListeners() {
    this.options.burger?.removeEventListener('click', this.toggleHandler);
    this.options.close?.removeEventListener('click', this.closeHandler);
    this.options.overlay?.removeEventListener('click', this.closeHandler);
    this.options.navLinks?.forEach((el) =>
      el.removeEventListener('click', this.closeHandler)
    );
  }

  _events() {
    const initEvents = () => {
      // Enable menu on screens <= breakpoint, otherwise disable it
      if (window.innerWidth <= this.options.breakpoint) {
        if (this.isInit) return;
        this._addListeners();
        this.isInit = true;
      } else {
        if (!this.isInit) return;
        this.close();
        this._removeListeners();
        this.isInit = false;
      }
    };

    initEvents();

    window.addEventListener('resize', throttle(initEvents));
  }
}
// End Menu

// Modals
class SimpleModal {
  constructor(options) {
    const defaultOptions = {
      onInit: () => { },
      beforeOpen: () => { },
      onOpen: () => { },
      beforeClose: () => { },
      onClose: () => { },
      disableScroll: true,
      transitionDelay: 250,
      nested: true,
      overlayCloseAll: true,
      fixPageOffset: true,
      fixedBlocks: [],
    };
    this.options = { ...defaultOptions, ...options };
    this.html = document.querySelector('html');
    this.body = document.querySelector('body');
    this.modalNodes = document.querySelectorAll('.modal');
    this.activeModalNodes = document.querySelectorAll('.modal.is-open');
    this.isAnimated = false;
  }
  init() {
    if (this.modalNodes.length > 0) {
      this.modalNodes.forEach((modalNode) => {
        modalNode.style.transitionDuration =
          this.options.transitionDelay / 1000 + 's';
      });
      this._events();
      this.options.onInit();
    }
  }
  async open(id) {
    if (this.isAnimated) return;

    if (this.activeModalNodes.length > 0) {
      await this.closeAll();
      await waitFor(this.options.transitionDelay + 100);
    }

    const modalNode = document.querySelector('#' + id);

    this.options.beforeOpen(modalNode);

    modalNode.setAttribute('aria-hidden', false);
    this.isAnimated = true;
    
    await waitFor(1);

    modalNode.classList.add('is-open');
    modalNode.focus();

    if (this.options.disableScroll) {
      this._disableScroll(modalNode);
    }

    await waitFor(this.options.transitionDelay);

    this.isAnimated = false;
    this.activeModalNodes = document.querySelectorAll('.modal.is-open');
    this.options.onOpen(modalNode);
  }
  async close(id) {
    if (this.isAnimated) return;

    const modalNode = document.querySelector('#' + id);

    this.options.beforeClose(modalNode);

    this.isAnimated = true;
    modalNode.classList.remove('is-open');

    if (this.options.disableScroll && this.activeModalNodes.length === 1) {
      this._enableScroll(modalNode);
    }

    await waitFor(this.options.transitionDelay);

    modalNode.setAttribute('aria-hidden', true);
    this.isAnimated = false;
    this.activeModalNodes = document.querySelectorAll('.modal.is-open');
    this.options.onClose(modalNode);
  }
  async closeAll() {
    this.activeModalNodes.forEach(async (modalNode) => {
      this.isAnimated = false;
      await this.close(modalNode.id);
    });
  }
  _events() {
    const initEvents = (e) => {
      const openTrigger = e.target.closest('[data-modal]');
      const closeTrigger = e.target.closest('[data-modal-close]');
      const modalNode = e.target.closest('.modal');
      const isOverlay = modalNode && !e.target.closest('.modal__inner');

      if (openTrigger) {
        e.preventDefault();
        const modalId = openTrigger.dataset.modal;

        if (!this.options.nested && this.activeModalNodes.length > 0) {
          this.closeAll();
          waitFor(this.options.transitionDelay);
          this.open(modalId);
        } else {
          this.open(modalId);
        }
      } else if (closeTrigger) {
        e.preventDefault();
        const modalId = closeTrigger.dataset.modalClose || modalNode.id;
        this.close(modalId);
      } else if (isOverlay) {
        if (this.options.overlayCloseAll && this.activeModalNodes.length > 0) {
          this.closeAll();
        } else {
          this.close(modalNode.id);
        }
      }
    };

    document.body.addEventListener('click', initEvents);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAll();
      } else if (e.key === 'Tab') {
      }
    });
  }

  _enableScroll(modalNode) {
    if (this.options.fixPageOffset) {
      this.options.fixedBlocks.forEach((el) => (el.style.paddingRight = ''));
      this.body.style.paddingRight = '';
    }

    this.html.style.overflow = '';
    this.body.style.overflow = '';

    if (this.options.fixPageOffset) {
      modalNode.style.paddingRight = '';
    }
  }

  _disableScroll(modalNode) {
    const scrollWidth = window.innerWidth - this.body.offsetWidth + 'px';
    if (this.options.fixPageOffset) {
      this.options.fixedBlocks.forEach(
        (el) => (el.style.paddingRight = scrollWidth)
      );

      this.body.style.paddingRight = scrollWidth;
    }
    
    this.html.style.overflow = 'hidden';
    this.body.style.overflow = 'hidden';

  }
}
// End Modals

// Tabs
function initTabs(triggerSelector, contentSelector, isPrevent = true, duration = 250, breakpoint) {
  const triggerNodes = document.querySelectorAll(triggerSelector);
  const parentNodes = document.querySelectorAll(contentSelector);

  if (triggerNodes.length <= 0 || parentNodes.length <= 0) return;

  const transitionDuration = duration;
  const startActive = document.querySelector(contentSelector + '.is-active');

  startActive.style.opacity = 1;

  let isAnimated = false;

  parentNodes.forEach((parentNode) => parentNode.style.transition = transitionDuration / 1000 + 's ease-in-out');

  triggerNodes.forEach((triggerNode) => {
    triggerNode.addEventListener('click', (e) => {
      if (breakpoint && window.innerWidth <= breakpoint) return;
      
      if (isPrevent) e.preventDefault();
      
      if (triggerNode.classList.contains('is-active') || isAnimated) return;
      
      const activeTrigger = document.querySelector(
        triggerSelector + '.is-active'
      );
      const activeParent = document.querySelector(
        contentSelector + '.is-active'
      );

      const id = triggerNode.getAttribute('data-tabs');
      const newActiveParent = document.querySelector(
        contentSelector + '[data-tabs="' + id + '"]'
      );

      activeTrigger.classList.remove('is-active');
      triggerNode.classList.add('is-active');

      isAnimated = true;

      hide(activeParent).then(() => {
        activeParent.classList.remove('is-active');
        newActiveParent.classList.add('is-active');

        setTimeout(() => {
        
        show(newActiveParent).then(() => {
            isAnimated = false;
          });
        }, 10);
      });

    });
  });

  async function hide(el) {
    el.style.opacity = 0;

    return waitFor(transitionDuration);
  }

  async function show(el) {
    el.style.opacity = 1;

    return waitFor(transitionDuration);
  }
}
// End Tabs

// Accordions
function initAccordions(itemsSelector, controlSelector, contentSelector) {
  const accordions = document.querySelectorAll(itemsSelector);

  if (accordions.length <= 0) return;

  accordions.forEach(item => {
    const control = item.querySelector(controlSelector);
    const content = item.querySelector(contentSelector);

    control.addEventListener('click', (e) => {
      item.classList.toggle('is-active');

      if (item.classList.contains('is-active')) {
        control.setAttribute('aria-expanded', true);
        control.setAttribute('aria-label', 'Свернуть');
        control.setAttribute('title', 'Свернуть');
        content.setAttribute('aria-hidden', false);
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        control.setAttribute('aria-expanded', false);
        content.setAttribute('aria-hidden', true);
        control.setAttribute('aria-label', 'Развернуть');
        control.setAttribute('title', 'Развернуть');
        content.style.maxHeight = null;
      }
    })
  })
}
// End Accordions

// Animations on scroll
function initAnimationsOnScroll(animItems) {

  if (animItems.length <= 0) return;

  window.addEventListener('scroll', animOnScroll);

  function animOnScroll() {
    for (let i = 0; i < animItems.length; i++) {
      const animItem = animItems[i];
      const trigger = document.querySelector(animItem.dataset.trigger);
      let animItemHeight = trigger ? trigger.offsetHeight : animItem.offsetHeight;
      let animItemOffset = trigger ? offset(trigger).top : offset(animItem).top;
      const animStart = 4.5;
      let delay = animItem.dataset.animateDelay;

      
      if (window.innerWidth <= 1200) {
        delay = 0;
        animItemHeight = animItem.offsetHeight;
        animItemOffset = offset(animItem).top;
      }

      if (delay) animItem.style.animationDelay = delay + 's';

      let animItemPoint = window.innerHeight - animItemHeight / animStart;

      if (animItemHeight > window.innerHeight) {
        animItemPoint = window.innerHeight - window.innerHeight / animStart;
      }

      
      if (
        pageYOffset > animItemOffset - animItemPoint &&
        pageYOffset < animItemOffset + animItemHeight
      ) {
        if (animItem.dataset?.animate === 'counter' && !animItem.classList.contains('is-animated')) {
          animateCounter(animItem)
        }
        animItem.classList.add('is-animated');

      } else {
        if (animItem.hasAttribute('data-animate-repeat')) {
          animItem.classList.remove('is-animate');
        }
      }
    }
  }

  function animateCounter(counter) {
    const speed = 200;
    const value = +counter.dataset.value;
    const data = +counter.innerText;

    const time = value / speed;
    if (data < value) {
      counter.innerText = Math.ceil(data + time);
      setTimeout(() => animateCounter(counter), 1);
    } else {
      counter.innerText = value;
    }
  }

  function offset(el) {
    const rect = el.getBoundingClientRect(),
      scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  setTimeout(() => {
    animOnScroll();
  }, 300);

}
// End Animations on scroll