import {ExampleApiMock} from "../../mocks/ExampleApiMock";
import {CartApiMock} from "../../mocks/CartApiMock";
import {Action, ApplicationState,
  initStore
} from "../../../../src/client/store";
import {ExampleApi} from "../../../../src/client/api";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import React from "react";
import {Catalog} from "../../../../src/client/pages/Catalog";
import {render, screen} from "@testing-library/react";
import {Store, AnyAction} from "redux";

const basename = '/hw/store';

describe('Catalog', () => {
  const renderCatalog = (store: Store<any, AnyAction>) => {
    return (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Catalog/>
        </Provider>
      </BrowserRouter>
    )
  };


  it('should render all product from api', async () => {
    const baseApi = new ExampleApiMock(basename).withProduct();
    const cardApi = new CartApiMock();
    const store = initStore(baseApi as unknown as ExampleApi, cardApi);
    const catalog = renderCatalog(store);

    const result = await baseApi.getProducts();
    const {container} = render(catalog);
    store.dispatch({type: "PRODUCTS_LOADED", products: result })

    expect(container.getElementsByClassName('ProductItem')).toHaveProperty('length', result.length)
  });

  it('should have text loading, when product loaded', async () => {
    const baseApi = new ExampleApiMock(basename).withEmptyProduct();
    const cardApi = new CartApiMock();
    const store = initStore(baseApi as unknown as ExampleApi, cardApi);
    const catalog = renderCatalog(store);

    const {getByText} = render(catalog);
    store.dispatch({type: "PRODUCTS_LOAD" })
    screen.logTestingPlaygroundURL();

    expect(getByText('LOADING')).toBeTruthy();
  });
});
