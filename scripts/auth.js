import { login, registerUser } from "./http.js";
import { showToast } from "./utils/toast.js";

function AuthForm() {
  document.querySelector(".js-auth").innerHTML = `
  <div class="auth-container">
    <form id="login-form">
      <h2>Login</h2>

      <label for="login-email">Email:</label>
      <input type="email" id="login-email" name="login-email" required>
      
      <label for="login-password">Password:</label>
      <input type="password" id="login-password" name="login-password" required>

      <button type="submit">Login</button>

      <h4>New here? <a href="" class="create-account-link">
        Create an account
      </a></h4>
    </form>

    <form id="register-form" style={{ display: "none" }}>
      <h2>Register</h2>

      <label for="register-firstname">First Name:</label>
      <input type="text" id="register-firstname" name="register-firstname" required>

      <label for="register-lastname">Last Name:</label>
      <input type="text" id="register-lastname" name="register-lastname" required>

      <label for="register-email">Email:</label>
      <input type="email" id="register-email" name="register-email" required>

      <label for="register-password">Password:</label>
      <input type="password" id="register-password" name="register-password" required>

      <button type="submit">Register</button>

      <h4>Already have an account? <a href="" class="login-link">
        Login
      </a></h4>
    </form>
  </div>
  `;

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  loginForm.style.display = "block";
  registerForm.style.display = "none";

  document
    .querySelector(".create-account-link")
    .addEventListener("click", (e) => {
      e.preventDefault();
      toggleForms();
    });

  document.querySelector(".login-link").addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const values = {
      user: document.getElementById("login-email").value,
      pwd: document.getElementById("login-password").value,
    };

    const result = await login(values);
    if (result.accessToken) {
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));

      showToast(
        `Login successful. Welcome, ${result.user.firstname}`,
        "success"
      );
      window.location.href = "/products.html";
    } else {
      showToast(
        "Login failed: " + (result.message || "Unknown error"),
        "error"
      );
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const values = {
      first: document.getElementById("register-firstname").value,
      last: document.getElementById("register-lastname").value,
      user: document.getElementById("register-email").value,
      pwd: document.getElementById("register-password").value,
    };

    const result = await registerUser(values);

    if (result.success) {
      showToast("Registration successful. Please log in.", "success");
      toggleForms();
    } else {
      showToast(
        "Registration failed: " + (result.message || "Unknown error"),
        "error"
      );
    }
  });

  function toggleForms() {
    loginForm.style.display =
      loginForm.style.display === "none" ? "block" : "none";
    registerForm.style.display =
      registerForm.style.display === "none" ? "block" : "none";
  }
}

AuthForm();
