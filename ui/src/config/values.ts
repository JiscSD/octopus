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
            ratings: [
                {
                    id: 'PROBLEM_WELL_DEFINED',
                    value: 'Well defined',
                    description:
                        'Does this publication define a scientific problem well enough to make it possible to generate hypotheses from it? This should cover both how well it is defined intellectually and also how well the writing of the publication makes it clear.',
                    labels: {
                        negative: 'Not at all clearly defined',
                        positive: 'Perfectly clearly defined'
                    }
                },
                {
                    id: 'PROBLEM_ORIGINAL',
                    value: 'Non-derivative',
                    description:
                        'Please assess whether this scientific problem is original and has not previously been published in some form elsewhere.',
                    labels: {
                        negative: 'A problem already described elsewhere',
                        positive: 'An original problem not previously described'
                    }
                },
                {
                    id: 'PROBLEM_IMPORTANT',
                    value: 'Important',
                    description:
                        'Please assess whether this is a problem of importance, with many implications and ramifications, or merely a trivial issue.',
                    labels: {
                        negative: 'A trivial issue',
                        positive: 'A problem of great importance'
                    }
                }
            ]
        },
        HYPOTHESIS: {
            id: 'HYPOTHESIS',
            heading: 'Hypothesis',
            content:
                'An original hypothesis relating to an existing published Problem or the rationale for how you think the Problem could be addressed.',
            ratings: [
                {
                    id: 'HYPOTHESIS_WELL_DEFINED',
                    value: 'Well defined',
                    description:
                        'Please assess whether this publication defines a hypothesis well enough to make it possible to test it. This should cover both how well it is defined intellectually and also how well the writing of the publication makes it clear.',
                    labels: {
                        negative: 'Not at all clearly defined',
                        positive: 'Perfectly clearly defined'
                    }
                },
                {
                    id: 'HYPOTHESIS_ORIGINAL',
                    value: 'Non-derivative',
                    description:
                        'Please assess whether this hypothesis is original and has not previously been published in some form elsewhere.',
                    labels: {
                        negative: 'A hypothesis already described elsewhere',
                        positive: 'An original hypothesis not previously described'
                    }
                },
                {
                    id: 'HYPOTHESIS_SCIENTIFICALLY_VALID',
                    value: 'Theoretically valid',
                    description:
                        'Please assess whether this hypothesis or rationale is supported by current knowledge on the topic (which should have been made clear through the references cited in it) or is theoretically sound.',
                    labels: {
                        negative: 'Completely unsupported hypothesis/rationale',
                        positive: 'A theoretically valid hypothesis/rationale'
                    }
                }
            ]
        },
        PROTOCOL: {
            id: 'PROTOCOL',
            heading: 'Protocol',
            content: 'A practical method of testing an existing published Hypothesis.',
            ratings: [
                {
                    id: 'PROTOCOL_CLEAR',
                    value: 'Details clear',
                    description:
                        'Please assess whether this publication defines a method well enough for it to be carried out exactly.',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and reproducible'
                    }
                },
                {
                    id: 'PROTOCOL_ORIGINAL',
                    value: 'Non-derivative',
                    description:
                        'Please assess whether this method or protocol is original and has not previously been published in some form on another platform, unless that is acknowledged through a DOI or URL link.',
                    labels: {
                        negative: 'A method already described elsewhere',
                        positive: 'An original method not previously described'
                    }
                },
                {
                    id: 'PROTOCOL_APPROPRIATE_TEST_OF_HYPOTHESIS',
                    value: 'Theoretically appropriate',
                    description:
                        'Please assess whether this method would provide an appropriate test of the hypothesis, or is an appropriate follow on from the rationale to which it is linked.',
                    labels: {
                        negative: 'Completely inappropriate following the linked hypothesis/rationale',
                        positive: 'An appropriate & insightful follow-on from the linked hypothesis/rationale'
                    }
                }
            ]
        },
        DATA: {
            id: 'DATA',
            heading: 'Data',
            content:
                'Raw data or summarised results collected according to an existing published Method (can be linked to a data repository).',
            ratings: [
                {
                    id: 'DATA_WELL_ANNOTATED',
                    value: 'Reusable',
                    description:
                        'Please assess whether these results or data (which may include raw data in a specialist repository) are provided in a format that allows them to be analysed and used, including all necessary meta-data and details about their collection (including mention of protocol deviations).',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and reusable'
                    }
                },
                {
                    id: 'DATA_SIZE_OF_DATASET',
                    value: 'Valuable',
                    description:
                        'Please assess the size and importance of the dataset (taking into account the difficulty of collection and the amount of data required to make a valid analysis of it) - for example, whether it contains data from sources rarely made available and particular valuable to the research question.',
                    labels: {
                        negative: 'A very small dataset of minor importance	',
                        positive: 'A very large and important dataset'
                    }
                },
                {
                    id: 'DATA_FOLLOWED_PROTOCOL',
                    value: 'Protocol adherence',
                    description:
                        'Please assess how well the data appears to have been collected according to the method/protocol it is linked to (did the authors report many protocol deviations or fail to report on how closely they followed it?).',
                    labels: {
                        negative: 'Poorly collected or reported	(cannot tell level of adherence)',
                        positive: 'Carefully collected and reported'
                    }
                }
            ]
        },
        ANALYSIS: {
            id: 'ANALYSIS',
            heading: 'Analysis',
            content: 'A statistical or thematic analysis of existing published Data or Results.',
            ratings: [
                {
                    id: 'ANALYSIS_CLEAR',
                    value: 'Details clear',
                    description:
                        'Please assess whether this analysis has been written in such a way that it is clear what has been done and why.',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and reproducible'
                    }
                },
                {
                    id: 'ANALYSIS_ORIGINAL',
                    value: 'Non-derivative',
                    description:
                        'Please assess whether this analysis is original and has not previously been published in some form elsewhere.',
                    labels: {
                        negative: 'An analysis already carried out on this data',
                        positive: 'An original analysis not previously carried out on this data'
                    }
                },
                {
                    id: 'ANALYSIS_APPROPRIATE_METHODOLOGY',
                    value: 'Appropriate methodology',
                    description:
                        'Please assess whether this analysis is appropriate given the method and the data, and hence whether the results should be trusted.',
                    labels: {
                        negative: 'Completely inappropriate given the data and research question',
                        positive: 'An appropriate & insightful analysis given the data and research question'
                    }
                }
            ]
        },
        INTERPRETATION: {
            id: 'INTERPRETATION',
            heading: 'Interpretation',
            content: 'A discussion around an existing published Analysis.',
            ratings: [
                {
                    id: 'INTERPRETATION_CLEAR',
                    value: 'Clearly written',
                    description:
                        'Please assess whether this interpretation has been written in such a way that its conclusions and the reasoning behind them are clear. This should cover both its intellectual quality and also the clarity of the expression of the ideas.',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and understandable'
                    }
                },
                {
                    id: 'INTERPRETATION_INSIGHTFUL',
                    value: 'Insightful',
                    description: 'Please assess whether this interpretation is original and insightful.',
                    labels: {
                        negative: 'An interpretation not giving	any insights that aren`t described elsewhere',
                        positive: 'An original and insightful interpretation not previously described'
                    }
                },
                {
                    id: 'INTERPRETATION_CONSISTENT_WITH_DATA',
                    value: 'Consistent with data',
                    description:
                        'Please assess how well this interpretation fits all the data available at the time it is written (if subsequent data has changed the evidence base then this publication should not be penalised but please do not rate it at all).',
                    labels: {
                        negative: 'Interpretation completely unsupported by the evidence base',
                        positive: 'An appropriate interpretation completely supported by the evidence'
                    }
                }
            ]
        },
        REAL_WORLD_APPLICATION: {
            id: 'REAL_WORLD_APPLICATION',
            heading: 'Real-world Application',
            content: 'Real world applications arising from an existing published Interpretation.',
            ratings: [
                {
                    id: 'REAL_WORLD_APPLICATION_CLEAR',
                    value: 'Details clear',
                    description:
                        'Please assess whether this real-world application has been written in such a way that it is clear exactly how the knowledge could be applied (any pieces of knowledge missing, that would need to be addressed before this application could be brought to the real world should be raised as new Problems linked to this publication)',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and understandable'
                    }
                },
                {
                    id: 'REAL_WORLD_APPLICATION_IMPACTFUL',
                    value: 'Impactful',
                    description: 'please assess how much impact this application could have within its field.',
                    labels: {
                        negative: 'An application with minor impact',
                        positive: 'An application promising major impact'
                    }
                },
                {
                    id: 'REAL_WORLD_APPLICATION_APPROPRIATE_TO_IMPLEMENT',
                    value: 'Appropriate',
                    description:
                        'please assess how appropriate this real-world application would be to implement (ethically, practically etc), and how well-supported by the evidence base above it.',
                    labels: {
                        negative: 'Application completely inappropriate or unsupported by evidence',
                        positive: 'An appropriate application well supported by evidence'
                    }
                }
            ]
        },
        PEER_REVIEW: {
            id: 'PEER_REVIEW',
            heading: 'Review',
            content: '',
            ratings: [
                {
                    id: 'REVIEW_CLEAR',
                    value: 'Clearly written',
                    description:
                        'Please assess whether this review has been written in such a way that its insights and the reasoning behind them are clear.',
                    labels: {
                        negative: 'Not at all clear in its details',
                        positive: 'Perfectly clear and understandable'
                    }
                },
                {
                    id: 'REVIEW_INSIGHTFUL',
                    value: 'Insightful',
                    description:
                        'Please assess whether this review gives insights into its linked publication which will help others assess its quality.',
                    labels: {
                        negative: 'A review not giving any major insights',
                        positive: 'An highly insightful review'
                    }
                },
                {
                    id: 'REVIEW_ORIGINAL',
                    value: 'Original',
                    description:
                        'To what extent does the review pick up on aspects of the publication it is linked to which haven`t been published by other authors?',
                    labels: {
                        negative: 'All major aspects already described elsewhere',
                        positive: 'Gives many insights not previously described'
                    }
                }
            ]
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
        CC_BY_ND: {
            value: 'CC_BY_ND',
            nicename: 'CC BY-ND 4.0',
            fullName: 'Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)',
            description:
                'This license lets others reuse the work for any purpose, including commercially; however, it cannot be shared with others in adapted form, and credit must be provided to you.',
            link: 'https://creativecommons.org/licenses/by-nd/4.0'
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
        },
        CC_BY_NC_ND: {
            value: 'CC_BY_NC_ND',
            nicename: 'CC BY-NC-ND 4.0',
            fullName: 'Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)',
            description:
                'This license is the most restrictive of our six main licenses, only allowing others to download your works and share them with others as long as they credit you, but they can’t change them in any way or use them commercially.',
            link: 'https://creativecommons.org/licenses/by-nc-nd/4.0'
        }
    }
};

export const HTMLStyles =
    'custom-table prose max-w-none text-grey-800 transition-colors duration-500 prose-headings:font-medium prose-headings:font-montserrat prose-headings:text-grey-800 prose-a:text-grey-800 prose-a:underline prose-a:decoration-teal-500 prose-a:decoration-2 prose-a:underline-offset-1 prose-a:outline-none focus:prose-a:bg-yellow-300 prose-blockquote:border-teal-500 prose-blockquote:text-grey-600 prose-strong:text-grey-800 dark:text-grey-100 dark:prose-headings:text-white-50 dark:prose-a:text-white-50 dark:focus:prose-a:text-grey-800 dark:prose-blockquote:text-grey-300 dark:prose-strong:text-teal-300 w-full';
