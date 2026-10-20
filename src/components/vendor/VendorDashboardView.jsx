"use client";

import { useEffect, useMemo, useState, useRef, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/api/axios";
import { getVendorSession } from "@/lib/vendorAuth";
import { normalizeTemplates } from "@/lib/templateService";
import TemplateCustomizer from "@/components/TemplateCustomizer";
import TemplateDetail from "@/components/TemplateDetail";
import TemplateForm from "@/components/TemplateForm";
import PhotoSelectionManager from "./PhotoSelectionManager";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Monitor,
  Camera,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  MessageSquare,
  FileText,
  AlertCircle,
  Eye,
  Download,
  Share2,
  Plus,
  Rocket,
  ChevronRight,
  ChevronDown,
  X,
  Sparkles,
  ExternalLink,
  Copy,
  Clock,
  ArrowRight,
  Search,
  HardDrive,
  CreditCard,
  SlidersHorizontal,
  Check,
  Bell,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// 6 Months Analytics Data
const ANALYTICS_DATA_6M = [
  { month: "Apr", websites: 7, photos: 4, albums: 3 },
  { month: "May", websites: 9, photos: 5, albums: 4 },
  { month: "Jun", websites: 11, photos: 7, albums: 5 },
  { month: "Jul", websites: 13, photos: 8, albums: 6 },
  { month: "Aug", websites: 15, photos: 11, albums: 8 },
  { month: "Sep", websites: 18, photos: 14, albums: 10 },
];

// 12 Months Analytics Data
const ANALYTICS_DATA_12M = [
  { month: "Oct", websites: 4, photos: 2, albums: 1 },
  { month: "Nov", websites: 6, photos: 3, albums: 2 },
  { month: "Dec", websites: 8, photos: 4, albums: 3 },
  { month: "Jan", websites: 5, photos: 3, albums: 2 },
  { month: "Feb", websites: 7, photos: 4, albums: 3 },
  { month: "Mar", websites: 8, photos: 5, albums: 4 },
  { month: "Apr", websites: 7, photos: 4, albums: 3 },
  { month: "May", websites: 9, photos: 5, albums: 4 },
  { month: "Jun", websites: 11, photos: 7, albums: 5 },
  { month: "Jul", websites: 13, photos: 8, albums: 6 },
  { month: "Aug", websites: 15, photos: 11, albums: 8 },
  { month: "Sep", websites: 18, photos: 14, albums: 10 },
];

const ATTENTION_ITEMS = [
  {
    id: 1,
    icon: CheckCircle2,
    iconColor: "text-emerald-600 bg-emerald-50",
    title: "Priya & Rahul",
    actionDesc: "completed photo selection",
    time: "2 hours ago",
    btnText: "Download Selection",
    type: "photo",
  },
  {
    id: 2,
    icon: MessageSquare,
    iconColor: "text-amber-600 bg-amber-50",
    title: "Neha & Arjun",
    actionDesc: "requested album changes",
    time: "5 hours ago",
    btnText: "Review Comments",
    type: "album",
  },
  {
    id: 3,
    icon: FileText,
    iconColor: "text-stone-600 bg-stone-100",
    title: "Meera & Aarav",
    actionDesc: "wedding website is still in draft",
    time: "1 day ago",
    btnText: "Continue Website",
    type: "website",
  },
  {
    id: 4,
    icon: Clock,
    iconColor: "text-amber-600 bg-amber-50",
    title: "Tina & Rohit",
    actionDesc: "photo-selection deadline passed",
    time: "1 day ago",
    btnText: "Extend Deadline",
    type: "photo",
  },
  {
    id: 5,
    icon: AlertCircle,
    iconColor: "text-rose-600 bg-rose-50",
    title: "Wedding upload",
    actionDesc: "failed for one folder",
    time: "2 days ago",
    btnText: "Retry Upload",
    type: "upload",
  },
];

const CLIENT_ACTIVITIES = [
  {
    id: 1,
    icon: ImageIcon,
    text: "Rahul selected 25 more photographs",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: CheckCircle2,
    text: "Priya submitted the final selection",
    time: "4 hours ago",
  },
  {
    id: 3,
    icon: MessageSquare,
    text: "Shreya commented on album page 6",
    time: "5 hours ago",
  },
  {
    id: 4,
    icon: CheckCircle2,
    text: "Harmeet approved the digital album",
    time: "1 day ago",
  },
  {
    id: 5,
    icon: Eye,
    text: "A client opened their wedding website",
    time: "2 days ago",
  },
];

const RECENT_WEDDINGS_DATA = [
  {
    id: "EVT-1",
    couple: "Shreya & Harmeet",
    date: "18 Dec 2026",
    services: ["Website", "Album"],
    status: "Album draft",
    statusType: "info",
    nextAction: "Continue album",
  },
  {
    id: "EVT-2",
    couple: "Rahul & Priya",
    date: "10 Nov 2026",
    services: ["Photo Selection"],
    status: "Client selecting",
    statusType: "warning",
    nextAction: "View progress",
  },
  {
    id: "EVT-3",
    couple: "Neha & Arjun",
    date: "05 Jan 2027",
    services: ["Website", "Photo Selection", "Album"],
    status: "Changes Requested",
    statusType: "warning",
    nextAction: "Review comments",
  },
  {
    id: "EVT-4",
    couple: "Meera & Aarav",
    date: "18 Jan 2027",
    services: ["Website", "Photo Selection"],
    status: "Website draft",
    statusType: "info",
    nextAction: "Continue website",
  },
];

const RECENT_ALBUMS_DATA = [
  {
    id: "ALB-1",
    couple: "Shreya & Harmeet",
    spreads: "18 spreads",
    status: "Changes Requested",
    statusType: "warning",
    time: "Updated 2 hours ago",
    cover: "/4.png",
    primaryAction: "Review Comments",
  },
  {
    id: "ALB-2",
    couple: "Rahul & Priya",
    spreads: "120 spreads",
    status: "Approved",
    statusType: "success",
    time: "Updated 1 day ago",
    cover: "/5.png",
    primaryAction: "Open Album",
  },
  {
    id: "ALB-3",
    couple: "Neha & Arjun",
    spreads: "86 spreads",
    status: "Shared for Review",
    statusType: "info",
    time: "Updated 2 days ago",
    cover: "/6.png",
    primaryAction: "Share Link",
  },
];

function MetricCard({ title, value, subtext, icon: Icon }) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs transition hover:shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fdf2f4] text-[#8e1d3d]">
          <Icon className="h-5 w-5 stroke-[1.5]" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">{title}</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-stone-900">{value}</p>
          <p className="mt-0.5 text-[11px] font-medium text-stone-400">{subtext}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, type }) {
  if (type === "success" || status === "Approved" || status === "Published") {
    return (
      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
        {status}
      </span>
    );
  }
  if (type === "warning" || status === "Changes Requested" || status === "Client selecting") {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-600/20">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-600/20">
      {status}
    </span>
  );
}

function CustomAnalyticsTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const websites = payload.find((p) => p.dataKey === "websites")?.value || 0;
    const photos = payload.find((p) => p.dataKey === "photos")?.value || 0;
    const albums = payload.find((p) => p.dataKey === "albums")?.value || 0;

    return (
      <div className="rounded-lg border border-stone-200 bg-white p-2.5 shadow-md text-xs">
        <p className="font-bold text-stone-900 mb-1">{label}</p>
        <p className="flex items-center gap-1.5 text-stone-700">
          <span className="h-2 w-2 rounded-full bg-[#6d162f]" />
          <span>{websites} websites</span>
        </p>
        <p className="flex items-center gap-1.5 text-stone-700">
          <span className="h-2 w-2 rounded-full bg-[#f2a2b7]" />
          <span>{photos} photo selections</span>
        </p>
        <p className="flex items-center gap-1.5 text-stone-700">
          <span className="h-2 w-2 rounded-full bg-[#c69255]" />
          <span>{albums} digital albums</span>
        </p>
      </div>
    );
  }
  return null;
}

function CreateEventModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    coupleName: "",
    eventType: "Wedding",
    eventDate: "",
    clientPhone: "",
    clientEmail: "",
    selectedOption: "website", // 'website', 'photo', 'album'
  });

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.coupleName) {
      toast.error("Please enter couple name");
      return;
    }
    onCreate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl border border-stone-200 bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">Create New Event</h3>
            <p className="text-xs text-stone-500">Set up a wedding project and pick initial action</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100">
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>

        <form onSubmit={handleNext} className="mt-3.5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700">Couple Names *</label>
            <input
              type="text"
              required
              placeholder="e.g. Shreya & Harmeet"
              value={formData.coupleName}
              onChange={(e) => setFormData({ ...formData, coupleName: e.target.value })}
              className="mt-1 h-9 w-full rounded-lg border border-stone-200 px-3 text-xs outline-none focus:border-[#6d162f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="mt-1 h-9 w-full rounded-lg border border-stone-200 px-3 text-xs outline-none focus:border-[#6d162f]"
              >
                <option value="Wedding">Wedding</option>
                <option value="Pre-wedding">Pre-wedding</option>
                <option value="Engagement">Engagement</option>
                <option value="Reception">Reception</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">Event Date</label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="mt-1 h-9 w-full rounded-lg border border-stone-200 px-3 text-xs outline-none focus:border-[#6d162f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Choose initial feature
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer transition ${
                  formData.selectedOption === "website"
                    ? "border-[#6d162f] bg-[#fdf2f4]/40"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <input
                  type="radio"
                  name="startOption"
                  value="website"
                  checked={formData.selectedOption === "website"}
                  onChange={() => setFormData({ ...formData, selectedOption: "website" })}
                  className="mt-0.5 text-[#6d162f]"
                />
                <div>
                  <p className="text-xs font-bold text-stone-900">Create wedding invitation</p>
                  <p className="text-[11px] text-stone-500">
                    Design and publish an interactive digital wedding invitation.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer transition ${
                  formData.selectedOption === "photo"
                    ? "border-[#6d162f] bg-[#fdf2f4]/40"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <input
                  type="radio"
                  name="startOption"
                  value="photo"
                  checked={formData.selectedOption === "photo"}
                  onChange={() => setFormData({ ...formData, selectedOption: "photo" })}
                  className="mt-0.5 text-[#6d162f]"
                />
                <div>
                  <p className="text-xs font-bold text-stone-900">Start photo selection</p>
                  <p className="text-[11px] text-stone-500">
                    Upload photographs and collect client selections.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer transition ${
                  formData.selectedOption === "album"
                    ? "border-[#6d162f] bg-[#fdf2f4]/40"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <input
                  type="radio"
                  name="startOption"
                  value="album"
                  checked={formData.selectedOption === "album"}
                  onChange={() => setFormData({ ...formData, selectedOption: "album" })}
                  className="mt-0.5 text-[#6d162f]"
                />
                <div>
                  <p className="text-xs font-bold text-stone-900">Create digital album</p>
                  <p className="text-[11px] text-stone-500">
                    Build multi-spread photobook layouts and collect client feedback.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="rounded-lg text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-[#6d162f] text-white hover:bg-[#581225] rounded-lg text-xs">
              Create Event &amp; Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomizeDashboardModal({ isOpen, onClose, sections, onToggleSection }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">Dashboard Display Settings</h3>
            <p className="text-xs text-stone-500">Show or hide sections on your studio overview</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100">
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>

        <div className="mt-3.5 space-y-2.5">
          {Object.keys(sections).map((key) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-lg border border-stone-100 p-2.5 hover:bg-stone-50 cursor-pointer"
            >
              <span className="text-xs font-semibold text-stone-800 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <input
                type="checkbox"
                checked={sections[key]}
                onChange={() => onToggleSection(key)}
                className="h-3.5 w-3.5 rounded text-[#6d162f]"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} size="sm" className="bg-[#6d162f] text-white hover:bg-[#581225] rounded-lg text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

function VendorDashboardViewContent({ activeTab = "dashboard" }) {
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
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [vendorName, setVendorName] = useState("Creator");
  const [dashboardSummary, setDashboardSummary] = useState({
    totalEvents: 0,
    weddingWebsites: 0,
    photoSelections: 0,
    digitalAlbums: 0,
    totalPhotosUploaded: 0,
    activePhotoSelections: 0,
    completedPhotoSelections: 0,
  });
  const [needsAttention, setNeedsAttention] = useState([]);
  const [recentWeddings, setRecentWeddings] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [clientActivity, setClientActivity] = useState([]);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState("Last 6 months");

  const [visibleSections, setVisibleSections] = useState({
    summaryCards: true,
    needsAttention: true,
    recentEvents: true,
    eventAnalytics: true,
    recentAlbums: true,
    clientActivity: true,
    quickStart: true,
    subscriptionUsage: true,
  });

  const toggleSection = (key) => {
    setVisibleSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedTemplate =
    templates.find(
      (template) => String(template.templateId || template.id) === String(selectedTemplateId)
    ) || templates[0] || null;

  const fetchDashboardSummary = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const [session, summaryRes] = await Promise.all([
        getVendorSession(),
        api.get("/auth/vendor/dashboard-summary").catch(() => null),
      ]);

      if (session?.user?.name || session?.user?.businessName) {
        setVendorName(session.user.name || session.user.businessName);
      }

      if (summaryRes?.data?.success) {
        const data = summaryRes.data;
        setDashboardSummary(data.summary || {
          totalEvents: 0,
          weddingWebsites: 0,
          photoSelections: 0,
          digitalAlbums: 0,
        });
        setNeedsAttention(data.needsAttention || []);
        setRecentWeddings(data.recentWeddings || []);
        setRecentAlbums(data.recentAlbums || []);
        setClientActivity(data.clientActivity || []);
        setMonthlyAnalytics(data.monthlyAnalytics || []);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardSummary();
    }
  }, [activeTab, fetchDashboardSummary]);

  useEffect(() => {
    const needsTemplates = ["dashboard", "create-new-template", "template-library", "wedding-websites", "wedding-invitations"].includes(
      activeTab
    );
    if (!needsTemplates) return;

    let ignore = false;
    setLoadingTemplates(true);
    api
      .get("/templates")
      .then((response) => {
        if (ignore) return;
        const rawTemplates = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        const normalized = normalizeTemplates(rawTemplates);
        setTemplates(normalized);

        const paramTemplate =
          searchParams?.get("template") || searchParams?.get("templateId") || "";
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
    const needsInvitations = ["dashboard", "my-templates", "wedding-websites", "wedding-invitations", "billing", "payments", "clients"].includes(
      activeTab
    );
    if (!needsInvitations) return;

    let ignore = false;
    setLoadingInvitations(true);
    api
      .get("/invitations/getMyInvitations/vendor")
      .then((response) => {
        if (ignore) return;
        const items = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
          ? response.data
          : [];
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

  const handleCreateEvent = async (data) => {
    try {
      if (data.selectedOption === "photo") {
        await api.post("/photo-selection/projects", {
          projectName: data.coupleName,
          clientName: data.coupleName,
          selectionLimit: 100,
        });
        toast.success(`Photo selection created for ${data.coupleName}`);
        fetchDashboardSummary();
        router.push("/vendor/dashboard/photo-selections");
      } else if (data.selectedOption === "website" || data.selectedOption === "invitation") {
        toast.success(`Setting up wedding invitation for ${data.coupleName}`);
        router.push("/vendor/dashboard/create-new-template");
      } else {
        toast.success(`Opening digital albums for ${data.coupleName}`);
        router.push("/vendor/dashboard/digital-albums");
      }
    } catch (err) {
      console.error("Create event error:", err);
      toast.error(err?.response?.data?.message || "Failed to create event");
    }
  };

  const handleAttentionAction = (item) => {
    if (item.type === "photo" || item.projectId) {
      router.push("/vendor/dashboard/photo-selections");
      toast.success(`Opening photo selection for ${item.title}`);
    } else if (item.type === "album" || item.albumToken) {
      if (item.albumToken) {
        window.open(`/album/${item.albumToken}`, "_blank");
      } else {
        router.push("/vendor/dashboard/digital-albums");
      }
      toast.info(`Opening album for ${item.title}`);
    } else if (item.type === "website" || item.type === "invitation" || item.slug) {
      if (item.slug) {
        window.open(`/invite/${item.slug}`, "_blank");
      } else {
        router.push("/vendor/dashboard/wedding-invitations");
      }
      toast.success(`Viewing wedding invitation for ${item.title}`);
    } else {
      router.push("/vendor/dashboard/photo-selections");
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentAnalyticsData = analyticsTimeframe === "Last 12 months" ? ANALYTICS_DATA_12M : ANALYTICS_DATA_6M;

  // ----------------------------------------------------
  // SECTION 1: DEFAULT DASHBOARD OVERVIEW (Ordered & Symmetrical)
  // ----------------------------------------------------
  if (activeTab === "dashboard") {
    return (
      <div className="space-y-4 pb-8 font-sans">
        {/* 1. Welcome and Primary Action */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              {getTimeGreeting()}, {vendorName || "Creator"}
            </h1>
            <p className="text-xs text-stone-500">Manage your weddings and client work.</p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCustomizeOpen(true)}
              className="h-9 gap-1.5 rounded-lg border-stone-200 bg-white text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-stone-400 stroke-[1.5]" />
              <span>Customize</span>
            </Button>

            <Button
              onClick={() => setIsCreateEventOpen(true)}
              className="h-9 gap-1.5 rounded-lg bg-[#6d162f] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-[#571125] transition"
            >
              <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>Create New Event</span>
            </Button>
          </div>
        </div>

        {/* 2. Summary Cards (4 Symmetric Columns) */}
        {visibleSections.summaryCards && (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Events"
              value={dashboardSummary.totalEvents || 0}
              subtext={`${dashboardSummary.activePhotoSelections || 0} active in progress`}
              icon={Calendar}
            />
            <MetricCard
              title="Wedding Invitations"
              value={dashboardSummary.weddingWebsites || 0}
              subtext="Published & live"
              icon={Monitor}
            />
            <MetricCard
              title="Photo Selections"
              value={dashboardSummary.photoSelections || 0}
              subtext={`${dashboardSummary.completedPhotoSelections || 0} selections completed`}
              icon={ImageIcon}
            />
            <MetricCard
              title="Digital Albums"
              value={dashboardSummary.digitalAlbums || 0}
              subtext="Photobook proofing"
              icon={BookOpen}
            />
          </div>
        )}

        {/* 3. Needs Your Attention (Symmetrical Card) */}
        {visibleSections.needsAttention && (
          <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                  <Bell className="h-3.5 w-3.5 stroke-[1.5]" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Needs Your Attention</h3>
              </div>
              <span className="text-xs font-semibold text-stone-400">
                {needsAttention.length > 0 ? `${needsAttention.length} pending` : "0 alerts"}
              </span>
            </div>

            {needsAttention.length > 0 ? (
              <div className="mt-2 divide-y divide-stone-100">
                {needsAttention.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 first:pt-1 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                        <AlertCircle className="h-3.5 w-3.5 stroke-[1.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-stone-800 leading-snug">
                          <span className="font-bold text-stone-900">{item.title}</span> {item.actionDesc}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAttentionAction(item)}
                      className="self-start sm:self-auto shrink-0 rounded-md border border-[#f2b8c6] bg-[#fdf2f5] px-3 py-1 text-xs font-semibold text-[#7c1d37] transition hover:bg-[#fadce3] cursor-pointer"
                    >
                      {item.actionBtn || "View"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs font-medium text-stone-500">All caught up! No urgent attention needed right now.</p>
              </div>
            )}
          </div>
        )}

        {/* 4. Recent Events / Recent Weddings (Symmetrical Table) */}
        {visibleSections.recentEvents && (
          <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Recent Weddings &amp; Projects</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Active client projects and workflow status</p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/vendor/dashboard/photo-selections")}
                className="text-xs font-semibold text-[#8e1d3d] hover:underline cursor-pointer"
              >
                View all ({recentWeddings.length})
              </button>
            </div>

            {recentWeddings.length > 0 ? (
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-100 text-stone-400 font-semibold">
                      <th className="pb-2.5 font-medium">Couple / Event Name</th>
                      <th className="pb-2.5 font-medium">Event Date</th>
                      <th className="pb-2.5 font-medium">Services</th>
                      <th className="pb-2.5 font-medium">Current Status</th>
                      <th className="pb-2.5 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentWeddings.map((evt) => (
                      <tr key={evt.id} className="hover:bg-stone-50/70 transition">
                        <td className="py-2.5 pr-3">
                          <p className="font-bold text-stone-900 text-xs">{evt.couple}</p>
                        </td>
                        <td className="py-2.5 pr-3 text-stone-600 font-medium whitespace-nowrap">
                          {evt.date}
                        </td>
                        <td className="py-2.5 pr-3">
                          <div className="flex items-center gap-1 text-stone-600">
                            {evt.services?.map((svc, i) => (
                              <span
                                key={i}
                                className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600"
                              >
                                {svc}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 pr-3">
                          <StatusBadge status={evt.status} type={evt.statusType} />
                        </td>
                        <td className="py-2.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              if (evt.link) {
                                if (evt.link.startsWith("/invite/") || evt.link.startsWith("/album/")) {
                                  window.open(evt.link, "_blank");
                                } else {
                                  router.push(evt.link);
                                }
                              } else {
                                router.push("/vendor/dashboard/photo-selections");
                              }
                            }}
                            className="rounded-md border border-[#f2b8c6] bg-[#fdf2f5] px-3 py-1 text-xs font-semibold text-[#7c1d37] hover:bg-[#fadce3] transition cursor-pointer"
                          >
                            {evt.nextAction || "Open"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs font-medium text-stone-500">No events or projects created yet.</p>
                <button
                  type="button"
                  onClick={() => setIsCreateEventOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#6d162f] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#571125] transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Create First Event</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5. Event Analytics & Recent Albums (Symmetrical 50/50 Grid) */}
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12">
          {/* Event Analytics (Col Span 6) */}
          {visibleSections.eventAnalytics && (
            <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Event Analytics</h3>
                    <p className="text-[10px] text-stone-400">Creation trends across offerings</p>
                  </div>
                  <select
                    value={analyticsTimeframe}
                    onChange={(e) => setAnalyticsTimeframe(e.target.value)}
                    className="rounded-md border border-stone-200 bg-white px-2 py-0.5 text-xs font-medium text-stone-700 outline-none hover:bg-stone-50"
                  >
                    <option value="Last 6 months">Last 6 months</option>
                    <option value="Last 12 months">Last 12 months</option>
                  </select>
                </div>

                <div className="mt-3 h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyAnalytics.length > 0 ? monthlyAnalytics : currentAnalyticsData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#78716c" }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#78716c" }} domain={[0, "auto"]} allowDecimals={false} />
                      <Tooltip content={<CustomAnalyticsTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                      <Bar dataKey="websites" fill="#6d162f" radius={[3, 3, 0, 0]} maxBarSize={10} />
                      <Bar dataKey="photoSelections" fill="#f2a2b7" radius={[3, 3, 0, 0]} maxBarSize={10} />
                      <Bar dataKey="digitalAlbums" fill="#c69255" radius={[3, 3, 0, 0]} maxBarSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 pt-2.5 border-t border-stone-100 text-[10px] font-medium text-stone-600">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#6d162f]" />
                  <span>Websites</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#f2a2b7]" />
                  <span>Photo Selection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#c69255]" />
                  <span>Digital Albums</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Albums (Col Span 6) */}
          {visibleSections.recentAlbums && (
            <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Recent Albums</h3>
                    <p className="text-[10px] text-stone-400">Latest photobook proofing &amp; spreads</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/vendor/dashboard/digital-albums")}
                    className="text-xs font-semibold text-[#8e1d3d] hover:underline cursor-pointer"
                  >
                    View All ({recentAlbums.length})
                  </button>
                </div>

                {recentAlbums.length > 0 ? (
                  <div className="mt-2 divide-y divide-stone-100">
                    {recentAlbums.map((alb) => (
                      <div key={alb.id} className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-stone-100 border border-stone-200">
                            <Image src={alb.cover} alt={alb.couple} width={40} height={40} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 text-xs truncate">{alb.couple}</p>
                            <p className="text-[11px] text-stone-500 font-medium">
                              {alb.spreads} · <span className="text-stone-400">{alb.status}</span>
                            </p>
                            <p className="text-[10px] text-stone-400">{alb.time}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (alb.token) {
                              window.open(`/album/${alb.token}`, "_blank");
                            } else {
                              router.push("/vendor/dashboard/digital-albums");
                            }
                          }}
                          className="shrink-0 rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition cursor-pointer"
                        >
                          {alb.primaryAction || "Open Album"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-xs font-medium text-stone-500">No digital albums created yet.</p>
                    <button
                      type="button"
                      onClick={() => router.push("/vendor/dashboard/digital-albums")}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span>Create Digital Album</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 6. Client Activity & Quick Start (Symmetrical 50/50 Grid) */}
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12">
          {/* Client Activity (Col Span 6) */}
          {visibleSections.clientActivity && (
            <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Client Activity</h3>
                    <p className="text-[10px] text-stone-400">Live timeline of client interactions</p>
                  </div>
                  <span className="text-xs font-semibold text-stone-400">
                    Live Feed
                  </span>
                </div>

                {clientActivity.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {clientActivity.slice(0, 4).map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center gap-2.5 rounded-lg border border-stone-100 bg-stone-50/70 p-2.5"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fdf2f4] text-[#8e1d3d]">
                          <CheckCircle2 className="h-3 w-3 stroke-[1.5]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-stone-800 leading-snug truncate">{act.text}</p>
                          <p className="text-[10px] text-stone-400">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-xs font-medium text-stone-500">No client activity recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Access to Features (Col Span 6) */}
          {visibleSections.quickStart && (
            <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fdf2f4] text-[#8e1d3d]">
                      <Rocket className="h-3.5 w-3.5 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Quick Start</h4>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400">Studio offerings</span>
                </div>

                <div className="mt-3 space-y-2">
                  <div
                    onClick={() => router.push("/vendor/dashboard/create-new-template")}
                    className="group flex items-center justify-between rounded-lg border border-stone-200/80 p-2.5 transition hover:border-[#6d162f] hover:bg-[#fdf2f4]/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Monitor className="h-4 w-4 text-[#8e1d3d] shrink-0 stroke-[1.5]" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 leading-none">Wedding Invitation</p>
                        <p className="text-[10px] text-stone-500 mt-1 truncate">Create and share a digital wedding invitation.</p>
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#6d162f] transition shrink-0" />
                  </div>

                  <div
                    onClick={() => router.push("/vendor/dashboard/photo-selections")}
                    className="group flex items-center justify-between rounded-lg border border-stone-200/80 p-2.5 transition hover:border-[#6d162f] hover:bg-[#fdf2f4]/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ImageIcon className="h-4 w-4 text-[#8e1d3d] shrink-0 stroke-[1.5]" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 leading-none">Photo Selection</p>
                        <p className="text-[10px] text-stone-500 mt-1 truncate">Upload photographs and collect client selections.</p>
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#6d162f] transition shrink-0" />
                  </div>

                  <div
                    onClick={() => router.push("/vendor/dashboard/digital-albums")}
                    className="group flex items-center justify-between rounded-lg border border-stone-200/80 p-2.5 transition hover:border-[#6d162f] hover:bg-[#fdf2f4]/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="h-4 w-4 text-[#8e1d3d] shrink-0 stroke-[1.5]" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 leading-none">Digital Album</p>
                        <p className="text-[10px] text-stone-500 mt-1 truncate">Share an interactive album for review or delivery.</p>
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#6d162f] transition shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7. Subscription Usage (Symmetric & Compact) */}
        {visibleSections.subscriptionUsage && (
          <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                  <HardDrive className="h-4 w-4 text-[#8e1d3d] stroke-[1.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-stone-900">Studio Pro Plan</h4>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">Renews on 15 Oct 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-xl">
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-stone-600 mb-1">
                    <span>Cloud Storage</span>
                    <span>{Math.max(1.2, ((dashboardSummary.totalPhotosUploaded || 0) * 0.005)).toFixed(1)} GB / 100 GB</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-[#6d162f] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, Math.min(100, Math.round((((dashboardSummary.totalPhotosUploaded || 0) * 0.005) / 100) * 100)))}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-stone-600 mb-1">
                    <span>Event Quota</span>
                    <span>{dashboardSummary.totalEvents || 0} of 25 Events used</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-[#c69255] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round(((dashboardSummary.totalEvents || 0) / 25) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push("/vendor/dashboard/plans")}
                variant="outline"
                size="sm"
                className="h-8 border-[#6d162f] text-[#6d162f] hover:bg-[#fdf2f4] text-xs font-bold shrink-0 rounded-lg"
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        )}

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
          onCreate={handleCreateEvent}
        />

        {/* Dashboard Customization Modal */}
        <CustomizeDashboardModal
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          sections={visibleSections}
          onToggleSection={toggleSection}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // SUBTAB 1: Photo Selection Tab
  // ----------------------------------------------------
  if (activeTab === "photo-selections") {
    return <PhotoSelectionManager />;
  }

  // ----------------------------------------------------
  // SUBTAB 2: Create New Template Tab
  // ----------------------------------------------------
  if (activeTab === "create-new-template") {
    const templatePrice = selectedTemplate?.vendorPrice || selectedTemplate?.sellPrice || 400;
    return (
      <div className="space-y-4 font-sans">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Overview</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-stone-900">Create New Invitation</h1>
          <p className="text-xs text-stone-500">Fill wedding details and generate a premium invitation template in minutes.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_440px]">
          <div className="space-y-4">
            <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs">
              <div className="flex flex-wrap items-center gap-3.5">
                <div className="flex items-center gap-3 rounded-lg border border-stone-100 bg-stone-50 p-2.5">
                  <div className="h-14 w-20 overflow-hidden rounded-md border border-stone-200 bg-stone-200">
                    {selectedTemplate?.preview ? (
                      <Image
                        src={selectedTemplate.preview}
                        alt={selectedTemplate.name}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Selected Template</p>
                    <h2 className="text-sm font-bold text-stone-900">{selectedTemplate?.name || "Royal Ivory Palace"}</h2>
                    <p className="text-[11px] text-stone-500">{selectedTemplate?.category || "Hindu Wedding"}</p>
                  </div>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-stone-200 text-stone-700 hover:bg-stone-50 text-xs rounded-lg"
                    onClick={() => router.push("/vendor/dashboard/template-library")}
                  >
                    Change Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-stone-200 text-stone-700 hover:bg-stone-50 text-xs rounded-lg"
                    onClick={() => router.push(`/templateInfo/${selectedTemplate?.templateId || selectedTemplate?.id || 1}`)}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>

            {loadingTemplates ? (
              <div className="rounded-xl border border-stone-200/80 bg-white p-6 text-center text-xs text-stone-500">
                Fetching vendor templates...
              </div>
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
              <div className="rounded-xl border border-stone-200/80 bg-white p-6 text-center text-xs text-stone-500">
                No templates available right now.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2.5">Live Preview</h3>
              <div className="overflow-hidden rounded-lg border border-stone-100 bg-stone-50">
                {selectedTemplate ? (
                  <TemplateDetail template={selectedTemplate} formData={formData} fullscreen={true} />
                ) : (
                  <div className="p-4 text-xs text-stone-500">Select a template to preview it here.</div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Publishing Cost</p>
                  <p className="mt-0.5 text-2xl font-bold text-stone-900">{formatCurrency(templatePrice)}</p>
                  <p className="text-[11px] text-stone-500">Pay only when ready to publish.</p>
                </div>
                <div className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Secure Checkout
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <Button
                  className="h-10 bg-[#6d162f] text-white hover:bg-[#581225] text-xs font-bold rounded-lg"
                  disabled={isSubmitting}
                  onClick={() => formRef.current?.submit()}
                >
                  Pay {formatCurrency(templatePrice)} &amp; Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUBTAB 3: Wedding Invitations Tab (Previous Invitations + Templates)
  // ----------------------------------------------------
  if (
    activeTab === "wedding-invitations" ||
    activeTab === "wedding-websites" ||
    activeTab === "template-library" ||
    activeTab === "my-templates"
  ) {
    const filteredTemplates = templates.filter((tpl) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        tpl.name?.toLowerCase().includes(q) ||
        tpl.category?.toLowerCase().includes(q)
      );
    });

    return (
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">Wedding Invitations</h1>
            <p className="text-xs text-stone-500">Manage your previous invitations and create new digital invitations for clients.</p>
          </div>
          <Button
            size="sm"
            className="h-9 gap-1.5 rounded-lg bg-[#6d162f] px-4 font-semibold text-white hover:bg-[#581225] text-xs cursor-pointer shadow-2xs"
            onClick={() => router.push("/vendor/dashboard/create-new-template")}
          >
            <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>Create New Invitation</span>
          </Button>
        </div>

        {/* Section 1: Previous Invitations from Database */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Your Previous Invitations ({invitations.length})
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Live and saved client wedding invitations</p>
            </div>
            {invitations.length > 0 && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {invitations.length} Active
              </span>
            )}
          </div>

          {loadingInvitations ? (
            <div className="py-8 text-center text-xs text-stone-400">Loading your invitations...</div>
          ) : invitations.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {invitations.map((inv) => {
                const liveUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inv.slug}`;
                return (
                  <div
                    key={inv._id}
                    className="flex flex-col justify-between rounded-xl border border-stone-200/80 bg-[#fcfbfa] p-4 transition hover:border-[#6d162f]/40 hover:shadow-2xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-stone-900 text-sm truncate">
                            {inv.bride} &amp; {inv.groom}
                          </h4>
                          <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                            {inv.date || "Date not specified"}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                          Live
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-stone-600">
                        {inv.venue && (
                          <p className="text-[11px] text-stone-500 truncate">
                            <span className="font-medium text-stone-700">Venue:</span> {inv.venue}
                          </p>
                        )}
                        <p className="text-[11px] text-stone-500">
                          <span className="font-medium text-stone-700">Design:</span> Template {inv.templateId || "1"}
                        </p>
                      </div>

                      {/* Live Link Box */}
                      <div className="mt-3 flex items-center justify-between rounded-lg border border-stone-200/80 bg-white px-2.5 py-1.5 text-xs">
                        <span className="font-mono text-[11px] text-stone-500 truncate max-w-45">
                          /invite/{inv.slug}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(liveUrl);
                            toast.success("Invitation link copied!");
                          }}
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#8e1d3d] hover:underline cursor-pointer ml-1 shrink-0"
                        >
                          <Copy className="h-3 w-3 stroke-[1.5]" /> Copy
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 pt-3 border-t border-stone-200/60">
                      <a
                        href={`/invite/${inv.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#6d162f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#571125] transition cursor-pointer"
                      >
                        <ExternalLink className="h-3 w-3 stroke-[1.5]" />
                        <span>Preview Live</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => router.push(`/vendor/dashboard/create-new-template?id=${inv._id}`)}
                        className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs font-medium text-stone-500">No previous invitations created yet.</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Select a template below to build and launch your first digital invitation.</p>
            </div>
          )}
        </div>

        {/* Section 2: Available Invitation Templates */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-2xs space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Available Invitation Templates ({filteredTemplates.length})
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Pick a layout to start a new couple invitation</p>
            </div>

            <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-stone-400">
              <Search className="h-3.5 w-3.5 stroke-[1.5]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full bg-transparent text-xs text-stone-900 outline-none placeholder:text-stone-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id || tpl.templateId}
                className="rounded-xl border border-stone-200/80 bg-white overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div className="aspect-4/3 bg-stone-100 overflow-hidden relative">
                  {tpl.preview ? (
                    <Image src={tpl.preview} alt={tpl.name} width={400} height={300} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">No Preview</div>
                  )}
                </div>
                <div className="p-3.5">
                  <h4 className="font-bold text-stone-900 text-xs">{tpl.name}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{tpl.category || "Wedding Invitation"}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700">{formatCurrency(tpl.vendorPrice || 400)}</span>
                    <Button
                      size="sm"
                      className="bg-[#6d162f] text-white hover:bg-[#581225] text-xs h-8 rounded-lg cursor-pointer"
                      onClick={() => router.push(`/vendor/dashboard/create-new-template?template=${tpl.templateId || tpl.id}`)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUBTAB 4: Digital Albums Tab
  // ----------------------------------------------------
  if (activeTab === "digital-albums") {
    return (
      <div className="space-y-4 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">Digital Albums</h1>
            <p className="text-xs text-stone-500">Manage album spreads, client feedback, and proofing.</p>
          </div>
          <Button
            size="sm"
            onClick={() => toast.success("Opening new digital album creator")}
            className="h-9 gap-1.5 rounded-lg bg-[#6d162f] text-white hover:bg-[#581225] text-xs"
          >
            <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>New Album</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECENT_ALBUMS_DATA.map((alb) => (
            <div key={alb.id} className="rounded-xl border border-stone-200/80 bg-white overflow-hidden shadow-2xs hover:shadow-xs transition">
              <div className="aspect-16/10 bg-stone-100 overflow-hidden relative">
                <Image src={alb.cover} alt={alb.couple} width={400} height={250} className="w-full h-full object-cover" />
              </div>
              <div className="p-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-xs">{alb.couple}</h4>
                  <StatusBadge status={alb.status} type={alb.statusType} />
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">{alb.spreads}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8 rounded-lg" onClick={() => toast.info("Opening album spread proofing")}>
                    Open Album
                  </Button>
                  <Button size="sm" className="w-full text-xs bg-[#6d162f] text-white hover:bg-[#581225] h-8 rounded-lg" onClick={() => toast.success("Album link copied to clipboard")}>
                    Share Client Link
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUBTAB 5: Plans & Subscription
  // ----------------------------------------------------
  if (activeTab === "plans" || activeTab === "billing") {
    return (
      <div className="space-y-4 font-sans">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">Studio Plans &amp; Billing</h1>
          <p className="text-xs text-stone-500">Manage your subscription, quotas, and payment history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Starter Plan */}
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-stone-900">Starter</h3>
            <p className="text-[11px] text-stone-500 mt-0.5">For budding freelance wedding creators</p>
            <p className="text-2xl font-bold text-stone-900 mt-3">₹999<span className="text-xs text-stone-400 font-normal"> / mo</span></p>
            <ul className="mt-3.5 space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> 5 Wedding Events</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> 25 GB Cloud Storage</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> Digital Album Proofing</li>
            </ul>
            <Button variant="outline" size="sm" className="w-full mt-5 text-xs rounded-lg">Choose Starter</Button>
          </div>

          {/* Pro Plan (Active) */}
          <div className="rounded-xl border-2 border-[#6d162f] bg-white p-5 shadow-xs relative">
            <span className="absolute -top-2.5 right-4 rounded bg-[#6d162f] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
              Current Plan
            </span>
            <h3 className="text-sm font-bold text-stone-900">Studio Pro</h3>
            <p className="text-[11px] text-stone-500 mt-0.5">For high-volume wedding studios</p>
            <p className="text-2xl font-bold text-stone-900 mt-3">₹2,499<span className="text-xs text-stone-400 font-normal"> / mo</span></p>
            <ul className="mt-3.5 space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> 25 Wedding Events</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> 100 GB Cloud Storage</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> Unlimited Photo Selections</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> Custom Domain Support</li>
            </ul>
            <Button disabled size="sm" className="w-full mt-5 bg-[#6d162f] text-white opacity-80 text-xs rounded-lg">Active Plan</Button>
          </div>

          {/* Enterprise */}
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-stone-900">Agency Enterprise</h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Custom limits and dedicated team manager</p>
            <p className="text-2xl font-bold text-stone-900 mt-3">₹5,999<span className="text-xs text-stone-400 font-normal"> / mo</span></p>
            <ul className="mt-3.5 space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> Unlimited Events</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> 1 TB High-speed Storage</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[1.5]" /> White-label Client Portal</li>
            </ul>
            <Button variant="outline" size="sm" className="w-full mt-5 text-xs rounded-lg" onClick={() => toast.info("Connecting to Enterprise Sales")}>Contact Sales</Button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FALLBACK: Other Tabs
  // ----------------------------------------------------
  return (
    <div className="rounded-xl border border-stone-200/80 bg-white p-6 shadow-2xs font-sans">
      <div className="max-w-xl">
        <h2 className="text-lg font-bold text-stone-900 capitalize">{activeTab.replace("-", " ")}</h2>
        <p className="mt-1 text-xs text-stone-500">
          Studio settings and tools for {activeTab.replace("-", " ")}.
        </p>
        <div className="mt-4">
          <Button
            onClick={() => router.push("/vendor/dashboard")}
            variant="outline"
            size="sm"
            className="border-stone-200 text-stone-700 rounded-lg text-xs"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VendorDashboardView({ activeTab = "dashboard" }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-100 items-center justify-center">
          <p className="text-xs text-stone-500">Loading dashboard...</p>
        </div>
      }
    >
      <VendorDashboardViewContent activeTab={activeTab} />
    </Suspense>
  );
}