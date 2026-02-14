import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface Props {
  children: React.ReactNode;
}

export default function RecaptchaManager({ children }: Props) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_SITE_API}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
