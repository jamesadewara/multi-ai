
import { ThemeToggle } from "@/components/theme-toggle"
import { Label } from "@/components/ui/label"

export function AppearanceForm() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Theme</Label>
        <ThemeToggle />
      </div>
    </div>
  )
}
