import { z } from 'zod';

/**
 * Counts the packages a package.json would scan, like the API reads it
 *
 * devDependencies count only when included, and a name in both lists counts
 * once, as a dependency. Returns the reason when the text can't be scanned.
 */
export const readPackageJson = (
  text: string,
  includeDev: boolean,
): { dependencies: number; devDependencies: number } | { error: string } => {
  if (!text.trim()) return { error: 'Paste your package.json or upload it' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: 'package.json is not valid JSON' };
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { error: 'package.json must be a JSON object' };
  }

  const { dependencies, devDependencies } = parsed as Record<string, unknown>;
  const prod = namesOf(dependencies);
  const dev = includeDev
    ? namesOf(devDependencies).filter((name) => !prod.includes(name))
    : [];
  if (!prod.length && !dev.length) {
    return { error: 'package.json has no dependencies' };
  }

  return { dependencies: prod.length, devDependencies: dev.length };
};

const namesOf = (list: unknown) =>
  list && typeof list === 'object' ? Object.keys(list) : [];

export const bulkScanSchema = z
  .object({ packageJson: z.string(), includeDev: z.boolean() })
  .superRefine(({ packageJson, includeDev }, ctx) => {
    const result = readPackageJson(packageJson, includeDev);
    if ('error' in result) {
      ctx.addIssue({
        code: 'custom',
        path: ['packageJson'],
        message: result.error,
      });
    }
  });

export type BulkScanValues = z.infer<typeof bulkScanSchema>;
