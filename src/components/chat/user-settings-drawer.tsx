
import { User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SettingsTabs } from "./settings/settings-tabs";

interface UserSettingsDrawerProp {
  isMini?: boolean;
}

export function UserSettingsDrawer({ isMini }: UserSettingsDrawerProp) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-md transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {
            !isMini ?
              <div className="">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              : <></>
          }

        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <SettingsTabs />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
