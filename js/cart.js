document.addEventListener('DOMContentLoaded', () => {
	displayCart();
});

function displayCart() {
	const cartContainer = document.querySelector('.cart-page__items');
	cartContainer.innerHTML = '';

	const cart = JSON.parse(localStorage.getItem('cart')) || [];

	if (cart.length === 0) {
		cartContainer.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty__icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="#535353" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 6H21" stroke="#535353" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#535353" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="cart-empty__title">Ваша корзина пуста</h3>
                <p class="cart-empty__text">Но это легко исправить!</p>
                <button onclick="document.location='catalog.html'" class="cart-empty__btn btn">Перейти в каталог</button>
            </div>
        `;
		document.querySelector('.cart-page__controls').style.display = 'none';
		return;
	}

	cart.forEach(item => {
		const itemKey = generateItemKey(item);

		const cartItem = document.createElement('div');
		cartItem.classList.add('cart-page__item', 'item');
		cartItem.innerHTML = `
            <div class="item__wrapper">
                <div class="item__info">
                    <div class="item__img">
                        <img src="${item.image}" alt="${item.product_name}">
                    </div>
                    <div class="item__desc">
                        <div class="item__title">${item.product_name}</div>
                        <div class="item__characters">
                            <div class="item__subtitles">
                            ${item.width ? `<p>Ширина</p>` : ''}
                            ${item.length ? `<p>Длина</p>` : ''}
                            ${item.cover_type ? `<p>Покрытие</p>` : ''}
                            ${item.thickness ? `<p>Толщина</p>` : ''}
                        </div>
                            <div class="item__choose">
                                ${item.width ? `<p>${item.width}</p>` : ''}
                                ${item.length ? `<p>${item.length}</p>` : ''}
                                ${item.cover_type ? `<p>${item.cover_type}</p>` : ''}
                                ${item.thickness ? `<p>${item.thickness}</p>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item__count">
                    <button class="item__decrease item__btn" data-key="${encodeURIComponent(itemKey)}">-</button>
                    <p>${item.quantity}</p>
                    <button class="item__increase item__btn" data-key="${encodeURIComponent(itemKey)}">+</button>
                </div>
                <div class="item__price">
                    <p>${new Intl.NumberFormat('ru-RU').format(item.base_price * item.quantity)} Р</p>
                </div>
                <button class="item__delete" data-key="${encodeURIComponent(itemKey)}">Удалить</button>
            </div>
        `;
		cartContainer.appendChild(cartItem);
	});

	updateTotalPrice();
}

function generateItemKey(item) {
	return JSON.stringify({
		product_id: item.product_id,
		width: item.width || null,
		length: item.length || null,
		cover_type: item.cover_type || null,
		thickness: item.thickness || null
	});
}

function findItemInCart(cart, key) {
	try {
		const searchObj = JSON.parse(decodeURIComponent(key));
		return cart.findIndex(item => {
			return item.product_id === searchObj.product_id &&
				(item.width || null) === searchObj.width &&
				(item.length || null) === searchObj.length &&
				(item.cover_type || null) === searchObj.cover_type &&
				(item.thickness || null) === searchObj.thickness;
		});
	} catch (e) {
		console.error('Error parsing item key:', e);
		return -1;
	}
}

document.addEventListener('click', (event) => {
	if (event.target.classList.contains('item__increase')) {
		const productKey = event.target.dataset.key;
		let cart = JSON.parse(localStorage.getItem('cart')) || [];
		const productIndex = findItemInCart(cart, productKey);

		if (productIndex !== -1) {
			cart[productIndex].quantity += 1;
			localStorage.setItem('cart', JSON.stringify(cart));
			displayCart();
			updateCartIcon();
		}
	}

	if (event.target.classList.contains('item__decrease')) {
		const productKey = event.target.dataset.key;
		let cart = JSON.parse(localStorage.getItem('cart')) || [];
		const productIndex = findItemInCart(cart, productKey);

		if (productIndex !== -1) {
			if (cart[productIndex].quantity > 1) {
				cart[productIndex].quantity -= 1;
			} else {
				cart.splice(productIndex, 1);
			}
			localStorage.setItem('cart', JSON.stringify(cart));
			displayCart();
			updateCartIcon();
		}
	}

	if (event.target.classList.contains('item__delete')) {
		const productKey = event.target.dataset.key;
		let cart = JSON.parse(localStorage.getItem('cart')) || [];
		const productIndex = findItemInCart(cart, productKey);

		if (productIndex !== -1) {
			cart.splice(productIndex, 1);
			localStorage.setItem('cart', JSON.stringify(cart));
			displayCart();
			updateTotalPrice();
			updateCartIcon();
		}
	}
});

function updateTotalPrice() {
	const cart = JSON.parse(localStorage.getItem('cart')) || [];

	const totalPriceElement = document.querySelector('.cart-page__finalPrice p:last-child');
	if (cart.length === 0) {
		totalPriceElement.textContent = '0 Р';
		return;
	}

	const totalPrice = cart.reduce((total, item) => total + (item.base_price * item.quantity), 0);
	totalPriceElement.textContent = `${new Intl.NumberFormat('ru-RU').format(totalPrice)} Р`;
}

function updateCartIcon() {
	const cart = JSON.parse(localStorage.getItem('cart')) || [];
	const cartIcon = document.querySelector('.header__cart span');
	if (cartIcon) {
		cartIcon.textContent = cart.reduce((total, item) => total + item.quantity, 0);
	}
}