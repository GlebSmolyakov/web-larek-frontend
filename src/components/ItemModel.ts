import { IItem, IItemCard, ItemId } from '../types';
import { IEvents } from './base/events';

export class ItemModel {
	protected _items: IItem[]
	protected events: IEvents

	constructor(events: IEvents) {
		this.events = events;
	}

	setItems(items: IItem[]): void {
		this._items = items;
		this.events.emit('items:changed')
	}

	getAllItems (): IItem[]{
		return this._items;
	}

	private findItem(id: ItemId): IItemCard | null {
		return this._items.find(item => item.id === id) || null;
	}

	getItem (id: ItemId): IItemCard | null {
		return this.findItem(id);
	}
}



