import { z, ZodError } from "zod";

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export const publicEnvSchema = z.object({
    NEXT_PUBLIC_RUNTIME_ENVIRONMENT: z.enum(["local", "mock", "dev", "preprod", "prod", "e2e"]),
    NEXT_PUBLIC_INNSYN_ORIGIN: z.string(),
    NEXT_PUBLIC_BASE_PATH: z.string(),
    NEXT_PUBLIC_DEKORATOR_API_BASE_URL: z.string().optional(),
    // TODO: Optional fram til tusd er på plass i alle miljøer
    NEXT_PUBLIC_TUSD_URL: z.string().optional(),
    NEXT_PUBLIC_UPLOAD_API_BASE: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const serverEnvSchema = z.object({
    NEXT_INNSYN_API_HOSTNAME: z.string(),
    SOKNAD_API_HOSTNAME: z.string(),
    SOKNAD_API_AUDIENCE: z.string(),
    INNSYN_API_PORT: z.string().optional(),
    SOKNAD_API_PORT: z.string().optional(),
    NEXT_INNSYN_API_BASE_URL: z.string().optional().default(""),
});

export const browserEnv = publicEnvSchema.parse({
    NEXT_PUBLIC_RUNTIME_ENVIRONMENT: process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT,
    NEXT_PUBLIC_INNSYN_ORIGIN: process.env.NEXT_PUBLIC_INNSYN_ORIGIN,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
    NEXT_PUBLIC_DEKORATOR_API_BASE_URL: process.env.NEXT_PUBLIC_DEKORATOR_API_BASE_URL,
    NEXT_PUBLIC_TUSD_URL: process.env.NEXT_PUBLIC_TUSD_URL,
    NEXT_PUBLIC_UPLOAD_API_BASE: process.env.NEXT_PUBLIC_UPLOAD_API_BASE,
});

const getRawServerConfig = (): Partial<unknown> =>
    ({
        NEXT_INNSYN_API_HOSTNAME: process.env.NEXT_INNSYN_API_HOSTNAME,
        SOKNAD_API_HOSTNAME: process.env.SOKNAD_API_HOSTNAME,
        SOKNAD_API_AUDIENCE: process.env.SOKNAD_API_AUDIENCE,
        NEXT_INNSYN_API_BASE_URL: process.env.NEXT_INNSYN_API_BASE_URL,
        INNSYN_API_PORT: process.env.INNSYN_API_PORT,
        SOKNAD_API_PORT: process.env.SOKNAD_API_PORT,
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
                    e.issues
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
