import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Phone,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_SETTINGS = {
  shopName: "Suranga Printers",
  phone: "0662285425",
  whatsapp: "94711017979",
  address: "Kandy - Jaffna Hwy, Dambulla",
  hoursMonSat: "8:30 AM – 7:00 PM",
  hoursSunday: "9:00 AM – 1:00 PM",
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    website: "",
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch(`${API}/api/settings`);
        if (!res.ok) throw new Error(`Failed to load settings (${res.status})`);
        const data = await res.json();

        if (!ignore && data) {
          setSettings({
            shopName: data.shopName || DEFAULT_SETTINGS.shopName,
            phone: data.phone || DEFAULT_SETTINGS.phone,
            whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
            address: data.address || DEFAULT_SETTINGS.address,
            hoursMonSat: data.hoursMonSat || DEFAULT_SETTINGS.hoursMonSat,
            hoursSunday: data.hoursSunday || DEFAULT_SETTINGS.hoursSunday,
            social: {
              facebook: data?.social?.facebook || "",
              instagram: data?.social?.instagram || "",
              twitter: data?.social?.twitter || "",
              youtube: data?.social?.youtube || "",
              tiktok: data?.social?.tiktok || "",
              website: data?.social?.website || "",
            },
          });
          setLoaded(true);
        }
      } catch (e) {
        console.log("Footer settings fetch failed:", e?.message);
        if (!ignore) setLoaded(true);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const phoneDigits = useMemo(
    () => String(settings.phone || "").replace(/\D/g, ""),
    [settings.phone]
  );

  const whatsappDigits = useMemo(
    () => String(settings.whatsapp || "").replace(/\D/g, ""),
    [settings.whatsapp]
  );

  // ✅ Social links from DB
  const SOCIAL_LINKS = settings.social || {};

  // ✅ helper to show icon only if url exists
  const has = (url) => !!String(url || "").trim();

  return (
    <footer className="relative border-t border-red-200/50 bg-gradient-to-b from-white to-red-50/20">
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-50/30 to-transparent -z-10"></div>

      <div className="container-pad py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-amber-100 text-red-800 text-xs font-semibold border border-red-200/50 mb-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              Fast Print • Dambulla
            </div>

            <div className="font-bold text-xl text-slate-900">
              {settings.shopName}
            </div>

            <div className="text-slate-600 leading-relaxed">
              Premium color printing for business & events. Fast turnaround with
              delivery across Matale District.
            </div>

            {/* ✅ Social links from Settings */}
            <div className="pt-4">
              <div className="text-sm font-semibold text-slate-900 mb-3">
                Follow Us
              </div>

              <div className="flex items-center gap-3">
                {has(SOCIAL_LINKS.facebook) && (
                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all duration-300 group"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                  </a>
                )}

                {has(SOCIAL_LINKS.instagram) && (
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 text-pink-600 hover:from-purple-100 hover:to-pink-100 hover:scale-110 transition-all duration-300 group"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                  </a>
                )}

                {has(SOCIAL_LINKS.twitter) && (
                  <a
                    href={SOCIAL_LINKS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 hover:scale-110 transition-all duration-300 group"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                  </a>
                )}

                {has(SOCIAL_LINKS.youtube) && (
                  <a
                    href={SOCIAL_LINKS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all duration-300 group"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                  </a>
                )}
              </div>

              {/* Optional website link */}
              {has(SOCIAL_LINKS.website) ? (
                <div className="mt-3 text-sm">
                  <a
                    href={SOCIAL_LINKS.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-red-600 font-semibold transition-colors"
                  >
                    Visit our website →
                  </a>
                </div>
              ) : null}
            </div>

            {/* Address */}
            <div className="pt-4">
              <div className="text-sm font-semibold text-slate-900 mb-2">
                Visit Us
              </div>
              <div className="text-slate-600 text-sm">{settings.address}</div>

              {!loaded ? (
                <div className="text-xs text-slate-400 mt-1">Loading…</div>
              ) : null}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-lg font-bold text-slate-900 mb-4">
              Quick Links
            </div>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/portfolio", label: "Portfolio" },
                { to: "/reviews", label: "Reviews" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-slate-600 hover:text-red-600 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-red-200 rounded-full group-hover:bg-red-500 transition-colors"></span>
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <div className="text-lg font-bold text-slate-900 mb-4">
              Get In Touch
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 hover:text-red-600 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-red-200 rounded-full group-hover:bg-red-500 transition-colors"></span>
                  <span>Contact</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/quote"
                  className="text-slate-600 hover:text-red-600 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-red-200 rounded-full group-hover:bg-red-500 transition-colors"></span>
                  <span>Get Quote</span>
                </Link>
              </li>

              <li>
                <a
                  href={whatsappDigits ? `https://wa.me/${whatsappDigits}` : "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-red-600 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-red-200 rounded-full group-hover:bg-red-500 transition-colors"></span>
                  <span>WhatsApp</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Fast
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={phoneDigits ? `tel:${phoneDigits}` : "#"}
                  className="text-slate-600 hover:text-red-600 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-red-200 rounded-full group-hover:bg-red-500 transition-colors"></span>
                  <span>Call Now</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <div className="text-lg font-bold text-slate-900 mb-4">
              Business Hours
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-50/50">
                <span className="text-slate-700">Mon – Sat</span>
                <span className="font-semibold text-slate-900">
                  {settings.hoursMonSat}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50/50">
                <span className="text-slate-700">Sunday</span>
                <span className="font-semibold text-slate-900">
                  {settings.hoursSunday}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-red-50/50">
                <span className="text-slate-700">Delivery</span>
                <span className="font-semibold text-slate-900">
                  Matale District
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* mini icon row */}
              <div className="flex items-center justify-center gap-3">
                {has(SOCIAL_LINKS.facebook) && (
                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-blue-600 hover:scale-110 transition-transform"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {has(SOCIAL_LINKS.instagram) && (
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-pink-600 hover:scale-110 transition-transform"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={whatsappDigits ? `https://wa.me/${whatsappDigits}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-green-600 hover:scale-110 transition-transform"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={phoneDigits ? `tel:${phoneDigits}` : "#"}
                  className="p-1.5 text-red-600 hover:scale-110 transition-transform"
                  aria-label="Phone"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <Link
                to="/quote"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md group"
              >
                <span>Get Quote Now</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-red-200/50 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
          <div className="text-slate-600 text-sm text-center md:text-left">
            <div className="font-semibold text-slate-900 mb-1">
              {settings.shopName} – Fast Print
            </div>
            <div>{settings.address} • Matale District Delivery</div>

            <div className="flex justify-center md:justify-start items-center gap-3 mt-3 md:hidden">
              <span className="text-xs text-slate-500 font-medium">
                Follow us:
              </span>

              {has(SOCIAL_LINKS.facebook) && (
                <a
                  href={SOCIAL_LINKS.facebook}
                  aria-label="Facebook"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              {has(SOCIAL_LINKS.instagram) && (
                <a
                  href={SOCIAL_LINKS.instagram}
                  aria-label="Instagram"
                  className="text-pink-500 hover:text-pink-700"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {has(SOCIAL_LINKS.twitter) && (
                <a
                  href={SOCIAL_LINKS.twitter}
                  aria-label="Twitter"
                  className="text-sky-500 hover:text-sky-700"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Connect with us:
              </span>

              <div className="flex items-center gap-2">
                {has(SOCIAL_LINKS.facebook) && (
                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {has(SOCIAL_LINKS.instagram) && (
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-700 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {has(SOCIAL_LINKS.twitter) && (
                  <a
                    href={SOCIAL_LINKS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500 hover:text-sky-700 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {has(SOCIAL_LINKS.youtube) && (
                  <a
                    href={SOCIAL_LINKS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="text-slate-500 text-sm font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-amber-50">
              © {currentYear} {settings.shopName}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
