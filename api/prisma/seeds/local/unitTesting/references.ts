import * as I from 'interface';
const referencesSeeds: I.Reference[] = [
    {
        id: '01',
        location: 'http://google.com',
        publicationVersionId: 'publication-interpretation-draft-v1',
        text: '<p>Reference 1</p>',
        type: 'TEXT'
    },
    {
        id: '02',
        location: 'http://google.com',
        publicationVersionId: 'publication-interpretation-draft-v1',
        text: '<p>wvhjdvbwhjebded <a href="https://google.com" target="_blank" rel="noreferrer noopener">https://google.com</a></p>',
        type: 'URL'
    },
    {
        id: '03',
        location: 'http://google.com',
        publicationVersionId: 'publication-real-world-application-live-v1',
        text: '<p>wvhjdvbwhjebded <a href="https://google.com" target="_blank" rel="noreferrer noopener">https://google.com</a></p>',
        type: 'URL'
    }
];

export default referencesSeeds;
