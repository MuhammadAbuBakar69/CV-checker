import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "~/lib/auth";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  return null;
}
