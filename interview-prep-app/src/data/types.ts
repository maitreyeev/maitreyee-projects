export type RoleKey = "product_management" | "project_management";

export interface Round {
  order: number;
  id: string;
  name: string;
  format: string;
  focus: string;
  evaluates: string;
  questions: string[];
}

export interface RoleTrack {
  roleLabel: string;
  displayRole: string;
  rounds: Round[];
}

export interface RoleMeta {
  roleLabel: string;
  displayRole: string;
  roundCount: number;
}

// Lightweight, bundled-everywhere metadata — no questions/rounds detail.
// Used for the company picker, confirm screen, and anywhere else that only
// needs a name/color/round count, not the actual question bank.
export interface CompanyMeta {
  id: string;
  name: string;
  color: string;
  accent: string;
  roles: Partial<Record<RoleKey, RoleMeta>>;
}

export interface CompanyMetaDataset {
  companies: CompanyMeta[];
}

// Full per-company data (rounds + questions), loaded on demand only for
// the one company actually selected — see src/data/index.ts loadCompanyData.
export interface CompanyData {
  roles: Partial<Record<RoleKey, RoleTrack>>;
}
