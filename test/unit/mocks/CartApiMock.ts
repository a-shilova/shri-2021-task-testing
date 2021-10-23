import {CartApi} from "../../../src/client/api";
import {CartState} from "../../../src/common/types";

export class CartApiMock extends CartApi {
  private cartState: CartState;

  setState(cart: CartState) {
    this.cartState = cart;
  }

  getState(): CartState {
    return this.cartState || {};
  }
}
