import * as Interfaces from '@/interfaces';
import * as Types from '@/types';

export const publicationTypes: Types.PublicationType[] = [
    'PROBLEM',
    'HYPOTHESIS',
    'PROTOCOL',
    'DATA',
    'ANALYSIS',
    'INTERPRETATION',
    'REAL_WORLD_APPLICATION',
    'PEER_REVIEW'
];

export const authorTypes = ['individual', 'organisational'];

export const octopusInformation: Interfaces.OctopusInformation = {
    publications: {
        PROBLEM: {
            id: 'PROBLEM',
            heading: 'Research Problem',
            content: 'A neatly defined scientific problem.'
        },
        HYPOTHESIS: {
            id: 'HYPOTHESIS',
            heading: 'Rationale/Hypothesis',
            content:
                'An original hypothesis relating to an existing published Research Problem or the rationale for how you think the Research Problem could be addressed.'
        },
        PROTOCOL: {
            id: 'PROTOCOL',
            heading: 'Method',
            content: 'A practical method of testing an existing published Rationale/Hypothesis.'
        },
        DATA: {
            id: 'DATA',
            heading: 'Results',
            content:
                'Raw data or summarised results collected according to an existing published Method (can be linked to a data repository).'
        },
        ANALYSIS: {
            id: 'ANALYSIS',
            heading: 'Analysis',
            content: 'A statistical or thematic analysis of existing published Results.'
        },
        INTERPRETATION: {
            id: 'INTERPRETATION',
            heading: 'Interpretation',
            content: 'A discussion around an existing published Analysis.'
        },
        REAL_WORLD_APPLICATION: {
            id: 'REAL_WORLD_APPLICATION',
            heading: 'Real World Application',
            content: 'Real World Applications arising from an existing published Interpretation.'
        },
        PEER_REVIEW: {
            id: 'PEER_REVIEW',
            heading: 'Review',
            content:
                'A considered, detailed peer review of one of the other kinds of publication. Octopus reviews are open and post-publication.'
        }
    },
    licences: {
        CC_BY: {
            value: 'CC_BY',
            nicename: 'CC BY 4.0',
            fullName: 'Attribution 4.0 International (CC BY 4.0)',
            description:
                'This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.',
            link: 'https://creativecommons.org/licenses/by/4.0/'
        },
        CC_BY_SA: {
            value: 'CC_BY_SA',
            nicename: 'CC BY-SA 4.0',
            fullName: 'Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
            description:
                'This license lets others remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software licenses. All new works based on yours will carry the same license, so any derivatives will also allow commercial use. This is the license used by Wikipedia, and is recommended for materials that would benefit from incorporating content from Wikipedia and similarly licensed projects.',
            link: 'https://creativecommons.org/licenses/by-sa/4.0'
        },
        CC_BY_NC: {
            value: 'CC_BY_NC',
            nicename: 'CC BY-NC 4.0',
            fullName: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            description:
                'This license lets others remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.',
            link: 'https://creativecommons.org/licenses/by-nc/4.0'
        },
        CC_BY_NC_SA: {
            value: 'CC_BY_NC_SA',
            nicename: 'CC BY-NC-SA 4.0',
            fullName: 'Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)',
            description:
                'This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.',
            link: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
        }
    },
    languages: [
        {
            code: 'aa',
            name: 'Afar'
        },
        {
            code: 'ab',
            name: 'Abkhazian'
        },
        {
            code: 'ae',
            name: 'Avestan'
        },
        {
            code: 'af',
            name: 'Afrikaans'
        },
        {
            code: 'ak',
            name: 'Akan'
        },
        {
            code: 'am',
            name: 'Amharic'
        },
        {
            code: 'an',
            name: 'Aragonese'
        },
        {
            code: 'ar',
            name: 'Arabic'
        },
        {
            code: 'as',
            name: 'Assamese'
        },
        {
            code: 'av',
            name: 'Avaric'
        },
        {
            code: 'ay',
            name: 'Aymara'
        },
        {
            code: 'az',
            name: 'Azerbaijani'
        },
        {
            code: 'ba',
            name: 'Bashkir'
        },
        {
            code: 'be',
            name: 'Belarusian'
        },
        {
            code: 'bg',
            name: 'Bulgarian'
        },
        {
            code: 'bh', // TODO: remove this from the list
            name: 'Bihari languages'
        },
        {
            code: 'bi',
            name: 'Bislama'
        },
        {
            code: 'bm',
            name: 'Bambara'
        },
        {
            code: 'bn',
            name: 'Bengali'
        },
        {
            code: 'bo',
            name: 'Tibetan'
        },
        {
            code: 'br',
            name: 'Breton'
        },
        {
            code: 'bs',
            name: 'Bosnian'
        },
        {
            code: 'ca',
            name: 'Catalan; Valencian'
        },
        {
            code: 'ce',
            name: 'Chechen'
        },
        {
            code: 'ch',
            name: 'Chamorro'
        },
        {
            code: 'co',
            name: 'Corsican'
        },
        {
            code: 'cr',
            name: 'Cree'
        },
        {
            code: 'cs',
            name: 'Czech'
        },
        {
            code: 'cu',
            name: 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic'
        },
        {
            code: 'cv',
            name: 'Chuvash'
        },
        {
            code: 'cy',
            name: 'Welsh'
        },
        {
            code: 'da',
            name: 'Danish'
        },
        {
            code: 'de',
            name: 'German'
        },
        {
            code: 'dv',
            name: 'Divehi; Dhivehi; Maldivian'
        },
        {
            code: 'dz',
            name: 'Dzongkha'
        },
        {
            code: 'ee',
            name: 'Ewe'
        },
        {
            code: 'el',
            name: 'Greek, Modern (1453-)'
        },
        {
            code: 'en',
            name: 'English'
        },
        {
            code: 'eo',
            name: 'Esperanto'
        },
        {
            code: 'es',
            name: 'Spanish; Castilian'
        },
        {
            code: 'et',
            name: 'Estonian'
        },
        {
            code: 'eu',
            name: 'Basque'
        },
        {
            code: 'fa',
            name: 'Persian'
        },
        {
            code: 'ff',
            name: 'Fulah'
        },
        {
            code: 'fi',
            name: 'Finnish'
        },
        {
            code: 'fj',
            name: 'Fijian'
        },
        {
            code: 'fo',
            name: 'Faroese'
        },
        {
            code: 'fr',
            name: 'French'
        },
        {
            code: 'fy',
            name: 'Western Frisian'
        },
        {
            code: 'ga',
            name: 'Irish'
        },
        {
            code: 'gd',
            name: 'Gaelic; Scomttish Gaelic'
        },
        {
            code: 'gl',
            name: 'Galician'
        },
        {
            code: 'gn',
            name: 'Guarani'
        },
        {
            code: 'gu',
            name: 'Gujarati'
        },
        {
            code: 'gv',
            name: 'Manx'
        },
        {
            code: 'ha',
            name: 'Hausa'
        },
        {
            code: 'he',
            name: 'Hebrew'
        },
        {
            code: 'hi',
            name: 'Hindi'
        },
        {
            code: 'ho',
            name: 'Hiri Motu'
        },
        {
            code: 'hr',
            name: 'Croatian'
        },
        {
            code: 'ht',
            name: 'Haitian; Haitian Creole'
        },
        {
            code: 'hu',
            name: 'Hungarian'
        },
        {
            code: 'hy',
            name: 'Armenian'
        },
        {
            code: 'hz',
            name: 'Herero'
        },
        {
            code: 'ia',
            name: 'Interlingua (International Auxiliary Language Association)'
        },
        {
            code: 'id',
            name: 'Indonesian'
        },
        {
            code: 'ie',
            name: 'Interlingue; Occidental'
        },
        {
            code: 'ig',
            name: 'Igbo'
        },
        {
            code: 'ii',
            name: 'Sichuan Yi; Nuosu'
        },
        {
            code: 'ik',
            name: 'Inupiaq'
        },
        {
            code: 'io',
            name: 'Ido'
        },
        {
            code: 'is',
            name: 'Icelandic'
        },
        {
            code: 'it',
            name: 'Italian'
        },
        {
            code: 'iu',
            name: 'Inuktitut'
        },
        {
            code: 'ja',
            name: 'Japanese'
        },
        {
            code: 'jv',
            name: 'Javanese'
        },
        {
            code: 'ka',
            name: 'Georgian'
        },
        {
            code: 'kg',
            name: 'Kongo'
        },
        {
            code: 'ki',
            name: 'Kikuyu; Gikuyu'
        },
        {
            code: 'kj',
            name: 'Kuanyama; Kwanyama'
        },
        {
            code: 'kk',
            name: 'Kazakh'
        },
        {
            code: 'kl',
            name: 'Kalaallisut; Greenlandic'
        },
        {
            code: 'km',
            name: 'Central Khmer'
        },
        {
            code: 'kn',
            name: 'Kannada'
        },
        {
            code: 'ko',
            name: 'Korean'
        },
        {
            code: 'kr',
            name: 'Kanuri'
        },
        {
            code: 'ks',
            name: 'Kashmiri'
        },
        {
            code: 'ku',
            name: 'Kurdish'
        },
        {
            code: 'kv',
            name: 'Komi'
        },
        {
            code: 'kw',
            name: 'Cornish'
        },
        {
            code: 'ky',
            name: 'Kirghiz; Kyrgyz'
        },
        {
            code: 'la',
            name: 'Latin'
        },
        {
            code: 'lb',
            name: 'Luxembourgish; Letzeburgesch'
        },
        {
            code: 'lg',
            name: 'Ganda'
        },
        {
            code: 'li',
            name: 'Limburgan; Limburger; Limburgish'
        },
        {
            code: 'ln',
            name: 'Lingala'
        },
        {
            code: 'lo',
            name: 'Lao'
        },
        {
            code: 'lt',
            name: 'Lithuanian'
        },
        {
            code: 'lu',
            name: 'Luba-Katanga'
        },
        {
            code: 'lv',
            name: 'Latvian'
        },
        {
            code: 'mg',
            name: 'Malagasy'
        },
        {
            code: 'mh',
            name: 'Marshallese'
        },
        {
            code: 'mi',
            name: 'Maori'
        },
        {
            code: 'mk',
            name: 'Macedonian'
        },
        {
            code: 'ml',
            name: 'Malayalam'
        },
        {
            code: 'mn',
            name: 'Mongolian'
        },
        {
            code: 'mr',
            name: 'Marathi'
        },
        {
            code: 'ms',
            name: 'Malay'
        },
        {
            code: 'mt',
            name: 'Maltese'
        },
        {
            code: 'my',
            name: 'Burmese'
        },
        {
            code: 'na',
            name: 'Nauru'
        },
        {
            code: 'nb',
            name: 'Bokmål, Norwegian; Norwegian Bokmål'
        },
        {
            code: 'nd',
            name: 'Ndebele, North; North Ndebele'
        },
        {
            code: 'ne',
            name: 'Nepali'
        },
        {
            code: 'ng',
            name: 'Ndonga'
        },
        {
            code: 'nl',
            name: 'Dutch; Flemish'
        },
        {
            code: 'nn',
            name: 'Norwegian Nynorsk; Nynorsk, Norwegian'
        },
        {
            code: 'no',
            name: 'Norwegian'
        },
        {
            code: 'nr',
            name: 'Ndebele, South; South Ndebele'
        },
        {
            code: 'nv',
            name: 'Navajo; Navaho'
        },
        {
            code: 'ny',
            name: 'Chichewa; Chewa; Nyanja'
        },
        {
            code: 'oc',
            name: 'Occitan (post 1500)'
        },
        {
            code: 'oj',
            name: 'Ojibwa'
        },
        {
            code: 'om',
            name: 'Oromo'
        },
        {
            code: 'or',
            name: 'Oriya'
        },
        {
            code: 'os',
            name: 'Ossetian; Ossetic'
        },
        {
            code: 'pa',
            name: 'Panjabi; Punjabi'
        },
        {
            code: 'pi',
            name: 'Pali'
        },
        {
            code: 'pl',
            name: 'Polish'
        },
        {
            code: 'ps',
            name: 'Pushto; Pashto'
        },
        {
            code: 'pt',
            name: 'Portuguese'
        },
        {
            code: 'qu',
            name: 'Quechua'
        },
        {
            code: 'rm',
            name: 'Romansh'
        },
        {
            code: 'rn',
            name: 'Rundi'
        },
        {
            code: 'ro',
            name: 'Romanian; Moldavian; Moldovan'
        },
        {
            code: 'ru',
            name: 'Russian'
        },
        {
            code: 'rw',
            name: 'Kinyarwanda'
        },
        {
            code: 'sa',
            name: 'Sanskrit'
        },
        {
            code: 'sc',
            name: 'Sardinian'
        },
        {
            code: 'sd',
            name: 'Sindhi'
        },
        {
            code: 'se',
            name: 'Northern Sami'
        },
        {
            code: 'sg',
            name: 'Sango'
        },
        {
            code: 'si',
            name: 'Sinhala; Sinhalese'
        },
        {
            code: 'sk',
            name: 'Slovak'
        },
        {
            code: 'sl',
            name: 'Slovenian'
        },
        {
            code: 'sm',
            name: 'Samoan'
        },
        {
            code: 'sn',
            name: 'Shona'
        },
        {
            code: 'so',
            name: 'Somali'
        },
        {
            code: 'sq',
            name: 'Albanian'
        },
        {
            code: 'sr',
            name: 'Serbian'
        },
        {
            code: 'ss',
            name: 'Swati'
        },
        {
            code: 'st',
            name: 'Sotho, Southern'
        },
        {
            code: 'su',
            name: 'Sundanese'
        },
        {
            code: 'sv',
            name: 'Swedish'
        },
        {
            code: 'sw',
            name: 'Swahili'
        },
        {
            code: 'ta',
            name: 'Tamil'
        },
        {
            code: 'te',
            name: 'Telugu'
        },
        {
            code: 'tg',
            name: 'Tajik'
        },
        {
            code: 'th',
            name: 'Thai'
        },
        {
            code: 'ti',
            name: 'Tigrinya'
        },
        {
            code: 'tk',
            name: 'Turkmen'
        },
        {
            code: 'tl',
            name: 'Tagalog'
        },
        {
            code: 'tn',
            name: 'Tswana'
        },
        {
            code: 'to',
            name: 'Tonga (Tonga Islands)'
        },
        {
            code: 'tr',
            name: 'Turkish'
        },
        {
            code: 'ts',
            name: 'Tsonga'
        },
        {
            code: 'tt',
            name: 'Tatar'
        },
        {
            code: 'tw',
            name: 'Twi'
        },
        {
            code: 'ty',
            name: 'Tahitian'
        },
        {
            code: 'ug',
            name: 'Uighur; Uyghur'
        },
        {
            code: 'uk',
            name: 'Ukrainian'
        },
        {
            code: 'ur',
            name: 'Urdu'
        },
        {
            code: 'uz',
            name: 'Uzbek'
        },
        {
            code: 've',
            name: 'Venda'
        },
        {
            code: 'vi',
            name: 'Vietnamese'
        },
        {
            code: 'vo',
            name: 'Volapük'
        },
        {
            code: 'wa',
            name: 'Walloon'
        },
        {
            code: 'wo',
            name: 'Wolof'
        },
        {
            code: 'xh',
            name: 'Xhosa'
        },
        {
            code: 'yi',
            name: 'Yiddish'
        },
        {
            code: 'yo',
            name: 'Yoruba'
        },
        {
            code: 'za',
            name: 'Zhuang; Chuang'
        },
        {
            code: 'zh',
            name: 'Chinese'
        },
        {
            code: 'zu',
            name: 'Zulu'
        }
    ],
    redFlagReasons: {
        PLAGIARISM: {
            value: 'PLAGIARISM',
            nicename: 'Plagiarism'
        },
        ETHICAL_ISSUES: {
            value: 'ETHICAL_ISSUES',
            nicename: 'Ethical issues'
        },
        MISREPRESENTATION: {
            value: 'MISREPRESENTATION',
            nicename: 'Misrepresentation'
        },
        UNDECLARED_IMAGE_MANIPULATION: {
            value: 'UNDECLARED_IMAGE_MANIPULATION',
            nicename: 'Undeclared image manipulation'
        },
        COPYRIGHT: {
            value: 'COPYRIGHT',
            nicename: 'Copyright'
        },
        INAPPROPRIATE: {
            value: 'INAPPROPRIATE',
            nicename: 'Inappropriate'
        },
        UNDECLARED_AI: {
            value: 'UNDECLARED_AI',
            nicename: 'Undeclared use of generative AI'
        },
        NOT_IN_OCTOPUS_FORMAT: {
            value: 'NOT_IN_OCTOPUS_FORMAT',
            nicename: 'Not in Octopus format'
        },
        IRRELEVANT_LINKED_PUBLICATION: {
            value: 'IRRELEVANT_LINKED_PUBLICATION',
            nicename: 'Linked to irrelevant publication'
        }
    }
};

