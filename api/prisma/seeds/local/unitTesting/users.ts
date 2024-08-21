import { Prisma } from '@prisma/client';

const userSeeds: Prisma.UserCreateInput[] = [
    {
        id: 'octopus',
        orcid: 'XXXX-XXXX-XXXX-XXXX',
        firstName: 'Science',
        lastName: 'Octopus',
        email: 'octopus@jisc.ac.uk',
        locked: false,
        apiKey: 'kjahskjhuhaushkjhaskjhjkahsd'
    },
    {
        id: 'test-user-1',
        orcid: '0000-0000-0000-0001',
        firstName: 'Test',
        lastName: 'User 1',
        email: 'test-user-1@jisc.ac.uk',
        locked: false,
        apiKey: '123456789'
    },
    {
        id: 'test-user-2',
        orcid: '0000-0000-0000-0002',
        firstName: 'Test',
        lastName: 'User 2',
        email: 'test-user-2@jisc.ac.uk',
        locked: false,
        apiKey: '987654321'
    },
    {
        id: 'test-user-3',
        orcid: '0000-0000-0000-0003',
        firstName: 'Test',
        lastName: 'User 3',
        email: 'test-user-3@jisc.ac.uk',
        locked: false,
        apiKey: '000000003'
    },
    {
        id: 'test-user-4',
        orcid: '0000-0000-0000-0004',
        firstName: 'Test',
        lastName: 'User 4',
        email: 'test-user-4@jisc.ac.uk',
        locked: false,
        apiKey: '000000004',
        role: 'SUPER_USER'
    },
    {
        id: 'test-user-5',
        orcid: '0000-0000-0000-0005',
        firstName: 'Test',
        lastName: 'CoAuthor 1',
        email: 'test-user-5@jisc.ac.uk',
        locked: false,
        apiKey: '000000005'
    },
    {
        id: 'test-user-6',
        orcid: '0000-0000-0000-0006',
        firstName: 'Test',
        lastName: 'CoAuthor 2',
        email: 'test-user-6@jisc.ac.uk',
        locked: false,
        apiKey: '000000006'
    },
    {
        id: 'test-user-7',
        orcid: '0000-0000-0000-0007',
        firstName: 'Test',
        lastName: 'CoAuthor 3',
        email: 'test-user-7@jisc.ac.uk',
        locked: false,
        apiKey: '000000007'
    },
    {
        id: 'test-user-8',
        orcid: '0000-0000-0000-0008',
        firstName: 'Test',
        lastName: 'CoAuthor 4',
        email: 'test-user-8@jisc.ac.uk',
        locked: false,
        apiKey: '000000008'
    },
    {
        id: 'test-user-9',
        orcid: '0000-0000-0000-0009',
        firstName: 'Test',
        lastName: 'CoAuthor 5',
        email: 'test-user-9@jisc.ac.uk',
        locked: false,
        apiKey: '000000009'
    },
    {
        id: 'test-user-10',
        orcid: '0000-0000-0000-0010',
        firstName: 'Test',
        lastName: 'CoAuthor 6',
        email: 'test-user-10@jisc.ac.uk',
        locked: false,
        apiKey: '000000010'
    },
    {
        id: 'test-user-11',
        orcid: '0000-0000-0000-0011',
        firstName: '',
        lastName: '',
        email: 'test-user-11@jisc.ac.uk',
        locked: false,
        apiKey: '000000011'
    },
    {
        id: 'test-organisational-account-1',
        firstName: 'Test ARI Department (GB)',
        role: 'ORGANISATION',
        apiKey: '000000012'
    },
    {
        id: 'test-organisational-account-2',
        firstName: 'Test organisation 2 (GB)',
        role: 'ORGANISATION',
        apiKey: '000000013'
    }
];

export default userSeeds;
