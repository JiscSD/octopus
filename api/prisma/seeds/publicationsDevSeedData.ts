import { Prisma } from '@prisma/client';

// user 1 = <cite>This material is adapted from the following article under the Creative Commons Attribution 3.0 License: M M Yusoff 2020 IOP Conf. Ser.: Earth Environ. Sci. 561 012020. <a href="https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020">https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020</cite>

// user 4 = <cite>This material is adapted from the following article under the Attribution-NonCommercial 4.0 International: Sharabani S. Z., Edelstein-Pardo N., Molco M.,Bachar Schwartz N. B., Morami M., Sivan A., Gendelman Rom Y., Evental R., Flaxer E., Sitt A., 2022. Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers. Advanced Functional Materials. <a href="https://onlinelibrary.wiley.com/doi/10.1002/adfm.202111471">https://onlinelibrary.wiley.com/doi/10.1002/adfm.202111471</cite>

// user 5 = <cite>This material is adapted from the following article under the CC BY-NC: Freeman AL, Parker S, Noakes C, Fitzgerald S, Smyth A, Macbeth R, Spiegelhalter D, Rutter H. Expert elicitation on the relative importance of possible SARS-CoV-2 transmission routes and the effectiveness of mitigations. BMJ Open. 2021 Dec 1;11(12):e050869. <a href="https://pubmed.ncbi.nlm.nih.gov/34853105/">https://pubmed.ncbi.nlm.nih.gov/34853105/</cite>

// user 6 = <cite>This material is adapted from the following article under the Attribution 4.0 International: Hesse, Nicole, 2021. Visible winds: The production of new visibilities of wind energy in West Germany, 1973–1991. Centaurus 63:4. <a href="https://onlinelibrary.wiley.com/doi/10.1111/1600-0498.12420/">https://onlinelibrary.wiley.com/doi/10.1111/1600-0498.12420</cite>

const users = {
    user1: 'test-user-1b-victoria-allen',
    user2: 'test-user-2b-rami-salem',
    user3: 'test-user-3-aoi-han',
    user4: 'test-user-4-juan-garcia',
    user5: 'test-user-5-amelia-lucas',
    user6: 'test-user-6-grace-murphy',
    user7: 'test-user-7-oliver-smith'
};

