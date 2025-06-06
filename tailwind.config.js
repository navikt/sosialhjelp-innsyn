/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{jsx,tsx}"],
    theme: {
        extend: {
            borderColor: () => ({
                ["custom-warning-subtle"]: "#FFCB6F",
                ["custom-neutral-subtle"]: "#CFD3D8",
            }),
            backgroundColor: () => ({
                ["custom-warning-soft"]: "#FFF5E4",
                ["custom-warning-moderate"]: "#FFEBC7",
                ["custom-accent-subtle"]: "#F1F7FF",
            }),
            textColor: () => ({
                ["custom-warning-subtle"]: "#A03E00",
                ["custom-accent-subtle"]: "#005BB6",
            }),
        },
    },
    plugins: [],
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    presets: [require("@navikt/ds-tailwind")],
};
