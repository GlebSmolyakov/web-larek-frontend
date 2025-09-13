import { IEvents } from "./base/events";

export class CartView {
	private template: HTMLTemplateElement;
	private container: HTMLElement;
	private events: IEvents;
	private openButton: HTMLElement;

	private _list: HTMLElement;
	private _total: HTMLElement;
	private orderButton: HTMLButtonElement;
	private _basket: HTMLElement;

	constructor(container: HTMLElement, openButton: HTMLElement, events: IEvents) {
		this.container = container;
		this.openButton = openButton;
		this.events = events;

		this.template = document.getElementById("basket") as HTMLTemplateElement;
		this._basket = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this._list = this._basket.querySelector(".basket__list") as HTMLElement;
		this._total = this._basket.querySelector(".basket__price") as HTMLElement;
		this.orderButton = this._basket.querySelector(".basket__button") as HTMLButtonElement;

		this.orderButton.addEventListener("click", () => {
			this.events.emit("cart:submit");
		});
		this.openButton.addEventListener("click", () => {
			this.events.emit("cart:click");
		});

	}

	set list(items: HTMLElement[]) {
		this._list.innerHTML = "";
		if (items.length === 0) {
			this.orderButton.disabled = true;
			const empty = document.createElement("li");
			empty.classList.add("basket__item-clear");
			empty.textContent = "Корзина пуста";
			this._list.appendChild(empty);
		} else {
			this.orderButton.disabled = false;
			this._list.replaceChildren(...items);
		}
	}

	set total(total: number) {
		this._total.textContent = total + " синапсов";
	}

	render(): HTMLElement {
		return this._basket;
	}
}


