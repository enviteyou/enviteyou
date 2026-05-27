import api from "@/api/axios";

export async function getVendorSession() {
  try {
    const response = await api.get("/auth/me-vendor");
    const user = response?.data?.user;

    if (!user) {
      return { user: null, message: response?.data?.message || "Not authenticated" };
    }

    return { user, message: response?.data?.message || "Authenticated" };
  } catch (err) {
    return { user: null, message: err?.response?.data?.message || "Not authenticated" };
  }
}

export default getVendorSession;
