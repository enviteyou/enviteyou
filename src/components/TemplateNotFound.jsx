import Link from "next/link";

export default function TemplateNotFound({ templates, id }) {
  return (
    <main className="bg-white px-5 py-10 text-black sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">Template not found</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black sm:text-5xl">Choose a design from the gallery.</h1>
          <p className="mt-4 text-base leading-7 text-black/60">
            The requested template id <strong>{String(id)}</strong> did not match any available templates. Select one below to continue.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {templates.map((t) => (
            <Link 
              key={t.templateId || t.id} 
              href={`/templateInfo/${t.templateId || t.id}`} 
              className="rounded border p-4 text-sm hover:shadow transition"
            >
              <p className="font-semibold">{t.name}</p>
              <p className="text-xs text-black/60 mt-1">{t.tag}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
