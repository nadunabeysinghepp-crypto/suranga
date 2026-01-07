import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";
import { 
  Truck, 
  Plus, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  MapPin, 
  Eye,
  EyeOff,
  DollarSign,
  AlertCircle,
  Save,
  X,
  Check,
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  Sparkles,
  Shield,
  Calendar,
  Users
} from "lucide-react";

export default function DeliveryAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [area, setArea] = useState("");
  const [feeLkr, setFeeLkr] = useState(300);
  const [active, setActive] = useState(true);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async (showRefresh = false) => {
    setErr("");
    if (showRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const { data } = await adminHttp.get("/api/admin/delivery-areas");
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load delivery areas");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    load();
  }, []);

  const reset = () => {
    setArea("");
    setFeeLkr(300);
    setActive(true);
    setEditId(null);
  };

  const startEdit = (x) => {
    setEditId(x._id);
    setArea(x.area || "");
    setFeeLkr(x.feeLkr || 0);
    setActive(!!x.active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!area.trim()) return setErr("Area name is required.");
    if (Number(feeLkr) < 0) return setErr("Fee must be 0 or more.");

    setSaving(true);
    try {
      const payload = { area, feeLkr: Number(feeLkr), active };
      if (editId) {
        await adminHttp.put(`/api/admin/delivery-areas/${editId}`, payload);
      } else {
        await adminHttp.post("/api/admin/delivery-areas", payload);
      }

      await load();
      reset();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Are you sure you want to delete this delivery area? This action cannot be undone.")) return;
    try {
      await adminHttp.delete(`/api/admin/delivery-areas/${id}`);
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = search === "" || 
      item.area.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || 
      (activeFilter === "active" && item.active) ||
      (activeFilter === "inactive" && !item.active);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: items.length,
    active: items.filter(x => x.active).length,
    inactive: items.filter(x => !x.active).length,
    totalFee: items.reduce((sum, x) => sum + x.feeLkr, 0),
    avgFee: items.length > 0 ? Math.round(items.reduce((sum, x) => sum + x.feeLkr, 0) / items.length) : 0,
    highestFee: items.length > 0 ? Math.max(...items.map(x => x.feeLkr)) : 0
  };

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-amber-50 text-red-800 text-sm font-bold border border-red-200 mb-3">
            <Sparkles className="w-4 h-4" />
            Delivery Management
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Delivery Areas & Fees</h1>
          <p className="text-slate-600 mt-2">Manage Matale District delivery coverage for customer quotes</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => load(true)}
            disabled={isRefreshing}
            className="group px-4 py-2.5 rounded-xl border-2 border-slate-200 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {err && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 animate-shake">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="text-sm text-red-700">{err}</div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Areas" value={stats.total} icon={<MapPin className="w-5 h-5" />} color="blue" />
        <StatCard title="Active" value={stats.active} icon={<Eye className="w-5 h-5" />} color="green" />
        <StatCard title="Avg. Fee" value={`LKR ${stats.avgFee}`} icon={<DollarSign className="w-5 h-5" />} color="amber" />
        <StatCard title="Highest Fee" value={`LKR ${stats.highestFee}`} icon={<TrendingUp className="w-5 h-5" />} color="purple" />
        <StatCard title="Total Value" value={`LKR ${stats.totalFee.toLocaleString()}`} icon={<Shield className="w-5 h-5" />} color="red" />
      </div>

      {/* Add/Edit Form */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden mb-8">
        <div className="border-b border-slate-200 p-6 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500">
                {editId ? <Edit2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editId ? "Edit Delivery Area" : "Add Delivery Area"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {editId ? "Update area details and pricing" : "Create a new delivery area for Matale District"}
                </p>
              </div>
            </div>
            
            {editId && (
              <button
                type="button"
                onClick={reset}
                className="group px-4 py-2 rounded-xl border border-slate-200 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <form onSubmit={submit} className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Area Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent transition-all"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., Dambulla / Matale / Sigiriya"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Delivery Fee (LKR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent transition-all"
                  value={feeLkr}
                  onChange={(e) => setFeeLkr(e.target.value)}
                  placeholder="Enter fee amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Status
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${active ? 'bg-green-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${active ? 'left-5' : 'left-1'}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {active ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                    <span className="font-medium text-slate-900">
                      {active ? "Active" : "Hidden"}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button
            disabled={saving}
            className="mt-8 group px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                {editId ? 'Update Area' : 'Add Delivery Area'}
                <Save className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search delivery areas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeFilter === "all"
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-red-50 text-slate-700 hover:bg-red-100'
            }`}
          >
            All Areas
          </button>
          <button
            onClick={() => setActiveFilter("active")}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeFilter === "active"
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-green-50 text-slate-700 hover:bg-green-100'
            }`}
          >
            Active Only
          </button>
          <button
            onClick={() => setActiveFilter("inactive")}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeFilter === "inactive"
                ? 'bg-slate-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Hidden Only
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && !isRefreshing ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4 animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Loading Areas...</h3>
          <p className="text-slate-600 mt-2">Fetching your delivery areas data</p>
        </div>
      ) : (
        <>
          {/* Delivery Areas Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((x) => (
              <DeliveryAreaCard
                key={x._id}
                area={x}
                onEdit={() => startEdit(x)}
                onDelete={() => del(x._id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-600 mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {search || activeFilter !== "all" ? "No Areas Found" : "No Delivery Areas Yet"}
              </h3>
              <p className="text-slate-600 mt-2 max-w-md mx-auto">
                {search || activeFilter !== "all" 
                  ? "Try adjusting your search or filter to find delivery areas."
                  : "Get started by adding your first delivery area above."}
              </p>
              {(search || activeFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("all");
                  }}
                  className="mt-4 px-6 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Summary */}
          {filteredItems.length > 0 && (
            <div className="mt-8 p-6 border border-slate-200 rounded-2xl bg-gradient-to-r from-slate-50 to-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100">
                    <Truck className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Delivery Coverage Summary</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Matale District • {filteredItems.length} areas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{stats.active} active areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Updated just now</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5 hover:shadow-sm transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="text-sm text-slate-600 mt-1">{title}</div>
        </div>
      </div>
    </div>
  );
}

function DeliveryAreaCard({ area, onEdit, onDelete }) {
  return (
    <div className="group border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-slate-900 truncate">{area.area}</h3>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                area.active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {area.active ? (
                  <>
                    <Eye className="w-3 h-3" />
                    Active
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3" />
                    Hidden
                  </>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                Delivery Fee
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">LKR {area.feeLkr.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Delivery charge</div>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            Matale District
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="border border-slate-200 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-500">Orders Today</div>
            <div className="text-sm font-bold text-slate-900">3</div>
          </div>
          <div className="border border-slate-200 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-500">Avg. Distance</div>
            <div className="text-sm font-bold text-slate-900">15 km</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 group/edit px-4 py-2.5 rounded-lg border border-slate-200 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4 group-hover/edit:text-blue-600 transition-colors" />
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="flex-1 group/delete px-4 py-2.5 rounded-lg border border-red-200 font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4 group-hover/delete:text-red-600 transition-colors" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Add to your global CSS
const styles = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
`;