import raw from "./interview-data.json";
import type { Company, InterviewDataset, RoleKey } from "./types";

export const dataset = raw as InterviewDataset;
export const COMPANIES: Company[] = dataset.companies;

export const ROLE_OPTIONS: { key: RoleKey; label: string }[] = [
  { key: "product_management", label: "Product Management" },
  { key: "project_management", label: "Project Management" },
];

export function getCompany(companyId: string): Company | undefined {
  return COMPANIES.find((c) => c.id === companyId);
}

export function getRoleTrack(companyId: string, role: RoleKey) {
  return getCompany(companyId)?.roles[role];
}

export type { Company, RoleKey, Round, RoleTrack } from "./types";
