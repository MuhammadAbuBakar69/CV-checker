import { useEffect, useState } from "react";
import { useAuth } from "~/lib/auth";
import { useNavigate } from "react-router";
import { supabase } from "~/lib/supabase";

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalResumes: 0,
    averageScore: 0,
    hrResumes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
      return;
    }

    const loadStats = async () => {
      if (!user) return;
      
      try {
        // Get user's resume count
        const { count: resumeCount } = await supabase
          .from("resumes")
          .select("*", { count: "exact" })
          .eq("user_id", user.id);

        // Get HR resumes count
        const { count: hrCount } = await supabase
          .from("resumes")
          .select("*", { count: "exact" })
          .eq("hr_upload", true);

        setStats({
          totalResumes: resumeCount || 0,
          averageScore: 78.5,
          hrResumes: hrCount || 0,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, navigate, authLoading]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (authLoading || (loading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with User Avatar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-blue-100 mt-1">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/upload")}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-6 rounded-lg transition"
            >
              + Upload Resume
            </button>
            <div className="flex items-center gap-3">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.email}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              )}
              <button
                onClick={handleSignOut}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Total Resumes Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-2">
                      Total Resumes
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      {stats.totalResumes}
                    </p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Average Score Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-2">
                      Average Score
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      {stats.averageScore}%
                    </p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-4">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* HR Resumes Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-2">
                      HR Reviews
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      {stats.hrResumes}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-full p-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/upload")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Upload New Resume
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  View My Resumes
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
