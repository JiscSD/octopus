import { Prisma } from '@prisma/client';
import * as client from 'lib/client';
import * as I from 'lib/interface';

export const getByTypes = async (types: I.EventType[], additionalFilters: Omit<Prisma.EventWhereInput, 'type'> = {}) =>
    client.prisma.event.findMany({
        where: {
            type: {
                in: types
            },
            ...additionalFilters
        }
    });

export const deleteEvent = async (id: string) =>
    client.prisma.event.delete({
        where: { id }
    });

export const create = <T extends I.EventType>(type: T, data: I.EventDataType[T]) =>
    client.prisma.event.create({
        data: {
            type,
            data: data as unknown as Prisma.InputJsonValue
        }
    });

export const get = (id: string) =>
    client.prisma.event.findUnique({
        where: {
            id
        }
    });

export const deleteMany = (where: Prisma.EventWhereInput) =>
    client.prisma.event.deleteMany({
        where
    });
