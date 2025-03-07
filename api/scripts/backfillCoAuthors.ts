import * as client from 'lib/client';

const backfillCoAuthors = async (): Promise<string> => {
    const versions = await client.prisma.publicationVersion.findMany({
        include: {
            coAuthors: true,
            user: true
        }
    });
    const affectedVersions = versions.filter(
        (version) =>
            version.coAuthors.length === 0 ||
            !version.coAuthors.find((coAuthor) => coAuthor.linkedUser === version.user.id)
    );

    if (affectedVersions.length === 0) {
        console.log('No affected versions found');
    }

    for (const version of affectedVersions) {
        console.log(
            `Processing version ${version.id}, ${
                version.publishedDate ? 'Published on ' + new Date(version.publishedDate).toISOString() : 'unpublished'
            }, by ${version.user.firstName} ${version.user.lastName}.`
        );

        // Increment position of any existing coauthors - corresponding author should be in position 1.
        for (const coAuthor of version.coAuthors) {
            console.log('Updating coauthor position', coAuthor.id);
            await client.prisma.coAuthors.update({
                where: {
                    id: coAuthor.id
                },
                data: {
                    position: coAuthor.position + 1
                }
            });
        }

        // Add a coauthor record for the corresponding author.
        await client.prisma.coAuthors.create({
            data: {
                publicationVersion: {
                    connect: {
                        id: version.id
                    }
                },
                user: {
                    connect: {
                        id: version.user.id
                    }
                },
                email: version.user.email ?? '',
                confirmedCoAuthor: true,
                affiliations: [],
                position: 0
            }
        });
    }

    return 'Done';
};

backfillCoAuthors()
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
