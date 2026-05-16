import axios from "axios";

/**
 * @param {string} backendUrl
 * @param {{ name: string; email: string; phone: string; message: string }} payload
 */
export async function submitLead(backendUrl, payload) {
  if (!backendUrl) {
    throw new Error("Backend not configured");
  }
  const { data } = await axios.post(`${backendUrl}/api/lead/submit`, {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    message: payload.message.trim(),
  });
  if (!data?.success) {
    throw new Error(data?.message || "Could not send enquiry");
  }
  return data;
}
