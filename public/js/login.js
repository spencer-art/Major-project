import axios from "axios";
import {
    showAlert
} from "./alert";


export const login = async (email, password) => {
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email,
                password
            }
        });

        //res.data here is the json data we sent to API
        if (res.data.status === "success") {
            showAlert("success", "Logged in successfully!");
            window.setTimeout(() => {
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
};
export const forgot = async (email) => {
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/forgotpassword",
            data: {
                email
            }
        });

        //res.data here is the json data we sent to API
        if (res.data.status === "success") {
            showAlert("success", "Token sent!");
            window.setTimeout(() => {
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};