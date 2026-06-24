"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { addDiaryEntry } from "@/lib/diary";

interface AddToDiaryModalProps {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddToDiaryModal({
  movieId,
  movieTitle,
  posterPath,
  onClose,
  onSuccess,
}: AddToDiaryModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [watchedDate, setWatchedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = () => {
    if (rating === 0) return;
    addDiaryEntry({
      movieId,
      movieTitle,
      posterPath,
      rating,
      review,
      watchedDate,
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-1">添加到日记</h2>
        <p className="text-gray-400 text-sm mb-4">{movieTitle}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">评分</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">观看日期</label>
            <input
              type="date"
              value={watchedDate}
              onChange={(e) => setWatchedDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">短评（可选）</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              placeholder="写下你的观影感受..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
