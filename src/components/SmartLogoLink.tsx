import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SmartLogoLinkProps {
  className?: string;
  children: React.ReactNode;
}

export const SmartLogoLink = ({ className, children }: SmartLogoLinkProps) => {
  const { user, userProfile } = useAuth();
  
  // If user is authenticated, navigate to dashboard, otherwise go to landing
  const destination = user && userProfile ? "/dashboard" : "/";
  
  return (
    <Link to={destination} className={className}>
      {children}
    </Link>
  );
};