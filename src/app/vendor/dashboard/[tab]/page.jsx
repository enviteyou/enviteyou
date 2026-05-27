import VendorDashboardView from "@/components/vendor/VendorDashboardView";

export default async function VendorDashboardTabPage({ params }) {
  const resolvedParams = await params;
  return <VendorDashboardView activeTab={resolvedParams?.tab || "dashboard"} />;
}