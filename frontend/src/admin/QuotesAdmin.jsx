// import { useEffect, useState } from "react";
// import adminHttp from "../api/adminHttp";
// import { 
//   Filter, 
//   RefreshCw, 
//   Eye, 
//   Download, 
//   Phone, 
//   Mail, 
//   Printer,
//   Truck,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Package,
//   ChevronDown,
//   ChevronUp,
//   MessageSquare,
//   FileText,
//   Calendar,
//   User,
//   DollarSign,
//   MapPin,
//   X,
//   Edit,
//   Save,
//   Sparkles
// } from "lucide-react";

// const STATUSES = ["Received", "Designing", "Printing", "Ready", "OutForDelivery", "Completed", "Cancelled"];

// export default function QuotesAdmin() {
//   const [items, setItems] = useState([]);
//   const [status, setStatus] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [search, setSearch] = useState("");
//   const [expandedId, setExpandedId] = useState(null);
//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const [noteValue, setNoteValue] = useState("");
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   const load = async (showRefresh = false) => {
//     setErr("");
//     if (showRefresh) setIsRefreshing(true);
//     else setLoading(true);
    
//     try {
//       const url = status === "All" 
//         ? "/api/admin/quotes" 
//         : `/api/admin/quotes?status=${encodeURIComponent(status)}`;
//       const { data } = await adminHttp.get(url);
//       setItems(data || []);
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Failed to load quotes/orders");
//     } finally {
//       setLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     setIsVisible(true);
//     load();
//   }, [status]);

//   const update = async (id, patch) => {
//     try {
//       const { data } = await adminHttp.patch(`/api/admin/quotes/${id}`, patch);
//       setItems((prev) => prev.map((x) => (x._id === id ? data : x)));
//       return true;
//     } catch (e) {
//       alert(e?.response?.data?.message || "Update failed");
//       return false;
//     }
//   };

//   const updateStatus = async (id, newStatus) => {
//     const success = await update(id, { status: newStatus });
//     if (success) {
//       // Optional: Add visual feedback
//     }
//   };

//   const saveNote = async (id) => {
//     if (noteValue.trim() !== items.find(q => q._id === id)?.adminNote) {
//       const success = await update(id, { adminNote: noteValue });
//       if (success) {
//         setEditingNoteId(null);
//       }
//     } else {
//       setEditingNoteId(null);
//     }
//   };

//   const filteredItems = items.filter(q => {
//     if (!search) return true;
//     const searchLower = search.toLowerCase();
//     return (
//       q.customerName.toLowerCase().includes(searchLower) ||
//       q.phone.includes(search) ||
//       q.serviceName.toLowerCase().includes(searchLower) ||
//       q.status.toLowerCase().includes(searchLower)
//     );
//   });

//   const getStatusColor = (status) => {
//     const colors = {
//       Received: 'bg-blue-100 text-blue-700 border-blue-200',
//       Designing: 'bg-purple-100 text-purple-700 border-purple-200',
//       Printing: 'bg-amber-100 text-amber-700 border-amber-200',
//       Ready: 'bg-green-100 text-green-700 border-green-200',
//       OutForDelivery: 'bg-indigo-100 text-indigo-700 border-indigo-200',
//       Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
//       Cancelled: 'bg-red-100 text-red-700 border-red-200'
//     };
//     return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       Received: <Package className="w-4 h-4" />,
//       Designing: <Edit className="w-4 h-4" />,
//       Printing: <Printer className="w-4 h-4" />,
//       Ready: <CheckCircle className="w-4 h-4" />,
//       OutForDelivery: <Truck className="w-4 h-4" />,
//       Completed: <CheckCircle className="w-4 h-4" />,
//       Cancelled: <X className="w-4 h-4" />
//     };
//     return icons[status] || <Package className="w-4 h-4" />;
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const stats = {
//     total: items.length,
//     filtered: filteredItems.length,
//     received: items.filter(x => x.status === "Received").length,
//     inProgress: items.filter(x => x.status === "Designing" || x.status === "Printing").length,
//     delivery: items.filter(x => x.status === "OutForDelivery").length,
//     completed: items.filter(x => x.status === "Completed").length
//   };

//   return (
//     <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
//         <div>
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-amber-50 text-red-800 text-sm font-bold border border-red-200 mb-3">
//             <Sparkles className="w-4 h-4" />
//             Quotes & Orders Management
//           </div>
//           <h1 className="text-3xl font-bold text-slate-900">Quotes / Orders</h1>
//           <p className="text-slate-600 mt-2">Update status, add admin notes, and manage customer files.</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button 
//             onClick={() => load(true)}
//             disabled={isRefreshing}
//             className="group px-4 py-2.5 rounded-xl border-2 border-slate-200 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
//           >
//             <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
//             {isRefreshing ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>
//       </div>

//       {/* Filters & Search */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="flex-1">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search by name, phone, service, status..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
//             />
//             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//           </div>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//           <div className="relative">
//             <select
//               className="appearance-none px-4 py-3 pr-10 rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all bg-white"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//             >
//               <option value="All">All Statuses</option>
//               {STATUSES.map((s) => (
//                 <option key={s} value={s}>{s}</option>
//               ))}
//             </select>
//             <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
//           </div>
          
//           <button className="px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors flex items-center gap-2">
//             <Download className="w-4 h-4" />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Error Message */}
//       {err && (
//         <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 animate-shake">
//           <div className="flex items-start gap-3">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//             <div className="text-sm text-red-700">{err}</div>
//           </div>
//         </div>
//       )}

//       {/* Stats Bar */}
//       <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
//         <StatCard title="Total" value={stats.total} color="slate" />
//         <StatCard title="Received" value={stats.received} color="blue" />
//         <StatCard title="In Progress" value={stats.inProgress} color="amber" />
//         <StatCard title="Delivery" value={stats.delivery} color="purple" />
//         <StatCard title="Completed" value={stats.completed} color="green" />
//         <StatCard title="Filtered" value={stats.filtered} color="red" />
//       </div>

//       {/* Loading State */}
//       {loading && !isRefreshing ? (
//         <div className="text-center py-12">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4 animate-pulse">
//             <RefreshCw className="w-8 h-8 animate-spin" />
//           </div>
//           <h3 className="text-xl font-bold text-slate-900">Loading Quotes...</h3>
//           <p className="text-slate-600 mt-2">Fetching your orders and quotes data</p>
//         </div>
//       ) : (
//         <>
//           {/* Quotes List */}
//           <div className="space-y-4">
//             {filteredItems.map((q) => (
//               <div key={q._id} className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
//                 {/* Quote Header */}
//                 <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
//                   <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-3">
//                         <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(q.status)}`}>
//                           {getStatusIcon(q.status)}
//                           {q.status}
//                         </div>
//                         <div className="text-xs text-slate-500">
//                           <Clock className="inline w-3 h-3 mr-1" />
//                           {formatDate(q.createdAt)}
//                         </div>
//                       </div>
                      
//                       <div className="mt-3">
//                         <div className="flex items-center gap-3">
//                           <div className="font-bold text-lg text-slate-900">{q.customerName}</div>
//                           <div className="flex items-center gap-1 text-slate-600">
//                             <Phone className="w-4 h-4" />
//                             <span className="text-sm">{q.phone}</span>
//                           </div>
//                         </div>
                        
//                         <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-700">
//                           <span className="flex items-center gap-1">
//                             <Printer className="w-4 h-4" />
//                             {q.serviceName}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Package className="w-4 h-4" />
//                             Qty: {q.quantity}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Truck className="w-4 h-4" />
//                             {q.fulfillment}
//                           </span>
//                           {q.fulfillment === "Delivery" && q.deliveryArea && (
//                             <span className="flex items-center gap-1">
//                               <MapPin className="w-4 h-4" />
//                               {q.deliveryArea}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
//                         className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
//                       >
//                         {expandedId === q._id ? (
//                           <>
//                             <ChevronUp className="w-4 h-4" />
//                             <span className="text-sm">Collapse</span>
//                           </>
//                         ) : (
//                           <>
//                             <Eye className="w-4 h-4" />
//                             <span className="text-sm">View Details</span>
//                           </>
//                         )}
//                       </button>
                      
//                       <a
//                         href={`tel:${q.phone}`}
//                         className="p-2 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-600 transition-colors"
//                         title="Call Customer"
//                       >
//                         <Phone className="w-4 h-4" />
//                       </a>
                      
//                       <a
//                         href={`https://wa.me/${q.phone.replace(/\D/g, '')}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="p-2 rounded-lg border border-green-200 hover:bg-green-50 text-green-600 transition-colors"
//                         title="Message on WhatsApp"
//                       >
//                         <MessageSquare className="w-4 h-4" />
//                       </a>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Collapsible Content */}
//                 <div className={`${expandedId === q._id ? 'block' : 'hidden'} p-5 space-y-5 animate-fade-in`}>
//                   {/* Status Update Section */}
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900 mb-3">Update Status</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {STATUSES.map((s) => (
//                         <button
//                           key={s}
//                           onClick={() => updateStatus(q._id, s)}
//                           className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                             q.status === s
//                               ? 'bg-red-600 text-white shadow-sm'
//                               : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
//                           }`}
//                         >
//                           {s}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Details Grid */}
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div className="space-y-3">
//                       <DetailItem label="Customer Info">
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-2">
//                             <User className="w-4 h-4 text-slate-500" />
//                             <span>{q.customerName}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Phone className="w-4 h-4 text-slate-500" />
//                             <span>{q.phone}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <MessageSquare className="w-4 h-4 text-slate-500" />
//                             <span>Contact: {q.contactMethod}</span>
//                           </div>
//                         </div>
//                       </DetailItem>

//                       <DetailItem label="Order Details">
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-2">
//                             <Printer className="w-4 h-4 text-slate-500" />
//                             <span>{q.serviceName}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Package className="w-4 h-4 text-slate-500" />
//                             <span>Quantity: {q.quantity}</span>
//                           </div>
//                           {q.fulfillment === "Delivery" && (
//                             <div className="flex items-center gap-2">
//                               <Truck className="w-4 h-4 text-slate-500" />
//                               <span>Delivery to: {q.deliveryArea}</span>
//                             </div>
//                           )}
//                           {q.fulfillment === "Delivery" && q.deliveryFeeLkr > 0 && (
//                             <div className="flex items-center gap-2">
//                               <DollarSign className="w-4 h-4 text-slate-500" />
//                               <span>Fee: LKR {q.deliveryFeeLkr.toLocaleString()}</span>
//                             </div>
//                           )}
//                         </div>
//                       </DetailItem>
//                     </div>

//                     <div className="space-y-3">
//                       <DetailItem label="Specifications">
//                         <div className="space-y-1">
//                           <div><span className="text-slate-600">Size:</span> {q.size || "-"}</div>
//                           <div><span className="text-slate-600">Color:</span> {q.color || "-"}</div>
//                           <div><span className="text-slate-600">Paper:</span> {q.paper || "-"}</div>
//                           <div><span className="text-slate-600">Finishing:</span> {q.finishing || "-"}</div>
//                         </div>
//                       </DetailItem>

//                       {q.notes && (
//                         <DetailItem label="Customer Notes">
//                           <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
//                             {q.notes}
//                           </div>
//                         </DetailItem>
//                       )}
//                     </div>
//                   </div>

//                   {/* Admin Note */}
//                   <div>
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className="text-sm font-semibold text-slate-900">Admin Notes</h3>
//                       {editingNoteId !== q._id && (
//                         <button
//                           onClick={() => {
//                             setEditingNoteId(q._id);
//                             setNoteValue(q.adminNote || "");
//                           }}
//                           className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
//                         >
//                           <Edit className="w-3 h-3" />
//                           Edit Note
//                         </button>
//                       )}
//                     </div>
                    
//                     {editingNoteId === q._id ? (
//                       <div className="space-y-2">
//                         <textarea
//                           className="w-full border border-red-200 rounded-xl px-4 py-3 min-h-[100px] focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
//                           value={noteValue}
//                           onChange={(e) => setNoteValue(e.target.value)}
//                           placeholder="Add price, paper details, deadline, delivery notes..."
//                         />
//                         <div className="flex justify-end gap-2">
//                           <button
//                             onClick={() => setEditingNoteId(null)}
//                             className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             onClick={() => saveNote(q._id)}
//                             className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
//                           >
//                             <Save className="w-3 h-3" />
//                             Save Note
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="min-h-[60px] border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
//                         {q.adminNote ? (
//                           <div className="text-sm text-slate-700">{q.adminNote}</div>
//                         ) : (
//                           <div className="text-sm text-slate-500 italic">No admin notes yet. Click edit to add.</div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Files */}
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900 mb-3">Files</h3>
//                     {q.files && q.files.length ? (
//                       <div className="flex flex-wrap gap-2">
//                         {q.files.map((f, idx) => (
//                           <a
//                             key={idx}
//                             href={`http://localhost:5000${f.path}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
//                           >
//                             <FileText className="w-4 h-4 text-slate-500 group-hover:text-red-600" />
//                             <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
//                               {f.filename}
//                             </span>
//                             <Eye className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//                           </a>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-sm text-slate-500 italic">No files uploaded.</div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Empty State */}
//             {!loading && filteredItems.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-600 mb-4">
//                   <Package className="w-8 h-8" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-900">
//                   {search ? "No Matching Quotes" : "No Quotes Found"}
//                 </h3>
//                 <p className="text-slate-600 mt-2 max-w-md mx-auto">
//                   {search 
//                     ? "Try adjusting your search or filter to find quotes."
//                     : "There are no quotes matching the selected status filter."}
//                 </p>
//                 {(search || status !== "All") && (
//                   <button
//                     onClick={() => {
//                       setSearch("");
//                       setStatus("All");
//                     }}
//                     className="mt-4 px-6 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
//                   >
//                     Clear Filters
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function StatCard({ title, value, color }) {
//   const colorClasses = {
//     slate: 'bg-slate-100 text-slate-700',
//     blue: 'bg-blue-100 text-blue-700',
//     amber: 'bg-amber-100 text-amber-700',
//     purple: 'bg-purple-100 text-purple-700',
//     green: 'bg-green-100 text-green-700',
//     red: 'bg-red-100 text-red-700',
//   };

//   return (
//     <div className="border border-slate-200 rounded-xl bg-white p-3 text-center hover:shadow-sm transition-shadow duration-300">
//       <div className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses[color]} mb-2`}>
//         {title}
//       </div>
//       <div className="text-2xl font-bold text-slate-900">{value}</div>
//     </div>
//   );
// }

// function DetailItem({ label, children }) {
//   return (
//     <div className="border border-slate-200 rounded-xl p-4 bg-white">
//       <div className="text-xs font-semibold text-slate-900 mb-2 uppercase tracking-wider">
//         {label}
//       </div>
//       <div className="text-sm text-slate-700">
//         {children}
//       </div>
//     </div>
//   );
// }

// // Add to your global CSS
// const styles = `
// @keyframes shake {
//   0%, 100% { transform: translateX(0); }
//   10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
//   20%, 40%, 60%, 80% { transform: translateX(2px); }
// }

// @keyframes fade-in {
//   from {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// .animate-shake {
//   animation: shake 0.5s ease-in-out;
// }

// .animate-fade-in {
//   animation: fade-in 0.3s ease-out forwards;
// }
// `;
import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";
import API_BASE from "../lib/apiBase";
import {
  Filter,
  RefreshCw,
  Eye,
  Download,
  Phone,
  Printer,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  MapPin,
  X,
  Edit,
  Save,
  Sparkles,
  DollarSign,
  User
} from "lucide-react";

const STATUSES = [
  "Received",
  "Designing",
  "Printing",
  "Ready",
  "OutForDelivery",
  "Completed",
  "Cancelled",
];

export default function QuotesAdmin() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteValue, setNoteValue] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = async (refresh = false) => {
    setErr("");
    refresh ? setIsRefreshing(true) : setLoading(true);
    try {
      const url =
        status === "All"
          ? "/api/admin/quotes"
          : `/api/admin/quotes?status=${encodeURIComponent(status)}`;
      const { data } = await adminHttp.get(url);
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load quotes");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const update = async (id, patch) => {
    try {
      const { data } = await adminHttp.patch(`/api/admin/quotes/${id}`, patch);
      setItems((prev) => prev.map((x) => (x._id === id ? data : x)));
    } catch (e) {
      alert("Update failed");
    }
  };

  const filteredItems = items.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      q.customerName.toLowerCase().includes(s) ||
      q.phone.includes(search) ||
      q.serviceName.toLowerCase().includes(s) ||
      q.status.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-800 font-bold text-sm mb-2">
            <Sparkles className="w-4 h-4" />
            Quotes Management
          </div>
          <h1 className="text-3xl font-bold">Quotes / Orders</h1>
        </div>

        <button
          onClick={() => load(true)}
          className="px-4 py-2 rounded-xl border flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {err && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="inline w-4 h-4 mr-2 text-red-600" />
          {err}
        </div>
      )}

      {/* LIST */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((q) => (
            <div
              key={q._id}
              className="border rounded-2xl bg-white overflow-hidden"
            >
              {/* HEADER */}
              <div className="p-4 bg-slate-50 flex justify-between items-start">
                <div>
                  <div className="font-bold">{q.customerName}</div>
                  <div className="text-sm text-slate-600">{q.phone}</div>
                </div>

                <button
                  onClick={() =>
                    setExpandedId(expandedId === q._id ? null : q._id)
                  }
                >
                  {expandedId === q._id ? <ChevronUp /> : <Eye />}
                </button>
              </div>

              {/* DETAILS */}
              {expandedId === q._id && (
                <div className="p-4 space-y-4">
                  {/* STATUS */}
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => update(q._id, { status: s })}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          q.status === s
                            ? "bg-red-600 text-white"
                            : "border"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* FILES – FIXED */}
                  <div>
                    <div className="font-semibold mb-2">Files</div>
                    {q.files?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {q.files.map((f, i) => (
                          <a
                            key={i}
                            href={`${API_BASE}${f.path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3 py-2 border rounded-lg"
                          >
                            <FileText className="w-4 h-4" />
                            {f.filename}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">
                        No files uploaded
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
