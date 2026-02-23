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

interface VerifyEmailProps {
  username: string;
  verifyUrl: string;
}

export const VerifyEmail = (props: VerifyEmailProps) => {
  const { username, verifyUrl } = props;
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
                  src="https://antifocus.vercel.app/assets/logo-black.svg"
                  width="152"
                />
              </Link>
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Verify Your Email
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello {username},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Thanks for signing up! To complete your registration and secure
              your account, please verify your email address.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={verifyUrl}
              >
                Verify Email Address
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              If you didn't create an account, you can safely ignore this email.
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
