import { IItemCard, ItemId } from '../types';
import { IEvents } from './base/events';

export class CartModel {
	protected _items: ItemId[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._items = [];
	}

	addItem(id: ItemId): void {
		this._items.push(id);
		this.events.emit('cart:changed')
	}

	deleteItem(id: ItemId): void {
		this._items = this._items.filter(itemId => itemId !== id);
		this.events.emit('cart:changed')
	}

	clearCart(): void {
		this._items = [];
		this.events.emit('cart:changed')
	}

	get items(): ItemId[] {
		return this._items;
	}

	get count(): number {
		return this._items.length;
	}

	getTotal(items: IItemCard[]): number {
		return this._items.reduce((sum, id) => {
			const item = items.find(i => i.id === id);
			return sum + (item?.price ?? 0);
		}, 0);
	}
}

