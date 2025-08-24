
import { useEffect } from "react";
import { EnhancedAuthForm } from "@/components/auth/EnhancedAuthForm";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | MWRD";
  }, []);

  return (
    <EnhancedAuthForm
      onAuthSuccess={(user) => {
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "vendor") {
          navigate("/vendor-dashboard");
        } else {
          navigate("/dashboard");
        }
      }}
    />
  );
};

export default Register;
