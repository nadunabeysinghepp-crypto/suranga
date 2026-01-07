import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

import logo from "../assets/images/logo.jpeg"; // ✅ LOGO IMAGE

const PHONE = "0662285425";
const WHATSAPP = "94772285425";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 " +
    (isActive
      ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md"
      : "text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 hover:shadow-sm"
    );

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-red-200/50 shadow-sm">
      <div className="container-pad flex items-center justify-between py-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src={logo}
              alt="Suranga Printers Logo"
              className="w-12 h-12 rounded-2xl object-cover shadow-md ring-2 ring-red-200/50 group-hover:scale-105 transition-transform duration-300 bg-white"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </div>

          <div>
            <div className="font-bold text-lg leading-5 text-slate-900 group-hover:text-red-600 transition-colors">
              Suranga Printers
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1">
              <span className="text-red-500">⚡</span>
              <span>Fast Print • Dambulla</span>
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink className={navClass} to="/">Home</NavLink>
          <NavLink className={navClass} to="/services">Services</NavLink>
          <NavLink className={navClass} to="/quote">Get Quote</NavLink>
          <NavLink className={navClass} to="/portfolio">Portfolio</NavLink>
          <NavLink className={navClass} to="/reviews">Reviews</NavLink>
          <NavLink className={navClass} to="/contact">Contact</NavLink>
        </nav>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <a
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200/50 text-sm font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300 shadow-sm"
            href={`tel:${PHONE}`}
          >
            <span className="text-red-600">📞</span>
            <span>Call</span>
          </a>

          <a
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
          >
            <span>💬</span>
            <span>WhatsApp</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Fast</span>
          </a>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl border border-red-200/50 flex flex-col items-center justify-center gap-1.5 hover:bg-red-50 transition-colors"
          >
            <span className={`w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="container-pad py-4 border-t border-red-200/50 bg-gradient-to-b from-white to-red-50/30 backdrop-blur-lg">
          <div className="space-y-2">
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/services" onClick={() => setIsMenuOpen(false)}>Services</MobileNavLink>
            <MobileNavLink to="/quote" onClick={() => setIsMenuOpen(false)}>Get Quote</MobileNavLink>
            <MobileNavLink to="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</MobileNavLink>
            <MobileNavLink to="/reviews" onClick={() => setIsMenuOpen(false)}>Reviews</MobileNavLink>
            <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 " +
        (isActive
          ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md"
          : "text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50"
        )
      }
    >
      {children}
    </NavLink>
  );
}
