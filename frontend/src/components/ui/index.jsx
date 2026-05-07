// ── Badge ─────────────────────────────────────────────────────────────────────
const badgeVariants = {
  red: "bg-red-100 text-red-700 border border-red-200",
  orange: "bg-orange-100 text-orange-700 border border-orange-200",
  green: "bg-green-100 text-green-700 border border-green-200",
  blue: "bg-blue-100 text-blue-700 border border-blue-200",
  gray: "bg-gray-100 text-gray-600 border border-gray-200",
};

export function Badge({ children, color = "gray", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badgeVariants[color]} ${className}`}
    >
      {children}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
const buttonVariants = {
  primary: "bg-[#8B1A4A] hover:bg-[#6e1238] text-white",
  outline:
    "border border-[#8B1A4A] text-[#8B1A4A] hover:bg-[#8B1A4A] hover:text-white",
  ghost: "text-gray-600 hover:bg-gray-100",
  white: "bg-white text-[#8B1A4A] hover:bg-gray-50",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B1A4A]/40 disabled:opacity-50 disabled:cursor-not-allowed ${buttonVariants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" color="currentColor" />}
      {children}
    </button>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, highlight = false }) {
  return (
    <Card className={`p-4 ${highlight ? "border-[#8B1A4A]/20" : ""}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
        {label}
      </p>
      <p
        className={`text-3xl font-bold ${
          highlight ? "text-[#8B1A4A]" : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </Card>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = "md", color = "#8B1A4A" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  return (
    <svg
      className={`animate-spin ${sizes[size]}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      />
      <path className="opacity-75" fill={color} d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = "#8B1A4A", className = "" }) {
  return (
    <div className={`w-full bg-gray-100 rounded-full h-2.5 ${className}`}>
      <div
        className="h-2.5 rounded-full transition-all duration-700"
        style={{
          width: `${Math.min(value, 100)}%`,
          backgroundColor: value === 0 ? "#ef4444" : color,
        }}
      />
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ className = "" }) {
  return <hr className={`border-gray-100 ${className}`} />;
}

// ── Tab Bar ───────────────────────────────────────────────────────────────────
export function TabBar({ tabs, active, onChange, className = "" }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors rounded-xl
            ${
              active === tab.value
                ? "text-[#8B1A4A]"
                : "text-gray-400 hover:text-gray-600"
            }`}
        >
          {tab.icon && <span className="text-lg">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
