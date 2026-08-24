export const finalModes = [
  { id: "everyday", label: "Everyday", description: "Lowercase common-word flow for smooth learning." },
  { id: "story", label: "Story", description: "Readable mini-scenes with flow and variety." },
  { id: "challenge", label: "Challenge", description: "Competitive pressure with punctuation and longer transitions." },
  { id: "code", label: "Code", description: "Programming syntax, identifiers, and symbols." },
];

export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you",
  "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one",
  "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some",
  "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these",
  "give", "day", "most", "us", "is", "are", "was", "were", "had", "been", "more", "may", "very", "should", "through",
  "where", "much", "before", "right", "too", "same", "tell", "does", "set", "three", "small", "large", "learn", "feel",
  "hand", "place", "school", "nation", "while", "point", "group", "child", "world", "study", "still", "try", "kind",
  "every", "own", "present", "under", "number", "again", "possible", "line", "turn", "fact", "keep", "begin", "help",
];

export const everydaySubjects = [
  "The project", "A student", "The team", "My calendar", "The report", "A clear plan", "The meeting", "Your message",
  "The design", "A focused morning", "The workshop", "The customer", "A useful note", "The budget", "The schedule",
  "A simple habit", "The document", "The lesson", "A careful review", "The application",
];

export const everydayActions = [
  "needs a calm review", "moves forward with steady progress", "becomes easier after a short break", "works better with clear notes",
  "should be finished before lunch", "improves when the details are organized", "helps everyone stay aligned",
  "requires patience and accuracy", "feels manageable with a realistic deadline", "gets stronger through daily practice",
  "depends on consistent communication", "is ready for one final update", "benefits from a cleaner explanation",
  "can be solved with a smaller first step", "makes more sense after careful reading", "deserves a thoughtful response",
  "turns into progress when you begin", "is easier when the goal is visible",
];

export const everydayEndings = [
  "before the day gets busy.", "while the idea is still fresh.", "because clarity saves time later.",
  "without rushing the important parts.", "and the result feels more reliable.", "so the next step is obvious.",
  "with enough room for a second pass.", "while keeping the tone professional.", "and the process stays simple.",
  "because small improvements compound quickly.",
];

export const storyFragments = [
  "Mira found an old notebook under the library stairs, and every page seemed to answer a question she had not asked.",
  "The train slowed near the coast, giving everyone a quiet minute to watch the rain soften the lights outside.",
  "A small bakery opened before sunrise, filling the street with warmth while the city was still half asleep.",
  "Jon kept the map folded in his jacket, not because he needed directions, but because it reminded him to continue.",
  "The garden behind the school looked ordinary until the wind moved through it and the hidden bells began to ring.",
  "At the end of the pier, a painter waited for the sky to choose a color worth remembering.",
  "The first message arrived at noon, polite and simple, but it changed the shape of the entire week.",
  "Nina repaired the radio by listening closely to the pauses between bursts of sound.",
  "The village clock stopped during the storm, and for one peaceful hour nobody felt late.",
  "A quiet promise can travel farther than a loud announcement when the right person hears it.",
];

export const challengeSentences = [
  "Accuracy matters most when pressure rises; speed without control breaks quickly.",
  "Can you hold rhythm through commas, clauses, and sudden direction changes?",
  "The final stretch reveals whether your pace is stable or simply rushed.",
  "Great typists accelerate only after their hands prove they can stay clean.",
  "Short bursts are useful, but endurance exposes every hidden weakness.",
  "If you panic after one mistake, the next five words usually suffer too.",
  "A balanced run protects accuracy, rhythm, punctuation, and recovery.",
  "The goal is not frantic motion; the goal is controlled momentum.",
  "Push the pace, but do not let your fingers outrun your attention.",
  "Consistency beats a single fast spike when the session gets difficult.",
];

export const codeSnippets = [
  "const result = await fetchUserProfile(userId);",
  "function calculateAccuracy(correct, total) { return total ? correct / total : 0; }",
  "if (status === 'ready') { startTrainingSession(); }",
  "const weakKeys = mistakes.filter(item => item.count > 2);",
  "export const formatWpm = value => Math.round(value || 0);",
  "try { await api.post('/results', payload); } catch (error) { console.error(error); }",
  "const nextLevel = xp >= 1600 ? 'Speed Hunter' : 'Accuracy Soldier';",
  "items.map((item) => ({ ...item, completed: false }));",
  "for (const key of Object.keys(patterns)) { score += patterns[key]; }",
  "return sentences.slice(0, limit).join(' ');",
];

export const weakKeyWords = {
  q: ["quiet", "quality", "question", "equal"],
  w: ["window", "between", "forward", "review"],
  e: ["better", "review", "sentence", "create"],
  r: ["report", "progress", "careful", "return"],
  t: ["steady", "thought", "letter", "target"],
  y: ["you", "daily", "rhythm", "system"],
  u: ["useful", "usually", "future", "during"],
  i: ["simple", "writing", "minute", "finish"],
  o: ["focus", "motion", "project", "control"],
  p: ["practice", "people", "support", "prepare"],
  a: ["accuracy", "calendar", "habit", "manage"],
  s: ["session", "message", "process", "consistent"],
  d: ["deadline", "design", "steady", "document"],
  f: ["focus", "before", "effort", "feedback"],
  g: ["progress", "organize", "strong", "begin"],
  h: ["through", "rhythm", "thought", "habit"],
  j: ["adjust", "project", "major", "object"],
  k: ["break", "workshop", "keyboard", "track"],
  l: ["clear", "lesson", "reliable", "aligned"],
  z: ["organize", "realize", "zero", "size"],
  x: ["exact", "example", "context", "next"],
  c: ["clear", "customer", "practice", "accuracy"],
  v: ["review", "visible", "improve", "every"],
  b: ["before", "budget", "break", "balanced"],
  n: ["minute", "sentence", "continue", "begin"],
  m: ["message", "morning", "momentum", "simple"],
};

export const beginnerLessons = [
  { title: "Home Row", subtitle: "Build your base", text: "asdf jkl; ask fall dad sad flask salad all fall ask dad" },
  { title: "Top Row", subtitle: "Reach with control", text: "type write quiet power route quote wire retry your type" },
  { title: "Bottom Row", subtitle: "Strengthen the lower row", text: "zoom calm mix van comma zinc cabin move zoom calm" },
  { title: "Common Words", subtitle: "Find everyday flow", text: "the and for with that from this have your will there" },
  { title: "Accuracy First", subtitle: "Slow is smooth", text: "steady hands create clean words and clean words create speed" },
  { title: "No Looking", subtitle: "Trust your fingers", text: "focus forward trust the pattern feel the keys find the rhythm" },
];

export const baseSentenceCount =
  everydaySubjects.length * everydayActions.length +
  storyFragments.length +
  challengeSentences.length +
  codeSnippets.length;
