import api from "@/api/axios";

const DEFAULT_FEATURES = ["Live preview", "Mobile friendly", "Editable details", "Instant sharing"];

function formatCurrency(value) {
  const numericValue = Number(value);

  if (Number.isFinite(numericValue)) {
    return `INR ${numericValue.toLocaleString("en-IN")}`;
  }

  return "Wedding template";
}

export function normalizeTemplate(template, index = 0) {
  if (!template) return null;

  const id = template.id || template._id || String(index);
  const templateId = String(template.templateId || template.id || template._id || index + 1);
  const name = template.title?.trim() || template.name?.trim() || "Wedding Template";
  const description = template.description?.trim() || "A premium digital invitation template.";
  const category = template.category?.trim() || "Wedding";
  const image = template.featuredImage || template.preview || "";
  const price = template.pricing?.trim() || formatCurrency(template.sellPrice ?? template.vendorPrice ?? template.regularPrice);

  return {
    ...template,
    id,
    templateId,
    name,
    title: name,
    description,
    preview: image,
    featuredImage: image,
    price,
    tag: template.tag?.trim() || category,
    palette: template.palette?.trim() || category,
    bestFor: template.bestFor?.trim() || category,
    features: Array.isArray(template.features) && template.features.length ? template.features : DEFAULT_FEATURES,
  };
}

export function normalizeTemplates(templates = []) {
  return templates.map((template, index) => normalizeTemplate(template, index)).filter(Boolean);
}

export async function getTemplates() {
  const response = await api.get("/templates");
  const rawTemplates = Array.isArray(response?.data) ? response.data : Array.isArray(response?.data?.data) ? response.data.data : [];

  return normalizeTemplates(rawTemplates);
}

export async function getTemplateById(id) {
  if (!id) return null;

  const normalizedId = String(id).toLowerCase().trim();

  try {
    const response = await api.get(`/templates/${encodeURIComponent(id)}`);
    const rawTemplate = response?.data?.data || response?.data;
    const normalizedTemplate = normalizeTemplate(rawTemplate);

    if (normalizedTemplate) {
      return normalizedTemplate;
    }
  } catch (error) {
    if (!error?.response || error.response.status !== 404) {
      // Fall through to the catalog lookup so the UI can still render legacy ids.
    }
  }

  const templates = await getTemplates();

  return (
    templates.find((template) => {
      const candidates = [template.templateId, template.id, template._id, template.title, template.name, template.category];
      return candidates.some((value) => String(value).toLowerCase().trim() === normalizedId);
    }) || null
  );
}
