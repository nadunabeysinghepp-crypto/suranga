import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-pad py-16">
      <div className="max-w-xl">
        <h1 className="text-4xl font-extrabold">404</h1>
        <p className="mt-3 text-slate-600">
          Page not found. Go back to home or request a quote.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90"
          >
            Home
          </Link>
          <Link
            to="/quote"
            className="px-5 py-3 rounded-xl border font-semibold hover:bg-slate-50"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
