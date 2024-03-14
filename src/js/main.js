document.addEventListener('DOMContentLoaded', () => {
	const MENU_BREAKPOINT = 1024;

	watchWindowHeight();
	watchHeaderHeight();
	initMenu();
	initModals();
	initTabs('.general__tab', '.general__content-item');
	initTabs('.order-form__tab', '.order-form__tabs-item');
	initTabs('.login__link', '.login__form');
	initSlider('.news__slider', {
		perPage: 2,
		perMove: 1,
		pagination: false,
		gap: 20,
		speed: 1000,
		type: 'loop',
		breakpoints: {
			768: {
				perPage: 1,
			},
		},
	});
	initSlider('.reviews__slider', {
		perPage: 3,
		perMove: 1,
		pagination: false,
		gap: 20,
		speed: 1000,
		type: 'loop',
		breakpoints: {
			580: {
				perPage: 1,
			},
			900: {
				perPage: 2,
			},
		},
	});
	initThumbsSlider('.product__slider', '.product__thumbs')
	initSeoMore();
	initProductCounter();
	initRadioTabs();
	initTogglePassword();

	// Show more block
	function initSeoMore() {
		const container = document.querySelector('.seo__text');
		const btn = document.querySelector('.seo__btn');

		if (!btn || !container) return;

		btn.addEventListener('click', () => {
			container.classList.add('is-active');
		})
	}

	function initTogglePassword() {
		const items = document.querySelectorAll('.form-password');

		items.forEach(item => {
			const input = item.querySelector('input');
			const btn = item.querySelector('.form-password__btn');
			
			btn.addEventListener('click', (e) => {
				if (item.classList.contains('is-show')) {
					item.classList.remove('is-show');
					input.type = 'password';
				} else {
					item.classList.add('is-show');
					input.type = 'text';
				}
			})
		})
	}
	
	function initRadioTabs() {
		const radios = document.querySelectorAll('.order-form__radios--tabs .form-radio-icons__item');

		radios.forEach(triggerNode => {
			const input = triggerNode.querySelector('input');

			input.addEventListener('change', (e) => {
				const activeTrigger = document.querySelector(
					'.form-radio-icons__item.is-active'
				);
				const activeParent = document.querySelector(
					'.order-form__radio-content.is-active'
				);
	
				const id = triggerNode.getAttribute('data-tabs');
				const newActiveParent = document.querySelector(
					'.order-form__radio-content[data-tabs="' + id + '"]'
				);

				activeParent.classList.remove('is-active');
				activeTrigger.classList.remove('is-active');
				triggerNode.classList.add('is-active');
				newActiveParent.classList.add('is-active');
			})
		})

	}

	// Product counter
	function initProductCounter() {
		const counter = document.querySelector('.product__counter');
		const price = document.querySelector('#productPrice');

		if (!counter || !price) return;

		const btnPlus = counter.querySelector('.counter__btn--plus');
		const btnMinus = counter.querySelector('.counter__btn--minus');
		const input = counter.querySelector('.counter__input');

		updateCounter(input.value);

		btnMinus.addEventListener('click', (e) => updateCounter(+input.value - 1));
		btnPlus.addEventListener('click', (e) => updateCounter(+input.value + 1));
		input.addEventListener('input', (e) => updateCounter(+e.target.value));

		function updateCounter(value) {
			// Корректный ввод
			if (+value <= +input.max && +value >= +input.min) {
				input.value = value;
			}

			// Блокировка кнопки + при макисмальном значении
			if (+value + 1 > +input.max) {
				btnPlus.disabled = true;
			} else {
				btnPlus.disabled = false;
			}
			
			// Блокировка кнопки - при макисмальном значении
			if (+value <= +input.min) {
				btnMinus.disabled = true;
			} else {
				btnMinus.disabled = false;
			}

			// Ограничение input значениями min и max 
			if (+value > +input.max) {
				input.value = +input.max;
			} 
			if (+value < +input.min) {
				input.value = +input.min;
			}

			// Обновление цены
			price.textContent = input.value * +price.dataset.price;
		}
	}

	// Menu
	function initMenu() {
		const header = document.querySelector('.header');

		const menu = new Menu({
			menu: document.querySelector('.header__menu'),
			burger: document.querySelector('.header__burger'),
			overlay: document.querySelector('.header-overlay'),
			burgerCaption: 'Открыть меню',
			display: 'flex',
			burgerActiveCaption: 'Закрыть меню',
			transitionDelay: 400,
			breakpoint: MENU_BREAKPOINT,
			onOpen: () =>
				document.querySelector('.header').classList.add('is-active'),
			onClose: () =>
				document.querySelector('.header').classList.remove('is-active'),
		});

		window.menu = menu;

		// Mobile menu
		const menuLinks = document.querySelectorAll('.header__menu a');

		menuLinks.forEach((link) => {
			link.addEventListener('click', (e) => {
				if (window.innerWidth > MENU_BREAKPOINT) return;
				if (!link.parentElement.classList.contains('header__submenu')) {
					menu.close();
				}
			});
		});

		window.addEventListener(
			'scroll',
			throttle(() => {
				if (window.scrollY >= 100) {
					header.classList.add('is-fixed');
				} else {
					header.classList.remove('is-fixed');
				}
			})
		);
	}

	// Modals
	function initModals() {
		const options = {
			transitionDelay: 350,
			onOpen: () => {
				document.querySelector('.page-wrapper').ariaHidden = true;
				menu.close();
			},
			onClose: () => {
				document.querySelector('.page-wrapper').ariaHidden = false;
			},
			fixedBlocks: [document.querySelector('.header')],
		};

		window.SimpleModal = new SimpleModal(options);
		window.SimpleModal.init();
	}

	// Sliders
	function initSlider(selector, options) {
		const slider = document.querySelector(selector);

		if (!slider) return;

		const splide = new Splide(slider, options);

		splide.mount(window.splide.Extensions);
	}

	function initThumbsSlider(mainSelector, thumbsSelector) {
		const slider = document.querySelector(mainSelector);

		if (!slider) return;
		
		const main = new Splide(mainSelector, {
			type: 'fade',
			rewind: true,
			arrows: false,
		});


		const thumbnails = new Splide(thumbsSelector, {
			perPage: 4,
			gap: 16,
			rewind: true,
			pagination: false,
			arrows: false,
			isNavigation: true,
			breakpoints: {
				600: {
					fixedWidth: 84,
					fixedHeight: 87,
				},
			},
		});


		main.sync(thumbnails);
		main.mount();
		thumbnails.mount();
	}

});
