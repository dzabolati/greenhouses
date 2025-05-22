document.querySelector('.burger').addEventListener('click', function () {
	this.classList.toggle('burger-active');
	document.querySelector('.header__list').classList.toggle('header__list-active');
})

const tx = document.getElementsByClassName('form__textarea');
for (var i = 0; i < tx.length; i++) {
	tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
	tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
	this.style.height = 'auto';
	this.style.height = (this.scrollHeight) + 'px';
}

document.addEventListener("DOMContentLoaded", function () {
	const btnUp = document.querySelector('.btn-up');

	window.addEventListener('scroll', function () {
		if (window.scrollY > 100) {
			btnUp.classList.add('btn-up-active');
		} else {
			btnUp.classList.remove('btn-up-active');
		}
	});

	btnUp.addEventListener('click', function (event) {
		event.preventDefault();
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});
});

let popupBgCall = document.querySelector('.popup-call');
let popupCall = document.querySelector('.popup-call__form');
let openCallPopupButtons = document.querySelectorAll('.call__btn');
let closeCallPopupButton = document.querySelector('.popup-call__close');

openCallPopupButtons.forEach((button) => {
	button.addEventListener('click', (e) => {
		e.preventDefault();
		popupBgCall.classList.add('popup-call-active');
		popupCall.classList.add('popup-call__form-active');
	})
});

closeCallPopupButton.addEventListener('click', () => {
	popupBgCall.classList.remove('popup-call-active');
	popupCall.classList.remove('popup-call__form-active');
});

document.addEventListener('click', (e) => {
	if (e.target === popupBgCall) {
		popupBgCall.classList.remove('popup-call-active');
		popupCall.classList.remove('popup-call__form-active');
	}
});

async function loadCategories() {
	try {
		const response = await fetch('products.json');
		const data = await response.json();

		const categories = data.catalog.categories;

		const categoryList = document.getElementById('catalog-list');
		if (categoryList) {
			categories.forEach(category => {
				const categoryLink = document.createElement('a');
				categoryLink.href = `#${category.category_slug}`;
				categoryLink.classList.add('catalog-page__item');

				const categoryText = document.createElement('span');
				categoryText.textContent = category.category_name;

				categoryLink.appendChild(categoryText);
				categoryList.appendChild(categoryLink);
			});
		}

		const categoryListIndex = document.getElementById('catalog-list-index');
		if (categoryListIndex) {
			categories.forEach(category => {
				const categoryListItem = document.createElement('li');
				categoryListItem.classList.add('catalog__item');

				const categoryMenuLink = document.createElement('a');
				categoryMenuLink.href = `./catalog.html#${category.category_slug}`;
				categoryMenuLink.textContent = category.category_name;

				categoryListItem.appendChild(categoryMenuLink);
				categoryListIndex.appendChild(categoryListItem);
			});
		}

	} catch (error) {
		console.error('Ошибка загрузки категорий:', error);
	}
}
document.addEventListener('DOMContentLoaded', loadCategories);

function updateBreadcrumbs() {
	const breadcrumbsList = document.querySelector('.breadcrumbs__list');
	if (!breadcrumbsList) return;

	const isUsingHtmlExtension = window.location.pathname.includes('.html');

	breadcrumbsList.innerHTML = '';
	addBreadcrumbItem(breadcrumbsList, isUsingHtmlExtension ? '/index.html' : '/', 'Главная');

	const routeMap = {
		'services': { title: 'Услуги', file: 'services.html' },
		'about': { title: 'О компании', file: 'about.html' },
		'contacts': { title: 'Контакты', file: 'contacts.html' },
		'delivery': { title: 'Доставка и оплата', file: 'delivery.html' },
		'catalog': { title: 'Каталог', file: 'catalog.html' },
		'cart': { title: 'Корзина', file: 'cart.html' }
	};

	const slugMapping = {
		'dachnye-teplicy': 'Дачные теплицы',
		'promyshlennye-teplicy': 'Промышленные теплицы',
		'plenka': 'Тепличная плёнка',
		'polikarbonat': 'Поликарбонат',
		'fastener': 'Крепеж',
		'oborudovanie-dlya-poliva': 'Оборудование для полива',
		'ukryvnye-materialy': 'Укрывные материалы',
		'zatenyayushchie-seti': 'Затеняющие сети',
		'sistemy-ventilyatsii': 'Системы вентиляции',
		'udobreniya': 'Удобрения',
		'osveshenie': 'Освещение',
	};

	const currentPath = window.location.pathname;
	const urlSegments = currentPath.split('/').filter(Boolean);
	const isProductPage = currentPath.includes('product');

	for (const [path, data] of Object.entries(routeMap)) {
		if (currentPath.includes(path)) {
			const href = isUsingHtmlExtension ? `/${data.file}` : `/${path}`;
			addBreadcrumbItem(breadcrumbsList, href, data.title);
			break;
		}
	}

	if (currentPath.includes('catalog')) {
		const categorySlug = window.location.hash.replace('#', '');
		if (categorySlug) {
			const baseHref = isUsingHtmlExtension ? '/catalog.html' : '/catalog';

			const categoryName = slugMapping[categorySlug] || formatSlug(categorySlug);

			addBreadcrumbItem(
				breadcrumbsList,
				`${baseHref}#${categorySlug}`,
				categoryName,
				true
			);
		}
	}
	if (isProductPage) {
		addBreadcrumbItem(
			breadcrumbsList,
			isUsingHtmlExtension ? '/catalog.html' : '/catalog',
			'Каталог',
			false
		);
	}

	if (breadcrumbsList.children.length === 1 && urlSegments.length > 0) {
		addBreadcrumbItem(breadcrumbsList, '#', 'Текущая страница', true);
	}
}

