"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import api from "@/api/axios";
import DigitalAlbumViewer from "@/components/album/DigitalAlbumViewer";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

function AlbumContent() {
  const params = useParams();
  const token = params?.token;

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    let ignore = false;
    setLoading(true);

    api
      .get(`/album/public/${token}`)
      .then((res) => {
        if (ignore) return;
        if (res.data?.success) {
          setAlbum(res.data.album);
        } else {
          setError(res.data?.message || "Failed to load album.");
        }
      })
      .catch((err) => {
        if (ignore) return;
        console.error("Fetch album error:", err);
        setError(err.response?.data?.message || "Album not found or unavailable.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0e13] text-white">
        <Loader2 className="h-10 w-10 animate-spin text-amber-400 mb-3" />
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200/70">
          Loading Digital Album...
        </p>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0e13] p-4 text-center text-white">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Album Unavailable</h1>
        <p className="mt-2 max-w-md text-sm text-white/60">
          {error || "The requested digital photo album could not be found or has been removed."}
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-amber-400"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return <DigitalAlbumViewer album={album} />;
}

export default function PublicAlbumPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0e13] text-white">
          <Loader2 className="h-10 w-10 animate-spin text-amber-400 mb-3" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200/70">
            Preparing Digital Album...
          </p>
        </div>
      }
    >
      <AlbumContent />
    </Suspense>
  );
}
