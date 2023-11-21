import * as client from 'lib/client';
import * as I from 'lib/interface';

export const getByTypes = async (types: I.EventType[]) =>
    client.prisma.event.findMany({
        where: {
            type: {
                in: types
            }
        }
    });

export const deleteEvent = async (id: string) =>
    client.prisma.event.delete({
        where: { id }
    });
