import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  resetUrl: string;
  userEmail: string;
  username: string;
}

export const ResetPasswordEmail = (props: ResetPasswordEmailProps) => {
  const { username, resetUrl, userEmail } = props;

  return (
    <Html dir="ltr" lang="en">
      <Tailwind>
        <Head />
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px] text-center">
              <Link href="https://antifocus.vercel.app" target="_blank">
                <Img
                  alt="Antifocus Logo"
                  className="mx-auto"
                  height="36"
                  src="https://antifocus.vercel.app/logo-black.svg"
                  width="152"
                />
              </Link>
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Reset Your Password
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello {username},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              We received a request to reset the password for the account
              associated with <span className="font-bold">{userEmail}</span>.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={resetUrl}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              If you didn't request a password reset, you can safely ignore this
              email.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border-[#eaeaea]" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Antifocus Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
