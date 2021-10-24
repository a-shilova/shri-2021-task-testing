import {
	CartState,
	CheckoutFormData,
	ProductShortInfo
} from '../../../src/common/types';
import { PRODUCT_LIST } from './productList';

export class ExampleApiMock {
	private productList: ProductShortInfo[];
	private checkoutState: {
		form: CheckoutFormData,
		cart: CartState
	};
	private basename: string;

	constructor(basename: string) {
		this.basename = basename;
	}

	async getProducts() {
		return { data: this.productList };
	}

	async getProductById(id: number) {
		return this.productList[id];
	}

	async checkout(form: CheckoutFormData, cart: CartState) {
		return this.checkoutState = {
			form, cart
		};
	}

	withProduct() {
		this.productList = PRODUCT_LIST;
		return this;
	}

	withEmptyProduct() {
		this.productList = [];
		return this;
	}

}
