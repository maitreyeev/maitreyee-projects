/* eslint-disable @typescript-eslint/no-require-imports */
// One-off build script: merges the two research JSON files, trims every
// role-track down to a uniform 5 rounds (keeping the most distinctive/iconic
// rounds per company), and writes a clean typed dataset to src/data/interview-data.json.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const g1 = require(path.join(ROOT, "data/research/group1.json"));
const g2 = require(path.join(ROOT, "data/research/group2.json"));
const merged = { ...g1, ...g2 };

// Explicit round ids to drop per company/role so every track lands at 5 rounds.
const DROP = {
  Google: {
    product_management: ["product-sense-phone-screen"],
    project_management: ["hiring-manager-screen"],
  },
  Amazon: {
    product_management: ["hiring-manager-screen", "writing-assessment"],
    project_management: ["hiring-manager-phone-screen"],
  },
  Microsoft: {
    project_management: ["hiring-manager-screen"],
  },
};

const COMPANY_META = {
  Google: { color: "#4285F4", accent: "#EA4335" },
  Anthropic: { color: "#D97757", accent: "#1A1918" },
  Amazon: { color: "#FF9900", accent: "#146EB4" },
  Microsoft: { color: "#00A4EF", accent: "#7FBA00" },
  Qualcomm: { color: "#3253DC", accent: "#00B2A9" },
  Meta: { color: "#0866FF", accent: "#00C6FF" },
  Apple: { color: "#111114", accent: "#A2AAAD" },
  Netflix: { color: "#E50914", accent: "#221F1F" },
};

const ROLE_LABELS = {
  product_management: "Product Management",
  project_management: "Project Management",
};

const out = { companies: [] };

for (const companyName of Object.keys(merged)) {
  const companyId = companyName.toLowerCase();
  const roles = merged[companyName];
  const roleTracks = {};

  for (const roleKey of Object.keys(roles)) {
    const track = roles[roleKey];
    const dropIds = new Set((DROP[companyName] && DROP[companyName][roleKey]) || []);
    let rounds = track.rounds.filter((r) => !dropIds.has(r.id));
    // Safety net: if still not exactly 5 (data drift), trim from the back but
    // never drop the last round (usually the most senior/final round).
    if (rounds.length > 5) {
      const last = rounds[rounds.length - 1];
      rounds = rounds.slice(0, 4).concat(last);
    }
    rounds = rounds.map((r, i) => ({
      order: i + 1,
      id: r.id,
      name: r.name,
      format: r.format,
      focus: r.focus,
      evaluates: r.evaluates,
      questions: r.questions,
    }));

    roleTracks[roleKey] = {
      roleLabel: ROLE_LABELS[roleKey],
      displayRole: track.displayRole,
      rounds,
    };
  }

  out.companies.push({
    id: companyId,
    name: companyName,
    color: (COMPANY_META[companyName] || {}).color || "#333333",
    accent: (COMPANY_META[companyName] || {}).accent || "#666666",
    roles: roleTracks,
  });
}

const destDir = path.join(ROOT, "src/data");
fs.mkdirSync(destDir, { recursive: true });
fs.writeFileSync(
  path.join(destDir, "interview-data.json"),
  JSON.stringify(out, null, 2)
);

// Report
for (const c of out.companies) {
  for (const roleKey of Object.keys(c.roles)) {
    console.log(c.name, roleKey, "->", c.roles[roleKey].rounds.length, "rounds");
  }
}
console.log("Wrote src/data/interview-data.json with", out.companies.length, "companies");
