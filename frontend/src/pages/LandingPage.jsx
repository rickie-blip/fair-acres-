import { Link } from "react-router-dom";
import { Button } from "../components/ui";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white ">
      {/* ── Top Nav ── */}
      <nav className="bg-[#5C2420] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">FA</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              Fair Acres Hotel
            </p>
            <p className="text-white/60 text-xs">Karen · Kitisuru · Karen</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin">
            <button className="text-white/80 hover:text-white text-xs border border-white/30 rounded-lg px-3 py-1.5 transition-colors">
              Staff Login
            </button>
          </Link>
          <Link to="/gm">
            <button className="text-white/80 hover:text-white text-xs border border-white/30 rounded-lg px-3 py-1.5 transition-colors">
              GM Access
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="bg-[#A63254] px-6 pt-10 pb-16 text-center relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <p className="text-white/60 text-xs mb-4 tracking-widest uppercase">
          Powered by Captivus Kenya
        </p>

        <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight mb-4 max-w-lg mx-auto">
          Report issues directly to management
        </h1>
        <p className="text-white/70 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          No app needed. Scan the QR code in your room and your message reaches
          the manager instantly — 24 hours a day.
        </p>

        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          <Link to="/r/scan">
            <Button variant="white" size="md">
              Report an Issue
            </Button>
          </Link>
          <Link to="/admin">
            <Button
              variant="outline"
              size="md"
              className="border-white/50 text-white hover:bg-white hover:text-[#8B1A4A]"
            >
              Staff Login
            </Button>
          </Link>
        </div>

        {/* QR Scan Prompt Card */}
        <div className="max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">
              Scan QR in your room
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              This page opens automatically. No download, no signup.
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <p className="text-[#8B1A4A] text-xs font-bold uppercase tracking-widest mb-2">
          HOW IT WORKS
        </p>
        <h2 className="text-gray-900 text-2xl font-bold mb-2">
          Three steps to get your issue resolved
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Simply, fast, and direct communication with management.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          {[
            {
              step: "1",
              title: "Scan the QR code",
              desc: "In your room on the bedside table",
            },
            {
              step: "2",
              title: "Submit your issue",
              desc: "Describe the problem, add a photo if needed",
            },
            {
              step: "3",
              title: "Management is alerted",
              desc: "GM receives instant notification",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 flex-1">
              <div className="w-8 h-8 rounded-full bg-[#8B1A4A]/10 flex items-center justify-center shrink-0">
                <span className="text-[#8B1A4A] font-bold text-sm">
                  {item.step}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {item.title}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── For Guests ── */}
      <section className="px-6 pb-12 max-w-2xl mx-auto">
        <p className="text-[#8B1A4A] text-xs font-bold uppercase tracking-widest mb-2">
          FOR GUESTS
        </p>
        <h2 className="text-gray-900 text-2xl font-bold mb-2">
          Your complaint reaches management — not just the front desk
        </h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          No app download. No account. Just scan and submit. You'll receive a
          reference number and the GM is alerted within seconds.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: "🕐",
              title: "24/7 Reporting",
              desc: "Night-time issues don't get lost anymore",
            },
            {
              icon: "📷",
              title: "Photo Upload",
              desc: "Attach evidence with your complaint",
            },
            {
              icon: "🔖",
              title: "Reference Number",
              desc: "Track your complaint status",
            },
            {
              icon: "📲",
              title: "Direct to GM",
              desc: "Bypasses staff hesitation",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="border-l-2 border-[#8B1A4A]/30 pl-4 py-1"
            >
              <p className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                <span>{feature.icon}</span> {feature.title}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── For Management ── */}
      <section className="bg-gray-50 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#8B1A4A] text-xs font-bold uppercase tracking-widest mb-2">
            FOR MANAGEMENT
          </p>
          <h2 className="text-gray-900 text-2xl font-bold mb-3">
            Full visibility — from anywhere
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Harold can monitor both Fair Acres and Mikeva Hills from a single
            dashboard on his phone. Real-time task completion, photo proof, and
            instant alerts.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#8B1A4A] text-white/60 text-center text-xs py-4">
        © {new Date().getFullYear()} Fair Acres Hotel · Powered by Captivus
        Kenya
      </footer>
    </div>
  );
}
