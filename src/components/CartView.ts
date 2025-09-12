import { IEvents } from "./base/events";
import { IItem, IItemCard } from '../types';

export class CartView {
	private template: HTMLTemplateElement;
	private itemTemplate: HTMLTemplateElement;
	private container: HTMLElement;
	private events: IEvents;
	private openButton: HTMLElement;

	constructor(container: HTMLElement, openBtn: HTMLElement, events: IEvents) {
		this.container = container;
		this.openButton = openBtn;
		this.events = events;
		this.template = document.getElementById("basket") as HTMLTemplateElement;
		this.itemTemplate = document.getElementById("card-basket") as HTMLTemplateElement;

		this.openButton.addEventListener("click", () => {
			this.events.emit("cart:click");
		});
	}

	render(items: IItemCard[], total: number): HTMLElement {

		const basket = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const list = basket.querySelector(".basket__list") as HTMLElement;
		const _total = basket.querySelector(".basket__price") as HTMLElement;
		const orderButton = basket.querySelector(".basket__button") as HTMLButtonElement;

		_total.textContent = total + " синапсов";

		if (items.length === 0) {
			orderButton.disabled = true;
			const add = document.createElement('li')
			add.classList.add("basket__item-clear");
			add.textContent = 'Корзина пуста';
			list.appendChild(add)
		}

		items.forEach((item: IItem, index: number): void => {
			const li = this.itemTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

			const _index = li.querySelector(".basket__item-index") as HTMLElement;
			const title = li.querySelector(".card__title") as HTMLElement;
			const price = li.querySelector(".card__price") as HTMLElement;
			const deleteButton = li.querySelector(".basket__item-delete") as HTMLButtonElement;

			_index.textContent = (index + 1).toString();
			title.textContent = item.title;
			price.textContent = item.price + " синапсов";


			deleteButton.addEventListener("click", (e) => {
				e.stopPropagation();
				this.events.emit("item:delete", { id: item.id });
			});

			list.appendChild(li);
		});

		orderButton.addEventListener("click", () => {
			this.events.emit("cart:submit");
		});

		return basket;
	}
}

