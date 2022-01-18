const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        colors: {
            transparent: 'transparent',
            grey: {
                300: '#E2E7EB',
                400: '#BAC4CD',
                500: '#8A95A5',
                600: '#616B79',
                700: '#232933'
            },
            purple: {
                300: '#E8E6FA',
                400: '#A099E2',
                500: '#8E81E3',
                600: '#766EE1',
                700: '#645AE1'
            },
            pink: {
                300: '#f4cfe0',
                700: '#cd0f69'
            },
            peach: {
                500: '#edbab2'
            },
            blue: {
                500: '#006699'
            },
            white: {
                500: '#ffffff',
                600: '#f7f7f7'
            },
            black: {
                400: '#333333',
                500: '#000000'
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
