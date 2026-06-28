// ─── Skills data helper ───────────────────────────────────────────────────────
// Loads /skills-data.json once and provides a fast name→category lookup.

interface SkillEntry { name: string; category: string; }

let cache: Map<string, string> | null = null;
let loadPromise: Promise<Map<string, string>> | null = null;

export async function getSkillCategoryMap(): Promise<Map<string, string>> {
  if (cache) return cache;
  if (!loadPromise) {
    loadPromise = fetch('/skills-data.json')
      .then((r) => r.json() as Promise<SkillEntry[]>)
      .then((data) => {
        const m = new Map<string, string>();
        for (const s of data) m.set(s.name.toLowerCase(), s.category);
        cache = m;
        return m;
      });
  }
  return loadPromise;
}

// ─── Canonical category order ─────────────────────────────────────────────────

const CATEGORY_ORDER: string[] = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Frameworks & Libraries',
  'Mobile Development',
  'Databases',
  'DevOps & Cloud',
  'Cloud',
  'DevOps',
  'Testing',
  'AI & Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Data Visualization',
  'Analytics',
  'Tools',
  'Office & Productivity',
  'Collaboration',
  'Project Management',
  'Design',
  'CMS',
  'E-commerce',
  'CRM',
  'ERP',
  'Marketing',
  'Networking',
  'Soft Skills',
];

const CATEGORY_RANK = new Map(CATEGORY_ORDER.map((cat, i) => [cat.toLowerCase(), i]));

function categoryRank(cat: string): number {
  const rank = CATEGORY_RANK.get(cat.toLowerCase());
  // Unknown categories go after all known ones, in insertion order
  return rank ?? CATEGORY_ORDER.length;
}

/**
 * Groups selected skill names by category from skills-data.json,
 * then sorts the groups by the canonical order defined above.
 * Skills not found in the list land in "Other" (appended last).
 * Returns SkillRow[] ready for ModernResume: [{ label, value }]
 */
export function groupSkillsToRows(
  selected: string[],
  categoryMap: Map<string, string>,
): { label: string; value: string }[] {
  const grouped = new Map<string, string[]>();

  for (const name of selected) {
    const cat = categoryMap.get(name.toLowerCase()) ?? 'Other';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(name);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => categoryRank(a) - categoryRank(b))
    .map(([label, names]) => ({ label, value: names.join(', ') }));
}
