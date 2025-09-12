import { Api } from './base/api';
import { IItem, IItemList, IOrder, IOrderResponse } from '../types';

export class ShopApi extends Api {
	async getProducts() : Promise<IItemList> {
		return this.get('/product') as Promise<IItemList>;
	}

	async getProductById(id: string): Promise<IItem> {
		return this.get(`/product/${id}`) as Promise<IItem>;
	}

	async createOrder(orderData: IOrder): Promise<IOrderResponse> {
		return this.post('/order', orderData) as Promise<IOrderResponse>;
	}
}