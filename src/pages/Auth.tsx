import { useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign in | Supplify";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Sign in to Supplify to manage users, requests, and offers.");
    } else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Sign in to Supplify to manage users, requests, and offers.";
      document.head.appendChild(m);
    }
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (link) {
      link.href = `${window.location.origin}/auth`;
    } else {
      const l = document.createElement("link");
      l.rel = "canonical";
      l.href = `${window.location.origin}/auth`;
      document.head.appendChild(l);
    }
  }, []);

  return (
    <AuthForm
      onAuthSuccess={(u) => {
        if (u.role === "admin") navigate("/admin");
        else if (u.role === "supplier") navigate("/supplier-dashboard");
        else navigate("/client-dashboard");
      }}
    />
  );
};

export default Auth;
