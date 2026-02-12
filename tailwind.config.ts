import type { Config } from "tailwindcss";
import navikt from "@navikt/ds-tailwind";

const config: Config = {
    presets: [navikt],
    content: ["./src/**/*.{jsx,tsx,js,ts,mdx}"],
    plugins: [],
};

export default config;
