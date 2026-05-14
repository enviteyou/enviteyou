import Image from "next/image";
import Link from "next/link";

export default function TemplateDetail({ template }) {
  if (!template) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-black shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
          Template not found
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Choose a design from the gallery.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">
          This template link does not match the current temporary data. Go back to the homepage and select one
          of the available wedding website templates.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
        >
          View Templates
        </Link>
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[4/3] bg-black">
        {template.preview ? (
          <Image
            src={template.preview}
            alt={`${template.name} wedding website preview`}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-white">
            Preview coming soon
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black">
          {template.tag}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
              Selected template
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">{template.name}</h1>
          </div>
          <div className="w-fit rounded-full border border-black bg-black px-5 py-2 text-sm font-semibold text-white">
            {template.price}
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-base leading-7 text-black/65">{template.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Palette</p>
            <p className="mt-2 text-sm font-medium text-black">{template.palette}</p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Best for</p>
            <p className="mt-2 text-sm font-medium leading-5 text-black">{template.bestFor}</p>
          </div>
        </div>

        <div className="mt-7">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">What is included</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {template.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm font-medium text-black">
                <span className="h-2 w-2 rounded-full bg-black" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
