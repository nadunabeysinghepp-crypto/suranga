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

  const selectedAreaObj = useMemo(
    () => areas.find(x => x.area === deliveryArea),
    [areas, deliveryArea]
  );

  const deliveryFeeLkr =
    fulfillment === "Delivery" ? selectedAreaObj?.feeLkr || 0 : 0;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    if (!customerName || !phone || !serviceName) {
      setErr("Please fill required fields");
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
      fd.append("deliveryArea", deliveryArea);
      fd.append("deliveryFeeLkr", deliveryFeeLkr);

      files.forEach(f => fd.append("files", f));

      const { data } = await http.post("/api/quotes", fd);

      setOkMsg(`✅ Quote sent. Reference ID: ${data?.id || "N/A"}`);
      setFiles([]);
      setNotes("");
    } catch {
      setErr("Failed to submit quote");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="p-10">Loading…</p>;

  return (
    <form onSubmit={submit} className="p-10 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Get a Quote</h1>

      {err && <p className="text-red-600">{err}</p>}
      {okMsg && <p className="text-green-600">{okMsg}</p>}

      <input
        className="border p-3 w-full"
        placeholder="Your Name"
        value={customerName}
        onChange={e => setCustomerName(e.target.value)}
      />

      <input
        className="border p-3 w-full"
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <select
        className="border p-3 w-full"
        value={serviceName}
        onChange={e => setServiceName(e.target.value)}
      >
        {services.map(s => (
          <option key={s._id} value={s.name}>{s.name}</option>
        ))}
      </select>

      <button
        disabled={sending}
        className="bg-red-600 text-white px-6 py-3 rounded-xl"
      >
        {sending ? "Sending…" : "Submit Quote"}
      </button>
    </form>
  );
}
