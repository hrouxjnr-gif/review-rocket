"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useMemo, useState } from "react";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

type DraftData = {
  docType: "Invoice" | "Quote";
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  currency: string;
  taxPercent: number;
  discount: number;
  notes: string;
  paymentTerms: string;
  items: InvoiceItem[];
};

type SavedBusinessDefaults = {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  currency: string;
};

const DRAFT_KEY = "rrr_invoice_draft_v1";

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatMoney(currency: string, value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return `${currency} ${safe.toFixed(2)}`;
}

function normalizeNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

function getInvoiceNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 900 + 100);
  return `INV-${y}${m}${d}-${random}`;
}

const defaultBusinessDefaults: SavedBusinessDefaults = {
  businessName: "",
  businessEmail: "",
  businessPhone: "",
  businessAddress: "",
  currency: "R",
};

export default function InvoicePage() {
  const [hasBooted, setHasBooted] = useState(false);

  const [docType, setDocType] = useState<"Invoice" | "Quote">("Invoice");

  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  const [currency, setCurrency] = useState("R");
  const [taxPercent, setTaxPercent] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState(
    "Payment due within 7 days."
  );

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "item-1",
      description: "Service work completed",
      quantity: 1,
      rate: 0,
    },
  ]);

  const [savedDefaults, setSavedDefaults] =
    useState<SavedBusinessDefaults>(defaultBusinessDefaults);

  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const qty = normalizeNumber(Number(item.quantity));
      const rate = normalizeNumber(Number(item.rate));
      return sum + qty * rate;
    }, 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return subtotal * (normalizeNumber(Number(taxPercent)) / 100);
  }, [subtotal, taxPercent]);

  const total = useMemo(() => {
    return Math.max(subtotal + taxAmount - normalizeNumber(Number(discount)), 0);
  }, [subtotal, taxAmount, discount]);

  useEffect(() => {
    const boot = async () => {
      let draftLoaded = false;

      try {
        const raw = localStorage.getItem(DRAFT_KEY);

        if (raw) {
          const draft = JSON.parse(raw) as DraftData;
          draftLoaded = true;

          setDocType(draft.docType || "Invoice");
          setBusinessName(draft.businessName || "");
          setBusinessEmail(draft.businessEmail || "");
          setBusinessPhone(draft.businessPhone || "");
          setBusinessAddress(draft.businessAddress || "");
          setInvoiceNumber(draft.invoiceNumber || getInvoiceNumber());
          setIssueDate(draft.issueDate || getTodayDate());
          setDueDate(draft.dueDate || getDueDate());
          setClientName(draft.clientName || "");
          setClientEmail(draft.clientEmail || "");
          setClientPhone(draft.clientPhone || "");
          setClientAddress(draft.clientAddress || "");
          setCurrency(draft.currency || "R");
          setTaxPercent(Number(draft.taxPercent || 0));
          setDiscount(Number(draft.discount || 0));
          setNotes(draft.notes || "");
          setPaymentTerms(draft.paymentTerms || "Payment due within 7 days.");
          setItems(
            Array.isArray(draft.items) && draft.items.length > 0
              ? draft.items
              : [
                  {
                    id: createId(),
                    description: "Service work completed",
                    quantity: 1,
                    rate: 0,
                  },
                ]
          );
        }
      } catch (error) {
        console.error("Draft load failed:", error);
      }

      try {
        const res = await fetch("/api/settings");
        const data = await res.json();

        if (data.settings) {
          const loadedDefaults: SavedBusinessDefaults = {
            businessName: data.settings.business_name || "",
            businessEmail: data.settings.business_email || "",
            businessPhone: data.settings.business_phone || "",
            businessAddress: data.settings.business_address || "",
            currency: data.settings.currency || "R",
          };

          setSavedDefaults(loadedDefaults);

          if (!draftLoaded) {
            setBusinessName(loadedDefaults.businessName);
            setBusinessEmail(loadedDefaults.businessEmail);
            setBusinessPhone(loadedDefaults.businessPhone);
            setBusinessAddress(loadedDefaults.businessAddress);
            setCurrency(loadedDefaults.currency);
          }
        }
      } catch (error) {
        console.error("Settings load failed:", error);
      }

      if (!draftLoaded) {
        setInvoiceNumber(getInvoiceNumber());
        setIssueDate(getTodayDate());
        setDueDate(getDueDate());
      }

      setHasBooted(true);
    };

    boot();
  }, []);

  useEffect(() => {
    if (!hasBooted) return;

    try {
      const draft: DraftData = {
        docType,
        businessName,
        businessEmail,
        businessPhone,
        businessAddress,
        invoiceNumber,
        issueDate,
        dueDate,
        clientName,
        clientEmail,
        clientPhone,
        clientAddress,
        currency,
        taxPercent,
        discount,
        notes,
        paymentTerms,
        items,
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error("Draft save failed:", error);
    }
  }, [
    hasBooted,
    docType,
    businessName,
    businessEmail,
    businessPhone,
    businessAddress,
    invoiceNumber,
    issueDate,
    dueDate,
    clientName,
    clientEmail,
    clientPhone,
    clientAddress,
    currency,
    taxPercent,
    discount,
    notes,
    paymentTerms,
    items,
  ]);

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "rate"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: createId(),
        description: "",
        quantity: 1,
        rate: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      if (prev.length === 1) {
        return prev;
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const applySavedBusinessDefaults = () => {
    setBusinessName(savedDefaults.businessName);
    setBusinessEmail(savedDefaults.businessEmail);
    setBusinessPhone(savedDefaults.businessPhone);
    setBusinessAddress(savedDefaults.businessAddress);
    setCurrency(savedDefaults.currency);
    setMessage("Saved business defaults applied.");
  };

  const fillDemo = () => {
    setDocType("Invoice");
    setBusinessName("Blue Peak Plumbing");
    setBusinessEmail("accounts@bluepeakdemo.com");
    setBusinessPhone("+61 8 7000 1234");
    setBusinessAddress("100 Example Street\nAdelaide SA 5000");
    setInvoiceNumber(getInvoiceNumber());
    setIssueDate(getTodayDate());
    setDueDate(getDueDate());
    setClientName("Taylor Smith");
    setClientEmail("taylor.smith@examplemail.com");
    setClientPhone("+61 4 1234 5678");
    setClientAddress("25 Sample Avenue\nProspect SA 5082");
    setCurrency("AUD");
    setTaxPercent(0);
    setDiscount(0);
    setNotes("Thank you for your business.");
    setPaymentTerms("Payment due within 7 days.");
    setItems([
      {
        id: createId(),
        description: "Leak detection and repair",
        quantity: 1,
        rate: 220,
      },
      {
        id: createId(),
        description: "Callout fee",
        quantity: 1,
        rate: 60,
      },
      {
        id: createId(),
        description: "Parts and fittings",
        quantity: 1,
        rate: 85,
      },
    ]);
    setMessage("Demo invoice loaded.");
  };

  const resetInvoice = () => {
    setDocType("Invoice");
    setBusinessName(savedDefaults.businessName);
    setBusinessEmail(savedDefaults.businessEmail);
    setBusinessPhone(savedDefaults.businessPhone);
    setBusinessAddress(savedDefaults.businessAddress);
    setInvoiceNumber(getInvoiceNumber());
    setIssueDate(getTodayDate());
    setDueDate(getDueDate());
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientAddress("");
    setCurrency(savedDefaults.currency || "R");
    setTaxPercent(0);
    setDiscount(0);
    setNotes("");
    setPaymentTerms("Payment due within 7 days.");
    setItems([
      {
        id: createId(),
        description: "Service work completed",
        quantity: 1,
        rate: 0,
      },
    ]);
    setMessage("Invoice reset.");
    setCopied(false);

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error(error);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const buildInvoiceText = () => {
    const lines = items.map((item) => {
      const lineTotal =
        normalizeNumber(Number(item.quantity)) *
        normalizeNumber(Number(item.rate));

      return `${item.description || "Item"} — ${item.quantity} x ${formatMoney(
        currency,
        Number(item.rate)
      )} = ${formatMoney(currency, lineTotal)}`;
    });

    return [
      `${docType}: ${invoiceNumber}`,
      `Issue date: ${issueDate}`,
      `Due date: ${dueDate}`,
      "",
      `From: ${businessName}`,
      businessEmail,
      businessPhone,
      businessAddress,
      "",
      `To: ${clientName}`,
      clientEmail,
      clientPhone,
      clientAddress,
      "",
      ...lines,
      "",
      `Subtotal: ${formatMoney(currency, subtotal)}`,
      `Tax: ${formatMoney(currency, taxAmount)}`,
      `Discount: ${formatMoney(currency, Number(discount))}`,
      `Total: ${formatMoney(currency, total)}`,
      "",
      `Notes: ${notes}`,
      `Payment terms: ${paymentTerms}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const copyInvoiceText = async () => {
    try {
      await navigator.clipboard.writeText(buildInvoiceText());
      setCopied(true);
      setMessage("Invoice copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
      setMessage("Copy failed.");
    }
  };

  const sendWhatsApp = () => {
    const text = buildInvoiceText();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const sendEmail = () => {
    const subject = `${docType} ${invoiceNumber} from ${
      businessName || "Your Business Name"
    }`;
    const body = buildInvoiceText();
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div style={{ marginTop: 40, display: "grid", gap: 22 }}>
          <section className="card" style={{ marginBottom: 0 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr",
                gap: 24,
                alignItems: "start",
              }}
              className="invoice-top-grid"
            >
              <div>
                <span className="badge">Invoice Tool</span>

                <h1
                  style={{
                    fontSize: "42px",
                    lineHeight: "1.08",
                    fontWeight: 800,
                    marginBottom: 14,
                    maxWidth: 760,
                  }}
                >
                  Create professional invoices and quotes that are fast to use and easy to send.
                </h1>

                <p
                  className="muted-text"
                  style={{
                    fontSize: 18,
                    lineHeight: 1.8,
                    maxWidth: 760,
                  }}
                >
                  This tool stays free on every plan. Build an invoice or quote,
                  preview it live, then print it, save it as PDF, copy it, or send
                  the text by WhatsApp or email.
                </p>

                <div className="button-row" style={{ marginTop: 20 }}>
                  <button className="btn" onClick={printInvoice}>
                    Print / Save PDF
                  </button>

                  <button className="btn-outline" onClick={copyInvoiceText}>
                    {copied ? "Copied" : "Copy Invoice"}
                  </button>

                  <button className="btn-outline" onClick={sendWhatsApp}>
                    WhatsApp
                  </button>

                  <button className="btn-outline" onClick={sendEmail}>
                    Email
                  </button>

                  <button className="btn-outline" onClick={fillDemo}>
                    Load Demo
                  </button>

                  <button
                    className="btn-outline"
                    onClick={applySavedBusinessDefaults}
                  >
                    Use Saved Business Details
                  </button>

                  <button className="btn-outline" onClick={resetInvoice}>
                    Reset
                  </button>
                </div>

                {message && (
                  <p style={{ marginTop: 16, fontWeight: 700 }}>{message}</p>
                )}
              </div>

              <div className="list-card" style={{ display: "grid", gap: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 20 }}>
                  What this page is for
                </p>

                <div className="info-list">
                  <div className="muted-text info-line">
                    • Create a formal invoice after a job is done
                  </div>
                  <div className="muted-text info-line">
                    • Create a quote before work starts
                  </div>
                  <div className="muted-text info-line">
                    • Print or save a PDF without paying extra
                  </div>
                  <div className="muted-text info-line">
                    • Auto-fill your saved business details from Settings
                  </div>
                  <div className="muted-text info-line">
                    • Send the invoice text by WhatsApp or Email
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "0.95fr 1.05fr",
              gap: 22,
              alignItems: "start",
            }}
            className="invoice-main-grid"
          >
            <div style={{ display: "grid", gap: 22 }}>
              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <h2 className="section-title" style={{ marginBottom: 18 }}>
                  Document setup
                </h2>

                <div style={{ display: "grid", gap: 14 }}>
                  <select
                    value={docType}
                    onChange={(e) =>
                      setDocType(e.target.value as "Invoice" | "Quote")
                    }
                  >
                    <option value="Invoice">Invoice</option>
                    <option value="Quote">Quote</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Invoice / quote number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                    className="invoice-two-grid"
                  >
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                    />

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Currency symbol or code"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </div>
              </div>

              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <h2 className="section-title" style={{ marginBottom: 0 }}>
                    Your business details
                  </h2>

                  <button
                    className="btn-outline"
                    onClick={applySavedBusinessDefaults}
                  >
                    Fill from Settings
                  </button>
                </div>

                <div style={{ display: "grid", gap: 14 }}>
                  <input
                    type="text"
                    placeholder="Business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Business email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Business phone"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                  />

                  <textarea
                    rows={4}
                    placeholder="Business address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                  />

                  <p className="muted-text">
                    These fields can auto-fill from your Settings page.
                  </p>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <h2 className="section-title" style={{ marginBottom: 18 }}>
                  Client details
                </h2>

                <div style={{ display: "grid", gap: 14 }}>
                  <input
                    type="text"
                    placeholder="Client name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Client email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Client phone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />

                  <textarea
                    rows={4}
                    placeholder="Client address"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <h2 className="section-title" style={{ marginBottom: 0 }}>
                    Line items
                  </h2>

                  <button className="btn-outline" onClick={addItem}>
                    Add line item
                  </button>
                </div>

                <div style={{ display: "grid", gap: 16 }}>
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="list-card"
                      style={{ display: "grid", gap: 12 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <p style={{ fontWeight: 800 }}>Item {index + 1}</p>

                        {items.length > 1 && (
                          <button
                            className="btn-outline"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                      />

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                        }}
                        className="invoice-two-grid"
                      >
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Quantity"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", e.target.value)
                          }
                        />

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(item.id, "rate", e.target.value)
                          }
                        />
                      </div>

                      <p className="muted-text" style={{ fontWeight: 700 }}>
                        Line total:{" "}
                        {formatMoney(
                          currency,
                          normalizeNumber(Number(item.quantity)) *
                            normalizeNumber(Number(item.rate))
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <h2 className="section-title" style={{ marginBottom: 18 }}>
                  Totals and notes
                </h2>

                <div style={{ display: "grid", gap: 14 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                    className="invoice-two-grid"
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Tax %"
                      value={taxPercent}
                      onChange={(e) =>
                        setTaxPercent(Number(e.target.value) || 0)
                      }
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Discount"
                      value={discount}
                      onChange={(e) =>
                        setDiscount(Number(e.target.value) || 0)
                      }
                    />
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Notes for the client"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <textarea
                    rows={4}
                    placeholder="Payment terms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 22 }}>
              <div
                className="card"
                style={{ marginBottom: 0, padding: 30 }}
                id="invoice-preview"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 18,
                    flexWrap: "wrap",
                    marginBottom: 26,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                        opacity: 0.8,
                      }}
                    >
                      {docType}
                    </p>

                    <h2
                      style={{
                        fontSize: 34,
                        lineHeight: 1.05,
                        fontWeight: 900,
                        marginBottom: 8,
                      }}
                    >
                      {businessName || "Your Business Name"}
                    </h2>

                    <div className="muted-text" style={{ lineHeight: 1.8 }}>
                      {businessEmail && <div>{businessEmail}</div>}
                      {businessPhone && <div>{businessPhone}</div>}
                      {businessAddress && (
                        <div style={{ whiteSpace: "pre-wrap" }}>
                          {businessAddress}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="list-card"
                    style={{
                      minWidth: 240,
                      display: "grid",
                      gap: 10,
                      alignContent: "start",
                    }}
                  >
                    <div>
                      <div className="muted-text">Number</div>
                      <div style={{ fontWeight: 800 }}>
                        {invoiceNumber || "-"}
                      </div>
                    </div>

                    <div>
                      <div className="muted-text">Issue date</div>
                      <div style={{ fontWeight: 800 }}>{issueDate || "-"}</div>
                    </div>

                    <div>
                      <div className="muted-text">Due date</div>
                      <div style={{ fontWeight: 800 }}>{dueDate || "-"}</div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 18,
                    marginBottom: 26,
                  }}
                  className="invoice-two-grid"
                >
                  <div className="list-card">
                    <div className="muted-text" style={{ marginBottom: 8 }}>
                      Bill to
                    </div>

                    <div style={{ fontWeight: 800, marginBottom: 6 }}>
                      {clientName || "Client name"}
                    </div>

                    <div className="muted-text" style={{ lineHeight: 1.8 }}>
                      {clientEmail && <div>{clientEmail}</div>}
                      {clientPhone && <div>{clientPhone}</div>}
                      {clientAddress && (
                        <div style={{ whiteSpace: "pre-wrap" }}>
                          {clientAddress}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="list-card">
                    <div className="muted-text" style={{ marginBottom: 8 }}>
                      Summary
                    </div>

                    <div className="muted-text" style={{ lineHeight: 1.9 }}>
                      <div>Items: {items.length}</div>
                      <div>
                        Tax: {normalizeNumber(Number(taxPercent)).toFixed(2)}%
                      </div>
                      <div>
                        Discount: {formatMoney(currency, Number(discount))}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 18,
                    overflow: "hidden",
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.25fr 0.3fr 0.45fr 0.45fr",
                      gap: 12,
                      padding: "14px 18px",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      fontWeight: 800,
                    }}
                    className="invoice-table-head"
                  >
                    <div>Description</div>
                    <div>Qty</div>
                    <div>Rate</div>
                    <div>Total</div>
                  </div>

                  {items.map((item) => {
                    const lineTotal =
                      normalizeNumber(Number(item.quantity)) *
                      normalizeNumber(Number(item.rate));

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.25fr 0.3fr 0.45fr 0.45fr",
                          gap: 12,
                          padding: "14px 18px",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                        className="invoice-table-row"
                      >
                        <div>{item.description || "Untitled item"}</div>
                        <div>{normalizeNumber(Number(item.quantity))}</div>
                        <div>{formatMoney(currency, Number(item.rate))}</div>
                        <div>{formatMoney(currency, lineTotal)}</div>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 320px",
                    gap: 20,
                    alignItems: "start",
                  }}
                  className="invoice-totals-grid"
                >
                  <div style={{ display: "grid", gap: 18 }}>
                    <div className="list-card">
                      <div className="muted-text" style={{ marginBottom: 8 }}>
                        Notes
                      </div>
                      <div style={{ lineHeight: 1.8 }}>
                        {notes || "No notes added."}
                      </div>
                    </div>

                    <div className="list-card">
                      <div className="muted-text" style={{ marginBottom: 8 }}>
                        Payment terms
                      </div>
                      <div style={{ lineHeight: 1.8 }}>
                        {paymentTerms || "No payment terms added."}
                      </div>
                    </div>
                  </div>

                  <div
                    className="list-card"
                    style={{ display: "grid", gap: 12 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <span className="muted-text">Subtotal</span>
                      <strong>{formatMoney(currency, subtotal)}</strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <span className="muted-text">Tax</span>
                      <strong>{formatMoney(currency, taxAmount)}</strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <span className="muted-text">Discount</span>
                      <strong>{formatMoney(currency, Number(discount))}</strong>
                    </div>

                    <div
                      style={{
                        height: 1,
                        background: "rgba(255,255,255,0.08)",
                        margin: "4px 0",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 20,
                      }}
                    >
                      <span style={{ fontWeight: 900 }}>
                        {docType === "Quote" ? "Quoted total" : "Total due"}
                      </span>
                      <strong style={{ fontWeight: 900 }}>
                        {formatMoney(currency, total)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                }}
                className="invoice-metrics-grid"
              >
                <div className="card" style={{ marginBottom: 0 }}>
                  <p className="muted-text" style={{ marginBottom: 8 }}>
                    Subtotal
                  </p>
                  <h3 style={{ fontSize: 28, fontWeight: 800 }}>
                    {formatMoney(currency, subtotal)}
                  </h3>
                </div>

                <div className="card" style={{ marginBottom: 0 }}>
                  <p className="muted-text" style={{ marginBottom: 8 }}>
                    Tax
                  </p>
                  <h3 style={{ fontSize: 28, fontWeight: 800 }}>
                    {formatMoney(currency, taxAmount)}
                  </h3>
                </div>

                <div className="card" style={{ marginBottom: 0 }}>
                  <p className="muted-text" style={{ marginBottom: 8 }}>
                    Total
                  </p>
                  <h3 style={{ fontSize: 28, fontWeight: 800 }}>
                    {formatMoney(currency, total)}
                  </h3>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .invoice-top-grid,
          .invoice-main-grid,
          .invoice-totals-grid,
          .invoice-metrics-grid {
            grid-template-columns: 1fr !important;
          }

          .invoice-two-grid {
            grid-template-columns: 1fr !important;
          }

          .invoice-table-head {
            display: none !important;
          }

          .invoice-table-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }

          .site-header,
          .badge,
          .button-row,
          .invoice-top-grid > div:first-child,
          .invoice-main-grid > div:first-child,
          .invoice-metrics-grid,
          .support-card-link {
            display: none !important;
          }

          .page-shell,
          .page-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }

          .invoice-main-grid,
          .invoice-top-grid {
            display: block !important;
          }

          #invoice-preview {
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
            width: 100% !important;
          }

          #invoice-preview .list-card,
          #invoice-preview .card {
            background: white !important;
            border: 1px solid #ddd !important;
            color: black !important;
            box-shadow: none !important;
          }

          #invoice-preview .muted-text {
            color: #444 !important;
          }
        }
      `}</style>
    </main>
  );
}