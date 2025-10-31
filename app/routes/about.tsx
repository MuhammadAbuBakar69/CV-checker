import { Link } from "react-router";
import Navbar from "~/components/Navbar";

export function meta() {
  return [
    { title: "About Us - Resumind" },
    { name: "description", content: "Learn more about Resumind - Your AI-powered resume analyzer" },
  ];
}

export default function About() {
  return (
    <div className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg mb-6">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            About Resumind
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering job seekers with AI-powered resume analysis and optimization
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 animate-in fade-in duration-1000">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                At Resumind, we believe that everyone deserves a chance to showcase their best self in the job market. 
                Our mission is to democratize access to professional resume feedback and optimization using cutting-edge AI technology.
              </p>
              <p className="text-lg text-gray-600">
                We combine the power of artificial intelligence with industry best practices to provide 
                instant, actionable feedback that helps you stand out from the competition.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white p-3 rounded-xl shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">AI-Powered Analysis</h3>
                    <p className="text-gray-600">Advanced algorithms analyze your resume in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white p-3 rounded-xl shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Instant Feedback</h3>
                    <p className="text-gray-600">Get comprehensive results in real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-600 text-white p-3 rounded-xl shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Professional Enhancement</h3>
                    <p className="text-gray-600">Get AI-enhanced versions of your resume</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                ),
                title: "ATS Optimization",
                description: "Ensure your resume passes Applicant Tracking Systems with our specialized ATS scoring and recommendations."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                ),
                title: "HR Insights",
                description: "Get personalized feedback from our AI trained on thousands of successful resumes and HR best practices."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                ),
                title: "Smart Suggestions",
                description: "Receive actionable tips to improve content, structure, tone, and formatting for maximum impact."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                title: "Resume Enhancement",
                description: "Generate AI-enhanced versions of your resume with professional improvements and better formatting."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ),
                title: "Score Tracking",
                description: "Monitor your resume's improvement over time with our comprehensive scoring system."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                title: "PDF Export",
                description: "Download your enhanced resume as a professional PDF ready to send to employers."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl inline-block mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We leverage state-of-the-art artificial intelligence and machine learning to provide 
              you with the most accurate and helpful resume feedback available.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Resumes Analyzed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Analysis Points</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Availability</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Optimize Your Resume?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their resumes with Resumind
          </p>
          <Link 
            to="/upload"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Get Started Free
          </Link>
        </div>
      </main>

      {/* White Theme Footer with Pattern */}
      <footer className="bg-white relative overflow-hidden border-t border-gray-100 mt-20">
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
                  { to: "/team", label: "Team", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
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