export const dataPermissionsOptions: string[] = [
    'The results in this publication involved access to owned or copyrighted materials.',
    'The results in this publication does <strong>not</strong> involve access to materials owned or copyrighted materials (except those in the private ownership of the authors).'
];

export const HTMLStyles = `
    custom-table 
    prose
    w-full
    max-w-none
    text-grey-800
    transition-colors 
    duration-500 
    prose-headings:font-medium 
    prose-headings:font-montserrat 
    prose-headings:text-grey-800 
    prose-a:text-grey-800 
    prose-a:underline 
    prose-a:decoration-teal-500 
    prose-a:decoration-2 
    prose-a:underline-offset-1 
    prose-a:outline-none 
    focus:prose-a:bg-yellow-300 
    prose-blockquote:border-teal-500 
    prose-blockquote:text-grey-600
    prose-strong:text-grey-800
    dark:text-grey-100
    dark:prose-headings:text-white-50
    dark:prose-a:text-white-50
    dark:focus:prose-a:text-grey-800
    dark:prose-blockquote:text-grey-300
    dark:prose-strong:text-grey-100
`
    .split('\n')
    .join(' ');

export const HTMLStylesTiptapEditor = `
    tiptap-editor
    prose
    w-full
    max-w-none
    text-grey-800
    transition-colors 
    duration-500 
    prose-headings:font-medium 
    prose-headings:font-montserrat 
    prose-headings:text-grey-800 
    prose-a:text-grey-800 
    prose-a:underline 
    prose-a:decoration-teal-500 
    prose-a:decoration-2 
    prose-a:underline-offset-1 
    prose-a:outline-none 
    focus:prose-a:bg-yellow-300 
    prose-blockquote:border-teal-500 
    prose-blockquote:text-grey-600
    prose-strong:text-grey-800
`
    .split('\n')
    .join(' ');

export const topicDescription =
    'This is a research topic created to provide authors with a place to attach new problem publications.';

export const blogContentType = 'octopusBlog';

export const doiBaseUrl = `https://${process.env.NEXT_PUBLIC_STAGE === 'prod' ? 'doi.org' : 'handle.test.datacite.org'}/`;

// Defines the boundaries for LaTeX expressions in publication content. Expressions are enclosed on both ends by "$$".
export const latexRegex = /\$\$([^$]*)\$\$/gi;
