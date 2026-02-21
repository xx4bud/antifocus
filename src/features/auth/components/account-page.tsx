import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ProfileForm } from "~/features/auth/components/profile-form";
import { SecurityForm } from "~/features/auth/components/security-form";

export function AccountPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="mb-2 space-y-1">
        <h1 className="font-bold text-2xl tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="security">
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
