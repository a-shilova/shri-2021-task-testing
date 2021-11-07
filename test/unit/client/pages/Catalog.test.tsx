import { CartApiMock } from '../../mocks/CartApiMock';
import { initStore } from '../../../../src/client/store';
import { ExampleApi } from '../../../../src/client/api';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { Catalog } from '../../../../src/client/pages/Catalog';
import {
	render,
	screen,
	waitForElementToBeRemoved
} from '@testing-library/react';
import { PRODUCT_LIST } from '../../mocks/productList';
import { ProductShortInfo } from '../../../../src/common/types';
import { AxiosResponse } from 'axios';

const basename = '/hw/store';

describe('Catalog', () => {
	it('should render all from content product from api', async () => {
		const baseApi = new ExampleApi(basename);
		baseApi.getProducts = () => Promise.resolve<AxiosResponse<ProductShortInfo[], any>>({
			headers: {},
			config: {},
			status: 200,
			statusText: 'ok',
			data: PRODUCT_LIST
		});
		const cardApi = new CartApiMock();
		const store = initStore(baseApi, cardApi);
		const component =
			<MemoryRouter>
				<Provider store={store}>
					<Catalog />
				</Provider>
			</MemoryRouter>;

		const { getByText, container } = render(component);

		await waitForElementToBeRemoved(() => getByText('LOADING'));

		screen.logTestingPlaygroundURL();

		const namesEls = container.querySelectorAll('.ProductItem-Name');
		const names = Array.from(namesEls).map(el => el.textContent);
		const testNames = PRODUCT_LIST.map(item => item.name);
		expect(names).toEqual(testNames);

		const pricesEl = container.querySelectorAll('.ProductItem-Price');
		const prices = Array.from(pricesEl).map(el => el.textContent);
		const testPrices = PRODUCT_LIST.map(item => `$${item.price}`);
		expect(prices).toEqual(testPrices);

		const linksEl = container.querySelectorAll('.ProductItem-DetailsLink');
		const links = Array.from(linksEl).map(link => link.getAttribute('href'));
		const testLinks = PRODUCT_LIST.map(item => '/catalog/' + item.id);
		expect(links).toEqual(testLinks);
	});
});
