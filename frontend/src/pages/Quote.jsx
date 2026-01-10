import { useEffect, useMemo, useState } from "react";
import http from "../api/adminHttp";
import { 
  FaUser, FaPhone, FaWhatsapp, FaPaperclip, 
  FaTruck, FaStore, FaFileUpload, FaStickyNote,
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle,
  FaPrint, FaPalette, FaRuler, FaWeight, FaMoneyBillWave
} from "react-icons/fa";

const PHONE = "0662285425";
const WHATSAPP = "94772285425";

// Common options that will always be available
const COMMON_PAPER_TYPES = [
  "Glossy",
  "Matte",
  "Bond Paper",
  "Recycled",
  "Cardstock",
  "Photo Paper",
  "Transparency",
  "Vinyl",
  "Other"
];

const COMMON_COLOR_OPTIONS = [
  "Full Color",
  "Black & White",
  "Grayscale",
  "Spot Color",
  "Pantone Colors",
  "CMYK",
  "RGB"
];

const COMMON_FINISHING_OPTIONS = [
  "Lamination",
  "UV Coating",
  "Gloss Finish",
  "Matte Finish",
  "Spot UV",
  "Embossing",
  "Debossing",
  "Foil Stamping",
  "Die Cutting",
  "Perfect Binding",
  "Saddle Stitch",
  "Wire-O Binding",
  "Corner Rounding",
  "Folding",
  "Numbering",
  "Perforation"
];

