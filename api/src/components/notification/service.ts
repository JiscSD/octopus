import * as client from 'lib/client';
import * as I from 'interface';

export const create = (
    userId: string,
    type: I.NotificationTypeEnum,
    actionType: I.NotificationActionTypeEnum,
    payload?: I.NotificationPayload
) =>
    client.prisma.notification.create({
        data: { userId, type, actionType, payload },
        select: { status: true, createdAt: true }
    });

export const getBulletin = (status?: I.NotificationStatusEnum) =>
    client.prisma.notification.findMany({
        where: { type: I.NotificationTypeEnum.BULLETIN, status },
        orderBy: { userId: 'asc' },
        select: { id: true, userId: true, actionType: true, payload: true }
    });

export const update = (id: string, data: Pick<I.Notification, 'status'>) =>
    client.prisma.notification.update({ where: { id }, data });

export const remove = (id: string) => client.prisma.notification.delete({ where: { id } });
