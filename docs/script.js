const API_URL = "http://172.18.10.159:5000";

async function handleLogin() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {
        const response = await fetch(API_URL + "/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            alert(data.message || "Login failed");
            return;
        }

        localStorage.setItem("token", data.token);

        if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        alert("Login successful!");

        document.getElementById("authPage").classList.add("hidden");
        document.getElementById("mainApp").classList.remove("hidden");

    } catch (error) {
        console.error(error);
        alert("Cannot connect to backend.");
    }
}

function showSignup() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("signupForm").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("signupForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🙈";
    } else {
        input.type = "password";
        button.textContent = "👁️";
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    document.getElementById("mainApp").classList.add("hidden");
    document.getElementById("authPage").classList.remove("hidden");
}