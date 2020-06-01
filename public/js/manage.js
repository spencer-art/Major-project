import axios from "axios";
import {
    showAlert
} from "./alert";


export const create = async (data) => {
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/suits",
            data
        });
        //res.data here is the json data we sent to API
        if (res.data.status === "success") {
            showAlert("success", "Product created!");
            window.setTimeout(() => {
                location.assign("/overview");
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};