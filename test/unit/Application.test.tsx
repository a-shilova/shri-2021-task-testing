import {BrowserRouter, Router} from "react-router-dom";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import React, {ReactElement} from "react";
import {render, screen} from "@testing-library/react";
import {CartApiMock} from "./mocks/CartApiMock";
import {ExampleApiMock} from "./mocks/ExampleApiMock"
import {initStore} from "../../src/client/store";
import {Store} from "redux";
import {createMemoryHistory} from 'history'

const basename = '/hw/store';

describe('Application', () => {
    let baseApi: ExampleApiMock;
    let cardApi: CartApiMock;
    let store: Store;
    let application: ReactElement;

    beforeEach(() => {
        baseApi = new ExampleApiMock(basename);
        cardApi = new CartApiMock();
        store = initStore(baseApi, cardApi);
        application = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </BrowserRouter>
        );
    })

    afterEach(() => {
        baseApi = null;
        cardApi = null;
        store = null;
        application = null;
    })

    it('should render Application', () => {
        const {container} = render(application);
        expect(container.getElementsByClassName('Application')).toHaveProperty('length', 1)
    });

    it('should render Home', () => {
        const {container} = render(application);
        expect(container.getElementsByClassName('Home').length).toBe(1);
    });

    describe('Menu', () => {
        it('should has link on catalog', () => {
            const {getByRole} = render(application);
            expect(getByRole('link', {
                name: /catalog/i
            })).toBeTruthy();
        });

        it('should has link on Delivery', () => {
            const {getByRole} = render(application);
            expect(getByRole('link', {
                name: /delivery/i
            })).toBeTruthy();
        });

        it('should has link on Contacts', () => {
            const {getByRole} = render(application);
            expect(getByRole('link', {
                name: /contacts/i
            })).toBeTruthy();
        });

        it('should has link on cart', () => {
            const {getByRole} = render(application);
            expect(getByRole('link', {
                name: /catalog/i
            })).toBeTruthy();
        });

        it('should has button', () => {
            const {getByRole} = render(application);
            expect(getByRole('button', {
                name: /toggle navigation/i
            })).toBeTruthy();
        });

        it('should has link on main page', () => {
            const {getByRole} = render(application);
            expect(getByRole('link', {
                name: /example store/i
            })).toBeTruthy();
        });
    });

    describe('Router', () => {
        it('should render Contacts by link', () => {
            const history = createMemoryHistory()
            const route = '/contacts'
            history.push(route);

            const {getByRole} = render(
                <Router history={history}>
                    <Provider store={store}>
                        <Application/>
                    </Provider>
                </Router>
            );
            expect(getByRole('heading', {
                name: /contacts/i
            })).toBeTruthy();
        });

        it('should render Delivery by link', () => {
            const history = createMemoryHistory()
            const route = '/delivery'
            history.push(route);

            const {getByRole} = render(
                <Router history={history}>
                    <Provider store={store}>
                        <Application/>
                    </Provider>
                </Router>
            );
            expect(getByRole('heading', {
                name: /delivery/i
            })).toBeTruthy();
        });

        it('should render Catalog by link', () => {
            const history = createMemoryHistory()
            const route = '/catalog'
            history.push(route);

            const {getByRole} = render(
                <Router history={history}>
                    <Provider store={store}>
                        <Application/>
                    </Provider>
                </Router>
            );

            expect(getByRole('heading', {
                name: /catalog/i
            })).toBeTruthy();
        });

        it('should render Catalog by link', () => {
            const history = createMemoryHistory()
            const route = '/catalog/2'
            history.push(route);

            const {container} = render(
                <Router history={history}>
                    <Provider store={store}>
                        <Application/>
                    </Provider>
                </Router>
            );

            expect(container.getElementsByClassName('Product')).toHaveProperty('length', 1);
        });
    });
})