"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/api/axios";
import { normalizeTemplates } from "@/lib/templateService";
import TemplateCustomizer from "@/components/TemplateCustomizer";
import TemplateDetail from "@/components/TemplateDetail";
import TemplateForm from "@/components/TemplateForm";
import PhotoSelectionManager from "./PhotoSelectionManager";
import { Button } from "@/components/ui/button";
import { CalendarDays, Copy, ExternalLink, Eye, IndianRupee, LayoutGrid, Megaphone, MessageSquareMore, Monitor, Search, Sparkles, Users } from "lucide-react";
import Image from "next/image";

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function SectionCard({ title, children, className = "" }) {
  return (
    <section className={`rounded-[1.5rem] border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ${className}`}>
      {title ? <div className="border-b border-black/8 px-5 py-4"><h2 className="text-xl font-semibold tracking-tight text-black">{title}</h2></div> : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

function Metric({ label, value, icon: Icon, hint }) {
  return (
    <div className="rounded-[1.35rem] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-black">{value}</p>
          {hint ? <p className="mt-2 text-sm text-black/55">{hint}</p> : null}
        </div>
        {Icon ? <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5efe0] text-[#b7882f]"><Icon className="h-5 w-5" /></div> : null}
      </div>
    </div>
  );
}

function TemplateGridCard({ template, selected, onSelect, onUse }) {
  return (
    <div
      className={`group overflow-hidden rounded-[1.35rem] border bg-white text-left shadow-[0_18px_50px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 ${selected ? "border-black" : "border-black/10"}`}
    >
      <div className="cursor-pointer" onClick={onSelect}>
        <div className="aspect-4/3 overflow-hidden bg-black/5">
          {template?.preview ? <Image src={template.preview} alt={template.name} width={400}
            height={400} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-black/45">No preview</div>}
        </div>
        <div className="p-4 pb-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-black">{template.name}</h3>
              <p className="text-sm text-black/55">{template.tag}</p>
            </div>
            <span className="rounded-full border border-black/10 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black/50">{template.category}</span>
          </div>
        </div>
      </div>
      <div className="p-4 pt-2">
        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="rounded-full border border-black/10 px-3 py-1.5 font-medium text-black/70">Vendor Price {formatCurrency(template.vendorPrice || template.sellPrice)}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUse?.(template);
            }}
            className="rounded-full bg-black px-3 py-1.5 font-medium text-white hover:bg-black/90 cursor-pointer"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}

function InvitationTable({ invitations, onSelect, selectedId, onDownload }) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
      <div className="border-b border-black/8 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Payment History</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-black/2 text-black/50">
            <tr>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Couple Name</th>
              <th className="px-5 py-4 font-medium">Invitation Link</th>
              <th className="px-5 py-4 font-medium">Amount</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((item) => {
              const selected = selectedId === item._id;
              const slug = item.slug || `${String(item.bride || "invite").toLowerCase()}-${String(item.groom || "weds").toLowerCase()}`;
              return (
                <tr key={item._id} className={`border-t border-black/8 ${selected ? "bg-[#f6efdf]" : "hover:bg-black/3"}`} onClick={() => onSelect(item)}>
                  <td className="px-5 py-4 whitespace-nowrap text-black/70">{formatDate(item.createdAt)}</td>
                  <td className="px-5 py-4 font-medium text-black">{item.bride} &amp; {item.groom}</td>
                  <td className="px-5 py-4 text-black/60">
                    <span className="break-all">enviteyou.com/invitations/{slug}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-black">{formatCurrency(item.amountPaid ? item.amountPaid / 100 : 400)}</td>
                  <td className="px-5 py-4"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Paid</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 text-black/65">
                      <button type="button" className="inline-flex items-center gap-1 hover:text-black"><Eye className="h-4 w-4" /> View Details</button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); onDownload?.(item._id); }} className="inline-flex items-center gap-1 hover:text-black"><ExternalLink className="h-4 w-4" /> Download</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function VendorDashboardView({ activeTab = "dashboard" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({});
  const [formTab, setFormTab] = useState("Essentials");
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTemplate = templates.find((template) => String(template.templateId || template.id) === String(selectedTemplateId)) || templates[0] || null;
  const selectedInvitation = invitations.find((invitation) => invitation._id === selectedInvitationId) || invitations[0] || null;

  useEffect(() => {
    const needsTemplates = ["dashboard", "create-new-template", "template-library"].includes(activeTab);
    if (!needsTemplates) return;

    let ignore = false;
    setLoadingTemplates(true);
    api
      .get("/templates")
      .then((response) => {
        if (ignore) return;
        const rawTemplates = Array.isArray(response?.data) ? response.data : Array.isArray(response?.data?.data) ? response.data.data : [];
        const normalized = normalizeTemplates(rawTemplates);
        setTemplates(normalized);

        const paramTemplate = searchParams?.get("template") || searchParams?.get("templateId") || "";
        const firstId = paramTemplate || normalized[0]?.templateId || normalized[0]?.id || null;
        if (firstId) {
          setSelectedTemplateId(String(firstId));
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Unable to load templates");
      })
      .finally(() => {
        if (!ignore) setLoadingTemplates(false);
      });

    return () => {
      ignore = true;
    };
  }, [activeTab, searchParams]);

  useEffect(() => {
    const needsInvitations = ["dashboard", "my-templates", "payments", "clients"].includes(activeTab);
    if (!needsInvitations) return;

    let ignore = false;
    setLoadingInvitations(true);
    api
      .get("/invitations/getMyInvitations/vendor")
      .then((response) => {
        if (ignore) return;
        const items = Array.isArray(response?.data?.data) ? response.data.data : Array.isArray(response?.data) ? response.data : [];
        setInvitations(items);
        if (items[0]?._id) setSelectedInvitationId(items[0]._id);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Unable to load invitations");
      })
      .finally(() => {
        if (!ignore) setLoadingInvitations(false);
      });

    return () => {
      ignore = true;
    };
  }, [activeTab]);

  const filteredTemplates = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return templates;
    return templates.filter((template) => [template.name, template.category, template.description, template.tag].some((value) => String(value || "").toLowerCase().includes(term)));
  }, [templates, query]);

  const handleDownloadInvoice = async (invitationId) => {
    try {
      const res = await api.get(`/payments/${invitationId}/invoice?isVendor=true`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invitationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to download invoice');
    }
  };

  const totalRevenue = invitations.reduce((sum, item) => sum + (item.amountPaid ? item.amountPaid / 100 : 400), 0);
  const publishedCount = invitations.length;

  if (activeTab === "create-new-template") {
    const templatePrice = selectedTemplate?.vendorPrice || selectedTemplate?.sellPrice || 400;
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Overview</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black">Create New Template</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-black/60">Fill wedding details and generate a premium invitation template in minutes.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/3 p-3">
                  <div className="h-16 w-24 overflow-hidden rounded-xl border border-black/10 bg-black/10">
                    {selectedTemplate?.preview ? <Image src={selectedTemplate.preview} alt={selectedTemplate.name} width={400}
                      height={400} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Selected Template</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-black">{selectedTemplate?.name || "Royal Ivory Palace"}</h2>
                    <p className="text-sm text-black/55">{selectedTemplate?.category || "Hindu Wedding"}</p>
                  </div>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" className="border-black/10 bg-white text-black hover:bg-black hover:text-white" onClick={() => router.push("/vendor/dashboard/template-library")}>
                    Change Template
                  </Button>
                  <Button variant="outline" className="border-black/10 bg-white text-black hover:bg-black hover:text-white" onClick={() => router.push(`/templateInfo/${selectedTemplate?.templateId || selectedTemplate?.id || 1}`)}>
                    Preview Template
                  </Button>
                </div>
              </div>
            </div>

            {loadingTemplates ? (
              <SectionCard title="Loading templates..."><p className="text-sm text-black/60">Fetching vendor templates...</p></SectionCard>
            ) : selectedTemplate ? (
              <TemplateForm
                ref={formRef}
                template={selectedTemplate}
                onPreviewChange={setFormData}
                activeTab={formTab}
                setActiveTab={setFormTab}
                isVendor={true}
                onSubmittingChange={setIsSubmitting}
              />
            ) : (
              <SectionCard title="No template selected"><p className="text-sm text-black/60">No templates available right now.</p></SectionCard>
            )}
          </div>

          <div className="space-y-6">
            <SectionCard title="Live Preview">
              <div className="rounded-[1.35rem] border border-black/10 bg-[#faf7f3] p-4">
                {selectedTemplate ? <TemplateDetail template={selectedTemplate} formData={formData} fullscreen={true} /> : <div className="rounded-[1.35rem] border border-black/10 bg-white p-6 text-sm text-black/55">Select a template to preview it here.</div>}
              </div>
              <p className="mt-4 text-center text-sm text-black/45">Live preview updates as you fill the form.</p>
            </SectionCard>

            <SectionCard title="Publishing Cost">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Publishing Cost</p>
                  <p className="mt-2 text-3xl font-semibold text-black">{formatCurrency(templatePrice)}</p>
                  <p className="mt-1 text-sm text-black/55">Pay only when ready to publish.</p>
                </div>
                <div className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black/55">Secure &amp; Safe Payments</div>
              </div>
              <div className="mt-5 grid gap-3">
                <Button variant="outline" disabled={isSubmitting} className="h-11 border-black/10 bg-white text-black hover:bg-black hover:text-white" onClick={() => toast.success("Live preview is updated on the left column")}>Preview Template</Button>
                <Button className="h-11 bg-black text-white hover:bg-black/90" disabled={isSubmitting} onClick={() => formRef.current?.submit()}>Pay {formatCurrency(templatePrice)} &amp; Publish</Button>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "template-library") {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Catalog</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black">Template Library</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">Browse premium wedding templates for your clients.</p>
            </div>
            <Button className="h-11 bg-black text-white hover:bg-black/90" onClick={() => router.push("/vendor/dashboard/create-new-template")}>+ Create New Template</Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex h-11 w-full items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 text-sm text-black/45 shadow-[0_10px_24px_rgba(0,0,0,0.04)] sm:max-w-sm">
              <Search className="h-4 w-4" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates..." className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30" />
            </label>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-black/60">
              {["All", "New", "Popular", "Hindu", "Muslim", "Sikh", "Christian", "South Indian", "Minimal", "Royal"].map((tag) => (
                <span key={tag} className={`rounded-full border px-3 py-1.5 ${tag === "All" ? "border-[#c8a24c]/45 bg-[#f7eecf] text-black" : "border-black/10 bg-white"}`}>{tag}</span>
              ))}
            </div>
          </div>

          {loadingTemplates ? (
            <SectionCard title="Templates"><p className="text-sm text-black/60">Loading templates...</p></SectionCard>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredTemplates.map((template) => (
                <TemplateGridCard key={template.templateId || template.id} template={template} selected={String(selectedTemplateId) === String(template.templateId || template.id)} onSelect={() => setSelectedTemplateId(String(template.templateId || template.id))} onUse={(t) => router.push(`/vendor/dashboard/create-new-template?template=${t.templateId || t.id}`)} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <SectionCard title={selectedTemplate?.name || "Template Preview"}>
            {selectedTemplate ? (
              <TemplateDetail template={selectedTemplate} formData={{}} />
            ) : (
              <div className="rounded-[1.35rem] border border-black/10 bg-[#faf7f3] p-6 text-sm text-black/55">Pick a template to see the full mobile preview.</div>
            )}
          </SectionCard>

          <SectionCard title="Best for">
            <div className="space-y-3 text-sm text-black/70">
              <div className="flex items-center gap-3"><span className="text-[#b7882f]">◌</span> Hindu Wedding</div>
              <div className="flex items-center gap-3"><span className="text-[#b7882f]">◌</span> Royal Theme</div>
              <div className="flex items-center gap-3"><span className="text-[#b7882f]">◌</span> Luxury Invite</div>
            </div>
            <Button className="mt-5 h-11 w-full bg-black text-white hover:bg-black/90" onClick={() => router.push(`/vendor/dashboard/create-new-template?template=${selectedTemplate?.templateId || selectedTemplate?.id || "1"}`)}>
              Use This Template
            </Button>
          </SectionCard>
        </div>
      </div>
    );
  }

  if (activeTab === "my-templates") {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">My work</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black">My Templates</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">All invitations created with the vendor auth flow are listed here from your vendor invitation endpoint.</p>
        </div>

        {loadingInvitations ? (
          <SectionCard title="Loading invitations..."><p className="text-sm text-black/60">Fetching vendor invitations...</p></SectionCard>
        ) : invitations.length ? (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {invitations.map((invitation) => {
                const slug = invitation.slug || `${String(invitation.bride || "invite").toLowerCase()}-${String(invitation.groom || "weds").toLowerCase()}`;
                return (
                  <button key={invitation._id} type="button" onClick={() => setSelectedInvitationId(invitation._id)} className={`w-full rounded-[1.35rem] border bg-white p-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 ${selectedInvitationId === invitation._id ? "border-black" : "border-black/10"}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-black">{invitation.bride} &amp; {invitation.groom}</h3>
                        <p className="mt-1 text-sm text-black/55">{formatDate(invitation.createdAt)} • {invitation.venue || "Venue not set"}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Published</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-black/60">
                      <span className="rounded-full border border-black/10 px-3 py-1.5">enviteyou.com/invitations/{slug}</span>
                      <span className="rounded-full border border-black/10 px-3 py-1.5">Template {invitation.templateId || "1"}</span>
                      <span className="rounded-full border border-black/10 px-3 py-1.5">Events {Array.isArray(invitation.selectedEvents) ? invitation.selectedEvents.length : 0}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <SectionCard title="Template details">
              {selectedInvitation ? (
                <div className="space-y-4 text-sm text-black/65">
                  <div className="flex items-center gap-4 border-b border-black/8 pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6efdf] text-[#b7882f]"><Sparkles className="h-5 w-5" /></div>
                    <div>
                      <p className="text-lg font-semibold text-black">{selectedInvitation.bride} &amp; {selectedInvitation.groom}</p>
                      <p>{selectedInvitation.venue || "Venue not set"}</p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-black/10 bg-black/2 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Slug</p><p className="mt-2 break-all text-black">{selectedInvitation.slug}</p></div>
                    <div className="rounded-2xl border border-black/10 bg-black/2 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Events</p><p className="mt-2 text-black">{Array.isArray(selectedInvitation.selectedEvents) ? selectedInvitation.selectedEvents.join(", ") : "—"}</p></div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="h-11 flex-1 bg-black text-white hover:bg-black/90" onClick={() => window.open(`/invitations/${selectedInvitation.slug}`, "_blank")}>Open Template</Button>
                    <Button variant="outline" className="h-11 flex-1 border-black/10 bg-white text-black hover:bg-black hover:text-white" onClick={async () => {
                      await navigator.clipboard.writeText(`${window.location.origin}/invitations/${selectedInvitation.slug}`);
                      toast.success("Template link copied");
                    }}>
                      <Copy className="mr-2 h-4 w-4" /> Copy Link
                    </Button>
                  </div>
                </div>
              ) : null}
            </SectionCard>
          </div>
        ) : (
          <SectionCard title="No templates yet"><p className="text-sm text-black/60">No vendor invitations found. Create your first template from the builder.</p></SectionCard>
        )}
      </div>
    );
  }

  if (activeTab === "payments") {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Payments</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black">Payments</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">Track published template payments and download receipts.</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f7eecf] px-3 py-1.5 text-sm font-medium text-black"><span className="text-[#b7882f]">•</span> Published templates are billed based on vendor pricing.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Metric label="Total Paid" value={formatCurrency(totalRevenue)} icon={IndianRupee} hint="Total paid till now" />
          <Metric label="Templates Published" value={publishedCount} icon={LayoutGrid} hint="Successfully published" />
          <Metric label="Wallet Recharge" value="Coming Soon" icon={Monitor} hint="Soon you will be able to add balance and publish templates faster" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <InvitationTable invitations={invitations} onSelect={setSelectedInvitationId} selectedId={selectedInvitationId} onDownload={handleDownloadInvoice} />

          <SectionCard title="Payment Details">
            {selectedInvitation ? (
              <div className="space-y-4 text-sm text-black/65">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-black/10 bg-black/5">
                    {selectedInvitation.coverImage ? <Image src={selectedInvitation.coverImage} alt="cover" width={400}
                      height={400}
                      className="h-full w-full object-cover" /> : null}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-black">{selectedInvitation.bride} &amp; {selectedInvitation.groom}</p>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Paid</span>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-black/10 bg-black/2 p-4">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Couple</p><p className="mt-1 text-black">{selectedInvitation.bride} &amp; {selectedInvitation.groom}</p></div>
                  <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Amount</p><p className="mt-1 text-black">{formatCurrency(selectedInvitation.amountPaid ? selectedInvitation.amountPaid / 100 : 400)}</p></div>
                  <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Status</p><p className="mt-1 text-black">Paid</p></div>
                  <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Payment Date</p><p className="mt-1 text-black">{formatDate(selectedInvitation.createdAt)}</p></div>
                  <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Template Link</p><p className="mt-1 break-all text-black">enviteyou.com/invitations/{selectedInvitation.slug}</p></div>
                  <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Transaction ID</p><p className="mt-1 text-black">EVY-{String(selectedInvitation._id).slice(-8).toUpperCase()}</p></div>
                </div>

                <div className="grid gap-3">
                  <Button className="h-11 bg-black text-white hover:bg-black/90" onClick={() => handleDownloadInvoice(selectedInvitation._id)}>Download Receipt</Button>
                  <Button variant="outline" className="h-11 border-black/10 bg-white text-black hover:bg-black hover:text-white" onClick={() => window.open(`/invitations/${selectedInvitation.slug}`, "_blank")}>Open Template</Button>
                </div>
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    );
  }

  if (activeTab === "clients") {
    const clientRows = invitations.map((invitation) => ({
      id: invitation._id,
      name: `${invitation.bride} & ${invitation.groom}`,
      venue: invitation.venue || "Venue not set",
      date: formatDate(invitation.date || invitation.createdAt),
      events: Array.isArray(invitation.selectedEvents) ? invitation.selectedEvents.length : 0,
    }));

    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Clients</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black">Clients</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">Client progress and invitation activity derived from your vendor invitations.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Active Clients" value={clientRows.length} icon={Users} hint="Invitation records" />
          <Metric label="Follow-ups" value={Math.max(clientRows.length - 1, 0)} icon={MessageSquareMore} hint="Suggested follow-up count" />
          <Metric label="Avg. Events" value={clientRows.length ? (clientRows.reduce((sum, item) => sum + item.events, 0) / clientRows.length).toFixed(1) : 0} icon={CalendarDays} hint="Events per invitation" />
          <Metric label="Lead Value" value={formatCurrency(clientRows.length * 400)} icon={Megaphone} hint="Estimated platform value" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <SectionCard title="Recent Clients">
            <div className="space-y-3">
              {clientRows.length ? clientRows.map((client) => (
                <div key={client.id} className="rounded-2xl border border-black/10 bg-black/2 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-black">{client.name}</p>
                      <p className="text-sm text-black/55">{client.venue}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black/55">{client.date}</span>
                  </div>
                </div>
              )) : <p className="text-sm text-black/60">No clients found.</p>}
            </div>
          </SectionCard>

          <SectionCard title="Client Detail">
            {clientRows[0] ? (
              <div className="space-y-4 text-sm text-black/65">
                <p className="text-2xl font-semibold text-black">{clientRows[0].name}</p>
                <p>{clientRows[0].venue}</p>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Invitation Status</p>
                  <p className="mt-2 text-black">Active</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Events</p>
                  <p className="mt-2 text-black">{clientRows[0].events}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-black/60">No client details available.</p>
            )}
          </SectionCard>
        </div>
      </div>
    );
  }

  if (activeTab === "photo-selections") {
    return <PhotoSelectionManager />;
  }

  if (activeTab === "support-help") {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Support</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black">Support &amp; Help</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">Get help with your vendor account, template creation, and template publishing.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="Chat Support"><p className="text-sm leading-7 text-black/60">Our team is available on WhatsApp for quick setup help and vendor onboarding.</p><Button className="mt-4 h-11 w-full bg-black text-white hover:bg-black/90" onClick={() => window.open("https://wa.me/919999999999", "_blank")}>Chat on WhatsApp</Button></SectionCard>
          <SectionCard title="Email Support"><p className="text-sm leading-7 text-black/60">Send template and account queries to care@enviteyou.com.</p><Button variant="outline" className="mt-4 h-11 w-full border-black/10 bg-white text-black hover:bg-black hover:text-white" onClick={() => window.location.href = "mailto:care@enviteyou.com"}>Email Us</Button></SectionCard>
          <SectionCard title="Help Topics"><div className="space-y-3 text-sm text-black/65"><p>• Template setup and preview</p><p>• Pricing and vendor rates</p><p>• Template publishing and invoice help</p><p>• Invitation sharing and RSVP issues</p></div></SectionCard>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Overview</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black">Dashboard</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-black/60">Monitor catalog size and jump into the template workflows from one place.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Templates" value={loadingTemplates ? "..." : templates.length} icon={LayoutGrid} hint="Available designs" />
        <Metric label="Invitations" value={loadingInvitations ? "..." : invitations.length} icon={Monitor} hint="Vendor templates" />
        <Metric label="Revenue" value={loadingInvitations ? "..." : formatCurrency(totalRevenue)} icon={IndianRupee} hint="Estimated from published templates" />
        <Metric label="Clients" value={loadingInvitations ? "..." : invitations.length} icon={Users} hint="Couple records" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard title="Quick Actions">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Create New Template", href: "/vendor/dashboard/create-new-template" },
              { label: "Template Library", href: "/vendor/dashboard/template-library" },
              { label: "My Templates", href: "/vendor/dashboard/my-templates" },
              { label: "Payments", href: "/vendor/dashboard/payments" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-black/10 bg-black/2 px-4 py-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity">
          <div className="space-y-3 text-sm text-black/65">
            {loadingInvitations ? <p>Loading recent templates...</p> : invitations.slice(0, 3).map((invitation) => <p key={invitation._id}>{invitation.bride} &amp; {invitation.groom} • {formatDate(invitation.createdAt)}</p>)}
            {!loadingInvitations && !invitations.length ? <p>No invitations yet.</p> : null}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}