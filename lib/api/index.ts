"use server";

export async function submitContactForm(_payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: true }> {
  return { ok: true };
}
