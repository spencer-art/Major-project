import axios from "axios";
import {
    showAlert
} from "./alert";

export const update = async (data) => {

    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/suits/${id}`,
            data

        });
        if (res.data.status === 'success') {
            showAlert("success", "Product updated!");
            window.setTimeout(() => {
                location.assign("/overview");
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};