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
  const [notes, setNotes] = useState("");
  const [fulfillment, setFulfillment] = useState("Pickup");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [s, a] = await Promise.all([
          http.get("/api/services"),
          http.get("/api/delivery-areas"),
        ]);
        setServices(s.data || []);
        setAreas(a.data || []);
        if (s.data?.length) setServiceName(s.data[0].name);
      } catch {
        setErr("Failed to load form data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const deliveryFee = useMemo(() => {
    if (fulfillment !== "Delivery") return 0;
    return areas.find(x => x.area === deliveryArea)?.feeLkr || 0;
  }, [areas, fulfillment, deliveryArea]);

  const submit = async e => {
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
      fd.append("notes", notes);
      fd.append("fulfillment", fulfillment);
      fd.append("deliveryArea", deliveryArea);
      fd.append("deliveryFeeLkr", deliveryFee);
      files.forEach(f => fd.append("files", f));

      const { data } = await http.post("/api/quotes", fd);
      setOkMsg(`Quote sent successfully. Ref: ${data?.id || "N/A"}`);
      setNotes("");
      setFiles([]);
    } catch {
      setErr("Failed to submit quote");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="p-10">Loading…</p>;

  return (
    <form onSubmit={submit} className="p-10 max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-center">Get a Quote</h1>

      {err && <p className="text-red-600">{err}</p>}
      {okMsg && <p className="text-green-600">{okMsg}</p>}

      <input className="border p-3 w-full" placeholder="Name"
        value={customerName} onChange={e => setCustomerName(e.target.value)} />

      <input className="border p-3 w-full" placeholder="Phone"
        value={phone} onChange={e => setPhone(e.target.value)} />

      <select className="border p-3 w-full"
        value={serviceName} onChange={e => setServiceName(e.target.value)}>
        {services.map(s => (
          <option key={s._id} value={s.name}>{s.name}</option>
        ))}
      </select>

      <textarea className="border p-3 w-full"
        placeholder="Notes"
        value={notes}
        onChange={e => setNotes(e.target.value)} />

      <button disabled={sending}
        className="bg-red-600 text-white px-6 py-3 rounded-xl w-full">
        {sending ? "Sending…" : "Submit Quote"}
      </button>
    </form>
  );
}
