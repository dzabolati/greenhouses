async function loadProductDetails() {
	try {
		const response = await fetch('products.json');
		const data = await response.json();

		const productSlug = window.location.hash.replace('#', '');
		const product = findProductBySlug(data, productSlug);

		if (product) {
			const title = document.querySelector('.feature__title');
			title.textContent = product.product_name;

			document.title = product.product_name + " - Теплицы Осетии";

			const subtitlesContainer = document.querySelector('.product__subtitles');
			const itemsContainer = document.querySelector('.product__items');
			if (subtitlesContainer) subtitlesContainer.innerHTML = '';
			if (itemsContainer) itemsContainer.innerHTML = '';

			function createAccordionSection(sectionData, subtitleSelector, itemSelector) {
				const subtitlesContainer = document.querySelector(subtitleSelector);
				const itemsContainer = document.querySelector(itemSelector);

				if (sectionData && Array.isArray(sectionData)) {
					sectionData.forEach((section, index) => {
						const subtitle = document.createElement('a');
						subtitle.href = '#';
						subtitle.classList.add('product__subtitle');
						subtitle.innerHTML = `<span>${section.feature}</span>`;
						subtitlesContainer.appendChild(subtitle);

						const item = document.createElement('div');
						item.classList.add('product__item');
						const productDescElement = document.createElement('div');
						productDescElement.classList.add('product__desc');
						item.appendChild(productDescElement);
						itemsContainer.appendChild(item);

						if (Array.isArray(section.value)) {
							const ul = document.createElement('ul');
							ul.classList.add('product__list');

							const firstValue = section.value[0];
							const firstParagraph = document.createElement('p');
							firstParagraph.textContent = firstValue;
							productDescElement.appendChild(firstParagraph);

							section.value.slice(1).forEach(val => {
								const li = document.createElement('li');
								li.textContent = val;
								ul.appendChild(li);
							});

							productDescElement.appendChild(ul);
						} else {
							const descriptionElement = document.createElement('p');
							descriptionElement.textContent = section.value;
							productDescElement.appendChild(descriptionElement);
						}
					});
				}
			}
			function initAccordion(subtitleSelector, itemSelector, activeSubtitleClass, activeItemClass) {
				const subtitles = document.querySelectorAll(subtitleSelector);
				const items = document.querySelectorAll(itemSelector);

				const setActiveTab = (index) => {
					subtitles.forEach((subtitle, i) => {
						if (i === index) {
							subtitle.classList.add(activeSubtitleClass);
						} else {
							subtitle.classList.remove(activeSubtitleClass);
						}
					});

					items.forEach((item, i) => {
						if (i === index) {
							item.classList.add(activeItemClass);
						} else {
							item.classList.remove(activeItemClass);
						}
					});
				};

				subtitles.forEach((subtitle, index) => {
					subtitle.addEventListener('click', (e) => {
						e.preventDefault();
						setActiveTab(index);
					});
				});

				setActiveTab(0);
			}
			if (product.accordion) {
				if (product.accordion.description) {
					createAccordionSection(product.accordion.description, '.product__subtitles', '.product__items');
				}

				if (product.accordion.technical_specifications) {
					createAccordionSection(product.accordion.technical_specifications, '.product__subtitles', '.product__items');
				}

				if (product.accordion.cover_type) {
					createAccordionSection(product.accordion.cover_type, '.product__subtitles', '.product__items');
				}

				if (product.accordion.installation) {
					createAccordionSection(product.accordion.installation, '.product__subtitles', '.product__items');
				}
				initAccordion('.product__subtitle', '.product__item', 'product__subtitle-active', 'product__item-active');
			};

			const galleryImages = document.querySelector('.gallery__images');
			const mainImage = document.querySelector('.gallery__img img');

			galleryImages.innerHTML = '';

			product.images.forEach((imgSrc, index) => {
				const imgLink = document.createElement('a');
				imgLink.href = '#';
				imgLink.classList.add('gallery__thumb');
				if (index === 0) imgLink.classList.add('active');

				const img = document.createElement('img');
				img.src = imgSrc;
				img.alt = `Превью ${index + 1} ${product.product_name}`;

				imgLink.appendChild(img);
				galleryImages.appendChild(imgLink);
			});

			if (product.images.length > 0) {
				mainImage.src = product.images[0];
				mainImage.alt = product.product_name;
			}

			galleryImages.addEventListener('click', (e) => {
				e.preventDefault();
				const thumbLink = e.target.closest('a');
				if (!thumbLink) return;

				const thumbImg = thumbLink.querySelector('img');
				mainImage.src = thumbImg.src;

				document.querySelectorAll('.gallery__thumb').forEach(thumb => {
					thumb.classList.remove('active');
				});
				thumbLink.classList.add('active');
			});

			const initThumbsScroll = () => {
				const thumbsContainer = document.querySelector('.gallery__images');
				const arrowUp = document.querySelector('.gallery__arrow-up button');
				const arrowDown = document.querySelector('.gallery__arrow-down button');

				if (!thumbsContainer || !arrowUp || !arrowDown) return;

				arrowUp.addEventListener('click', (e) => {
					e.preventDefault();
					thumbsContainer.scrollBy({ top: -100, behavior: 'smooth' });
				});

				arrowDown.addEventListener('click', (e) => {
					e.preventDefault();
					thumbsContainer.scrollBy({ top: 100, behavior: 'smooth' });
				});
			};

			initThumbsScroll();

			const features = document.querySelector('.feature__option');
			features.innerHTML = '';
			const subtitleContainer = document.querySelector('.feature__subtitle');
			if (subtitleContainer) {
				const paragraphs = subtitleContainer.querySelectorAll('p');
				paragraphs.forEach(paragraph => {
					paragraph.remove();
				});
			}

			if (product.attributes.width) {
				const widthOptions = product.attributes.width.options;
				const widthContainer = document.createElement('div');
				widthContainer.classList.add('feature__width');
				widthOptions.forEach((width, index) => {
					const button = document.createElement('button');
					button.classList.add('feature__btn');
					button.textContent = width;
					button.dataset.price = product.attributes.width.prices[index];
					button.addEventListener('click', () => updatePrice());
					if (index === 0) {
						button.classList.add('selected');
					}
					widthContainer.appendChild(button);
				});
				features.appendChild(widthContainer);

				const subtitle = document.createElement('p');
				subtitle.textContent = 'Ширина теплицы';
				subtitleContainer.appendChild(subtitle);
			}

			if (product.attributes.length) {
				const lengthOptions = product.attributes.length.options;
				const lengthContainer = document.createElement('div');
				lengthContainer.classList.add('feature__length');
				lengthOptions.forEach((length, index) => {
					const button = document.createElement('button');
					button.classList.add('feature__btn');
					button.textContent = length;
					button.dataset.price = product.attributes.length.prices[index];
					button.addEventListener('click', () => updatePrice());
					if (index === 0) {
						button.classList.add('selected');
					}
					lengthContainer.appendChild(button);
				});
				features.appendChild(lengthContainer);

				const subtitle = document.createElement('p');
				subtitle.textContent = 'Длина теплицы';
				subtitleContainer.appendChild(subtitle);
			}

			if (product.attributes.cover_type) {
				const coverOptions = product.attributes.cover_type.options;
				const coverContainer = document.createElement('div');
				coverContainer.classList.add('feature__cover');
				coverOptions.forEach((cover, index) => {
					const button = document.createElement('button');
					button.classList.add('feature__btn');
					button.textContent = cover;
					button.dataset.price = product.attributes.cover_type.prices[index];
					button.addEventListener('click', () => updatePrice());
					if (index === 0) {
						button.classList.add('selected');
					}
					coverContainer.appendChild(button);
				});
				features.appendChild(coverContainer);

				const subtitle = document.createElement('p');
				subtitle.textContent = 'Тип покрытия';
				subtitleContainer.appendChild(subtitle);
			}

			if (product.attributes.thickness) {
				const thicknessOptions = product.attributes.thickness.options;
				const thicknessContainer = document.createElement('div');
				thicknessContainer.classList.add('feature__thickness');
				thicknessOptions.forEach((thickness, index) => {
					const button = document.createElement('button');
					button.classList.add('feature__btn');
					button.textContent = thickness;
					button.dataset.price = product.attributes.thickness.prices[index];
					button.addEventListener('click', () => updatePrice());
					if (index === 0) {
						button.classList.add('selected');
					}
					thicknessContainer.appendChild(button);
				});
				features.appendChild(thicknessContainer);

				const subtitle = document.createElement('p');
				subtitle.textContent = 'Толщина пленки';
				subtitleContainer.appendChild(subtitle);
			}

			const countContainer = document.createElement('div');
			countContainer.classList.add('feature__count');
			countContainer.innerHTML = `
                <button class="feature__decrease">-</button>
                <p>1</p>
                <span>шт</span>
                <button class="feature__increase">+</button>
            `;
			features.appendChild(countContainer);

			const priceElement = document.querySelector('.feature__price span');
			priceElement.textContent = new Intl.NumberFormat('ru-RU').format(product.base_price);

			const quantityLabel = document.createElement('p');
			quantityLabel.textContent = 'Кол-во, шт';
			subtitleContainer.appendChild(quantityLabel);

			const countElement = document.querySelector('.feature__count p');
			const increaseButton = document.querySelector('.feature__increase');
			const decreaseButton = document.querySelector('.feature__decrease');
			let count = 1;

			if (increaseButton && decreaseButton) {
				increaseButton.addEventListener('click', () => {
					count++;
					countElement.textContent = count;
					updatePrice();
				});

				decreaseButton.addEventListener('click', () => {
					if (count > 1) {
						count--;
						countElement.textContent = count;
						updatePrice();
					}
				});
			}

			function updatePrice() {
				let totalPrice = product.base_price;

				const widthPrice = parseInt(document.querySelector('.feature__width .feature__btn.selected')?.dataset.price) || 0;
				const lengthPrice = parseInt(document.querySelector('.feature__length .feature__btn.selected')?.dataset.price) || 0;
				const coverPrice = parseInt(document.querySelector('.feature__cover .feature__btn.selected')?.dataset.price) || 0;
				const thicknessPrice = parseInt(document.querySelector('.feature__thickness .feature__btn.selected')?.dataset.price) || 0;

				totalPrice += widthPrice + lengthPrice + coverPrice + thicknessPrice;
				totalPrice *= count;

				const priceElement = document.querySelector('.feature__price span');
				priceElement.textContent = `${new Intl.NumberFormat('ru-RU').format(totalPrice)} ${product.currency}`;
				const priceContainer = document.querySelector('.feature__price');
				priceContainer.innerHTML = `<span>${new Intl.NumberFormat('ru-RU').format(totalPrice)}</span> Р`;
			}

			document.querySelectorAll('.feature__btn').forEach(button => {
				button.addEventListener('click', () => {
					const group = button.closest('div');
					group.querySelectorAll('.feature__btn').forEach(btn => btn.classList.remove('selected'));
					button.classList.add('selected');
					updatePrice();
				});
			});

			const priceContainer = document.querySelector('.feature__price');
			if (priceContainer) {
				subtitleContainer.appendChild(priceContainer);
			}

		} else {
			document.querySelector('.product').innerHTML = '<p>Товар не найден.</p>';
		}
	} catch (error) {
		console.error('Ошибка загрузки товара:', error);
	}
}

