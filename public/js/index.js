import "@babel/polyfill";
import {
    login,
    logout
} from "./login";
import {
    updateSettings
} from "./updateSettings";
import {
    create
} from "./manage";
import {
    signup
} from "./signup";
import {
    update
} from "./update";
import {
    forgot
} from "./login";
import {
    orderProduct
} from "./stripe";

// DOM ELEMENTS
const loginForm = document.querySelector(".form-login");
const logOutBtn = document.querySelector(".logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const forgotPassword = document.querySelector(".forgot-password");
const createProduct = document.querySelector(".form-create-products");
const updateProduct = document.querySelector(".form-update-products");
const SignUp = document.querySelector(".form-signup");
const orderBtn = document.getElementById("buy-now");





//DELEGATION

if (loginForm)
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        login(email, password);
    });

if (logOutBtn) logOutBtn.addEventListener("click", logout);
if (forgotPassword)
    forgotPassword.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        forgot(email);
    });
if (userDataForm)
    userDataForm.addEventListener("submit", e => {
        e.preventDefault();
        const form = new FormData();
        form.append("name", document.getElementById("name").value);
        form.append("email", document.getElementById("email").value);
        form.append("photo", document.getElementById("photo").files[0]);

        updateSettings(form, "data");
    });

if (userPasswordForm)
    userPasswordForm.addEventListener("submit", async e => {
        e.preventDefault();
        document.querySelector(".btn--save-password").textContent = "Updating...";

        const passwordCurrent = document.getElementById("password-current").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("password-confirm").value;
        await updateSettings({
                passwordCurrent,
                password,
                passwordConfirm
            },
            "password"
        );

        document.querySelector(".btn--save-password").textContent = "Save password";
        document.getElementById("password-current").value = "";
        document.getElementById("password").value = "";
        document.getElementById("password-confirm").value = "";
    });

if (createProduct)
    createProduct.addEventListener("submit", async e => {
        e.preventDefault();
        const formCreate = new FormData();
        formCreate.append("name", document.getElementById("pro-name").value);
        formCreate.append("price", document.getElementById("price").value);
        formCreate.append("category", document.getElementById("category").value);
        formCreate.append("fabric", document.getElementById("fabric").value);
        formCreate.append(
            "description",
            document.getElementById("description").value
        );
        formCreate.append(
            "imageCover",
            document.getElementById("imageCover").files[0]
        );
        formCreate.append("images", document.getElementById("images").files[0]);
        formCreate.append("images", document.getElementById("images").files[1]);
        formCreate.append("images", document.getElementById("images").files[2]);
        await create(formCreate);
    });

if (updateProduct)
    updateProduct.addEventListener("submit", async e => {
        e.preventDefault();
        const formUpdate = new FormData();
        formUpdate.append("price", document.getElementById("price").value);
        formUpdate.append("category", document.getElementById("category").value);
        formUpdate.append(
            "imageCover",
            document.getElementById("up-imageCover").files[0]
        );
        formUpdate.append("images", document.getElementById("up-images").files[0]);
        formUpdate.append("images", document.getElementById("up-images").files[1]);
        formUpdate.append("images", document.getElementById("up-images").files[2]);
        await update(formUpdate);
    });

if (SignUp)
    SignUp.addEventListener("submit", async e => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("passwordConfirm").value;
        await signup({
            name,
            email,
            password,
            passwordConfirm
        });
    });



if (orderBtn)
    orderBtn.addEventListener("click", e => {
        e.target.textContent = "processing...";
        const suitId = e.target.dataset.suitId;
        orderProduct(suitId);
    });