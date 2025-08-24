
import { useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign in | MWRD";
  }, []);

  return (
    <AuthForm
      onAuthSuccess={(u) => {
        if (u.role === "admin") navigate("/admin");
        else if (u.role === "vendor") navigate("/vendor-dashboard");
        else navigate("/dashboard");
      }}
    />
  );
};

export default Login;
