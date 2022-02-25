const prefix = `${process.env.NODE_ENV}-octopus`;

const keys = {
    localStorage: {
        darkMode: `${prefix}-dark-mode`,
        token: `${prefix}-token`,
        user: `${prefix}-user`
    }
};

export default keys;