function findProductBySlug(data, slug) {
	let product = null;
	data.catalog.categories.forEach(category => {
		category.products.forEach(p => {
			if (p.product_slug === slug) {
				product = p;
			}
		});
	});
	return product;
}

document.addEventListener('DOMContentLoaded', loadProductDetails);

window.addEventListener('hashchange', async () => {
	const productContainer = document.querySelector('main');
	if (!productContainer) return;

	productContainer.style.transition = 'opacity 0.3s ease, transform 0.4s ease';
	productContainer.style.opacity = '0';
	productContainer.style.transform = 'translateY(10px)';

	window.scrollTo({ top: 0, behavior: 'smooth' });

	await new Promise(resolve => setTimeout(resolve, 300));

	await loadProductDetails();

	productContainer.style.opacity = '0';
	productContainer.style.transform = 'translateY(-10px)';

	await new Promise(resolve => setTimeout(resolve, 10));

	productContainer.style.opacity = '1';
	productContainer.style.transform = 'translateY(0)';

	setTimeout(() => {
		productContainer.style.removeProperty('transition');
		productContainer.style.removeProperty('opacity');
		productContainer.style.removeProperty('transform');
	}, 400);
});

function addToCart(product) {
	console.log("Adding product to cart:", product);
	let cart = JSON.parse(localStorage.getItem('cart')) || [];

	const productImage = document.querySelector('.gallery__img img') ?
		document.querySelector('.gallery__img img').src : 'path/to/default/image.jpg';
	console.log("Product image used:", productImage);
	product.image = productImage;

	const productKey = JSON.stringify({
		product_id: product.product_id,
		width: product.width,
		length: product.length,
		cover_type: product.cover_type,
		thickness: product.thickness
	});

	const existingProductIndex = cart.findIndex(item => {
		const itemKey = JSON.stringify({
			product_id: item.product_id,
			width: item.width,
			length: item.length,
			cover_type: item.cover_type,
			thickness: item.thickness
		});
		return itemKey === productKey;
	});

	let notificationMessage;
	let isNewItem = false;

	if (existingProductIndex !== -1) {
		cart[existingProductIndex].quantity += product.quantity;
		notificationMessage = `Количество "${product.product_name}" обновлено (${cart[existingProductIndex].quantity} шт.)`;
	} else {
		cart.push(product);
		notificationMessage = `"${product.product_name}" добавлен в корзину`;
		isNewItem = true;
	}

	localStorage.setItem('cart', JSON.stringify(cart));
	updateCartIcon();

	showCartNotification({
		title: isNewItem ? 'Товар добавлен' : 'Корзина обновлена',
		message: notificationMessage,
		isError: false
	});
}

