import { IEvents } from './base/events';
import { IItemCard } from '../types';

export class CardView {
	private template: HTMLTemplateElement;
	private events: IEvents;

	constructor(templateId: string, events: IEvents) {
		this.template = document.getElementById(templateId) as HTMLTemplateElement;
		this.events = events;
	}

	render(card: IItemCard, inCart: boolean): HTMLElement {
		const element = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const title = element.querySelector(".card__title") as HTMLElement;
		const category = element.querySelector(".card__category") as HTMLElement;
		const description = element.querySelector(".card__text") as HTMLElement;
		const price = element.querySelector(".card__price") as HTMLElement;
		const image = element.querySelector(".card__image") as HTMLImageElement;
		const button = element.querySelector(".button") as HTMLButtonElement;

		title.textContent = card.title;
		category.textContent = card.category;
		if (description) description.textContent = card.description;
		price.textContent = card.price ? `${card.price} синапсов` : "Бесценно";
		image.src = card.image;
		image.alt = card.title;

		if (button) {
			if (card.price === null) {
				button.disabled = true;
				button.textContent = "Недоступно";
			} else {
				button.textContent = inCart ? "Удалить из корзины" : "Купить";
				button.addEventListener("click", (e) => {
					e.stopPropagation();
					this.events.emit(inCart ? "item:delete" : "item:add", { id: card.id });
				});
			}
		}

		element.addEventListener("click", () => {
			this.events.emit("item:click", { id: card.id });
		});

		return element;
	}
}