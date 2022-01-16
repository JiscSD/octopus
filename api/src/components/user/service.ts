import prisma from 'lib/client';

export const getByApiKey = async (apiKey: string) => {
    const user = await prisma.user.findFirst({
        where: {
            apiKey
        }
    });
    
    return user;
}