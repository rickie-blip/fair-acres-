import { useLocation, Link } from "react-router-dom";
import { Button, Card } from "../components/ui";

export default function ConfirmationScreen() {
  const location = useLocation();
  const referenceNumber = location.state?.referenceNumber || "REF-000000";

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <div className="bg-[#8B1A4A] px-4 py-5 text-center">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-white font-bold text-sm">FA</span>
        </div>
        <h1 className="text-white font-bold text-lg">Fair Acres Hotel</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="p-8 max-w-sm w-full text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Report Submitted!
          </h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Your issue has been sent directly to the GM. You'll be contacted
            shortly.
          </p>

          {/* Reference Number */}
          <div className="bg-[#8B1A4A]/5 border border-[#8B1A4A]/20 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Your Reference Number</p>
            <p className="text-[#8B1A4A] font-bold text-lg tracking-wider">
              {referenceNumber}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Save this to track your complaint
            </p>
          </div>

          {/* What happens next */}
          <div className="text-left mb-6 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              What happens next
            </p>
            {[
              { icon: "📲", text: "GM receives instant alert on their phone" },
              { icon: "⏱️", text: "You'll be contacted within 30 minutes" },
              { icon: "✅", text: "Issue resolved and logged in the system" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 text-sm text-gray-600"
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
