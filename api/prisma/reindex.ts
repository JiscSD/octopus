import htmlToText from 'html-to-text';

import * as client from '../src/lib/client';




const reindex  = async () => {

    const doesIndexExists = await client.search.indices.exists({
        index: 'publications'
    });

    if (doesIndexExists.body) {
        await client.search.indices.delete({
            index: 'publications'
        });
    }

const pubs=await client.prisma.publication.findMany(
    {
        where: {
            currentStatus: 'LIVE'
        }
    }
);

console.log(`reindexing ${pubs.length}`);

for (const pub of pubs) {
        await client.search.create({
            index: 'publications',
            id: pub.id,
            body: {
                id: pub.id,
                type: pub.type,
                title: pub.title,
                licence: pub.licence,
                description: pub.description,
                keywords: pub.keywords,
                content: pub.content,
                language: 'en',
                currentStatus: pub.currentStatus,
                publishedDate: pub.publishedDate,
                cleanContent: htmlToText.convert(pub.content)
            }
        });
    }
}



reindex();
