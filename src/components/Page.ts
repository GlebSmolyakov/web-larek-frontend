export class Page {
	modalContainer: HTMLElement;
	gallery: HTMLElement;
	cartButton: HTMLElement;
	counter: HTMLElement;

	constructor(){
	this.modalContainer = document.getElementById('modal-container') as HTMLElement;
	this.gallery = document.querySelector('.gallery') as HTMLElement;
	this.cartButton = document.querySelector('.header__basket') as HTMLElement;
	this.counter = document.querySelector('.header__basket-counter') as HTMLElement;
}
}