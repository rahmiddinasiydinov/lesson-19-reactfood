import { useContext, useActionState  } from "react";
import Modal from "./UI/Modal";
import { CartContext } from "../store/Cartcontext";
import { currencyFormatter } from "../util/formatiing";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { UserProgressContext } from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-type': 'application/json'
    }
}
export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const { data,  error, sendRequest, clearData } = useHttp('http://localhost:3000/orders', requestConfig)

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
    }, 0)

    function handleCloseCheckout() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    function handleFinish(){
        userProgressCtx.hideCheckout();
    }

    async function checkoutAction(prevState, formData) {
        const customerData = Object.fromEntries(formData.entries());

        await sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData
            }
        }));
    }

    const [formState, formAction, isSending] = useActionState(checkoutAction, null)



    let actions = <>
        <Button type="button" textOnly onClick={handleCloseCheckout}>Close</Button>
        <Button>Submit Order</Button>
    </>

    if (isSending) {
        {
            actions = <span>Sending order data...</span>
        }
    }

    if( data &&  !error){
        return (
            <Modal
            open={userProgressCtx.progress === 'checkout'}
            onClose={handleCloseCheckout}
            >
                <h2>Success!</h2>
                <p>Your order was submitted successfully.</p>
                <p>
                    We will get back to you with more details via emails within the next few minutes.
                </p>
                <p className="modal-actions">
                    <Button onClick={handleFinish}>Okay</Button>
                </p>

            </Modal>
        )
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleCloseCheckout}>
        <form action={formAction}>
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

            <Input label="Full name" type="text" id="name" />
            <Input label="Email Address" type="email" id="email" />
            <Input label="Strees" type="text" id="street" />
            <div className="control-row" type="text" >
                <Input label="Postal Code" id="postal-code" />
                <Input label="City" type="text" id="city" />
            </div>

            { error && <Error title='Failed to send the order' message={error}/>}
            <p className="modal-actions">
                {actions}
            </p>

        </form>
    </Modal>
}