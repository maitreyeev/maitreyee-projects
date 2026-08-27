// Rotates through a round's full question bank based on attempt number, so a
// retry surfaces a fresh set instead of repeating the same 3 questions.
export function pickQuestions(
  questions: string[],
  attempt: number,
  count = 3
): string[] {
  if (questions.length <= count) return questions;
  const offset = ((attempt - 1) * count) % questions.length;
  const picked: string[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(questions[(offset + i) % questions.length]);
  }
  return picked;
}
