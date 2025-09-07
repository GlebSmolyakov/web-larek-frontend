import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';


const api = new Api(API_URL);

async function main() {
	try {
		// Запрос на список продуктов
		const products = await api.get('/product/');
		console.log('Все товары:', products);
	} catch (error) {
		console.error('Ошибка запроса:', error);
	}
}

main();




