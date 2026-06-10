import { Button, Text } from "react-email";
import { EmailLayout } from "./layout";

interface ChangeEmailAlertProps {
  url: string;
  userName: string;
}

export const ChangeEmailAlert = ({ url, userName }: ChangeEmailAlertProps) => (
  <EmailLayout previewText="Security Alert: Email change requested">
    <Text className="text-[14px] text-foreground leading-[24px]">
      Hello {userName},
    </Text>
    <Text className="text-[14px] text-foreground leading-[24px]">
      We received a request to change the email address associated with your
      account. If this was you, please click the button below to confirm the
      change.
    </Text>
    <Button
      className="mt-[16px] mb-[16px] rounded-md bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
      href={url}
    >
      Confirm Email Change
    </Button>
    <Text className="text-[14px] text-foreground leading-[24px]">
      If you did not request this change, please ignore this email or contact
      support immediately to secure your account.
    </Text>
    <Text className="text-[14px] text-foreground leading-[24px]">
      Or copy and paste this URL into your browser:{" "}
      <a className="text-[#067df7] no-underline" href={url}>
        {url}
      </a>
    </Text>
  </EmailLayout>
);
