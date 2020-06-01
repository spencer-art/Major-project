import axios from "axios";
import {
    showAlert
} from "./alert";

const stripe = Stripe('pk_test_Ha2Vi3tjbinYc7ZkuqNYD49Z00BP2XlKam');
export const orderProduct = async suitId => {
    try {
        // 1) Get checkout session from API
        const session = await axios({
                method: 'GET',
                url: `/api/v1/orders/checkout-session/${suitId}`
            }

        );
        //console.log(session);

        // 2) Create checkout form + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};