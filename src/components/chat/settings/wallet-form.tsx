
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function WalletForm() {
  const handleConnect = () => {
    toast.success("Wallet connected successfully")
  }

  return (
    <div className="space-y-6">
      <Button 
        onClick={handleConnect}
        className="w-full"
      >
        Connect Wallet
      </Button>
    </div>
  )
}
