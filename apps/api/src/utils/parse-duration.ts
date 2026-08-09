const DURATION_PATTERN = /^(\d+)([smhd])$/;

const UNIT_TO_MS = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
} as const;

export function parseDurationToDate(duration: string, from = new Date()): Date {
  const match = DURATION_PATTERN.exec(duration);

  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const amount = Number(match[1]);
  const unit = match[2] as keyof typeof UNIT_TO_MS;

  return new Date(from.getTime() + amount * UNIT_TO_MS[unit]);
}
