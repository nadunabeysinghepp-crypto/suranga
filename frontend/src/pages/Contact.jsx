import { useState } from "react";
import { Link } from "react-router-dom";

const SHOP_NAME = "Suranga Printers – Fast Print";
const PHONE_DISPLAY = "0662 285 425";
const PHONE_TEL = "0662285425";
const WHATSAPP = "94711017979";
const ADDRESS = "Kandy - Jaffna Hwy, Dambulla";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello ${SHOP_NAME},\n\nName: ${name || "-"}\nPhone: ${phone || "-"}\n\nMessage:\n${msg || "-"}`
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/20 via-white to-red-50/10">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-red-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-gradient-to-br from-amber-100/30 to-yellow-100/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-pad py-16 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-amber-100 text-red-800 text-sm font-semibold border border-red-200/50 shadow-sm mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Contact Us • Fast Response • Matale District
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Touch</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Fast support via WhatsApp or call. Pickup or Matale District delivery.
              We're here to help with all your printing needs.
            </p>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container-pad py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-red-100/10 to-amber-100/10 blur-3xl -z-10"></div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT INFO COLUMN */}
          <div className="space-y-8">
            {/* Contact Info Card */}
            <div className="border border-red-200/50 rounded-3xl bg-gradient-to-br from-white to-amber-50/30 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
                    <span className="text-red-600 text-lg">🏪</span>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900">{SHOP_NAME}</div>
                    <div className="text-sm text-slate-600">Fast Print • Dambulla</div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">📍</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Address</div>
                      <div className="text-sm text-slate-600 mt-1">{ADDRESS}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">📞</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Phone</div>
                      <a 
                        className="text-sm text-red-600 hover:text-red-700 font-medium mt-1 inline-block hover:underline transition-colors"
                        href={`tel:${PHONE_TEL}`}
                      >
                        {PHONE_DISPLAY}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">💬</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">WhatsApp</div>
                      <a
                        className="text-sm text-red-600 hover:text-red-700 font-medium mt-1 inline-block hover:underline transition-colors"
                        href={`https://wa.me/${WHATSAPP}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="border border-red-200/50 rounded-3xl bg-gradient-to-br from-white to-amber-50/30 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
                    <span className="text-red-600 text-lg">⏰</span>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900">Business Hours</div>
                    <div className="text-sm text-slate-600">When we're available</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Row k="Monday – Saturday" v="8:30 AM – 7:00 PM" />
                  <Row k="Sunday" v="9:00 AM – 1:00 PM" />
                  <Row k="Holidays" v="Open (Shorter Hours)" />
                </div>
              </div>
            </div>

            {/* Quick Notes Card */}
            <div className="border border-red-200/50 rounded-3xl bg-gradient-to-br from-white to-amber-50/30 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
                    <span className="text-red-600 text-lg">💡</span>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900">Quick Tips</div>
                    <div className="text-sm text-slate-600">For best service</div>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs">✓</span>
                    </div>
                    <span className="text-slate-700">Best file format: PDF (print-ready with bleed marks)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs">✓</span>
                    </div>
                    <span className="text-slate-700">Share Matale area + landmark for delivery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs">✓</span>
                    </div>
                    <span className="text-slate-700">Mention "URGENT" for fast turnaround jobs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* MAP + FORM COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map Section */}
            <div className="border border-red-200/50 rounded-3xl bg-gradient-to-br from-white to-amber-50/30 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
                    <span className="text-red-600 text-lg">🗺️</span>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900">Find Us on the Map</div>
                    <div className="text-sm text-slate-600">{ADDRESS}</div>
                  </div>
                </div>
              </div>
              
              <div className="h-[320px] bg-slate-100 relative">
                <iframe
                  title="Suranga Printers Map"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    "Suranga Printers Fast Print, " + ADDRESS
                  )}&output=embed&zoom=15`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="border border-red-200/50 rounded-3xl bg-gradient-to-br from-white to-amber-50/30 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
                    <span className="text-red-600 text-lg">📝</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-slate-900">Send an Inquiry</div>
                    <div className="text-sm text-slate-600">This will open WhatsApp with your message</div>
                  </div>
                  
                  {sent && (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200/50">
                      Ready to send ✓
                    </span>
                  )}
                </div>

                <form onSubmit={submit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-slate-900 mb-2 block">
                        Your Name
                      </label>
                      <input
                        className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-900 mb-2 block">
                        Phone Number
                      </label>
                      <input
                        className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-900 mb-2 block">
                      Your Message
                    </label>
                    <textarea
                      className="w-full border border-red-200/50 rounded-2xl px-4 py-3 min-h-[140px] outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Service needed, quantity, size, paper type, delivery area, special instructions..."
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center gap-2"
                    >
                      <span>💬</span>
                      <span>Send via WhatsApp</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Fast</span>
                    </button>
                    
                    <a
                      className="px-6 py-3.5 rounded-xl border border-red-200/50 bg-white/80 backdrop-blur-sm font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300 shadow-sm flex items-center gap-2"
                      href={`tel:${PHONE_TEL}`}
                    >
                      <span>📞</span>
                      <span>Call Instead</span>
                    </a>

                    <Link
                      to="/quote"
                      className="px-6 py-3.5 rounded-xl border border-red-200/50 bg-white/80 backdrop-blur-sm font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300 shadow-sm flex items-center gap-2"
                    >
                      <span>💰</span>
                      <span>Get Quote</span>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-red-200/50 bg-gradient-to-br from-red-50/50 via-amber-50/30 to-yellow-50/30 p-8 md:p-12">
            {/* Background decorative circles */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-red-200/20 to-amber-200/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  NEED A PRICE QUICKLY?
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900">
                  Use our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Quote Form</span> for faster response
                </div>
                <div className="text-lg text-slate-700">
                  Upload your file and get a detailed quote with exact pricing and timelines.
                </div>
              </div>

              <Link
                to="/quote"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
              >
                Get a Quote Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gradient-to-r from-red-50/30 to-amber-50/30 border border-red-200/30">
      <div className="text-slate-700 font-medium">{k}</div>
      <div className="font-semibold text-slate-900 bg-white/50 px-3 py-1 rounded-lg">{v}</div>
    </div>
  );
}