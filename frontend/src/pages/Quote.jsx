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

  // Customer
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("WhatsApp");

  // Order
  const [serviceName, setServiceName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [paper, setPaper] = useState("");
  const [finishing, setFinishing] = useState("");
  const [notes, setNotes] = useState("");

  // Delivery
  const [fulfillment, setFulfillment] = useState("Pickup");
  const [deliveryArea, setDeliveryArea] = useState("");

  // Files
  const [files, setFiles] = useState([]);

  /* ------------------ LOAD DATA ------------------ */
  useEffect(() => {
    (async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          http.get("/api/services"),
          http.get("/api/delivery-areas"),
        ]);

        setServices(sRes.data || []);
        setAreas(aRes.data || []);

        if (sRes.data?.length) {
          setServiceName(sRes.data[0].name);
        }
      } catch (e) {
        setErr("Failed to load quote form data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ------------------ DELIVERY FEE ------------------ */
  const selectedAreaObj = useMemo(
    () => areas.find(a => a.area === deliveryArea),
    [areas, deliveryArea]
  );

  const deliveryFeeLkr =
    fulfillment === "Delivery" ? selectedAreaObj?.feeLkr || 0 : 0;

  /* ------------------ FILE HANDLING ------------------ */
  const onFilesChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list.slice(0, 5)); // max 5 files
  };

  /* ------------------ VALIDATION ------------------ */
  const validate = () => {
    if (!customerName.trim()) return "Please enter your name";
    if (!phone.trim()) return "Please enter your phone number";
    if (!serviceName) return "Please select a service";
    if (Number(quantity) <= 0) return "Quantity must be at least 1";
    if (fulfillment === "Delivery" && !deliveryArea)
      return "Please select a delivery area";
    return "";
  };

  /* ------------------ SUBMIT ------------------ */
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

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
      fd.append("quantity", quantity);
      fd.append("size", size);
      fd.append("color", color);
      fd.append("paper", paper);
      fd.append("finishing", finishing);
      fd.append("notes", notes);

      fd.append("fulfillment", fulfillment);
      fd.append("deliveryArea", fulfillment === "Delivery" ? deliveryArea : "");
      fd.append("deliveryFeeLkr", deliveryFeeLkr);

      files.forEach(f => fd.append("files", f));

      const { data } = await http.post("/api/quotes", fd);

      setOkMsg(`✅ Quote sent successfully. Ref ID: ${data?.id || "N/A"}`);
      setFiles([]);
      setNotes("");
      setQuantity(1);
    } catch (e) {
      setErr("Failed to submit quote request");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <p className="p-10 text-center">Loading quote form…</p>;
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      <form
        onSubmit={submit}
        className="max-w-4xl mx-auto p-8 space-y-8"
      >
        <h1 className="text-4xl font-bold text-center">
          Get a Printing Quote
        </h1>

        {err && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 font-semibold">
            {err}
          </div>
        )}

        {okMsg && (
          <div className="p-4 rounded-xl bg-green-50 text-green-700 font-semibold">
            {okMsg}
          </div>
        )}

        {/* CUSTOMER */}
        <Section title="Customer Details">
          <Input label="Your Name *" value={customerName} onChange={setCustomerName} />
          <Input label="Phone *" value={phone} onChange={setPhone} />
          <Select
            label="Preferred Contact"
            value={contactMethod}
            onChange={setContactMethod}
            options={["WhatsApp", "Call"]}
          />
        </Section>

        {/* ORDER */}
        <Section title="Print Details">
          <Select
            label="Service *"
            value={serviceName}
            onChange={setServiceName}
            options={services.map(s => s.name)}
          />
          <Input
            label="Quantity *"
            type="number"
            value={quantity}
            onChange={setQuantity}
          />
          <Input label="Size" value={size} onChange={setSize} />
          <Input label="Color" value={color} onChange={setColor} />
          <Input label="Paper" value={paper} onChange={setPaper} />
          <Input label="Finishing" value={finishing} onChange={setFinishing} />
        </Section>

        {/* DELIVERY */}
        <Section title="Pickup or Delivery">
          <div className="flex gap-4">
            {["Pickup", "Delivery"].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setFulfillment(m)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  fulfillment === m
                    ? "bg-red-600 text-white"
                    : "border"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {fulfillment === "Delivery" && (
            <>
              <Select
                label="Delivery Area *"
                value={deliveryArea}
                onChange={setDeliveryArea}
                options={areas.map(a => `${a.area}`)}
              />
              <p className="font-semibold">
                Delivery Fee: LKR {deliveryFeeLkr}
              </p>
            </>
          )}
        </Section>

        {/* FILES */}
        <Section title="Upload Files">
          <input
            type="file"
            multiple
            onChange={onFilesChange}
            className="block"
          />
          {files.length > 0 && (
            <ul className="text-sm text-slate-600">
              {files.map((f, i) => (
                <li key={i}>
                  {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* NOTES */}
        <Section title="Additional Notes">
          <textarea
            className="w-full border rounded-xl p-4"
            rows="4"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </Section>

        {/* SUBMIT */}
        <div className="text-center">
          <button
            disabled={sending}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-lg shadow-lg disabled:opacity-60"
          >
            {sending ? "Sending…" : "Submit Quote"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------ SMALL COMPONENTS ------------------ */
function Section({ title, children }) {
  return (
    <div className="space-y-4 border rounded-2xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <input
        type={type}
        className="w-full border rounded-xl p-3"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <select
        className="w-full border rounded-xl p-3"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
