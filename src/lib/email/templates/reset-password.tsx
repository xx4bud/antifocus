import { Button, Text } from "react-email";
import { EmailLayout } from "./layout";

interface ResetPasswordEmailProps {
  url: string;
  userName: string;
}

export const ResetPasswordEmail = ({
  url,
  userName,
}: ResetPasswordEmailProps) => (
  <EmailLayout previewText="Reset your password">
    <Text className="text-[14px] text-foreground leading-[24px]">
      Hello {userName},
    </Text>
    <Text className="text-[14px] text-foreground leading-[24px]">
      Someone recently requested a password change for your account. If this was
      you, you can set a new password here:
    </Text>
    <Button
      className="mt-[16px] mb-[16px] rounded-md bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
      href={url}
    >
      Reset Password
    </Button>
    <Text className="text-[14px] text-foreground leading-[24px]">
      If you don't want to change your password or didn't request this, just
      ignore and delete this message.
    </Text>
    <Text className="text-[14px] text-foreground leading-[24px]">
      To keep your account secure, please don't forward this email to anyone.
    </Text>
  </EmailLayout>
);
