
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function PrivacyForm() {
  const handleDataDownload = () => {
    toast.success("Your data will be emailed to you shortly")
  }

  const handleAccountDelete = () => {
    toast.error("This action cannot be undone", {
      action: {
        label: "Delete Account",
        onClick: () => console.log("Account deletion requested")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="profile-visible">Public Profile</Label>
        <Switch id="profile-visible" />
      </div>

      <div className="space-y-2">
        <Button 
          variant="outline" 
          onClick={handleDataDownload}
          className="w-full"
        >
          Download Personal Data
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleAccountDelete}
          className="w-full"
        >
          Delete Account
        </Button>
      </div>
    </div>
  )
}
