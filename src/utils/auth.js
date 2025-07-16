import axios from "../api/axiosInstance"

export const isLoggedIn = async () => {
  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  if (!access || !refresh) {
    console.log("🚫 No access or refresh token");
    return false;
  }

  try {
    // حاول التحقق من access token
    await axios.post(`/api/token/verify/`, { token: access });
    console.log("✅ Access token is valid");
    return true;
  } catch (err) {
    console.log("⚠️ Access token expired or invalid, trying to refresh...");
    try {
      const res = await axios.post(`/api/token/refresh/`, {
        refresh,
      });
      console.log("🔁 Refresh response:", res.data);
      const newAccess = res.data.access;
      const newRefresh = res.data.refresh; // ✅ خذ الـ refresh الجديد لو موجود
      if (newAccess) {
        localStorage.setItem("access_token", newAccess);
        // ✅ خزّن الـ refresh الجديد لو أُرسل
        if (newRefresh) {
          localStorage.setItem("refresh_token", newRefresh);
        }
        console.log("✅ Access token refreshed");
        return true;
      } else {
        console.log("🚫 Refresh succeeded but no access token returned");
        localStorage.clear();
        return false;
      }
    } catch (refreshErr) {
      console.log("❌ Refresh token invalid or expired");
      return false;
    }
  }
};
