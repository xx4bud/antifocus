import { Button, Text } from "react-email";
import { EmailLayout } from "./layout";

interface InvitationEmailProps {
  inviterName: string;
  organizationName: string;
  url: string;
}

export const InvitationEmail = ({
  organizationName,
  inviterName,
  url,
}: InvitationEmailProps) => (
  <EmailLayout previewText={`Join ${organizationName}`}>
    <Text className="text-[14px] text-foreground leading-[24px]">Hello,</Text>
    <Text className="text-[14px] text-foreground leading-[24px]">
      <strong>{inviterName}</strong> has invited you to join{" "}
      <strong>{organizationName}</strong>.
    </Text>
    <Button
      className="mt-[16px] mb-[16px] rounded-md bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
      href={url}
    >
      Accept Invitation
    </Button>
    <Text className="text-[14px] text-foreground leading-[24px]">
      If you don't want to join this organization or didn't expect this
      invitation, just ignore and delete this message.
    </Text>
  </EmailLayout>
);
