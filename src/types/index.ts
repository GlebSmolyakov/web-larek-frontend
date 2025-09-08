//@todo интерфейсы данных сервера

export interface IItem { // описание карточки, которая приходит от сервера
	id: string;
	title: string;
	image: string;
	category: string;
	description: string;
	price: number | null;
}

export interface IItemList { // описание списка карточек, которые приходят от сервера
	items: IItem[];
	total: number;
}

export type IItemCard = IItem; // описание одной, выбранной карточки

export type ItemId = IItem['id']; // описание id карточки

//@todo  интерфейс для заказа

export type PaymentType = "online" | "offline"; // типизируем тип оплаты

export interface IOrder { // интерфейс заказа для отправки на сервер
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderForm { // интерфейс для работы с формой
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
}

export type IOrderFormInput = keyof IOrderForm;

export interface IOrderResponse { // интерфейс ответа от сервера созданного заказа, возвращает id и сумму заказа
	id: string;
	total: number;
}

export interface IOrderResponseError { // интерфейс ошибки сервера
	error: string;
}


