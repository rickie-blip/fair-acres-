import { useUIStore } from "../store";
import QRCodeSystem from "../components/admin/QRCodeSystem";
import GuestFeedbackFormPreview from "../components/admin/GuestFeedbackFormPreview";
import ConfirmationScreenPreview from "../components/admin/ConfirmationScreenPreview";
import GMDashboardPreview from "../components/admin/GMDashboardPreview";

const ADMIN_TABS = [
  { value: "qr-codes", label: "QR Code System" },
  { value: "feedback-form", label: "Guest Feedback Form" },
  { value: "confirmation", label: "Confirmation Screen" },
  { value: "gm-dashboard", label: "GM Dashboard" },
];

const tabComponents = {
  "qr-codes": QRCodeSystem,
  "feedback-form": GuestFeedbackFormPreview,
  confirmation: ConfirmationScreenPreview,
  "gm-dashboard": GMDashboardPreview,
};

export default function AdminPanel() {
  const activeTab = useUIStore((s) => s.activeAdminTab);
  const setActiveTab = useUIStore((s) => s.setActiveAdminTab);

  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Top Nav ── */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#8B1A4A] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">FA</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              Fair Acres Hotel
            </p>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">GM: Harold</span>
          <div className="w-8 h-8 rounded-full bg-[#8B1A4A]/10 flex items-center justify-center">
            <span className="text-[#8B1A4A] text-xs font-bold">H</span>
          </div>
        </div>
      </nav>

      {/* ── Tab Bar ── */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  activeTab === tab.value
                    ? "border-[#8B1A4A] text-[#8B1A4A] bg-[#8B1A4A]/5"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="p-6 max-w-5xl mx-auto">
        <ActiveComponent />
      </div>
    </div>
  );
}
