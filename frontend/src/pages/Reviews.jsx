import { useEffect, useState } from "react";
import http from "../api/adminHttp";
import ReviewCard from "../components/ReviewCard";

export default function Reviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // form
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await http.get("/api/reviews");
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    if (!name.trim()) return setErr("Please enter your name.");
    if (!message.trim()) return setErr("Please write your review message.");

    setSending(true);
    try {
      const { data } = await http.post("/api/reviews", {
        name,
        rating: Number(rating),
        message,
      });

      setOkMsg(
        `✅ Thank you! Your review has been submitted. Reference: ${data?.id || "N/A"}`
      );
      setMessage("");
      setRating(5);
      // keep name for convenience
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to submit review");
    } finally {
      setSending(false);
    }
  };

  // Calculate average rating
  const averageRating = items.length > 0 
    ? (items.reduce((sum, item) => sum + item.rating, 0) / items.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/20 via-white to-red-50/10">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-red-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-gradient-to-br from-amber-100/30 to-yellow-100/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-pad py-16 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-amber-100 text-red-800 text-sm font-semibold border border-red-200/50 shadow-sm mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Customer Reviews • Verified Feedback • Dambulla
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Reviews</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Real feedback from customers of Suranga Printers – Fast Print (Dambulla). 
              See what others say about our quality, speed, and service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={load}
                className="px-6 py-3.5 rounded-xl border border-red-200/50 font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300 shadow-sm flex items-center gap-2"
              >
                <span>🔄</span>
                <span>Refresh Reviews</span>
              </button>
              
              {items.length > 0 && (
                <div className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 font-semibold border border-amber-200/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-2xl font-bold">{averageRating}</span>
                    <span className="text-sm">/ 5 • {items.length} reviews</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container-pad py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-red-100/10 to-amber-100/10 blur-3xl -z-10"></div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submit Review Form */}
          <div className="lg:col-span-1">
            <div className="border border-red-200/50 rounded-3xl bg-gradient-to-br from-white to-amber-50/30 shadow-xl overflow-hidden sticky top-8">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
                    <span className="text-red-600 text-lg">✍️</span>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900">Leave a Review</div>
                    <div className="text-sm text-slate-600">Share your experience</div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  Your review helps others make better decisions. All reviews are moderated before being published.
                </p>

                {err && (
                  <div className="mb-6 border border-red-200/50 rounded-2xl bg-gradient-to-r from-red-50/80 to-pink-50/80 text-red-700 p-4 backdrop-blur-sm">
                    <div className="font-bold flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Please fix the following:</span>
                    </div>
                    <div className="text-sm mt-1">{err}</div>
                  </div>
                )}

                {okMsg && (
                  <div className="mb-6 border border-emerald-200/50 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-green-50/80 text-emerald-700 p-4 backdrop-blur-sm">
                    <div className="font-bold flex items-center gap-2">
                      <span>✅</span>
                      <span>Thank you!</span>
                    </div>
                    <div className="text-sm mt-1">{okMsg}</div>
                  </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-900 mb-2 block">
                      Your Name *
                    </label>
                    <input
                      className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-900 mb-2 block">
                      Rating
                    </label>
                    <div className="relative">
                      <select
                        className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm appearance-none transition-all duration-300"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value={5}>★★★★★ Excellent (5)</option>
                        <option value={4}>★★★★☆ Very Good (4)</option>
                        <option value={3}>★★★☆☆ Good (3)</option>
                        <option value={2}>★★☆☆☆ Fair (2)</option>
                        <option value={1}>★☆☆☆☆ Poor (1)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <span className="text-slate-400">▼</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-900 mb-2 block">
                      Your Review *
                    </label>
                    <textarea
                      className="w-full border border-red-200/50 rounded-2xl px-4 py-3 min-h-[140px] outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell others about the quality, speed, price, service, delivery experience…"
                    />
                  </div>

                  <button
                    disabled={sending}
                    className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Submitting…</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Review</span>
                        <span className="text-lg">→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-sm text-red-600 font-semibold mb-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  CUSTOMER FEEDBACK
                </div>
                <div className="font-bold text-2xl text-slate-900">Customer Reviews</div>
                <div className="text-slate-600 mt-1">
                  Real experiences from our valued customers
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={load}
                  className="px-4 py-2.5 rounded-xl border border-red-200/50 font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300 shadow-sm flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                
                {items.length > 0 && (
                  <div className="text-sm font-semibold px-3 py-2 rounded-full bg-gradient-to-r from-red-50 to-amber-50 text-red-800">
                    {items.length} Reviews
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-amber-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-slate-600 font-medium">Loading reviews...</div>
                </div>
              </div>
            )}

            {/* Reviews Grid */}
            {!loading && items.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {items.map((r) => (
                  <div key={r._id} className="group hover:-translate-y-1 transition-transform duration-300">
                    <ReviewCard r={r} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex flex-col items-center gap-6 px-8 py-12 rounded-3xl bg-gradient-to-br from-amber-50/50 to-red-50/50 border border-amber-200/50 max-w-md mx-auto">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
                    <span className="text-3xl">💬</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xl mb-2">No reviews yet</div>
                    <div className="text-slate-600">
                      Be the first to share your experience with Suranga Printers
                    </div>
                  </div>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-md transition-shadow"
                  >
                    Write First Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-red-200/50 bg-gradient-to-br from-red-50/50 via-amber-50/30 to-yellow-50/30 p-8 md:p-12">
            {/* Background decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-red-200/20 to-amber-200/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  READY TO SHARE YOUR EXPERIENCE?
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900">
                  Your feedback helps others <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">make better choices</span>
                </div>
                <div className="text-lg text-slate-700">
                  Whether you had a great experience or suggestions for improvement, 
                  we value your honest feedback.
                </div>
              </div>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}