import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    if (!isClient) return;
    
    const loadResumes = async () => {
      setLoadingResumes(true);

      try {
        const resumes = (await kv.list('resume:*', true)) as KVItem[];

        const parsedResumes = resumes?.map((resume) => (
            JSON.parse(resume.value) as Resume
        ))

        setResumes(parsedResumes || []);
      } catch (error) {
        console.error('Failed to load resumes:', error);
        setResumes([]);
      } finally {
        setLoadingResumes(false);
      }
    }

    loadResumes()
  }, [kv, isClient]);

  // Prevent hydration mismatch during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover flex flex-col">
        <main className="flex-grow">
          <Navbar />
          <section className="main-section">
            <div className="hero-section relative overflow-hidden py-12 md:py-20 mb-8 md:mb-12 px-4">
              <div className="relative z-10 text-center">
                <div className="flex flex-col md:flex-row items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 md:p-4 rounded-2xl shadow-lg mb-4 md:mb-0 md:mr-4">
                    <svg className="w-8 md:w-12 h-8 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Track Your Applications
                  </h1>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                  <svg className="w-6 md:w-8 h-6 md:h-8 text-blue-600 mb-2 md:mb-0 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700">
                    & Resume Ratings
                  </h2>
                </div>

                <div className="max-w-4xl mx-auto px-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-center mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
                      <h3 className="text-xl font-semibold text-gray-800">Loading...</h3>
                    </div>
                    <p className="text-lg text-gray-600">
                      Please wait while we load your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover flex flex-col">
      <main className="flex-grow">
        <Navbar />

        <section className="main-section">
          {/* Hero Section with Professional Header - Responsive */}
          <div className="hero-section relative overflow-hidden py-12 md:py-20 mb-8 md:mb-12 px-4">
            {/* Floating Elements */}
            <div className="absolute top-10 left-4 md:left-10 w-16 md:w-20 h-16 md:h-20 bg-blue-200/30 rounded-full blur-xl"></div>
            <div className="absolute top-20 right-4 md:right-20 w-24 md:w-32 h-24 md:h-32 bg-purple-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-1/4 w-20 md:w-24 h-20 md:h-24 bg-green-200/30 rounded-full blur-xl"></div>
            
            <div className="relative z-10 text-center">
              {/* Main Title with Icon - Responsive */}
              <div className="flex flex-col md:flex-row items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 md:p-4 rounded-2xl shadow-lg mb-4 md:mb-0 md:mr-4">
                  <svg className="w-8 md:w-12 h-8 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Track Your Applications
                </h1>
              </div>
              
              {/* Subtitle with Resume Icon - Responsive */}
              <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                <svg className="w-6 md:w-8 h-6 md:h-8 text-blue-600 mb-2 md:mb-0 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700">
                  & Resume Ratings
                </h2>
              </div>

              {/* Dynamic Subtitle - Responsive */}
              {!loadingResumes && (
                <div className="max-w-4xl mx-auto px-4">
                  {resumes?.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                      <div className="flex flex-col md:flex-row items-center justify-center mb-4">
                        <svg className="w-12 md:w-16 h-12 md:h-16 text-orange-500 mb-3 md:mb-0 md:mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 15.5C3.498 16.333 4.46 18 6 18z" />
                        </svg>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Ready to Get Started?</h3>
                      </div>
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                        No resumes found. Upload your first resume to get professional AI-powered feedback and start optimizing your job search journey.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                      <div className="flex flex-col md:flex-row items-center justify-center mb-4">
                        <svg className="w-12 md:w-16 h-12 md:h-16 text-green-500 mb-3 md:mb-0 md:mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Your Portfolio is Active</h3>
                      </div>
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                        Review your submissions and check AI-powered feedback to continuously improve your applications and increase your success rate.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Feature Highlights - Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 max-w-6xl mx-auto px-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="bg-blue-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 md:w-8 h-6 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2">AI-Powered Analysis</h4>
                  <p className="text-gray-600 text-sm">Get instant feedback on your resume with advanced AI technology</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="bg-green-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 md:w-8 h-6 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9z" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Performance Tracking</h4>
                  <p className="text-gray-600 text-sm">Monitor your application success rates and improvements over time</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="bg-purple-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 md:w-8 h-6 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Smart Recommendations</h4>
                  <p className="text-gray-600 text-sm">Receive personalized suggestions to optimize your resume content</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State - Responsive */}
          {loadingResumes && (
            <div className="loading-section py-12 md:py-16 px-4">
              <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
                  <div className="relative mb-6 md:mb-8">
                    <div className="w-48 md:w-64 h-32 md:h-40 mx-auto bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <div className="absolute inset-0 bg-blue-400/20 rounded-2xl animate-pulse"></div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center mb-6">
                    <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600 mb-3 md:mb-0 md:mr-4"></div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">Analyzing Your Portfolio</h3>
                  </div>

                  <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                    Our AI is processing your resumes and generating personalized insights. This typically takes a few moments.
                  </p>

                  <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4">
                    <div className="flex items-center text-sm text-gray-500 justify-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                      Scanning Content
                    </div>
                    <div className="flex items-center text-sm text-gray-500 justify-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      AI Analysis
                    </div>
                    <div className="flex items-center text-sm text-gray-500 justify-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-2"></div>
                      Generating Feedback
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resume Grid Section - Responsive */}
          {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section py-8 px-4">
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 md:px-8 py-3 md:py-4 shadow-lg border border-gray-100">
                  <svg className="w-6 md:w-8 h-6 md:h-8 text-blue-600 mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-lg md:text-xl font-semibold text-gray-800">
                    Your Resume Portfolio ({resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'})
                  </span>
                </div>
              </div>

              {/* Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
                {resumes.map((resume) => (
                  <div key={resume.id} className="transform hover:scale-105 transition-all duration-300">
                    <ResumeCard resume={resume} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - Responsive */}
          {!loadingResumes && resumes?.length === 0 && (
            <div className="empty-state-section py-12 md:py-16 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm rounded-3xl p-8 md:p-16 shadow-2xl border border-gray-100 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="mb-6 md:mb-8">
                      <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                        <svg className="w-12 md:w-16 h-12 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
                      Ready to Launch Your Career?
                    </h3>
                    
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6 md:mb-8 max-w-2xl mx-auto">
                      Start your journey to landing your dream job. Upload your resume and get instant AI-powered feedback 
                      to make your application stand out from the competition.
                    </p>

                    <div className="mb-6 md:mb-8">
                      <Link 
                        to="/upload" 
                        className="inline-flex items-center px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg md:text-xl font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                      >
                        <svg className="w-6 md:w-8 h-6 md:h-8 mr-3 md:mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Your First Resume
                        <svg className="w-5 md:w-6 h-5 md:h-6 ml-3 md:ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 text-sm">
                      <Link 
                        to="/demo" 
                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                      >
                        <svg className="w-4 md:w-5 h-4 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        See How It Works
                      </Link>
                      
                      <div className="text-gray-400 hidden sm:block">•</div>
                      
                      <Link 
                        to="/pricing" 
                        className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                      >
                        <svg className="w-4 md:w-5 h-4 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        View Pricing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* White Theme Footer with Pattern */}
      <footer className="bg-white relative overflow-hidden border-t border-gray-100">
        {/* Geometric Pattern Background */}
        <div className="absolute inset-0">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Pattern */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Floating Geometric Shapes */}
            <circle cx="100" cy="80" r="40" fill="url(#gradient1)" />
            <polygon points="200,60 240,100 200,140 160,100" fill="#f0f9ff" opacity="0.6" />
            <rect x="320" y="40" width="60" height="60" rx="8" fill="#ecfdf5" opacity="0.7" transform="rotate(15)" />
            <circle cx="500" cy="300" r="35" fill="#fef3c7" opacity="0.5" />
            <polygon points="680,250 720,290 680,330 640,290" fill="#f3e8ff" opacity="0.6" />
            <rect x="850" y="50" width="50" height="50" rx="6" fill="#fce7f3" opacity="0.6" transform="rotate(-20)" />
            <circle cx="950" cy="320" r="30" fill="#e0f2fe" opacity="0.7" />
            <polygon points="1050,80 1080,110 1050,140 1020,110" fill="#f0fdf4" opacity="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Top Section - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Resumind</h3>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                Empowering professionals with AI-powered resume analysis and career optimization tools. 
                Turn your job applications into success stories.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                  AI-Powered
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                  Instant Feedback
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200">
                  Professional
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gray-900">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { to: "/upload", label: "Upload Resume", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" },
                  { to: "/dashboard", label: "Dashboard", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" },
                  { to: "/pricing", label: "Pricing", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" },
                  { to: "/about", label: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                    >
                      <svg className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gray-900">Support</h4>
              <ul className="space-y-3">
                {[
                  { to: "/help", label: "Help Center", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                  { to: "/contact", label: "Contact Us", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                  { to: "/privacy", label: "Privacy Policy", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                  { to: "/terms", label: "Terms of Service", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                    >
                      <svg className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="px-6 bg-white">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Section - Responsive */}
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 mb-8">
            {/* Copyright & Status */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 text-center lg:text-left">
              <div className="flex flex-col space-y-2">
                <p className="text-gray-600 text-sm">
                  © 2024 Resumind. All rights reserved.
                </p>
                <div className="flex items-center justify-center lg:justify-start text-xs text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    All systems operational
                  </span>
                  <span>v1.2.0</span>
                </div>
              </div>
            </div>

            {/* Developer Info & Social Links */}
            <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Developer Info */}
              <div className="text-center lg:text-right bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-500 mb-1">Developed by</p>
                <p className="text-lg font-semibold text-gray-900">Md Abu Bakar</p>
                <p className="text-xs text-gray-500">Full Stack Developer</p>
                <p className="text-xs text-blue-600 mt-1">Built with React & TypeScript</p>
              </div>

              {/* Social Links Grid */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { href: "https://withabubakar.netlify.app/", title: "Portfolio", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6m8 0H8", bg: "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200", color: "text-blue-600" },
                  { href: "https://www.linkedin.com/in/mohamad-abubakar/", title: "LinkedIn", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", bg: "bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200", color: "text-blue-700", fill: true },
                  { href: "https://github.com/MuhammadAbuBakar69", title: "GitHub", icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z", bg: "bg-gradient-to-br from-gray-50 to-slate-100 hover:from-gray-100 hover:to-slate-200", color: "text-gray-700", fill: true },
                  { href: "mailto:md.bakar2006@gmail.com", title: "Email", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", bg: "bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200", color: "text-green-600" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? '_self' : '_blank'}
                    rel={social.href.startsWith('mailto:') ? '' : 'noopener noreferrer'}
                    className={`group flex items-center justify-center w-12 h-12 ${social.bg} rounded-xl border border-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    title={social.title}
                  >
                    {social.fill ? (
                      <svg className={`w-5 h-5 ${social.color} transition-colors duration-300`} fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon}/>
                      </svg>
                    ) : (
                      <svg className={`w-5 h-5 ${social.color} transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Stats & Trust Indicators */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
              {/* Trust Indicators */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h5 className="font-semibold text-gray-800">Secure & Private</h5>
                <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h5 className="font-semibold text-gray-800">Lightning Fast</h5>
                <p className="text-sm text-gray-600">Get instant AI-powered feedback in seconds</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h5 className="font-semibold text-gray-800">Smart Insights</h5>
                <p className="text-sm text-gray-600">Advanced AI provides personalized recommendations</p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-8 pt-6 border-t border-blue-200 text-center">
              <p className="text-sm text-gray-600 mb-4">Ready to transform your job search?</p>
              <Link 
                to="/upload" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started Today
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Floating Elements */}
        <div className="absolute top-20 right-10 w-16 h-16 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-12 h-12 bg-purple-100 rounded-full opacity-30 animate-bounce"></div>
      </footer>
    </div>
  );
}