export default function ReviewCard({ r }) {
  return (
    <div className="border rounded-2xl p-5 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-extrabold text-slate-900">{r.name}</div>
          <div className="text-xs text-slate-600 mt-1">
            {new Date(r.createdAt).toLocaleDateString()}
          </div>
        </div>
        <Stars value={r.rating} />
      </div>

      <p className="mt-3 text-sm text-slate-700 whitespace-pre-line">{r.message}</p>

      {r.featured ? (
        <div className="mt-4 inline-flex text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-800">
          Featured
        </div>
      ) : null}
    </div>
  );
}

function Stars({ value = 5 }) {
  const v = Math.max(1, Math.min(5, Number(value) || 5));
  return (
    <div className="flex gap-1" aria-label={`${v} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < v ? "text-amber-500" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  );
}
