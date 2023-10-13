import { Prisma } from '@prisma/client';

const userSeeds: Prisma.UserCreateInput[] = [
    {
        id: 'test-user-1b-victoria-allen',
        orcid: '0001',
        firstName: 'Victoria',
        lastName: 'Allen',
        email: 'test-user-1b@jisc.ac.uk',
        locked: false,
        apiKey: '000000001'
    },
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
        id: 'test-user-2b-rami-salem',
        orcid: '0002',
        firstName: 'Rami',
        lastName: 'Salem',
        email: 'test-user-2b@jisc.ac.uk',
        locked: false,
        apiKey: '000000002'
    },
    {
        id: 'test-user-3-aoi-han',
        orcid: '0003',
        firstName: 'Aoi',
        lastName: 'Han',
        email: 'test-user-3@jisc.ac.uk',
        locked: false,
        apiKey: '000000003'
    },
    {
        id: 'test-user-4-juan-garcia',
        orcid: '0004',
        firstName: 'Juan',
        lastName: 'Garcia',
        email: 'test-user-4@jisc.ac.uk',
        locked: false,
        apiKey: '000000004'
    },
    {
        id: 'test-user-5-amelia-lucas',
        orcid: '0005',
        firstName: 'Amelia',
        lastName: 'Lucas',
        email: 'test-user-5@jisc.ac.uk',
        locked: false,
        apiKey: '000000005'
    },
    {
        id: 'test-user-6-grace-murphy',
        orcid: '0006',
        firstName: 'Grace',
        lastName: 'Murphy',
        email: 'test-user-6@jisc.ac.uk',
        locked: false,
        apiKey: '000000006'
    },
    {
        id: 'test-user-7-oliver-smith',
        orcid: '0007',
        firstName: 'Oliver',
        lastName: 'Smith',
        email: 'test-user-7@jisc.ac.uk',
        locked: false,
        apiKey: '000000007'
    },
    {
        id: 'test-user-8-mia-prakash',
        orcid: '0008',
        firstName: 'Mia',
        lastName: 'Prakash',
        email: 'test-user-8@jisc.ac.uk',
        locked: false,
        apiKey: '000000008'
    },
    {
        id: 'test-user-9-gabriel-dubois',
        orcid: '0009',
        firstName: 'Gabriel',
        lastName: 'Dubois',
        email: 'test-user-9@jisc.ac.uk',
        locked: false,
        apiKey: '000000009'
    },
    {
        id: 'test-user-10-fatima-akter',
        orcid: '0010',
        firstName: 'Fatima',
        lastName: 'Akter',
        email: 'test-user-10@jisc.ac.uk',
        locked: false,
        apiKey: '000000010'
    },
    {
        id: 'test-user-11-althea-de-la-cruz',
        orcid: '0011',
        firstName: 'Althea',
        lastName: 'De la Cruz',
        email: 'test-user-11@jisc.ac.uk',
        locked: false,
        apiKey: '000000011'
    },
    {
        id: 'test-user-12-nathaniel-hernandez',
        orcid: '0012',
        firstName: 'Nathaniel',
        lastName: 'Hernandez',
        email: 'test-user-12@jisc.ac.uk',
        locked: false,
        apiKey: '000000012'
    },
    {
        id: 'test-user-13-liam-tremblay',
        orcid: '0013',
        firstName: 'Liam',
        lastName: 'Tremblay',
        email: 'test-user-13@jisc.ac.uk',
        locked: false,
        apiKey: '000000013'
    },
    {
        id: 'test-user-14-sophia-macdonald',
        orcid: '0014',
        firstName: 'Sophia',
        lastName: 'MacDonald',
        email: 'test-user-14@jisc.ac.uk',
        locked: false,
        apiKey: '000000014'
    },
    {
        id: 'test-user-15-ji-an-choi',
        orcid: '0015',
        firstName: 'Ji-an',
        lastName: 'Choi',
        email: 'test-user-15@jisc.ac.uk',
        locked: false,
        apiKey: '000000015'
    },
    {
        id: 'test-user-16-dmitry-sokolov',
        orcid: '0016',
        firstName: 'Dmitry',
        lastName: 'Sokolov',
        email: 'test-user-16@jisc.ac.uk',
        locked: false,
        apiKey: '000000016'
    },
    {
        id: 'test-user-17-isla-murray',
        orcid: '0017',
        firstName: 'Isla',
        lastName: 'Murray',
        email: 'test-user-17@jisc.ac.uk',
        locked: false,
        apiKey: '000000017'
    },
    {
        id: 'test-user-18-ines-halimi',
        orcid: '0018',
        firstName: 'Ines',
        lastName: 'Halimi',
        email: 'test-user-18@jisc.ac.uk',
        locked: false,
        apiKey: '000000018'
    },
    {
        id: 'test-user-19-youssef-alami',
        orcid: '0019',
        firstName: 'Youssef',
        lastName: 'Alami',
        email: 'test-user-19@jisc.ac.uk',
        locked: false,
        apiKey: '000000019'
    },
    {
        id: 'test-user-20-jackson-fortin',
        orcid: '0020',
        firstName: 'Jackson',
        lastName: 'Fortin',
        email: 'test-user-20@jisc.ac.uk',
        locked: false,
        apiKey: '000000020'
    },
    {
        id: 'test-user-21-patricia-jones',
        orcid: '0021',
        firstName: 'Patricia',
        lastName: 'Jones',
        email: 'test-user-21@jisc.ac.uk',
        locked: false,
        apiKey: '000000021'
    },
    {
        id: 'test-user-22-sofia-gomez',
        orcid: '0022',
        firstName: 'Sofia',
        lastName: 'Gomez',
        email: 'test-user-22@jisc.ac.uk',
        locked: false,
        apiKey: '000000022'
    },
    {
        id: 'test-user-23-valentina-gomez',
        orcid: '0023',
        firstName: 'Valentina',
        lastName: 'Gomez',
        email: 'test-user-23@jisc.ac.uk',
        locked: false,
        apiKey: '000000023'
    },
    {
        id: 'test-user-24-ren-kim',
        orcid: '0024',
        firstName: 'Ren',
        lastName: 'Kim',
        email: 'test-user-24@jisc.ac.uk',
        locked: false,
        apiKey: '000000024'
    },
    {
        id: 'test-user-25-sophie-de-vries',
        orcid: '0025',
        firstName: 'Sophie',
        lastName: 'De Vries',
        email: 'test-user-25@jisc.ac.uk',
        locked: false,
        apiKey: '000000025'
    },
    {
        id: 'test-user-26-co-author-1',
        orcid: '0026',
        firstName: 'Co-Author',
        lastName: 'One',
        locked: false,
        apiKey: '000000026'
    },
    {
        id: 'test-user-27-co-author-2',
        orcid: '0027',
        firstName: 'Co-Author',
        lastName: 'Two',
        locked: false,
        apiKey: '000000027'
    }
];

export default userSeeds;
