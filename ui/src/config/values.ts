import * as Interfaces from '@interfaces';
import * as Types from '@types';

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

export const octopusInformation: Interfaces.OctopusInformation = {
    publications: {
        PROBLEM: {
            id: 'PROBLEM',
            heading: 'Research Problem',
            content: 'A neatly defined scientific problem.',
            ratings: {
                PROBLEM_WELL_DEFINED: {
                    id: 'PROBLEM_WELL_DEFINED',
                    value: 'Well defined',
                    description:
                        'Does this publication define a scientific problem well enough to make it possible to generate hypotheses from it? This should cover both how well it is defined intellectually and also how well the writing of the publication makes it clear.',
                    labels: {
                        negative: 'Not at all clearly defined',
                        positive: 'Perfectly clearly defined'
                    }
                },
                PROBLEM_ORIGINAL: {
                    id: 'PROBLEM_ORIGINAL',
                    value: 'Non-derivative',
                    description:
                        'Please assess whether this scientific problem is original and has not previously been published in some form elsewhere.',
                    labels: {
                        negative: 'A problem already described elsewhere',
                        positive: 'An original problem not previously described'
                    }
                },
                PROBLEM_IMPORTANT: {
                    id: 'PROBLEM_IMPORTANT',
                    value: 'Important',
                    description:
                        'Please assess whether this is a problem of importance, with many implications and ramifications, or merely a trivial issue.',
                    labels: {
                        negative: 'A trivial issue',
                        positive: 'A problem of great importance'
                    }
                }
            }
        },
        HYPOTHESIS: {
            id: 'HYPOTHESIS',
            heading: 'Rationale/Hypothesis',
            content:
                'An original hypothesis relating to an existing published Research Problem or the rationale for how you think the Research Problem could be addressed.',
            ratings: {
                HYPOTHESIS_WELL_DEFINED: {
                    id: 'HYPOTHESIS_WELL_DEFINED',
                    value: 'Well defined',
                    description:
                        'Please assess whether this publication defines a hypothesis well enough to make it possible to test it. This should cover both how well it is defined intellectually and also how well the writing of the publication makes it clear.',
                    labels: {
                        negative: 'Not at all clearly defined',
                        positive: 'Perfectly clearly defined'
                    }
                },
                HYPOTHESIS_ORIGINAL: {
                    id: 'HYPOTHESIS_ORIGINAL',
                    value: 'Non-derivative',
                    description:
                        'Please assess whether this hypothesis is original and has not previously been published in some form elsewhere.',
                    labels: {
                        negative: 'A hypothesis already described elsewhere',
                        positive: 'An original hypothesis not previously described'
                    }
                },
                HYPOTHESIS_SCIENTIFICALLY_VALID: {
                    id: 'HYPOTHESIS_SCIENTIFICALLY_VALID',
                    value: 'Theoretically valid',
                    description:
                        'Please assess whether this hypothesis or rationale is supported by current knowledge on the topic (which should have been made clear through the references cited in it) or is theoretically sound.',
                    labels: {
                        negative: 'Completely unsupported hypothesis/rationale',
                        positive: 'A theoretically valid hypothesis/rationale'
                    }
                }
            }
        },
        PROTOCOL: {
            id: 'PROTOCOL',
            heading: 'Method',
            content: 'A practical method of testing an existing published Rationale/Hypothesis.',
            ratings: {
                PROTOCOL_CLEAR: {
                    id: 'PROTOCOL_CLEAR',
                    value: 'Details clear',
                    description:
                        'Please assess whether this publication defines a method well enough for it to be carried out exactly.',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and reproducible'
                    }
                },
                PROTOCOL_ORIGINAL: {
                    id: 'PROTOCOL_ORIGINAL',
                    value: 'Non-derivative',
                    description:
                        'Please assess whether this method or protocol is original and has not previously been published in some form on another platform, unless that is acknowledged through a DOI or URL link.',
                    labels: {
                        negative: 'A method already described elsewhere',
                        positive: 'An original method not previously described'
                    }
                },
                PROTOCOL_APPROPRIATE_TEST_OF_HYPOTHESIS: {
                    id: 'PROTOCOL_APPROPRIATE_TEST_OF_HYPOTHESIS',
                    value: 'Theoretically appropriate',
                    description:
                        'Please assess whether this method would provide an appropriate test of the hypothesis, or is an appropriate follow on from the rationale to which it is linked.',
                    labels: {
                        negative: 'Completely inappropriate following the linked hypothesis/rationale',
                        positive: 'An appropriate & insightful follow-on from the linked hypothesis/rationale'
                    }
                }
            }
        },
        DATA: {
            id: 'DATA',
            heading: 'Results',
            content:
                'Raw data or summarised results collected according to an existing published Method (can be linked to a data repository).',
            ratings: {
                DATA_WELL_ANNOTATED: {
                    id: 'DATA_WELL_ANNOTATED',
                    value: 'Reusable',
                    description:
                        'Please assess whether these results or data (which may include raw data in a specialist repository) are provided in a format that allows them to be analysed and used, including all necessary meta-data and details about their collection (including mention of protocol deviations).',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and reusable'
                    }
                },
                DATA_SIZE_OF_DATASET: {
                    id: 'DATA_SIZE_OF_DATASET',
                    value: 'Valuable',
                    description:
                        'Please assess the size and importance of the dataset (taking into account the difficulty of collection and the amount of data required to make a valid analysis of it) - for example, whether it contains data from sources rarely made available and particular valuable to the research question.',
                    labels: {
                        negative: 'A very small dataset of minor importance	',
                        positive: 'A very large and important dataset'
                    }
                },
                DATA_FOLLOWED_PROTOCOL: {
                    id: 'DATA_FOLLOWED_PROTOCOL',
                    value: 'Protocol adherence',
                    description:
                        'Please assess how well the data appears to have been collected according to the method/protocol it is linked to (did the authors report many protocol deviations or fail to report on how closely they followed it?).',
                    labels: {
                        negative: 'Poorly collected or reported	(cannot tell level of adherence)',
                        positive: 'Carefully collected and reported'
                    }
                }
            }
        },
        ANALYSIS: {
            id: 'ANALYSIS',
            heading: 'Analysis',
            content: 'A statistical or thematic analysis of existing published Results.',
            ratings: {
                ANALYSIS_CLEAR: {
                    id: 'ANALYSIS_CLEAR',
                    value: 'Details clear',
                    description:
                        'Please assess whether this analysis has been written in such a way that it is clear what has been done and why.',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and reproducible'
                    }
                },
                ANALYSIS_ORIGINAL: {
                    id: 'ANALYSIS_ORIGINAL',
                    value: 'Non-derivative',
                    description:
                        'Please assess whether this analysis is original and has not previously been published in some form elsewhere.',
                    labels: {
                        negative: 'An analysis already carried out on this data',
                        positive: 'An original analysis not previously carried out on this data'
                    }
                },
                ANALYSIS_APPROPRIATE_METHODOLOGY: {
                    id: 'ANALYSIS_APPROPRIATE_METHODOLOGY',
                    value: 'Appropriate methodology',
                    description:
                        'Please assess whether this analysis is appropriate given the method and the data, and hence whether the results should be trusted.',
                    labels: {
                        negative: 'Completely inappropriate given the data and research question',
                        positive: 'An appropriate & insightful analysis given the data and research question'
                    }
                }
            }
        },
        INTERPRETATION: {
            id: 'INTERPRETATION',
            heading: 'Interpretation',
            content: 'A discussion around an existing published Analysis.',
            ratings: {
                INTERPRETATION_CLEAR: {
                    id: 'INTERPRETATION_CLEAR',
                    value: 'Clearly written',
                    description:
                        'Please assess whether this interpretation has been written in such a way that its conclusions and the reasoning behind them are clear. This should cover both its intellectual quality and also the clarity of the expression of the ideas.',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and understandable'
                    }
                },
                INTERPRETATION_INSIGHTFUL: {
                    id: 'INTERPRETATION_INSIGHTFUL',
                    value: 'Insightful',
                    description: 'Please assess whether this interpretation is original and insightful.',
                    labels: {
                        negative: 'An interpretation not giving	any insights that aren`t described elsewhere',
                        positive: 'An original and insightful interpretation not previously described'
                    }
                },
                INTERPRETATION_CONSISTENT_WITH_DATA: {
                    id: 'INTERPRETATION_CONSISTENT_WITH_DATA',
                    value: 'Consistent with data',
                    description:
                        'Please assess how well this interpretation fits all the data available at the time it is written (if subsequent data has changed the evidence base then this publication should not be penalised but please do not rate it at all).',
                    labels: {
                        negative: 'Interpretation completely unsupported by the evidence base',
                        positive: 'An appropriate interpretation completely supported by the evidence'
                    }
                }
            }
        },
        REAL_WORLD_APPLICATION: {
            id: 'REAL_WORLD_APPLICATION',
            heading: 'Real World Application',
            content: 'Real World Applications arising from an existing published Interpretation.',
            ratings: {
                REAL_WORLD_APPLICATION_CLEAR: {
                    id: 'REAL_WORLD_APPLICATION_CLEAR',
                    value: 'Details clear',
                    description:
                        'Please assess whether this real-world application has been written in such a way that it is clear exactly how the knowledge could be applied (any pieces of knowledge missing, that would need to be addressed before this application could be brought to the real world should be raised as new Research Problems linked to this publication)',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and understandable'
                    }
                },
                REAL_WORLD_APPLICATION_IMPACTFUL: {
                    id: 'REAL_WORLD_APPLICATION_IMPACTFUL',
                    value: 'Impactful',
                    description: 'please assess how much impact this application could have within its field.',
                    labels: {
                        negative: 'An application with minor impact',
                        positive: 'An application promising major impact'
                    }
                },
                REAL_WORLD_APPLICATION_APPROPRIATE_TO_IMPLEMENT: {
                    id: 'REAL_WORLD_APPLICATION_APPROPRIATE_TO_IMPLEMENT',
                    value: 'Appropriate',
                    description:
                        'please assess how appropriate this real-world application would be to implement (ethically, practically etc), and how well-supported by the evidence base above it.',
                    labels: {
                        negative: 'Application completely inappropriate or unsupported by evidence',
                        positive: 'An appropriate application well supported by evidence'
                    }
                }
            }
        },
        PEER_REVIEW: {
            id: 'PEER_REVIEW',
            heading: 'Review',
            content:
                'A considered, detailed peer review of one of the other kinds of publication. Octopus reviews are open and post-publication.',
            ratings: {
                REVIEW_CLEAR: {
                    id: 'REVIEW_CLEAR',
                    value: 'Clearly written',
                    description:
                        'Please assess whether this review has been written in such a way that its insights and the reasoning behind them are clear.',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and understandable'
                    }
                },
                REVIEW_INSIGHTFUL: {
                    id: 'REVIEW_INSIGHTFUL',
                    value: 'Insightful',
                    description:
                        'Please assess whether this review gives insights into its linked publication which will help others assess its quality.',
                    labels: {
                        negative: 'A review not giving any major insights',
                        positive: 'An highly insightful review'
                    }
                },
                REVIEW_ORIGINAL: {
                    id: 'REVIEW_ORIGINAL',
                    value: 'Original',
                    description:
                        'To what extent does the review pick up on aspects of the publication it is linked to which haven`t been published by other authors?',
                    labels: {
                        negative: 'All major aspects already described elsewhere',
                        positive: 'Gives many insights not previously described'
                    }
                }
            }
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
        }
    }
};

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
    dark:prose-strong:text-teal-300
`
    .split(' ')
    .map((i) => {
        return i.replace(/\n/g, '').length ? i.replace(/\n/g, '') : undefined;
    })
    .filter((i) => !!i)
    .join(' ');
