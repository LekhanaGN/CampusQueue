const token = sessionStorage.getItem("token");

async function checkAuth() {
    if (!token) {
        window.location.replace("/");
        return;
    }

    try {
        const response = await fetch("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            sessionStorage.clear();
            window.location.replace("/");
            return;
        }

        const user = await response.json();
        const requiredRole = document.body.dataset.role;

        if (user.role !== requiredRole) {
            window.location.replace(`/${user.role}.html`);
            return;
        }

        document.getElementById("welcome").textContent =
            `Welcome, ${user.full_name}`;

    } catch (error) {
        window.location.replace("/");
    }
}

async function logout() {
    try {
        await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } finally {
        sessionStorage.clear();
        window.location.replace("/");
    }
}

checkAuth();