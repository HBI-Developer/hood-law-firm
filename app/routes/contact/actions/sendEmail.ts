import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import * as Brevo from "@getbrevo/brevo";
import { direction } from "direction";
import { CHECK_CONTACT_FIELDS_SCHEMA } from "~/constants";
import z from "zod";

const SERVICES_TYPES = {
  general: { rtl: "قانون الخدمات العامة", ltr: "General Legal Services" },
  corporate: { rtl: "قانون الشركات", ltr: "Corporate Law" },
  ip: { rtl: "قانون الملكية الفكرية", ltr: "Intellectual Property" },
};

type ServicesTypes = keyof typeof SERVICES_TYPES;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const schema = CHECK_CONTACT_FIELDS_SCHEMA.extend({
    recaptchaToken: z.string().min(1, { message: "recaptcha_required" }),
  });

  const result = schema.safeParse(payload);
  if (!result.success) {
    return data(
      {
        errors: z.treeifyError(result.error),
        status: "validation_failed",
      },
      { status: 400 },
    );
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    subject: s,
    message,
    recaptchaToken,
  } = result.data;

  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
  if (!RECAPTCHA_SECRET) {
    console.error("Critical: RECAPTCHA_SECRET_KEY is missing in .env");
  } else {
    try {
      const recaptchaRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`,
        },
      );
      const recaptchaJson = await recaptchaRes.json();

      if (!recaptchaJson.success || recaptchaJson.score < 0.5) {
        return data(
          { status: "bot_detected", message: "Security check failed" },
          { status: 403 },
        );
      }
    } catch (err) {
      console.error("reCAPTCHA API Error:", err);
    }
  }

  const msgDir = direction(message) !== "neutral" ? direction(message) : "ltr";
  const isRTL = msgDir === "rtl";
  const textAlign = isRTL ? "right" : "left";

  const subject = SERVICES_TYPES[s as ServicesTypes][msgDir as "ltr" | "rtl"];

  const BREVO_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_KEY) {
    return data({ status: "server_error" }, { status: 500 });
  }

  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = `${isRTL ? "استشارة جديدة" : "New Consultation"}: ${subject}`;
  sendSmtpEmail.sender = {
    name: `${isRTL ? "استشارة من" : "Consultation from"} ${firstName} ${lastName}`,
    email: process.env.SENDER_EMAIL,
  };
  sendSmtpEmail.to = [
    {
      email: process.env.OFFICE_RECEIVER_EMAIL as string,
      name: "Office",
    },
  ];

  sendSmtpEmail.htmlContent = `
    <div dir="${msgDir}" style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; line-height: 1.6; color: #333; text-align: ${textAlign}; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: #1a1a1a; padding: 25px; text-align: center; border-bottom: 4px solid #d4af37;">
        <h2 style="color: #d4af37; margin: 0;">${isRTL ? "تفاصيل الاستشارة الواردة" : "New Consultation Details"}</h2>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <p><strong>${isRTL ? "اسم العميل" : "Client Name"}:</strong> ${firstName} ${lastName}</p>
        <p><strong>${isRTL ? "البريد الإلكتروني" : "Email"}:</strong> ${email}</p>
        <p><strong>${isRTL ? "رقم الهاتف" : "Phone"}:</strong> <span dir="ltr">${phone}</span></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #d4af37; font-weight: bold; font-size: 1.1em;">${isRTL ? "الموضوع" : "Subject"}: ${subject}</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; border-${textAlign}: 5px solid #d4af37; white-space: pre-wrap; font-size: 15px;">
          ${message}
        </div>
      </div>
      <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee;">
        ${isRTL ? "تم الإرسال من الموقع الرسمي" : "Sent from the Official Website"} | ${new Date().toLocaleString(isRTL ? "ar-QA" : "en-US")}
      </div>
    </div>
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return data({ status: "success" });
  } catch (error) {
    console.error("Brevo API Connection Error:", error);
    return data({ status: "server_error" }, { status: 500 });
  }
}
