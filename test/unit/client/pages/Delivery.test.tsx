import { Store } from 'redux';
import React, { ReactComponentElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, unmountComponentAtNode } from 'react-dom';
import { ExampleApiMock } from '../../mocks/ExampleApiMock';
import { CartApiMock } from '../../mocks/CartApiMock';
import { initStore } from '../../../../src/client/store';
import { ExampleApi } from '../../../../src/client/api';
import { act } from 'react-dom/test-utils';
import { Delivery } from '../../../../src/client/pages/Delivery';

const basename = '/hw/store';
describe('Delivery', () => {
	let parent: HTMLElement = null;

	const renderDelivery = (store: Store): ReactComponentElement<any> => {
		return (
			<BrowserRouter basename={basename}>
				<Provider store={store}>
					<Delivery />
				</Provider>
			</BrowserRouter>
		);
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

	it('should render correctly by delivery-snapshots', async () => {
		const baseApi = new ExampleApiMock(basename).withProduct();
		const cardApi = new CartApiMock();
		const store = initStore(baseApi as unknown as ExampleApi, cardApi);
		await act(async () => render(renderDelivery(store), parent));
		expect(
			parent.querySelector('.Delivery').outerHTML
		).toMatchSnapshot();
	});
});
