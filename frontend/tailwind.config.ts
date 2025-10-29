import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                "primary-hover": "var(--color-primary-hover)",
                dark: "var(--color-dark)",
                "dark-hover": "var(--color-dark-hover)",
                gray: "var(--color-gray)",
                border: "var(--color-border)",
                "bg-light": "var(--color-bg-light)",
                "bg-card": "var(--color-bg-card)",
                disabled: "var(--color-disabled)",
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
