import { useEffect, useState } from "react";
import http from "../api/adminHttp";
import ServiceCard from "../components/ServiceCard";
import { Link } from "react-router-dom";

const PHONE = "0662285425";
const WHATSAPP = "94772285425"; // change if needed

export default function Services() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/api/services");
        setItems(data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load services");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-gradient-to-b from-amber-50/30 via-white to-red-50/20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-red-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-amber-100/30 to-yellow-100/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-pad py-16 md:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-amber-100 text-red-800 text-sm font-semibold border border-red-200/50 shadow-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Suranga Printers • Services • Matale District Delivery
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                Explore Our <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Printing Services</span>
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-amber-400 rounded-full"></span>
                </span>
              </h1>

              <p className="text-lg text-slate-700 leading-relaxed">
                Elevate your brand with professional business cards, brochures, posters, book printing, binding, photo printing, and dye sublimation services. Send your details and get a quick quote.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/quote"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
                >
                  Get a Quote
                </Link>

                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center gap-2"
                >
                  <span>WhatsApp Now</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Fast Reply</span>
                </a>

                <a
                  href={`tel:${PHONE}`}
                  className="px-6 py-3.5 rounded-xl border border-red-200 font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300 shadow-sm"
                >
                  Call Directly
                </a>
              </div>

              {/* Service status badges */}
              <div className="flex flex-wrap gap-3 pt-6">
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-amber-50 text-slate-700 border border-red-100/50">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Loading services…
                  </span>
                ) : null}

                {err ? (
                  <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200/50">
                    {err}
                  </span>
                ) : null}

                {!loading && !err ? (
                  <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200/50">
                    <span className="font-bold">{items.length}</span> premium services available
                  </span>
                ) : null}
              </div>
            </div>

            {/* Right side premium card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-200/40 via-amber-200/30 to-yellow-100/40 blur-3xl rounded-[3rem]"></div>
              <div className="relative rounded-[2.5rem] border border-red-200/50 bg-gradient-to-br from-white to-amber-50/30 shadow-xl p-8 md:p-10">
                <div className="absolute top-6 left-6">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                <div className="space-y-6 mt-8">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">Fast Response</div>
                    <p className="text-slate-600 mt-2 leading-relaxed">
                      Share size, quantity, paper type and finishing details. We'll reply promptly with competitive pricing and clear timelines.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <MiniStat title="Quality" desc="Premium finishing" icon="✨" />
                    <MiniStat title="Speed" desc="Same/next day" icon="⚡" />
                    <MiniStat title="Delivery" desc="Matale District" icon="🚚" />
                  </div>

                  <Link
                    to="/quote"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md group"
                  >
                    <span>Request Quote</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 rounded-2xl rotate-12"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-red-400/10 to-amber-400/10 rounded-2xl -rotate-12"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES LIST SECTION */}
      <section className="container-pad py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-red-100/10 to-amber-100/10 blur-3xl -z-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-sm text-amber-600 font-semibold">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                OUR PORTFOLIO
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">All Printing Services</h2>
              <p className="text-slate-600">Browse our complete range of professional printing solutions</p>
            </div>
            
            {!loading && !err && items.length > 0 && (
              <div className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-amber-50 text-amber-800 border border-amber-200/50">
                {items.length} Services
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-amber-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="text-slate-600 font-medium">Loading premium services...</div>
              </div>
            </div>
          ) : err ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50">
                <div className="text-2xl">⚠️</div>
                <div className="text-left">
                  <div className="font-bold text-red-700">Unable to load services</div>
                  <div className="text-sm text-red-600 mt-1">{err}</div>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-red-50 border border-amber-200 font-semibold text-amber-800 hover:shadow-md transition-shadow"
              >
                Try Again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-10 rounded-3xl bg-gradient-to-br from-amber-50/50 to-red-50/50 border border-amber-200/50 max-w-md mx-auto">
                <div className="text-4xl">📄</div>
                <div className="font-bold text-slate-900 text-xl">No Services Found</div>
                <div className="text-slate-600">Check back soon for our latest printing services</div>
                <Link
                  to="/quote"
                  className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-md transition-shadow"
                >
                  Request Custom Quote
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it) => (
                <div 
                  key={it._id} 
                  className="group hover:-translate-y-1 transition-transform duration-300"
                >
                  <ServiceCard item={it} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container-pad py-16">
        <div className="relative overflow-hidden rounded-3xl border border-red-200/50 bg-gradient-to-br from-red-50/50 via-amber-50/30 to-yellow-50/30 p-8 md:p-12">
          {/* Background decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-red-200/20 to-amber-200/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                READY TO PRINT?
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                Don't see what you need? <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">We can help!</span>
              </div>
              <div className="text-lg text-slate-700">
                Contact us directly for custom printing solutions, bulk orders, or specialized requests.
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/quote"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
              >
                Get Custom Quote
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center gap-2"
              >
                <span>WhatsApp</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Fast</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ title, desc, icon }) {
  return (
    <div className="border border-red-100/50 rounded-2xl p-4 bg-white/80 backdrop-blur-sm hover:shadow-md hover:border-red-200 transition-all duration-300">
      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        <span>{title}</span>
      </div>
      <div className="text-xs text-slate-600 mt-2">{desc}</div>
    </div>
  );
}