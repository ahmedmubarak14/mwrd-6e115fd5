import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  LogOut, 
  CreditCard, 
  HelpCircle,
  ChevronDown 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ClientHeaderUserMenuProps {
  userProfile: any;
}

export const ClientHeaderUserMenu = ({ userProfile }: ClientHeaderUserMenuProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const userInitials = userProfile?.full_name
    ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : userProfile?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-9 px-2 hover:bg-accent/50 transition-all duration-200 gap-2"
          aria-label="User menu"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className={cn(
            "h-3 w-3 transition-transform duration-200 hidden sm:block",
            isOpen && "rotate-180"
          )} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 p-2"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center gap-3 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <p className="font-medium truncate">
              {userProfile?.full_name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userProfile?.email}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {userProfile?.role || 'User'}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="cursor-pointer gap-2 p-2"
        >
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate('/settings')}
          className="cursor-pointer gap-2 p-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate('/manage-subscription')}
          className="cursor-pointer gap-2 p-2"
        >
          <CreditCard className="h-4 w-4" />
          Subscription
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate('/support')}
          className="cursor-pointer gap-2 p-2"
        >
          <HelpCircle className="h-4 w-4" />
          Support
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer gap-2 p-2 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};