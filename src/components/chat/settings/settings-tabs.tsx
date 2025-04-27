
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { SecurityForm } from "./security-form"
import { AppearanceForm } from "./appearance-form"
import { NotificationsForm } from "./notifications-form"
import { PrivacyForm } from "./privacy-form"
import { APIKeysForm } from "./api-keys-form"
import { WalletForm } from "./wallet-form"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-3 lg:grid-cols-7 h-auto gap-4 bg-muted p-1">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="api">API Keys</TabsTrigger>
        <TabsTrigger value="wallet">Wallet</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileForm />
      </TabsContent>
      <TabsContent value="security">
        <SecurityForm />
      </TabsContent>
      <TabsContent value="appearance">
        <AppearanceForm />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationsForm />
      </TabsContent>
      <TabsContent value="privacy">
        <PrivacyForm />
      </TabsContent>
      <TabsContent value="api">
        <APIKeysForm />
      </TabsContent>
      <TabsContent value="wallet">
        <WalletForm />
      </TabsContent>
    </Tabs>
  )
}
