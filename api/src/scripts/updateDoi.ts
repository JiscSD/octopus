import * as client from '../lib/client';
import * as helpers from '../lib/helpers';

const updateDoiNames = async (): Promise<void> => {
    const publications = await client.prisma.publication.findMany({
        where: {
            currentStatus: 'LIVE'
        },
        include: {
            publicationStatus: {
                select: {
                    status: true,
                    createdAt: true,
                    id: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            publicationFlags: {
                select: {
                    id: true,
                    category: true,
                    resolved: true,
                    createdBy: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            orcid: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            },
            user: {
                select: {
                    id: true,
                    orcid: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            funders: {
                select: {
                    id: true,
                    city: true,
                    country: true,
                    name: true,
                    link: true,
                    ror: true
                }
            },
            affiliations: {
                select: {
                    id: true,
                    city: true,
                    country: true,
                    name: true,
                    link: true,
                    ror: true
                }
            },
            References: {
                select: {
                    id: true, 
                    type: true,
                    text: true,
                    location: true,
                    publicationId: true
                }
            },
            coAuthors: {
                select: {
                    id: true,
                    email: true,
                    linkedUser: true,
                    publicationId: true,
                    confirmedCoAuthor: true,
                    approvalRequested: true,
                    createdAt: true,
                    reminderDate: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            orcid: true
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            },
            linkedTo: {
                where: {
                    publicationToRef: {
                        currentStatus: 'LIVE'
                    }
                },
                select: {
                    id: true,
                    publicationToRef: {
                        select: {
                            id: true,
                            title: true,
                            publishedDate: true,
                            currentStatus: true,
                            description: true,
                            keywords: true,
                            type: true,
                            doi: true,
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    orcid: true
                                }
                            }
                        }
                    }
                }
            },
            linkedFrom: {
                where: {
                    publicationFromRef: {
                        currentStatus: 'LIVE'
                    }
                },
                select: {
                    id: true,
                    publicationFromRef: {
                        select: {
                            id: true,
                            title: true,
                            publishedDate: true,
                            currentStatus: true,
                            description: true,
                            keywords: true,
                            type: true,
                            doi: true,
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    orcid: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    let index = 1;

    for (const publication of publications) {
        await helpers.updateDOI(publication.doi, publication, publication.References).catch((err) => console.log(err));
        console.log(`No: ${index}. ${publication.title} doi updated (${publication.doi})`);
        index++;
    }
};

updateDoiNames().catch((err) => console.log(err));