export default function Quote() {
  const [services, setServices] = useState([]);
  const [areas, setAreas] = useState([]);
  const [serviceDetails, setServiceDetails] = useState({});

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
  const [uploadProgress, setUploadProgress] = useState({});

  /* ------------------ LOAD DATA ------------------ */
  useEffect(() => {
    (async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          http.get("/api/services"),
          http.get("/api/delivery-areas"),
        ]);

        const servicesData = sRes.data || [];
        const areasData = aRes.data || [];
        
        setServices(servicesData);
        setAreas(areasData);

        // Create service details map with proper fallbacks
        const detailsMap = {};
        servicesData.forEach(service => {
          detailsMap[service.name] = {
            description: service.description || `${service.name} printing service`,
            typicalTurnaround: service.typicalTurnaround || "3-5 business days",
            minQuantity: service.minQuantity || 1,
            popularSizes: service.popularSizes || ["A4 (210x297mm)", "A3 (297x420mm)", "Letter (8.5x11in)"],
            availablePapers: service.availablePapers || COMMON_PAPER_TYPES,
            availableFinishing: service.availableFinishing || COMMON_FINISHING_OPTIONS
          };
        });
        setServiceDetails(detailsMap);

        if (servicesData.length) {
          setServiceName(servicesData[0].name);
        }
      } catch (e) {
        setErr("Failed to load quote form data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ------------------ SERVICE DETAILS ------------------ */
  const currentServiceDetails = useMemo(
    () => serviceDetails[serviceName] || {},
    [serviceName, serviceDetails]
  );

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
    const validFiles = list.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validTypes = ['image/', 'application/pdf', 'application/zip'];
      const isValidType = validTypes.some(type => file.type.startsWith(type));
      
      if (!isValidType) {
        alert(`File ${file.name} has unsupported type. Only images, PDFs, and ZIP files are allowed.`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds 10MB limit.`);
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles.slice(0, 5 - prev.length)]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  /* ------------------ VALIDATION ------------------ */
  const validate = () => {
    if (!customerName.trim()) return "Please enter your name";
    if (!phone.trim()) return "Please enter your phone number";
    if (!/^[0-9+]{10,15}$/.test(phone.replace(/\s/g, ''))) 
      return "Please enter a valid phone number";
    if (!serviceName) return "Please select a service";
    if (Number(quantity) <= 0) return "Quantity must be at least 1";
    if (currentServiceDetails.minQuantity && Number(quantity) < currentServiceDetails.minQuantity)
      return `Minimum quantity for this service is ${currentServiceDetails.minQuantity}`;
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

      const { data } = await http.post("/api/quotes", fd, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress({ percent: percentCompleted });
        }
      });

      setOkMsg(`
        ✅ Quote request submitted successfully!
        Reference ID: ${data?.id || "N/A"}
        We'll contact you via ${contactMethod === 'WhatsApp' ? 'WhatsApp' : 'phone call'} within 24 hours.
      `);
      
      // Reset form
      setFiles([]);
      setNotes("");
      setQuantity(1);
      setSize("");
      setColor("");
      setPaper("");
      setFinishing("");
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErr("Failed to submit quote request. Please try again or contact us directly.");
    } finally {
      setSending(false);
      setUploadProgress({});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quote form…</p>
        </div>
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get a Printing Quote
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you with a detailed quote within 24 hours
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            {['Details', 'Print Specs', 'Delivery', 'Review'].map((step, index) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${index <= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {index + 1}
                </div>
                <span className="mt-2 text-sm font-medium">{step}</span>
              </div>
            ))}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div className="h-full bg-red-600 w-1/2"></div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-8">
          {err && (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 animate-fadeIn">
              <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-800">Attention Required</h3>
                <p className="text-red-700">{err}</p>
              </div>
            </div>
          )}

          {okMsg && (
            <div className="p-6 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-3 animate-fadeIn">
              <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-800">Success!</h3>
                <p className="text-green-700 whitespace-pre-line">{okMsg}</p>
              </div>
            </div>
          )}

          {/* CUSTOMER SECTION */}
          <Section 
            title="Customer Details" 
            icon={<FaUser />}
            description="We'll use this information to contact you with your quote"
          >
            <Input 
              label="Your Full Name *" 
              value={customerName} 
              onChange={setCustomerName}
              placeholder="John Smith"
              icon={<FaUser className="text-gray-400" />}
            />
            <Input 
              label="Phone Number *" 
              value={phone} 
              onChange={setPhone}
              placeholder="0712345678"
              icon={<FaPhone className="text-gray-400" />}
            />
            <div>
              <label className="block font-semibold mb-2">Preferred Contact Method *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: "WhatsApp", icon: <FaWhatsapp />, color: "bg-green-100 border-green-200" },
                  { value: "Call", icon: <FaPhone />, color: "bg-blue-100 border-blue-200" }
                ].map(method => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setContactMethod(method.value)}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                      contactMethod === method.value 
                        ? `${method.color.replace('100', '600')} border-transparent text-white`
                        : `${method.color} hover:border-gray-300`
                    }`}
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span className="font-semibold">{method.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* PRINT DETAILS SECTION */}
          <Section 
            title="Print Details" 
            icon={<FaPrint />}
            description="Tell us what you need printed"
          >
            <div className="space-y-6">
              <Select
                label="Service Type *"
                value={serviceName}
                onChange={setServiceName}
                options={services.map(s => s.name)}
                icon={<FaPrint className="text-gray-400" />}
              />

              {/* Service Details Card */}
              {currentServiceDetails.description && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="font-semibold text-blue-800">{serviceName} Details</p>
                      <p className="text-blue-700">{currentServiceDetails.description}</p>
                      {currentServiceDetails.typicalTurnaround && (
                        <p className="text-sm text-blue-600">
                          <span className="font-semibold">Typical Turnaround:</span> {currentServiceDetails.typicalTurnaround}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Quantity *"
                  type="number"
                  value={quantity}
                  onChange={setQuantity}
                  min={currentServiceDetails.minQuantity || 1}
                  step={1}
                  icon={<FaWeight className="text-gray-400" />}
                  helper={currentServiceDetails.minQuantity ? `Min: ${currentServiceDetails.minQuantity}` : null}
                />
                
                <Input 
                  label="Size" 
                  value={size} 
                  onChange={setSize}
                  placeholder="e.g., A4, 8.5x11, Custom"
                  icon={<FaRuler className="text-gray-400" />}
                  suggestions={currentServiceDetails.popularSizes}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedSelect
                  label="Color Options"
                  value={color}
                  onChange={setColor}
                  options={COMMON_COLOR_OPTIONS}
                  placeholder="Select color option"
                  icon={<FaPalette className="text-gray-400" />}
                  allowCustom={true}
                />
                
                <EnhancedSelect
                  label="Paper Type"
                  value={paper}
                  onChange={setPaper}
                  options={currentServiceDetails.availablePapers || COMMON_PAPER_TYPES}
                  placeholder="Select paper type"
                  icon={<FaPrint className="text-gray-400" />}
                  allowCustom={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedSelect
                  label="Finishing Options"
                  value={finishing}
                  onChange={setFinishing}
                  options={currentServiceDetails.availableFinishing || COMMON_FINISHING_OPTIONS}
                  placeholder="Select finishing option"
                  icon={<FaPalette className="text-gray-400" />}
                  allowCustom={true}
                />
                
                <div className="space-y-4">
                  <label className="block font-semibold text-gray-700">
                    Need help selecting?
                  </label>
                  <p className="text-sm text-gray-600">
                    Not sure about paper or finishing options? Leave blank and our team will recommend the best options for your project.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* DELIVERY SECTION */}
          <Section 
            title="Delivery & Pickup" 
            icon={<FaTruck />}
            description="Choose how you'd like to receive your order"
          >
            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-3">Fulfillment Method *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      value: "Pickup", 
                      icon: <FaStore />, 
                      description: "Collect from our location",
                      details: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
                    },
                    { 
                      value: "Delivery", 
                      icon: <FaTruck />, 
                      description: "We deliver to your address",
                      details: "2-3 business days after completion"
                    }
                  ].map(m => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setFulfillment(m.value)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        fulfillment === m.value
                          ? "border-red-600 bg-red-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          fulfillment === m.value ? "bg-red-100" : "bg-gray-100"
                        }`}>
                          <span className={`text-xl ${
                            fulfillment === m.value ? "text-red-600" : "text-gray-500"
                          }`}>
                            {m.icon}
                          </span>
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg mb-1 ${
                            fulfillment === m.value ? "text-red-800" : "text-gray-800"
                          }`}>
                            {m.value}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">{m.description}</p>
                          <p className="text-gray-500 text-xs">{m.details}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {fulfillment === "Delivery" && (
                <div className="space-y-4 animate-fadeIn">
                  <Select
                    label="Delivery Area *"
                    value={deliveryArea}
                    onChange={setDeliveryArea}
                    options={areas.map(a => a.area)}
                    placeholder="Select your area"
                  />
                  
                  {deliveryFeeLkr > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaMoneyBillWave className="text-green-600" />
                          <div>
                            <p className="font-semibold text-green-800">Delivery Fee</p>
                            <p className="text-sm text-green-600">Applicable for {deliveryArea}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-700">LKR {deliveryFeeLkr.toLocaleString()}</p>
                          <p className="text-xs text-green-600">Included in final quote</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Section>

          {/* FILES SECTION */}
          <Section 
            title="Upload Files" 
            icon={<FaFileUpload />}
            description="Upload your print-ready files (Max 5 files, 10MB each)"
          >
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-red-300 transition-colors">
                <FaPaperclip className="text-3xl text-gray-400 mx-auto mb-4" />
                <p className="font-semibold mb-2">Drag & drop files here</p>
                <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={onFilesChange}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,application/pdf,application/zip"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-red-700 transition-colors"
                >
                  Choose Files
                </label>
                <p className="text-gray-400 text-sm mt-4">
                  Supported: JPG, PNG, PDF, ZIP • Max 10MB per file
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  <p className="font-semibold">
                    Selected Files ({files.length}/5)
                  </p>
                  {files.map((f, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FaPaperclip className="text-gray-400" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{f.name}</p>
                          <p className="text-xs text-gray-500">
                            {(f.size / 1024 / 1024).toFixed(2)} MB • {f.type.split('/')[1].toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* NOTES SECTION */}
          <Section 
            title="Additional Notes" 
            icon={<FaStickyNote />}
            description="Any special instructions or requirements for your order"
          >
            <div className="space-y-4">
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                rows="4"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Please include any special requirements, deadlines, or additional information about your order..."
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaInfoCircle />
                <p>These notes will help us provide you with the most accurate quote</p>
              </div>
            </div>
          </Section>

          {/* SUMMARY & SUBMIT */}
          <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-2xl p-8 border border-amber-200">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Submit</h2>
                <p className="text-gray-600">Review your information before sending</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Order Summary</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-semibold">{serviceName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-semibold">{quantity}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-semibold">{fulfillment}</span>
                    </p>
                    {fulfillment === 'Delivery' && deliveryFeeLkr > 0 && (
                      <p className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee:</span>
                        <span className="font-semibold text-green-700">LKR {deliveryFeeLkr.toLocaleString()}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Print Specifications</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-semibold">{color || 'Not specified'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Paper:</span>
                      <span className="font-semibold">{paper || 'Not specified'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Finishing:</span>
                      <span className="font-semibold">{finishing || 'Not specified'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {sending && uploadProgress.percent && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading files...</span>
                    <span>{uploadProgress.percent}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-300"
                      style={{ width: `${uploadProgress.percent}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  disabled={sending}
                  className="px-12 py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending Quote Request...
                    </span>
                  ) : (
                    "Submit Quote Request"
                  )}
                </button>
                <p className="text-gray-500 text-sm mt-4">
                  By submitting, you agree to our terms of service. We'll contact you within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Contact Info Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <FaPhone className="text-red-600 text-xl mx-auto" />
              <p className="font-semibold">Call Us</p>
              <a href={`tel:${PHONE}`} className="text-gray-600 hover:text-red-600">
                {PHONE}
              </a>
            </div>
            <div className="space-y-2">
              <FaWhatsapp className="text-green-600 text-xl mx-auto" />
              <p className="font-semibold">WhatsApp</p>
              <a 
                href={`https://wa.me/${WHATSAPP}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600"
              >
                +{WHATSAPP}
              </a>
            </div>
            <div className="space-y-2">
              <FaStore className="text-amber-600 text-xl mx-auto" />
              <p className="font-semibold">Visit Us</p>
              <p className="text-gray-600">Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ ENHANCED SELECT COMPONENT ------------------ */
function EnhancedSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  icon,
  allowCustom = false
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === "custom" && allowCustom) {
      setShowCustomInput(true);
      setCustomValue(value || "");
    } else if (selectedValue === "") {
      onChange("");
      setShowCustomInput(false);
    } else {
      onChange(selectedValue);
      setShowCustomInput(false);
    }
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setShowCustomInput(false);
    }
  };

  return (
    <div>
      <label className="block font-semibold mb-2 text-gray-700">{label}</label>
      
      {!showCustomInput ? (
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              {icon}
            </div>
          )}
          <select
            className={`w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all appearance-none bg-white ${
              icon ? 'pl-12' : ''
            }`}
            value={value}
            onChange={handleSelectChange}
          >
            <option value="">{placeholder}</option>
            {options.map((o, index) => (
              <option key={index} value={o}>{o}</option>
            ))}
            {allowCustom && <option value="custom">Custom / Other...</option>}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            {icon && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                {icon}
              </div>
            )}
            <input
              type="text"
              className={`w-full border-2 border-red-500 rounded-xl p-3 focus:ring-2 focus:ring-red-200 transition-all ${
                icon ? 'pl-12' : ''
              }`}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="Enter custom value"
              autoFocus
            />
          </div>
          <button
            type="button"
            onClick={handleCustomSubmit}
            className="px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCustomInput(false);
              onChange("");
            }}
            className="px-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
      
      {options.length === 0 && (
        <p className="text-sm text-gray-500 mt-1">Loading options...</p>
      )}
    </div>
  );
}

/* ------------------ REUSABLE COMPONENTS ------------------ */
function Section({ title, icon, description, children }) {
  return (
    <div className="space-y-6 border rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-red-100 text-red-600">
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function Input({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder, 
  icon, 
  min, 
  step,
  helper,
  suggestions = []
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="relative">
      <label className="block font-semibold mb-2 text-gray-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all ${
            icon ? 'pl-12' : ''
          }`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          step={step}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {suggestions.length > 0 && showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                onClick={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      {helper && (
        <p className="text-xs text-gray-500 mt-1">{helper}</p>
      )}
    </div>
  );
}

function Select({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  icon 
}) {
  return (
    <div>
      <label className="block font-semibold mb-2 text-gray-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            {icon}
          </div>
        )}
        <select
          className={`w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all appearance-none bg-white ${
            icon ? 'pl-12' : ''
          }`}
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((o, index) => (
            <option key={index} value={o}>{o}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ------------------ GLOBAL STYLES ------------------ */
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`;