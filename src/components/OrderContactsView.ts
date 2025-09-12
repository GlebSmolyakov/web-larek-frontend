import { IEvents } from './base/events';

export class OrderContactsView {
	private container: HTMLElement;
	private template: HTMLTemplateElement;
	private events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;
		this.template = document.getElementById('contacts') as HTMLTemplateElement;
	}

	render(): HTMLElement {
		const form = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')!;
		const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]')!;
		const submitBtn = form.querySelector<HTMLButtonElement>('button')!;

		const validate = () => {
			const isValid = emailInput.value.trim() !== '' && phoneInput.value.trim() !== '';
			submitBtn.disabled = !isValid;
			return isValid;
		};

		emailInput.addEventListener('input', () => {
			this.events.emit('order:emailInput', { email: emailInput.value });
			validate();
		});

		phoneInput.addEventListener('input', () => {
			this.events.emit('order:phoneInput', { phone: phoneInput.value });
			validate();
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (!validate()) return;
			this.events.emit('order:contactsSubmit', {
				email: emailInput.value,
				phone: phoneInput.value
			});
		});

		this.container.appendChild(form);
		return form;
	}
}