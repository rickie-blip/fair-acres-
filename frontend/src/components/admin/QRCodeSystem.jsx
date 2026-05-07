import { useRooms } from "../../hooks/useQueries";
import { Card, Spinner } from "../ui";

// Simple SVG QR code placeholder (replace with actual qrcode library in production)
function QRPlaceholder({ roomNumber }) {
  const seed = roomNumber * 7;
  return (
    <div className="w-32 h-32 mx-auto">
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer border */}
        <rect x="5" y="5" width="90" height="90" fill="white" rx="4" />
        {/* Top-left position marker */}
        <rect x="10" y="10" width="25" height="25" fill="#8B1A4A" rx="2" />
        <rect x="14" y="14" width="17" height="17" fill="white" rx="1" />
        <rect x="17" y="17" width="11" height="11" fill="#8B1A4A" rx="1" />
        {/* Top-right position marker */}
        <rect x="65" y="10" width="25" height="25" fill="#8B1A4A" rx="2" />
        <rect x="69" y="14" width="17" height="17" fill="white" rx="1" />
        <rect x="72" y="17" width="11" height="11" fill="#8B1A4A" rx="1" />
        {/* Bottom-left position marker */}
        <rect x="10" y="65" width="25" height="25" fill="#8B1A4A" rx="2" />
        <rect x="14" y="69" width="17" height="17" fill="white" rx="1" />
        <rect x="17" y="72" width="11" height="11" fill="#8B1A4A" rx="1" />
        {/* Data modules (decorative, based on room seed) */}
        {Array.from({ length: 20 }, (_, i) => {
          const x = 40 + ((seed * (i + 1) * 13) % 45);
          const y = 40 + ((seed * (i + 1) * 7) % 45);
          return (
            <rect key={i} x={x} y={y} width="4" height="4" fill="#8B1A4A" />
          );
        })}
      </svg>
    </div>
  );
}

export default function QRCodeSystem() {
  const { data: rooms, isLoading } = useRooms();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          QR Code System - One per Room
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Each room gets a unique QR code. Guests scan → feedback form opens
          with room number pre-filled. No app download needed.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {rooms?.map((room) => (
            <Card
              key={room.number}
              className="p-6 text-center hover:shadow-md transition-shadow"
            >
              <p className="text-[#8B1A4A] font-semibold mb-4">
                Room {room.number}
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <QRPlaceholder roomNumber={room.number} />
              </div>
              <p className="text-gray-500 text-xs mb-2">
                Sticker placed near bedside table
              </p>
              <a
                href={`https://${room.url}`}
                className="text-[#8B1A4A] text-xs font-medium hover:underline"
              >
                {room.url}
              </a>
            </Card>
          ))}
        </div>
      )}

      {/* How it works note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <p className="text-amber-800 font-semibold text-sm mb-3 flex items-center gap-2">
          <span>💡</span> How it works:
        </p>
        <ul className="space-y-1.5 text-amber-700 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span> QR codes are professionally
            printed and laminated
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span> Placed on bedside tables in
            acrylic holders
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span> Each code links to:
            fairacres.app/r/[ROOM_NUMBER]
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span> Guest scans → form opens with room
            pre-filled
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span> No app download, no login required
          </li>
        </ul>
      </div>
    </div>
  );
}
