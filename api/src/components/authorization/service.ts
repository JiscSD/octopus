import JWT from 'jsonwebtoken';

import * as I from 'interface';

const SECRET = process.env.JWT_SECRET as string;

export const createJWT = (user: I.User): string => {
    const jwt = JWT.sign(user, SECRET, { expiresIn: '8h' });
    return jwt;
};

export const validateJWT = (token: string) => {
    try {
        const decodedJWT = JWT.verify(token, SECRET);
        return decodedJWT as I.User;
    } catch (e) {
        console.log(e);
        return null;
    }
};
