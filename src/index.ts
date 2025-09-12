import './scss/styles.scss';
import { ShopApi } from './components/ShopApi';
import { ItemModel } from './components/ItemModel';
import { EventEmitter, IEvents } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { CardView } from './components/CardView';
import { CartModel } from './components/CartModel';
import { ModalView } from './components/ModalView';
import { IItemCard, ItemId, PaymentType } from './types';
import { CartView } from './components/CartView';
import { OrderModel } from './components/OrderModel';
import { OrderAddressView } from './components/OrderAddressView';
import { OrderContactsView } from './components/OrderContactsView';
import { OrderSuccessView } from './components/OrderSuccesView';


export class Presenter {
	private _items: ItemModel;
	private _cart: CartModel;
	private _cardView: CardView;
	private _api: ShopApi;
	private events: IEvents;
	private gallery: HTMLElement;
	private _modalView: ModalView;
	private modalContainer: HTMLElement;
	private _cartView: CartView;
	private cartButton: HTMLElement;
	private _orderModel: OrderModel;
	private _orderAddressView: OrderAddressView;
	private _orderContactsView: OrderContactsView;
	private _orderSuccessView: OrderSuccessView;

	constructor() {
		this.events = new EventEmitter();
		this._items = new ItemModel(this.events);
		this._cart = new CartModel(this.events);
		this._api = new ShopApi(API_URL);

		this.modalContainer = document.getElementById('modal-container') as HTMLElement;
		this.gallery = document.querySelector('.gallery') as HTMLElement;
		this.cartButton = document.querySelector('.header__basket') as HTMLElement;

		this._modalView = new ModalView(this.modalContainer, this.events);
		this._cardView = new CardView('card-catalog', this.events);
		this._cartView = new CartView(this.modalContainer, this.cartButton, this.events);
		this._orderModel = new OrderModel(this.events);
		this._orderAddressView = new OrderAddressView(this.modalContainer, this.events);
		this._orderContactsView = new OrderContactsView(this.modalContainer, this.events);
		this._orderSuccessView = new OrderSuccessView(this.modalContainer, this.events);

		this.init();
	}

	init() {
		this._api.getProducts().then(data => {
			const getItems = data.items.map(item => ({
				...item,
				image: CDN_URL + item.image
			}));
			this._items.setItems(getItems);
		});

		this.events.on('items:changed', () => { // отображаем каталог
			this.renderCatalog();
		});

		this.events.on('item:click', (data: { id: ItemId }) => { // открываем карточку с товаром
			this.openItemModal(data.id);
		});

		this.events.on('cart:click', () => { // открываем корзину
			this.openCart();
		});

		this.events.on('cart:changed', () => { // перерисовываем корзину
			this.updateCart();
			if (this.activeModal === 'cart') {
				this.openCart();
			}
		});

		this.events.on('item:add', (data: { id: ItemId }) => { // слушает добавление карточки
			this.addToCart(data.id);
			if (this.activeModal === 'item') {
				this.openItemModal(data.id);
			}
		});

		this.events.on('item:delete', (data: { id: ItemId }) => { // слушает удаление карточки
			this.removeFromCart(data.id);
			if (this.activeModal === 'item') {
				this.openItemModal(data.id);
			}
		});

		this.events.on('cart:submit', () => { // переход к следующему модальному окну
			this.openOrderAddress();
		})

		this.events.on('order:paymentInput', (data: { payment: PaymentType }) => {  // работа с инпутом, сохранение и валидация
			this._orderModel.updateInput('payment', data.payment);
		});

		this.events.on('order:addressInput', (data: { addressInput: string }) => {  // работа с инпутом, сохранение и валидация
			this._orderModel.updateInput('address', data.addressInput);
		});

		this.events.on('order:addressSubmit', () => { // переход к следующему модальному окну
			this.openOrderContacts();
		});

		this.events.on('order:emailInput', (data: { email: string}) => {   // работа с инпутом, сохранение и валидация
			this._orderModel.updateInput('email', data.email);
		});

		this.events.on('order:phoneInput', (data: { phone: string}) => {   // работа с инпутом, сохранение и валидация
			this._orderModel.updateInput('phone', data.phone);
		});

		this.events.on('order:contactsSubmit', async () => { // проверяет валидность, отправляет данные на сервер, в случае успеха выводит модалку с успешным заказом

			const isValid = this._orderModel.validateForm();

			if (!isValid) {
				console.log('ошибка')
			}
			const cartItems = this.getCartItems();
			const total = this._cart.getTotal(cartItems);

			const orderData = {
				payment: this._orderModel['_data'].payment,
				email: this._orderModel['_data'].email,
				phone: this._orderModel['_data'].phone,
				address: this._orderModel['_data'].address,
				total,
				items: cartItems.map(item => item.id)
			};

			try {
				const response = await this._api.createOrder(orderData);

				this._cart.clearCart();
				this._orderModel.clear();

				const successForm = this._orderSuccessView.render(response);
				this._modalView.open(successForm);
			} catch (err) {
				console.error(err);
			}
		});
	}

	private activeModal: 'cart' | 'item' | null = null;

	private renderCatalog() {
		this.gallery.innerHTML = '';
		const items = this._items.getAllItems();

		items.forEach(item => {
			const card = this._cardView.render(item, false);
			this.gallery.appendChild(card);
		});
	}

	private openItemModal(id: ItemId): void {
		const item = this._items.getItem(id);

		const modalCardView = new CardView('card-preview', this.events);
		const inCart = this._cart.items.includes(id);
		const modalContent = modalCardView.render(item, inCart);
		this.activeModal = 'item';

		this._modalView.open(modalContent);
	}

	private openCart(): void {
		const cartItems = this.getCartItems();
		const total = this._cart.getTotal(cartItems);

		this.activeModal = 'cart';
		const basket = this._cartView.render(cartItems, total);
		this._modalView.open(basket);
	}

	private openOrderAddress(): void {
		const form = this._orderAddressView.render();
		this._modalView.open(form);
	}

	private openOrderContacts(): void {
		const form = this._orderContactsView.render();
		this._modalView.open(form);
	}

	private updateCart(): void {
		const counter = document.querySelector('.header__basket-counter') as HTMLElement;
		counter.textContent = this._cart.count.toString();
	}

	private addToCart(id: ItemId): void {
		this._cart.addItem(id);
	}

	private removeFromCart(id: ItemId): void {
		this._cart.deleteItem(id);
	}

	private getCartItems(): IItemCard[] {
		return this._cart.items
			.map(id => this._items.getItem(id))
			.filter(item => item !== null) as IItemCard[];
	}
}

new Presenter();