const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

// Registration
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: document.getElementById("full_name").value,
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                message.textContent = data.error;
                message.className = "text-danger mt-3";
                return;
            }

            message.textContent = data.message;
            message.className = "text-success mt-3";

            setTimeout(() => {
                window.location.href = "/";
            }, 2000);

        } catch (error) {
            message.textContent = "Unable to connect to server";
        }
    });
}

// Login
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                message.textContent = data.error;
                return;
            }

            sessionStorage.setItem("token", data.token);

            window.location.href = `/${data.user.role}.html`;

        } catch (error) {
            message.textContent = "Unable to connect to server";
        }
    });
}