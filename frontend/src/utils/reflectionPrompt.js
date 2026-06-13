import { getYesterdayCheckIn } from './storage';

export function getReflectionPrompt() {
  const yesterday = getYesterdayCheckIn();

  if (!yesterday) {
    return 'What affected your day the most?';
  }

  if (yesterday.stress >= 7) {
    return "Did today feel different from yesterday's stress?";
  }

  if (yesterday.mood <= 4) {
    return 'What was one small thing that helped or hurt your mood today?';
  }

  if (yesterday.energy <= 4 && yesterday.studyHours === '8+') {
    return 'You pushed hard yesterday—how did your energy feel today?';
  }

  return 'What affected your day the most?';
}
