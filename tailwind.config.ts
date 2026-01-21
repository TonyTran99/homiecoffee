import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#00735C",
                // User requested exactly #00735C for background.
            },
            fontFamily: {
                serif: ["var(--font-playfair)"],
                sans: ["var(--font-inter)"],
            },
        },
    },
    plugins: [],
};
export default config;
