import { Store } from 'redux';
import React, { ReactComponentElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, unmountComponentAtNode } from 'react-dom';
import { Home } from '../../../../src/client/pages/Home';
import { ExampleApiMock } from '../../mocks/ExampleApiMock';
import { CartApiMock } from '../../mocks/CartApiMock';
import { initStore } from '../../../../src/client/store';
import { ExampleApi } from '../../../../src/client/api';
import { act } from 'react-dom/test-utils';

const basename = '/hw/store';
describe('Home', () => {
	let parent: HTMLElement = null;

	const renderHome = (store: Store): ReactComponentElement<any> => {
		return (
			<BrowserRouter basename={basename}>
				<Provider store={store}>
					<Home />
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

	it('should render correctly by home-snapshots', async () => {
		const baseApi = new ExampleApiMock(basename).withProduct();
		const cardApi = new CartApiMock();
		const store = initStore(baseApi as unknown as ExampleApi, cardApi);
		await act(async () => render(renderHome(store), parent));
		expect(parent.querySelector('.Home').outerHTML).toMatchSnapshot();
	});
});
