export async function setAccessTokenInCookie(token: string) {
  try {
    const response = await fetch("/api/auth/set-cookie", {
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