import { ExampleApiMock } from '../../mocks/ExampleApiMock';
import { CartApiMock } from '../../mocks/CartApiMock';
import { initStore } from '../../../../src/client/store';
import { ExampleApi } from '../../../../src/client/api';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React, { ReactComponentElement } from 'react';
import { Catalog } from '../../../../src/client/pages/Catalog';
import { Store } from 'redux';
import { screen } from '@testing-library/react';
import { PRODUCT_LIST } from '../../mocks/productList';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

const basename = '/hw/store';

describe('Catalog', () => {
	let parent: HTMLElement = null;

	const renderCatalog = (store: Store): ReactComponentElement<any> => {
		return <BrowserRouter basename={basename}>
			<Provider store={store}>
				<Catalog />
			</Provider>
		</BrowserRouter>;
	};


	beforeEach(() => {
		parent = document.createElement('div');
		document.body.appendChild(parent);
	});

	afterEach(() => {
		unmountComponentAtNode(parent);
		parent.remove();
		parent = null;
	});

	it('should render all from content product from api', async () => {
		const baseApi = new ExampleApiMock(basename).withProduct();
		const cardApi = new CartApiMock();
		const store = initStore(baseApi as unknown as ExampleApi, cardApi);
		await act(async () => render(renderCatalog(store), parent));

		expect(PRODUCT_LIST.every((product) => {
			const item = screen.getAllByTestId(product.id)[1];
			const price = item.querySelector('.ProductItem-Price').innerHTML;
			const name = item.querySelector('.ProductItem-Name').innerHTML;
			const link = item.querySelector('.ProductItem-DetailsLink').getAttribute('href');
			return price.includes('' + product.price)
				&& name === product.name
				&& link === basename + '/catalog/' + product.id;
		})).toBeTruthy();
	});

	it('should render all product from api', async () => {
		const baseApi = new ExampleApiMock(basename).withProduct();
		const cardApi = new CartApiMock();
		const store = initStore(baseApi as unknown as ExampleApi, cardApi);
		await act(async () => render(renderCatalog(store), parent));
		const all = parent.querySelectorAll('.ProductItem');
		expect(all).toHaveProperty('length', PRODUCT_LIST.length);
	});

	it('should have text loading, when product loaded', async () => {
		const baseApi = new ExampleApiMock(basename).withEmptyProduct();
		const cardApi = new CartApiMock();
		const store = initStore(baseApi as unknown as ExampleApi, cardApi);

		render(renderCatalog(store), parent);

		expect(screen.getByText('LOADING')).toBeTruthy();
	});
});
