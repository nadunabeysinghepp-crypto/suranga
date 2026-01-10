// import { useEffect, useMemo, useState } from "react";
// import http from "../api/adminHttp";
// import { Link } from "react-router-dom";

// const PHONE = "0662285425";
// const WHATSAPP = "94772285425";

// export default function Portfolio() {
//   const [items, setItems] = useState([]);
//   const [cat, setCat] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     (async () => {
//       setErr("");
//       setLoading(true);
//       try {
//         const { data } = await http.get("/api/portfolio");
//         setItems(data || []);
//       } catch (e) {
//         setErr(e?.response?.data?.message || "Failed to load portfolio");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const categories = useMemo(() => {
//     const set = new Set(items.map((x) => x.category).filter(Boolean));
//     return ["All", ...Array.from(set).sort()];
//   }, [items]);

//   const filtered = useMemo(() => {
//     if (cat === "All") return items;
//     return items.filter((x) => x.category === cat);
//   }, [items, cat]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50/20 via-white to-red-50/10">
//       <div className="container-pad py-12 md:py-16 relative">
//         {/* Background decorative elements */}
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-100/20 to-amber-100/20 rounded-full blur-3xl -z-10"></div>
//         <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-100/20 to-yellow-100/20 rounded-full blur-3xl -z-10"></div>
        
//         <div className="relative z-10">
//           {/* HEADER */}
//           <div className="text-center max-w-3xl mx-auto mb-12">
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-amber-100 text-red-800 text-sm font-semibold border border-red-200/50 shadow-sm mb-6">
//               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//               Premium Printing Portfolio • Real Projects • Dambulla
//             </div>
            
//             <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
//               Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Printing Portfolio</span>
//             </h1>
            
//             <p className="text-lg text-slate-600 leading-relaxed mb-8">
//               Real print work from Suranga Printers – Fast Print (Dambulla). See our quality and craftsmanship.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <Link
//                 to="/quote"
//                 className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
//               >
//                 Get a Quote
//               </Link>
//               <a
//                 href={`https://wa.me/${WHATSAPP}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center gap-2"
//               >
//                 <span>WhatsApp Portfolio</span>
//                 <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Fast</span>
//               </a>
//             </div>
//           </div>

//           {/* FILTER */}
//           <div className="mb-10">
//             <div className="flex items-center justify-between gap-4 mb-4">
//               <div>
//                 <div className="inline-flex items-center gap-2 text-sm text-red-600 font-semibold mb-2">
//                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                   FILTER BY CATEGORY
//                 </div>
//                 <div className="text-sm text-slate-600">
//                   {cat === "All" ? "Showing all portfolio items" : `Filtering by: ${cat}`}
//                 </div>
//               </div>
              
//               {!loading && !err && (
//                 <div className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-amber-50 text-amber-800 border border-amber-200/50">
//                   {filtered.length} Items
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-wrap gap-3">
//               {categories.map((c) => (
//                 <button
//                   key={c}
//                   onClick={() => setCat(c)}
//                   className={`px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-300 ${
//                     cat === c
//                       ? "bg-gradient-to-r from-red-600 to-amber-600 text-white border-transparent shadow-md"
//                       : "border-red-200/50 bg-white/80 hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 hover:shadow-sm"
//                   }`}
//                 >
//                   {c}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* LOADING STATE */}
//           {loading && (
//             <div className="flex justify-center items-center py-20">
//               <div className="flex flex-col items-center gap-4">
//                 <div className="relative">
//                   <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-amber-400 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <div className="text-slate-600 font-medium">Loading portfolio...</div>
//               </div>
//             </div>
//           )}

