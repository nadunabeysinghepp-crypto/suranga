import { useEffect, useMemo, useState } from "react";
import http from "../api/adminHttp";

const PHONE = "0662285425";
const WHATSAPP = "94772285425";

export default function Quote() {
  const [services, setServices] = useState([]);
  const [areas, setAreas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // form fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("WhatsApp");

  const [serviceName, setServiceName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [paper, setPaper] = useState("");
  const [finishing, setFinishing] = useState("");
  const [notes, setNotes] = useState("");

  const [fulfillment, setFulfillment] = useState("Pickup");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const [sRes, aRes] = await Promise.all([
          http.get("/api/services"),
          http.get("/api/delivery-areas"),
        ]);
        setServices(sRes.data || []);
        setAreas(aRes.data || []);

        // Set initial service if available
        if ((sRes.data || []).length > 0) {
          setServiceName(sRes.data[0].name);
        }
      } catch (e) {
        console.error("Error loading data:", e);
        setErr(e?.response?.data?.message || "Failed to load quote form data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedAreaObj = useMemo(() => {
    return areas.find((x) => x.area === deliveryArea) || null;
  }, [areas, deliveryArea]);

  const deliveryFeeLkr = useMemo(() => {
    if (fulfillment !== "Delivery") return 0;
    return selectedAreaObj?.feeLkr || 0;
  }, [fulfillment, selectedAreaObj]);

  const onFilesChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list.slice(0, 5));
  };

  const validate = () => {
    if (!customerName.trim()) return "Please enter your name.";
    if (!phone.trim()) return "Please enter your phone number.";
    if (!serviceName.trim()) return "Please select a service.";
    if (Number(quantity) <= 0) return "Quantity must be at least 1.";
    if (fulfillment === "Delivery" && !deliveryArea) return "Please select a delivery area.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErr("");

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setSending(true);
    try {
      const fd = new FormData();
      fd.append("customerName", customerName);
      fd.append("phone", phone);
      fd.append("contactMethod", contactMethod);

      fd.append("serviceName", serviceName);
      fd.append("quantity", String(quantity));
      fd.append("size", size);
      fd.append("color", color);
      fd.append("paper", paper);
      fd.append("finishing", finishing);
      fd.append("notes", notes);

      fd.append("fulfillment", fulfillment);
      fd.append("deliveryArea", fulfillment === "Delivery" ? deliveryArea : "");
      fd.append("deliveryFeeLkr", String(fulfillment === "Delivery" ? deliveryFeeLkr : 0));

      files.forEach((f) => fd.append("files", f));

      const { data } = await http.post("/api/quotes", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOkMsg(`✅ Quote request sent successfully. Reference ID: ${data?.id || "N/A"}`);

      setSize("");
      setColor("");
      setPaper("");
      setFinishing("");
      setNotes("");
      setFiles([]);
      if (fulfillment === "Delivery") setDeliveryArea("");
    } catch (e2) {
      console.error("Error submitting form:", e2);
      setErr(e2?.response?.data?.message || "Failed to submit quote request");
    } finally {
      setSending(false);
    }
  };

  // Debug: Log services data
  useEffect(() => {
    console.log("Services loaded:", services);
  }, [services]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/20 via-white to-red-50/10">
      <div className="container-pad py-12 md:py-16 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100/20 to-amber-100/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-amber-100/20 to-yellow-100/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-amber-100 text-red-800 text-sm font-semibold border border-red-200/50 shadow-sm mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Fast Quote • Professional Printing • Matale District
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Get a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Quick Quote</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              Send your requirements. We'll reply with competitive pricing and clear timelines via WhatsApp or call.
            </p>
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
                <div className="text-slate-600 font-medium">Loading form data...</div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* FORM */}
              <form onSubmit={submit} className="lg:col-span-2 space-y-6">
                <div className="border border-red-200/50 rounded-3xl bg-gradient-to-br from-white to-amber-50/30 shadow-xl overflow-hidden">
                  <div className="p-6 md:p-8 space-y-6">
                    {/* Form Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Quote Details</h2>
                        <p className="text-slate-600 text-sm mt-1">Fill in your printing requirements</p>
                      </div>
                      <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-amber-100 text-red-800">
                        Required *
                      </div>
                    </div>

                    {err && (
                      <div className="border border-red-200/50 rounded-2xl bg-gradient-to-r from-red-50/80 to-pink-50/80 text-red-700 p-4 backdrop-blur-sm">
                        <div className="font-bold flex items-center gap-2">
                          <span>⚠️</span>
                          <span>Please fix the following:</span>
                        </div>
                        <div className="text-sm mt-1">{err}</div>
                      </div>
                    )}

                    {okMsg && (
                      <div className="border border-emerald-200/50 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-green-50/80 text-emerald-700 p-4 backdrop-blur-sm">
                        <div className="font-bold flex items-center gap-2">
                          <span>✅</span>
                          <span>Success!</span>
                        </div>
                        <div className="text-sm mt-1">{okMsg}</div>
                      </div>
                    )}

                    {/* Form Grid */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Your Name *" required>
                        <input
                          className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </Field>

                      <Field label="Phone *" required>
                        <input
                          className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07XXXXXXXX"
                        />
                      </Field>

                      {/* FIXED: Preferred Contact */}
                      <Field label="Preferred Contact">
                        <div className="relative">
                          <select
                            className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm appearance-none transition-all duration-300"
                            value={contactMethod}
                            onChange={(e) => setContactMethod(e.target.value)}
                          >
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Call">Call</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-slate-400">▼</span>
                          </div>
                        </div>
                      </Field>

                      {/* FIXED: Quantity */}
                      <Field label="Quantity *" required>
                        <input
                          type="number"
                          min="1"
                          className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="Enter quantity"
                        />
                      </Field>

                      {/* FIXED: Service */}
                      <Field label="Service *" required>
                        <div className="relative">
                          <select
                            className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm appearance-none transition-all duration-300"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                          >
                            {services.length === 0 ? (
                              <option value="">Loading services...</option>
                            ) : (
                              <>
                                <option value="">Select a service...</option>
                                {services.map((s) => (
                                  <option key={s._id} value={s.name}>
                                    {s.name}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-slate-400">▼</span>
                          </div>
                        </div>
                      </Field>

                      {/* FIXED: Size */}
                      <Field label="Size">
                        <div className="relative">
                          <select
                            className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm appearance-none transition-all duration-300"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                          >
                            <option value="">Select size...</option>
                            <option value="A4">A4 (21.0 x 29.7 cm)</option>
                            <option value="A3">A3 (29.7 x 42.0 cm)</option>
                            <option value="A5">A5 (14.8 x 21.0 cm)</option>
                            <option value="3.5x2 inch">Business Card (3.5x2 inch)</option>
                            <option value="Custom">Custom Size</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-slate-400">▼</span>
                          </div>
                        </div>
                      </Field>

                      <Field label="Color">
                        <div className="relative">
                          <select
                            className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm appearance-none transition-all duration-300"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                          >
                            <option value="">Select color option...</option>
                            <option value="Full Color">Full Color (CMYK)</option>
                            <option value="Black & White">Black & White</option>
                            <option value="Single Side">Single Side Printing</option>
                            <option value="Both Sides">Both Sides Printing</option>
                            <option value="Custom">Custom Color</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-slate-400">▼</span>
                          </div>
                        </div>
                      </Field>

                      <Field label="Paper / Material">
                        <div className="relative">
                          <select
                            className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm appearance-none transition-all duration-300"
                            value={paper}
                            onChange={(e) => setPaper(e.target.value)}
                          >
                            <option value="">Select paper type...</option>
                            <option value="Art Paper">Art Paper</option>
                            <option value="Glossy">Glossy Paper</option>
                            <option value="Matte">Matte Paper</option>
                            <option value="Card Stock">Card Stock</option>
                            <option value="Bond Paper">Bond Paper</option>
                            <option value="Recycled">Recycled Paper</option>
                            <option value="Custom">Custom Material</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-slate-400">▼</span>
                          </div>
                        </div>
                      </Field>

                      <Field label="Finishing">
                        <div className="relative">
                          <select
                            className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm appearance-none transition-all duration-300"
                            value={finishing}
                            onChange={(e) => setFinishing(e.target.value)}
                          >
                            <option value="">Select finishing...</option>
                            <option value="None">No Finishing</option>
                            <option value="Lamination">Lamination</option>
                            <option value="UV Coating">UV Coating</option>
                            <option value="Spot UV">Spot UV</option>
                            <option value="Foil Stamping">Foil Stamping</option>
                            <option value="Binding">Binding</option>
                            <option value="Cutting">Cutting</option>
                            <option value="Folding">Folding</option>
                            <option value="Custom">Custom Finishing</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-slate-400">▼</span>
                          </div>
                        </div>
                      </Field>

                      <Field label="Pickup or Delivery">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setFulfillment("Pickup")}
                            className={`flex-1 px-4 py-3 rounded-xl border font-semibold transition-all duration-300 ${
                              fulfillment === "Pickup"
                                ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-900 shadow-md"
                                : "border-red-200/50 bg-white/80 hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 hover:shadow-sm"
                            }`}
                          >
                            Pickup
                          </button>
                          <button
                            type="button"
                            onClick={() => setFulfillment("Delivery")}
                            className={`flex-1 px-4 py-3 rounded-xl border font-semibold transition-all duration-300 ${
                              fulfillment === "Delivery"
                                ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-900 shadow-md"
                                : "border-red-200/50 bg-white/80 hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 hover:shadow-sm"
                            }`}
                          >
                            Delivery
                          </button>
                        </div>
                      </Field>

                      {fulfillment === "Delivery" && (
                        <Field label="Delivery Area (Matale District) *" required>
                          <div className="relative">
                            <select
                              className="w-full border border-red-200/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm appearance-none transition-all duration-300"
                              value={deliveryArea}
                              onChange={(e) => setDeliveryArea(e.target.value)}
                            >
                              <option value="">Select area…</option>
                              {areas.map((a) => (
                                <option key={a._id} value={a.area}>
                                  {a.area} — LKR {a.feeLkr}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <span className="text-slate-400">▼</span>
                            </div>
                          </div>
                        </Field>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-sm font-semibold text-slate-900 mb-2 block">
                        Additional Notes
                      </label>
                      <textarea
                        className="w-full border border-red-200/50 rounded-2xl px-4 py-3 min-h-[120px] outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any details: design needed, urgent, sample link, special instructions, etc."
                      />
                    </div>

                    {/* File Upload */}
                    <div className="border border-red-200/50 rounded-2xl p-5 bg-gradient-to-r from-red-50/30 to-amber-50/30">
                      <label className="text-sm font-semibold text-slate-900 mb-3 block">
                        Upload Files (Optional)
                      </label>
                      <div className="text-sm text-slate-600 mb-4">
                        PDF/JPG/PNG/ZIP (max 5 files, 20MB each)
                      </div>
                      <div className="relative border-2 border-dashed border-red-200/50 rounded-2xl p-6 text-center hover:border-red-300/50 transition-colors duration-300">
                        <input
                          type="file"
                          multiple
                          onChange={onFilesChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf,.jpg,.jpeg,.png,.webp,.zip"
                        />
                        <div className="text-3xl mb-2">📎</div>
                        <div className="font-medium text-slate-900">Click to upload files</div>
                        <div className="text-sm text-slate-600 mt-1">or drag and drop</div>
                      </div>
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-medium text-slate-900">Selected files:</div>
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-sm text-slate-700 bg-white/50 rounded-xl px-3 py-2">
                              <span className="truncate">{file.name}</span>
                              <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className="border-t border-red-200/50 bg-gradient-to-r from-white to-red-50/20 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-slate-700">
                        {fulfillment === "Delivery" ? (
                          <div className="flex items-center gap-2">
                            <span>Estimated delivery fee:</span>
                            <span className="font-bold text-lg text-slate-900">LKR {deliveryFeeLkr}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-amber-600">📍</span>
                            <span>Pickup from our shop in Dambulla</span>
                          </div>
                        )}
                      </div>

                      <button
                        disabled={sending}
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
                        type="submit"
                      >
                        {sending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Quote Request</span>
                            <span className="text-lg">→</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* SIDE INFO */}
              <aside className="space-y-8">
                {/* Guidelines Card */}
                <div className="border border-red-200/50 rounded-3xl bg-gradient-to-br from-white to-amber-50/30 shadow-xl overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
                        <span className="text-red-600 text-lg">📄</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-slate-900">File Guidelines</div>
                        <div className="text-sm text-slate-600">Best practices for printing</div>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs">✓</span>
                        </div>
                        <span className="text-slate-700">Best: PDF (print-ready with bleed marks)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs">✓</span>
                        </div>
                        <span className="text-slate-700">Images: High resolution (300 DPI+)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs">✓</span>
                        </div>
                        <span className="text-slate-700">Design services available (mention in notes)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-50 to-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs">✓</span>
                        </div>
                        <span className="text-slate-700">Delivery areas within Matale District only</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="border border-red-200/50 rounded-3xl bg-gradient-to-br from-red-50/50 to-amber-50/30 shadow-xl overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-100 to-amber-100 flex items-center justify-center">
                        <span className="text-red-600 text-lg">💬</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-slate-900">Need Fast Help?</div>
                        <div className="text-sm text-slate-600">Immediate assistance available</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-slate-700">
                        Message us directly on WhatsApp for instant quotes or send your files for quick review.
                      </p>

                      <div className="space-y-3">
                        <a
                          href={`https://wa.me/${WHATSAPP}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
                        >
                          <span>💬</span>
                          <span className="flex-1 text-center">WhatsApp Now</span>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Fast Reply</span>
                        </a>

                        <a
                          href={`tel:${PHONE}`}
                          className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-red-200/50 bg-white/80 backdrop-blur-sm font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-300 shadow-sm"
                        >
                          <span>📞</span>
                          <span className="flex-1 text-center">Call Directly</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="border border-amber-200/50 rounded-3xl bg-gradient-to-br from-amber-50/30 to-yellow-50/30 shadow-xl overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="font-bold text-lg text-slate-900 mb-4">Quote Process</div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">1</span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">Submit Form</div>
                          <div className="text-sm text-slate-600">Fill in your requirements</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">2</span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">Review</div>
                          <div className="text-sm text-slate-600">We'll analyze your request</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">3</span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">Get Quote</div>
                          <div className="text-sm text-slate-600">Receive pricing via preferred contact</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-900 mb-2 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div>{children}</div>
    </div>
  );
}