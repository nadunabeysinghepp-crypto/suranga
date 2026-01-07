import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";
import { 
  Plus, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Star,
  Package,
  Grid,
  Search,
  Filter,
  Eye,
  EyeOff,
  Save,
  Tag,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Printer,
  Users,
  Award
} from "lucide-react";

const CATEGORIES = ["Business", "Marketing", "Events", "Custom", "General", "Large Format", "Photo Printing", "Documents"];

export default function ServicesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Business");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async (showRefresh = false) => {
    setErr("");
    if (showRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const { data } = await adminHttp.get("/api/admin/services");
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load services");
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
    setName("");
    setCategory("Business");
    setDescription("");
    setFeatured(false);
    setActive(true);
    setEditId(null);
  };

  const startEdit = (x) => {
    setEditId(x._id);
    setName(x.name || "");
    setCategory(x.category || "Business");
    setDescription(x.description || "");
    setFeatured(!!x.featured);
    setActive(!!x.active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return setErr("Service name is required.");

    setSaving(true);
    try {
      const payload = { name, category, description, featured, active };
      if (editId) {
        await adminHttp.put(`/api/admin/services/${editId}`, payload);
      } else {
        await adminHttp.post("/api/admin/services", payload);
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
    if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) return;
    try {
      await adminHttp.delete(`/api/admin/services/${id}`);
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = search === "" || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: items.length,
    active: items.filter(x => x.active).length,
    featured: items.filter(x => x.featured).length,
    categories: [...new Set(items.map(x => x.category))].length
  };

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-amber-50 text-red-800 text-sm font-bold border border-red-200 mb-3">
            <Sparkles className="w-4 h-4" />
            Services Management
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Printing Services</h1>
          <p className="text-slate-600 mt-2">Manage and organize services shown to customers</p>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Services" value={stats.total} icon={<Grid className="w-5 h-5" />} color="blue" />
        <StatCard title="Active" value={stats.active} icon={<Eye className="w-5 h-5" />} color="green" />
        <StatCard title="Featured" value={stats.featured} icon={<Star className="w-5 h-5" />} color="amber" />
        <StatCard title="Categories" value={stats.categories} icon={<Tag className="w-5 h-5" />} color="purple" />
      </div>

      {/* Add/Edit Service Form */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden mb-8">
        <div className="border-b border-slate-200 p-6 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500">
                {editId ? <Edit2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editId ? "Edit Service" : "Add New Service"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {editId ? "Update existing service details" : "Create a new service for customers"}
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
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Service Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Printer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Business Cards Printing"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 appearance-none outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Description
              </label>
              <textarea
                className="w-full border border-slate-200 rounded-xl px-4 py-3 min-h-[120px] outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the service, include key features and benefits..."
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${featured ? 'bg-red-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${featured ? 'left-5' : 'left-1'}`} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${featured ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="font-medium text-slate-900">Featured Service</span>
              </div>
            </label>

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
                <span className="font-medium text-slate-900">Active</span>
              </div>
            </label>
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
                {editId ? 'Update Service' : 'Create Service'}
                <Save className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Services List */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div className="border-b border-slate-200 p-6 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100">
                <Package className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">All Services</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {filteredItems.length} {filteredItems.length === 1 ? 'service' : 'services'} found
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none"
                />
              </div>

              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none bg-white"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Loading State */}
          {loading && !isRefreshing ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Loading Services...</h3>
              <p className="text-slate-600 mt-2">Fetching your services data</p>
            </div>
          ) : (
            <>
              {/* Services Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((x) => (
                  <ServiceCard
                    key={x._id}
                    service={x}
                    onEdit={() => startEdit(x)}
                    onDelete={() => del(x._id)}
                  />
                ))}
              </div>

              {/* Empty State */}
              {!loading && filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-600 mb-4">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {search || categoryFilter !== "all" ? "No Services Found" : "No Services Yet"}
                  </h3>
                  <p className="text-slate-600 mt-2 max-w-md mx-auto">
                    {search || categoryFilter !== "all" 
                      ? "Try adjusting your search or filter to find services."
                      : "Get started by creating your first service above."}
                  </p>
                  {(search || categoryFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setCategoryFilter("all");
                      }}
                      className="mt-4 px-6 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
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

function ServiceCard({ service, onEdit, onDelete }) {
  const getCategoryColor = (category) => {
    const colors = {
      Business: 'bg-blue-100 text-blue-700',
      Marketing: 'bg-green-100 text-green-700',
      Events: 'bg-purple-100 text-purple-700',
      Custom: 'bg-amber-100 text-amber-700',
      'Large Format': 'bg-red-100 text-red-700',
      'Photo Printing': 'bg-pink-100 text-pink-700',
      Documents: 'bg-slate-100 text-slate-700',
      General: 'bg-slate-100 text-slate-700'
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="group border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-slate-900 truncate">{service.name}</h3>
              {service.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                <Tag className="w-3 h-3" />
                {service.category || "General"}
              </span>
              
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                service.active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {service.active ? (
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
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {service.description ? (
          <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed mb-4">
            {service.description}
          </p>
        ) : (
          <p className="text-sm text-slate-500 italic mb-4">No description provided</p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Popular Service</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>Quality Print</span>
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

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
`;