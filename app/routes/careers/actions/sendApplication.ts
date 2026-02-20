import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import * as Brevo from "@getbrevo/brevo";
import z from "zod";
import { CHECK_JOB_APPLICATION_SCHEMA } from "~/constants";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData(),
    payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      job: formData.get("job"),
      resume: formData.get("resume"),
      coverLetter: formData.get("coverLetter"),
      recaptchaToken: formData.get("recaptchaToken"),
    },
    schema = CHECK_JOB_APPLICATION_SCHEMA.extend({
      job: z.string().min(1, { message: "job_required" }),
      recaptchaToken: z.string().min(1, { message: "recaptcha_required" }),
    }),
    result = schema.safeParse(payload);

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
      job,
      resume,
      coverLetter,
      recaptchaToken,
    } = result.data,
    RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
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
        ),
        recaptchaJson = await recaptchaRes.json();

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

  const BREVO_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_KEY) {
    return data({ status: "server_error" }, { status: 500 });
  }

  const apiInstance = new Brevo.TransactionalEmailsApi();

  apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = `طلب توظيف جديد: ${job}`;
  sendSmtpEmail.sender = {
    name: "موقع هود بن عادل للمحاماة - طلب توظيف",
    email: process.env.SENDER_EMAIL,
  };

  sendSmtpEmail.to = [
    {
      email: process.env.OFFICE_RECEIVER_EMAIL as string,
      name: "إدارة الموارد البشرية",
    },
  ];

  const formattedCoverLetter = coverLetter
    ? coverLetter
        .split("\n")
        .map(
          (para) =>
            `<p style="text-align: justify; text-align-last: center; margin-bottom: 15px;">${para}</p>`,
        )
        .join("")
    : "<p>لم يتم تقديم خطاب توصية.</p>";

  sendSmtpEmail.htmlContent = `
    <div dir="rtl" style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 20px;">
      <h2 style="color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 10px; text-align: center;">طلب توظيف جديد</h2>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1a237e;">بيانات المتقدم:</h3>
        <p><strong>الاسم:</strong> ${firstName} ${lastName}</p>
        <p><strong>البريد الإلكتروني:</strong> ${email}</p>
        <p><strong>رقم الهاتف:</strong> <span dir="ltr">${phone}</span></p>
        <p><strong>الوظيفة المستهدفة:</strong> ${job}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #1a237e;">خطاب التوصية:</h3>
        <div style="line-height: 1.6; color: #374151;">
          ${formattedCoverLetter}
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      
      <p style="font-size: 12px; color: #6b7280; text-align: center;">
        تم إرسال هذا الطلب عبر الموقع الإلكتروني لشركة هود بن عادل للمحاماة.
      </p>
    </div>
  `;

  if (resume instanceof File) {
    const buffer = Buffer.from(await resume.arrayBuffer());
    sendSmtpEmail.attachment = [
      {
        content: buffer.toString("base64"),
        name: resume.name,
      },
    ];
  }

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return data({ status: "success" });
  } catch (error) {
    console.error("Brevo API Connection Error:", error);
    return data({ status: "server_error" }, { status: 500 });
  }
}
