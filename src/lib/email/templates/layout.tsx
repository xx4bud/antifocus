import type React from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";
import { APP_NAME } from "@/lib/utils/constants";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText: string;
}

export const EmailLayout = ({ children, previewText }: EmailLayoutProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              background: "#ffffff",
              foreground: "#000000",
              primary: {
                DEFAULT: "#000000",
                foreground: "#ffffff",
              },
              muted: {
                DEFAULT: "#f4f4f5",
                foreground: "#71717a",
              },
              border: "#e4e4e7",
            },
            fontFamily: {
              sans: ["Geist", "ui-sans-serif", "sans-serif"],
            },
            borderRadius: {
              lg: "10px",
              md: "8px",
              sm: "6px",
            },
          },
        },
      }}
    >
      <Body className="bg-background font-sans">
        <Container className="mx-auto my-[40px] w-[465px] rounded-lg border border-border border-solid p-[20px]">
          <Section className="mt-[32px]">
            <Text className="font-bold text-[24px] text-foreground">
              {APP_NAME}
            </Text>
          </Section>
          {children}
          <Hr className="mx-0 my-[26px] w-full border border-border border-solid" />
          <Text className="text-[12px] text-muted-foreground">
            Bogor, Jawa Barat, Indonesia
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
