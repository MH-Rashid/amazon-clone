const baseURL = "http://localhost:3100";

async function tryRefreshToken() {
  try {
    const res = await fetch(`${baseURL}/api/refresh`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (err) {
    console.error("Refresh error:", err);
    return null;
  }
}

export async function registerUser(userData) {
  const response = await fetch(`${baseURL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  const data = await response.json();
  return data;
}

export async function login(userData) {
  const response = await fetch(`${baseURL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  const data = await response.json();
  return data;
}

export async function logout() {
  const response = await fetch(`${baseURL}/api/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  return data;
}

export async function fetchAvailableProducts() {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${baseURL}/api/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    const newAccessToken = await tryRefreshToken();
    if (newAccessToken) {
      // Retry the original request with the new access token
      const retryResponse = await fetch(`${baseURL}/api/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        credentials: "include",
      });

      const retryData = await retryResponse.json();
      return retryData;
    }
  }

  const resData = await response.json();
  return resData;
}

export async function fetchOrders() {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${baseURL}/api/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    const newAccessToken = await tryRefreshToken();
    if (newAccessToken) {
      // Retry the original request with the new access token
      const retryResponse = await fetch(`${baseURL}/api/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        credentials: "include",
      });

      const retryData = await retryResponse.json();
      return retryData;
    }
  }

  const resData = await response.json();
  return resData;
}

export async function createOrder(orderData) {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${baseURL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(orderData),
    credentials: "include",
  });

  if (response.status === 401) {
    const newAccessToken = await tryRefreshToken();
    if (newAccessToken) {
      // Retry the original request with the new access token
      const retryResponse = await fetch(`${baseURL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        body: JSON.stringify(orderData),
        credentials: "include",
      });

      const retryData = await retryResponse.json();
      return retryData;
    }
  }

  const resData = await response.json();
  return resData;
}

export async function deleteOrder(orderId) {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${baseURL}/api/orders`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      id: orderId,
    }),
    credentials: "include",
  });

  if (response.status === 401) {
    const newAccessToken = await tryRefreshToken();
    if (newAccessToken) {
      // Retry the original request with the new access token
      const retryResponse = await fetch(`${baseURL}/api/orders`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        body: JSON.stringify({
          id: orderId,
        }),
        credentials: "include",
      });

      const retryData = await retryResponse.json();
      return retryData;
    }
  }

  const resData = await response.json();
  return resData;
}
