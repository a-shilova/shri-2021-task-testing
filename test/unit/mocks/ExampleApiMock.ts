import {ExampleApi} from "../../../src/client/api";
import {ProductShortInfo} from "../../../src/common/types";
import axios, {AxiosRequestConfig} from 'axios';
import MockAdapter from "axios-mock-adapter";

const axiosMock: MockAdapter = new MockAdapter(axios);

const productList: ProductShortInfo[] = [
  {
    id: 1,
    name: 'string',
    price: 300
  },
  {
    id: 2,
    name: 'string1',
    price: 100
  },
  {
    id: 3,
    name: 'string2',
    price: 200
  }
];

axiosMock.onGet('/api/products').reply(200, productList);
axiosMock.onGet(/\/users\/\d+/).reply((config: AxiosRequestConfig) => {
  const url = +config.url;
  return [200, productList.find((item) => item.id === url)];
});
axiosMock.onPost('/api/checkout').reply(200, {});


export class ExampleApiMock extends ExampleApi {
  private readonly productList: ProductShortInfo[];

  constructor(basename: string) {
    super(basename);
  }
}
