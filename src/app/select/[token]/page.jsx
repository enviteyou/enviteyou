import ClientGallery from "@/components/photo-selection/ClientGallery";

export default async function ClientSelectionPage({ params }) {
  const resolvedParams = await params;
  return <ClientGallery token={resolvedParams.token} />;
}
