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

export interface Company {
  id: string;
  name: string;
  color: string;
  accent: string;
  roles: Partial<Record<RoleKey, RoleTrack>>;
}

export interface InterviewDataset {
  companies: Company[];
}
