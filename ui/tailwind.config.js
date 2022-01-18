const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        colors: {
            transparent: 'transparent',
            purple: {
                50: '',
                100: '',
                200: '',
                300: ''
            }
        },
        fontFamily: {
            inter: ['Inter', ...defaultTheme.fontFamily.sans],
            montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans]
        },
        extend: {}
    },
    plugins: []
};
