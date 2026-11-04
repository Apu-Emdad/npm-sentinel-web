import { z } from 'zod';

/**
 * `name` or `name@version`, with an exact version like the API wants
 *
 * Scoped names like `@scope/name@1.0.0` work too.
 */
const PACKAGE_PATTERN =
  /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*(?:@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)?$/;

export const scanSchema = z.object({
  target: z
    .string()
    .trim()
    .min(1, 'Package name is required')
    .max(256, 'Package name must be at most 256 characters')
    .regex(
      PACKAGE_PATTERN,
      'Enter a package like lodash, or lodash@4.17.21 for an exact version',
    ),
});

export type ScanValues = z.infer<typeof scanSchema>;
