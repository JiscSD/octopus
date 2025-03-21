import 'dotenv/config';
import { convert } from 'html-to-text';
import * as client from '../src/lib/client';

const reindex = async (): Promise<void> => {
    const doesIndexExists = await client.search.indices.exists({
        index: 'publications'
    });

    if (doesIndexExists.body) {
        await client.search.indices.delete({
            index: 'publications'
        });
    }

    const pubs = await client.prisma.publication.findMany({
        where: {
            versions: {
                some: {
                    isLatestLiveVersion: true
                }
            }
        },
        include: {
            versions: {
                where: {
                    isLatestLiveVersion: true
                },
                select: {
                    title: true,
                    description: true,
                    keywords: true,
                    content: true,
                    publishedDate: true,
                    user: {
                        select: {
                            role: true
                        }
                    }
                }
            }
        }
    });

    console.log(`reindexing ${pubs.length}`);

    for (const pub of pubs) {
        const latestLiveVersion = pub.versions[0];

        if (latestLiveVersion) {
            await client.search.create({
                index: 'publications',
                id: pub.id,
                body: {
                    id: pub.id,
                    type: pub.type,
                    title: latestLiveVersion.title,
                    organisationalAuthor: latestLiveVersion.user.role === 'ORGANISATION',
                    description: latestLiveVersion.description,
                    keywords: latestLiveVersion.keywords,
                    content: latestLiveVersion.content,
                    publishedDate: latestLiveVersion.publishedDate,
                    cleanContent: convert(latestLiveVersion.content)
                }
            });
        }
    }
};

reindex()
    .then(() => console.log('Completed reindex'))
    .catch((error) => console.log('Error while reindexing: ', error));
