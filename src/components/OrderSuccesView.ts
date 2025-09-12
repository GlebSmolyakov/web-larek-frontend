import { IEvents } from './base/events';
import { IOrderResponse } from '../types';

export class OrderSuccessView {
	private container: HTMLElement;
	private template: HTMLTemplateElement;
	private events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;
		this.template = document.getElementById('success') as HTMLTemplateElement;
	}

	render(order: IOrderResponse): HTMLElement {
		const element = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const description = element.querySelector<HTMLElement>('.order-success__description')!;
		description.textContent = `Списано ${order.total} синапсов`;

		this.container.appendChild(element);
		return element;
	}
}