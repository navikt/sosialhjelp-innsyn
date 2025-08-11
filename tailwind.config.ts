import type { Config } from "tailwindcss";
import naviktDarkside from "@navikt/ds-tailwind/darkside-tw3";
import navikt from "@navikt/ds-tailwind";

const config: Config = {
    presets: [navikt, naviktDarkside],
    content: ["./src/**/*.{jsx,tsx,js,ts,mdx}"],
    plugins: [],
};

export default config;
