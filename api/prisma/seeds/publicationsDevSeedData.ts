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
    user1: 'test-user-1b-victoria-allen',
    user2: 'test-user-2b-rami-salem',
    user3: 'test-user-3-aoi-han',
    user4: 'test-user-4-juan-garcia',
    user5: 'test-user-5-amelia-lucas',
    user6: 'test-user-6-grace-murphy',
    user7: 'test-user-7-oliver-smith'
};

const newPublicationSeeds = [
    // User 1 PROBLEM > HYPOTHESIS > PROTOCOL > DATA > ANALYSIS > INTERPRETATION > REAL_WORLD_APPLICATION

    // Problem Live and Draft
    {
        id: 'publication-user-1-problem-1-live',
        title: "Improvement of people's quality of life by respecting the constraints of environmental sustainability (html)",
        type: PublicationTypes.problem,
        content:
            '<p>Today as a human species we have two major problems that are closely interrelated: 1) A large majority of people live a very poor quality life, while there would be the possibility of all living much better. 2)  The lifestyle of the minority of people who live a level of quality of life above the average (but which is still much lower than the level of quality of life we could all reach) is leading to the rapid destruction of many natural balances, extinction of animal species and will likely lead to the extinction of our own species. <table><tbody><tr><td>Some requirements of the urban ecosystem [30]</td><td>&nbsp;</td></tr><tr><td>&nbsp;Biological Requirements</td><td>&nbsp;Cultural Requirements</td></tr><tr><td>Air</td><td>Political organization</td></tr><tr><td>Water</td><td>Energy</td></tr></tbody></table><p>&nbsp;</p> History is rich in examples, where individuals or groups of people have subjected other people to their wishes, from the construction of the pyramids in the time of the ancient Egyptians, where people were enslaved through the use of force, up to the present psychological conditioning of billions of people, mainly implemented through the use of television and the capitalist system (today we are all slaves without chains). Certainly part of the reason is contained in our DNA which unfortunately cannot be changed in a short time, but for the first time in our history we have the ability to communicate globally using technologies that were unthinkable until a few years ago. Today we use technology to do a lot of useless things, we should use it in smarter ways. <ul><li>4. Oktober 1983&mdash;Windkraftanlage Growian geht in Betrieb&nbsp;(2013, October 10). WDR. Retrieved from&nbsp;<a href="https://www1.wdr.de/stichtag/stichtag7866.html">https://www1.wdr.de/stichtag/stichtag7866.html</a><div><a href="http://scholar.google.com/scholar?hl=en&amp;q=+4.+Oktober+1983%E2%80%94Windkraftanlage+Growian+geht+in+Betrieb+%282013%2C+October+10%29.+WDR.+Retrieved+from+https%3A%2F%2Fwww1.wdr.de%2Fstichtag%2Fstichtag7866.html">Google Scholar</a></div></li><li>D. Apostol,&nbsp;J. Palmer,&nbsp;M. J. Pasqualetti,&nbsp;R. Smardon, &amp;&nbsp;R. Sullivan&nbsp;(Eds.). (2016).&nbsp;The renewable energy landscape: Preserving scenic values in our sustainable future.&nbsp;London, England: Routledge.<div><a href="https://onlinelibrary.wiley.com/servlet/linkout?suffix=null&amp;dbid=16&amp;doi=10.1111%2F1600-0498.12420&amp;key=10.4324%2F9781315618463">Crossref</a><a href="http://scholar.google.com/scholar_lookup?hl=en&amp;publication_year=2016&amp;author=D.+Apostol&amp;author=J.+Palmer&amp;author=M.+J.+Pasqualetti&amp;author=R.+Smardon&amp;author=R.+Sullivan&amp;title=The+renewable+energy+landscape%3A+Preserving+scenic+values+in+our+sustainable+future">Google Scholar</a></div></li><li>Arbeitsgemeinschaft Sanfte Energie&nbsp;(Ed.). (1979).&nbsp;Energie: &ldquo;Selbst gemacht&rdquo;&nbsp;(&nbsp;2nd ed.).&nbsp;Springe-Eldagsen, Germany: Self-published.<div><a href="http://scholar.google.com/scholar?hl=en&amp;q=+Arbeitsgemeinschaft+Sanfte+Energie+%28Ed.%29.+%281979%29.+Energie%3A+%E2%80%9CSelbst+gemacht%E2%80%9D+%28+2nd+ed.%29.+Springe%E2%80%90Eldagsen%2C+Germany%3A+Self%E2%80%90published.">Google Scholar</a></div></li><li>Arbeitsgemeinschaft Umwelt Z&uuml;rich&nbsp;(Ed.). (1978).&nbsp;Umdenken&mdash;Umschwenken: Alternativen, Wegweiser aus den Zw&auml;ngen der grosstechnologischen Zivilisation.&nbsp;Z&uuml;rich, Switzerland: Achberger.<div><a href="http://scholar.google.com/scholar?hl=en&amp;q=+Arbeitsgemeinschaft+Umwelt+Z%C3%BCrich+%28Ed.%29.+%281978%29.+Umdenken%E2%80%94Umschwenken%3A+Alternativen%2C+Wegweiser+aus+den+Zw%C3%A4ngen+der+grosstechnologischen+Zivilisation.+Z%C3%BCrich%2C+Switzerland%3A+Achberger.">Google Scholar</a></div></li></ul></p>',
        currentStatus: PublicationStatus.live,
        createdAt: '2022-01-23T15:51:42.523Z',
        updatedAt: '2022-01-25T15:51:42.523Z',
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
            "<p>In the past, many important people have given us a principle that can lead to improve the quality of life whit the respect of constraints of environmental sustainability. This principle is known as 'Golden Rule' , it is the synthesis of all universal ethical codes and analyzing the implications we can establish the following rights and duties valid for each person: 1)    Everyone has the right to live a higher quality life to a minimum. Who among us wants evil for himself? Who wants a life of misery and worry? It is therefore essential, in order not to fall into contradiction, to recognize this right to each individual. By minimum threshold we mean that the lowest standard of quality of life should be a goal to be set in constant improvement with the contribution of all. 2)    Everyone has the right to the preservation of their cultural identity and to respect for their personal dignity. If your family members have passed on certain values to you, would you be willing to change them if you were forced to?   Would you like to be insulted, mistreated, despised, avoided?   Nobody can claim the right to impose their habits on others, we need the utmost respect for peaceful coexistence. 3)    Everyone has the duty to undertake to maintain a minimum level of education. Culture is an essential element in order to live in accordance with the Golden Rule, in a society that seeks to live by this principle deepen the knowledge (of oneself and what surrounds us) is a personal responsibility of each of us. 4)    Everyone has the duty to undertake to respect and preserve the life and the balance of all life forms that have been established on the earth since its inception. Everything that has been written so far, the principles to which reference is made, are of universal validity and are directed to every single person, regardless of whether they are a member of an aboriginal tribe in Australia or an American citizen. Any group of people who claim to share these principles should have the following objectives in their governing bodies: 1) raise the minimum threshold of quality of life and the cultural level 2) to ensure social development in harmony with the natural balance existing 3) Establish and promote meritocratic systems for the benefit of the people who contribute most, through the provision of socially useful goods and services, to achieve the first two objectives. This objective aims at achieving the first two, through the activities that we will define as 'activities of production of goods and provision of socially useful services' that are all the only necessary to ensure a good level of quality of life in the context of a society based on the principles set out above. We will call a society that respects the Golden Rule a 'Reciprocal System' as opposed to the current 'Capitalist System' based on the principles we know well of competition and the free market. Ensuring a good level of quality of life for everyone means being free from everyday worries, so that you can dedicate yourself as much as possible to your inclinations, this should be one of the main objectives to be pursued globally. The main commitments for each of us should be : -  To produce value in the form of material goods and / or service of socially useful -  Increase your level of education (history, art, science, current events) -  Taking care of our environment, the biosphere, our only true wealth The production of material goods by means of our hands or machines, however produced by the hands of other individuals, plus the supply of both material and intellectual services, are the only human activities that give an added value useful for social development. Now we go on to analyze what are the human activities necessary to ensure a good level of quality of life. The categories of socially useful activities Here's an exhaustive list of the areas of socially useful activities divided into three groups: Areas of production of material goods: Agriculture, farms, Forestry, Food, Manufacturing, Handicraft, Construction, metallurgic, Mining, Mechanical, Chemical, Pharmaceutical, Textiles, Pulp and Paper, Plastic, Electronic, Automotive, Railways, Shipbuilding, Building Technology, Industrial Plant Engineering, Aeronautics, Aerospace . Areas of providing of material services : Health / Sports, Transportation, Environmental maintenance and monitoring, Public Policy, Resources Management (Water, Energy, Raw Materials),  Maintenance, Distribution of Goods, Catering, Hospitality and Tourism. Areas of providing intellectual services: Education, Research, Design (goods, services, software), International Cooperation, Justice, administrative. As you can see, all these items you will not find banks, credit systems and everything that is related to money because we have invented it to facilitate exchange in goods and services. Today the money is not part of the human needs. The use of money has had its usefulness in the past and has certainly contributed both to the level of actual development and the creation of all the problems of 'modern society'. But the real wealth is not tied to money, but to the production of goods and provision of the services listed, provided by each of us. For the same reasons there are no commercial activities or advertising activities, only the sector of activity for the distribution of material goods exists. Only the people who has give a personal contribution in one activities listed above, give a contribute to improvement to the life quality of all people. Each person should have a clear understanding of what the important things are, that is : 1) The environment in which we live (resources): nature will not adapt to our whims, we must be aware of the fact that we live in a closed system and in perfect balance (the biosphere) .The actual capitalist system, based on the continued growth and on the reckless use of resources, driving us quickly to the disaster. 2) Respect for our fellow human beings and all forms of life: you can not get on with arrogance, cunning used for the exploitation of others, rather it will be necessary to unite our minds in a common effort to overcome the challenges that the future holds for us. We need to replace the word 'competition' with the word 'cooperation' In fact, in a society based on the ethics of reciprocity, the personal profit, the competition as a means for survival, the desire to possess things, no longer any sense. I set out below the proposal to realize the Humanity Management System (HMS) : 1) Each person has their own Individual Social Value (ISV) which is calculated on the basis of two coefficients, cultural coefficient and environmental coefficient 2) Material goods and material services necessary to achieve the best level of quality of life (that have been listed above)  have been divided into two  subcategories: 2a) material goods 2a1)  material goods for personal use 2a2)  material goods for the production of material goods / material services / intellectual services 2b) material services 1b1)  material services for personal use 1b2)  material services for the production of material goods / material services / intellectual services Access to personal goods and services is regulated for each person by their own ISV. Only personal goods and services are considered in the calculus of ISV. Access to goods and services for productions is regulated according to own skills. We have QVmin (minimum level of Quality of Life) and QVmax (level of Quality of Life maximum). For the first time ISV is calculated starting from current personal assets. Personal assets remain yours as long as you are alive and can be passed on to the people you want. when someone produces / supplies a socially useful good / service his ISV will undergo a variation equal to : ISV = ISV +  V*(Kc+Kb)         if the good/service has been produced/supplied ISV = ISV -   V                        if the good/service has been received with the following limits             QVmin      <     ISV     <     QVmax where Kc       is the coefficient proportional to the culture for each person Kb       is the coefficient proportional to the good behavior towards the environment and towards other people V         is the globally standardized value of a given socially useful good/service, provided/produced by the single person or groups of person the values of Kc and Kb could be included in the range 0.5 ..10.0 This, in order to motivate people to increase their Kc and Kb coefficients. QVmin allows anyone to access essential goods and services QVmax allows access to all goods and services with the only limitation not to conflict with the golden rule The biggest difference between ISV and money is the fact that ISVs are not stackable, so you can't lock in resources for other people. In the following drawing you can find a possible structure of the database and the relationships between the various elements necessary for the realization of the HMS",
        currentStatus: PublicationStatus.live,
        createdAt: '2021-01-23T15:51:42.523Z',
        updatedAt: '2021-01-25T15:51:42.523Z',
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
            '<p>Draft hypothesis for Recognizing “reciprocal relations” to restore community access to land and water</p>',
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
            '<p>Many communities around the world are working to maintain, regain and restore intimate and embodied relationships with the places they inhabit, but these relations are contingent upon the level of community access to these places. Ribot and Peluso (2003) define access as “the ability to benefit from things—including material objects, persons, institutions and symbols,” with an emphasis on gaining the ability to benefit, rather than simply establishing the right to benefit (Ribot and Peluso 2003, 153). Changes in “social-relational mechanisms” (e.g. access to knowledge, authority, technology, markets, capital, or labor) can affect a community’s ability to access natural resources—even without a shift in formal rights (Ribot and Peluso 2003, 160). In this way, the theory of access offers important insights into the web of power relations shaping resource extraction, benefit distribution, and community resistance movements. However, the approach focuses primarily on human-centric benefits, and emphasizes benefit flows from nature/place to humans. Our conception of reciprocal relations extends Ribot and Peluso’s theory of access beyond unidirectional thinking, and toward a relational understanding of people and place. In summary, our reciprocal relations concept builds upon a range of multi-faceted human-environment relationships that challenge human-centric concepts of nature (e.g. Chan et al. 2016), emphasize the agency of nature including non-human beings and the landscape itself (e.g. Mitchell 2002; Haraway 2003; Cruikshank 2014), recognize Indigenous cosmologies and embedded kinship relations with the natural world (e.g. Deloria 2001; Turner 2005; Wilson 2008), and acknowledge the transformative power of experiencing the land through place attachment (e.g. Feld and Basso 1996). Our case analysis draws upon the multiple lenses discussed above: Indigenous epistemologies, natureculture, socionature, relational values, and sense of place scholarship. These perspectives converge on the idea of reciprocal relations based on mutual responsibilities between resources and people, where the flow of benefits is not uni-directional. Such insights further suggest that access may differ for those communities seeking to regain not simply benefits, but rather mutually beneficial relationships and responsibilities to land, water, and resources.</p>',
        currentStatus: PublicationStatus.live,
        createdAt: '2021-01-06T15:51:42.523Z',
        updatedAt: '2021-05-25T15:51:42.523Z',
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
            '<p>Nováček and Mederly (2015) present alterna-tive indicators to help measure societal develop-ment, described as follows:(i) Index of Sustainable Economic Welfare(ISEW), which aggregates personal con-sumption, social welfare, and the qualityof the environment, reﬂecting non-monetary gains and including the long-term consequences of a damagedenvironment.Quality of Life and Sustainable Development 5 (ii) Human Development Index (HDI), oftenpublished by the United States Develop-ment Program since 1990 to measure socialdevelopment and which encompasses thechanges of a long and healthy life, literacy,access to knowledge, and access toresources for a digniﬁed life.(iii) Dashboard of Sustainability, composed offour main areas –environmental, social,economic, and institutional.(iv) Environmental Sustainability Index (ESI),centered on ﬁve themes –the situation ofthe environment and its load, human depen-dency on and sensitivity to external inﬂu-ences, social capacity, institutionalcapacity, and participation in internationalcooperation.(v) Environmental Vulnerability Index (EVI),which aims at complementing indices forsocial and economic vulnerability, embrac-ing factors as climate change, biodiversity,water, agriculture and ﬁsheries, humanhealth, desertiﬁcation, and exposure to nat-ural disasters.(vi) Well-being of Nations, which accounts forhuman well-being and the stress ofecosystems.(vii) Living Planet Index (LPI), which trackstrends related to biological diversity onEarth.(viii) Ecological Footprint, which compares therate of consumption of natural resourcesagainst the capacity of biologically produc-tive areas on Earth.(ix) Happy Planet Index (HPI), which reportsthe average number of years of a happy lifeper unit of consumed natural resources, thatis, it assesses the efﬁciency with whichcountries transform natural resources intopopulation welfare, encompassing aspectssuch as ecological footprint, life satisfac-tion, and life expectancy.(x) Gross National Happiness (GNH), whichfocuses on the nonmaterial aspects of lifeand brings into question the spiritual devel-opment as a complement of material devel-opment, focusing on the promotion ofsustainable development, the preservation.</p>',
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
            '<p>Nováček and Mederly (2015) present alterna-tive indicators to help measure societal develop-ment, described as follows:(i) Index of Sustainable Economic Welfare(ISEW), which aggregates personal con-sumption, social welfare, and the qualityof the environment, reﬂecting non-monetary gains and including the long-term consequences of a damagedenvironment.Quality of Life and Sustainable Development 5 (ii) Human Development Index (HDI), oftenpublished by the United States Develop-ment Program since 1990 to measure socialdevelopment and which encompasses thechanges of a long and healthy life, literacy,access to knowledge, and access toresources for a digniﬁed life.(iii) Dashboard of Sustainability, composed offour main areas –environmental, social,economic, and institutional.(iv) Environmental Sustainability Index (ESI),centered on ﬁve themes –the situation ofthe environment and its load, human depen-dency on and sensitivity to external inﬂu-ences, social capacity, institutionalcapacity, and participation in internationalcooperation.(v) Environmental Vulnerability Index (EVI),which aims at complementing indices forsocial and economic vulnerability, embrac-ing factors as climate change, biodiversity,water, agriculture and ﬁsheries, humanhealth, desertiﬁcation, and exposure to nat-ural disasters.(vi) Well-being of Nations, which accounts forhuman well-being and the stress ofecosystems.(vii) Living Planet Index (LPI), which trackstrends related to biological diversity onEarth.(viii) Ecological Footprint, which compares therate of consumption of natural resourcesagainst the capacity of biologically produc-tive areas on Earth.(ix) Happy Planet Index (HPI), which reportsthe average number of years of a happy lifeper unit of consumed natural resources, thatis, it assesses the efﬁciency with whichcountries transform natural resources intopopulation welfare, encompassing aspectssuch as ecological footprint, life satisfac-tion, and life expectancy.(x) Gross National Happiness (GNH), whichfocuses on the nonmaterial aspects of lifeand brings into question the spiritual devel-opment as a complement of material devel-opment, focusing on the promotion ofsustainable development, the preservation.</p>',
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
            '<p>The assessment of quality of life faces barriers oftime, culture, and a variety of disciplines, as wellargued by Costanza et al. (2006). The authors alsoreport that quality of life is a function of the extentto which human needs are met and the relevance(or weight) of this need to the respondent. Theweighing of a speciﬁc need is subjected to varia-tions of context and time, principles, and relation-ships; for instance, a need will be moremeaningful when it is associated with more recentexperiences or when it is a part of a current phase,or when individuals or groups have others as astandard for comparison, according to a reviewdone by Costanza et al. (2006), based on the workof Schwartz and Strack (1999).It is possible to perceive that the deﬁnition ofquality of life reﬂects a rather dynamic and com-plex system, in a way, that it is fundamental tounderstand that needs may change across time inresponse to social, economic, and environmentalchanges.</p>',
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
            '<p>The assessment of quality of life faces barriers oftime, culture, and a variety of disciplines, as wellargued by Costanza et al. (2006). The authors alsoreport that quality of life is a function of the extentto which human needs are met and the relevance(or weight) of this need to the respondent. Theweighing of a speciﬁc need is subjected to varia-tions of context and time, principles, and relation-ships; for instance, a need will be moremeaningful when it is associated with more recentexperiences or when it is a part of a current phase,or when individuals or groups have others as astandard for comparison, according to a reviewdone by Costanza et al. (2006), based on the workof Schwartz and Strack (1999).It is possible to perceive that the deﬁnition ofquality of life reﬂects a rather dynamic and com-plex system, in a way, that it is fundamental tounderstand that needs may change across time inresponse to social, economic, and environmentalchanges.</p>',
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

    // User 3 Peer Reviews

    // Peer Review Live and Draft
    {
        id: 'publication-user-3-peer-review-1-live',
        title: 'Peer Review of Conclusions from the data on the use of asthma/COPD treatments in COVID-19',
        type: PublicationTypes.peerReview,
        content:
            '<p>Not a very in depth conclusion. Missing key themes from the research. Very basic summation of how the data affects this conclusion.</p>',
        currentStatus: PublicationStatus.live,
        user: {
            connect: {
                id: users.user3
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
                id: users.user3
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
    },
    // User 4 PROTOCOL and REAL WORLD APPLICATION

    // Protocol Live
    {
        id: 'publication-user-4-protocol-1-live',
        title: 'Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers (html)',
        type: PublicationTypes.protocol,
        content:
            '<p>To explain these trends in the morphing behavior, we regard the system as a network of interconnected slender beams that change their dimensions (diameter and length) and their Young modulus throughout the swelling process. For such a filament, the elastic energy is a sum of the stretching and bending energies</p><p>𝐸elastic(𝑟,𝐿0,𝐸)=&int;𝐿0012𝑘(𝑟,𝐿0,𝐸)(&part;𝑙&part;𝑙0&minus;1)2d𝑙0+&int;𝐿0012𝐵(𝑟,𝐸)(&part;𝜙&part;𝑙0)2d𝑙0Eelastic(r,L0,E)=&int;0L012k(r,L0,E)&part;l&part;l0&minus;12dl0+&int;0L012B(r,E)&part;ϕ&part;l02dl0</p><p>(2)where&nbsp;<em>E</em>&nbsp;is the Young modulus of the swollen polymer,&nbsp;<em>r</em>&nbsp;is the radius of the filament,&nbsp;<em>L</em><sub>0</sub>&nbsp;is the reference contour length of the filament before the deformation,&nbsp;<em>l</em><sub>0</sub>&nbsp;and&nbsp;<em>l</em>&nbsp;are the reference (rest length) and the deformed filament paths, ϕ is the local tangent angle, and&nbsp;&part;𝜙&part;𝑙0=&part;2𝑙&part;𝑙20&part;ϕ&part;l0=&part;2l&part;l02&nbsp;is the curvature of the filament.&nbsp;<em>k</em>&nbsp;and&nbsp;<em>B</em>&nbsp;are the stiffness and bending moduli, respectively, and are given by<sup>[</sup><sup><a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0042" id="adfm202111471-bib-0042R">42</a></sup><sup>]</sup></p><p>𝑘=𝐸𝜋𝑟2𝐿0,&emsp;𝐵=𝐸𝜋𝑟44k=E&pi;r2L0,&emsp;B=E&pi;r44</p><p>(3)Thus, the network structure imposes two intrinsic length scales: the filament radius&nbsp;<em>r</em>&nbsp;and the filament length,&nbsp;<em>L</em><sub>0</sub>, which is effectively determined by the fiber density in the network. These two length scales play a crucial role in determining the morphing behavior of the single filament and through the hierarchy, also determine the morphing behavior of the&nbsp;network.</p><p>Another energy term is related to the spatial overlap between the fibers. While fibers can buckle out of the network plane, fiber overlap along the plane was rarely exhibited experimentally, indicating overlap is highly unfavorable. Thus, the fiber overlap energy term was regarded as a Heaviside step function. For&nbsp;<em>d</em>&nbsp;⩽ 2<em>r</em>, where&nbsp;<em>d</em>&nbsp;is the distance between two fibers, the energy is high, and for&nbsp;<em>d</em>&nbsp;&gt; 2<em>r</em>&nbsp;the energy goes to&nbsp;zero.</p><p>Throughout the swelling process stresses are exerted on the edges constructing the network. If the stress exerted on an edge is larger than the critical Euler buckling stress given by</p><p>𝜎critical=𝜋2𝐸𝑟2𝐿20</p>',
        currentStatus: PublicationStatus.live,
        createdAt: '2020-04-30T16:51:42.523Z',
        updatedAt: '2020-05-15T16:51:42.523Z',
        user: {
            connect: {
                id: users.user4
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
                publicationTo: 'publication-user-1-hypothesis-1-live'
            }
        }
    },

    // Real World Application Live
    {
        id: 'publication-user-4-real-world-application-1-live',
        title: 'Conclusion to Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers (html)',
        type: PublicationTypes.realWorldApplication,
        content:
            '<h2>3 Conclusion</h2><p>The ability to tune the shape-morphing behavior of a hierarchical structure of mesoscale building blocks without changing the polymer itself, but only by changing the diameter of the filaments and the network architecture, provides a novel, versatile, and scalable strategy for the design and development of novel functional responsive materials with high spatial morphing resolutions and with unique morphing abilities. Such systems pave the way for soft synthetic micro-muscles and micro-actuators with high spatial resolutions. Owing to the small dimensions of the filaments, they also hold significant potential for morphing optic devices and tunable separators. Last, such systems demonstrate that hierarchical structures of mesoscale elements may induce unexpected mechanical behaviors and that the dimensions of these elements must be accounted for, whether when dealing with synthetic hydrogel fibers or when examining biological systems such as microtubules and actin&ndash;myosin&nbsp;networks.</p><h2>4 Experimental Section</h2><h4>Materials</h4><p><em>N</em>-isopropylacrylamide (NIPAAM) 99%, glycidyl methacrylate (GMA), and 2,2&prime;-Azobis (2-methylpropionitrile) (AIBN) were purchased from Alfa Aesar. Toluene (anhydrous, 99.8%), dimethylformamide (DMF), chloroform, dichloromethane (DCM), hexane, and tetraethylenepentamine (TEPA), poly[(m-pheneylenevinylene)-alt-(2,5-dihexyloxy-p-phenyleneviylene)] were purchased from Sigma-Aldrich. Diethyl ether and was purchased from BioLab. All the materials were used as bought, without further&nbsp;purification.</p><h4>Copolymer Synthesis</h4><p>The copolymer poly (<em>N</em>-isopropylacrylamide-co-glycidyl methacrylate) (PNcG) was synthesized using a radical polymerization through a modification of the procedure described by Xiaowei et&nbsp;al.<sup>[</sup><sup><a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0046" id="adfm202111471-bib-0046R">46</a></sup><sup>]</sup>&nbsp;In a typical synthesis, NIPAAm (6.0 g, 0.053 mol), GMA (0.145 mL, 1.060 mmol), and AIBN (50 mg, 0.304 mmol) were dissolved in 40 mL of toluene, under a purge of argon, and the monomers were allowed to polymerized at 70 &deg;C for 2 h in 100 mL three-neck flask. The solution was cooled down to room temperature and the solvent was evaporated using a rotary evaporator. The copolymer was then redissolved in DCM and was precipitated by slowly pouring 1 L of diethyl ether into the solution. The copolymer was filtered from the solution, dissolved in DCM and hexane (1:1 v/v). Then the solvent was evaporated using a rotary evaporator to yield a white powder. The product was dried under vacuum&nbsp;overnight.</p><h4>Networks Fabrication</h4><p>Fabrication of nano- to microscale fibers of PNIPPAm and its copolymers was demonstrated before using electrospinning.<sup>[</sup><sup><a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0031" id="adfm202111471-bib-0031R">31</a>,&nbsp;<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0047" id="adfm202111471-bib-0047R">47</a>-<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0049" id="adfm202111471-bib-0049R">49</a></sup><sup>]</sup>&nbsp;However, obtaining high enough jet stability for accurate jet-writing using electrospinning was not trivial and hence dry-spinning was chosen as a jetting method instead to improve the stability.<sup>[</sup><sup><a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0033" id="adfm202111471-bib-0033R">33</a>,&nbsp;<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0037" id="adfm202111471-bib-0037R">37</a>,&nbsp;<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0050" id="adfm202111471-bib-0050R">50</a>-<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0052" id="adfm202111471-bib-0052R">52</a></sup><sup>]</sup>&nbsp;In this approach, the copolymer and the multi-arm amine crosslinker TEPA were first mixed and dissolved in the appropriate solvent mixture to form a viscous solution. In a typical jetting solution PNIPAAm copolymer of 0.5&ndash;0.8 g mL<sup>&minus;1</sup>&nbsp;was prepared by dissolving the PNcG in a mixture of chloroform and DMF (1:1 v/v). 1&ndash;10% of TEPA was added just before the jetting process. At this range, the crosslinking was sufficient for preventing the dissolving of the copolymer in water, and yet there was a significant swelling of the hydrogel. Usually, trace amounts of the fluorescent polymeric dye were added to the solution to allow examination of the fibers in fluorescence microscopy. Next, the solution was dispensed via a metallic 23-gauge needle at a constant flow rate of 0.020 mL h<sup>&minus;1</sup>. Once a droplet was formed at the end of the capillary, it was mechanically pulled toward the rotating collector. The increase in surface area and the pulling process resulted in the evaporation of the solvents and in solidification into a thin fiber of mesoscale diameter. Once attached to the collector, the motion of the collector derived further pulling of the fiber. For the thin fibers (in average, fiber diameter &lt; 5 &mu;m), the tip-to-ground distance was 3 cm, and the rotating speed of the drum was 16&ndash;32 mm s<sup>&minus;1</sup>. The linear motion stage velocity was 1.15 mm s<sup>&minus;1</sup>. For the thick fibers (fiber diameter &gt;5 &mu;m), the tip-to-ground distance was 1 cm, and rotating speed of the drum was 1&ndash;5 mm s<sup>&minus;1</sup>. The linear motion stage velocity was 0.2 mm s<sup>&minus;1</sup>. For a drum with a radius&nbsp;<em>R</em><sub>d</sub>&nbsp;and an angular velocity of &omega;<sub>d</sub>, positioned on a stage moving at a velocity&nbsp;<em>V</em><sub>s</sub>&nbsp;in perpendicular to the drum rotation, the distance between the parallel fibers is given by&nbsp;<em>V</em><sub>s</sub>/(<em>R</em><sub>d</sub>&nbsp;&middot; &omega;<sub>d</sub>), and hence, for a given rotation speed, the distance between the fibers was controlled by the velocity of the moving&nbsp;stage.</p><p>To construct the networks, the fibers were collected on a plastic frame that was attached to a rotating drum positioned on top of a moving stage. At the first stage, fibers were pulled by the rotating drum along the direction of the rotation and perpendicular to the motion of the moving stage. The diameter of the fibers was determined by the drum velocity and by the polymer concentration of the jetting solution. The distance between the fibers was dictated by the rotation speed of the drum and the velocity of the moving&nbsp;stage.</p><p>Once the fibers were jetted along the entire plastic frame, the frame was detached from the rotating drum and reattached after rotating it by a specific angle. For constructing Cartesian networks the frame was rotated by an angle of 90&deg;, and the jet writing of parallel fibers was repeated to obtain the final network structure. The crossing points of the fibers were defined as the nodes of the network and segment of the fiber connecting two nodes as an edge. The crosslinking of the copolymer was performed post-fabrication of the network by baking it at 70&nbsp;&deg;C overnight. The experimental setup contained a syringe pump (New Era), a linear motion stage (ILS-200LM, Newport), a eight-axis universal controller (XPS-D8, Newport), and a rotating drum&nbsp;collector.</p><h4>Instrumentation</h4><p><sup>1</sup>H-nuclear magnetic resonance spectra was recorded on Bruker Avance III 400 MHz spectrometers. The copolymer was dissolved in deuterated chloroform as a solvent. The chemical shifts were reported in ppm and referenced to the solvent. Gel permeation chromatography measurements were performed on Viscotek GPCmax by Malvern. Scanning electron microscopy (SEM) was performed using a Quanta 200FEG environmental SEM in a high vacuum, WD 10 mm, 12.5&ndash;20 kV. All images and videos were taken by Olympus, IX73 microscope equipped with a heating glass slide (LCI, CU-301).</p><h4>Modeling</h4><p>All models presented in the article were written in Matlab according to the equations&nbsp;described within the&nbsp;text.</p><h2>Acknowledgements</h2><p>The authors would like to thank Prof. Michael Urbakh and Prof. Oded Hod for the insightful discussions A.S. acknowledges the generous support from the Azrieli Foundation. S.Z.S. and N.E.-P. acknowledge the generous support of The Shulamit Aloni Scholarship for Advancing Women in Exact Science and Engineering, provided by The Ministry of Science Technology, Israel. The authors acknowledge the Chaoul Center for Nanoscale Systems of Tel Aviv University for the use of instruments and staff assistance, and the Mechanical Workshop for Research and Development, School of Chemistry, Tel Aviv University, for their help in constructing the fabrication&nbsp;devices.</p><ol></ol><h2>Conflict of Interest</h2><p>The authors declare no conflict of&nbsp;interest.</p>',
        currentStatus: PublicationStatus.live,
        createdAt: '2020-10-20T16:51:42.523Z',
        updatedAt: '2020-11-17T16:51:42.523Z',
        user: {
            connect: {
                id: users.user4
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
    // User 5 PROTOCOL and ANALYSIS

    // Protocol Live
    {
        id: 'publication-user-5-protocol-1-live',
        title: 'Relationships between the trace element composition of sedimentary rocks and upper continental crust (html)',
        type: PublicationTypes.protocol,
        content:
            '<p>Table 1.&nbsp;Selected Trace Elements for Estimates of Various Shield Areas and the Average Upper Continental Crust</p><table><thead><tr><th>Element, ppm</th><th>Canadian Shield: Shaw<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0001_16" id="ggge86-note-0001_16-controller" title="Link to note"><sup>a</sup></a></th><th>Canadian Shield: Eade and Fahrig<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0002_17" id="ggge86-note-0002_17-controller" title="Link to note"><sup>b</sup></a></th><th>East China<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0003_18" id="ggge86-note-0003_18-controller" title="Link to note"><sup>c</sup></a></th><th>Scotland<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0004_19" id="ggge86-note-0004_19-controller" title="Link to note"><sup>d</sup></a></th><th>New Mexico<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0005_20" id="ggge86-note-0005_20-controller" title="Link to note"><sup>e</sup></a></th><th>Colorado<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0006_21" id="ggge86-note-0006_21-controller" title="Link to note"><sup>f</sup></a></th><th>Baltic Shield<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0007_22" id="ggge86-note-0007_22-controller" title="Link to note"><sup>g</sup></a></th><th>Ukranian Shield<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0008_23" id="ggge86-note-0008_23-controller" title="Link to note"><sup>h</sup></a></th><th>Anabar Shield<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0009_24" id="ggge86-note-0009_24-controller" title="Link to note"><sup>i</sup></a></th><th>Average Shield<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0010_25" id="ggge86-note-0010_25-controller" title="Link to note"><sup>j</sup></a></th><th>Average Shield (Area)<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0011_26" id="ggge86-note-0011_26-controller" title="Link to note"><sup>k</sup></a></th><th>Upper Crust<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0012_27" id="ggge86-note-0012_27-controller" title="Link to note"><sup>l</sup></a></th></tr></thead><tbody><tr><td>Sc</td><td>7.0</td><td>12</td><td>15</td><td>&nbsp;</td><td>&nbsp;</td><td>16</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>12</td><td>10.3</td><td>11</td></tr><tr><td>Ti</td><td>3120</td><td>3180</td><td>3900</td><td>2400</td><td>2700</td><td>4200</td><td>3000</td><td>3000</td><td>4800</td><td>3400</td><td>3200</td><td>3000</td></tr><tr><td>V</td><td>53</td><td>59</td><td>98</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>70</td><td>62</td><td>60</td></tr><tr><td>Cr</td><td>35</td><td>76</td><td>80</td><td>&lt;50</td><td>19</td><td>82</td><td>60</td><td>43</td><td>72</td><td>58</td><td>59</td><td>35</td></tr><tr><td>Co</td><td>12</td><td>&nbsp;</td><td>17</td><td>35</td><td>8</td><td>17</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>18</td><td>13</td><td>10</td></tr><tr><td>Ni</td><td>19</td><td>19</td><td>38</td><td>25</td><td>13</td><td>43</td><td>25</td><td>27</td><td>33</td><td>27</td><td>23</td><td>20</td></tr><tr><td>Rb</td><td>110</td><td>&nbsp;</td><td>82</td><td>85</td><td>187</td><td>72</td><td>77</td><td>125</td><td>63</td><td>100</td><td>99</td><td>112</td></tr><tr><td>Zr</td><td>237</td><td>190</td><td>188</td><td>135</td><td>180</td><td>148</td><td>117</td><td>154</td><td>197</td><td>172</td><td>186</td><td>190</td></tr><tr><td>Nb</td><td>26</td><td>&nbsp;</td><td>12</td><td>4</td><td>&nbsp;</td><td>9.1</td><td>&nbsp;</td><td>11</td><td>10</td><td>12</td><td>(23)</td><td>25</td></tr><tr><td>Cs</td><td>&nbsp;</td><td>&nbsp;</td><td>3.55</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3.6</td><td>3.6</td><td>3.7</td></tr><tr><td>Ba</td><td>1070</td><td>730</td><td>678</td><td>795</td><td>590</td><td>749</td><td>420</td><td>701</td><td>775</td><td>723</td><td>754</td><td>550</td></tr><tr><td>La</td><td>32.3</td><td>71</td><td>34.8</td><td>55</td><td>43</td><td>27</td><td>23</td><td>45</td><td>32</td><td>40</td><td>(43)</td><td>30</td></tr><tr><td>Hf</td><td>5.8</td><td>&nbsp;</td><td>5.12</td><td>&nbsp;</td><td>&nbsp;</td><td>4.4</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>5.1</td><td>5.7</td><td>5.8</td></tr><tr><td>Ta</td><td>5.7</td><td>&nbsp;</td><td>0.74</td><td>&nbsp;</td><td>&nbsp;</td><td>0.67</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&hellip;</td><td>&hellip;</td><td>2.2</td></tr><tr><td>Pb</td><td>17</td><td>18</td><td>18</td><td>&nbsp;</td><td>&nbsp;</td><td>14</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>17</td><td>18</td><td>20</td></tr><tr><td>Th</td><td>10.3</td><td>10.8</td><td>8.95</td><td>&nbsp;</td><td>13</td><td>6.2</td><td>7.9</td><td>14</td><td>&nbsp;</td><td>10.2</td><td>9.8</td><td>10.7</td></tr><tr><td colspan="13">&nbsp;</td></tr><tr><td>Area, 10<sup>6</sup>km<sup>2</sup></td><td>5.56</td><td>&nbsp;</td><td>&nbsp;</td><td>0.95</td><td>0.01</td><td>0.05</td><td>0.02</td><td>2.16</td><td>0.20</td><td>0.06</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><ul><li>a&nbsp;Average Canadian Shield values from&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0050" id="#ggge86-bib-0050R"><em>Shaw et al.</em>&nbsp;[1967</a>,&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0051" id="#ggge86-bib-0051R">1976</a>,&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0052" id="#ggge86-bib-0052R">1986]</a>.</li><li>&nbsp;</li><li>b&nbsp;Average Candian Shield values from&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0014" id="#ggge86-bib-0014R"><em>Fahrig and Eade</em>&nbsp;[1968]</a>&nbsp;and&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0012" id="#ggge86-bib-0012R"><em>Eade and Fahrig</em>&nbsp;[1971</a>,&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0013" id="#ggge86-bib-0013R">1973]</a>.</li><li>&nbsp;</li><li>c&nbsp;Average central East China calculated on carbonate-free basis [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0021" id="#ggge86-bib-0021R"><em>Gao et al.</em>, 1998</a>].</li><li>&nbsp;</li><li>d&nbsp;Average of crystalline basement NW Scotland Highlands [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0007" id="#ggge86-bib-0007R"><em>Bowes</em>, 1972</a>].</li><li>&nbsp;</li><li>e&nbsp;Average Precambrian surface terrane, New Mexico [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0009" id="#ggge86-bib-0009R"><em>Condie and Brookins</em>, 1980</a>].</li><li>&nbsp;</li><li>f&nbsp;Average of Colorado Plateau upper crust derived from equal proportions of northwest and southeast sections [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0010" id="#ggge86-bib-0010R"><em>Condie and Selverstone</em>, 1999</a>].</li><li>&nbsp;</li><li>g&nbsp;Average Baltic Shield (reported by&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0006" id="#ggge86-bib-0006R"><em>Borodin</em>&nbsp;[1999]</a>).</li><li>&nbsp;</li><li>h&nbsp;Average Ukranian Shield (reported by&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0006" id="#ggge86-bib-0006R"><em>Borodin</em>&nbsp;[1999]</a>).</li><li>&nbsp;</li><li>i&nbsp;Average Anabar Shield (reported by&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0006" id="#ggge86-bib-0006R"><em>Borodin</em>&nbsp;[1999]</a>).</li><li>&nbsp;</li><li>j&nbsp;Average shield derived from simple average of the Canadian Shield to the Anbar Shield columns.</li><li>&nbsp;</li><li>k&nbsp;Average shield derived from weighted average by area of the Canadian Shield (average of both Shaw and Eade and Fahrig) to the Anbar Shield. Areas are taken from&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0026" id="#ggge86-bib-0026R"><em>Goodwin</em>&nbsp;[1991]</a>. Note that La = 31 ppm if Canadian Shield values from Eade and Fahrig are excluded, Nb = 11 ppm if Canadian Shield from Shaw and Scotland are excluded, and Ta is not calculated owing to highly variable values.</li><li>&nbsp;</li><li>l&nbsp;Average upper continental crust [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0057" id="#ggge86-bib-0057R"><em>Taylor and McLennan</em>, 1985</a>].</li></ul><p>Table 2.&nbsp;Selected Estimates of the Average Composition of the Upper Continental Crust</p><table><thead><tr><th>Element (ppm)</th><th>Condie &ldquo;Map&rdquo;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0013_43" id="ggge86-note-0013_43-controller" title="Link to note"><sup>a</sup></a></th><th>Condie &ldquo;Restoration&rdquo;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0014_44" id="ggge86-note-0014_44-controller" title="Link to note"><sup>b</sup></a></th><th>Gaillardet et al.<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0015_45" id="ggge86-note-0015_45-controller" title="Link to note"><sup>c</sup></a></th><th>Togashi et al.<sup>d</sup></a></th><th>Wedepohl<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0017_47" id="ggge86-note-0017_47-controller" title="Link to note"><sup>e</sup></a></th><th>Plank &amp; Langmuir<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0018_48" id="ggge86-note-0018_48-controller" title="Link to note"><sup>f</sup></a></th><th>Borodin<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0019_49" id="ggge86-note-0019_49-controller" title="Link to note"><sup>g</sup></a></th><th>Taylor and McLennan<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0020_50" id="ggge86-note-0020_50-controller" title="Link to note"><sup>h</sup></a></th><th>Upper Crust<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-note-0021_51" id="ggge86-note-0021_51-controller" title="Link to note"><sup>i</sup></a></th></tr></thead><tbody><tr><td>Sc</td><td>13.3</td><td>13.4</td><td>10.5</td><td>16</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>11</td><td>13.6</td></tr><tr><td>Ti</td><td>3300</td><td>3200</td><td>&nbsp;</td><td>3700</td><td>&nbsp;</td><td>4555</td><td>3600</td><td>3000</td>d>4100</td></tr><tr><td>V</td><td>86</td><td>86</td><td>&nbsp;</td><td>110</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>60</td><td>107</td></tr><tr><td>Cr</td><td>104</td><td>112</td><td>74</td><td>84</td><td>&nbsp;</td><td>&nbsp;</td><td>47</td><td>35</td><td>83</td></tr><tr><td>Co</td><td>18</td><td>18</td><td>13</td><td>15</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>10</td><td>17</td></tr><tr><td>Ni</td><td>56</td><td>60</td><td>50</td><td>38</td><td>&nbsp;</td><td>&nbsp;</td><td>21</td><td>20</td><td>44</td></tr><tr><td>Rb</td><td>83</td><td>87</td><td>108</td><td>85</td><td>&nbsp;</td><td>&nbsp;</td><td>108</td><td>112</td><td>(112)</td></tr><tr><td>Zr</td><td>160</td><td>162</td><td>89</td><td>135</td><td>&nbsp;</td><td>&nbsp;</td><td>175</td><td>190</td><td>(190)</td></tr><tr><td>Nb</td><td>9.8</td><td>10.3</td><td>&nbsp;</td><td>9</td><td>&nbsp;</td><td>13.7</td><td>12</td><td>25</td><td>12</td></tr><tr><td>Cs</td><td>&nbsp;</td><td>&nbsp;</td><td>2.7</td><td>5.5</td><td>5.8</td><td>7.3</td><td>&nbsp;</td><td>3.7</td><td>4.6</td></tr><tr><td>Ba</td><td>633</td><td>626</td><td>630</td><td>458</td><td>668</td><td>&nbsp;</td><td>705</td><td>550</td><td>(550)</td></tr><tr><td>La</td><td>28.4</td><td>29.0</td><td>29.7</td><td>21.7</td><td>&nbsp;</td><td>&nbsp;</td><td>33</td><td>30</td><td>(30)</td></tr><tr><td>Hf</td><td>4.3</td><td>4.4</td><td>2.1</td><td>4.1</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>5.8</td><td>(5.8)</td></tr><tr><td>Ta</td><td>0.79</td><td>0.82</td><td>0.9</td><td>0.72</td><td>1.5</td><td>0.96</td><td>&nbsp;</td><td>2.2</td><td>1.0</td></tr><tr><td>Pb</td><td>17</td><td>18</td><td>17.9</td><td>16.9</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>20</td><td>17</td></tr><tr><td>Th</td><td>8.6</td><td>9.1</td><td>8.8</td><td>8.3</td><td>&nbsp;</td><td>&nbsp;</td><td>11</td><td>10.7</td><td>(10.7)</td></tr></tbody></table><ul><li>a&nbsp;Average upper continental crust from &ldquo;map model&rdquo; of major upper crustal lithologies [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0008" id="#ggge86-bib-0008R"><em>Condie</em>, 1993</a>].</li><li>&nbsp;</li><li>b&nbsp;Average upper continental crust from &ldquo;resoration model,&rdquo; where eroded crust is accounted for [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0008" id="#ggge86-bib-0008R"><em>Condie</em>, 1993</a>].</li><li>&nbsp;</li><li>c&nbsp;Average upper crust in Central African Shield derived from &ldquo;corrected&rdquo; river suspended sediment in Congo River system [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0016" id="#ggge86-bib-0016R"><em>Gaillardet et al.</em>, 1995</a>].</li><li>&nbsp;</li><li>d&nbsp;Average upper crust for the Japan Arc based on mapped lithological balances [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0060" id="#ggge86-bib-0060R"><em>Togashi et al.</em>, 2000</a>].</li><li>&nbsp;</li><li>e&nbsp;Average upper crust for elements not taken from&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0052" id="#ggge86-bib-0052R"><em>Shaw et al.</em>&nbsp;[1986]</a>&nbsp;[<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0065" id="#ggge86-bib-0065R"><em>Wedepohl</em>, 1995</a>]. Cs derived from Rb/Cs = 19 [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0032" id="#ggge86-bib-0032R"><em>McDonough et al.</em>, 1992</a>] and&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0052" id="#ggge86-bib-0052R"><em>Shaw et al.</em>&nbsp;[1986]</a>&nbsp;Rb value; Ta derived from Nb/Ta = 17.5 and&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0052" id="#ggge86-bib-0052R"><em>Shaw et al.</em>&nbsp;[1986]</a>&nbsp;Nb value.</li><li>&nbsp;</li><li>f&nbsp;Upper continental crust derived from marine sedimentary record [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0046" id="#ggge86-bib-0046R"><em>Plank and Langmuir</em>, 1998</a>].</li><li>&nbsp;</li><li>g&nbsp;Upper continental crust estimated by weighting average shields (70%) and average granitoid rock (30%) [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0006" id="#ggge86-bib-0006R"><em>Borodin</em>, 1999</a>].</li><li>&nbsp;</li><li>h&nbsp;Average upper crust [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0057" id="#ggge86-bib-0057R"><em>Taylor and McLennan</em>, 1985</a>].</li><li>&nbsp;</li><li>i&nbsp;Average upper continental crust derived from sedimentary record for this study. Elements that are unchanged from&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0057" id="#ggge86-bib-0057R"><em>Taylor and McLennan</em>&nbsp;[1985]</a>&nbsp;are shown in parentheses.</li></ul><h2>3. Sedimentary Rocks and Upper Crustal Compositions</h2><p>[5]&nbsp;The notion that sediments could be used to estimate average igneous compositions at the Earth&#39;s surface was first suggested by V. M. Goldschmidt (see discussion by&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0025" id="#ggge86-bib-0025R"><em>Goldschmidt</em>&nbsp;[1954</a>, pp. 53&ndash;56]), and using sedimentary data to derive upper crustal REE abundances was pioneered by S. R. Taylor [e.g.,&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0053" id="#ggge86-bib-0053R"><em>Taylor</em>, 1964</a>,&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0055" id="#ggge86-bib-0055R">1977</a>;&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0029" id="#ggge86-bib-0029R"><em>Jakes and Taylor</em>, 1974</a>;&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0040" id="#ggge86-bib-0040R"><em>Nance and Taylor</em>, 1976</a>,&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0041" id="#ggge86-bib-0041R">1977</a>;&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0036" id="#ggge86-bib-0036R"><em>McLennan et al.</em>, 1980</a>;&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0056" id="#ggge86-bib-0056R"><em>Taylor and McLennan</em>, 1981</a>,&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0057" id="#ggge86-bib-0057R">1985</a>]. Goldschmidt used glacial sediments to estimate the major element composition of average igneous rocks because such sediment is dominated by mechanical rather than chemical processes. However, modern studies have used shale compositions to estimate upper crustal trace element abundances (TM85). This is because shales completely dominate the sedimentary record [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0022" id="#ggge86-bib-0022R"><em>Garrels and Mackenzie</em>, 1971</a>], constituting up to 70% of the stratigraphic record (depending on the method of estimating), and because most trace elements are enriched in shales compared to most other sediment types. The result is that shales dominate the sedimentary mass balance for all but a few trace elements.</p>',
        currentStatus: PublicationStatus.live,
        createdAt: '2021-04-30T16:51:42.523Z',
        updatedAt: '2021-09-13T16:51:42.523Z',
        user: {
            connect: {
                id: users.user5
            }
        },
        publicationStatus: {
            create: [
                {
                    status: PublicationStatus.draft,
                    createdAt: '2021-09-20T16:51:42.523Z'
                },
                {
                    status: PublicationStatus.live,
                    createdAt: '2021-09-24T18:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-user-1-hypothesis-1-live'
            }
        }
    },

    // Analysis Live
    {
        id: 'publication-user-5-analysis-1-live',
        title: 'Implications for the Bulk Continental Crust and Lower Crust (html)',
        type: PublicationTypes.analysis,
        content:
            '<p>[54]&nbsp;In the model of crustal composition proposed by TM85 the lower crustal composition is derived by assuming the upper crust constitutes &sim;25% of the total continental crust. Accordingly, any revision to upper crustal abundances has an effect on estimates of the lower continental crust.</p><p>[55]&nbsp;In the case of Cs, this leads to difficulties in that the elevated upper crustal Cs proposed here (Cs = 4.6 ppm) when combined with the bulk crustal estimate of TM85 (Cs = 1.0 ppm) creates mass balance difficulties for the lower crust, assuming it constitutes &sim;75% of the total. Accordingly, the bulk crustal abundances of the most incompatible elements (Cs, Rb, K, Th, and U) require reevaluation [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0039" id="#ggge86-bib-0039R"><em>McLennan et al.</em>, 2001</a>].&nbsp;<em>McLennan and Taylor</em>&nbsp;[1996] suggested that the continental heat flow data were consistent with slightly higher bulk crustal abundances for K, Th, and U compared to those suggested by TM85 and proposed K = 1.1%, Th = 4.2 ppm, and U = 1.1 ppm. Maintaining a bulk crustal K/Rb ratio of &sim;300, this also suggests that the bulk crustal Rb content should be revised slightly upward to 37 ppm. The bulk crustal TM85 Cs estimate came from an assumed crustal Rb/Cs ratio of 30. The bulk crustal composition of TM85 is based to a large degree on Archean crustal compositions, but there are in fact very few high-quality Cs data for Archean rocks. For example, Cs data are absent from the most recent compilation of Archean igneous rock compositions [<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0008" id="#ggge86-bib-0008R"><em>Condie</em>, 1993</a>]. If the average island arc volcanic rock Rb/Cs of 25 is adopted instead (from&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0057" id="#ggge86-bib-0057R"><em>Taylor and McLennan</em>&nbsp;[1985]</a>; note&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0032" id="#ggge86-bib-0032R"><em>McDonough et al.</em>&nbsp;[1992]</a>&nbsp;obtained the same bulk crust Rb/Cs ratio using a different approach), this leads to a revised bulk crustal Cs content of 1.5 ppm, a value adopted here. Note that this Rb/Cs ratio is also very close to the clastic sedimentary Rb/Cs ratio of 24, discussed above. These revisions result in lower crustal abundances of Cs = 0.47 ppm and Rb = 12 ppm.</p><p>[56]&nbsp;In calculating the Nb and Ta abundances of the bulk crust,&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0057" id="#ggge86-bib-0057R"><em>Taylor and McLennan</em>&nbsp;[1985]</a>&nbsp;relied on average Phanerozoic island arc volcanics because there were few relevant data from Archean rocks. This situation has changed, and recently,&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0008" id="#ggge86-bib-0008R"><em>Condie</em>&nbsp;[1993]</a>&nbsp;compiled Nb and Ta concentrations for the dominant Archean igneous lithologies. For the model proposed by TM85 these data suggest a slight downward revision of bulk crustal abundances for these elements, such that Nb = 8 ppm and Ta = 0.8 ppm, resulting in calculated lower crustal abundances of Nb = 6.7 ppm and Ta = 0.73 ppm. In&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-tbl-0005" title="Link to table">Table 5</a>, all of the revisions to the crustal abundances of TM85 that are suggested here as well as by&nbsp;<em>McLennan and Taylor</em>&nbsp;[1996] and&nbsp;<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2000GC000109#ggge86-bib-0039" id="#ggge86-bib-0039R"><em>McLennan et al.</em>&nbsp;[2001]</a>&nbsp;are summarized.</p>',
        currentStatus: PublicationStatus.live,
        createdAt: '2021-09-25T16:51:42.523Z',
        updatedAt: '2021-09-25T16:51:42.523Z',
        user: {
            connect: {
                id: users.user5
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
                publicationTo: 'publication-user-5-protocol-1-live'
            }
        }
    }
];
export default newPublicationSeeds;
