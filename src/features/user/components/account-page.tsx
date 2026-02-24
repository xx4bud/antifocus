import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getCurrentUser } from "~/features/auth/actions/get-user";
import { AccountMenu } from "~/features/user/components/account-menu";
import { ProfileForm } from "~/features/user/components/profile-form";
import { SecurityForm } from "~/features/user/components/security-form";

export async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile: menu navigation */}
      <div className="md:hidden">
        <AccountMenu user={user} />
      </div>

      {/* Desktop: tabs layout */}
      <div className="mx-auto hidden w-full py-2 md:block">
        <div className="mb-6 space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Pengaturan Akun</h1>
          <p className="text-muted-foreground text-sm">
            Kelola profil dan keamanan akun Anda
          </p>
        </div>

        <Tabs className="w-full" defaultValue="profile">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Keamanan</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm user={user} />
          </TabsContent>
          <TabsContent value="security">
            <SecurityForm user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
