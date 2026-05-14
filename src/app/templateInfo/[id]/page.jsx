import TemplateDetail from "../../../components/TemplateDetail";
import TemplateForm from "../../../components/TemplateForm";
import { getTemplateById } from "../../../lib/templates";

export default async function TemplatePage({ params }) {
  const { id } = await params;
  const template = getTemplateById(id);

  return (
    <main className="bg-white px-5 py-10 text-black sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">
            Build your wedding website
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
            Customize your selected template.
          </h1>
          <p className="mt-4 text-base leading-7 text-black/60">
            Fill in the essentials and review the template details before you save your wedding website.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <TemplateForm template={template} />
          <TemplateDetail template={template} />
        </div>
      </div>
    </main>
  );
}
