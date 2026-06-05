"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";

function Stars({ rating = 5, className = "" }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < rating ? "text-[#f4b522]" : "text-black/15"}>
          ★
        </span>
      ))}
    </div>
  );
}

function StarsInput({ rating, onChange }) {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const isActive = hoverRating ? starValue <= hoverRating : starValue <= rating;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="text-4xl transition duration-150 hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
            style={{ color: isActive ? "#f4b522" : "rgba(0, 0, 0, 0.1)" }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function TestimonialsSection() {
  const { isUser, loading: authLoading } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 5.0,
    totalReviews: 0,
    ratingRows: [
      { stars: 5, label: "5 stars", count: 0, percent: 0 },
      { stars: 4, label: "4 stars", count: 0, percent: 0 },
      { stars: 3, label: "3 stars", count: 0, percent: 0 },
      { stars: 2, label: "2 stars", count: 0, percent: 0 },
      { stars: 1, label: "1 star", count: 0, percent: 0 },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await api.get("/reviews");
      if (response.data?.success) {
        setReviews(response.data.reviews || []);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!formTitle.trim()) {
      setSubmitError("Please enter a title for your review.");
      return;
    }
    if (!formBody.trim()) {
      setSubmitError("Please write a description for your review.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/reviews", {
        rating: formRating,
        title: formTitle,
        body: formBody,
      });

      if (response.data?.success) {
        setSubmitSuccess(true);
        setFormRating(5);
        setFormTitle("");
        setFormBody("");
        await fetchReviews();
        setTimeout(() => {
          setIsFormOpen(false);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        setSubmitError(response.data?.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Review submission failed:", error);
      setSubmitError(
        error.response?.data?.message || "An error occurred while submitting. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const positiveReviews = reviews.filter((r) => r.rating >= 4);

  return (
    <section id="testimonials" className="border-y border-black/8 bg-white text-black overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">WHAT OUR CUSTOMERS SAY</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-5xl">Customer Reviews</h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Stars rating={Math.round(stats.averageRating)} className="text-3xl leading-none sm:text-4xl" />
            <p className="text-2xl font-semibold tracking-tight text-black/78 sm:text-[2rem]">
              {stats.averageRating.toFixed(2)} / 5
            </p>
          </div>
          <p className="mt-3 text-sm text-black/55 sm:text-base">Based on {stats.totalReviews} reviews</p>
        </div>

        {/* Rating Statistics Dashboard */}
        <div className="mt-10 rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-6">
          <div className="space-y-4">
            {stats.ratingRows.map((row) => (
              <div key={row.stars} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">
                <Stars rating={row.stars} className="text-lg sm:text-xl w-[90px] sm:w-[110px]" />
                <div className="h-4 rounded-full bg-black/8 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-black transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(row.percent, row.count > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <span className="w-7 text-right text-sm text-black/55 sm:w-8">{row.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center border-t border-black/5 pt-6">
            {!authLoading && (
              <>
                {isUser ? (
                  <>
                    <button
                      onClick={() => setIsFormOpen(!isFormOpen)}
                      className="w-full rounded bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black/90 hover:shadow-lg sm:max-w-3xl cursor-pointer"
                    >
                      {isFormOpen ? "Cancel Review" : "Write a review"}
                    </button>

                    {/* Expandable Review Form */}
                    <div
                      className={`w-full sm:max-w-3xl transition-all duration-300 ease-in-out overflow-hidden ${isFormOpen ? "mt-6 max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-black/5 bg-neutral-50 p-5 sm:p-6 shadow-inner">
                        <h3 className="text-xl font-semibold text-black tracking-tight border-b border-black/5 pb-2">Share Your Experience</h3>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-black/70">Rating</label>
                          <StarsInput rating={formRating} onChange={setFormRating} />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="review-title" className="block text-sm font-medium text-black/70">Review Title</label>
                          <input
                            type="text"
                            id="review-title"
                            placeholder="e.g., Absolutely gorgeous template!"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder-black/30 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="review-body" className="block text-sm font-medium text-black/70">Review Details</label>
                          <textarea
                            id="review-body"
                            rows={4}
                            placeholder="Tell us what you liked about your digital invitation..."
                            value={formBody}
                            onChange={(e) => setFormBody(e.target.value)}
                            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder-black/30 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            required
                          />
                        </div>

                        {submitError && (
                          <div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-100">
                            ⚠ {submitError}
                          </div>
                        )}

                        {submitSuccess && (
                          <div className="rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 border border-emerald-100">
                            ✓ Thank you! Your review has been submitted successfully.
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full rounded-xl bg-black py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/90 disabled:bg-black/40 cursor-pointer"
                        >
                          {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-black/55 font-medium">
                      Please{" "}
                      <a href="/signin" className="underline font-semibold text-black hover:text-black/80 transition-colors">
                        Sign In
                      </a>{" "}
                      to share your review.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Linear Animated Carousel for Positive Reviews (Rating >= 4) */}
        {!loading && positiveReviews.length > 0 && (
          <div className="mt-16 -mx-5 sm:-mx-8 lg:-mx-10 relative">
            <div className="text-center mb-6 px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6a3137]">Featured Testimonials</p>
            </div>

            {/* Infinite Marquee Container */}
            <div className="marquee-mask w-full overflow-hidden py-4 flex select-none">
              <div
                className="animate-marquee flex gap-6 pr-6"
                style={{ "--marquee-speed": `${Math.max(30, positiveReviews.length * 8)}s` }}
              >
                {/* First loop of cards */}
                {positiveReviews.map((rev, idx) => (
                  <div
                    key={`marquee-1-${rev._id || idx}`}
                    className="w-[320px] sm:w-[360px] shrink-0 rounded-[1.4rem] border border-black/8 bg-[#fafafc]/90 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.02)] backdrop-blur-sm transition duration-300 hover:shadow-[0_15px_45px_rgba(0,0,0,0.06)] hover:border-black/15 hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-xs font-semibold text-[#6a3137]">
                          {rev.initials}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="text-sm font-semibold tracking-tight text-black/86 leading-none">
                              {rev.name}
                            </h4>
                            {rev.verified && (
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-700 leading-none whitespace-nowrap shrink-0">
                                Verified
                              </span>
                            )}
                          </div>
                          <Stars rating={rev.rating} className="mt-1 text-xs" />
                        </div>
                      </div>
                      <time className="text-xs text-black/40">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <h5 className="mt-4 text-base font-semibold tracking-tight text-black">{rev.title}</h5>
                    <p className="mt-2 text-sm text-black/60 line-clamp-3 leading-relaxed whitespace-normal wrap-break-word">
                      {rev.body}
                    </p>
                  </div>
                ))}

                {/* Second loop of cards (exact clone for seamless loop) */}
                {positiveReviews.map((rev, idx) => (
                  <div
                    key={`marquee-2-${rev._id || idx}`}
                    className="w-[320px] sm:w-[360px] shrink-0 rounded-[1.4rem] border border-black/8 bg-[#fafafc]/90 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.02)] backdrop-blur-sm transition duration-300 hover:shadow-[0_15px_45px_rgba(0,0,0,0.06)] hover:border-black/15 hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-xs font-semibold text-[#6a3137]">
                          {rev.initials}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="text-sm font-semibold tracking-tight text-black/86 leading-none">
                              {rev.name}
                            </h4>
                            {rev.verified && (
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-700 leading-none whitespace-nowrap shrink-0">
                                Verified
                              </span>
                            )}
                          </div>
                          <Stars rating={rev.rating} className="mt-1 text-xs" />
                        </div>
                      </div>
                      <time className="text-xs text-black/40">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <h5 className="mt-4 text-base font-semibold tracking-tight text-black">{rev.title}</h5>
                    <p className="mt-2 text-sm text-black/60 line-clamp-3 leading-relaxed whitespace-normal wrap-break-word">
                      {rev.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Customer Reviews List (Full scrolling list below) */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold tracking-tight text-black sm:text-2xl mb-6 border-b border-black/5 pb-3">
            All Reviews ({reviews.length})
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black" />
              <p className="text-sm text-black/50">Loading customer reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-black/10 rounded-2xl">
              <p className="text-black/50 text-sm">No reviews yet. Be the first to write a review!</p>
            </div>
          ) : (
            <>
              <div className="space-y-5 max-h-[800px] overflow-y-auto pr-2 hide-scrollbar">
                {reviews.slice(0, visibleCount).map((rev) => (
                  <article
                    key={rev._id}
                    className="rounded-[1.4rem] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.03)] sm:p-6 transition duration-200 hover:border-black/15"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/6 text-sm font-semibold text-[#6a3137] shrink-0">
                          {rev.initials}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-black/86 leading-tight">
                              {rev.name}
                            </h3>
                            {rev.verified && (
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-emerald-700 whitespace-nowrap shrink-0">
                                Verified
                              </span>
                            )}
                          </div>
                          <Stars rating={rev.rating} className="mt-1 text-base" />
                        </div>
                      </div>
                      <time className="text-xs sm:text-sm text-black/48 sm:text-right shrink-0">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    <h4 className="mt-4 text-xl font-semibold tracking-tight text-black">{rev.title}</h4>
                    <p className="mt-3 max-w-4xl text-base leading-7 text-black/68 whitespace-pre-line wrap-break-word">
                      {rev.body}
                    </p>
                  </article>
                ))}
              </div>

              {visibleCount < reviews.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="rounded-full border border-black bg-transparent hover:bg-black hover:text-white px-8 py-3 text-sm font-semibold tracking-wider transition duration-300 active:scale-95 cursor-pointer"
                  >
                    Load More Reviews
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}