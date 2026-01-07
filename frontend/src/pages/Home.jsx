import { Link } from "react-router-dom";

import heroImg from "../assets/images/hero-print.png";
import imgCards from "../assets/images/cards.jpg";
import imgBrochure from "../assets/images/brochure.jpg";
import imgPoster from "../assets/images/poster.jpg";
import logo from "../assets/images/logo.jpeg";

const PHONE = "0662285425";
const WHATSAPP = "94772285425"; // change if needed

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-amber-50/30 via-white to-red-50/20">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-red-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-gradient-to-br from-red-100/30 to-amber-100/30 rounded-full blur-3xl" />
        </div>

        <div className="container-pad py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            {/* LOGO + BRAND */}
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Suranga Printers Logo"
                className="h-16 w-16 md:h-20 md:w-20 rounded-full shadow-lg ring-4 ring-red-200/50 bg-white"
              />
              <div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900">
                  Suranga Printers
                </div>
                <div className="text-sm md:text-base font-semibold text-red-600">
                  Fast Print
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-amber-100 text-red-800 text-sm font-semibold border border-red-200/50 shadow-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Fast Print • Dambulla • Matale District Delivery
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Premium{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
                  Color Printing
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-amber-400 rounded-full" />
              </span>{" "}
              for Business & Events
            </h1>

            <p className="text-lg text-slate-700 leading-relaxed max-w-2xl">
              Elevate your brand with professional business cards, brochures,
              posters, book printing, binding, photo printing, and dye
              sublimation services. Quick response via WhatsApp or phone call.
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
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Fast Reply
                </span>
              </a>

              <a
                href={`tel:${PHONE}`}
                className="px-6 py-3.5 rounded-xl border border-red-200 font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300 shadow-sm"
              >
                Call Directly
              </a>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-6">
              <Stat
                title="Fast Turnaround"
                desc="Same/next day for many jobs"
                icon="⚡"
              />
              <Stat
                title="Quality Finish"
                desc="Lamination, binding, cutting"
                icon="✨"
              />
              <Stat
                title="Delivery"
                desc="Matale District areas + fees"
                icon="🚚"
              />
            </div>
          </div>

          {/* Hero image with premium look */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-200/40 via-amber-200/30 to-yellow-100/40 blur-3xl rounded-[3rem]" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-red-200/50 bg-gradient-to-br from-white to-amber-50/30 shadow-2xl">
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>

                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-red-100 to-amber-100 text-red-800">
                  Premium Print Ready
                </div>
              </div>

              <img
                src={heroImg}
                alt="Suranga Printers - colorful printing"
                className="w-full h-[380px] md:h-[480px] object-cover mt-12"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge>Business Cards</Badge>
                  <Badge>Brochures</Badge>
                  <Badge>Posters</Badge>
                  <Badge>Books + Binding</Badge>
                  <Badge>Sublimation</Badge>
                </div>

                <div className="text-white">
                  <div className="font-bold text-xl">
                    Suranga Printers – Fast Print
                  </div>
                  <div className="text-sm text-white/90 flex items-center gap-2 mt-1">
                    <span>📍</span>
                    <span>Kandy–Jaffna Hwy, Dambulla</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-red-400/10 to-amber-400/10 rounded-2xl rotate-12" />
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 rounded-2xl -rotate-12" />
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES WITH IMAGES */}
      <section className="container-pad py-16 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100/20 to-amber-100/20 rounded-full blur-3xl -z-10" />

        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-sm text-red-600 font-semibold">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              OUR SPECIALTIES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Premium Printing Services
            </h2>
            <p className="text-slate-600">
              High-demand printing with premium finishing and attention to
              detail.
            </p>
          </div>

          <Link
            to="/services"
            className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 group"
          >
            View all services
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <FeatureCard
            img={imgCards}
            title="Business Cards"
            desc="Matte/Gloss, Lamination, Premium paper options with spot UV coating available."
            tag="Best Seller"
            color="from-red-500 to-amber-500"
          />
          <FeatureCard
            img={imgBrochure}
            title="Flyers & Brochures"
            desc="Full color, single/both sides, folding options with professional finishes."
            tag="Marketing"
            color="from-amber-500 to-yellow-500"
          />
          <FeatureCard
            img={imgPoster}
            title="Posters & Banners"
            desc="A3/A2 sizes, event posters, shop promotions with vibrant color reproduction."
            tag="Color Print"
            color="from-red-600 to-amber-600"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 to-red-50/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-gradient-to-r from-red-100/20 to-amber-100/20 blur-3xl" />

        <div className="container-pad relative z-10">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-sm text-amber-600 font-semibold">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                SIMPLE PROCESS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                How It Works
              </h2>
              <p className="text-slate-600">
                Simple process — fast response. Get your printing done in 3 easy
                steps.
              </p>
            </div>

            <Link
              to="/quote"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
            >
              Request quote
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <Step
              n="01"
              title="Choose Service"
              desc="Select what you need: cards, brochures, posters, books, etc."
              icon="📋"
              gradient="from-red-100 to-amber-100"
            />
            <Step
              n="02"
              title="Send File"
              desc="Upload PDF/JPG/PNG/ZIP and mention finishing details."
              icon="📤"
              gradient="from-amber-100 to-yellow-100"
            />
            <Step
              n="03"
              title="Confirm & Print"
              desc="We reply via WhatsApp/call with cost & timeline."
              icon="✅"
              gradient="from-red-50 to-amber-50"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-pad py-16">
        <div className="relative overflow-hidden rounded-3xl border border-red-200/50 bg-gradient-to-br from-red-50/50 via-amber-50/30 to-yellow-50/30 p-8 md:p-12">
          {/* Background decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-red-200/20 to-amber-200/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                URGENT PRINTING NEED?
              </div>

              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                Need printing{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
                  today?
                </span>
              </div>

              <div className="text-lg text-slate-700">
                Click WhatsApp and send your file — we'll guide you through
                paper selection, size optimization, and premium finishing
                options.
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/quote"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
              >
                Get Quote
              </Link>

              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center gap-2"
              >
                <span>WhatsApp</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Fast
                </span>
              </a>

              <a
                href={`tel:${PHONE}`}
                className="px-6 py-3.5 rounded-xl border border-red-200 font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300 shadow-sm"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-colors">
      {children}
    </span>
  );
}

function Stat({ title, desc, icon }) {
  return (
    <div className="border border-red-100/50 rounded-2xl p-4 bg-white/80 backdrop-blur-sm hover:shadow-md hover:border-red-200 transition-all duration-300">
      <div className="font-bold text-slate-900 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-sm text-slate-600 mt-2">{desc}</div>
    </div>
  );
}

function FeatureCard({ img, title, desc, tag, color }) {
  return (
    <div className="group border border-red-100/50 rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-5 left-5">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r ${color} text-white shadow-md`}
          >
            {tag}
          </span>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="text-white font-bold text-xl">{title}</div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <div className="text-sm text-slate-600">{desc}</div>
        <Link
          to="/quote"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 group"
        >
          <span>Request quote</span>
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

function Step({ n, title, desc, icon, gradient }) {
  return (
    <div
      className={`border border-red-100/50 rounded-3xl p-6 bg-gradient-to-br ${gradient} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-red-700 bg-white/80 px-3 py-1.5 rounded-full">
          {n}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>

      <div className="mt-4 font-bold text-slate-900 text-lg">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{desc}</div>
    </div>
  );
}
