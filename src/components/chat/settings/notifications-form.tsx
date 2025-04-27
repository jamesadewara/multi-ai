
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function NotificationsForm() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="email-notifications">Email Notifications</Label>
        <Switch id="email-notifications" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="push-notifications">Push Notifications</Label>
        <Switch id="push-notifications" />
      </div>
    </div>
  )
}
