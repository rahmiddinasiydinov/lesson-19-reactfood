import { useContext } from "react";
import Modal from "./UI/Modal";
import { CartContext } from "../store/Cartcontext";
import { currencyFormatter } from "../util/formatiing";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { UserProgressContext } from "../store/UserProgressContext";

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
    }, 0)

    function handleCloseCheckout(){
        userProgressCtx.hideCheckout();
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleCloseCheckout}>
        <form action="">
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

            <Input label="Full name" type="text" id="full-name" />
            <Input label="Email Address" type="email" id="email" />
            <Input label="Strees" type="text" id="street" />
            <div className="control-row" type="text" id="postal-code">
                <Input label="Postal Code" />
                <Input label="City" type="text" id="city" />
            </div>

            <p className="modal-actions">
                <Button type="button" textOnly onClick={handleCloseCheckout}>Close</Button>
                <Button>Submit Order</Button>
            </p>

        </form>
    </Modal>
}