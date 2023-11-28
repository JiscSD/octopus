import * as Interfaces from '@/interfaces';

export const Publications: Interfaces.DocumentationEntry[] = [
    {
        method: 'GET',
        endpoint: '/publications',
        id: 'get-publications',
        description:
            'This endpoint allows paginated access to all publications that are currently LIVE. This endpoint is public.',
        exampleUse: `try {
    const publications = await axios.get('/publications', {
        search: 'COVID',
        offest: 0,
        limit: 10,
        type: 'PROBLEM,HYPOTHSIS',
        orderBy: 'updatedAt,
        orderDirection: 'asc'
    });
    console.log(publications.data);
} catch(err) {
    console.log(err.body.message);
}`,
        exampleResponse: {
            data: [
                {
                    id: 'publication-user-3-peer-review-1-live',
                    url_slug: 'ckz8fe8m41916876sa5r3i9803',
                    type: 'PEER_REVIEW',
                    title: 'Peer Review of Conclusions from the...',
                    content: 'Not a very in depth conclusion...',
                    doi: null,
                    currentStatus: 'LIVE',
                    createdBy: 'test-user-3-aoi-han',
                    createdAt: '2022-02-04T13:10:51.676Z',
                    updatedAt: '2022-02-04T13:10:51.677Z',
                    user: {
                        firstName: 'A',
                        lastName: 'Han',
                        id: 'test-user-3-aoi-han'
                    }
                },
                {
                    id: 'publication-user-2-real-world-application-1-live',
                    url_slug: 'ckz8fe8lr1913676sagyb15rif',
                    type: 'REAL_WORLD_APPLICATION',
                    title: 'Conclusions from the data on ...',
                    content: 'The potential benefits or ...',
                    doi: null,
                    currentStatus: 'LIVE',
                    createdBy: 'test-user-2b-rami-salem',
                    createdAt: '2022-02-04T13:10:51.663Z',
                    updatedAt: '2022-02-04T13:10:51.664Z',
                    user: {
                        firstName: 'R',
                        lastName: 'Salem',
                        id: 'test-user-2b-rami-salem'
                    }
                }
            ],
            metadata: {
                total: 2,
                limit: 10,
                offset: 0
            }
        },
        queryParameters: [
            {
                name: 'limit',
                optional: true,
                description: 'A positive integer that represents the maximum number of publications to be returned.'
            },
            {
                name: 'offset',
                optional: true,
                description:
                    'Either 0 or a positivie integer. Whatever the value of offset is, is how many publications will be skipped.'
            },
            {
                name: 'search',
                optional: true,
                description: 'A search term that is used to find relevant publications.'
            },
            {
                name: 'orderBy',
                optional: true,
                enums: ['id', 'createdAt', 'updatedAt', 'title'],
                description: 'lorem ipsum'
            },
            {
                name: 'orderDirection',
                optional: true,
                enums: ['asc', 'desc'],
                description: 'lorem ipsum'
            },
            {
                name: 'type',
                optional: true,
                enums: [
                    'PROBLEM',
                    'PROTOCOL',
                    'ANALYSIS',
                    'REAL_WORLD_APPLICATION',
                    'HYPOTHESIS',
                    'DATA',
                    'INTERPRETATION',
                    'PEER_REVIEW'
                ],
                description: ''
            }
        ]
    }
];
