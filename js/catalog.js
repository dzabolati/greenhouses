let currentPage = 1;
const itemsPerPage = 8;

async function displayProducts(page, allProducts) {
	const productList = document.getElementById('product-list');
	if (!productList) return;
	productList.style.transition = 'opacity 0.3s ease';
	productList.style.opacity = '0';
	await new Promise(resolve => setTimeout(resolve, 300));
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = page * itemsPerPage;

	allProducts.forEach((product, index) => {
		if (index >= startIndex && index < endIndex) {
			product.style.display = 'flex';
			product.style.opacity = '0';
			product.style.transform = 'translateY(20px)';
		} else {
			product.style.display = 'none';
		}
	});
	requestAnimationFrame(() => {
		productList.style.opacity = '1';

		const visibleProducts = Array.from(allProducts)
			.filter((_, index) => index >= startIndex && index < endIndex);

		visibleProducts.forEach((product, i) => {
			product.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
			product.style.opacity = '1';
			product.style.transform = 'translateY(0)';

			setTimeout(() => {
				product.style.removeProperty('transition');
				product.style.removeProperty('opacity');
				product.style.removeProperty('transform');
			}, 500 + i * 50);
		});
	});
}

function updatePagination(allProducts) {
	const totalPages = Math.ceil(allProducts.length / itemsPerPage);

	const paginationList = document.querySelector('.pagination__list');
	paginationList.innerHTML = '';

	for (let i = 1; i <= totalPages; i++) {
		const pageItem = document.createElement('li');
		pageItem.classList.add('pagination__item');
		pageItem.dataset.page = i;

		const pageLink = document.createElement('a');
		pageLink.href = '#';
		pageLink.textContent = i;
		pageItem.appendChild(pageLink);
		paginationList.appendChild(pageItem);
	}

	document.querySelectorAll('.pagination__item').forEach(item => {
		item.classList.remove('active');
		if (parseInt(item.dataset.page) === currentPage) {
			item.classList.add('active');
		}
	});

	const nextPageButton = document.getElementById('nextPage');
	if (currentPage === totalPages || totalPages === 0) {
		nextPageButton.disabled = true;
	} else {
		nextPageButton.disabled = false;
	}

	const prevPageButton = document.getElementById('prevPage');
	if (currentPage === 1) {
		prevPageButton.disabled = true;
	} else {
		prevPageButton.disabled = false;
	}
}

document.querySelector('.pagination__list').addEventListener('click', async (e) => {
	e.preventDefault();
	if (e.target.tagName === 'A') {
		currentPage = parseInt(e.target.parentElement.dataset.page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
		await displayProducts(currentPage, document.querySelectorAll('.catalog-page__card'));
		updatePagination(document.querySelectorAll('.catalog-page__card'));
	}
});

document.getElementById('prevPage').addEventListener('click', async (e) => {
	e.preventDefault();
	if (currentPage > 1) {
		currentPage--;
		window.scrollTo({ top: 0, behavior: 'smooth' });
		await displayProducts(currentPage, document.querySelectorAll('.catalog-page__card'));
		updatePagination(document.querySelectorAll('.catalog-page__card'));
	}
});

document.getElementById('nextPage').addEventListener('click', async (e) => {
	e.preventDefault();
	const allProducts = document.querySelectorAll('.catalog-page__card');
	if (currentPage < Math.ceil(allProducts.length / itemsPerPage)) {
		currentPage++;
		window.scrollTo({ top: 0, behavior: 'smooth' });
		await displayProducts(currentPage, allProducts);
		updatePagination(allProducts);
	}
});

async function loadProducts() {
	try {
		const response = await fetch('products.json');
		const data = await response.json();

		const productList = document.getElementById('product-list');
		if (productList.children.length > 0) {
			productList.style.transition = 'opacity 0.3s ease';
			productList.style.opacity = '0';

			await new Promise(resolve => setTimeout(resolve, 300));
		}
		const allProducts = [];

		const categorySlug = window.location.hash.replace('#', '') || 'dachnye-teplicy';

		const category = data.catalog.categories.find(c => c.category_slug === categorySlug);

		productList.innerHTML = '';
		productList.style.opacity = '0';
		productList.style.transform = 'translateY(20px)';
		productList.style.transition = 'none';

		if (category && category.products.length > 0) {
			productList.innerHTML = '';

			category.products.forEach(product => {
				const productCard = document.createElement('div');
				productCard.classList.add('catalog-page__card', 'card');

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

				productList.appendChild(productCard);

				allProducts.push(productCard);
			});
		} else {
			productList.innerHTML = '<p>Нет товаров в этой категории.</p>';
		}

		currentPage = 1;

		displayProducts(currentPage, allProducts);
		updatePagination(allProducts);
		requestAnimationFrame(() => {
			productList.style.transition = 'opacity 0.4s ease, transform 0.5s ease';
			productList.style.opacity = '1';
			productList.style.transform = 'translateY(0)';

			setTimeout(() => {
				productList.style.removeProperty('transition');
				productList.style.removeProperty('opacity');
				productList.style.removeProperty('transform');
			}, 500);
		});
	} catch (error) {
		console.error('Ошибка загрузки товаров:', error);
	}
}

window.addEventListener('hashchange', async () => {
	await loadProducts();
});

document.addEventListener('DOMContentLoaded', loadProducts);