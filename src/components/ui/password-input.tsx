"use client";

import { IconEye, IconEyeOff, IconX } from "@tabler/icons-react";
import * as React from "react";
import { Input, type InputProps } from "~/components/ui/input";
import { PASSWORD_RULES, passwordSchema } from "~/lib/validators/password";
import { cn } from "~/utils/styles";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  showStrength?: boolean;
  strengthValue?: string;
}

function calculatePasswordStrength(password: string) {
  const schema = passwordSchema();
  const result = schema.safeParse(password);
  let score = 0;
  const feedback: string[] = [];
  const allCriteria = [
    {
      regex: PASSWORD_RULES.MIN_LENGTH,
      message: `Minimal ${PASSWORD_RULES.MIN_LENGTH} karakter`,
      contributesToScore: true,
    },
    {
      regex: PASSWORD_RULES.MAX_LENGTH,
      message: `Maksimal ${PASSWORD_RULES.MAX_LENGTH} karakter`,
      contributesToScore: false,
    },
    {
      regex: PASSWORD_RULES.UPPER_CASE,
      message: "Butuh 1 huruf besar",
      contributesToScore: true,
    },
    {
      regex: PASSWORD_RULES.LOWER_CASE,
      message: "Butuh 1 huruf kecil",
      contributesToScore: true,
    },
    {
      regex: PASSWORD_RULES.NUMBER,
      message: "Butuh 1 angka",
      contributesToScore: true,
    },
    {
      regex: PASSWORD_RULES.SYMBOL,
      message: "Butuh 1 simbol",
      contributesToScore: true,
    },
    {
      regex: PASSWORD_RULES.NO_REPEATED_CHAR,
      message: "Tidak boleh ada 3 karakter sama berturut-turut",
      invert: true,
      contributesToScore: false,
    },
    {
      regex: PASSWORD_RULES.ALLOWED_CHARS,
      message: "Mengandung karakter yang tidak diizinkan",
      contributesToScore: false,
    },
  ];

  if (!password) {
    return {
      score: 0,
      feedback: allCriteria
        .filter((c) => c.contributesToScore)
        .map((c) => c.message),
      isValid: false,
    };
  }

  for (const criterion of allCriteria) {
    let isMet: boolean;
    if (typeof criterion.regex === "number") {
      if (criterion.regex === PASSWORD_RULES.MIN_LENGTH) {
        isMet = password.length >= criterion.regex;
      } else if (criterion.regex === PASSWORD_RULES.MAX_LENGTH) {
        isMet = password.length <= criterion.regex;
      } else {
        isMet = false;
      }
    } else {
      isMet = criterion.regex.test(password);
    }
    if ((isMet && !criterion.invert) || (!isMet && criterion.invert)) {
      if (criterion.contributesToScore) {
        score++;
      }
    } else {
      feedback.push(criterion.message);
    }
  }

  score = Math.min(score, 5);

  return {
    score,
    feedback,
    isValid: result.success,
  };
}

function getPasswordStrengthColor(score: number) {
  switch (score) {
    case 0:
    case 1:
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-yellow-500";
    case 4:
      return "bg-blue-500";
    case 5:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
}

function getPasswordStrengthText(score: number) {
  switch (score) {
    case 0:
    case 1:
      return "Terlalu Lemah";
    case 2:
      return "Sedang";
    case 3:
      return "Bagus";
    case 4:
      return "Kuat";
    case 5:
      return "Sangat Kuat";
    default:
      return "";
  }
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, strengthValue = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const passwordStrength = React.useMemo(
      () => calculatePasswordStrength(strengthValue),
      [strengthValue]
    );

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            {...props}
            className={cn("pr-10", className)}
            ref={ref}
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            onClick={togglePasswordVisibility}
            type="button"
          >
            {showPassword ? (
              <IconEyeOff className="size-5" />
            ) : (
              <IconEye className="size-5" />
            )}
          </button>
        </div>

        {showStrength && strengthValue && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-gray-200">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    getPasswordStrengthColor(passwordStrength.score)
                  )}
                  style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                  }}
                />
              </div>
              <span className="font-medium text-xs">
                {getPasswordStrengthText(passwordStrength.score)}
              </span>
            </div>

            {passwordStrength.feedback.length > 0 && (
              <ul className="space-y-1 text-muted-foreground text-xs">
                {passwordStrength.feedback.map((feedback) => (
                  <li className="flex items-center gap-1" key={feedback}>
                    <IconX className="h-3 w-3 text-destructive" />
                    {feedback}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
