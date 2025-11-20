import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/lib/auth";

export function meta() {
  return [
    { title: "Resumind - Dashboard" },
    { name: "description", content: "Your resume dashboard" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
    } else if (user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
