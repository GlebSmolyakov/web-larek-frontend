import { IOrderForm, IOrderFormInput, PaymentType } from '../types';
import { IEvents } from './base/events';

export class OrderModel {
	protected _data: IOrderForm;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._data = {
			address: '',
			email: '',
			phone: '',
			payment: null
		}
	}

	updateInput(key: IOrderFormInput, value: string | PaymentType): void {
		if (key === 'payment') {
			this._data.payment = value as PaymentType;
		} else {
			this._data[key] = value;
		}
		this.events.emit('order:changed');
	}

	validateInput(input: IOrderFormInput): boolean {
		if (input === 'payment') {
			return this._data.payment !== null &&
				(this._data.payment === 'online' || this._data.payment === 'offline');
		}
		const value = this._data[input];
		if (typeof value !== 'string') return false;

		return value.trim().length > 0;
	}

	validateForm(): boolean {
		const isValid = Object.keys(this._data).every(key => this.validateInput(key as IOrderFormInput));
		this.events.emit('order:validation')
		return isValid
	}

	clear(): void {
		this._data = {
			address: '',
			email: '',
			phone: '',
			payment: null
		}
		this.events.emit('order:changed')
	}

	get data(): IOrderForm {
		return { ...this._data };
	}
}

