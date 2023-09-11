import htmlToText from 'html-to-text';

import * as client from '../src/lib/client';

const reindex = async () => {
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
                    currentStatus: 'LIVE'
                }
            }
        },
        include: {
            versions: {
                where: {
                    currentStatus: 'LIVE'
                }
            }
        }
    });

    console.log(`reindexing ${pubs.length}`);

    for (const pub of pubs) {
        const latestLiveVersion = pub.versions.find((version) => {
            // Either current version is LIVE, or it is not, in which case the previous version must be LIVE.
            // Publications with only one version that is not LIVE won't be returned by the query above.
            return version.isCurrent || version.versionNumber === (pub.versions.length - 1)
        });
        if (latestLiveVersion) {
            await client.search.create({
                index: 'publications',
                id: pub.id,
                body: {
                    id: pub.id,
                    type: pub.type,
                    title: latestLiveVersion.title,
                    licence: latestLiveVersion.licence,
                    description: latestLiveVersion.description,
                    keywords: latestLiveVersion.keywords,
                    content: latestLiveVersion.content,
                    language: 'en',
                    currentStatus: latestLiveVersion.currentStatus,
                    publishedDate: latestLiveVersion.publishedDate,
                    cleanContent: htmlToText.convert(latestLiveVersion.content)
                }
            });
        }
    }
};

reindex();
