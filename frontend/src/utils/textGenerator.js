import {
  challengeSentences,
  codeSnippets,
  commonWords,
  everydayActions,
  everydayEndings,
  everydaySubjects,
  storyFragments,
  weakKeyWords,
} from "../data/wordBanks";

const historyKey = "typotoxic_recent_text";
const sentenceHistoryKey = "typotoxic_recent_sentences";
const pick = (items) => items[Math.floor(Math.random() * items.length)];
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const recentTexts = () => JSON.parse(localStorage.getItem(historyKey) || "[]");
const recentSentences = () => JSON.parse(localStorage.getItem(sentenceHistoryKey) || "[]");
const remember = (text) => {
  const next = [text, ...recentTexts()].slice(0, 24);
  localStorage.setItem(historyKey, JSON.stringify(next));
  return text;
};

const rememberSentences = (sentences) => {
  const next = [...sentences, ...recentSentences()].slice(0, 80);
  localStorage.setItem(sentenceHistoryKey, JSON.stringify(next));
  return sentences;
};

const everydaySentence = (difficulty = 3) => {
  const sentence = `${pick(everydaySubjects)} ${pick(everydayActions)} ${pick(everydayEndings)}`;
  if (difficulty < 5) return sentence;
  return `${sentence} ${pick(everydaySubjects).toLowerCase()} ${pick(everydayActions)}.`;
};

const targetedWords = (weakKeys = [], weakWords = []) => {
  const keys = weakKeys.map((item) => item.key || item).filter(Boolean);
  const words = weakWords.map((item) => item.word || item).filter(Boolean);
  const fromKeys = keys.flatMap((key) => weakKeyWords[String(key).toLowerCase()] || []);
  return shuffle([...words, ...fromKeys]).slice(0, 12);
};

const wordParagraph = ({ weakKeys = [], weakWords = [], aiSession = null, words = 30 } = {}) => {
  const focusWords = targetedWords(weakKeys.length ? weakKeys : aiSession?.weakKeys || [], weakWords.length ? weakWords : aiSession?.weakWords || [])
    .map((word) => String(word).toLowerCase().replace(/[^a-z]/g, ""))
    .filter(Boolean);
  const pool = shuffle([...commonWords, ...commonWords, ...focusWords]);
  return Array.from({ length: words }, (_, index) => pool[index % pool.length]).join(" ");
};

export const generateText = ({ mode = "everyday", weakKeys = [], weakWords = [], length = 4, aiSession = null } = {}) => {
  const difficulty = aiSession?.difficulty || 3;
  const focusWords = targetedWords(weakKeys.length ? weakKeys : aiSession?.weakKeys || [], weakWords.length ? weakWords : aiSession?.weakWords || []);
  let candidates = [];

  if (mode === "code") {
    candidates = shuffle([...codeSnippets, ...codeSnippets.map((line) => line.replace("const", "let"))]).slice(0, difficulty > 6 ? 7 : 5);
    return remember(candidates.join("\n"));
  }

  if (mode === "story") {
    candidates = shuffle(storyFragments).slice(0, difficulty > 6 ? 4 : 3);
  } else if (mode === "challenge") {
    candidates = shuffle(challengeSentences).slice(0, difficulty > 6 ? 5 : 3);
  } else {
    candidates = Array.from({ length: difficulty > 6 ? 5 : length }, () => everydaySentence(difficulty));
  }

  if (focusWords.length) {
    candidates.splice(1, 0, `Focus words: ${focusWords.join(", ")}.`);
  }

  const recent = recentTexts();
  let text = candidates.join(" ");
  if (recent.includes(text)) text = shuffle(candidates).join(" ");
  return remember(text);
};

export const generateSentences = ({ mode = "everyday", weakKeys = [], weakWords = [], count = 9, aiSession = null } = {}) => {
  const difficulty = aiSession?.difficulty || 3;
  const focusWords = targetedWords(weakKeys.length ? weakKeys : aiSession?.weakKeys || [], weakWords.length ? weakWords : aiSession?.weakWords || []);
  const recent = new Set(recentSentences());
  const sentences = [];
  const add = (sentence) => {
    const clean = sentence.trim();
    if (!clean || recent.has(clean) || sentences.includes(clean)) return;
    sentences.push(clean);
  };

  if (focusWords.length) add(`Focus words: ${focusWords.slice(0, 8).join(", ")}.`);

  let guard = 0;
  while (sentences.length < count && guard < count * 12) {
    guard += 1;
    if (mode === "code") add(pick(codeSnippets));
    else if (mode === "story") add(pick(storyFragments));
    else if (mode === "challenge") add(pick(challengeSentences));
    else add(everydaySentence(difficulty));
  }

  while (sentences.length < count) {
    sentences.push(everydaySentence(difficulty + sentences.length));
  }

  return rememberSentences(sentences.slice(0, count));
};

export const generateParagraphs = ({ mode = "everyday", weakKeys = [], weakWords = [], count = 6, aiSession = null } = {}) => {
  const paragraphs = [];
  const recent = new Set(recentTexts());
  let guard = 0;

  while (paragraphs.length < count && guard < count * 10) {
    guard += 1;
    const sentences = mode === "everyday" ? [] : generateSentences({ mode, weakKeys, weakWords, count: mode === "code" ? 5 : 4, aiSession });
    const paragraph = mode === "everyday" ? wordParagraph({ weakKeys, weakWords, aiSession }) : mode === "code" ? sentences.join("\n") : sentences.join(" ");
    if (!recent.has(paragraph) && !paragraphs.includes(paragraph)) paragraphs.push(paragraph);
  }

  while (paragraphs.length < count) {
    paragraphs.push(wordParagraph({ weakKeys, weakWords, aiSession }));
  }

  paragraphs.forEach(remember);
  return paragraphs;
};
