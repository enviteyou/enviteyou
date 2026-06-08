"use client";

import { useEffect, useState } from "react";
import { Link2, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.pageYOffset / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-neutral-100 z-50">
      <div
        className="h-full bg-gradient-to-r from-[#74313d] to-[#a2515f] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

export function BlogShareButtons({ blogTitle = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== "undefined") {
      const text = encodeURIComponent(`Check out this article: "${blogTitle}" - ${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* WhatsApp Share Button */}
      <button
        onClick={handleWhatsAppShare}
        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366]/10 text-[#128C7E] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#25D366]/20 transition-all duration-200 cursor-pointer"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.557 1.876 14.079.845 11.458.845 6.022.845 1.6 5.263 1.595 10.702c-.001 1.687.447 3.328 1.299 4.764l-.979 3.57 3.656-.959c1.408.77 2.99 1.173 4.58 1.177zm11.366-4.854c-.3-.15-1.77-.874-2.043-.974-.275-.1-.475-.15-.675.15-.2.3-.77.974-.945 1.174-.175.2-.35.225-.65.075-.3-.15-1.264-.467-2.409-1.487-.89-.793-1.49-1.77-1.665-2.07-.175-.3-.019-.462.13-.611.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.519-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8 1.075-.275 1-.945 2.3-1.02 2.45-.075.15-.15.325.05.525.2.2.475.55.75.875.42.493.882.983 1.378 1.393.975.807 1.795 1.199 2.766 1.41.975.21 1.77.16 2.44.06.75-.11 2.274-.93 2.585-1.83.31-.9.31-1.677.218-1.83-.092-.153-.275-.245-.575-.395z" />
        </svg>
        <span>WhatsApp</span>
      </button>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 rounded-xl border border-black/8 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black/2 transition-all duration-200 text-black cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="size-4 text-emerald-600" />
            <span className="text-emerald-700">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="size-4" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
