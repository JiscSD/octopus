import * as I from 'interface';
const referencesSeeds: I.Reference[] = [
    {
        id: '01',
        location: 'http://google.com',
        publicationId: 'publication-interpretation-draft',
        text: '<p>Reference 1</p>',
        type: 'TEXT'
    },
    {
        id: '02',
        location: 'http://google.com',
        publicationId: 'publication-interpretation-draft',
        text: '<p>wvhjdvbwhjebded <a href="https://google.com" target="_blank" rel="noreferrer noopener">https://google.com</a></p>',
        type: 'URL'
    },
    {
        id: '03',
        location: 'http://google.com',
        publicationId: 'publication-real-world-application-live',
        text: '<p>wvhjdvbwhjebded <a href="https://google.com" target="_blank" rel="noreferrer noopener">https://google.com</a></p>',
        type: 'URL'
    }
];

export default referencesSeeds;
