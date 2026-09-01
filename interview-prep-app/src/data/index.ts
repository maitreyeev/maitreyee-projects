import metaRaw from "./companies-meta.json";
import type { CompanyMeta, CompanyMetaDataset, CompanyData, RoleKey } from "./types";

const metaDataset = metaRaw as CompanyMetaDataset;
export const COMPANIES: CompanyMeta[] = metaDataset.companies;

export const ROLE_OPTIONS: { key: RoleKey; label: string }[] = [
  { key: "product_management", label: "Product Management" },
  { key: "project_management", label: "Project Management" },
];

export function getCompany(companyId: string): CompanyMeta | undefined {
  return COMPANIES.find((c) => c.id === companyId);
}

export function getRoleMeta(companyId: string, role: RoleKey) {
  return getCompany(companyId)?.roles[role];
}

// Only the interview flow needs actual questions, and only for the one
// company the user picked — everything else (onboarding, results, history)
// works off the ~4KB metadata file above. Each company file is ~10-14KB.
const companyDataLoaders: Record<string, () => Promise<{ default: CompanyData }>> = {
  google: () => import("./companies/google.json"),
  anthropic: () => import("./companies/anthropic.json"),
  amazon: () => import("./companies/amazon.json"),
  microsoft: () => import("./companies/microsoft.json"),
  qualcomm: () => import("./companies/qualcomm.json"),
  meta: () => import("./companies/meta.json"),
  apple: () => import("./companies/apple.json"),
  netflix: () => import("./companies/netflix.json"),
};

export async function loadRoleTrack(companyId: string, role: RoleKey) {
  const loader = companyDataLoaders[companyId];
  if (!loader) return undefined;
  const mod = await loader();
  return mod.default.roles[role];
}

export type { CompanyMeta, RoleKey, Round, RoleTrack, RoleMeta, CompanyData } from "./types";
