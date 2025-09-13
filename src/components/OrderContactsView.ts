import { IEvents } from './base/events';

export class OrderContactsView {
	private container: HTMLElement;
	private template: HTMLTemplateElement;
	private events: IEvents;
	private form: HTMLElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;

		this.template = document.getElementById('contacts') as HTMLTemplateElement;
		this.form = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.emailInput = this.form.querySelector<HTMLInputElement>('input[name="email"]')!;
		this.phoneInput = this.form.querySelector<HTMLInputElement>('input[name="phone"]')!;
		this.submitButton = this.form.querySelector<HTMLButtonElement>('button')!;

		this.emailInput.addEventListener('input', () => {
			this.events.emit('order:input', { key: 'email', value: this.emailInput.value });
		});

		this.phoneInput.addEventListener('input', () => {
			this.events.emit('order:input', { key: 'phone', value: this.phoneInput.value });
		});

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('order:contactsSubmit', {
				email: this.emailInput.value,
				phone: this.phoneInput.value
			});
		});
	}

	render(): HTMLElement {
		return this.form;
	}

	setSubmitEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}

	reset(): void {
		this.emailInput.value = '';
		this.phoneInput.value = '';
	}
}