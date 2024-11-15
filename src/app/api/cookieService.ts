const API_URL = "/api/auth";

export async function setAccessTokenInCookie(token: string) {
  try {
    const response = await fetch(`${API_URL}/set-cookie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Failed to set cookie");
    }
  } catch (error) {
    console.error("Error setting access token cookie:", error);
  }
}

export async function getAccessTokenFromCookie() {
  try {
    const response = await fetch(`${API_URL}/get-cookie`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to get cookie");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting access token cookie:", error);
    return null;
  }
}

export async function deleteAccessTokenCookie() {
  try {
    const response = await fetch(`${API_URL}/delete-cookie`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete cookie");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting access token cookie:", error);
    return null;
  }
}
