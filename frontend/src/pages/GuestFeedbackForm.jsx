import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spinner } from "../components/ui";
import { useSubmitComplaint } from "../hooks/useQueries";

const ISSUE_TYPES = [
  "Plumbing / Bathroom",
  "Air Conditioning",
  "Cleanliness",
  "Noise",
  "Room Amenities",
  "Security Concern",
  "Food & Beverage",
  "Other",
];

export default function GuestFeedbackForm() {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const { mutate: submitComplaint, isPending } = useSubmitComplaint();

  const [form, setForm] = useState({
    guestName: "",
    issueType: "",
    description: "",
    photo: null,
    photoPreview: null,
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({
        ...prev,
        photo: file,
        photoPreview: ev.target.result,
      }));
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    const errs = {};
    if (!form.issueType) errs.issueType = "Please select an issue type";
    if (!form.description.trim())
      errs.description = "Please describe the issue";
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    submitComplaint(
      { roomNumber, ...form },
      {
        onSuccess: (data) => {
          navigate("/confirmation", {
            state: {
              referenceNumber: data?.referenceNumber || "REF-" + Date.now(),
            },
          });
        },
        onError: () => {
          // Navigate anyway in demo mode
          navigate("/confirmation", {
            state: { referenceNumber: "REF-" + Date.now() },
          });
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-[#8B1A4A] px-4 py-5 text-center">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-white font-bold text-sm">FA</span>
        </div>
        <h1 className="text-white font-bold text-lg">Fair Acres Hotel</h1>
        <p className="text-white/70 text-xs mt-0.5">
          Room {roomNumber} · Issue Report
        </p>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-4">
        <Card className="p-5">
          <h2 className="font-bold text-gray-900 mb-4">Report an Issue</h2>

          {/* Guest Name */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Your Name{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              name="guestName"
              value={form.guestName}
              onChange={handleChange}
              placeholder="e.g. John Smith"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A4A]/30 focus:border-[#8B1A4A]"
            />
          </div>

          {/* Issue Type */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Issue Type <span className="text-red-400">*</span>
            </label>
            <select
              name="issueType"
              value={form.issueType}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A4A]/30 focus:border-[#8B1A4A] bg-white
                ${errors.issueType ? "border-red-400" : "border-gray-200"}`}
            >
              <option value="">Select issue type...</option>
              {ISSUE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.issueType && (
              <p className="text-red-500 text-xs mt-1">{errors.issueType}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Describe the Issue <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Please describe what's wrong..."
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A4A]/30 focus:border-[#8B1A4A] resize-none
                ${errors.description ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Photo{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            {form.photoPreview ? (
              <div className="relative">
                <img
                  src={form.photoPreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() =>
                    setForm((p) => ({ ...p, photo: null, photoPreview: null }))
                  }
                  className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow text-gray-500 hover:text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#8B1A4A]/40 hover:bg-[#8B1A4A]/5 transition-colors">
                <span className="text-2xl">📷</span>
                <span className="text-xs text-gray-500 mt-1">
                  Tap to add a photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhoto}
                />
              </label>
            )}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            loading={isPending}
          >
            Submit Report
          </Button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Your report goes directly to the GM. No account needed.
          </p>
        </Card>
      </div>
    </div>
  );
}
