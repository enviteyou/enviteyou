import Link from "next/link";
import "../(site)/globals.css";

export const metadata = {
  title: "Vendor — EnviteYou",
};

export default function VendorLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.06),transparent_28%),linear-gradient(135deg,#f7f6f3_0%,#ffffff_42%,#f3f4f6_100%)] text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-black/65 transition hover:text-black">
            ← Back to site
          </Link>
          <p className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-black/55 backdrop-blur">
            Vendor Portal
          </p>
        </header>

        <div className="grid flex-1 items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <aside className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-black px-6 py-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:px-8 sm:py-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold tracking-[0.18em]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-black">
                  E
                </span>
                EnviteYou
              </div>

              <h1 className="mt-8 max-w-md text-4xl font-semibold tracking-tight sm:text-5xl">
                Vendor Portal
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
                Manage your business profile, track approval status, and access the vendor dashboard from one place.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Fast onboarding</p>
                  <p className="mt-2 text-sm leading-6 text-white/80">Create your vendor account with business details and contact info.</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Approval flow</p>
                  <p className="mt-2 text-sm leading-6 text-white/80">Login becomes active after admin confirmation.</p>
                </div>
              </div>
            </div>

            <div className="relative mt-8 border-t border-white/10 pt-6 text-sm text-white/65 lg:mt-0">
              Built for vendor sign up, sign in, and portal access.
            </div>
          </aside>

          <div className="flex items-center justify-center lg:justify-end">{children}</div>
        </div>
      </div>
    </div>
  );
}
