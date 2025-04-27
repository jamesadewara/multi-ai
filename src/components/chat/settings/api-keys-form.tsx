
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function APIKeysForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("API key saved successfully")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="openai-key">OpenAI API Key</Label>
        <Input id="openai-key" type="password" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="anthropic-key">Anthropic API Key</Label>
        <Input id="anthropic-key" type="password" />
      </div>

      <Button type="submit">Save API Keys</Button>
    </form>
  )
}
