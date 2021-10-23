import {ExampleStore} from "../../../src/server/data";
import {Order, Product} from '../../../src/common/types';

const generateProducts = (count: number) => {
    const products: Product[] = []

    for (let id = 0; id < count; id++) {
        products.push({
            id,
            name: 'name',
            description: 'description',
            price: 500,
            color: '#F00F00',
            material: 'material',
        });
    }

    return products;
}

const PRODUCT_SIZE = 5;
const productList: Product[] = generateProducts(PRODUCT_SIZE);

// @ts-ignore
class ExampleStoreTest extends ExampleStore {
    private readonly products: Product[] = productList;
    private readonly orders: (Order | { id: number })[] = [];
}

describe('ExampleStore', () => {
    let store: ExampleStoreTest;

    beforeEach(() => {
        store = new ExampleStoreTest();
    })

    afterEach(() => {
        store = null;
    })

    describe('getAllProducts', () => {
        it('should return products with size equal mocks', () => {
            expect(store.getAllProducts().length).toEqual(productList.length);
        });
    });

    describe('getProductById', () => {
        it('should return product by id', () => {
            const id: number = productList[0].id;
            const product = productList[0];

            const result = store.getProductById(id);

            expect(result).toEqual(product);
        });

        it('should return undefined, when product is not defined', () => {
            const id: number = 312;

            const result = store.getProductById(id);

            expect(result).toBeUndefined();
        });
    });

    describe('createOrder', () => {
        it('should return id of new order', () => {
            const order: Order = {
                cart: {
                    1: {
                        name: 'product',
                        price: 300,
                        count: 1
                    }
                },
                form: {
                    name: 'name',
                    phone: 'phone',
                    address: 'address'
                }
            };

            const id = store.createOrder(order);

            expect(id).toBeDefined();
        });
    });

    describe('getLatestOrders', () => {
        const orders: Order[] = [{
            cart: {
                1: {
                    name: 'product',
                    price: 300,
                    count: 1
                }
            },
            form: {
                name: 'name',
                phone: 'phone',
                address: 'address'
            }
        }, {
            cart: {
                5: {
                    name: 'product',
                    price: 300,
                    count: 1
                }
            },
            form: {
                name: 'name',
                phone: 'phone',
                address: 'address'
            }
        }];

        it('should return last orders with matches ids', () => {
            const id1 = store.createOrder(orders[0]);
            const id2 = store.createOrder(orders[1]);

            const result = store.getLatestOrders();

            expect(result[0]).toHaveProperty('id', id1);
            expect(result[1]).toHaveProperty('id', id2);
        });
    });
})
