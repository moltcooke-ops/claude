import Firecrawl from '@mendable/firecrawl-js';
import { z } from 'zod';

const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.error('Error: FIRECRAWL_API_KEY environment variable is required.');
  console.error('Get your free API key at https://firecrawl.dev/app/api-keys');
  console.error('Then run: FIRECRAWL_API_KEY=your-key npm start');
  process.exit(1);
}

const firecrawl = new Firecrawl({ apiKey });

const result = await firecrawl.agent({
  prompt:
    'Extract the skater GAR (Goals Above Replacement) statistics for the Vancouver Canucks (VAN) from the 2025-2026 regular season, including basic stats and full TOI metrics as displayed in the table.',
  schema: z
    .object({
      evolving_hockey_skater_gar_stats: z
        .array(
          z.object({
            player_name: z.string().describe("Player's name"),
            player_name_citation: z
              .string()
              .describe('Source URL for player_name')
              .optional(),
            goals_above_replacement: z
              .number()
              .describe('Goals Above Replacement (GAR)'),
            goals_above_replacement_citation: z
              .string()
              .describe('Source URL for goals_above_replacement')
              .optional(),
            basic_stats: z
              .object({
                games_played: z.number().describe('Games Played').optional(),
                games_played_citation: z
                  .string()
                  .describe('Source URL for games_played')
                  .optional(),
                goals: z.number().describe('Goals').optional(),
                goals_citation: z
                  .string()
                  .describe('Source URL for goals')
                  .optional(),
                assists: z.number().describe('Assists').optional(),
                assists_citation: z
                  .string()
                  .describe('Source URL for assists')
                  .optional(),
                points: z.number().describe('Points').optional(),
                points_citation: z
                  .string()
                  .describe('Source URL for points')
                  .optional(),
                plus_minus: z.number().describe('Plus/Minus').optional(),
                plus_minus_citation: z
                  .string()
                  .describe('Source URL for plus_minus')
                  .optional(),
                penalty_minutes: z
                  .number()
                  .describe('Penalty Minutes')
                  .optional(),
                penalty_minutes_citation: z
                  .string()
                  .describe('Source URL for penalty_minutes')
                  .optional(),
              })
              .describe('Basic skater statistics'),
            toi_metrics: z
              .object({
                time_on_ice_total: z
                  .string()
                  .describe('Total Time on Ice')
                  .optional(),
                time_on_ice_total_citation: z
                  .string()
                  .describe('Source URL for time_on_ice_total')
                  .optional(),
                time_on_ice_pp: z
                  .string()
                  .describe('Power Play Time on Ice')
                  .optional(),
                time_on_ice_pp_citation: z
                  .string()
                  .describe('Source URL for time_on_ice_pp')
                  .optional(),
                time_on_ice_sh: z
                  .string()
                  .describe('Shorthanded Time on Ice')
                  .optional(),
                time_on_ice_sh_citation: z
                  .string()
                  .describe('Source URL for time_on_ice_sh')
                  .optional(),
              })
              .describe('Time on Ice (TOI) metrics'),
          })
        )
        .describe('Skater GAR statistics from evolving-hockey.com'),
    })
    .describe(
      'GAR statistics for Vancouver Canucks (VAN) from the 2025-2026 regular season'
    ),
  urls: ['https://www.evolving-hockey.com'],
  model: 'spark-1-mini',
});

console.log(JSON.stringify(result, null, 2));
