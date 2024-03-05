/** @type {import('tailwindcss').Config} */
module.exports = {
    important: "#extension-root",
    content: [
        "./content-script/**/*.{js,ts,jsx,tsx}",
        "./popup/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        container: {
            padding: "2rem"
        },
        extend: {
            colors: {
                darkBorder: "#040404",
                background: "#0e0e10",
                typography: "#efeff1",
                menu: "#18181b",
                lightBackground: "#2f2f35",
                violet: "#772ce8",
                violetDarker: "#3a2b66"
            },
            zIndex: {
                clickAwayListener: "999999",
                clickAwayElement: `${999999 + 1}`
            },
            fontSize: {
                xxs: "0.65rem"
            }
        }
    }
}
