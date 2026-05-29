export function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function fromSlug(slug: string) {
  return slug.replace(/-/g, " ");
}