//           {/* ERROR STATE */}
//           {err && (
//             <div className="text-center py-20">
//               <div className="inline-flex flex-col items-center gap-4 px-8 py-10 rounded-3xl bg-gradient-to-r from-red-50/80 to-pink-50/80 border border-red-200/50 max-w-md mx-auto">
//                 <div className="text-4xl">⚠️</div>
//                 <div className="font-bold text-red-700 text-xl">Unable to load portfolio</div>
//                 <div className="text-red-600">{err}</div>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 font-semibold text-red-800 hover:shadow-md transition-shadow"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* GRID */}
//           {!loading && !err && filtered.length > 0 && (
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filtered.map((x) => (
//                 <div
//                   key={x._id}
//                   className="group border border-red-200/50 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-amber-50/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
//                 >
//                   {/* Image Container */}
//                   <div className="relative h-56 overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10"></div>
//                     <img
//                       src={`http://localhost:5000${x.imageUrl}`}
//                       alt={x.title}
//                       className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
//                       loading="lazy"
//                     />
                    
//                     {/* Category Badge */}
//                     {x.category && (
//                       <div className="absolute top-4 left-4 z-20">
//                         <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600/90 to-amber-600/90 text-white backdrop-blur-sm">
//                           {x.category}
//                         </span>
//                       </div>
//                     )}

//                     {/* Tag Badge */}
//                     {x.tag && (
//                       <div className="absolute top-4 right-4 z-20">
//                         <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-white backdrop-blur-sm">
//                           {x.tag}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="p-6">
//                     <div className="mb-4">
//                       <div className="font-bold text-lg text-slate-900 leading-snug mb-2">
//                         {x.title}
//                       </div>
                      
//                       {x.description ? (
//                         <p className="text-sm text-slate-600 line-clamp-2">
//                           {x.description}
//                         </p>
//                       ) : null}
//                     </div>

//                     <div className="flex items-center justify-between pt-4 border-t border-red-100/50">
//                       <div className="flex items-center gap-2">
//                         <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                         <div className="text-sm text-slate-600">Suranga Printers</div>
//                       </div>
                      
//                       <Link
//                         to="/quote"
//                         className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 group"
//                       >
//                         <span>Request Quote</span>
//                         <span className="group-hover:translate-x-1 transition-transform">→</span>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* EMPTY STATE */}
//           {!loading && !err && filtered.length === 0 && (
//             <div className="text-center py-20">
//               <div className="inline-flex flex-col items-center gap-6 px-8 py-12 rounded-3xl bg-gradient-to-br from-amber-50/50 to-red-50/50 border border-amber-200/50 max-w-md mx-auto">
//                 <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
//                   <span className="text-3xl">📂</span>
//                 </div>
//                 <div>
//                   <div className="font-bold text-slate-900 text-xl mb-2">No portfolio items found</div>
//                   <div className="text-slate-600">
//                     {cat === "All" 
//                       ? "No portfolio items have been added yet."
//                       : `No items found in "${cat}" category.`
//                     }
//                   </div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <button
//                     onClick={() => setCat("All")}
//                     className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-md transition-shadow"
//                   >
//                     View All Categories
//                   </button>
//                   <Link
//                     to="/quote"
//                     className="px-6 py-3 rounded-xl border border-red-200/50 bg-white/80 font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300"
//                   >
//                     Get Custom Quote
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* CTA SECTION */}
//           {!loading && !err && filtered.length > 0 && (
//             <div className="mt-16">
//               <div className="relative overflow-hidden rounded-3xl border border-red-200/50 bg-gradient-to-br from-red-50/50 via-amber-50/30 to-yellow-50/30 p-8 md:p-12">
//                 {/* Background decorative circles */}
//                 <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-red-200/20 to-amber-200/20 rounded-full blur-2xl"></div>
//                 <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-2xl"></div>
                
//                 <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
//                   <div className="space-y-4 max-w-2xl">
//                     <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
//                       <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                       READY TO CREATE YOURS?
//                     </div>
//                     <div className="text-3xl md:text-4xl font-bold text-slate-900">
//                       Inspired by our work? <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Let's create yours!</span>
//                     </div>
//                     <div className="text-lg text-slate-700">
//                       Get a custom quote for your project with the same quality and attention to detail.
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-4">
//                     <Link
//                       to="/quote"
//                       className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
//                     >
//                       Get Custom Quote
//                     </Link>
//                     <a
//                       href={`https://wa.me/${WHATSAPP}`}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center gap-2"
//                     >
//                       <span>WhatsApp</span>
//                       <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Fast</span>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import http from "../api/adminHttp";
import API_BASE from "../lib/apiBase";
import { Link } from "react-router-dom";

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/api/portfolio");
        setItems(data || []);
      } catch (e) {
        setErr("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map(x => x.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = cat === "All" ? items : items.filter(x => x.category === cat);

  if (loading) return <p className="p-10">Loading…</p>;
  if (err) return <p className="p-10 text-red-600">{err}</p>;

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-4xl font-bold text-center">Our Portfolio</h1>

      <div className="flex gap-3 justify-center">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl ${
              cat === c ? "bg-red-600 text-white" : "border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map(x => (
          <div key={x._id} className="border rounded-2xl overflow-hidden">
            <img
              src={`${API_BASE}${x.imageUrl}`}
              alt={x.title}
              className="h-56 w-full object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <h3 className="font-bold">{x.title}</h3>
              {x.description && (
                <p className="text-sm text-slate-600 mt-2">{x.description}</p>
              )}
              <Link to="/quote" className="text-red-600 font-semibold mt-3 inline-block">
                Request Quote →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
