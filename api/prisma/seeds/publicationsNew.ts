const PublicationTypes = {
    problem: 'PROBLEM',
    hypothesis: 'HYPOTHESIS',
    protocol: 'PROTOCOL',
    data: 'DATA',
    analysis: 'ANALYSIS',
    interpretation: 'INTERPRETATION',
    realWorldApplication: 'REAL_WORLD_APPLICATION',
    peerReview: 'PEER_REVIEW'
};

const PublicationStatus = {
    draft: 'DRAFT',
    live: 'LIVE',
    hidden: 'HIDDEN'
};

const users = {
    user1: 'test-user-1',
    user2: 'test-user-2',
    peerReviewer: 'test-user-3-peer-reviewer'
};

const newPublicationSeeds = [
    // User 1 PROBLEM > HYPOTHESIS > PROTOCOL > DATA > ANALYSIS > INTERPRETATION > REAL_WORLD_APPLICATION

    // Problem Live and Draft
    {
        id: 'publication-user-1-problem-1-live',
        title: "Improvement of people's quality of life by respecting the constraints of environmental sustainability",
        type: PublicationTypes.problem,
        content:
            'Today as a human species we have two major problems that are closely interrelated: 1)   A large majority of people live a very poor quality life, while there would be the possibility of all living much better. 2)  The lifestyle of the minority of people who live a level of quality of life above the average (but which is still much lower than the level of quality of life we could all reach) is leading to the rapid destruction of many natural balances, extinction of animal species and will likely lead to the extinction of our own species. History is rich in examples, where individuals or groups of people have subjected other people to their wishes, from the construction of the pyramids in the time of the ancient Egyptians, where people were enslaved through the use of force, up to the present psychological conditioning of billions of people, mainly implemented through the use of television and the capitalist system (today we are all slaves without chains). Certainly part of the reason is contained in our DNA which unfortunately cannot be changed in a short time, but for the first time in our history we have the ability to communicate globally using technologies that were unthinkable until a few years ago. Today we use technology to do a lot of useless things, we should use it in smarter ways.',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T15:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-25T16:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-user-1-problem-2-draft',
        title: 'Sustainable development',
        type: PublicationTypes.problem,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        }
    },

    // Hypothesis Live and Draft
    {
        id: 'publication-user-1-hypothesis-1-live',
        title: 'Individual Social Value as a means of accessing resources in a reciprocal system',
        type: PublicationTypes.hypothesis,
        content:
            "In the past, many important people have given us a principle that can lead to improve the quality of life whit the respect of constraints of environmental sustainability. This principle is known as 'Golden Rule' , it is the synthesis of all universal ethical codes and analyzing the implications we can establish the following rights and duties valid for each person: 1)    Everyone has the right to live a higher quality life to a minimum. Who among us wants evil for himself? Who wants a life of misery and worry? It is therefore essential, in order not to fall into contradiction, to recognize this right to each individual. By minimum threshold we mean that the lowest standard of quality of life should be a goal to be set in constant improvement with the contribution of all. 2)    Everyone has the right to the preservation of their cultural identity and to respect for their personal dignity. If your family members have passed on certain values to you, would you be willing to change them if you were forced to?   Would you like to be insulted, mistreated, despised, avoided?   Nobody can claim the right to impose their habits on others, we need the utmost respect for peaceful coexistence. 3)    Everyone has the duty to undertake to maintain a minimum level of education. Culture is an essential element in order to live in accordance with the Golden Rule, in a society that seeks to live by this principle deepen the knowledge (of oneself and what surrounds us) is a personal responsibility of each of us. 4)    Everyone has the duty to undertake to respect and preserve the life and the balance of all life forms that have been established on the earth since its inception. Everything that has been written so far, the principles to which reference is made, are of universal validity and are directed to every single person, regardless of whether they are a member of an aboriginal tribe in Australia or an American citizen. Any group of people who claim to share these principles should have the following objectives in their governing bodies: 1) raise the minimum threshold of quality of life and the cultural level 2) to ensure social development in harmony with the natural balance existing 3) Establish and promote meritocratic systems for the benefit of the people who contribute most, through the provision of socially useful goods and services, to achieve the first two objectives. This objective aims at achieving the first two, through the activities that we will define as 'activities of production of goods and provision of socially useful services' that are all the only necessary to ensure a good level of quality of life in the context of a society based on the principles set out above. We will call a society that respects the Golden Rule a 'Reciprocal System' as opposed to the current 'Capitalist System' based on the principles we know well of competition and the free market. Ensuring a good level of quality of life for everyone means being free from everyday worries, so that you can dedicate yourself as much as possible to your inclinations, this should be one of the main objectives to be pursued globally. The main commitments for each of us should be : -  To produce value in the form of material goods and / or service of socially useful -  Increase your level of education (history, art, science, current events) -  Taking care of our environment, the biosphere, our only true wealth The production of material goods by means of our hands or machines, however produced by the hands of other individuals, plus the supply of both material and intellectual services, are the only human activities that give an added value useful for social development. Now we go on to analyze what are the human activities necessary to ensure a good level of quality of life. The categories of socially useful activities Here's an exhaustive list of the areas of socially useful activities divided into three groups: Areas of production of material goods: Agriculture, farms, Forestry, Food, Manufacturing, Handicraft, Construction, metallurgic, Mining, Mechanical, Chemical, Pharmaceutical, Textiles, Pulp and Paper, Plastic, Electronic, Automotive, Railways, Shipbuilding, Building Technology, Industrial Plant Engineering, Aeronautics, Aerospace . Areas of providing of material services : Health / Sports, Transportation, Environmental maintenance and monitoring, Public Policy, Resources Management (Water, Energy, Raw Materials),  Maintenance, Distribution of Goods, Catering, Hospitality and Tourism. Areas of providing intellectual services: Education, Research, Design (goods, services, software), International Cooperation, Justice, administrative. As you can see, all these items you will not find banks, credit systems and everything that is related to money because we have invented it to facilitate exchange in goods and services. Today the money is not part of the human needs. The use of money has had its usefulness in the past and has certainly contributed both to the level of actual development and the creation of all the problems of 'modern society'. But the real wealth is not tied to money, but to the production of goods and provision of the services listed, provided by each of us. For the same reasons there are no commercial activities or advertising activities, only the sector of activity for the distribution of material goods exists. Only the people who has give a personal contribution in one activities listed above, give a contribute to improvement to the life quality of all people. Each person should have a clear understanding of what the important things are, that is : 1) The environment in which we live (resources): nature will not adapt to our whims, we must be aware of the fact that we live in a closed system and in perfect balance (the biosphere) .The actual capitalist system, based on the continued growth and on the reckless use of resources, driving us quickly to the disaster. 2) Respect for our fellow human beings and all forms of life: you can not get on with arrogance, cunning used for the exploitation of others, rather it will be necessary to unite our minds in a common effort to overcome the challenges that the future holds for us. We need to replace the word 'competition' with the word 'cooperation' In fact, in a society based on the ethics of reciprocity, the personal profit, the competition as a means for survival, the desire to possess things, no longer any sense. I set out below the proposal to realize the Humanity Management System (HMS) : 1) Each person has their own Individual Social Value (ISV) which is calculated on the basis of two coefficients, cultural coefficient and environmental coefficient 2) Material goods and material services necessary to achieve the best level of quality of life (that have been listed above)  have been divided into two  subcategories: 2a) material goods 2a1)  material goods for personal use 2a2)  material goods for the production of material goods / material services / intellectual services 2b) material services 1b1)  material services for personal use 1b2)  material services for the production of material goods / material services / intellectual services Access to personal goods and services is regulated for each person by their own ISV. Only personal goods and services are considered in the calculus of ISV. Access to goods and services for productions is regulated according to own skills. We have QVmin (minimum level of Quality of Life) and QVmax (level of Quality of Life maximum). For the first time ISV is calculated starting from current personal assets. Personal assets remain yours as long as you are alive and can be passed on to the people you want. when someone produces / supplies a socially useful good / service his ISV will undergo a variation equal to : ISV = ISV +  V*(Kc+Kb)         if the good/service has been produced/supplied ISV = ISV -   V                        if the good/service has been received with the following limits             QVmin      <     ISV     <     QVmax where Kc       is the coefficient proportional to the culture for each person Kb       is the coefficient proportional to the good behavior towards the environment and towards other people V         is the globally standardized value of a given socially useful good/service, provided/produced by the single person or groups of person the values of Kc and Kb could be included in the range 0.5 ..10.0 This, in order to motivate people to increase their Kc and Kb coefficients. QVmin allows anyone to access essential goods and services QVmax allows access to all goods and services with the only limitation not to conflict with the golden rule The biggest difference between ISV and money is the fact that ISVs are not stackable, so you can't lock in resources for other people. In the following drawing you can find a possible structure of the database and the relationships between the various elements necessary for the realization of the HMS",
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-22T15:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-27T18:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-1-problem-1-live'
            }
        }
    },
    {
        id: 'publication-user-1-hypothesis-2-draft',
        title: 'Recognizing “reciprocal relations” to restore community access to land and water',
        type: PublicationTypes.hypothesis,
        content:
            'Draft hypothesis for Recognizing “reciprocal relations” to restore community access to land and water',
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-1-problem-1-live'
            }
        }
    },

    // Protocol Live and Draft
    {
        id: 'publication-user-1-protocol-1-live',
        title: 'Explore its broader implications and consider how bringing reciprocal relations to the forefront of environmental governance may affect environmental sustainability and community well-being.',
        type: PublicationTypes.protocol,
        content:
            'Many communities around the world are working to maintain, regain and restore intimate and embodied relationships with the places they inhabit, but these relations are contingent upon the level of community access to these places. Ribot and Peluso (2003) define access as “the ability to benefit from things—including material objects, persons, institutions and symbols,” with an emphasis on gaining the ability to benefit, rather than simply establishing the right to benefit (Ribot and Peluso 2003, 153). Changes in “social-relational mechanisms” (e.g. access to knowledge, authority, technology, markets, capital, or labor) can affect a community’s ability to access natural resources—even without a shift in formal rights (Ribot and Peluso 2003, 160). In this way, the theory of access offers important insights into the web of power relations shaping resource extraction, benefit distribution, and community resistance movements. However, the approach focuses primarily on human-centric benefits, and emphasizes benefit flows from nature/place to humans. Our conception of reciprocal relations extends Ribot and Peluso’s theory of access beyond unidirectional thinking, and toward a relational understanding of people and place. In summary, our reciprocal relations concept builds upon a range of multi-faceted human-environment relationships that challenge human-centric concepts of nature (e.g. Chan et al. 2016), emphasize the agency of nature including non-human beings and the landscape itself (e.g. Mitchell 2002; Haraway 2003; Cruikshank 2014), recognize Indigenous cosmologies and embedded kinship relations with the natural world (e.g. Deloria 2001; Turner 2005; Wilson 2008), and acknowledge the transformative power of experiencing the land through place attachment (e.g. Feld and Basso 1996). Our case analysis draws upon the multiple lenses discussed above: Indigenous epistemologies, natureculture, socionature, relational values, and sense of place scholarship. These perspectives converge on the idea of reciprocal relations based on mutual responsibilities between resources and people, where the flow of benefits is not uni-directional. Such insights further suggest that access may differ for those communities seeking to regain not simply benefits, but rather mutually beneficial relationships and responsibilities to land, water, and resources.',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-22T15:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-27T18:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-1-hypothesis-1-live'
            }
        }
    },
    {
        id: 'publication-user-1-protocol-2-draft',
        title: 'Relations are contingent upon the level of community access to these places',
        type: PublicationTypes.protocol,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // Data Live and Draft
    {
        id: 'publication-user-1-data-1-live',
        title: 'Explore its broader implications and consider how bringing reciprocal relations to the forefront of environmental governance may affect environmental sustainability and community well-being.',
        type: PublicationTypes.data,
        content:
            'Nováček and Mederly (2015) present alterna-tive indicators to help measure societal develop-ment, described as follows:(i) Index of Sustainable Economic Welfare(ISEW), which aggregates personal con-sumption, social welfare, and the qualityof the environment, reﬂecting non-monetary gains and including the long-term consequences of a damagedenvironment.Quality of Life and Sustainable Development 5 (ii) Human Development Index (HDI), oftenpublished by the United States Develop-ment Program since 1990 to measure socialdevelopment and which encompasses thechanges of a long and healthy life, literacy,access to knowledge, and access toresources for a digniﬁed life.(iii) Dashboard of Sustainability, composed offour main areas –environmental, social,economic, and institutional.(iv) Environmental Sustainability Index (ESI),centered on ﬁve themes –the situation ofthe environment and its load, human depen-dency on and sensitivity to external inﬂu-ences, social capacity, institutionalcapacity, and participation in internationalcooperation.(v) Environmental Vulnerability Index (EVI),which aims at complementing indices forsocial and economic vulnerability, embrac-ing factors as climate change, biodiversity,water, agriculture and ﬁsheries, humanhealth, desertiﬁcation, and exposure to nat-ural disasters.(vi) Well-being of Nations, which accounts forhuman well-being and the stress ofecosystems.(vii) Living Planet Index (LPI), which trackstrends related to biological diversity onEarth.(viii) Ecological Footprint, which compares therate of consumption of natural resourcesagainst the capacity of biologically produc-tive areas on Earth.(ix) Happy Planet Index (HPI), which reportsthe average number of years of a happy lifeper unit of consumed natural resources, thatis, it assesses the efﬁciency with whichcountries transform natural resources intopopulation welfare, encompassing aspectssuch as ecological footprint, life satisfac-tion, and life expectancy.(x) Gross National Happiness (GNH), whichfocuses on the nonmaterial aspects of lifeand brings into question the spiritual devel-opment as a complement of material devel-opment, focusing on the promotion ofsustainable development, the preservation',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-24T18:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-1-protocol-1-live'
            }
        }
    },
    {
        id: 'publication-user-1-data-2-draft',
        title: 'alternative indicators (2015) ADD IN DATA',
        type: PublicationTypes.data,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // Analysis Live and Draft
    {
        id: 'publication-user-1-analysis-1-live',
        title: 'Explore its broader implications and consider how bringing reciprocal relations to the forefront of environmental governance may affect environmental sustainability and community well-being.',
        type: PublicationTypes.analysis,
        content:
            'Nováček and Mederly (2015) present alterna-tive indicators to help measure societal develop-ment, described as follows:(i) Index of Sustainable Economic Welfare(ISEW), which aggregates personal con-sumption, social welfare, and the qualityof the environment, reﬂecting non-monetary gains and including the long-term consequences of a damagedenvironment.Quality of Life and Sustainable Development 5 (ii) Human Development Index (HDI), oftenpublished by the United States Develop-ment Program since 1990 to measure socialdevelopment and which encompasses thechanges of a long and healthy life, literacy,access to knowledge, and access toresources for a digniﬁed life.(iii) Dashboard of Sustainability, composed offour main areas –environmental, social,economic, and institutional.(iv) Environmental Sustainability Index (ESI),centered on ﬁve themes –the situation ofthe environment and its load, human depen-dency on and sensitivity to external inﬂu-ences, social capacity, institutionalcapacity, and participation in internationalcooperation.(v) Environmental Vulnerability Index (EVI),which aims at complementing indices forsocial and economic vulnerability, embrac-ing factors as climate change, biodiversity,water, agriculture and ﬁsheries, humanhealth, desertiﬁcation, and exposure to nat-ural disasters.(vi) Well-being of Nations, which accounts forhuman well-being and the stress ofecosystems.(vii) Living Planet Index (LPI), which trackstrends related to biological diversity onEarth.(viii) Ecological Footprint, which compares therate of consumption of natural resourcesagainst the capacity of biologically produc-tive areas on Earth.(ix) Happy Planet Index (HPI), which reportsthe average number of years of a happy lifeper unit of consumed natural resources, thatis, it assesses the efﬁciency with whichcountries transform natural resources intopopulation welfare, encompassing aspectssuch as ecological footprint, life satisfac-tion, and life expectancy.(x) Gross National Happiness (GNH), whichfocuses on the nonmaterial aspects of lifeand brings into question the spiritual devel-opment as a complement of material devel-opment, focusing on the promotion ofsustainable development, the preservation',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-24T18:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-1-data-1-live'
            }
        }
    },
    {
        id: 'publication-user-1-analysis-2-draft',
        title: 'alternative indicators (2015) ADD IN DATA',
        type: PublicationTypes.analysis,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // Interpretation Live and Draft
    {
        id: 'publication-user-1-interpretation-1-live',
        title: 'What Are the Main Constraints in Achieving Quality of Life Through Sustainable Development?',
        type: PublicationTypes.interpretation,
        content:
            'The assessment of quality of life faces barriers oftime, culture, and a variety of disciplines, as wellargued by Costanza et al. (2006). The authors alsoreport that quality of life is a function of the extentto which human needs are met and the relevance(or weight) of this need to the respondent. Theweighing of a speciﬁc need is subjected to varia-tions of context and time, principles, and relation-ships; for instance, a need will be moremeaningful when it is associated with more recentexperiences or when it is a part of a current phase,or when individuals or groups have others as astandard for comparison, according to a reviewdone by Costanza et al. (2006), based on the workof Schwartz and Strack (1999).It is possible to perceive that the deﬁnition ofquality of life reﬂects a rather dynamic and com-plex system, in a way, that it is fundamental tounderstand that needs may change across time inresponse to social, economic, and environmentalchanges. Thus, as stressed by the authors above,any attempt to “measure”quality of life should',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-24T18:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-1-analysis-1-live'
            }
        }
    },
    {
        id: 'publication-user-1-interpretation-2-draft',
        title: 'How Does Sustainable Development Help Promote Quality of Life?',
        type: PublicationTypes.interpretation,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // Real World Application Live and Draft
    {
        id: 'publication-user-1-real-world-application-1-live',
        title: 'Conclusion of Sustainable Development',
        type: PublicationTypes.realWorldApplication,
        content:
            'The assessment of quality of life faces barriers oftime, culture, and a variety of disciplines, as wellargued by Costanza et al. (2006). The authors alsoreport that quality of life is a function of the extentto which human needs are met and the relevance(or weight) of this need to the respondent. Theweighing of a speciﬁc need is subjected to varia-tions of context and time, principles, and relation-ships; for instance, a need will be moremeaningful when it is associated with more recentexperiences or when it is a part of a current phase,or when individuals or groups have others as astandard for comparison, according to a reviewdone by Costanza et al. (2006), based on the workof Schwartz and Strack (1999).It is possible to perceive that the deﬁnition ofquality of life reﬂects a rather dynamic and com-plex system, in a way, that it is fundamental tounderstand that needs may change across time inresponse to social, economic, and environmentalchanges. Thus, as stressed by the authors above,any attempt to “measure”quality of life should',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-24T18:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-1-interpretation-1-live'
            }
        }
    },
    {
        id: 'publication-user-1-real-world-application-2-draft',
        title: 'COnclusion - TBC',
        type: PublicationTypes.realWorldApplication,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user1
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // User 2 PROBLEM > HYPOTHESIS > PROTOCOL > DATA > ANALYSIS > INTERPRETATION > REAL_WORLD_APPLICATION

    // Problem Live and Draft
    {
        id: 'publication-user-2-problem-1-live',
        title: 'What is the R0 of the COVID-19 virus?',
        type: PublicationTypes.problem,
        content:
            'In Wuhan, China, a novel and alarmingly contagious primary atypical (viral) pneumonia broke out in December 2019. It has since been identified as a zoonotic coronavirus, similar to SARS coronavirus and MERS coronavirus and named COVID-19. As of 8 February 2020, 33 738 confirmed cases and 811 deaths have been reported in China. The basic reproduction number (R0) is a central concept in infectious disease epidemiology, indicating the risk of an infectious agent with respect to epidemic spread. Calculating it in this new virus is vital to support modelling of the spread of the pandemic.',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T15:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-25T16:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-1-real-world-application-1-live'
            }
        }
    },
    {
        id: 'publication-user-2-problem-2-draft',
        title: 'How can we model the epidemiology of COVID-19?',
        type: PublicationTypes.problem,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        }
    },

    // Hypothesis Live and Draft
    {
        id: 'publication-user-2-hypothesis-1-live',
        title: 'Conducting a meta-analysis of studies of the R0 will help improve estimates',
        type: PublicationTypes.hypothesis,
        content:
            'Multiple studies have been published on the R0 of COVID-19, but only a meta-analysis will bring an appropriate level of confidence in any estimate.',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-22T15:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-27T18:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-user-2-hypothesis-2-draft',
        title: 'Are patients with hypertension and diabetes mellitus at increased risk for COVID-19 infection?',
        type: PublicationTypes.hypothesis,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // Protocol Live and Draft
    {
        id: 'publication-user-2-protocol-1-live',
        title: 'Method for meta-analysis of studies of R0 for COVID-19',
        type: PublicationTypes.protocol,
        content:
            'PubMed, bioRxiv and Google Scholar were accessed to search for eligible studies. The term "coronavirus & basic reproduction number" was used. The time period covered was from 1 January 2020 to 7 February 2020.',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-22T15:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-27T18:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-user-2-protocol-2-draft',
        title: 'Relations are contingent upon the level of community access to these places',
        type: PublicationTypes.protocol,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // Data Live and Draft
    {
        id: 'publication-user-2-data-1-live',
        title: 'Results of a meta-analysis of R0 for COVID-19',
        type: PublicationTypes.data,
        content:
            'We identified 12 studies which estimated the basic reproductive number for COVID-19 from China and overseas. Table 1 shows that the estimates ranged from 1.4 to 6.49, with a mean of 3.28, a median of 2.79 and interquartile range (IQR) of 1.16.',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-24T18:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-user-2-data-2-draft',
        title: 'Results of systematic review of COVID-19 cases',
        content: 'Results of review - *add in* Table 5-10 and Appendices.',
        type: PublicationTypes.data,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // Analysis Live and Draft
    {
        id: 'publication-user-2-analysis-1-live',
        title: 'Analysis of the data from a retrospective cohort study of 191 inpatients in Wuhan with COVID-19',
        type: PublicationTypes.analysis,
        content:
            "We included 171 patients with complete data for all variables (53 non-survivors and 118 survivors) in the multivariable logistic regression model. We found that older age, higher SOFA score, and d-dimer greater than 1 μg/mL at admission were associated with increased odds of death (table 3). When adjusting for study centre, our generalised linear model showed similar results (appendix p 5). For survivors, the median duration of viral shedding was 20·0 days (IQR 17·0–24·0) from illness onset, but the virus was continuously detectable until death in non-survivors (table 2; figure 1). The shortest observed duration of viral shedding among survivors was 8 days, whereas the longest was 37 days. Among 29 patients who received lopinavir/ritonavir and were discharged, the median time from illness onset to initiation of antiviral treatment was 14·0 days (IQR 10·0–17·0) and the median duration of viral shedding was 22·0 days (18·0–24·0). The median duration of viral shedding was 19·0 days (17·0–22·0) in patients with severe disease status and 24·0 days (22·0–30·0) in patients with critical disease status. Download : Download high-res image (889KB) Download : Download full-size image Figure 1. Clinical courses of major symptoms and outcomes and duration of viral shedding from illness onset in patients hospitalised with COVID-19 Figure shows median duration of symptoms and onset of complications and outcomes. ICU=intensive care unit. SARS-CoV-2=severe acute respiratory syndrome coronavirus 2. ARDS=acute respiratory distress syndrome. COVID-19=coronavirus disease 2019. Major laboratory markers were tracked from illness onset (figure 2). Baseline lymphocyte count was significantly higher in survivors than non-survivors; in survivors, lymphocyte count was lowest on day 7 after illness onset and improved during hospitalisation, whereas severe lymphopenia was observed until death in non-survivors. Levels of d-dimer, high-sensitivity cardiac troponin I, serum ferritin, lactate dehydrogenase, and IL-6 were clearly elevated in non-survivors compared with survivors throughout the clinical course, and increased with illness deterioration (figure 2). In non-survivors, high-sensitivity cardiac troponin I increased rapidly from day 16 after disease onset, whereas lactate dehydrogenase increased for both survivors and non-survivors in the early stage of illness, but decreased from day 13 for survivors. Download : Download high-res image (972KB) Download : Download full-size image Figure 2. Temporal changes in laboratory markers from illness onset in patients hospitalised with COVID-19 Figure shows temporal changes in d-dimer (A), lymphocytes (B), IL-6 (C), serum ferritin (D), high-sensitivity cardiac troponin I (E), and lactate dehydrogenase (F). Differences between survivors and non-survivors were significant for all timepoints shown, except for day 4 after illness onset for d-dimer, IL-6, and high-sensitivity cardiac troponin I. For serum ferritin (D), the median values after day 16 exceeded the upper limit of detection, as indicated by the dashed line. COVID-19=coronavirus disease 2019. IL-6=interleukin-6. Median time from illness onset to dyspnoea was similar in survivors and non-survivors, with a median duration of dyspnoea of 13·0 days (9·0–16·5) for survivors (table 2; figure 1). In survivors, the median duration of fever was 12·0 days (8·0–13·0) and cough persisted for 19·0 days (IQR 12·0–23·0; figure 1). 62 (45%) survivors still had cough on discharge and 39 (72%) non-survivors still had cough at the time of death. The dynamic profiles of fever, cough, and dyspnoea are shown in the appendix (p 6). Sepsis developed at a median of 9·0 days (7·0–13·0) after illness onset among all patients, followed by ARDS (12·0 days [8·0–15·0]), acute cardiac injury (15·0 days [10·0–17·0]), acute kidney injury (15·0 days [13·0–19·5]), and secondary infection (17·0 days [13·0–19·0]). The initiation time and duration of systematic corticosteroid use was also similar between the two groups. Among non-survivors, the median time from illness onset was 10·0 days (7·0–14·0) to sepsis, 12·0 days (8·0–15·0) to ARDS, 14·5 days (9·5–17·0) to acute cardiac injury, and 17·0 days (13·0–19·0) to secondary infection (figure 1; table 2). Among survivors, secondary infection, acute kidney injury, and acute cardiac injury were observed in one patient each, occurring 9 days (acute kidney injury), 14 days (secondary infection), and 21 days (acute cardiac injury) after illness onset. The median time from dyspnoea to intubation was 10·0 days (IQR 5·0–12·5) for patients who received invasive mechanical ventilation and the time from invasive mechanical ventilation to occurrence of ventilator-associated pneumonia was 8·0 days (2·0–9·0; figure 1). Continuous and categorical variables were presented as median (IQR) and n (%), respectively. We used the Mann-Whitney U test, χ2 test, or Fisher's exact test to compare differences between survivors and non-survivors where appropriate. To explore the risk factors associated with in-hospital death, univariable and multivariable logistic regression models were used. Considering the total number of deaths (n=54) in our study and to avoid overfitting in the model, five variables were chosen for multivariable analysis on the basis of previous findings and clinical constraints. Previous studies have shown blood levels of d-dimer and Sequential Organ Failure Assessment (SOFA) scores to be higher in critically ill or fatal cases, whereas lymphopenia and cardiovascular disease have been less commonly observed in non-critical or surviving patients with SARS-COV-2 infection.5, 6, 12Similar risk factors, including older age, have been reported associated with adverse clinical outcomes in adults with SARS and Middle East respiratory syndrome (MERS).3, 13 Some laboratory findings, including alanine aminotransferase (ALT), lactate dehydrogenase, high-sensitivity cardiac troponin I, creatine kinase, d-dimer, serum ferritin, and IL-6, might be unavailable in emergency circumstances. Therefore, we chose lymphocyte count, d-dimer, SOFA score, coronary heart disease, and age as the five variables for our multivariable logistic regression model. We excluded variables from the univariable analysis if their between-group differences were not significant, if their accuracy was unconfirmed (eg, exposure, which was self-reported), if the number of events was too small to calculate odds ratios, and if they had colinearity with the SOFA score. We compared patient characteristics between the two hospitals and used a generalised linear model to adjust for possible differences in patients’ characteristics and treatment between the two study centres. A two-sided α of less than 0·05 was considered statistically significant. Statistical analyses were done using the SAS software (version 9.4), unless otherwise indicated.",
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-24T18:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-user-2-analysis-2-draft',
        title: 'Meta-analysis of COVID-19 cases',
        type: PublicationTypes.analysis,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // Interpretation Live and Draft
    {
        id: 'publication-user-2-interpretation-1-live',
        title: 'Interpretation of the results from pathology of a patient who died of COVID-19 in Wuhan',
        type: PublicationTypes.interpretation,
        content:
            'The analysis of the findings from this single patient in Wuhan suggests that COVID-19 infection can stimulate an over activation of T cells and severe immune injury. This can be seen in blood sample and analysis, and results in rapid progression of pneumonia and potentially liver damage. Lymphopenia is a common feature in the patients with COVID-19 and might be a critical factor associated with disease severity and mortality.',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-24T18:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-user-2-interpretation-2-draft',
        title: 'Could treatment for COPD be protective against COVID-19 symptoms?',
        type: PublicationTypes.interpretation,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // Real World Application Live and Draft
    {
        id: 'publication-user-2-real-world-application-1-live',
        title: 'Conclusions from the data on the use of asthma/COPD treatments in COVID-19',
        type: PublicationTypes.realWorldApplication,
        content:
            'The potential benefits or harms of inhaled corticosteroids and other treatments for people at risk of SARS-CoV-2 infection or patients with COVID-19 are unclear at present, and no changes to the treatment or management of chronic respiratory conditions, including COPD and asthma, should be considered at this stage. However, collecting accurate data for the comorbidities and previous therapy of patients with COVID-19 will be essential to understanding risk factors for becoming infected, developing symptoms, and being diagnosed, as well as enabling answers to questions about possible benefits or harms of therapy for asthma and COPD during the COVID-19 pandemic. This could be achieved using a standard dataset as advocated by WHO, including information about the presence and severity of comorbidities and all medication that was being taken at the time of infection.',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-24T18:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-user-2-real-world-application-2-draft',
        title: 'Corticosteroid treatment may help prevent ARDS development in COVID-19 patients',
        type: PublicationTypes.realWorldApplication,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        }
    },

    // User 3 Peer Reviewer

    // Peer Review Live and Draft
    {
        id: 'publication-user-3-peer-review-1-live',
        title: 'Peer Review of Conclusions from the data on the use of asthma/COPD treatments in COVID-19',
        type: PublicationTypes.peerReview,
        content:
            'Not a very in depth conclusion. Missing key themes from the research. Very basic summation of how the data affects this conclusion.',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2022-01-24T18:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-2-real-world-application-1-live'
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-2-draft',
        title: 'Review of Interpretation of the results from pathology of a patient who died of COVID-19 in Wuhan',
        type: PublicationTypes.peerReview,
        currentStatus: PublicationStatus.draft,
        user: {
            connect: {
                id: users.user2
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2022-01-21T10:00:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-2-interpretation-1-live'
            }
        }
    }
];
export default newPublicationSeeds;
