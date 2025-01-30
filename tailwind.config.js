/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    presets: [require("@navikt/ds-tailwind")],
};
