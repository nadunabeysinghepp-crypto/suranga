import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";
import { 
  Check, X, Star, RefreshCw, Trash2, Eye, EyeOff, 
  Pin, PinOff, Calendar, User, MessageSquare
} from "lucide-react";

export default function ReviewsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "pending", "approved", "featured"

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await adminHttp.get("/api/admin/reviews");
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

  const patch = async (id, changes) => {
    try {
      await adminHttp.patch(`/api/admin/reviews/${id}`, changes);
      setItems((prev) =>
        prev.map((x) => (x._id === id ? { ...x, ...changes } : x))
      );
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await adminHttp.delete(`/api/admin/reviews/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  const filteredItems = items.filter((item) => {
    switch (activeFilter) {
      case "pending": return !item.approved;
      case "approved": return item.approved;
      case "featured": return item.featured;
      default: return true;
    }
  });

  const stats = {
    total: items.length,
    approved: items.filter(r => r.approved).length,
    pending: items.filter(r => !r.approved).length,
    featured: items.filter(r => r.featured).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm border">
                <MessageSquare className="w-6 h-6 text-slate-700" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Customer Reviews
              </h1>
            </div>
            <p className="text-slate-600 max-w-2xl">
              Manage and moderate customer feedback. Approve, feature, or hide reviews to showcase the best testimonials.
            </p>
          </div>
          <button
            onClick={load}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold 
                       bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 
                       shadow-sm hover:shadow active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Reviews
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Reviews" 
            value={stats.total} 
            icon={<MessageSquare className="w-5 h-5" />}
            color="bg-blue-50 border-blue-100"
          />
          <StatCard 
            title="Approved" 
            value={stats.approved} 
            icon={<Check className="w-5 h-5" />}
            color="bg-emerald-50 border-emerald-100"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={<ClockIcon />}
            color="bg-amber-50 border-amber-100"
          />
          <StatCard 
            title="Featured" 
            value={stats.featured} 
            icon={<Star className="w-5 h-5" />}
            color="bg-purple-50 border-purple-100"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "all", label: "All Reviews", count: stats.total },
            { id: "pending", label: "Pending", count: stats.pending },
            { id: "approved", label: "Approved", count: stats.approved },
            { id: "featured", label: "Featured", count: stats.featured },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200
                ${activeFilter === filter.id 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-white text-slate-700 border hover:bg-slate-50 hover:border-slate-300"
                }`}
            >
              {filter.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === filter.id 
                  ? "bg-white/20" 
                  : "bg-slate-100"
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {err ? (
          <div className="mb-6 border border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 
                        text-red-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold">Failed to Load Reviews</div>
                <div className="text-sm mt-1">{err}</div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
              <RefreshCw className="absolute inset-0 m-auto w-8 h-8 text-slate-900 animate-pulse" />
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading reviews...</p>
          </div>
        ) : null}

        {/* Reviews Grid */}
        {!loading && (
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            {filteredItems.map((r) => (
              <ReviewCard 
                key={r._id} 
                review={r} 
                onPatch={patch} 
                onDelete={del} 
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 ? (
          <div className="mt-12 text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No reviews found
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {activeFilter !== "all" 
                ? `There are no ${activeFilter} reviews at the moment.`
                : "No reviews have been submitted yet."}
            </p>
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-4 px-4 py-2 text-sm font-medium text-slate-900 hover:text-slate-700"
              >
                View all reviews →
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ReviewCard({ review, onPatch, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300
        ${review.featured ? "ring-2 ring-purple-200" : ""}
        ${!review.approved ? "opacity-90" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with user info */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 
                        flex items-center justify-center text-slate-900 font-bold shadow-sm">
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900">{review.name}</h3>
              {review.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full 
                               bg-purple-100 text-purple-800 text-xs font-semibold">
                  <Pin className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {review.rating}/5
              </span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
          ${review.approved 
            ? "bg-emerald-100 text-emerald-800" 
            : "bg-amber-100 text-amber-800"}`}>
          {review.approved ? "✓ Approved" : "⏳ Pending"}
        </div>
      </div>

      {/* Review message */}
      <div className="mb-6">
        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
          "{review.message}"
        </p>
      </div>

      {/* Star rating visualization */}
      <div className="flex items-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < review.rating
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-slate-600 font-medium">
          {review.rating} out of 5
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
        <ActionButton
          onClick={() => onPatch(review._id, { approved: !review.approved })}
          icon={review.approved ? <EyeOff className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          label={review.approved ? "Unapprove" : "Approve"}
          variant="primary"
          hoverEffect={isHovered}
        />
        
        <ActionButton
          onClick={() => onPatch(review._id, { featured: !review.featured })}
          icon={review.featured ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
          label={review.featured ? "Unfeature" : "Feature"}
          variant="secondary"
          hoverEffect={isHovered}
        />
        
        <ActionButton
          onClick={() => onDelete(review._id)}
          icon={<Trash2 className="w-4 h-4" />}
          label="Delete"
          variant="danger"
          hoverEffect={isHovered}
        />
      </div>
    </div>
  );
}

function ActionButton({ onClick, icon, label, variant = "primary", hoverEffect }) {
  const variants = {
    primary: "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    secondary: "border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700",
    danger: "border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold 
                 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]
                 ${variants[variant]}`}
    >
      <span className={`transition-transform duration-300 ${hoverEffect ? "scale-110" : "scale-100"}`}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${color} border rounded-xl p-4 shadow-sm hover:shadow transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-white/80">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}