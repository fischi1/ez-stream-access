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
        colors: {
            background: "#0e0e10"
        },
        extend: {
            colors: {
                typography: "#efeff1",
                lightBackground: "#2f2f35"
            }
        }
    }
}
