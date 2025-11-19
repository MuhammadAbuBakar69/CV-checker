import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/lib/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await checkAuth();
        // Redirect to dashboard after auth
        navigate("/dashboard");
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, [checkAuth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
}
