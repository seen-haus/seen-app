module.exports = {
    purge: {
        content: [
            './public/**/*.html',
            './src/**/*.vue',
        ],
        whitelistPatterns: [
            /-(leave|enter|appear)(|-(to|from|active))$/,
            /^(?!(|.*?:)cursor-move).+-move$/,
            /^router-link(|-exact)-active$/
        ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        extend: {
            colors: {
                primary:"#34ca98",
                accent: "#FCD34D"
            },
            fontFamily: {
                body:['Inter', "sans-serif"],
                title: ['Playfair Display', "serif"],
            },
            spacing: {
                '13': '3.25rem',
                '15': '3.75rem',
                '17': '4.25rem',
                '18': '4.5rem',
                '22': '5.5rem',
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
