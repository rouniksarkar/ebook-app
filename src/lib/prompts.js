export const PROMPTS = {
  // Used once on Create Book page — returns structured JSON
  bookDetails: (ctx) => `You are helping an author set up a new book on a publishing platform.
Based on this instruction: "${ctx.instruction}"

Generate the following and return ONLY valid JSON, no markdown fences, no explanation:
{
  "title": "a compelling book title",
  "subtitle": "a short subtitle that complements the title",
  "description": "a 100-150 word back-cover style description",
  "category": "one of: Fiction, Non-Fiction, Fantasy, Mystery, Romance, Sci-Fi, Biography, Self-Help, Poetry, Horror, Young Adult, Other"
}`,

  // Used on Chapter page — title field
  chapterTitle: (ctx) => `Suggest a chapter title for chapter ${ctx.order} of the book "${ctx.bookTitle}" (category: ${ctx.category}).
Book description: ${ctx.bookDescription || 'N/A'}
Instruction: "${ctx.instruction}"
Return ONLY the chapter title text, nothing else.`,

  // Used on Chapter page — content field
  chapterContent: (ctx) => `You are writing chapter ${ctx.order} of the book "${ctx.bookTitle}" (${ctx.category}).
Book description: ${ctx.bookDescription || 'N/A'}
${ctx.chapterTitle ? `This chapter's title: "${ctx.chapterTitle}"` : ''}
${ctx.previousChapterSummary ? `Previous chapter recap: ${ctx.previousChapterSummary}` : ''}
Instruction: "${ctx.instruction}"

Write the full chapter content now, in prose. No meta-commentary, no headers, just the story/content itself.`,
};