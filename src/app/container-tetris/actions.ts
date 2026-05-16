'use server';

import sql from '@/lib/db';

export type LeaderboardEntry = {
  player_name: string;
  score: number;
  lines_cleared: number;
  level: number;
  created_at: string;
};

export type SubmitResult =
  | { success: true; scores: LeaderboardEntry[] }
  | { success: false; error: string };

export async function submitScore(data: {
  playerName: string;
  score: number;
  linesCleared: number;
  level: number;
}): Promise<SubmitResult> {
  const { playerName, score, linesCleared, level } = data;

  // Validate name
  const trimmedName = playerName.trim();
  if (!trimmedName || trimmedName.length === 0 || trimmedName.length > 20) {
    return { success: false, error: 'Name must be between 1 and 20 characters' };
  }

  // Validate score
  if (typeof score !== 'number' || !Number.isFinite(score) || score <= 0) {
    return { success: false, error: 'Score must be a positive number' };
  }

  try {
    await sql`
      INSERT INTO container_tetris_scores (player_name, score, lines_cleared, level)
      VALUES (${trimmedName}, ${score}, ${linesCleared}, ${level})
    `;

    const rows = await sql`
      SELECT player_name, score, lines_cleared, level, created_at
      FROM container_tetris_scores
      ORDER BY score DESC
      LIMIT 10
    `;

    return { success: true, scores: rows as LeaderboardEntry[] };
  } catch (err) {
    console.error('[submitScore] DB error:', err);
    return { success: false, error: 'Failed to save score. Please try again.' };
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const rows = await sql`
      SELECT player_name, score, lines_cleared, level, created_at
      FROM container_tetris_scores
      ORDER BY score DESC
      LIMIT 10
    `;
    return rows as LeaderboardEntry[];
  } catch (err) {
    console.error('[getLeaderboard] DB error:', err);
    return [];
  }
}
