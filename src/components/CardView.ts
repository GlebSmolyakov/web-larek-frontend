import { IEvents } from './base/events';
import { IItemCard } from '../types';

export class CardView {
	private template: HTMLTemplateElement;
	private events: IEvents;

	private currentId: string | null = null;
	private element: HTMLElement;
	private title: HTMLElement;
	private category: HTMLElement;
	private description: HTMLElement;
	private price: HTMLElement;
	private image: HTMLImageElement;
	private button : HTMLButtonElement
	private categoryClass: Record<string, string> = {
		'софт-скил': 'soft',
		'хард-скил': 'hard',
		'другое': 'other',
		'дополнительное': 'additional',
		'кнопка': 'button'
	};

	constructor(templateId: string, events: IEvents) {
		this.template = document.getElementById(templateId) as HTMLTemplateElement;
		this.events = events;

		this.element = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
		this.title = this.element.querySelector(".card__title");
		this.category = this.element.querySelector(".card__category");
		this.description = this.element.querySelector(".card__text");
		this.price = this.element.querySelector(".card__price");
		this.image = this.element.querySelector(".card__image");
		this.button = this.element.querySelector(".button");

		if (this.button) {
			this.button.addEventListener("click", (e) => {
				e.stopPropagation();
				if (!this.currentId) return;
				this.events.emit(
					this.button!.dataset.action as 'item:add' | 'item:delete',
					{ id: this.currentId }
				);
			});
		}

		this.element.addEventListener("click", () => {
			this.events.emit("item:click", { id: this.currentId});
		});
	}

	getCurrentId(): string | null {
		return this.currentId;
	}

	setInCart(inCart: boolean): void {
		if (!this.button || this.currentId === null) return;

		if (inCart) {
			this.button.textContent = 'Удалить из корзины';
			this.button.dataset.action = 'item:delete';
		} else {
			this.button.textContent = 'В корзину';
			this.button.dataset.action = 'item:add';
		}
	}

	setCardData(card: IItemCard, inCart: boolean, type: 'catalog' | 'preview') {
		this.currentId = card.id;

		if (type === 'catalog') {
			this.title.textContent = card.title;
			this.category.textContent = card.category;
			this.category.className = 'card__category';
			this.category.classList.add(`card__category_${this.categoryClass[card.category.toLowerCase()]}`);
			this.price.textContent = card.price ? `${card.price} синапсов` : 'Бесценно';
			this.image.src = card.image;
			this.image.alt = card.title;
		}

		if (type === 'preview') {
			this.title.textContent = card.title;
			this.category.textContent = card.category;
			this.description.textContent = card.description;
			this.price.textContent = card.price ? `${card.price} синапсов` : 'Бесценно';
			this.image.src = card.image;
			this.image.alt = card.title;
			this.category.className = 'card__category';
			this.category.classList.add(`card__category_${this.categoryClass[card.category.toLowerCase()]}`);

			if (card.price === null) {
				this.button.disabled = true;
				this.button.textContent = 'Недоступно';
			} else {
				this.button.disabled = false;
				this.setInCart(inCart);
			}
		}
	}

	render(): HTMLElement {
		return this.element
	}
}