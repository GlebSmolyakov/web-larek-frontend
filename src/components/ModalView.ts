import { IEvents } from './base/events';

export class ModalView {
	private container: HTMLElement;
	private closeButton: HTMLElement;
	private content: HTMLElement;
	protected events: IEvents;
	
	constructor(container: HTMLElement,events: IEvents) {
		this.container = container;
		this.content = container.querySelector('.modal__content') as HTMLElement;
		this.closeButton = container.querySelector('.modal__close') as HTMLElement;
		this.events = events;
		
		this.closeButton.addEventListener('click', () => this.close())

		this.container.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			if (
				target === this.container ||
				target.classList.contains('modal__close') ||
				target.classList.contains('order-success__close')
			) {
				this.close();
			}
		});
	}

	open(content?: HTMLElement): void {
		if (content){
			this.setContent(content);
		}
		document.body.style.overflow = 'hidden';
		this.container.classList.add('modal_active');
		this.events.emit('modal:open')
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.content.innerHTML = '';
		document.body.style.overflow = '';
		this.events.emit('modal:close')
	}

	setContent(content: HTMLElement): void {
		this.content.innerHTML = '';
		this.content.appendChild(content);
	}


}

