import { Card } from "../ui";

// ── Guest Feedback Form Preview ───────────────────────────────────────────────
export function GuestFeedbackFormPreview() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Guest Feedback Form</h2>
        <p className="text-gray-500 text-sm mt-1">
          This is what guests see when they scan the QR code in their room.
        </p>
      </div>
      <div className="max-w-md border border-gray-200 rounded-2xl overflow-hidden shadow-md">
        {/* Mock phone frame */}
        <div className="bg-[#8B1A4A] px-4 py-4 text-center">
          <p className="text-white font-bold">Fair Acres Hotel</p>
          <p className="text-white/70 text-xs">Room 205 · Issue Report</p>
        </div>
        <div className="p-4 bg-gray-50 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">
              Your Name (optional)
            </p>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
              e.g. John Smith
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">
              Issue Type *
            </p>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
              Select issue type...
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">
              Describe the Issue *
            </p>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 h-20">
              Please describe what's wrong...
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">
              Photo (optional)
            </p>
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg h-16 flex items-center justify-center text-gray-400 text-xs">
              📷 Tap to add a photo
            </div>
          </div>
          <div className="bg-[#8B1A4A] rounded-lg py-2.5 text-white text-center text-sm font-semibold">
            Submit Report
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confirmation Screen Preview ───────────────────────────────────────────────
export function ConfirmationScreenPreview() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Confirmation Screen</h2>
        <p className="text-gray-500 text-sm mt-1">
          Shown to guests after successfully submitting a report.
        </p>
      </div>
      <div className="max-w-sm border border-gray-200 rounded-2xl overflow-hidden shadow-md">
        <div className="bg-[#8B1A4A] px-4 py-4 text-center">
          <p className="text-white font-bold">Fair Acres Hotel</p>
        </div>
        <div className="p-6 bg-white text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <p className="font-bold text-gray-900 mb-1">Report Submitted!</p>
          <p className="text-gray-500 text-xs mb-4">
            Your issue has been sent directly to the GM. You'll be contacted
            shortly.
          </p>
          <div className="bg-[#8B1A4A]/5 border border-[#8B1A4A]/20 rounded-xl p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Your Reference Number</p>
            <p className="text-[#8B1A4A] font-bold">REF-2025-4821</p>
          </div>
          <div className="text-left space-y-2 text-xs text-gray-600">
            <p>📲 GM receives instant alert</p>
            <p>⏱️ Contacted within 30 minutes</p>
            <p>✅ Issue logged in the system</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── GM Dashboard Preview ──────────────────────────────────────────────────────
export function GMDashboardPreview() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          GM Dashboard Preview
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Mobile-optimized view for the General Manager. Access at{" "}
          <span className="text-[#8B1A4A] font-mono">/gm</span>
        </p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
        💡 The live GM dashboard is accessible at{" "}
        <a href="/gm" className="font-semibold underline">
          /gm
        </a>
        . This tab shows a static preview.
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tasks Done Today", value: "34" },
          { label: "Open Complaints", value: "3", highlight: true },
          { label: "Overdue Tasks", value: "2", highlight: true },
          { label: "Staff on Shift", value: "8" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p
              className={`text-3xl font-bold ${
                stat.highlight ? "text-[#8B1A4A]" : "text-gray-800"
              }`}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GuestFeedbackFormPreview;
