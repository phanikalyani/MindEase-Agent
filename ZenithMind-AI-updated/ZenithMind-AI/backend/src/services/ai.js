/**
 * Simple heuristic scheduler (no external API) to keep the sample self-contained.
 * You can swap this with LangGraph/Bedrock/OpenAI later.
 */
export function suggestBreaksAndFocusBlocks(dayEvents, { breakFreq = 3, focusBlocks = 50 }) {
  // Very naive algorithm: propose evenly spaced sessions between 10:00 and 18:00
  const suggestions = [];
  const workStart = 10; // 10:00
  const workEnd = 18;   // 18:00

  const totalMinutes = (workEnd - workStart) * 60;
  const interval = Math.floor(totalMinutes / (breakFreq + 1));

  for (let i = 1; i <= breakFreq; i++) {
    const breakStartMin = workStart * 60 + i * interval;
    const breakEndMin = breakStartMin + 10; // 10-min break
    suggestions.push({
      type: 'Break',
      title: 'Mindful Break 🧘',
      start: minutesToTodayISO(breakStartMin),
      end: minutesToTodayISO(breakEndMin),
    });
  }

  // One focus block after lunch (14:00-14:50)
  suggestions.push({
    type: 'Focus',
    title: 'Deep Focus Session ⏱️',
    start: minutesToTodayISO(14 * 60),
    end: minutesToTodayISO(14 * 60 + focusBlocks),
  });

  return suggestions;
}

function minutesToTodayISO(mins) {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setMinutes(mins);
  return d.toISOString();
}
