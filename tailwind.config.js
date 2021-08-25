module.exports = {
    purge: {
        enabled: true,
        content: [
            './public/**/*.html',
            './src/**/*.vue',
        ],
        options: {
            safelist: [
                /-(leave|enter|appear)(|-(to|from|active))$/,
                /^(?!(|.*?:)cursor-move).+-move$/,
                /^router-link(|-exact)-active$/,
                /.*swiper.*/,
                /.*glightbox.*/,
                /.*place.*/,
            ],
        },
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1140px',
        },
        extend: {
            height: {
                '0.5': '1px',
            },
            colors: {
                primary: "#34CA98",
                accent: "#FCD34D",
                star: "#FFDD36",
                opensea: "#3391E8",
                'background-gray': '#F7F8FA',
                'tag-nft': '#665BE8',
                'tag-tangible': '#3391E8',
                'hero-gray': '#262626',
                'fence-dark': '#262626',
                'fence-gray': '#E6E5E4',
                'fence-light': '#EEEEEE',
                'place-gold': '#FFAE00',
                'place-silver': '#BCBABA',
                'place-bronze': '#DA805C',
                'newsletter': '#333333',
                'grey-9': '#999999',
                'topbar': '#DDDDDD',
                'light-grey': '#8E98A0',
                'black': '#130B27',
            },
            fontFamily: {
                body: ['Inter', "sans-serif"],
                title: ['Roboto', "sans-serif"],
                address: ['Courier', 'serif']
            },
            fontSize: {
                '10px': '10px', // 10px
                '11px': '11px', // 11px
                '2xs': '0.8125rem', // 13px
                '2.5xl': '1.6875rem', // 27px
                '4xl': '2.25rem', // 36px
                'md': '0.9375rem',
            },
            borderRadius: {
                '2sm': '0.25rem', // 4px
                '5sm': '0.625rem', // 10px
            },
            spacing: {
                '1.5': '0.375rem', // 6px
                '2.5': '0.625rem', // 10px
                '12.5': '3.125rem',
                '13': '3.25rem',
                '15': '3.75rem',
                '17': '4.25rem',
                '18': '4.5rem',
                '22': '5.5rem',
                '25': '6.25rem',
                '30': '7.5rem',
                '45': '11.25rem',
                '50': '12.5rem',
                '66': '16.5rem',
                '88': '22rem',
            },
            borderWidth: {
                '3': '3px',
            },
            boxShadow: {
                'lifted-sm': '0 1px 15px 0 #00000026',
                'lifted': '0 2px 36px 0 #0000003d',
                'inset': 'inset 0 0 0 4px #ffffff',
            },
            padding: {
                '2px': '2px',
                '3px': '3px',
                '5px': '5px',
                '1/2': '50%',
                'full': '100%',
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
