import type { Config } from "tailwindcss";
import navikt from "@navikt/ds-tailwind";

const config: Config = {
    presets: [navikt],
    content: ["./src/**/*.{jsx,tsx,js,ts,mdx}"],
    plugins: [],
    theme: {
        extend: {
            borderColor: () => ({
                ["custom-warning-subtle"]: "#FFCB6F",
                ["custom-neutral-subtle"]: "#CFD3D8",
                ["custom-border-accent"]: "#2277D5",
            }),
            backgroundColor: () => ({
                ["custom-warning-soft"]: "#FFF5E4",
                ["custom-warning-moderate"]: "#FFEBC7",
                ["custom-accent-subtle"]: "#F1F7FF",
                ["custom-neutral-soft"]: "#F5F6F7",
                ["custom-warning-moderateA"]: "#FFA400",
                ["custom-accent-moderateA"]: "#005FFF",
            }),
            textColor: () => ({
                ["custom-warning-subtle"]: "#A03E00",
                ["custom-accent-subtle"]: "#005BB6",
                ["custom-accent-strong-hover"]: "#0063C1",
                ["custom-neutral"]: "#202733",
            }),
            textDecorationColor: () => ({
                ["custom-neutral"]: "#202733",
            }),
        },
    },
};

export default config;
