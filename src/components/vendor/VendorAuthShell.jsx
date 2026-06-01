import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Shield, TrendingUp, Users } from "lucide-react";

export default function VendorAuthShell({ children, title, subtitle, footerText }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f2ea_0%,#f5efe7_100%)] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(217,181,145,0.12),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col rounded-[2rem] border border-white/70  shadow-[0_28px_90px_rgba(37,24,16,0.12)] backdrop-blur-sm lg:flex-row">
        <aside className="relative flex overflow-hidden rounded-t-[2rem] bg-[#081326] text-white lg:w-[47%] lg:rounded-l-[2rem] lg:rounded-tr-none">
          <Image
            src="/vendor_signup.png"
            alt="Vendor signup inspiration"
            fill
            priority
            sizes="(min-width: 1024px) 47vw, 100vw"
            className="object-cover object-center"
          />
          {/* <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.22)_0%,rgba(5,12,24,0.5)_45%,rgba(5,12,24,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,170,105,0.18),transparent_24%)]" /> */}

          <div className="relative z-10 flex w-full flex-col px-5 py-5 sm:px-7 sm:py-7 lg:min-h-full lg:px-8 lg:py-8" style={{ minHeight: "34rem" }}>
            <div className="flex items-center justify-between text-xs font-medium text-white/68">
              <Link href="/" className="inline-flex items-center gap-2 transition hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to site
              </Link>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 uppercase tracking-[0.24em] text-white/70 backdrop-blur">
                Partner Portal
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
              <Image
                src="/icon2.png"
                alt="EnviteYou icon"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
                priority
              />
              <Image
                src="/logo.png"
                alt="EnviteYou"
                width={160}
                height={48}
                className="h-7 w-auto object-contain sm:h-8"
                priority
              />
            </div>

            <div className="max-w-md pt-4 sm:pt-6 lg:pt-7">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2.6rem] lg:leading-[1.02]">
                {title}
              </h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/72 sm:text-[0.95rem]">
                {subtitle}
              </p>

              <div className="mt-7 space-y-3.5 text-sm text-white/74">
                {[
                  {
                    icon: Shield,
                    title: "Verified vendor network",
                    text: "Join a trusted community of approved wedding professionals.",
                  },
                  {
                    icon: Users,
                    title: "Direct customer leads",
                    text: "Receive genuine enquiries from couples planning their events.",
                  },
                  {
                    icon: Clock,
                    title: "Quick approval",
                    text: "Get verified and start receiving leads within 24-48 hours.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Business growth",
                    text: "Build your brand, showcase your work, and grow your business.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-2xl bg-white/6 p-3 backdrop-blur-sm">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-[#f7b07b]">
                      <item.icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[0.95rem] font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-[0.92rem] leading-6 text-white/66">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8 text-xs text-white/55">
              {footerText}
            </div>
          </div>
        </aside>

        <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-black/5 bg-[#fffaf4] px-5 py-6 shadow-[0_16px_50px_rgba(30,18,10,0.06)] sm:px-7 sm:py-8">
            <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b77c56]">
              <span className="h-px w-8 bg-[#d9a17a]" />
              EnviteYou Vendor
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}