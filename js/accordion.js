document.addEventListener('DOMContentLoaded', () => {
	const initAccordion = (subtitleSelector, itemSelector, activeSubtitleClass, activeItemClass) => {
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
	};

	initAccordion('.product__subtitle', '.product__item', 'product__subtitle-active', 'product__item-active');
	initAccordion('.accordion__subtitle', '.accordion__item', 'accordion__subtitle-active', 'accordion__item-active');
	initAccordion('.delivery__subtitle', '.delivery__content', 'delivery__subtitle-active', 'delivery__content-active');
});
