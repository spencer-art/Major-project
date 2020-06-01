import axios from "axios";
import {
    showAlert
} from "./alert";
export const signup = async (data) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:8000/api/v1/users/signup",
            data
        });
        console.log(data);
        //res.data here is the json data we sent to API
        if (res.data.status === "success") {
            showAlert("success", "You are a member now!");
            window.setTimeout(() => {
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};