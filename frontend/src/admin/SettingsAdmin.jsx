import { useEffect, useState } from "react";
import adminHttp from "../api/adminHttp";
import { Save, RefreshCw, Globe, Clock, Phone, MapPin, MessageSquare } from "lucide-react";

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [hoursMonSat, setHoursMonSat] = useState("8:30 AM – 7:00 PM");
  const [hoursSunday, setHoursSunday] = useState("9:00 AM – 1:00 PM");

  const [social, setSocial] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    website: "",
  });

  const load = async () => {
    setErr("");
    setOk("");
    setLoading(true);

    try {
      const { data } = await adminHttp.get("/api/admin/settings");

      setShopName(data?.shopName || "Suranga Printers");
      setAddress(data?.address || "Kandy - Jaffna Hwy, Dambulla");
      setPhone(data?.phone || "");
      setWhatsapp(data?.whatsapp || "");
      setHoursMonSat(data?.hoursMonSat || "8:30 AM – 7:00 PM");
      setHoursSunday(data?.hoursSunday || "9:00 AM – 1:00 PM");
      setSocial({
        facebook: data?.social?.facebook || "",
        instagram: data?.social?.instagram || "",
        twitter: data?.social?.twitter || "",
        youtube: data?.social?.youtube || "",
        tiktok: data?.social?.tiktok || "",
        website: data?.social?.website || "",
      });
    } catch (e) {
      setErr(e?.response?.data?.message || "Settings endpoint not found (backend needed)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    setSaving(true);

    try {
      const payload = {
        shopName,
        address,
        phone,
        whatsapp,
        hoursMonSat,
        hoursSunday,
        social,
      };

      const res = await adminHttp.put("/api/admin/settings", payload);

      if (res?.data?.message) setOk(`✅ ${res.data.message}`);
      else setOk("✅ Settings saved");

      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-slate-50 to-white rounded-3xl p-6 mb-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-900 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Store Settings
              </h1>
            </div>
            <p className="text-slate-600 mt-1 ml-1">
              Manage your store details, hours, and social media links in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold hover:bg-slate-50 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Messages */}
      <div className="space-y-4 mb-6">
        {loading && (
          <div className="border border-slate-200 bg-slate-50 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-slate-400"></div>
            <span className="text-slate-600">Loading settings...</span>
          </div>
        )}

        {err && (
          <div className="border border-red-200 bg-gradient-to-r from-red-50 to-white text-red-700 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="font-medium">{err}</span>
          </div>
        )}

        {ok && (
          <div className="border border-green-200 bg-gradient-to-r from-green-50 to-white text-green-700 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-medium">{ok}</span>
          </div>
        )}
      </div>

      <form onSubmit={save} className="space-y-8">
        {/* Store Information Card */}
        <div className="border rounded-3xl p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-slate-100 rounded-lg">
              <MapPin className="h-5 w-5 text-slate-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Store Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Shop Name"
              icon="🏪"
              value={shopName}
              onChange={setShopName}
              placeholder="Suranga Printers"
            />

            <InputField
              label="Phone Number"
              icon={<Phone className="h-4 w-4" />}
              value={phone}
              onChange={setPhone}
              placeholder="0662285425"
            />

            <InputField
              label="WhatsApp Number"
              icon={<MessageSquare className="h-4 w-4" />}
              value={whatsapp}
              onChange={setWhatsapp}
              placeholder="947xxxxxxxx"
              note="Format: 94XXXXXXXXX"
            />

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Store Address
              </label>
              <input
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-slate-900 focus:ring-2 focus:ring-slate-100 transition-all duration-200"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Kandy - Jaffna Hwy, Dambulla"
              />
            </div>
          </div>
        </div>

        {/* Business Hours Card */}
        <div className="border rounded-3xl p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Clock className="h-5 w-5 text-slate-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Business Hours</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Monday - Saturday"
              icon="📅"
              value={hoursMonSat}
              onChange={setHoursMonSat}
              placeholder="8:30 AM – 7:00 PM"
            />

            <InputField
              label="Sunday"
              icon="☀️"
              value={hoursSunday}
              onChange={setHoursSunday}
              placeholder="9:00 AM – 1:00 PM"
            />
          </div>
        </div>

        {/* Social Media Card */}
        <div className="border rounded-3xl p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Globe className="h-5 w-5 text-slate-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Social Media Links</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
              Optional
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <SocialInput
              platform="Facebook"
              icon="🔵"
              value={social.facebook}
              onChange={(val) => setSocial(p => ({ ...p, facebook: val }))}
              placeholder="https://facebook.com/yourpage"
            />

            <SocialInput
              platform="Instagram"
              icon="📸"
              value={social.instagram}
              onChange={(val) => setSocial(p => ({ ...p, instagram: val }))}
              placeholder="https://instagram.com/yourpage"
            />

            <SocialInput
              platform="Twitter/X"
              icon="🐦"
              value={social.twitter}
              onChange={(val) => setSocial(p => ({ ...p, twitter: val }))}
              placeholder="https://twitter.com/yourpage"
            />

            <SocialInput
              platform="YouTube"
              icon="📺"
              value={social.youtube}
              onChange={(val) => setSocial(p => ({ ...p, youtube: val }))}
              placeholder="https://youtube.com/yourchannel"
            />

            <SocialInput
              platform="TikTok"
              icon="🎵"
              value={social.tiktok}
              onChange={(val) => setSocial(p => ({ ...p, tiktok: val }))}
              placeholder="https://tiktok.com/@yourpage"
            />

            <SocialInput
              platform="Website"
              icon="🌐"
              value={social.website}
              onChange={(val) => setSocial(p => ({ ...p, website: val }))}
              placeholder="https://yourdomain.com"
            />
          </div>
        </div>

        {/* Save Section */}
        <div className="sticky bottom-6 bg-white border rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900">Ready to update?</h3>
              <p className="text-sm text-slate-600 mt-1">
                Changes will be reflected immediately on your store.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={load}
                className="px-5 py-3 rounded-xl border font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                disabled={saving}
              >
                Cancel
              </button>
              
              <button
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving Changes..." : "Save All Settings"}
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
              If you see "endpoint not found", your backend does not have settings routes yet.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// Enhanced Input Field Component
function InputField({ label, icon, value, onChange, placeholder, note }) {
  return (
    <div className="group">
      <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
        <span>{icon}</span>
        {label}
      </label>
      <input
        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-slate-900 focus:ring-2 focus:ring-slate-100 transition-all duration-200 group-hover:border-slate-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
    </div>
  );
}

// Social Input Component with Platform Styling
function SocialInput({ platform, icon, value, onChange, placeholder }) {
  return (
    <div className="group">
      <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        {platform}
      </label>
      <div className="relative">
        <input
          className="w-full border border-slate-200 rounded-xl px-4 py-3 pl-10 focus:border-slate-900 focus:ring-2 focus:ring-slate-100 transition-all duration-200 group-hover:border-slate-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
          🔗
        </span>
      </div>
    </div>
  );
}