import { Link } from "react-router";
import Navbar from "~/components/Navbar";

export function meta() {
  return [
    { title: "Pricing - Resumind" },
    { name: "description", content: "Choose the perfect plan for your resume optimization needs" },
  ];
}

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out Resumind",
      features: [
        "3 resume analyses per month",
        "Basic ATS scoring",
        "Standard feedback",
        "PDF export",
        "Email support"
      ],
      cta: "Get Started",
      popular: false,
      gradient: "from-gray-600 to-gray-700"
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For serious job seekers",
      features: [
        "Unlimited resume analyses",
        "Advanced ATS optimization",
        "HR insights & recommendations",
        "AI resume enhancement",
        "Priority email support",
        "Resume version history",
        "Custom templates"
      ],
      cta: "Start Pro Trial",
      popular: true,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Custom AI training",
        "API access",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "White-label options"
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-indigo-600 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-full text-white font-semibold mb-6">
            Pricing Plans
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start for free, upgrade when you need more. All plans include core resume analysis features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-3xl shadow-2xl p-8 relative transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-4 ring-blue-500 ring-offset-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-600 ml-2">/ month</span>}
                </div>
                <p className="text-sm text-gray-500">{plan.period}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.name === "Free" ? "/upload" : "#"}
                className={`block w-full py-4 px-6 text-center font-bold rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal for your convenience."
              },
              {
                question: "Is there a refund policy?",
                answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund within 30 days of purchase."
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                question: "Do you offer discounts for students?",
                answer: "Yes! We offer a 50% discount for students with a valid .edu email address. Contact our support team to apply."
              },
              {
                question: "What happens to my data if I cancel?",
                answer: "Your data is kept for 30 days after cancellation. You can re-activate your account within this period to restore everything."
              }
            ].map((faq, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-6">
                <h3 className="font-bold text-xl text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white mb-12">
          <h2 className="text-4xl font-bold text-center mb-12">All Plans Include</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                title: "Secure & Private",
                description: "Your data is encrypted and never shared"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                title: "Instant Results",
                description: "Get feedback in seconds, not days"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: "Track Progress",
                description: "Monitor improvements over time"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />,
                title: "24/7 Access",
                description: "Analyze resumes anytime, anywhere"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/upload"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              Try Free
            </Link>
            <a 
              href="mailto:support@resumind.com"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gray-100 text-gray-900 font-bold text-lg rounded-2xl hover:bg-gray-200 transition-all duration-300"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Resumind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
