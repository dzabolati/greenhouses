function createProductCard(product) {
	const productCard = document.createElement('div');
	productCard.classList.add('popular__card', 'card');

	const cardWrapper = document.createElement('div');
	cardWrapper.classList.add('card__wrapper');

	const cardImg = document.createElement('div');
	cardImg.classList.add('card__img');
	const img = document.createElement('img');
	img.src = product.images[0];
	img.alt = product.product_name;
	cardImg.appendChild(img);

	const cardTitle = document.createElement('h3');
	cardTitle.classList.add('card__title');
	cardTitle.textContent = product.product_name;

	const cardList = document.createElement('ul');
	cardList.classList.add('card__list');

	const widthItem = document.createElement('li');
	widthItem.classList.add('card__item');
	widthItem.textContent = `Ширина - ${product.attributes.width.options[0]}`;
	cardList.appendChild(widthItem);

	if (product.attributes.length) {
		const lengthItem = document.createElement('li');
		lengthItem.classList.add('card__item');
		lengthItem.textContent = `Длина от ${product.attributes.length.options[0]}`;
		cardList.appendChild(lengthItem);
	}

	if (product.attributes.metal_type) {
		const metalItem = document.createElement('li');
		metalItem.classList.add('card__item');
		metalItem.textContent = `Оцинкованная труба ${product.attributes.metal_type}`;
		cardList.appendChild(metalItem);
	}
	if (product.attributes.thickness) {
		const thicknessItem = document.createElement('li');
		thicknessItem.classList.add('card__item');
		thicknessItem.textContent = `Толщина от ${product.attributes.thickness.options[0]}`;
		cardList.appendChild(thicknessItem);
	}

	const cardPrice = document.createElement('div');
	cardPrice.classList.add('card__price');
	cardPrice.innerHTML = `От <span>${new Intl.NumberFormat('ru-RU').format(product.base_price)} ${product.currency}</span>`;

	const buttonsWrapper = document.createElement('div');
	buttonsWrapper.classList.add('card__buttons');

	const detailButton = document.createElement('button');
	detailButton.classList.add('card__btn', 'btn');
	detailButton.textContent = 'Подробнее';

	detailButton.addEventListener('click', () => {
		window.location.href = `product.html#${product.product_slug}`;
	});


	buttonsWrapper.appendChild(detailButton);

	cardWrapper.appendChild(cardImg);
	cardWrapper.appendChild(cardTitle);
	cardWrapper.appendChild(cardList);
	cardWrapper.appendChild(cardPrice);
	cardWrapper.appendChild(buttonsWrapper);

	productCard.appendChild(cardWrapper);
	return productCard;
}

async function loadPopularProducts() {
	try {
		const response = await fetch('products.json');
		const data = await response.json();

		const productList = document.getElementById('popular-list');
		const allPopularProducts = [];

		data.catalog.categories.forEach(category => {
			if (category.products.length > 0) {
				const popularProducts = category.products.filter(product => product.is_popular);

				popularProducts.forEach(product => {
					const productCard = createProductCard(product);
					productList.appendChild(productCard);
					allPopularProducts.push(productCard);
				});
			}
		});

		if (allPopularProducts.length === 0) {
			productList.innerHTML = '<p>Нет популярных товаров.</p>';
		}

	} catch (error) {
		console.error('Ошибка загрузки популярных товаров:', error);
	}
}

document.addEventListener('DOMContentLoaded', loadPopularProducts); 