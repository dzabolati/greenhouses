let popupBg = document.querySelector('.popup');
let popup = document.querySelector('.popup__form');
let openPopupButtons = document.querySelectorAll('.cart-page__btn');
let closePopupButton = document.querySelector('.popup__close');

openPopupButtons.forEach((button) => {
	button.addEventListener('click', (e) => {
		e.preventDefault();
		popupBg.classList.add('popup-active');
		popup.classList.add('popup__form-active');
	})
});

closePopupButton.addEventListener('click', () => {
	popupBg.classList.remove('popup-active');
	popup.classList.remove('popup__form-active');
});

document.addEventListener('click', (e) => {
	if (e.target === popupBg) {
		popupBg.classList.remove('popup-active');
		popup.classList.remove('popup__form-active');
	}
});