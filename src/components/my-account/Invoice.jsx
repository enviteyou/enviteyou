"use client";

import { useEffect, useState } from "react";
import api from "@/api/axios";
import { toast } from "sonner";

function formatCurrency(value) {
  const amount = Number(value || 0) / 100; // stored in paise
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Math.round(amount));
}

export default function Invoice() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .get("/payments/my")
      .then((res) => {
        if (ignore) return;
        const items = Array.isArray(res?.data?.data) ? res.data.data : [];
        setPayments(items);
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
    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ${inv.id}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #111827 }
            .header { display:flex; justify-content:space-between; align-items:center }
            .brand { font-size:20px; font-weight:700 }
            .section { margin-top:18px }
            .label { color:#6b7280; font-size:12px }
            .value { font-size:16px; font-weight:600 }
            .btn { display:inline-block;margin-top:16px;padding:10px 14px;background:#111827;color:#fff;border-radius:6px;text-decoration:none }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">EnviteYou</div>
              <div class="label">Digital Invitation Service</div>
            </div>
            <div>
              <div class="label">Invoice</div>
              <div class="value">EVY-${String(inv.id).slice(-8).toUpperCase()}</div>
            </div>
          </div>

          <div class="section">
            <div class="label">Billed To</div>
            <div class="value">You</div>
          </div>

          <div class="section">
            <div class="label">Description</div>
            <div class="value">Invitation for ${inv.couple || "—"}</div>
            <div class="label">Date</div>
            <div class="value">${new Date(inv.date).toLocaleString()}</div>
            <div class="label">Amount</div>
            <div class="value">${formatCurrency(inv.amount)}</div>
          </div>

          <div class="section">
            <a class="btn" href="${inviteUrl(inv)}">Open invitation</a>
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

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <p className="text-sm text-black/60">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Invoices</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">Payment history</h2>

      {payments.length === 0 ? (
        <p className="mt-3 text-sm text-black/60">No payments found yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-black/50">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Invoice</th>
                <th className="py-2">Couple</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-black/8">
                  <td className="py-3 align-top">{new Date(p.date).toLocaleString()}</td>
                  <td className="py-3 align-top">EVY-{String(p.id).slice(-8).toUpperCase()}</td>
                  <td className="py-3 align-top">{p.couple || '—'}</td>
                  <td className="py-3 align-top">{formatCurrency(p.amount)}</td>
                  <td className="py-3 align-top"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{p.status}</span></td>
                  <td className="py-3 align-top">
                    <div className="flex gap-2">
                      <button onClick={() => openPrintable(p)} className="rounded-md border px-3 py-2 text-sm">View / Print</button>
                      <button onClick={() => downloadInvoice(p)} className="rounded-md border px-3 py-2 text-sm">Download PDF</button>
                      {p.inviteSlug ? (
                        <a href={inviteUrl(p)} target="_blank" rel="noreferrer" className="rounded-md border px-3 py-2 text-sm">Open Invite</a>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
