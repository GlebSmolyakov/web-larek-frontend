import { IEvents } from './base/events';
import { PaymentType } from '../types';

export class OrderAddressView {
	private container: HTMLElement;
	private template: HTMLTemplateElement;
	private events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;
		this.template = document.getElementById('order') as HTMLTemplateElement;
	}

	render(): HTMLElement {
		const form = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const addressInput = form.querySelector<HTMLInputElement>('input[name="address"]')!;
		const onlineBtn = form.querySelector<HTMLButtonElement>('button[name="card"]')!;
		const cashBtn = form.querySelector<HTMLButtonElement>('button[name="cash"]')!;
		const submitBtn = form.querySelector<HTMLButtonElement>('button.order__button')!;

		let payment: PaymentType | null = null;

		onlineBtn.addEventListener('click', () => {
			payment = 'online';
			this.events.emit('order:paymentInput', { payment });

			onlineBtn.classList.add('button_alt-active');
			cashBtn.classList.remove('button_alt-active');

			submitBtn.disabled = !addressInput.value;
		});

		cashBtn.addEventListener('click', () => {
			payment = 'offline';
			this.events.emit('order:paymentInput', { payment });

			onlineBtn.classList.remove('button_alt-active');
			cashBtn.classList.add('button_alt-active');

			submitBtn.disabled = !addressInput.value;
		});

		addressInput.addEventListener('input', () => {
			this.events.emit('order:addressInput', { addressInput: addressInput.value });
			submitBtn.disabled = !addressInput.value || !payment;
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (!payment || !addressInput.value) return;
			this.events.emit('order:addressSubmit', {
				payment,
				address: addressInput.value
			});
		});

		this.container.appendChild(form);
		return form;
	}
}