function showCartNotification({ title, message, isError = false }) {
	const existingPopup = document.querySelector('.cart-notification');
	if (existingPopup) existingPopup.remove();

	const popup = document.createElement('div');
	popup.className = `cart-notification cart-notification--${isError ? 'error' : 'success'}`;

	popup.innerHTML = `
        <div class="cart-notification__overlay"></div>
        <div class="cart-notification__container">
            <button class="cart-notification__close" aria-label="Закрыть">×</button>
            <div class="cart-notification__content">
                <h3 class="cart-notification__title">${title}</h3>
                <p class="cart-notification__message">${message}</p>
            </div>
        </div>
    `;

	document.body.appendChild(popup);
	document.body.classList.add('no-scroll');

	setTimeout(() => {
		popup.classList.add('cart-notification--active');
	}, 10);

	const closeNotification = () => {
		popup.classList.remove('cart-notification--active');
		setTimeout(() => {
			popup.remove();
			document.body.classList.remove('no-scroll');
		}, 300);
	};

	popup.querySelector('.cart-notification__close').addEventListener('click', closeNotification);
	popup.querySelector('.cart-notification__overlay').addEventListener('click', closeNotification);

	setTimeout(closeNotification, 700);
}

document.querySelector('.feature__button').addEventListener('click', () => {
	const product = {
		product_id: window.location.hash.replace('#', ''),
		product_name: document.querySelector('.feature__title').textContent,
		base_price: parseInt(document.querySelector('.feature__price span').textContent.replace(/\D/g, '')),
		quantity: parseInt(document.querySelector('.feature__count p').textContent)
	};

	const widthElement = document.querySelector('.feature__width .feature__btn.selected');
	if (widthElement) {
		product.width = widthElement.textContent;
	}

	const lengthElement = document.querySelector('.feature__length .feature__btn.selected');
	if (lengthElement) {
		product.length = lengthElement.textContent;
	}

	const coverElement = document.querySelector('.feature__cover .feature__btn.selected');
	if (coverElement) {
		product.cover_type = coverElement.textContent;
	}

	const thicknessElement = document.querySelector('.feature__thickness .feature__btn.selected');
	if (thicknessElement) {
		product.thickness = thicknessElement.textContent;
	}

	addToCart(product);
});

