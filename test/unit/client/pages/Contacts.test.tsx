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
import { Contacts } from '../../../../src/client/pages/Contacts';

const basename = '/hw/store';
describe('Contacts', () => {
	let parent: HTMLElement = null;

	const renderContacts = (store: Store): ReactComponentElement<any> => {
		return (
			<BrowserRouter basename={basename}>
				<Provider store={store}>
					<Contacts />
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

	it('should render correctly by contacts-snapshots', async () => {
		const baseApi = new ExampleApiMock(basename).withProduct();
		const cardApi = new CartApiMock();
		const store = initStore(baseApi as unknown as ExampleApi, cardApi);
		await act(async () => render(renderContacts(store), parent));
		expect(
			parent.querySelector('.Contacts').outerHTML
		).toMatchSnapshot();
	});
});
