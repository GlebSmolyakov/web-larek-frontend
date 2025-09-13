import { IItemCard } from '../types';
import { IEvents } from './base/events';

export class CartViewItem {
	private item: IItemCard;
	private events: IEvents;
	private element: HTMLElement;
	private deleteButton: HTMLButtonElement;
	private index: HTMLElement;
	private title: HTMLElement;
	private price: HTMLElement;

	constructor(item: IItemCard, events: IEvents) {
		this.item = item;
		this.events = events;

		const template = document.getElementById("card-basket") as HTMLTemplateElement;
		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.index = this.element.querySelector(".basket__item-index") as HTMLElement;
		this.title = this.element.querySelector(".card__title") as HTMLElement;
		this.price = this.element.querySelector(".card__price") as HTMLElement;

		this.title.textContent = this.item.title;
		this.price.textContent = this.item.price + " синапсов";

		this.deleteButton = this.element.querySelector(".basket__item-delete") as HTMLButtonElement;

		this.deleteButton.addEventListener("click", (e) => {
			e.stopPropagation();
			this.events.emit("item:delete", { id: this.item.id });
		});
	}

	setIndex(index: number) {
		this.index.textContent = (index + 1).toString();
	}

	render(): HTMLElement {
		return this.element;
	}
}