import { supabase } from "./supabase.js";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const status = document.getElementById("loginStatus");

const button = form.querySelector(".login-btn");

/* Nếu đã đăng nhập thì vào admin luôn */

const {
    data: { session }
} = await supabase.auth.getSession();

if (session) {
    window.location.href = "admin.html";
}

/* ĐĂNG NHẬP */

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    status.textContent = "";

    button.disabled = true;
    button.textContent = "ĐANG ĐĂNG NHẬP...";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const {
        data,
        error
    } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {

        console.error(error);

        status.textContent =
            "Email hoặc mật khẩu không đúng.";

        button.disabled = false;
        button.textContent = "ĐĂNG NHẬP";

        return;
    }

    if (data.session) {
        window.location.href = "admin.html";
    }

});
const togglePassword =
    document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    const isPassword =
        passwordInput.type === "password";

    passwordInput.type =
        isPassword ? "text" : "password";

    togglePassword.textContent =
        isPassword ? "🙈" : "👁";

});