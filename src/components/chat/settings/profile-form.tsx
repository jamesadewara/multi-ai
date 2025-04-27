
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export function ProfileForm() {
  const { user, logout } = useAuth()
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Profile updated successfully")
  }

  const handleLogout = () => {
    logout();
    navigate("/");

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline">Change Avatar</Button>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={user?.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue={user?.email} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell us about yourself" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" onClick={handleSubmit} className="w-full sm:w-auto">
          Update Profile
        </Button>
        <Button onClick={handleLogout} className="w-full sm:w-auto">
          Logout
        </Button>
      </div>

    </form>
  )
}
