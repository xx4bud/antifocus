import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  content: React.ReactNode;
  description: string;
  footer: React.ReactNode;
  title: string;
}

export function AuthCard({
  title,
  description,
  content,
  footer,
}: AuthCardProps) {
  return (
    <Card className="border-none bg-transparent ring-0 md:border md:bg-card md:ring-1">
      <CardHeader className="text-center">
        <CardTitle className="font-semibold text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter className="flex justify-center text-center">
        {footer}
      </CardFooter>
    </Card>
  );
}
