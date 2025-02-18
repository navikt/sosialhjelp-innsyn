import { z, ZodError } from "zod";

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export const publicEnvSchema = z.object({
    NEXT_PUBLIC_RUNTIME_ENVIRONMENT: z.enum(["local", "mock", "dev", "preprod", "prod"]),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const serverEnvSchema = z.object({ NEXT_INNSYN_API_HOSTNAME: z.string() });

export const browserEnv = publicEnvSchema.parse({
    NEXT_PUBLIC_RUNTIME_ENVIRONMENT: process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT,
});

const getRawServerConfig = (): Partial<unknown> =>
    ({
        NEXT_INNSYN_API_HOSTNAME: process.env.NEXT_INNSYN_API_HOSTNAME,
    }) satisfies Record<keyof ServerEnv, string | undefined>;

/**
 * Server envs are lazy loaded and verified using Zod.
 */
export function getServerEnv(): ServerEnv & PublicEnv {
    try {
        return { ...serverEnvSchema.parse(getRawServerConfig()), ...publicEnvSchema.parse(browserEnv) };
    } catch (e) {
        if (e instanceof ZodError) {
            throw new Error(
                `The following envs are missing: ${
                    e.errors
                        .filter((it) => it.message === "Required")
                        .map((it) => it.path.join("."))
                        .join(", ") || "None are missing, but zod is not happy. Look at cause"
                }`,
                { cause: e }
            );
        } else {
            throw e;
        }
    }
}
