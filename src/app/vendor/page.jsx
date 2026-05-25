import Link from "next/link";

export default function VendorIndexPage() {
  return (
    <section className="mx-auto max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black">EnviteYou Vendor</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-black">Vendor access</h1>
      <p className="mt-1 text-sm text-black/65">Sign in or create a vendor account to manage your listings.</p>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <Link
          href="/vendor/signup"
          className="block rounded-xl bg-black px-4 py-3 text-center text-white font-semibold"
        >
          Create vendor account
        </Link>
        <Link
          href="/vendor/signin"
          className="block rounded-xl border border-black/10 px-4 py-3 text-center font-semibold text-black"
        >
          Vendor sign in
        </Link>
      </div>
    </section>
  );
}
