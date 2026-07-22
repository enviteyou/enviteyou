"use client";

import { useEffect, useState } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";

function formatCurrency(value) {
  const amount = Number(value || 0) / 100; // stored in paise
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Math.round(amount));
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusStyles(status) {
  const normalized = String(status || "unknown").toLowerCase();
  if (normalized === "paid") {
    return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
  }
  if (normalized === "failed") {
    return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
  }
  return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
}

export default function Invoice() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .get("/payments/my")
      .then((res) => {
        if (ignore) return;
        const items = Array.isArray(res?.data?.data) ? res.data.data : [];
        setPayments(items);
        if (items.length > 0) {
          setSelectedPaymentId(items[0].id);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Unable to load payments");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => (ignore = true);
  }, []);

  function openPrintable(inv) {
    const coupleName = inv.couple || "—";
    const invoiceNo = `EVY-${String(inv.id).slice(-8).toUpperCase()}`;
    const invoiceHtml = `
      <html>
        <head>
          <title>${invoiceNo}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 32px;
              font-family: Inter, Arial, Helvetica, sans-serif;
              color: #111827;
              background: #f9fafb;
            }
            .sheet {
              max-width: 920px;
              margin: 0 auto;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 20px;
              padding: 32px;
              box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 24px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e5e7eb;
            }
            .brand-row {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            .logo {
              width: 64px;
              height: 64px;
              object-fit: contain;
              border-radius: 16px;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              padding: 8px;
            }
            .brand {
              font-size: 28px;
              font-weight: 800;
              letter-spacing: -0.04em;
            }
            .muted {
              color: #6b7280;
              font-size: 12px;
              line-height: 1.6;
            }
            .invoice-box {
              min-width: 220px;
              padding: 16px 18px;
              border-radius: 16px;
              background: linear-gradient(135deg, #111827, #374151);
              color: #fff;
            }
            .invoice-box .label {
              color: rgba(255,255,255,0.7);
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.14em;
            }
            .invoice-box .value {
              margin-top: 6px;
              font-size: 16px;
              font-weight: 700;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 16px;
              margin-top: 24px;
            }
            .card {
              border: 1px solid #e5e7eb;
              border-radius: 16px;
              padding: 16px;
              background: #f9fafb;
            }
            .label {
              color: #6b7280;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.12em;
            }
            .value {
              margin-top: 6px;
              font-size: 15px;
              font-weight: 700;
            }
            .details {
              margin-top: 24px;
              border: 1px solid #e5e7eb;
              border-radius: 18px;
              overflow: hidden;
            }
            .details table {
              width: 100%;
              border-collapse: collapse;
            }
            .details th, .details td {
              padding: 14px 16px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
              font-size: 14px;
            }
            .details th {
              width: 28%;
              background: #f9fafb;
              color: #6b7280;
              font-weight: 700;
            }
            .summary {
              margin-top: 24px;
              display: flex;
              justify-content: space-between;
              gap: 16px;
              align-items: center;
              padding: 18px 20px;
              border-radius: 18px;
              background: linear-gradient(135deg, #f8fafc, #eef2ff);
              border: 1px solid #e5e7eb;
            }
            .amount {
              font-size: 26px;
              font-weight: 800;
              letter-spacing: -0.04em;
            }
            .footer {
              margin-top: 28px;
              padding-top: 18px;
              border-top: 1px dashed #d1d5db;
              color: #6b7280;
              font-size: 12px;
              text-align: center;
            }
            .btn {
              display: inline-block;
              margin-top: 16px;
              padding: 10px 14px;
              background: #111827;
              color: #fff;
              border-radius: 999px;
              text-decoration: none;
              font-weight: 700;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <div>
                <div class="brand-row">
                  <img class="logo" src="/logo.png" alt="EnviteYou logo" />
                  <div>
                    <div class="brand">EnviteYou</div>
                    <div class="muted">Digital invitation platform</div>
                  </div>
                </div>
                <div class="muted">Invoice generated for your invitation purchase</div>
              </div>
              <div class="invoice-box">
                <div class="label">Invoice</div>
                <div class="value">${invoiceNo}</div>
                <div class="muted" style="color: rgba(255,255,255,0.75); margin-top: 8px;">${formatDate(inv.date)}</div>
              </div>
            </div>

            <div class="grid">
              <div class="card">
                <div class="label">Billed To</div>
                <div class="value">You</div>
                <div class="muted">EnviteYou customer account</div>
              </div>
              <div class="card">
                <div class="label">Invitation</div>
                <div class="value">${coupleName}</div>
                <div class="muted">Created and paid successfully</div>
              </div>
            </div>

            <div class="details">
              <table>
                <tr><th>Date</th><td>${formatDate(inv.date)}</td></tr>
                <tr><th>Invoice No</th><td>${invoiceNo}</td></tr>
                <tr><th>Payment ID</th><td>${inv.razorpayPaymentId || 'N/A'}</td></tr>
                <tr><th>Order ID</th><td>${inv.razorpayOrderId || 'N/A'}</td></tr>
                <tr><th>Status</th><td>${String(inv.status || '').toUpperCase()}</td></tr>
              </table>
            </div>

            <div class="summary">
              <div>
                <div class="label">Total Paid</div>
                <div class="amount">${formatCurrency(inv.amount)}</div>
              </div>
              <div style="text-align: right;">
                <div class="muted">Invitation URL</div>
                <a class="btn" href="${inviteUrl(inv)}">Open invitation</a>
              </div>
            </div>

            <div class="footer">
              Thank you for using EnviteYou. This is a system-generated invoice.
            </div>
          </div>
        </body>
      </html>
    `;

    const w = window.open("", "_blank", "noopener,noreferrer,width=800,height=900");
    if (!w) {
      toast.error("Popup blocked: allow popups to view invoices");
      return;
    }
    w.document.write(invoiceHtml);
    w.document.close();
    // wait a moment and then call print
    setTimeout(() => w.print(), 500);
  }

  function inviteUrl(inv) {
    return `${window.location.origin}/invite/${encodeURIComponent(inv.inviteSlug)}`;
  }

  async function downloadInvoice(inv) {
    try {
      const res = await api.get(`/payments/${inv.id}/invoice`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${inv.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to download invoice');
    }
  }

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId) || payments[0] || null;

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <p className="text-sm text-black/60">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row / Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">Invoices</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black sm:text-3xl">Payment history</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
              Review every paid invitation, open the invite, print a copy, or download a standard PDF invoice.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-72">
            <div className="rounded-2xl border border-black/8 bg-[#fbfbfa] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">Total invoices</p>
              <p className="mt-2 text-2xl font-semibold text-black">{payments.length}</p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-[#fbfbfa] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">Paid amount</p>
              <p className="mt-2 text-2xl font-semibold text-black">
                {formatCurrency(payments.reduce((sum, item) => sum + Number(item.amount || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/15 bg-white p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">No payments found</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-black">No payments found yet</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-black/60">
            Once you pay for an invitation, it will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left Column: Payments list */}
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-black">Payments</h3>
                <p className="text-xs text-black/50">Click on any payment to view full details</p>
              </div>
              <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                {payments.length} Payments
              </span>
            </div>

            <div className="divide-y divide-black/10">
              {payments.map((p) => {
                const selected = selectedPaymentId === p.id;
                const inviteLink = `${window.location.origin}/invite/${encodeURIComponent(p.inviteSlug || "")}`;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPaymentId(p.id)}
                    className={`cursor-pointer transition-all duration-200 ${
                      selected ? "bg-[#faf8f2]" : "hover:bg-black/[0.01]"
                    }`}
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-base font-semibold text-black">{p.couple || "—"}</h4>
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                              Paid
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-black/50">Wedding Invitation</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-black">{formatCurrency(p.amount)}</p>
                          <p className="mt-1 text-xs text-black/50">{formatDate(p.date)}</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-black/10 bg-[#fbfbfa] p-4">
                        <p className="truncate text-xs font-medium text-black/75">{inviteLink}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(inviteLink);
                            toast.success("Link copied!");
                          }}
                          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm hover:bg-amber-50/50"
                        >
                          <Copy className="h-3 w-3" />
                          Copy Link
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs text-black/50">
                          Transaction ID: <span className="font-semibold text-black/85">EVY-{String(p.id).slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadInvoice(p);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-black px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-black/85"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Payment Details Card */}
          <section className="rounded-3xl border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.05)] self-start">
            <div className="border-b border-black/10 px-5 py-4">
              <h2 className="text-lg font-semibold tracking-tight text-black">Payment Details</h2>
            </div>
            <div className="p-5">
              {selectedPayment ? (
                <div className="space-y-4 text-sm text-black/65">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-full border border-black/10 bg-black/5 flex items-center justify-center">
                      {selectedPayment.coverImage ? (
                        <img
                          src={selectedPayment.coverImage}
                          alt="cover"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-xs text-black/30 font-semibold uppercase">EV</div>
                      )}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-black">{selectedPayment.couple || "—"}</p>
                      <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Paid</span>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-black/10 bg-[#fbfbfa] p-4 text-xs">
                    <div>
                      <p className="font-semibold uppercase tracking-[0.18em] text-black/40">Couple</p>
                      <p className="mt-1 font-semibold text-black">{selectedPayment.couple || "—"}</p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.18em] text-black/40">Amount</p>
                      <p className="mt-1 font-semibold text-black">{formatCurrency(selectedPayment.amount)}</p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.18em] text-black/40">Status</p>
                      <p className="mt-1 font-semibold text-black capitalize">{selectedPayment.status}</p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.18em] text-black/40">Payment Date</p>
                      <p className="mt-1 font-semibold text-black">{formatDate(selectedPayment.date)}</p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.18em] text-black/40">Template Link</p>
                      <p className="mt-1 break-all font-semibold text-black">{`${window.location.origin}/invite/${encodeURIComponent(selectedPayment.inviteSlug || "")}`}</p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.18em] text-black/40">Transaction ID</p>
                      <p className="mt-1 font-semibold text-black">EVY-{String(selectedPayment.id).slice(-8).toUpperCase()}</p>
                    </div>
                    {selectedPayment.razorpayPaymentId ? (
                      <div>
                        <p className="font-semibold uppercase tracking-[0.18em] text-black/40">Razorpay Payment ID</p>
                        <p className="mt-1 font-semibold text-black">{selectedPayment.razorpayPaymentId}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() => downloadInvoice(selectedPayment)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-black/85"
                    >
                      <Download className="h-4 w-4" />
                      Download Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => openPrintable(selectedPayment)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-black transition hover:bg-black/5"
                    >
                      View / Print
                    </button>
                    {selectedPayment.inviteSlug ? (
                      <button
                        type="button"
                        onClick={() => window.open(`/invite/${selectedPayment.inviteSlug}`, "_blank", "noopener,noreferrer")}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-black transition hover:bg-black/5"
                      >
                        Open Invitation
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-black/55 text-center">Select a payment from the list to view details.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