function addBreadcrumbItem(container, href, text, isCurrent = false) {
	const item = document.createElement('li');
	item.classList.add('breadcrumbs__item');
	item.innerHTML = isCurrent
		? `<a>${text}</a>`
		: `<a href="${href}">${text}</a>`;
	container.appendChild(item);
}

function formatSlug(slug) {
	return slug
		.replace(/-/g, ' ')
		.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
}

document.addEventListener('DOMContentLoaded', updateBreadcrumbs);
window.addEventListener('hashchange', updateBreadcrumbs);

function updateCartIcon() {
	const cart = JSON.parse(localStorage.getItem('cart')) || [];
	const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
	document.querySelector('.cart__count span').textContent = cartCount;
}

document.addEventListener('DOMContentLoaded', updateCartIcon);

document.querySelectorAll('form').forEach(form => {
	form.addEventListener('submit', function (e) {
		e.preventDefault();

		const nameInput = form.querySelector('input[name="user_name"]');
		const phoneInput = form.querySelector('input[name="user_phone"]');
		const emailInput = form.querySelector('input[name="user_email"], input[name="user_mail"]');
		const messageInput = form.querySelector('textarea[name="user_message"]');
		let isValid = true;

		form.querySelectorAll('.error-message').forEach(el => el.remove());
		form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));

		if (!/^[а-яА-ЯёЁa-zA-Z]{2,}$/.test(nameInput.value.trim())) {
			showError(nameInput, 'Только буквы (минимум 2)');
			isValid = false;
		}

		const phoneValue = phoneInput.value.replace(/\D/g, '');
		if (!/^[78]\d{10}$/.test(phoneValue)) {
			showError(phoneInput, 'Введите корректный российский номер');
			isValid = false;
		}

		if (emailInput && emailInput.value.trim() !== '') {
			const emailValue = emailInput.value.trim();
			if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(emailValue)) {
				showError(emailInput, 'Введите корректный e-mail');
				isValid = false;
			}
		}

		if (isValid) {
			sendFormData(form);
		}
	});
});

function sendFormData(form) {
	const formData = new FormData(form);
	const formType = form.querySelector('[name="form_type"]').value;

	if (formType === 'order') {
		try {
			const cart = JSON.parse(localStorage.getItem('cart')) || [];
			formData.append('cart', JSON.stringify(cart));
		} catch (e) {
			console.error('Ошибка чтения корзины:', e);
		}
	}

	const submitBtn = form.querySelector('[name="user_submit"]');
	if (submitBtn) {
		submitBtn.disabled = true;
		submitBtn.classList.add('button--loading');
	}

	fetch('send.php', {
		method: 'POST',
		body: formData
	})
		.then(response => {
			if (!response.ok) throw new Error('Ошибка сети');
			return response.json();
		})
		.then(data => {
			if (!data.success) throw new Error(data.error || 'Ошибка сервера');

			if (formType === 'order') {
				localStorage.removeItem('cart');
				window.location.href = 'thanks.html';
			} else {
				showThanksPopup({
					title: 'Заявка принята!',
					message: 'Мы свяжемся с вами в ближайшее время'
				});
			}
		})
		.catch(error => {
			showThanksPopup({
				title: 'Ошибка',
				message: error.message,
				isError: true
			});
		})
		.finally(() => {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.classList.remove('button--loading');
			}
		});
}

function showThanksPopup({ title, message, isError = false }) {
	const popup = document.createElement('div');
	popup.className = `thanks-popup thanks-popup--${isError ? 'error' : 'success'}`;

	popup.innerHTML = `
	  <div class="thanks-popup__overlay"></div>
	  <div class="thanks-popup__container">
		<button class="thanks-popup__close" aria-label="Закрыть">×</button>
		<div class="thanks-popup__content">
		  <h3 class="thanks-popup__title">${title}</h3>
		  <p class="thanks-popup__message">${message}</p>
		</div>
	  </div>
	`;

	document.body.appendChild(popup);
	document.body.classList.add('no-scroll');

	setTimeout(() => {
		popup.classList.add('thanks-popup--active');
	}, 10);

	const closePopup = () => {
		popup.classList.remove('thanks-popup--active');
		setTimeout(() => {
			popup.remove();
			document.body.classList.remove('no-scroll');
		}, 300);
	};

	popup.querySelector('.thanks-popup__close').addEventListener('click', closePopup);
	popup.querySelector('.thanks-popup__overlay').addEventListener('click', closePopup);

	if (!isError) {
		setTimeout(closePopup, 5000);
	}
}

function applyPhoneMask(input) {
	let value = input.value.replace(/\D/g, '');

	if (value.startsWith('7') || value.startsWith('8')) {
		value = value.substring(1);
	}

	let formattedValue = '+7 (';

	if (value.length > 0) {
		formattedValue += value.substring(0, 3);
	}
	if (value.length > 3) {
		formattedValue += ') ' + value.substring(3, 6);
	}
	if (value.length > 6) {
		formattedValue += '-' + value.substring(6, 8);
	}
	if (value.length > 8) {
		formattedValue += '-' + value.substring(8, 10);
	}

	input.value = formattedValue;
}

document.querySelectorAll('input[type="tel"][name="user_phone"]').forEach(input => {
	input.addEventListener('input', function (e) {
		applyPhoneMask(this);
	});
});

function showError(input, message) {
	input.classList.add('error');
	const errorDiv = document.createElement('div');
	errorDiv.className = 'error-message';
	errorDiv.style.color = '#ff0000';
	errorDiv.style.fontSize = '12px';
	errorDiv.style.marginTop = '5px';
	errorDiv.textContent = message;
	input.parentNode.appendChild(errorDiv);
}
