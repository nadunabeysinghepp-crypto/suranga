import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/adminHttp";
import { API_BASE } from "../lib/apiBase";

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
      } catch {
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

  const filtered =
    cat === "All" ? items : items.filter(x => x.category === cat);

  if (loading) return <p className="p-10">Loading…</p>;
  if (err) return <p className="p-10 text-red-600">{err}</p>;

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-4xl font-bold text-center">Our Portfolio</h1>

      <div className="flex justify-center gap-3">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl border ${
              cat === c ? "bg-red-600 text-white" : ""
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
            />
            <div className="p-5">
              <h3 className="font-bold">{x.title}</h3>
              {x.description && (
                <p className="text-sm text-slate-600 mt-2">
                  {x.description}
                </p>
              )}
              <Link
                to="/quote"
                className="text-red-600 font-semibold mt-3 inline-block"
              >
                Request Quote →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
