// Lightweight keyword classification for NASA bioscience publications.

const lower = (s: string) => (s || "").toLowerCase();

export function detectOrganism(text: string): string | null {
  const t = lower(text);
  const map: [string, string][] = [
    ["arabidopsis", "Arabidopsis"],
    ["plant", "Plants"],
    ["seedling", "Plants"],
    ["mice", "Mouse"],
    ["mouse", "Mouse"],
    ["murine", "Mouse"],
    ["rat ", "Rat"],
    ["human", "Human"],
    ["astronaut", "Human"],
    ["drosophila", "Drosophila"],
    ["c. elegans", "C. elegans"],
    ["caenorhabditis", "C. elegans"],
    ["yeast", "Yeast"],
    ["saccharomyces", "Yeast"],
    ["bacteri", "Bacteria"],
    ["microbi", "Microbes"],
    ["fungi", "Fungi"],
    ["zebrafish", "Zebrafish"],
  ];
  for (const [needle, label] of map) if (t.includes(needle)) return label;
  return null;
}

export function detectSubject(text: string): string {
  const t = lower(text);
  if (/(machine learning|deep learning|neural network|artificial intelligence|algorithm)/.test(t))
    return "AI & Machine Learning";
  if (/(database|data management|repository|metadata|omics pipeline)/.test(t)) return "Data Management";
  if (/(education|outreach|curriculum|classroom|student)/.test(t)) return "Education";
  if (/(software|tool|platform|workflow|pipeline)/.test(t)) return "Software";
  if (/(communication|writing|report|review of literature)/.test(t)) return "Writing & Communications";
  return "Flora & Fauna";
}

export function detectMission(text: string): string {
  const t = lower(text);
  if (/(international space station|\biss\b|expedition|spacex crs|space station)/.test(t)) return "ISS";
  if (/(space shuttle|sts-|shuttle)/.test(t)) return "Shuttle";
  if (/apollo/.test(t)) return "Apollo";
  if (/(bion|foton|shenzhou|soyuz|artemis)/.test(t)) return "Other";
  return "Ground / Analog";
}

export function detectImpact(text: string): string {
  const t = lower(text);
  if (/(mars|deep space|long-duration|interplanetary)/.test(t)) return "Mars";
  if (/(lunar|moon|artemis|regolith)/.test(t)) return "Moon";
  return "Earth";
}

export function detectTags(text: string, subject: string, organism: string | null): string[] {
  const t = lower(text);
  const tags = new Set<string>([subject]);
  const topics: [RegExp, string][] = [
    [/microgravit|weightless|0-g|zero gravity/, "Microgravity"],
    [/radiation|cosmic ray|irradiat/, "Radiation"],
    [/bone|skeletal|osteo/, "Bone Loss"],
    [/muscle|atrophy|sarcopenia/, "Muscle"],
    [/immune|immunolog|inflammat/, "Immunology"],
    [/gene expression|transcriptom|rna-seq|genom/, "Genomics"],
    [/microbiome|microbial/, "Microbiome"],
    [/root|photosynth|germinat|crop|agricultur|harvest/, "Plant Growth"],
    [/cardio|heart|vascular/, "Cardiovascular"],
    [/neuro|brain|cognitive|vestibular/, "Neuroscience"],
    [/stress toleran|drought|salinity|heat stress/, "Stress Tolerance"],
    [/cell wall|cellulose/, "Cell Biology"],
    [/food|nutrition|diet/, "Nutrition"],
  ];
  for (const [re, label] of topics) if (re.test(t)) tags.add(label);
  if (organism) tags.add(organism);
  return [...tags].slice(0, 6);
}

export function classify(title: string, body = "") {
  const text = `${title} ${body}`;
  const organism = detectOrganism(text);
  const subject = detectSubject(text);
  return {
    organism,
    subject,
    mission: detectMission(text),
    impact: detectImpact(text),
    tags: detectTags(text, subject, organism),
  };
}
