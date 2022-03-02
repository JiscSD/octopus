import JWT from 'jsonwebtoken';

import * as I from 'interface';

const SECRET = 'TODO_CHANGE_THIS_SECRET';

export const createJWT = (user: I.User): string => {
    const jwt = JWT.sign(user, SECRET, { expiresIn: '8h' });
    return jwt;
};

export const validateJWT = (token: string) => {
    const decodedJWT = JWT.verify(token, SECRET);
    return decodedJWT as I.User;
};
