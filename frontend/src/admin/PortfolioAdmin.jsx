import { useEffect, useMemo, useState } from "react";
import adminHttp from "../api/adminHttp";
import { 
  Image, 
  Plus, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  Star,
  Eye,
  EyeOff,
  Filter,
  Search,
  Grid,
  Tag,
  AlertCircle,
  Save,
  X,
  TrendingUp,
  ChevronRight,
  Upload,
  Camera,
  Check,
  Sparkles,
  Award,
  Layers
} from "lucide-react";

export default function PortfolioAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [tag, setTag] = useState("Popular");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // edit state
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async (showRefresh = false) => {
    setErr("");
    if (showRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const { data } = await adminHttp.get("/api/admin/portfolio");
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load portfolio");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    load();
  }, []);

  const categories = useMemo(() => {
    const base = ["Business", "Marketing", "Books", "Documents", "Photo", "Sublimation", "General"];
    const set = new Set([...base, ...items.map((x) => x.category).filter(Boolean)]);
    return Array.from(set);
  }, [items]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("Marketing");
    setTag("Popular");
    setDescription("");
    setFeatured(false);
    setActive(true);
    setImage(null);
    setImagePreview(null);
    setEditId(null);
  };

  const startEdit = (x) => {
    setEditId(x._id);
    setTitle(x.title || "");
    setCategory(x.category || "General");
    setTag(x.tag || "");
    setDescription(x.description || "");
    setFeatured(!!x.featured);
    setActive(!!x.active);
    setImage(null);
    setImagePreview(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (id) => {
    if (!confirm("Are you sure you want to delete this portfolio item? This action cannot be undone.")) return;
    try {
      await adminHttp.delete(`/api/admin/portfolio/${id}`);
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!title.trim()) return setErr("Title is required.");
    if (!editId && !image) return setErr("Image is required for a new item.");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("category", category);
      fd.append("tag", tag);
      fd.append("description", description);
      fd.append("featured", String(featured));
      fd.append("active", String(active));
      if (image) fd.append("image", image);

      if (editId) {
        await adminHttp.put(`/api/admin/portfolio/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await adminHttp.post(`/api/admin/portfolio`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await load();
      resetForm();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = search === "" || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
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
            Portfolio Gallery Management
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Portfolio Manager</h1>
          <p className="text-slate-600 mt-2">Upload real print photos to showcase your quality work to customers</p>
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
        <StatCard title="Total Items" value={stats.total} icon={<Grid className="w-5 h-5" />} color="blue" />
        <StatCard title="Active" value={stats.active} icon={<Eye className="w-5 h-5" />} color="green" />
        <StatCard title="Featured" value={stats.featured} icon={<Star className="w-5 h-5" />} color="amber" />
        <StatCard title="Categories" value={stats.categories} icon={<Layers className="w-5 h-5" />} color="purple" />
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
                  {editId ? "Edit Portfolio Item" : "Add New Portfolio Item"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {editId ? "Update portfolio item details" : "Showcase your printing quality with photos"}
                </p>
              </div>
            </div>
            
            {editId && (
              <button
                type="button"
                onClick={resetForm}
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
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Business Cards (Matte Lamination)"
              />
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
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Tag
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent transition-all"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Popular / Fast / Premium / Custom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {editId ? "Replace Image (optional)" : "Image"}{!editId && <span className="text-red-500"> *</span>}
              </label>
              
              {/* Image Upload Area */}
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={handleImageChange}
                />
                
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
                    {imagePreview || (editId && items.find(x => x._id === editId)?.imageUrl) ? (
                      <div className="relative">
                        <img
                          src={imagePreview || `http://localhost:5000${items.find(x => x._id === editId)?.imageUrl}`}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="text-white text-sm font-medium flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Change Image
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-red-50 inline-flex mb-3">
                          <Upload className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-slate-700">
                          <span className="font-medium text-red-600">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          JPG, PNG, WebP (Max 5MB)
                        </div>
                      </>
                    )}
                  </div>
                </label>
                
                <div className="text-xs text-slate-600 mt-2">
                  Tip: upload clear photo with good lighting for premium look.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Description
            </label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-4 py-3 min-h-[120px] outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note about paper type, finish, size, or special features…"
            />
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
                <span className="font-medium text-slate-900">Featured Item</span>
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
                <span className="font-medium text-slate-900">Visible to Customers</span>
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
                {editId ? 'Update Portfolio Item' : 'Upload to Portfolio'}
                <Save className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Portfolio Gallery */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div className="border-b border-slate-200 p-6 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100">
                <Image className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Portfolio Gallery</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search portfolio..."
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
                  {categories.map((cat) => (
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
              <h3 className="text-xl font-bold text-slate-900">Loading Portfolio...</h3>
              <p className="text-slate-600 mt-2">Fetching your portfolio items</p>
            </div>
          ) : (
            <>
              {/* Portfolio Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((x) => (
                  <PortfolioCard
                    key={x._id}
                    item={x}
                    onEdit={() => startEdit(x)}
                    onDelete={() => del(x._id)}
                  />
                ))}
              </div>

              {/* Empty State */}
              {!loading && filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-600 mb-4">
                    <Image className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {search || categoryFilter !== "all" ? "No Items Found" : "Portfolio Empty"}
                  </h3>
                  <p className="text-slate-600 mt-2 max-w-md mx-auto">
                    {search || categoryFilter !== "all" 
                      ? "Try adjusting your search or filter to find portfolio items."
                      : "Showcase your printing work by adding portfolio items above."}
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

function PortfolioCard({ item, onEdit, onDelete }) {
  const getCategoryColor = (category) => {
    const colors = {
      Business: 'bg-blue-100 text-blue-700',
      Marketing: 'bg-green-100 text-green-700',
      Books: 'bg-amber-100 text-amber-700',
      Documents: 'bg-slate-100 text-slate-700',
      Photo: 'bg-purple-100 text-purple-700',
      Sublimation: 'bg-pink-100 text-pink-700',
      General: 'bg-slate-100 text-slate-700'
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="group border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={`http://localhost:5000${item.imageUrl}`}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {item.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-white text-xs font-medium backdrop-blur-sm">
            <Award className="w-3 h-3" />
            {item.category}
          </span>
        </div>

        {/* Active Status */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            item.active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {item.active ? (
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

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg text-slate-900 truncate flex-1">{item.title}</h3>
        </div>

        {item.tag && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
              {item.tag}
            </span>
          </div>
        )}

        {item.description && (
          <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        )}

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

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
`;