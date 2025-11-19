import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function LoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth/login");
  }, [navigate]);

  return null;
}
