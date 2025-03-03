const prefix = `${process.env.NODE_ENV}-octopus`;

const keys = {
    localStorage: {
        preferences: `${prefix}-preferences`,
        token: `${prefix}-token`,
        user: `${prefix}-user`
    },
    cookieStorage: {
        token: `${prefix}-token`
    }
};

export default keys;