const newPublicationSeeds: Prisma.PublicationCreateInput[] = [
    {
        id: 'publication-user-1-problem-1-live',
        doi: '10.82259/publication-user-1-problem-1-live',
        type: 'PROBLEM',
        versions: {
            create: {
                id: 'publication-user-1-problem-1-live-v1',
                versionNumber: 1,
                title: 'What is the connection between human needs and sustainable development?',
                conflictOfInterestStatus: true,
                conflictOfInterestText: 'This publication has a conflict of interest with The University of...',
                content:
                    '<p>what is the connection between human needs and sustainable development? There are four dimensions to sustainable development derived from Bruntland Report: society – satisfying basic human needs, environment – long term ecological sustainability, culture and economy – which are linked collectively. Besides, sustainable development is robustly linked to the quality of life of the society – it is about whether the social, environmental systems and economic activities that build up the community are providing a healthy and significant life for all the current living society and future.</p><cite>This material is adapted from the following article under the Creative Commons Attribution 3.0 License: M M Yusoff 2020 IOP Conf. Ser.: Earth Environ. Sci. 561 012020. <a href="https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020">https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2020-05-22T15:51:42.523Z',
                description:
                    'Description: There are four dimensions to sustainable development derived from Bruntland Report',
                keywords: ['science', 'technology'],
                createdAt: '2020-05-22T15:51:42.523Z',
                updatedAt: '2020-05-22T15:51:42.523Z',
                user: { connect: { id: users.user1 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-25T16:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-1-problem-2-draft',
        doi: '10.82259/publication-user-1-problem-2-draft',
        type: 'PROBLEM',
        linkedTo: { create: { publicationTo: 'publication-user-1-problem-1-live' } },
        versions: {
            create: {
                id: 'publication-user-1-problem-2-draft-v1',
                versionNumber: 1,
                title: 'What is the connection between human needs and sustainable development?',
                conflictOfInterestStatus: false,
                content: 'Content goes here',
                currentStatus: 'DRAFT',
                description:
                    'Description for the problem of What is the connection between human needs and sustainable development?',
                keywords: ['science', 'technology'],
                user: { connect: { id: users.user1 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] },
                coAuthors: {
                    create: [
                        {
                            email: 'example_1@jisc.ac.uk',
                            code: 'random_bad_code_not_needed',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-26-co-author-1'
                        },
                        {
                            email: 'example_2@jisc.ac.uk',
                            code: 'random_bad_code_not_needed',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-27-co-author-2'
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-1-hypothesis-1-live',
        doi: '10.82259/publication-user-1-hypothesis-1-live',
        type: 'HYPOTHESIS',
        linkedTo: { create: { publicationTo: 'publication-user-1-problem-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-1-hypothesis-1-live-v1',
                versionNumber: 1,
                title: 'Hypothesis of Improving the quality of life for sustainable development',
                conflictOfInterestStatus: true,
                conflictOfInterestText: 'This publication does have a conflict of interest...',
                content:
                    '<h2>Abstract</h2><p>Development will grant people with a new form of living security and hope. Besides, one of the major objectives for development is to ensure that the society who lives will experience a good quality of life by managing to fulfil the human needs. There are two central needs by inhabitants\'; first, the biological needs that are essential to the survival of the society and second, cultural requirements that are necessary for the functioning and growth of the residents of the development area. In order to fulfil the human needs, development has become an important tool to deliver the requirement of the society. However, intense development generates many demands on natural environment. Development is often cited as one of the major agent that has led to the transformation of the four main components of the natural environment -- land, water, air and biological aspects. Besides, developments often embark on a chain of result of environmental systems disruptions and ecological damage. In addition, if these requirements of human needs cannot be fulfilled or is below the minimum input, this situation tends to lead to the vulnerability of the society. Conflict between human needs and environmental sustainability has guided many authorities to engage sustainable development concept for the development planning. The concept of sustainable development was described by the 1987 Bruntland Commission Report as "development that meets the needs of the present without compromising the ability of future generations to meet their own needs." Sustainable development is regarded as understanding the strength and links among the human needs and the environment. Improving quality of life of the society is the key for sustainable development. Thus, in order to improve quality of life appreciating the potential of development area such as improves land utilization; efficient use of resources as well as creating more opportunities to the society will be the catalyst to achieve sustainable development.</p> <cite>This material is adapted from the following article under the Creative Commons Attribution 3.0 License: M M Yusoff 2020 IOP Conf. Ser.: Earth Environ. Sci. 561 012020. <a href="https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020">https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2021-03-13T15:51:42.523Z',
                description: 'Description: Development will grant people with a new form of living security and hope.',
                keywords: ['science', 'technology'],
                createdAt: '2021-03-13T15:51:42.523Z',
                updatedAt: '2021-03-13T15:51:42.523Z',
                user: { connect: { id: users.user1 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-22T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-27T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-1-hypothesis-2-draft',
        doi: '10.82259/publication-user-1-hypothesis-2-draft',
        type: 'HYPOTHESIS',
        linkedTo: { create: { publicationTo: 'publication-user-1-problem-1-live' } },
        versions: {
            create: {
                id: 'publication-user-1-hypothesis-2-draft-v1',
                versionNumber: 1,
                title: 'Draft Hypothesis of Improving the quality of life for sustainable development',
                conflictOfInterestStatus: true,
                conflictOfInterestText: 'This publication has a conflict of interest with The University of...',
                content: '<p>Draft Hypothesis of Improving the quality of life for sustainable development</p>',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user1 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] },
                coAuthors: {
                    create: [
                        {
                            email: 'example_1@jisc.ac.uk',
                            code: 'random_bad_code_not_needed',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-26-co-author-1'
                        },
                        {
                            email: 'example_2@jisc.ac.uk',
                            code: 'random_bad_code_not_needed',
                            confirmedCoAuthor: false,
                            linkedUser: 'test-user-27-co-author-2'
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-1-protocol-1-live',
        doi: '10.82259/publication-user-1-protocol-1-live',
        type: 'PROTOCOL',
        linkedTo: { create: { publicationTo: 'publication-user-1-hypothesis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-1-protocol-1-live-v1',
                versionNumber: 1,
                title: 'Protocol of Improving the quality of life for sustainable development',
                content:
                    '<h2>Introduction</h2><p>Sustainable development is an initiative plan advised by the United Nation for the remarkable futurenation. In common words sustainable development is defined as: ‘meeting the needs of the presentwithout compromising the ability of future generations to meet their own needs’ [1]. The primaryprinciple for sustainable development is that: ‘human beings are at the centre of concerns’ [2]. However,what is the connection between human needs and sustainable development? There are four dimensionsto sustainable development derived from Bruntland Report: society – satisfying basic human needs,environment – long term ecological sustainability, culture and economy – which are linked collectively.Besides, sustainable development is robustly linked to the quality of life of the society – it is aboutwhether the social, environmental systems and economic activities that build up the community areproviding a healthy and significant life for all the current living society and future</p><p>Since the early introductions of the concept of sustainable development, studies show that the concept of sustainable development has become enormously complex <a href="#"><em>[1]</em></a>. Rapid development around the world has created a huge concerned on how the natural environment will able to cope with the continuous changes. Environmental degradation has been experienced by all environmental components since the development taking place. Besides, the growth and successful society will depend on various development activities. Undoubtedly, human fundamental needs are to be satisfied. By managing to conquer the nature with the knowledge of concept of possibilities where men are able to explore and develop sensitive space and environment with the help of technology, land is easily to be developed.In order to fulfil the needs of the society towards a better nation, the great challenge is to protect all the natural system from been deteriorated. However, in many aspects of development, its processes and activities are exceeding the natural limits of carrying capacity of the natural environment.</p><p>From the historical perspectives, the industrial revolution marked the era of increasing land use development. In order to support the creation of new technology for industrial activities, basic facilities for example roads, railways, factories, housing and business area were built. Hence, the emergence of new city and urban development was generally recognized due to industrial revolution. Migration processes becomes significant to the city of London, Manchester, Leeds and few other cities in Britain following to secure job opportunities. However, the industrial revolution which began in Britain in 1760 shows the evident of serious industrial pollutions which brought the issues of air, water and soil pollutions. Nevertheless, development processes not only creates conflict with natural environment butto the society as a whole. The most significant social issues during the era of industrial revolution wasabout the industrial development that has produced imbalance in human needs which brought to the issues such as poverty, disease, welfare services and criminals. It is crucial to seek balance between development and human needs for achieving sustainable development.</p><p>In addition, sustainable development is also about dealing with equity <a href="#"><em>[2]</em></a>. Frequently, poor society andmarginal groups are most exposed to environmental hazards, live in fragile environment and low excessto adequate general infrastructure. According to United Nations Universal Declaration of Human Rights:‘all people have the right to a standard of living adequate for the health and well-being of themselvesand their family, including food, clothing, housing health care and the necessary social services’ <a href="#"><em>[3]</em></a>.Concerned by the United Nations, the World Bank, world leaders and scholars over the variety socialfabric that primarily demand the developments to fulfil their needs becoming the centre issue inachieving sustainable development. Improving quality of life by supporting the economic growth,reduce inequality of the society and improving the environmental management will lead to realizationof sustainable development. Thus, a number of scholars suggested that the concept of sustainabledevelopment have to set up with sustainable development goals. In 2015, the UN-2030 Agenda forSustainable Development [4] agreed in Sustainable Development Growth (SDGs) on the MillenniumDevelopment Goals (MDGs). Balance among the three components of sustainable development whichare social, economic and environment and improved the exposure of coverage in order to reduce theobstacle to sustainable development [4]. Since 1980s some Asian countries have experienced rapidurbanization.</p> <ul><li>[1]<a href="#">Holden E, Linnerud K and Banister D 2014 Sustainable development: Our Common Futurerevisited. Global Environmental Change 26 pp 130 -139</a></li><li>[2]<a href="#">World Development Report 2003 Sustainable Development in a Dynamic World, Transforming Institutions, Growth and Quality of life (New York: The World Bank and Oxford University Press)</a></li> <li>[3]<a href="#">Landon M 2006 Environment, Health and Sustainable Development (Berkshire: Open University Press)</a></li></ul> <cite>This material is adapted from the following article under the Creative Commons Attribution 3.0 License: M M Yusoff 2020 IOP Conf. Ser.: Earth Environ. Sci. 561 012020. <a href="https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020">https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-08T15:51:42.523Z',
                description:
                    'Description: Sustainable development is an initiative plan advised by the United Nation for the remarkable futurenation.',
                keywords: ['science', 'technology'],
                createdAt: '2021-09-08T15:51:42.523Z',
                updatedAt: '2021-09-08T15:51:42.523Z',
                user: { connect: { id: users.user1 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-22T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-27T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-1-protocol-2-draft',
        doi: '10.82259/publication-user-1-protocol-2-draft',
        type: 'PROTOCOL',
        versions: {
            create: {
                id: 'publication-user-1-protocol-2-draft-v1',
                versionNumber: 1,
                title: 'Draft Protocol of Improving the quality of life for sustainable development',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user1 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-1-data-1-live',
        doi: '10.82259/publication-user-1-data-1-live',
        type: 'DATA',
        linkedTo: { create: { publicationTo: 'publication-user-1-protocol-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-1-data-1-live-v1',
                versionNumber: 1,
                title: 'Data attached to Improving the quality of life for sustainable development',
                content:
                    '<table><tbody><tr><td>Sc</td><td>7.0</td><td>12</td><td>15</td><td>&nbsp;</td><td>&nbsp;</td><td>16</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>12</td><td>10.3</td><td>11</td></tr><tr><td>Ti</td><td>3120</td><td>3180</td><td>3900</td><td>2400</td><td>2700</td><td>4200</td><td>3000</td><td>3000</td><td>4800</td><td>3400</td><td>3200</td><td>3000</td></tr><tr><td>V</td><td>53</td><td>59</td><td>98</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>70</td><td>62</td><td>60</td></tr><tr><td>Cr</td><td>35</td><td>76</td><td>80</td><td>&lt;50</td><td>19</td><td>82</td><td>60</td><td>43</td><td>72</td><td>58</td><td>59</td><td>35</td></tr><tr><td>Co</td><td>12</td><td>&nbsp;</td><td>17</td><td>35</td><td>8</td><td>17</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>18</td><td>13</td><td>10</td></tr><tr><td>Ni</td><td>19</td><td>19</td><td>38</td><td>25</td><td>13</td><td>43</td><td>25</td><td>27</td><td>33</td><td>27</td><td>23</td><td>20</td></tr><tr><td>Rb</td><td>110</td><td>&nbsp;</td><td>82</td><td>85</td><td>187</td><td>72</td><td>77</td><td>125</td><td>63</td><td>100</td><td>99</td><td>112</td></tr><tr><td>Zr</td><td>237</td><td>190</td><td>188</td><td>135</td><td>180</td><td>148</td><td>117</td><td>154</td><td>197</td><td>172</td><td>186</td><td>190</td></tr><tr><td>Nb</td><td>26</td><td>&nbsp;</td><td>12</td><td>4</td><td>&nbsp;</td><td>9.1</td><td>&nbsp;</td><td>11</td><td>10</td><td>12</td><td>(23)</td><td>25</td></tr><tr><td>Cs</td><td>&nbsp;</td><td>&nbsp;</td><td>3.55</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3.6</td><td>3.6</td><td>3.7</td></tr><tr><td>Ba</td><td>1070</td><td>730</td><td>678</td><td>795</td><td>590</td><td>749</td><td>420</td><td>701</td><td>775</td><td>723</td><td>754</td><td>550</td></tr><tr><td>La</td><td>32.3</td><td>71</td><td>34.8</td><td>55</td><td>43</td><td>27</td><td>23</td><td>45</td><td>32</td><td>40</td><td>(43)</td><td>30</td></tr><tr><td>Hf</td><td>5.8</td><td>&nbsp;</td><td>5.12</td><td>&nbsp;</td><td>&nbsp;</td><td>4.4</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>5.1</td><td>5.7</td><td>5.8</td></tr><tr><td>Ta</td><td>5.7</td><td>&nbsp;</td><td>0.74</td><td>&nbsp;</td><td>&nbsp;</td><td>0.67</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&hellip;</td><td>&hellip;</td><td>2.2</td></tr><tr><td>Pb</td><td>17</td><td>18</td><td>18</td><td>&nbsp;</td><td>&nbsp;</td><td>14</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>17</td><td>18</td><td>20</td></tr><tr><td>Th</td><td>10.3</td><td>10.8</td><td>8.95</td><td>&nbsp;</td><td>13</td><td>6.2</td><td>7.9</td><td>14</td><td>&nbsp;</td><td>10.2</td><td>9.8</td><td>10.7</td></tr><tr><td colspan="13">&nbsp;</td></tr><tr><td>Area, 10<sup>6</sup>km<sup>2</sup></td><td>5.56</td><td>&nbsp;</td><td>&nbsp;</td><td>0.95</td><td>0.01</td><td>0.05</td><td>0.02</td><td>2.16</td><td>0.20</td><td>0.06</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2019-03-02T15:51:42.523Z',
                description: 'Description: Table.',
                keywords: ['science', 'technology'],
                user: { connect: { id: users.user1 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-1-data-2-draft',
        doi: '10.82259/publication-user-1-data-2-draft',
        type: 'DATA',
        versions: {
            create: {
                id: 'publication-user-1-data-2-draft-v1',
                versionNumber: 1,
                title: 'Draft Data attached to Improving the quality of life for sustainable development',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user1 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-1-analysis-1-live',
        doi: '10.82259/publication-user-1-analysis-1-live',
        type: 'ANALYSIS',
        linkedTo: { create: { publicationTo: 'publication-user-1-data-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-1-analysis-1-live-v1',
                versionNumber: 1,
                title: 'Analysis of Improving the quality of life for sustainable development',
                content:
                    '<h2><i>2.6 Improving quality of life on fragile environment</i></h2><p>Improve land use utilization under development planning is one of the action that should be taken bythe respective authority. Land use planning need to understand the social needs and the priority given toeach requirement. Land use utilization provides compact development and help to prevent urban sprawl.By concentrating the development and human activities at one centre the services and infrastructure willbe provided efficiently. Land use planning measures the land utilization by different land-use types ineach zone. Residential, commercial area, schools and basic infrastructure such as hospitals are closelyrelated to needs of living and working. Therefore, land-use utilization refers to the continuation ofdifferent types of land use development to improve the society quality of life. Propensity of people towalk and thus to be physically active absolutely demand a greater combination of land use types whichis related to the human needs.</p><p>Pelling [5] shows that ‘planned and unplanned developments were seen to have contributed to increasedcity-wide environmental risk’ by manipulations and adjustment that had been made to natural resourcessuch as land. Smith [25] points out that, “risk is sometimes taken as synonymous with hazards but riskhas the additional implication of the chance of a particular hazard actually occurring”. Risk is the actualexposure of something of human value to a hazard, and is often regarded as the connection of probabilityand loss. It is also viewed as “the probability of a specific hazard’s occurrence” [25]; for example, therisk when people build a house on a steep slope is the probability that the house will be exposed to alandslide. Therefore, fragile environment demand stringent regulations if the areas propose fordevelopment. However, by understanding the environmental system processes together with planninginstruments it can help the sensitive environment to be developed more efficient and innovative uses.For example, the constructions of recreational park in the flood plain will allow the space to be usedeffectively which could lead to improve quality of life of the society in gaining healthy lifestyles.Besides, during the flooding the flood plain will still able to cope with the process and the continuousevent exist will giving no harm to the society. </p><cite>This material is adapted from the following article under the Creative Commons Attribution 3.0 License: M M Yusoff 2020 IOP Conf. Ser.: Earth Environ. Sci. 561 012020. <a href="https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020">https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-02-24T15:51:42.523Z',
                description: 'Description: Improving quality of life on fragile environment',
                keywords: ['science', 'technology'],
                user: { connect: { id: users.user1 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-1-analysis-2-draft',
        doi: '10.82259/publication-user-1-analysis-2-draft',
        type: 'ANALYSIS',
        versions: {
            create: {
                id: 'publication-user-1-analysis-2-draft-v1',
                versionNumber: 1,
                title: 'Draft Analysis of Improving the quality of life for sustainable development',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user1 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-1-interpretation-1-live',
        doi: '10.82259/publication-user-1-interpretation-1-live',
        type: 'INTERPRETATION',
        linkedTo: { create: { publicationTo: 'publication-user-1-analysis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-1-interpretation-1-live-v1',
                versionNumber: 1,
                title: 'Interpretation of Improving the quality of life for sustainable development',
                conflictOfInterestStatus: true,
                conflictOfInterestText: 'This publication does have a conflict of interest...',
                content:
                    '<p>During 1960s and 1970s, many countries in Southeast Asia were in the phase of new town growth. Thephenomenon of rapid urbanization calls for a higher level of urban management. Continuous migrationto urban areas and the emergence of extended metropolitan regions, specifically in Southeast Asia,should lead to the highest priorities in the national agenda being to determine and improve the qualityof life of the urban community as a whole. The most fundamental move made by the government shouldbe to improve housing setting and conditions for the urban poor <a href="#"><em>[26]</em></a>. Relocation of the squattersettlements is one of the alternatives to enhance conditions for the urban poor, and in addition, the urbancondition should be overhauled. However, in Manila for example the resettlements project for slumdwellers along the river banks into another new location have not been success. It was the fact that livingon the edge of town, far from urban amenities and from areas where work is located, most of themreturned to the original settlements within a few months <a href="#"><em>[27]</em></a>. Efforts should be made by the governmentor the private sector to improving the incomes of the poor and enhance their ability to access the jobmarket through better education. </p><p>In many developing countries, unemployment is high, productivity is low and economic growth is slow[2]. By some means the escalating number of urban population need to be balanced with the requirementof human needs. It is understood that the principle of sustainable development is to influence quality oflife which in returned will achieve long term sustainability. Nevertheless, unemployment will influencethe quality of life where it will increase poverty and creates unstable societies. In this context, certainmeasures in economic policy, changes in employment requirement and improve skills among societywill rise the potential of employment. Living standard of the society will be improved together with thelife satisfaction [28]. The Millennium Development Goals (MDGs) (UN, Millennium DevelopmentGoals, 2019) focus on reducing poverty; illiteracy; hunger; lack of education; gender inequality;improving child and maternal mortality rates; preventing disease and reducing environmentaldegradation [3]. Therefore, the goals are important global agenda which concerning good governanceand human rights for improving quality of life. The segregation between high, middle and low incomesociety particularly in the city has realized the significant impact on land utilization and jobopportunities. </p><p>The high incidence of urban poverty constitutes a major challenge for governments <a href="#"><em>[29]</em></a>. As highlightedby World Development Report [2], poverty has been identified as one of the major causes forenvironmental problems. Most significantly, the urban poor will prefer to reside at squatter a settlementwhich is generally located in hazardous area. Largely the urban sensitive land such as flood plains andhill slopes are the housing sites of the urban poor. Hence, developments on the fragile environmentalsystems will gradually disturb the environmental stability. The humanity principle tackles theimportance of quality of life for sustainable development. Therefore, improving quality of life for urbanpoor by having job security is a comprehensive tool in order to achieve sustainable development.</p> <ul><li>[26]<a href="#">United Nations Human Settlements Programme (UN-HABITAT) 2003 The Challenge of Slums:Global Report on Human Settlements 2003 (London and Sterling: Earthscan Publication Ltd)</a></li><li>[27]<a href="#">United Nations Economic and Social Commission for Asia and the Pacific (UNESCAP) 2003 Overview of the stage of implementation of agenda 21 and JPOI in the human settlements in Asia and the Pacific Regional Implementation Meeting for Asia and the Pacific pp 27-28</a></li><li>[29]<a href="#">United Nations Development Programme (UNDP) 1991 Cities, People and Poverty: Urban Development Cooperation for the 1990s (New York: UNDP)</a></li></ul> <cite>This material is adapted from the following article under the Creative Commons Attribution 3.0 License: M M Yusoff 2020 IOP Conf. Ser.: Earth Environ. Sci. 561 012020. <a href="https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020">https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2008-10-13T15:51:42.523Z',
                description:
                    'Description: During 1960s and 1970s, many countries in Southeast Asia were in the phase of new town growth.',
                keywords: ['science', 'technology'],
                user: { connect: { id: users.user1 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-1-interpretation-2-draft',
        doi: '10.82259/publication-user-1-interpretation-2-draft',
        type: 'INTERPRETATION',
        versions: {
            create: {
                id: 'publication-user-1-interpretation-2-draft-v1',
                versionNumber: 1,
                title: 'Draft Interpretation of Improving the quality of life for sustainable development',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user1 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-1-real-world-application-1-live',
        doi: '10.82259/publication-user-1-real-world-application-1-live',
        type: 'REAL_WORLD_APPLICATION',
        linkedTo: { create: { publicationTo: 'publication-user-1-interpretation-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-1-real-world-application-1-live-v1',
                versionNumber: 1,
                title: 'Conclusion of Improving the quality of life for sustainable development',
                content:
                    '<h2><b>3. Conclusion</b></h2><p>Sustainable development means to protect, preserve and conserve the natural environment for the futureneeds. Besides, sustainable development will only succeed if the environmental components achievetheir stability and the society experience good quality of life upon the natural environment. Quality oflife cannot be reached unless the society is secure and the basic human needs are met. The utilization ofenvironmental resources should not go beyond the pace of replenishment. The survival of living societygreatly depends on the natural resources. Thus, understanding the consequences of human actionstowards environment is highly appreciated. Complex relationship that has been demonstrated by theenvironmental systems on how they work to support all life, societies and economies shows thesuccessful of natural relationship.</p><p>Cities are designed and developed for the establishment of nation. Growing urban population means thatthe requirement of better coordination between the urban development and fulfilling the human needs.Urban land use development planning with the high understanding of the human needs nodes thestandard in improving quality of life. This action brought out an issue of the urban poor on why theywere choosing to live close to the city centre. Without proper arrangement on housing the urban poorby the authorities, squatter settlements have become the solution for this group. Therefore, inhabited onsensitive land has put the society on risk due to environmental degradation.The bright light syndrome of the city has become a catalyst for the reason of migration from rural tourban areas. The hope of migration is to achieve quality of life in the city by working and living in agood urban environment. Hence, the city development might be designed with the optimal chances ofjob opportunities for diverse level of urban society. Job security indirectly improves the quality of lifewhen urban people manage to appreciate the urban lifestyles and have desire to live in sustainable space.With all the complex set of link between human needs and the environmental supply, this paper raisedthe issues of the challenge to achieve sustainable development by improving quality of life. Thus,improving quality of life requires significant changes in how standards of living need to be guided andeconomic activities are coordinated. </p><cite>This material is adapted from the following article under the Creative Commons Attribution 3.0 License: M M Yusoff 2020 IOP Conf. Ser.: Earth Environ. Sci. 561 012020. <a href="https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020">https://iopscience.iop.org/article/10.1088/1755-1315/561/1/012020</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2020-10-21T15:51:42.523Z',
                description:
                    'Description: Sustainable development means to protect, preserve and conserve the natural environment for the future needs.',
                keywords: ['science', 'technology'],
                user: { connect: { id: users.user1 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-1-real-world-application-2-draft',
        doi: '10.82259/publication-user-1-real-world-application-2-draft',
        type: 'REAL_WORLD_APPLICATION',
        versions: {
            create: {
                id: 'publication-user-1-real-world-application-2-draft-v1',
                versionNumber: 1,
                title: 'Draft Conclusion of Improving the quality of life for sustainable development',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user1 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-2-problem-1-live',
        doi: '10.82259/publication-user-2-problem-1-live',
        type: 'PROBLEM',
        linkedTo: { create: { publicationTo: 'publication-user-1-problem-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-2-problem-1-live-v1',
                versionNumber: 1,
                title: 'What is the R0 of the COVID-19 virus?',
                conflictOfInterestStatus: true,
                conflictOfInterestText: 'This publication does have a conflict of interest...',
                content:
                    'In Wuhan, China, a novel and alarmingly contagious primary atypical (viral) pneumonia broke out in December 2019. It has since been identified as a zoonotic coronavirus, similar to SARS coronavirus and MERS coronavirus and named COVID-19. As of 8 February 2020, 33 738 confirmed cases and 811 deaths have been reported in China. The basic reproduction number (R0) is a central concept in infectious disease epidemiology, indicating the risk of an infectious agent with respect to epidemic spread. Calculating it in this new virus is vital to support modelling of the spread of the pandemic. - content from Science Octopus Prototype',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2019-01-25T15:51:42.523Z',
                user: { connect: { id: users.user2 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-25T16:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-2-problem-2-draft',
        doi: '10.82259/publication-user-2-problem-2-draft',
        type: 'PROBLEM',
        versions: {
            create: {
                id: 'publication-user-2-problem-2-draft-v1',
                versionNumber: 1,
                title: 'How can we model the epidemiology of COVID-19?',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user2 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-2-hypothesis-1-live',
        doi: '10.82259/publication-user-2-hypothesis-1-live',
        type: 'HYPOTHESIS',
        linkedTo: { create: { publicationTo: 'publication-user-2-problem-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-2-hypothesis-1-live-v1',
                versionNumber: 1,
                title: 'Conducting a meta-analysis of studies of the R0 will help improve estimates',
                content:
                    'Multiple studies have been published on the R0 of COVID-19, but only a meta-analysis will bring an appropriate level of confidence in any estimate. - content from Science Octopus Prototype',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: users.user2 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-22T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-27T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-2-hypothesis-2-draft',
        doi: '10.82259/publication-user-2-hypothesis-2-draft',
        type: 'HYPOTHESIS',
        linkedTo: { create: { publicationTo: 'publication-user-2-problem-1-live' } },
        versions: {
            create: {
                id: 'publication-user-2-hypothesis-2-draft-v1',
                versionNumber: 1,
                title: 'Are patients with hypertension and diabetes mellitus at increased risk for COVID-19 infection?',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user2 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-2-protocol-1-live',
        doi: '10.82259/publication-user-2-protocol-1-live',
        type: 'PROTOCOL',
        linkedTo: { create: { publicationTo: 'publication-user-2-hypothesis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-2-protocol-1-live-v1',
                versionNumber: 1,
                title: 'Method for meta-analysis of studies of R0 for COVID-19',
                conflictOfInterestStatus: true,
                conflictOfInterestText: 'This publication has a conflict of interest because of funding with XYZ.',
                content:
                    'PubMed, bioRxiv and Google Scholar were accessed to search for eligible studies. The term "coronavirus & basic reproduction number" was used. The time period covered was from 1 January 2020 to 7 February 2020. - content from Science Octopus Prototype',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: users.user2 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-22T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-27T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-2-protocol-2-draft',
        doi: '10.82259/publication-user-2-protocol-2-draft',
        type: 'PROTOCOL',
        linkedTo: { create: { publicationTo: 'publication-user-2-hypothesis-1-live' } },
        versions: {
            create: {
                id: 'publication-user-2-protocol-2-draft-v1',
                versionNumber: 1,
                title: 'Relations are contingent upon the level of community access to these places',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user2 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-2-data-1-live',
        doi: '10.82259/publication-user-2-data-1-live',
        type: 'DATA',
        linkedTo: { create: { publicationTo: 'publication-user-2-protocol-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-2-data-1-live-v1',
                versionNumber: 1,
                title: 'Results of a meta-analysis of R0 for COVID-19',
                content:
                    'We identified 12 studies which estimated the basic reproductive number for COVID-19 from China and overseas. Table 1 shows that the estimates ranged from 1.4 to 6.49, with a mean of 3.28, a median of 2.79 and interquartile range (IQR) of 1.16. - content from Science Octopus Prototype',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2018-04-28T15:51:42.523Z',
                user: { connect: { id: users.user2 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-2-data-2-draft',
        doi: '10.82259/publication-user-2-data-2-draft',
        type: 'DATA',
        linkedTo: { create: { publicationTo: 'publication-user-2-protocol-1-live' } },
        versions: {
            create: {
                id: 'publication-user-2-data-2-draft-v1',
                versionNumber: 1,
                title: 'Results of systematic review of COVID-19 cases',
                content: 'Results of review - *add in* Table 5-10 and Appendices.',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user2 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-2-analysis-1-live',
        doi: '10.82259/publication-user-2-analysis-1-live',
        type: 'ANALYSIS',
        linkedTo: { create: { publicationTo: 'publication-user-2-data-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-2-analysis-1-live-v1',
                versionNumber: 1,
                title: 'Analysis of the data from a retrospective cohort study of 191 inpatients in Wuhan with COVID-19',
                conflictOfInterestStatus: true,
                conflictOfInterestText:
                    'This publication does have a conflict of interest with the Institution of Wuhan.',
                content:
                    "We included 171 patients with complete data for all variables (53 non-survivors and 118 survivors) in the multivariable logistic regression model. We found that older age, higher SOFA score, and d-dimer greater than 1 μg/mL at admission were associated with increased odds of death (table 3). When adjusting for study centre, our generalised linear model showed similar results (appendix p 5). For survivors, the median duration of viral shedding was 20·0 days (IQR 17·0–24·0) from illness onset, but the virus was continuously detectable until death in non-survivors (table 2; figure 1). The shortest observed duration of viral shedding among survivors was 8 days, whereas the longest was 37 days. Among 29 patients who received lopinavir/ritonavir and were discharged, the median time from illness onset to initiation of antiviral treatment was 14·0 days (IQR 10·0–17·0) and the median duration of viral shedding was 22·0 days (18·0–24·0). The median duration of viral shedding was 19·0 days (17·0–22·0) in patients with severe disease status and 24·0 days (22·0–30·0) in patients with critical disease status. Download : Download high-res image (889KB) Download : Download full-size image Figure 1. Clinical courses of major symptoms and outcomes and duration of viral shedding from illness onset in patients hospitalised with COVID-19 Figure shows median duration of symptoms and onset of complications and outcomes. ICU=intensive care unit. SARS-CoV-2=severe acute respiratory syndrome coronavirus 2. ARDS=acute respiratory distress syndrome. COVID-19=coronavirus disease 2019. Major laboratory markers were tracked from illness onset (figure 2). Baseline lymphocyte count was significantly higher in survivors than non-survivors; in survivors, lymphocyte count was lowest on day 7 after illness onset and improved during hospitalisation, whereas severe lymphopenia was observed until death in non-survivors. Levels of d-dimer, high-sensitivity cardiac troponin I, serum ferritin, lactate dehydrogenase, and IL-6 were clearly elevated in non-survivors compared with survivors throughout the clinical course, and increased with illness deterioration (figure 2). In non-survivors, high-sensitivity cardiac troponin I increased rapidly from day 16 after disease onset, whereas lactate dehydrogenase increased for both survivors and non-survivors in the early stage of illness, but decreased from day 13 for survivors. Download : Download high-res image (972KB) Download : Download full-size image Figure 2. Temporal changes in laboratory markers from illness onset in patients hospitalised with COVID-19 Figure shows temporal changes in d-dimer (A), lymphocytes (B), IL-6 (C), serum ferritin (D), high-sensitivity cardiac troponin I (E), and lactate dehydrogenase (F). Differences between survivors and non-survivors were significant for all timepoints shown, except for day 4 after illness onset for d-dimer, IL-6, and high-sensitivity cardiac troponin I. For serum ferritin (D), the median values after day 16 exceeded the upper limit of detection, as indicated by the dashed line. COVID-19=coronavirus disease 2019. IL-6=interleukin-6. Median time from illness onset to dyspnoea was similar in survivors and non-survivors, with a median duration of dyspnoea of 13·0 days (9·0–16·5) for survivors (table 2; figure 1). In survivors, the median duration of fever was 12·0 days (8·0–13·0) and cough persisted for 19·0 days (IQR 12·0–23·0; figure 1). 62 (45%) survivors still had cough on discharge and 39 (72%) non-survivors still had cough at the time of death. The dynamic profiles of fever, cough, and dyspnoea are shown in the appendix (p 6). Sepsis developed at a median of 9·0 days (7·0–13·0) after illness onset among all patients, followed by ARDS (12·0 days [8·0–15·0]), acute cardiac injury (15·0 days [10·0–17·0]), acute kidney injury (15·0 days [13·0–19·5]), and secondary infection (17·0 days [13·0–19·0]). The initiation time and duration of systematic corticosteroid use was also similar between the two groups. Among non-survivors, the median time from illness onset was 10·0 days (7·0–14·0) to sepsis, 12·0 days (8·0–15·0) to ARDS, 14·5 days (9·5–17·0) to acute cardiac injury, and 17·0 days (13·0–19·0) to secondary infection (figure 1; table 2). Among survivors, secondary infection, acute kidney injury, and acute cardiac injury were observed in one patient each, occurring 9 days (acute kidney injury), 14 days (secondary infection), and 21 days (acute cardiac injury) after illness onset. The median time from dyspnoea to intubation was 10·0 days (IQR 5·0–12·5) for patients who received invasive mechanical ventilation and the time from invasive mechanical ventilation to occurrence of ventilator-associated pneumonia was 8·0 days (2·0–9·0; figure 1). Continuous and categorical variables were presented as median (IQR) and n (%), respectively. We used the Mann-Whitney U test, χ2 test, or Fisher's exact test to compare differences between survivors and non-survivors where appropriate. To explore the risk factors associated with in-hospital death, univariable and multivariable logistic regression models were used. Considering the total number of deaths (n=54) in our study and to avoid overfitting in the model, five variables were chosen for multivariable analysis on the basis of previous findings and clinical constraints. Previous studies have shown blood levels of d-dimer and Sequential Organ Failure Assessment (SOFA) scores to be higher in critically ill or fatal cases, whereas lymphopenia and cardiovascular disease have been less commonly observed in non-critical or surviving patients with SARS-COV-2 infection.5, 6, 12Similar risk factors, including older age, have been reported associated with adverse clinical outcomes in adults with SARS and Middle East respiratory syndrome (MERS).3, 13 Some laboratory findings, including alanine aminotransferase (ALT), lactate dehydrogenase, high-sensitivity cardiac troponin I, creatine kinase, d-dimer, serum ferritin, and IL-6, might be unavailable in emergency circumstances. Therefore, we chose lymphocyte count, d-dimer, SOFA score, coronary heart disease, and age as the five variables for our multivariable logistic regression model. We excluded variables from the univariable analysis if their between-group differences were not significant, if their accuracy was unconfirmed (eg, exposure, which was self-reported), if the number of events was too small to calculate odds ratios, and if they had colinearity with the SOFA score. We compared patient characteristics between the two hospitals and used a generalised linear model to adjust for possible differences in patients’ characteristics and treatment between the two study centres. A two-sided α of less than 0·05 was considered statistically significant. Statistical analyses were done using the SAS software (version 9.4), unless otherwise indicated. - content from Science Octopus Prototype",
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2021-09-27T15:51:42.523Z',
                user: { connect: { id: users.user2 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-2-analysis-2-draft',
        doi: '10.82259/publication-user-2-analysis-2-draft',
        type: 'ANALYSIS',
        linkedTo: { create: { publicationTo: 'publication-user-2-data-1-live' } },
        versions: {
            create: {
                id: 'publication-user-2-analysis-2-draft-v1',
                versionNumber: 1,
                title: 'Meta-analysis of COVID-19 cases',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user2 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-2-interpretation-1-live',
        doi: '10.82259/publication-user-2-interpretation-1-live',
        type: 'INTERPRETATION',
        linkedTo: { create: { publicationTo: 'publication-user-2-analysis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-2-interpretation-1-live-v1',
                versionNumber: 1,
                title: 'Interpretation of the results from pathology of a patient who died of COVID-19 in Wuhan',
                content:
                    'The analysis of the findings from this single patient in Wuhan suggests that COVID-19 infection can stimulate an over activation of T cells and severe immune injury. This can be seen in blood sample and analysis, and results in rapid progression of pneumonia and potentially liver damage. Lymphopenia is a common feature in the patients with COVID-19 and might be a critical factor associated with disease severity and mortality.  - content from Science Octopus Prototype',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: users.user2 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-2-interpretation-2-draft',
        doi: '10.82259/publication-user-2-interpretation-2-draft',
        type: 'INTERPRETATION',
        linkedTo: { create: { publicationTo: 'publication-user-2-analysis-1-live' } },
        versions: {
            create: {
                id: 'publication-user-2-interpretation-2-draft-v1',
                versionNumber: 1,
                title: 'Could treatment for COPD be protective against COVID-19 symptoms?',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user2 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-2-real-world-application-1-live',
        doi: '10.82259/publication-user-2-real-world-application-1-live',
        type: 'REAL_WORLD_APPLICATION',
        linkedTo: { create: { publicationTo: 'publication-user-2-interpretation-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-2-real-world-application-1-live-v1',
                versionNumber: 1,
                title: 'Conclusions from the data on the use of asthma/COPD treatments in COVID-19',
                content:
                    'The potential benefits or harms of inhaled corticosteroids and other treatments for people at risk of SARS-CoV-2 infection or patients with COVID-19 are unclear at present, and no changes to the treatment or management of chronic respiratory conditions, including COPD and asthma, should be considered at this stage. However, collecting accurate data for the comorbidities and previous therapy of patients with COVID-19 will be essential to understanding risk factors for becoming infected, developing symptoms, and being diagnosed, as well as enabling answers to questions about possible benefits or harms of therapy for asthma and COPD during the COVID-19 pandemic. This could be achieved using a standard dataset as advocated by WHO, including information about the presence and severity of comorbidities and all medication that was being taken at the time of infection.  - content from Science Octopus Prototype',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2021-06-25T15:51:42.523Z',
                user: { connect: { id: users.user2 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-2-real-world-application-2-draft',
        doi: '10.82259/publication-user-2-real-world-application-2-draft',
        type: 'REAL_WORLD_APPLICATION',
        linkedTo: { create: { publicationTo: 'publication-user-2-interpretation-1-live' } },
        versions: {
            create: {
                id: 'publication-user-2-real-world-application-2-draft-v1',
                versionNumber: 1,
                title: 'Corticosteroid treatment may help prevent ARDS development in COVID-19 patients',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user2 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-4-protocol-1-live',
        doi: '10.82259/publication-user-4-protocol-1-live',
        type: 'PROTOCOL',
        linkedTo: { create: { publicationTo: 'publication-user-1-hypothesis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-4-protocol-1-live-v1',
                versionNumber: 1,
                title: 'Protocol for Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers',
                conflictOfInterestStatus: true,
                conflictOfInterestText:
                    'This publication does have a conflict of interest due to the author holding a position at XYZ.',
                content:
                    '<p>To explain these trends in the morphing behavior, we regard the system as a network of interconnected slender beams that change their dimensions (diameter and length) and their Young modulus throughout the swelling process. For such a filament, the elastic energy is a sum of the stretching and bending energies</p><p>𝐸elastic(𝑟,𝐿0,𝐸)=&int;𝐿0012𝑘(𝑟,𝐿0,𝐸)(&part;𝑙&part;𝑙0&minus;1)2d𝑙0+&int;𝐿0012𝐵(𝑟,𝐸)(&part;𝜙&part;𝑙0)2d𝑙0Eelastic(r,L0,E)=&int;0L012k(r,L0,E)&part;l&part;l0&minus;12dl0+&int;0L012B(r,E)&part;ϕ&part;l02dl0</p><p>(2)where&nbsp;<em>E</em>&nbsp;is the Young modulus of the swollen polymer,&nbsp;<em>r</em>&nbsp;is the radius of the filament,&nbsp;<em>L</em><sub>0</sub>&nbsp;is the reference contour length of the filament before the deformation,&nbsp;<em>l</em><sub>0</sub>&nbsp;and&nbsp;<em>l</em>&nbsp;are the reference (rest length) and the deformed filament paths, ϕ is the local tangent angle, and&nbsp;&part;𝜙&part;𝑙0=&part;2𝑙&part;𝑙20&part;ϕ&part;l0=&part;2l&part;l02&nbsp;is the curvature of the filament.&nbsp;<em>k</em>&nbsp;and&nbsp;<em>B</em>&nbsp;are the stiffness and bending moduli, respectively, and are given by<sup>[</sup><sup><a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0042" id="adfm202111471-bib-0042R">42</a></sup><sup>]</sup></p><p>𝑘=𝐸𝜋𝑟2𝐿0,&emsp;𝐵=𝐸𝜋𝑟44k=E&pi;r2L0,&emsp;B=E&pi;r44</p><p>(3)Thus, the network structure imposes two intrinsic length scales: the filament radius&nbsp;<em>r</em>&nbsp;and the filament length,&nbsp;<em>L</em><sub>0</sub>, which is effectively determined by the fiber density in the network. These two length scales play a crucial role in determining the morphing behavior of the single filament and through the hierarchy, also determine the morphing behavior of the&nbsp;network.</p><p>Another energy term is related to the spatial overlap between the fibers. While fibers can buckle out of the network plane, fiber overlap along the plane was rarely exhibited experimentally, indicating overlap is highly unfavorable. Thus, the fiber overlap energy term was regarded as a Heaviside step function. For&nbsp;<em>d</em>&nbsp;⩽ 2<em>r</em>, where&nbsp;<em>d</em>&nbsp;is the distance between two fibers, the energy is high, and for&nbsp;<em>d</em>&nbsp;&gt; 2<em>r</em>&nbsp;the energy goes to&nbsp;zero.</p><p>Throughout the swelling process stresses are exerted on the edges constructing the network. If the stress exerted on an edge is larger than the critical Euler buckling stress given by</p><p>𝜎critical=𝜋2𝐸𝑟2𝐿20</p> <cite>This material is adapted from the following article under the Attribution-NonCommercial 4.0 International: Sharabani S. Z., Edelstein-Pardo N., Molco M.,Bachar Schwartz N. B., Morami M., Sivan A., Gendelman Rom Y., Evental R., Flaxer E., Sitt A., 2022. Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers. Advanced Functional Materials. <a href="https://onlinelibrary.wiley.com/doi/10.1002/adfm.202111471">https://onlinelibrary.wiley.com/doi/10.1002/adfm.202111471</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2020-05-15T15:51:42.523Z',
                createdAt: '2020-04-30T16:51:42.523Z',
                updatedAt: '2020-05-15T16:51:42.523Z',
                user: { connect: { id: users.user4 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-4-data-1-live',
        doi: '10.82259/publication-user-4-data-1-live',
        type: 'DATA',
        linkedTo: { create: { publicationTo: 'publication-user-4-protocol-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-4-data-1-live-v1',
                versionNumber: 1,
                title: 'Data attached to Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers',
                content:
                    ' <p>The total force on an angular spring is<math> <mrow> <mi>F</mi> <mo>=</mo> <msub> <mi>F</mi> <mi>j</mi> </msub> <mo>+</mo> <msub> <mi>F</mi> <mrow> <mi>o</mi> <mi>v</mi> <mi>e</mi> <mi>r</mi> <mi>l</mi> <mi>a</mi> <mi>p</mi> </mrow> </msub> <mo stretchy="false">(</mo> <msub> <mi>d</mi> <mrow> <mi>j</mi> <mo>,</mo> <mi>k</mi> </mrow> </msub> <mo stretchy="false">)</mo> </mrow></math>. Each angular spring is iteratively moved according to the calculated force. Once the amplitude of all the forces decreases below a predefined limit, the rest length, radius, and the Young modulus are altered again, and the process is repeated until the fibers reach their final swollen&nbsp;length.</p> <cite>This material is adapted from the following article under the Attribution-NonCommercial 4.0 International: Sharabani S. Z., Edelstein-Pardo N., Molco M.,Bachar Schwartz N. B., Morami M., Sivan A., Gendelman Rom Y., Evental R., Flaxer E., Sitt A., 2022. Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers. Advanced Functional Materials. <a href="https://onlinelibrary.wiley.com/doi/10.1002/adfm.202111471">https://onlinelibrary.wiley.com/doi/10.1002/adfm.202111471</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-21T15:51:42.523Z',
                createdAt: '2020-04-30T16:51:42.523Z',
                updatedAt: '2022-05-21T16:51:42.523Z',
                user: { connect: { id: users.user4 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-4-real-world-application-1-live',
        doi: '10.82259/publication-user-4-real-world-application-1-live',
        type: 'REAL_WORLD_APPLICATION',
        linkedTo: { create: { publicationTo: 'publication-user-1-interpretation-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-4-real-world-application-1-live-v1',
                versionNumber: 1,
                title: 'Conclusion to Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers',
                content:
                    '<h2>3 Conclusion</h2><p>The ability to tune the shape-morphing behavior of a hierarchical structure of mesoscale building blocks without changing the polymer itself, but only by changing the diameter of the filaments and the network architecture, provides a novel, versatile, and scalable strategy for the design and development of novel functional responsive materials with high spatial morphing resolutions and with unique morphing abilities. Such systems pave the way for soft synthetic micro-muscles and micro-actuators with high spatial resolutions. Owing to the small dimensions of the filaments, they also hold significant potential for morphing optic devices and tunable separators. Last, such systems demonstrate that hierarchical structures of mesoscale elements may induce unexpected mechanical behaviors and that the dimensions of these elements must be accounted for, whether when dealing with synthetic hydrogel fibers or when examining biological systems such as microtubules and actin&ndash;myosin&nbsp;networks.</p><h2>4 Experimental Section</h2><h4>Materials</h4><p><em>N</em>-isopropylacrylamide (NIPAAM) 99%, glycidyl methacrylate (GMA), and 2,2&prime;-Azobis (2-methylpropionitrile) (AIBN) were purchased from Alfa Aesar. Toluene (anhydrous, 99.8%), dimethylformamide (DMF), chloroform, dichloromethane (DCM), hexane, and tetraethylenepentamine (TEPA), poly[(m-pheneylenevinylene)-alt-(2,5-dihexyloxy-p-phenyleneviylene)] were purchased from Sigma-Aldrich. Diethyl ether and was purchased from BioLab. All the materials were used as bought, without further&nbsp;purification.</p><h4>Copolymer Synthesis</h4><p>The copolymer poly (<em>N</em>-isopropylacrylamide-co-glycidyl methacrylate) (PNcG) was synthesized using a radical polymerization through a modification of the procedure described by Xiaowei et&nbsp;al.<sup>[</sup><sup><a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0046" id="adfm202111471-bib-0046R">46</a></sup><sup>]</sup>&nbsp;In a typical synthesis, NIPAAm (6.0 g, 0.053 mol), GMA (0.145 mL, 1.060 mmol), and AIBN (50 mg, 0.304 mmol) were dissolved in 40 mL of toluene, under a purge of argon, and the monomers were allowed to polymerized at 70 &deg;C for 2 h in 100 mL three-neck flask. The solution was cooled down to room temperature and the solvent was evaporated using a rotary evaporator. The copolymer was then redissolved in DCM and was precipitated by slowly pouring 1 L of diethyl ether into the solution. The copolymer was filtered from the solution, dissolved in DCM and hexane (1:1 v/v). Then the solvent was evaporated using a rotary evaporator to yield a white powder. The product was dried under vacuum&nbsp;overnight.</p><h4>Networks Fabrication</h4><p>Fabrication of nano- to microscale fibers of PNIPPAm and its copolymers was demonstrated before using electrospinning.<sup>[</sup><sup><a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0031" id="adfm202111471-bib-0031R">31</a>,&nbsp;<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0047" id="adfm202111471-bib-0047R">47</a>-<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0049" id="adfm202111471-bib-0049R">49</a></sup><sup>]</sup>&nbsp;However, obtaining high enough jet stability for accurate jet-writing using electrospinning was not trivial and hence dry-spinning was chosen as a jetting method instead to improve the stability.<sup>[</sup><sup><a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0033" id="adfm202111471-bib-0033R">33</a>,&nbsp;<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0037" id="adfm202111471-bib-0037R">37</a>,&nbsp;<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0050" id="adfm202111471-bib-0050R">50</a>-<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/adfm.202111471#adfm202111471-bib-0052" id="adfm202111471-bib-0052R">52</a></sup><sup>]</sup>&nbsp;In this approach, the copolymer and the multi-arm amine crosslinker TEPA were first mixed and dissolved in the appropriate solvent mixture to form a viscous solution. In a typical jetting solution PNIPAAm copolymer of 0.5&ndash;0.8 g mL<sup>&minus;1</sup>&nbsp;was prepared by dissolving the PNcG in a mixture of chloroform and DMF (1:1 v/v). 1&ndash;10% of TEPA was added just before the jetting process. At this range, the crosslinking was sufficient for preventing the dissolving of the copolymer in water, and yet there was a significant swelling of the hydrogel. Usually, trace amounts of the fluorescent polymeric dye were added to the solution to allow examination of the fibers in fluorescence microscopy. Next, the solution was dispensed via a metallic 23-gauge needle at a constant flow rate of 0.020 mL h<sup>&minus;1</sup>. Once a droplet was formed at the end of the capillary, it was mechanically pulled toward the rotating collector. The increase in surface area and the pulling process resulted in the evaporation of the solvents and in solidification into a thin fiber of mesoscale diameter. Once attached to the collector, the motion of the collector derived further pulling of the fiber. For the thin fibers (in average, fiber diameter &lt; 5 &mu;m), the tip-to-ground distance was 3 cm, and the rotating speed of the drum was 16&ndash;32 mm s<sup>&minus;1</sup>. The linear motion stage velocity was 1.15 mm s<sup>&minus;1</sup>. For the thick fibers (fiber diameter &gt;5 &mu;m), the tip-to-ground distance was 1 cm, and rotating speed of the drum was 1&ndash;5 mm s<sup>&minus;1</sup>. The linear motion stage velocity was 0.2 mm s<sup>&minus;1</sup>. For a drum with a radius&nbsp;<em>R</em><sub>d</sub>&nbsp;and an angular velocity of &omega;<sub>d</sub>, positioned on a stage moving at a velocity&nbsp;<em>V</em><sub>s</sub>&nbsp;in perpendicular to the drum rotation, the distance between the parallel fibers is given by&nbsp;<em>V</em><sub>s</sub>/(<em>R</em><sub>d</sub>&nbsp;&middot; &omega;<sub>d</sub>), and hence, for a given rotation speed, the distance between the fibers was controlled by the velocity of the moving&nbsp;stage.</p><p>To construct the networks, the fibers were collected on a plastic frame that was attached to a rotating drum positioned on top of a moving stage. At the first stage, fibers were pulled by the rotating drum along the direction of the rotation and perpendicular to the motion of the moving stage. The diameter of the fibers was determined by the drum velocity and by the polymer concentration of the jetting solution. The distance between the fibers was dictated by the rotation speed of the drum and the velocity of the moving&nbsp;stage.</p><p>Once the fibers were jetted along the entire plastic frame, the frame was detached from the rotating drum and reattached after rotating it by a specific angle. For constructing Cartesian networks the frame was rotated by an angle of 90&deg;, and the jet writing of parallel fibers was repeated to obtain the final network structure. The crossing points of the fibers were defined as the nodes of the network and segment of the fiber connecting two nodes as an edge. The crosslinking of the copolymer was performed post-fabrication of the network by baking it at 70&nbsp;&deg;C overnight. The experimental setup contained a syringe pump (New Era), a linear motion stage (ILS-200LM, Newport), a eight-axis universal controller (XPS-D8, Newport), and a rotating drum&nbsp;collector.</p><h4>Instrumentation</h4><p><sup>1</sup>H-nuclear magnetic resonance spectra was recorded on Bruker Avance III 400 MHz spectrometers. The copolymer was dissolved in deuterated chloroform as a solvent. The chemical shifts were reported in ppm and referenced to the solvent. Gel permeation chromatography measurements were performed on Viscotek GPCmax by Malvern. Scanning electron microscopy (SEM) was performed using a Quanta 200FEG environmental SEM in a high vacuum, WD 10 mm, 12.5&ndash;20 kV. All images and videos were taken by Olympus, IX73 microscope equipped with a heating glass slide (LCI, CU-301).</p><h4>Modeling</h4><p>All models presented in the article were written in Matlab according to the equations&nbsp;described within the&nbsp;text.</p><h2>Acknowledgements</h2><p>The authors would like to thank Prof. Michael Urbakh and Prof. Oded Hod for the insightful discussions A.S. acknowledges the generous support from the Azrieli Foundation. S.Z.S. and N.E.-P. acknowledge the generous support of The Shulamit Aloni Scholarship for Advancing Women in Exact Science and Engineering, provided by The Ministry of Science Technology, Israel. The authors acknowledge the Chaoul Center for Nanoscale Systems of Tel Aviv University for the use of instruments and staff assistance, and the Mechanical Workshop for Research and Development, School of Chemistry, Tel Aviv University, for their help in constructing the fabrication&nbsp;devices.</p><cite>This material is adapted from the following article under the Attribution-NonCommercial 4.0 International: Sharabani S. Z., Edelstein-Pardo N., Molco M.,Bachar Schwartz N. B., Morami M., Sivan A., Gendelman Rom Y., Evental R., Flaxer E., Sitt A., 2022. Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers. Advanced Functional Materials. <a href="https://onlinelibrary.wiley.com/doi/10.1002/adfm.202111471">https://onlinelibrary.wiley.com/doi/10.1002/adfm.202111471</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-03-01T15:51:42.523Z',
                user: { connect: { id: users.user4 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-5-data-1-live',
        doi: '10.82259/publication-user-5-data-1-live',
        type: 'DATA',
        linkedTo: {
            createMany: {
                data: [
                    { publicationTo: 'publication-user-1-protocol-1-live', draft: false },
                    { publicationTo: 'publication-user-2-protocol-1-live', draft: false }
                ]
            }
        },
        versions: {
            create: {
                id: 'publication-user-5-data-1-live-v1',
                versionNumber: 1,
                title: 'Data of Complicated Table',
                content:
                    '<table><tbody><tr><td>Sc</td><td>7.0</td><td>12</td><td>15</td><td>&nbsp;</td><td>&nbsp;</td><td>16</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>12</td><td>10.3</td><td>11</td></tr><tr><td>Ti</td><td>3120</td><td>3180</td><td>3900</td><td>2400</td><td>2700</td><td>4200</td><td>3000</td><td>3000</td><td>4800</td><td>3400</td><td>3200</td><td>3000</td></tr><tr><td>V</td><td>53</td><td>59</td><td>98</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>70</td><td>62</td><td>60</td></tr><tr><td>Cr</td><td>35</td><td>76</td><td>80</td><td>&lt;50</td><td>19</td><td>82</td><td>60</td><td>43</td><td>72</td><td>58</td><td>59</td><td>35</td></tr><tr><td>Co</td><td>12</td><td>&nbsp;</td><td>17</td><td>35</td><td>8</td><td>17</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>18</td><td>13</td><td>10</td></tr><tr><td>Ni</td><td>19</td><td>19</td><td>38</td><td>25</td><td>13</td><td>43</td><td>25</td><td>27</td><td>33</td><td>27</td><td>23</td><td>20</td></tr><tr><td>Rb</td><td>110</td><td>&nbsp;</td><td>82</td><td>85</td><td>187</td><td>72</td><td>77</td><td>125</td><td>63</td><td>100</td><td>99</td><td>112</td></tr><tr><td>Zr</td><td>237</td><td>190</td><td>188</td><td>135</td><td>180</td><td>148</td><td>117</td><td>154</td><td>197</td><td>172</td><td>186</td><td>190</td></tr><tr><td>Nb</td><td>26</td><td>&nbsp;</td><td>12</td><td>4</td><td>&nbsp;</td><td>9.1</td><td>&nbsp;</td><td>11</td><td>10</td><td>12</td><td>(23)</td><td>25</td></tr><tr><td>Cs</td><td>&nbsp;</td><td>&nbsp;</td><td>3.55</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3.6</td><td>3.6</td><td>3.7</td></tr><tr><td>Ba</td><td>1070</td><td>730</td><td>678</td><td>795</td><td>590</td><td>749</td><td>420</td><td>701</td><td>775</td><td>723</td><td>754</td><td>550</td></tr><tr><td>La</td><td>32.3</td><td>71</td><td>34.8</td><td>55</td><td>43</td><td>27</td><td>23</td><td>45</td><td>32</td><td>40</td><td>(43)</td><td>30</td></tr><tr><td>Hf</td><td>5.8</td><td>&nbsp;</td><td>5.12</td><td>&nbsp;</td><td>&nbsp;</td><td>4.4</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>5.1</td><td>5.7</td><td>5.8</td></tr><tr><td>Ta</td><td>5.7</td><td>&nbsp;</td><td>0.74</td><td>&nbsp;</td><td>&nbsp;</td><td>0.67</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&hellip;</td><td>&hellip;</td><td>2.2</td></tr><tr><td>Pb</td><td>17</td><td>18</td><td>18</td><td>&nbsp;</td><td>&nbsp;</td><td>14</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>17</td><td>18</td><td>20</td></tr><tr><td>Th</td><td>10.3</td><td>10.8</td><td>8.95</td><td>&nbsp;</td><td>13</td><td>6.2</td><td>7.9</td><td>14</td><td>&nbsp;</td><td>10.2</td><td>9.8</td><td>10.7</td></tr><tr><td colspan="13">&nbsp;</td></tr><tr><td></td><td>5.56</td><td>&nbsp;</td><td>&nbsp;</td><td>0.95</td><td>0.01</td><td>0.05</td><td>0.02</td><td>2.16</td><td>0.20</td><td>0.06</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><table><tbody><tr><td>Sc</td><td>13.3</td><td>13.4</td><td>10.5</td><td>16</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>11</td><td>13.6</td></tr><tr><td>Ti</td><td>3300</td><td>3200</td><td>&nbsp;</td><td>3700</td><td>&nbsp;</td><td>4555</td><td>3600</td><td>3000</td>d>4100</td></tr><tr><td>V</td><td>86</td><td>86</td><td>&nbsp;</td><td>110</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>60</td><td>107</td></tr><tr><td>Cr</td><td>104</td><td>112</td><td>74</td><td>84</td><td>&nbsp;</td><td>&nbsp;</td><td>47</td><td>35</td><td>83</td></tr><tr><td>Co</td><td>18</td><td>18</td><td>13</td><td>15</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>10</td><td>17</td></tr><tr><td>Ni</td><td>56</td><td>60</td><td>50</td><td>38</td><td>&nbsp;</td><td>&nbsp;</td><td>21</td><td>20</td><td>44</td></tr><tr><td>Rb</td><td>83</td><td>87</td><td>108</td><td>85</td><td>&nbsp;</td><td>&nbsp;</td><td>108</td><td>112</td><td>(112)</td></tr><tr><td>Zr</td><td>160</td><td>162</td><td>89</td><td>135</td><td>&nbsp;</td><td>&nbsp;</td><td>175</td><td>190</td><td>(190)</td></tr><tr><td>Nb</td><td>9.8</td><td>10.3</td><td>&nbsp;</td><td>9</td><td>&nbsp;</td><td>13.7</td><td>12</td><td>25</td><td>12</td></tr><tr><td>Cs</td><td>&nbsp;</td><td>&nbsp;</td><td>2.7</td><td>5.5</td><td>5.8</td><td>7.3</td><td>&nbsp;</td><td>3.7</td><td>4.6</td></tr><tr><td>Ba</td><td>633</td><td>626</td><td>630</td><td>458</td><td>668</td><td>&nbsp;</td><td>705</td><td>550</td><td>(550)</td></tr><tr><td>La</td><td>28.4</td><td>29.0</td><td>29.7</td><td>21.7</td><td>&nbsp;</td><td>&nbsp;</td><td>33</td><td>30</td><td>(30)</td></tr><tr><td>Hf</td><td>4.3</td><td>4.4</td><td>2.1</td><td>4.1</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>5.8</td><td>(5.8)</td></tr><tr><td>Ta</td><td>0.79</td><td>0.82</td><td>0.9</td><td>0.72</td><td>1.5</td><td>0.96</td><td>&nbsp;</td><td>2.2</td><td>1.0</td></tr><tr><td>Pb</td><td>17</td><td>18</td><td>17.9</td><td>16.9</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>20</td><td>17</td></tr><tr><td>Th</td><td>8.6</td><td>9.1</td><td>8.8</td><td>8.3</td><td>&nbsp;</td><td>&nbsp;</td><td>11</td><td>10.7</td><td>(10.7)</td></tr></tbody></table>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                createdAt: '2021-04-30T16:51:42.523Z',
                updatedAt: '2021-09-13T16:51:42.523Z',
                user: { connect: { id: users.user5 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2021-09-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2021-09-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-5-analysis-1-live',
        doi: '10.82259/publication-user-5-analysis-1-live',
        type: 'ANALYSIS',
        linkedTo: {
            createMany: {
                data: [
                    { publicationTo: 'publication-user-5-data-1-live', draft: false },
                    { publicationTo: 'publication-user-1-data-1-live', draft: false },
                    { publicationTo: 'publication-user-2-data-1-live', draft: false }
                ]
            }
        },
        versions: {
            create: {
                id: 'publication-user-5-analysis-1-live-v1',
                versionNumber: 1,
                title: 'Analysis for Expert elicitation on the relative importance of possible SARS-CoV-2 transmission routes and the effectiveness of mitigations',
                content:
                    '<p>Participants in round 1 had already raised the possible effects of humidity and temperature, natural leakage rates of a building affecting air change rates, the physical location of the two people relative to each other and any furniture, and the potential influence of other people on the indoor setting. For the outdoor scenario, wind speed, turbulence and obstructions as well as temperature and humidity were raised as likely significant factors. Participants disagreed in their opinions on whether there would be any reduction at all of infectious virus in the air, regardless of whether the moisture component of the exhaled air evaporated (which itself was contended). Some thought that the viral elements, even in the small droplets, might settle onto surfaces over time. There was near universal agreement that the necessary experiments had not yet been done, exploring air flow patterns using suitable tracers within a number of realistic situations compared against data with actual viral particles. Dispersion with distance: Participants were then asked to consider the effects of distance, by considering the percentage loss if the infected and susceptible person were either closer than 2 m or further apart than 2 m. Participants rated the quality of the evidence behind their estimates on the effects of distance as 3.0 for aerosols and 3.25 for small particles. A summary of their estimates is shown in table 5, and again participants’ responses showed considerable variability (see online supplemental information 5).</p> <p> One participant pointed out that if participants are closer than 2 m apart then the size of an unventilated room is essentially irrelevant. In ventilated rooms, the design of the ventilation and resulting airflow patterns relative to the location of individuals may become important. Outdoors, the amount of ambient air flow in most scenarios means that beyond 2 m distance participants suggest transmission is very unlikely. Measures to protect the susceptible person: Finally, participants were asked to estimate any additional percentage loss that might be caused by the susceptible person being behind a face covering or shield (assuming an appropriate fit and no accompanying behaviour change). There was general agreement that exposure to larger particles would likely be reduced more than smaller ones. When it came to a plastic face visor, some thought that may even increase exposure to small droplets. See table 6. </p><p>A few participants mentioned other potential mitigation measures, such as air cleaning (although there was no clear evidence of efficacy that they could cite), or personal ventilation systems.35–41 Pathway 4: factors affecting surface transmission of the virus In this, the largest individual section of the survey, participants were asked their opinions on a range of questions involving the transfer of infectious SARS-CoV-2 virus from large droplets (>100 μm) to surfaces and a susceptible person’s hands. Six participants contributed data to this section. Fate of large droplets: For four scenarios, participants were asked for their estimates of the proportions of virus they thought likely to be transmitted from large droplets to the hands of an infected person onto all surrounding surfaces, or directly onto the hands of a susceptible person, compared with those likely to remain in the air (ie, going on to pathway 5). Generally there was agreement that the amount of virus going directly onto the hands of a susceptible person was likely to be very small, and that droplets of this size would mostly tend to fall quite rapidly onto surfaces (table 7). Round 1 data did not obviously show a bimodal distribution in the responses. However, round 2 responses do indicate variations of opinion (see online supplemental information 6). For example, estimates of whether the amount of virus transmitted to surrounding surfaces would be above the indicated range (upper boundary 58.1%), in a situation where participants were not in direct contact, ranged from 1% to 64%. Similar differences are seen in many of the other estimates. We note that these values might also change if symptoms such as a runny nose are features of infection.</p> <cite>This material is adapted from the following article under the CC BY-NC: Freeman AL, Parker S, Noakes C, Fitzgerald S, Smyth A, Macbeth R, Spiegelhalter D, Rutter H. Expert elicitation on the relative importance of possible SARS-CoV-2 transmission routes and the effectiveness of mitigations. BMJ Open. 2021 Dec 1;11(12):e050869. <a href="https://pubmed.ncbi.nlm.nih.gov/34853105/">https://pubmed.ncbi.nlm.nih.gov/34853105/</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-03-01T15:51:42.523Z',
                createdAt: '2021-09-25T16:51:42.523Z',
                updatedAt: '2021-09-25T16:51:42.523Z',
                user: { connect: { id: users.user5 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-6-hypothesis-1-live',
        doi: '10.82259/publication-user-6-hypothesis-1-live',
        type: 'HYPOTHESIS',
        linkedTo: { create: { publicationTo: 'publication-user-1-problem-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-6-hypothesis-1-live-v1',
                versionNumber: 1,
                title: 'Live Hypothesis of Visible winds: The production of new visibilities of wind energy in West Germany, 1973–1991',
                content:
                    '<h2>Abstract</h2><p>The use of energy from wind has a multi-faceted relationship to visibility. Between 1973 and 1991, various actors in the West German environmental movement made assertions about the visibility of renewable sources of power, but wind energy took on a particular prominence. In this article, the question of how different actors have used knowledge and the materiality of wind turbines for competing purposes is explored. Environmentalists attempted to create visible signs of a valid alternative energy future by tinkering with small, decentralized wind turbines, while the Federal Republic of Germany\'s Ministry of Research and established energy providers used the failure of the state-subsidized large-scale wind-energy project GROWIAN to criticize renewables and brand their application as misguided. In both cases, actors created new wind energy visibilities to convey their conflicting interests—pitting those advocating a new, environmentally friendly energy system against those who sought consolidation of the large-scale fossil-nuclear energy system.</p> <cite>This material is adapted from the following article under the Attribution 4.0 International: Hesse, Nicole, 2021. Visible winds: The production of new visibilities of wind energy in West Germany, 1973–1991. Centaurus 63:4. <a href="https://onlinelibrary.wiley.com/doi/10.1111/1600-0498.12420/">https://onlinelibrary.wiley.com/doi/10.1111/1600-0498.12420</cite>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                createdAt: '2021-09-25T16:51:42.523Z',
                updatedAt: '2021-09-25T16:51:42.523Z',
                user: { connect: { id: users.user6 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-6-hypothesis-2-draft',
        doi: '10.82259/publication-user-6-hypothesis-2-draft',
        type: 'HYPOTHESIS',
        linkedTo: { create: { publicationTo: 'publication-user-1-problem-1-live' } },
        versions: {
            create: {
                id: 'publication-user-6-hypothesis-2-draft-v1',
                versionNumber: 1,
                title: 'Visible winds: The production of new visibilities of wind energy in West Germany, 1973–1991',
                content:
                    '<h2>Abstract</h2><p>The use of energy from wind has a multi-faceted relationship to visibility. Between 1973 and 1991, various actors in the West German environmental movement made assertions about the visibility of renewable sources of power, but wind energy took on a particular prominence. In this article, the question of how different actors have used knowledge and the materiality of wind turbines for competing purposes is explored. Environmentalists attempted to create visible signs of a valid alternative energy future by tinkering with small, decentralized wind turbines, while the Federal Republic of Germany\'s Ministry of Research and established energy providers used the failure of the state-subsidized large-scale wind-energy project GROWIAN to criticize renewables and brand their application as misguided. In both cases, actors created new wind energy visibilities to convey their conflicting interests—pitting those advocating a new, environmentally friendly energy system against those who sought consolidation of the large-scale fossil-nuclear energy system.</p> <cite>This material is adapted from the following article under the Attribution 4.0 International: Hesse, Nicole, 2021. Visible winds: The production of new visibilities of wind energy in West Germany, 1973–1991. Centaurus 63:4. <a href="https://onlinelibrary.wiley.com/doi/10.1111/1600-0498.12420/">https://onlinelibrary.wiley.com/doi/10.1111/1600-0498.12420</cite>',
                currentStatus: 'DRAFT',
                createdAt: '2021-09-25T16:51:42.523Z',
                updatedAt: '2021-09-25T16:51:42.523Z',
                user: { connect: { id: users.user6 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-7-problem-1-live',
        doi: '10.82259/publication-user-7-problem-1-live',
        type: 'PROBLEM',
        linkedTo: {
            createMany: {
                data: [
                    { publicationTo: 'publication-user-1-problem-1-live', draft: false },
                    { publicationTo: 'publication-user-1-hypothesis-1-live', draft: false },
                    { publicationTo: 'publication-user-1-protocol-1-live', draft: false },
                    { publicationTo: 'publication-user-1-data-1-live', draft: false },
                    { publicationTo: 'publication-user-1-analysis-1-live', draft: false },
                    { publicationTo: 'publication-user-1-interpretation-1-live', draft: false }
                ]
            }
        },
        versions: {
            create: {
                id: 'publication-user-7-problem-1-live-v1',
                versionNumber: 1,
                title: 'New problem branched off of other published publications',
                conflictOfInterestStatus: true,
                conflictOfInterestText:
                    'This publication has a conflict of interest because the author has paid consultancy.',
                content: 'This problem is a new problem that is linked to 6 other publication types.',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2021-10-25T15:51:42.523Z',
                createdAt: '2022-01-23T15:51:42.523Z',
                updatedAt: '2022-01-25T15:51:42.523Z',
                user: { connect: { id: users.user7 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-25T16:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-7-peer-review-1-live',
        doi: '10.82259/publication-user-7-peer-review-1-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-2-analysis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-7-peer-review-1-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Analysis of the data from a retrospective cohort study of 191 inpatients in Wuhan with COVID-19',
                content:
                    '<h2>Peer Review of Analysis of the data from a retrospective cohort study of 191 inpatients in Wuhan with COVID-19</h2><p>This is the first comprehensive review in this field.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2009-06-23T15:51:42.523Z',
                user: { connect: { id: users.user7 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-7-peer-review-2-draft',
        doi: '10.82259/publication-user-7-peer-review-2-draft',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-2-analysis-1-live' } },
        versions: {
            create: {
                id: 'publication-user-7-peer-review-2-draft-v1',
                versionNumber: 1,
                title: 'Draft Peer Review of Analysis of the data from a retrospective cohort study of 191 inpatients in Wuhan with COVID-19',
                content: '<h2>Title</h2><p>TBC</p>',
                currentStatus: 'DRAFT',
                createdAt: '2021-09-25T16:51:42.523Z',
                updatedAt: '2021-09-25T16:51:42.523Z',
                user: { connect: { id: users.user7 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-7-peer-review-3-live',
        doi: '10.82259/publication-user-7-peer-review-3-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-5-analysis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-7-peer-review-3-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Analysis for Expert elicitation on the relative importance of possible SARS-CoV-2 transmission routes and the effectiveness of mitigations',
                content:
                    '<h2>Peer Review</h2><p>This is a detailed analysis, very useful to the research literature within this area. Good use of the data to feed into this analysis.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-03-01T15:51:42.523Z',
                createdAt: '2021-09-25T16:51:42.523Z',
                updatedAt: '2021-09-25T16:51:42.523Z',
                user: { connect: { id: users.user7 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-1-live',
        doi: '10.82259/publication-user-3-peer-review-1-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-2-real-world-application-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-1-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Conclusions from the data on the use of asthma/COPD treatments in COVID-19',
                content:
                    '<p>Not a very in depth conclusion. Missing key themes from the research. Very basic summation of how the data affects this conclusion.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2021-09-29T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-2-live',
        doi: '10.82259/publication-user-3-peer-review-2-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-1-hypothesis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-2-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Hypothesis of Improving the quality of life for sustainable development',
                content:
                    '<p>Not a very in depth conclusion. Missing key themes from the research. Very basic summation of how the data affects this conclusion.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2012-01-29T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-3-live',
        doi: '10.82259/publication-user-3-peer-review-3-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-1-data-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-3-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Data attached to Improving the quality of life for sustainable development',
                content: '<p>Dataset not fully explained</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2020-01-15T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-4-live',
        doi: '10.82259/publication-user-3-peer-review-4-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-1-interpretation-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-4-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Interpretation of Improving the quality of life for sustainable development',
                content:
                    '<p>Not a very in depth conclusion. Missing key themes from the research. Very basic summation of how the data affects this conclusion.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2020-02-14T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-5-live',
        doi: '10.82259/publication-user-3-peer-review-5-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-2-hypothesis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-5-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Conducting a meta-analysis of studies of the R0 will help improve estimates',
                content:
                    '<p>Not a very in depth conclusion. Missing key themes from the research. Very basic summation of how the data affects this conclusion.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-6-live',
        doi: '10.82259/publication-user-3-peer-review-6-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-2-protocol-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-6-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Method for meta-analysis of studies of R0 for COVID-19',
                content:
                    '<p>Not a very in depth method. Missing key themes from the research. Very basic summation of how the data affects this conclusion.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2019-01-01T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-7-live',
        doi: '10.82259/publication-user-3-peer-review-7-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-2-analysis-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-7-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Analysis of the data from a retrospective cohort study of 191 inpatients in Wuhan with COVID-19',
                content:
                    '<p>Not a very in depth conclusion. Missing key themes from the research. Very basic summation of how the data affects this conclusion.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-8-live',
        doi: '10.82259/publication-user-3-peer-review-8-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-4-protocol-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-8-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Protocol for Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers',
                content: '<p>Very good research...</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2021-01-02T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-9-live',
        doi: '10.82259/publication-user-3-peer-review-9-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-4-real-world-application-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-9-live-v1',
                versionNumber: 1,
                title: 'Peer Review of Conclusion to Messy or Ordered? Multiscale Mechanics Dictates Shape-Morphing of 2D Networks Hierarchically Assembled of Responsive Microfibers',
                content: '<p>Impeccable conclusion.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-24T18:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-10-draft',
        doi: '10.82259/publication-user-3-peer-review-10-draft',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-2-interpretation-1-live' } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-10-draft-v1',
                versionNumber: 1,
                title: 'Review of Interpretation of the results from pathology of a patient who died of COVID-19 in Wuhan',
                currentStatus: 'DRAFT',
                user: { connect: { id: users.user3 } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-user-3-peer-review-11-live',
        doi: '10.82259/publication-user-3-peer-review-11-live',
        type: 'PEER_REVIEW',
        linkedTo: { create: { publicationTo: 'publication-user-1-problem-1-live', draft: false } },
        versions: {
            create: {
                id: 'publication-user-3-peer-review-11-live-v1',
                versionNumber: 1,
                title: 'Review of Problem: What is the connection between human needs and sustainable development?',
                content: '<p>This problem has been explored before.</p>',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: users.user3 } },
                publicationStatus: { create: [{ status: 'LIVE', createdAt: '2022-01-21T10:00:42.523Z' }] }
            }
        }
    }
];

export default newPublicationSeeds;
