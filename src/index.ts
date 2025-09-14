import './scss/styles.scss';
import { ShopApi } from './components/ShopApi';
import { ItemModel } from './components/ItemModel';
import { EventEmitter, IEvents } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { CardView } from './components/CardView';
import { CartModel } from './components/CartModel';
import { ModalView } from './components/ModalView';
import { IItemCard, IOrderFormInput, ItemId, PaymentType } from './types';
import { CartView } from './components/CartView';
import { OrderModel } from './components/OrderModel';
import { OrderAddressView } from './components/OrderAddressView';
import { OrderContactsView } from './components/OrderContactsView';
import { OrderSuccessView } from './components/OrderSuccesView';
import { CartViewItem } from './components/CartViewItem';
import { Page } from './components/Page';


export class Presenter {
	private _items: ItemModel;
	private _cart: CartModel;
	private _api: ShopApi;
	private events: IEvents;
	private _modalView: ModalView;
	private _cartView: CartView;
	private _orderModel: OrderModel;
	private _orderAddressView: OrderAddressView;
	private _orderContactsView: OrderContactsView;
	private _orderSuccessView: OrderSuccessView;
	private activeModal: 'cart' | 'item' | 'order-contacts' | 'order-address' | null = null;
	private cartViewItems: CartViewItem[] = [];
	private page : Page;
	private _modalCardView: CardView | null = null;

	constructor() {
		this.events = new EventEmitter();
		this._items = new ItemModel(this.events);
		this._cart = new CartModel(this.events);
		this._api = new ShopApi(API_URL);

		this.page = new Page();
		this._modalView = new ModalView(this.page.modalContainer, this.events);
		this._cartView = new CartView(this.page.modalContainer, this.page.cartButton, this.events);
		this._orderModel = new OrderModel(this.events);
		this._orderAddressView = new OrderAddressView(this.page.modalContainer, this.events);
		this._orderContactsView = new OrderContactsView(this.page.modalContainer, this.events);
		this._orderSuccessView = new OrderSuccessView(this.page.modalContainer, this.events);

		this.init();
	}

	init() {
		this._api.getProducts().then(data => {
			const newItems = data.items.map(item => ({
				...item,
				image: CDN_URL + item.image
			}));
			this._items.setItems(newItems);
		}) .catch(err => console.error('Ошибка загрузки товаров:', err));

		this.events.on('items:changed', () => { // отображаем каталог
			this.renderCatalog();
		});

		this.events.on('item:click', (data: { id: ItemId }) => { // открываем карточку с товаром
			this.openItemModal(data.id);
		});

		this.events.on('cart:click', () => { // открываем корзину
			this.openCart();
		});

		this.events.on('cart:changed', () => {
			this.updateCart();

			if (this.activeModal === 'cart') {
				const cartItems = this.getCartItems();
				const total = this._cart.getTotal(cartItems);

				const basketElements = cartItems.map((item, index) => {
					const cartViewItem = new CartViewItem(item, this.events);
					cartViewItem.setIndex(index);
					return cartViewItem.render();
				});

				this._cartView.list = basketElements;
				this._cartView.total = total;
			}

			if (this.activeModal === 'item' && this._modalCardView) {
				const currentId = this._modalCardView.getCurrentId?.();
				if (currentId) {
					const inCart = this._cart.items.includes(currentId);
					this._modalCardView.setInCart(inCart);
				}
			}

		});

		this.events.on('item:add', (data: { id: ItemId }) => {
			this.addToCart(data.id);
		});

		this.events.on('item:delete', (data: { id: ItemId }) => {
			this.removeFromCart(data.id);
		});

		this.events.on('cart:submit', () => { // переход к следующему модальному окну
			this.openOrderAddress();
		})

		this.events.on('order:changed', () => {

			this.updateOrderFormView()
		});

		this.events.on('order:addressSubmit', () => { // переход к следующему модальному окну
			this.openOrderContacts();
		});

		this.events.on('order:input', (data: {key: IOrderFormInput, value: string | PaymentType}) => {
			this._orderModel.updateInput(data.key, data.value);
		})

		this.events.on('order:contactsSubmit', async () => { // проверяет валидность, отправляет данные на сервер, в случае успеха выводит модалку с успешным заказом
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
				this._orderAddressView.reset();
				this._orderContactsView.reset();

				const successForm = this._orderSuccessView.render(response);
				this._modalView.open(successForm);
			} catch (err) {
				console.error(err);
			}
		});
	}

	private renderCatalog() {
		this.page.gallery.innerHTML = '';
		const items = this._items.getAllItems();

		items.forEach(item => {
			const cardView = new CardView('card-catalog', this.events);
			cardView.setCardData(item, this._cart.items.includes(item.id), 'catalog');
			this.page.gallery.appendChild(cardView.render());
		});
	}

	private openItemModal(id: ItemId): void {
		const item = this._items.getItem(id);
		const inCart = this._cart.items.includes(id);

		if (!this._modalCardView) {
			this._modalCardView = new CardView('card-preview', this.events);
		}

		this._modalCardView.setCardData(item, inCart, 'preview');
		this._modalView.open(this._modalCardView.render());
		this.activeModal = 'item';
	}

	private openCart(): void {
		const cartItems = this.getCartItems();
		const total = this._cart.getTotal(cartItems);

		const basketElements = cartItems.map((item, index) => {
			const cartViewItem = new CartViewItem(item, this.events);
			cartViewItem.setIndex(index);
			this.cartViewItems.push(cartViewItem);
			return cartViewItem.render();
		});

		this._cartView.list = basketElements;
		this._cartView.total = total;
		this.activeModal = 'cart';

		this._modalView.open(this._cartView.render());
	}

	private openOrderAddress(): void {
		const form = this._orderAddressView.render();
		this._modalView.open(form);
		this.activeModal = 'order-address';
	}

	private openOrderContacts(): void {
		const form = this._orderContactsView.render();
		this._modalView.open(form);
		this.activeModal = 'order-contacts';
	}

	private updateOrderFormView(): void {
		if (this.activeModal === 'order-address') {
			const isAddressValid = this._orderModel.validateInput('address');
			const isPaymentValid = this._orderModel.validateInput('payment');
			this._orderAddressView.setPaymentActive(this._orderModel.data.payment);
			this._orderAddressView.setSubmitEnabled(isAddressValid && isPaymentValid);
		}
		if (this.activeModal === 'order-contacts') {
			const isEmailValid = this._orderModel.validateInput('email');
			const isPhoneValid = this._orderModel.validateInput('phone');
			this._orderContactsView.setSubmitEnabled(isEmailValid && isPhoneValid);
		}
	}

	private updateCart(): void {
		this.page.counter.textContent = this._cart.count.toString();
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