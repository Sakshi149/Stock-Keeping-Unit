const API_BASE_URL = "https://api.skuoriginal.in/api/auth/";

class AuthService {
  async login({ email, password }) {
    const response = await fetch(`${API_BASE_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("jwtToken", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    return data;
  }

  async register({ companyName, name, email, password }) {
    const response = await fetch(`${API_BASE_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName,
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  }

  logout() {
    localStorage.removeItem("jwtToken");

    localStorage.removeItem("user");
  }

  getUser() {
    const user = localStorage.getItem("user");

    if (!user || user === "undefined") {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (error) {
      console.error("Invalid user JSON:", error);
      return null;
    }
  }

  getToken() {
    return localStorage.getItem("jwtToken");
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getUserRole() {
    const user = this.getUser();

    return user?.role;
  }
}

export default new AuthService();