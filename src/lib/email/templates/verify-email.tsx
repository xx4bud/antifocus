import { Button, Text } from "react-email";
import { EmailLayout } from "./layout";

interface VerifyEmailProps {
  url: string;
  userName: string;
}

export const VerifyEmail = ({ url, userName }: VerifyEmailProps) => (
  <EmailLayout previewText="Verify your email address">
    <Text className="text-[14px] text-foreground leading-[24px]">
      Hello {userName},
    </Text>
    <Text className="text-[14px] text-foreground leading-[24px]">
      Welcome! Please click the button below to verify your email address and
      activate your account.
    </Text>
    <Button
      className="mt-[16px] mb-[16px] rounded-md bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
      href={url}
    >
      Verify Email Address
    </Button>
    <Text className="text-[14px] text-foreground leading-[24px]">
      Or copy and paste this URL into your browser:{" "}
      <a className="text-[#067df7] no-underline" href={url}>
        {url}
      </a>
    </Text>
  </EmailLayout>
);
