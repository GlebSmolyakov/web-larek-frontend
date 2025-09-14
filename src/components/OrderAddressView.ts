import { IEvents } from './base/events';
import { PaymentType } from '../types';

export class OrderAddressView {
	private container: HTMLElement;
	private template: HTMLTemplateElement;
	private events: IEvents;
	private addressInput: HTMLInputElement;
	private onlineButton: HTMLButtonElement;
	private offlineButton: HTMLButtonElement;
	private submitButton: HTMLButtonElement;
	private form: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;

		this.template = document.getElementById('order') as HTMLTemplateElement;
		this.form = this.template.content.firstElementChild.cloneNode(true) as HTMLFormElement;

		this.addressInput = this.form.querySelector('input[name="address"]')!;
		this.onlineButton = this.form.querySelector('button[name="card"]')!;
		this.offlineButton = this.form.querySelector('button[name="cash"]')!;
		this.submitButton = this.form.querySelector('button.order__button')!;

		this.addressInput.addEventListener('input', () => {
			this.events.emit('order:input', { key: "address", value: this.addressInput.value });
		});

		this.onlineButton.addEventListener('click', () => {
			this.events.emit('order:input', { key: "payment", value: 'online' });
		});

		this.offlineButton.addEventListener('click', () => {
			this.events.emit('order:input', { key: "payment", value: 'offline' });
		});

		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('order:addressSubmit');
		});
	}

	render(): HTMLElement {
		return this.form
	}

	setPaymentActive(payment: PaymentType) {
		if (payment === 'online') {
			this.onlineButton.classList.add('button_alt-active');
			this.offlineButton.classList.remove('button_alt-active');
		} else if (payment === 'offline') {
			this.onlineButton.classList.remove('button_alt-active');
			this.offlineButton.classList.add('button_alt-active');
		} else {
			this.onlineButton.classList.remove('button_alt-active');
			this.offlineButton.classList.remove('button_alt-active');
		}
	}

	setSubmitEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}

	reset(): void {
		this.addressInput.value = '';
		this.onlineButton.classList.remove('button_alt-active');
		this.offlineButton.classList.remove('button_alt-active');
		this.submitButton.disabled = true;
	}
}