import { baseURL } from "@/lib/utils";
import { sendEmail } from "./send-email";

export async function sendResetPassword({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  return sendEmail({
    to: email,
    subject: "Atur ulang kata sandi Antifocus Anda",
    html: `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <img
            src="${baseURL}/assets/avatar.png"
            width="64"
            height="64"
            alt="Antifocus"
            style="margin-bottom: 16px; border-radius: 50%; border: 1px solid #d8dbdd;"
          >
          <h1 style="color: #000; font-size: 20px; font-weight: 700; margin: 0; line-height: 120%;">Atur Ulang Kata Sandi</h1>

          <div style="margin-top: 24px; color: #444; line-height: 1.6;">
            <p>Anda menerima email ini karena kami menerima permintaan atur ulang kata sandi untuk akun Anda.</p>
            <a href="${url}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; margin: 16px 0;">Atur Ulang Kata Sandi</a>
            <p style="margin-top: 20px; font-size: 12px; color: #707070;">Jika Anda tidak meminta atur ulang kata sandi,abaikan email ini.</p>
            <p style="font-size: 12px; color: #707070; word-break: break-all;">${url}</p>
          </div>
        </div>
      `,
  });
}
