
import { useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | MWRD";
  }, []);

  return (
    <AuthForm
      onAuthSuccess={(u) => {
        if (u.role === "admin") navigate("/admin");
        else if (u.role === "vendor") navigate("/supplier-dashboard");
        else navigate("/dashboard");
      }}
    />
  );
};

export default Register;
