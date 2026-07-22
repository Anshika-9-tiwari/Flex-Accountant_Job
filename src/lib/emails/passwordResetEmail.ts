// src/lib/emails/passwordResetEmail.ts
import { sendMail } from "@/lib/mail";

type SendPasswordResetEmailOptions = {
  to: string;
  name: string;
  resetLink: string;
};

export async function sendPasswordResetEmail({
  to,
  name,
  resetLink,
}: SendPasswordResetEmailOptions) {
  const subject = "Reset your Flex Accountant password";

  const text = `
Hi ${name},

We received a request to reset your Flex Accountant password.

Open this link to reset your password:
${resetLink}

This link will expire in 30 minutes.

If you did not request this, you can ignore this email.

Regards,
Flex Accountant
`;

  const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#2c2935;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:#0b5f68;padding:28px 32px;color:#ffffff;">
                <h1 style="margin:0;font-size:26px;line-height:34px;">
                  <span style="color:#ff7900;">flex</span>-accountant
                </h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.82);font-size:14px;">
                  Password Reset Request
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px;">
                <h2 style="margin:0 0 14px;font-size:24px;line-height:32px;color:#2c2935;">
                  Reset your password
                </h2>

                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:#475569;">
                  Hi ${name},
                </p>

                <p style="margin:0 0 20px;font-size:15px;line-height:24px;color:#475569;">
                  We received a request to reset your Flex Accountant password. Click the button below to create a new password.
                </p>

                <p style="margin:28px 0;">
                  <a href="${resetLink}" target="_blank" style="display:inline-block;background:#ff7900;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:12px;">
                    Reset Password
                  </a>
                </p>

                <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#64748b;">
                  This link will expire in 30 minutes.
                </p>

                <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#64748b;">
                  If the button does not work, copy and paste this link into your browser:
                </p>

                <p style="margin:0 0 24px;word-break:break-all;font-size:13px;line-height:21px;color:#0b5f68;">
                  ${resetLink}
                </p>

                <p style="margin:0;font-size:14px;line-height:22px;color:#64748b;">
                  If you did not request this password reset, you can ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f8fafc;padding:20px 32px;color:#94a3b8;font-size:12px;line-height:18px;">
                © Flex Accountant. This is an automated email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  return sendMail({
    to,
    subject,
    html,
    text,
  });
}