import { z, ZodError } from "zod";

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export const publicEnvSchema = z.object({
    NEXT_PUBLIC_RUNTIME_ENVIRONMENT: z.enum(["local", "mock", "dev", "preprod", "prod"]),
    NEXT_PUBLIC_INNSYN_ORIGIN: z.string(),
    NEXT_PUBLIC_BASE_PATH: z.string(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const serverEnvSchema = z.object({
    NEXT_INNSYN_API_HOSTNAME: z.string(),
    NEXT_INNSYN_API_BASE_URL: z.string(),
});

export const browserEnv = publicEnvSchema.parse({
    NEXT_PUBLIC_RUNTIME_ENVIRONMENT: process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT,
    NEXT_PUBLIC_INNSYN_ORIGIN: process.env.NEXT_PUBLIC_INNSYN_ORIGIN,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
});

const getRawServerConfig = (): Partial<unknown> =>
    ({
        NEXT_INNSYN_API_HOSTNAME: process.env.NEXT_INNSYN_API_HOSTNAME,
        NEXT_INNSYN_API_BASE_URL: process.env.NEXT_INNSYN_API_BASE_URL,
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
