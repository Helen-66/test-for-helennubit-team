"use client";

import { useState } from "react";
import AddToDiaryModal from "@/components/AddToDiaryModal";
import { isDiaryEntryExists } from "@/lib/diary";

export default function AddToDiaryButton({
  movieId,
  movieTitle,
  posterPath,
}: {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
}) {
  const [showModal, setShowModal] = useState(false);
  const [added, setAdded] = useState(() =>
    typeof window !== "undefined" ? isDiaryEntryExists(movieId) : false
  );

  const handleSuccess = () => {
    setAdded(true);
    setShowModal(false);
  };

  if (added) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-900/50 text-green-400 rounded-lg text-sm">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        已添加到日记
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors text-sm font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        添加到日记
      </button>
      {showModal && (
        <AddToDiaryModal
          movieId={movieId}
          movieTitle={movieTitle}
          posterPath={posterPath}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
