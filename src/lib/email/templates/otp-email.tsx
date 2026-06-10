import { Text } from "react-email";
import { EmailLayout } from "./layout";

interface OtpEmailProps {
  otp: string;
  userName: string;
}

export const OtpEmail = ({ otp, userName }: OtpEmailProps) => (
  <EmailLayout previewText="Your two-factor authentication code">
    <Text className="text-[14px] text-foreground leading-[24px]">
      Hello {userName},
    </Text>
    <Text className="text-[14px] text-foreground leading-[24px]">
      Your two-factor authentication code is:
    </Text>
    <Text className="my-[20px] rounded-md bg-muted px-[20px] py-[10px] text-center font-bold text-[32px] text-foreground tracking-widest">
      {otp}
    </Text>
    <Text className="text-[14px] text-foreground leading-[24px]">
      This code will expire in 5 minutes. If you did not request this code,
      please ignore this email.
    </Text>
  </EmailLayout>
);
