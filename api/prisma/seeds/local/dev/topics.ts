import { Prisma } from '@prisma/client';

const topics: Prisma.TopicCreateInput[] = [
    {
        id: 'clkv6uiba001il2rsb9i7dka8',
        title: 'What makes everything we can detect in the universe around us the way that it is, and why?'
    },
    {
        id: 'clkv6uoi102e6l2rs3bu1xo8b',
        title: 'mosaic virus'
    },
    {
        id: 'clkv6uibe001kl2rsmoghv4f8',
        title: 'Philosophy, Psychology, and Religion',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uibj001ml2rs21wcksva',
        title: 'Auxiliary Sciences of History',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uibo001ol2rs28ahmsia',
        title: 'History',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uibt001ql2rsubu4f0bp',
        title: 'Geography, Anthropology, and Recreation',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uiby001sl2rswao58rwg',
        title: 'Social Sciences',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uic7001ul2rs4gvln7x8',
        title: 'Political Science',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uicc001wl2rsctkelkiz',
        title: 'Law',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uick001yl2rsah3paagu',
        title: 'Education',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uicq0020l2rs1c1mx1hy',
        title: 'Music',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uicw0022l2rs16cpw15l',
        title: 'Fine Arts',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uid20024l2rsvzkyu0d0',
        title: 'Language and Literature',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uidc0026l2rs6fbvymtt',
        title: 'Science',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uidt002cl2rsk7kuhliy',
        title: 'Technology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uidy002el2rsrw12sj6v',
        title: 'Military Science',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uie3002gl2rs4hj7swkt',
        title: 'Naval Science',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6uidh0028l2rsv6gu1z7u',
        title: 'Medicine and care',
        parents: {
            connect: [
                {
                    id: 'clkv6uiba001il2rsb9i7dka8'
                }
            ]
        }
    },
    {
        id: 'clkv6ui7y0008l2rsv5gbxyzp',
        title: 'Germany',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui83000al2rslhajo8rz',
        title: 'Greco-Roman World',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui87000cl2rssv4wpjx0',
        title: 'Greece',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui8c000el2rsqazyv85t',
        title: 'Italy - Malta',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui8h000gl2rs7gtpc8uv',
        title: 'Low Countries - Benelux Countries',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui8m000il2rsns5148w8',
        title: 'Netherlands (Holland)',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui8r000kl2rszwpp0qpk',
        title: 'Eastern Europe (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui8w000ml2rsstngnzi4',
        title: 'Russia. Soviet Union. Former Soviet Republics - Poland',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui90000ol2rsym476o78',
        title: 'Northern Europe. Scandinavia',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui95000ql2rsotjo9z3u',
        title: 'Spain - Portugal',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui9a000sl2rsoj39nwha',
        title: 'Switzerland',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui9e000ul2rs4m0gmdmv',
        title: 'Balkan Peninsula',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui9j000wl2rs7k3ydz36',
        title: 'Asia',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui9n000yl2rsfhxl579g',
        title: 'Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui9s0010l2rs891jyea1',
        title: 'Oceania (South Seas)',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ui9w0012l2rso3nw92or',
        title: 'Romanies',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6uia10014l2rslrpfnjlb',
        title: 'Americas',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6uia50016l2rs51aatj04',
        title: 'Geography (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uiab0018l2rs6fovh0jd',
        title: 'Mathematical geography. Cartography',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uiag001al2rsf378bj60',
        title: 'Physical geography',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uial001cl2rsge4rgyu3',
        title: 'Oceanography',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uiap001el2rstc6g46k4',
        title: 'Environmental Sciences',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uie8002il2rsq94ydwpe',
        title: 'History (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6uiee002kl2rs6ds2q583',
        title: 'Great Britain',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6uiej002ml2rs6kk8ghpg',
        title: 'Central Europe',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6uieo002ol2rs6dvcgk7e',
        title: 'Austria - Liechtenstein - Hungary - Czechoslovakia',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6uieu002ql2rsfpv13zo3',
        title: 'France - Andorra - Monaco',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6uiey002sl2rst38wtudi',
        title: 'Human ecology. Anthropogeography',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uif3002ul2rshsq00r6h',
        title: 'Anthropology',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uif8002wl2rso8n11w8w',
        title: 'Folklore',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uifc002yl2rsgbu5pr89',
        title: 'Manners and customs (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uifi0030l2rs04184e2h',
        title: 'Recreation. Leisure',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'clkv6uifo0032l2rss499377e',
        title: 'Social Sciences (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uift0034l2rs2z3bsskm',
        title: 'Statistics',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uiga003al2rs5qdze4nr',
        title: 'Industries. Land use. Labor',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uigf003cl2rsanvnjdgl',
        title: 'Transportation and communications',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uigk003el2rswm10fyv8',
        title: 'Commerce',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uigp003gl2rspcc4j1jx',
        title: 'Finance',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uih0003il2rse0gf3xps',
        title: 'Public finance',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uih6003kl2rspbobfpy8',
        title: 'Sociology (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uihb003ml2rsxlkhas5d',
        title: 'Social history and conditions. Social problems. Social reform',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uihq003ql2rsg1wpsxcl',
        title: 'Societies: secret, benevolent, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uii4003wl2rsx5ty3cvw',
        title: 'Socialism. Communism. Anarchism',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uiid0040l2rsce9eo31x',
        title: 'Religious law in general. Comparative religious law. Jurisprudence',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uiih0042l2rskjkdjc9o',
        title: 'Jewish law',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uiim0044l2rs468u3qec',
        title: 'Islamic law',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uiiq0046l2rsfoyes1hp',
        title: 'History of canon law',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uiiu0048l2rstpfgwipq',
        title: 'Law of the Roman Catholic Church. The Holy See',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uiiz004al2rse7802jjf',
        title: 'United Kingdom and Ireland',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uii8003yl2rsc73ua7b5',
        title: 'Law in General',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uifz0036l2rsmcyhgjwb',
        title: 'Economic theory',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uihv003sl2rs3y8ccll7',
        title: 'Communities and demographics',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uihz003ul2rs01rx3lij',
        title: 'Social pathology and criminology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uig50038l2rs51tojhtj',
        title: 'Economic conditions and history',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6uij3004cl2rsv8jyx9w8',
        title: 'America. North America',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uija004el2rsnfzbn9aj',
        title: 'Canada',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uije004gl2rsb5s71y2l',
        title: 'United States',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uijk004il2rshma9nm3j',
        title: 'Latin America - Mexico and Central America - West Indies. Caribbean area',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uijs004kl2rs6zqwfo34',
        title: 'South America',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uijy004ml2rsccfbflxr',
        title: 'Europe',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uik3004ol2rszoh2tc7c',
        title: 'Asia and Eurasia, Africa, Pacific Area, and Antarctica',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uik8004ql2rstg0rt6jz',
        title: 'Law of nations',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'clkv6uikc004sl2rs74ls77fb',
        title: 'Education (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'clkv6uikh004ul2rsppnri7f8',
        title: 'History of education',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'clkv6uikl004wl2rshb0gov0x',
        title: 'Theory and practice of education',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'clkv6uikp004yl2rs73oct562',
        title: 'Special aspects of education',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'clkv6uilc0058l2rssruw0fq3',
        title: 'College and school magazines and papers',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'clkv6uilm005cl2rsx9weklg5',
        title: 'Visual arts',
        parents: {
            connect: [
                {
                    id: 'clkv6uicw0022l2rs16cpw15l'
                }
            ]
        }
    },
    {
        id: 'clkv6uilr005el2rsoak021o0',
        title: 'Architecture',
        parents: {
            connect: [
                {
                    id: 'clkv6uicw0022l2rs16cpw15l'
                }
            ]
        }
    },
    {
        id: 'clkv6uilw005gl2rs4159v06c',
        title: 'Sculpture',
        parents: {
            connect: [
                {
                    id: 'clkv6uicw0022l2rs16cpw15l'
                }
            ]
        }
    },
    {
        id: 'clkv6uim1005il2rs09cnigt6',
        title: 'Drawing. Design. Illustration',
        parents: {
            connect: [
                {
                    id: 'clkv6uicw0022l2rs16cpw15l'
                }
            ]
        }
    },
    {
        id: 'clkv6uimd005kl2rsdhpodz4n',
        title: 'Painting',
        parents: {
            connect: [
                {
                    id: 'clkv6uicw0022l2rs16cpw15l'
                }
            ]
        }
    },
    {
        id: 'clkv6uimi005ml2rskdan8yvo',
        title: 'Print media',
        parents: {
            connect: [
                {
                    id: 'clkv6uicw0022l2rs16cpw15l'
                }
            ]
        }
    },
    {
        id: 'clkv6uimx005ol2rs6cn99lbc',
        title: 'Decorative arts',
        parents: {
            connect: [
                {
                    id: 'clkv6uicw0022l2rs16cpw15l'
                }
            ]
        }
    },
    {
        id: 'clkv6uin2005ql2rsomudbp39',
        title: 'Arts in general',
        parents: {
            connect: [
                {
                    id: 'clkv6uicw0022l2rs16cpw15l'
                }
            ]
        }
    },
    {
        id: 'clkv6uin7005sl2rs804sohqf',
        title: 'Philology. Linguistics',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uinb005ul2rsnwxgambh',
        title: 'Greek language and literature. Latin language and literature',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uing005wl2rsyon9fpj3',
        title: 'Modern languages. Celtic languages',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uinl005yl2rsp0k4dr0b',
        title: 'Romanic languages',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uinq0060l2rs5439m1eo',
        title: 'Germanic languages. Scandinavian languages',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uinv0062l2rsknojg32z',
        title: 'English language',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uinz0064l2rs23w45m6k',
        title: 'West Germanic languages',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uio70066l2rs5xk344cd',
        title: 'Slavic languages. Baltic languages. Albanian language',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uioe0068l2rsokpr0nit',
        title: 'Uralic languages. Basque language',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uiok006al2rs72c0486p',
        title: 'Oriental languages and literatures',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uior006cl2rsbhrivws6',
        title: 'Indo-Iranian languages and literatures',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uiow006el2rs9dznsu6o',
        title: 'Languages and literatures of Eastern Asia, Africa, Oceania',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uip2006gl2rsgjx3c1hb',
        title: 'Hyperborean, Indian, and artificial languages',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uip7006il2rszujj7193',
        title: 'Literature (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uipd006kl2rs0gdf1y6m',
        title: 'French literature - Italian literature - Spanish literature - Portuguese literature',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uiph006ml2rsb52zlvw6',
        title: 'English literature',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uipm006ol2rsdkwhz40i',
        title: 'American literature',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uipq006ql2rs4e4bex1a',
        title: 'Fiction and juvenile belles lettres',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uipw006sl2rsc9bvqt4q',
        title: 'Science (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uiq1006ul2rs307fcz5p',
        title: 'Mathematics',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uiq6006wl2rstcdpuok4',
        title: 'Astronomy',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uiqb006yl2rswqz1n2u3',
        title: 'Physics',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uiqi0070l2rsvvg5kbis',
        title: 'Chemistry',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uiqo0072l2rsplkmhbxb',
        title: 'Geology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uiqu0074l2rstds34z8q',
        title: 'Biology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uiqz0076l2rse4zmuyv9',
        title: 'Botany',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uir40078l2rsp2xvet66',
        title: 'Zoology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uira007al2rsw1i0mqzp',
        title: 'Human anatomy',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uirf007cl2rs5jaofpzr',
        title: 'Physiology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uirl007el2rs8m9kxmhp',
        title: 'Microbiology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                }
            ]
        }
    },
    {
        id: 'clkv6uirq007gl2rslef9w0la',
        title: 'Medicine (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uirv007il2rsxv47dw45',
        title: 'Public aspects of medicine',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uis0007kl2rs4s0w8xxe',
        title: 'Pathology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uis5007ml2rsmdas1r2p',
        title: 'Inherited diseases',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uis9007ol2rscww8jqhv',
        title: 'Internal medicine',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uise007ql2rsazisnkq7',
        title: 'Surgery',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uisi007sl2rs74jseior',
        title: 'Ophthalmology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uisp007ul2rs9esba45j',
        title: 'Otorhinolaryngology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uisu007wl2rsi3y77wzq',
        title: 'Gynecology and obstetrics',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uisz007yl2rsropt9539',
        title: 'Pediatrics',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uit40080l2rs4wqpraxg',
        title: 'Dentistry',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uit90082l2rsuow3o69t',
        title: 'Dermatology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uitk0084l2rsqq4s4ukx',
        title: 'Therapeutics. Pharmacology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uitv0086l2rs53w275x6',
        title: 'Pharmacy and materia medica',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uiu00088l2rs8juyw9zb',
        title: 'Nursing',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uiu9008al2rs0097yf3y',
        title: 'Botanic, Thomsonian, and eclectic medicine',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uiud008cl2rs75qyf4t1',
        title: 'Homeopathy',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uiui008el2rsuqu34qfu',
        title: 'Other systems of medicine',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                }
            ]
        }
    },
    {
        id: 'clkv6uivq008sl2rsh8muvs18',
        title: 'Technology (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uiw0008wl2rsgixmq1s5',
        title: 'Hydraulic engineering. Ocean engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uiw5008yl2rshxpbd39q',
        title: 'Environmental technology. Sanitary engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uiwl0090l2rshs1ekb0w',
        title: 'Highway engineering. Roads and pavements',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uiwq0092l2rsur74axhr',
        title: 'Railroad engineering and operation',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uiwx0094l2rs23k3n48x',
        title: 'Bridge engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uix10096l2rs6utezvbo',
        title: 'Building construction',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uix60098l2rsr98k7iur',
        title: 'Mechanical engineering and machinery',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uixa009al2rs677oojle',
        title: 'Electrical engineering. Electronics. Nuclear engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uixg009cl2rsstuu3w6z',
        title: 'Motor vehicles. Aeronautics. Astronautics',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uixl009el2rs82qf9jzv',
        title: 'Mining engineering. Metallurgy',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uixq009gl2rsozmvgr1w',
        title: 'Chemical technology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uixv009il2rs4i0jm22v',
        title: 'Photography',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uixz009kl2rs3gik1btu',
        title: 'Manufactures',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uiy4009ml2rsqxlct3nj',
        title: 'Handicrafts. Arts and crafts',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6uiy9009ol2rsub7ycbuz',
        title: 'House and home',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6ukkt00vgl2rsd8a3j0ji',
        title: 'The Islamic World',
        parents: {
            connect: [
                {
                    id: 'clkv6uibo001ol2rs28ahmsia'
                }
            ]
        }
    },
    {
        id: 'clkv6ulyc01eul2rs326z8voe',
        title: 'The family. Marriage. Home',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'clkv6unbi01wwl2rs9vx32k1b',
        title: 'materials science',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'clkv6upmw02til2rsrq5otsg3',
        title: 'Ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6uibe001kl2rsmoghv4f8'
                }
            ]
        }
    },
    {
        id: 'clkv6upnj02tql2rsq1aglvh5',
        title: 'Philosophy (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uibe001kl2rsmoghv4f8'
                }
            ]
        }
    },
    {
        id: 'clkv6uppx02usl2rs2lri2dub',
        title: 'Logic',
        parents: {
            connect: [
                {
                    id: 'clkv6uibe001kl2rsmoghv4f8'
                }
            ]
        }
    },
    {
        id: 'clkv6upq202uul2rs71vfudyj',
        title: 'Speculative philosophy',
        parents: {
            connect: [
                {
                    id: 'clkv6uibe001kl2rsmoghv4f8'
                }
            ]
        }
    },
    {
        id: 'clkv6upq602uwl2rsf928hpia',
        title: 'Psychology',
        parents: {
            connect: [
                {
                    id: 'clkv6uibe001kl2rsmoghv4f8'
                }
            ]
        }
    },
    {
        id: 'clkv6upqa02uyl2rs2v443zg7',
        title: 'Aesthetics',
        parents: {
            connect: [
                {
                    id: 'clkv6uibe001kl2rsmoghv4f8'
                }
            ]
        }
    },
    {
        id: 'clkv6upqj02v0l2rshhv9tj7i',
        title: 'Religions, mythology and rationalism in general',
        parents: {
            connect: [
                {
                    id: 'clkv6uibe001kl2rsmoghv4f8'
                }
            ]
        }
    },
    {
        id: 'clkv6uptk02w2l2rsnv2vsqyc',
        title: 'Auxiliary Sciences of History (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6uptp02w4l2rsfxre60ks',
        title: 'History of Civilization',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6uptt02w6l2rse7k5p4ao',
        title: 'Archaeology',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6upty02w8l2rs6cip4e1q',
        title: 'Diplomatics. Archives. Seals',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6upu302wal2rsjxaj2ypk',
        title: 'Technical Chronology. Calendar',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6upuc02wcl2rselzt41tr',
        title: 'Numismatics',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6upuh02wel2rsyf8knd7n',
        title: 'Inscriptions. Epigraphy',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6upum02wgl2rsqt8xcels',
        title: 'Heraldry',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6upus02wil2rsiwewaabd',
        title: 'Genealogy',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6upuy02wkl2rs3890351x',
        title: 'Biography',
        parents: {
            connect: [
                {
                    id: 'clkv6uibj001ml2rs21wcksva'
                }
            ]
        }
    },
    {
        id: 'clkv6upv302wml2rsnht19lt7',
        title: 'German literature - Dutch literature - Flemish literature since 1830 - Afrikaans literature - Scandinavian literature- Old Norse literature: Old Icelandic and Old Norwegian - Modern Icelandic literature - Faroese literature - Danish literature - Norwegian literature - Swedish literature',
        parents: {
            connect: [
                {
                    id: 'clkv6uid20024l2rsvzkyu0d0'
                }
            ]
        }
    },
    {
        id: 'clkv6uili005al2rsapxo00ib',
        title: 'Student fraternities and societies',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'clkv6uivv008ul2rs2ykdg8np',
        title: 'Engineering (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'cly468yoi00017ryzu49uigcw',
        title: 'Armed Conflict',
        parents: {
            connect: [
                {
                    id: 'clkv6uidy002el2rsrw12sj6v'
                }
            ]
        }
    },
    {
        id: 'cly468ypa00037ryzacwr3ufc',
        title: 'Arbitration and Mediation',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'cly468ytv000q7ryz4w8h6vtv',
        title: 'Diplomacy',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly468yu0000r7ryz7geu8rw9',
        title: 'Geopolitics',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly468ywr000z7ryzszujb6nl',
        title: 'Cyber warfare',
        parents: {
            connect: [
                {
                    id: 'clkv6uidy002el2rsrw12sj6v'
                }
            ]
        }
    },
    {
        id: 'cly468yyb00177ryzsvccai51',
        title: 'Computer science',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'cly468z0p001l7ryz5vfq79sl',
        title: 'Higher education institutions',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'cly468z0u001m7ryz1epuklc6',
        title: 'Further education institutions',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'cly468z1u001t7ryzkbpl2w86',
        title: 'Government',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly468z68002a7ryz50m4553u',
        title: 'Democracy',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly468z6d002b7ryzefcyh6ee',
        title: 'Dictatorship',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly468z6u002e7ryzlb1oxcau',
        title: 'Social and public welfare',
        parents: {
            connect: [
                {
                    id: 'clkv6uiby001sl2rswao58rwg'
                }
            ]
        }
    },
    {
        id: 'cly468zat00337ryz1omx361g',
        title: 'International relations',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly468zim004h7ryzps1o1krb',
        title: 'International law',
        parents: {
            connect: [
                {
                    id: 'clkv6uicc001wl2rsctkelkiz'
                }
            ]
        }
    },
    {
        id: 'cly468zlt00527ryz1vpeghn5',
        title: 'Libraries, museums and archives',
        parents: {
            connect: [
                {
                    id: 'clkv6uibt001ql2rsubu4f0bp'
                }
            ]
        }
    },
    {
        id: 'cly468zqm005p7ryz7f7aazbg',
        title: 'Media',
        parents: {
            connect: [
                {
                    id: 'clkv6uicw0022l2rs16cpw15l'
                }
            ]
        }
    },
    {
        id: 'cly468zrt005w7ryzxabklhk2',
        title: 'Military equipment',
        parents: {
            connect: [
                {
                    id: 'clkv6uidy002el2rsrw12sj6v'
                }
            ]
        }
    },
    {
        id: 'cly468zua006c7ryzoeeoajoc',
        title: 'Nanotechnology',
        parents: {
            connect: [
                {
                    id: 'clkv6uidt002cl2rsk7kuhliy'
                }
            ]
        }
    },
    {
        id: 'cly468zul006e7ryznuojk8m2',
        title: 'Ordnance clearance',
        parents: {
            connect: [
                {
                    id: 'clkv6uidy002el2rsrw12sj6v'
                }
            ]
        }
    },
    {
        id: 'cly468zxu006w7ryzr7rqosug',
        title: 'Primary education',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'cly469003007a7ryzllbo9p9s',
        title: 'Political crisis',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly469009007b7ryze3qayi3l',
        title: 'Political dissent',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly46900e007c7ryz2tppi1xh',
        title: 'Political process',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly46900k007d7ryz29mct3fe',
        title: 'Political development',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly46900q007e7ryz2e3k7f2u',
        title: 'Political parties and movements',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly46900w007f7ryz5lbe374x',
        title: 'Political leadership',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly469011007g7ryzi8dtz3hc',
        title: 'Political system',
        parents: {
            connect: [
                {
                    id: 'clkv6uic7001ul2rs4gvln7x8'
                }
            ]
        }
    },
    {
        id: 'cly46907g008l7ryzg3onr7u1',
        title: 'School',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                }
            ]
        }
    },
    {
        id: 'cly46907z008o7ryzot5yqt7g',
        title: 'Security measures (defence)',
        parents: {
            connect: [
                {
                    id: 'clkv6uidy002el2rsrw12sj6v'
                }
            ]
        }
    },
    {
        id: 'clkv6ui790000l2rs39iifv8f',
        title: 'Ireland',
        parents: {
            connect: [
                {
                    id: 'clkv6uiee002kl2rs6ds2q583'
                }
            ]
        }
    },
    {
        id: 'clkv6ui7h0002l2rsxsh5efd7',
        title: 'Fuel',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6uiye009ql2rs9q8qbex3',
        title: 'Evolution',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqu0074l2rstds34z8q'
                }
            ]
        }
    },
    {
        id: 'clkv6uiyj009sl2rskzws5x45',
        title: 'Genetics',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqu0074l2rstds34z8q'
                }
            ]
        }
    },
    {
        id: 'clkv6uiyn009ul2rsji8lyaau',
        title: 'Reproduction',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqu0074l2rstds34z8q'
                }
            ]
        }
    },
    {
        id: 'clkv6uiys009wl2rstc20lx8h',
        title: 'Life',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqu0074l2rstds34z8q'
                }
            ]
        }
    },
    {
        id: 'clkv6uiyx009yl2rs5jwx6s2x',
        title: 'Ecology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqu0074l2rstds34z8q'
                }
            ]
        }
    },
    {
        id: 'clkv6uiz100a0l2rsit4vanxx',
        title: 'Cytology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqu0074l2rstds34z8q'
                }
            ]
        }
    },
    {
        id: 'clkv6uiz600a2l2rs5byghw58',
        title: 'Economic biology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqu0074l2rstds34z8q'
                }
            ]
        }
    },
    {
        id: 'clkv6uizj00a8l2rs4aqpxc0n',
        title: 'Military and naval history',
        parents: {
            connect: [
                {
                    id: 'clkv6uie8002il2rsq94ydwpe'
                }
            ]
        }
    },
    {
        id: 'clkv6uizo00aal2rs8o8zf2uq',
        title: 'Political and diplomatic history',
        parents: {
            connect: [
                {
                    id: 'clkv6uie8002il2rsq94ydwpe'
                }
            ]
        }
    },
    {
        id: 'clkv6uizs00acl2rs0ce6jfxp',
        title: 'Ancient history',
        parents: {
            connect: [
                {
                    id: 'clkv6uie8002il2rsq94ydwpe'
                }
            ]
        }
    },
    {
        id: 'clkv6uizx00ael2rs3zmmkhs7',
        title: 'Medieval and modern history, 476-',
        parents: {
            connect: [
                {
                    id: 'clkv6uie8002il2rsq94ydwpe'
                }
            ]
        }
    },
    {
        id: 'clkv6uj0r00asl2rswe0jv4m4',
        title: 'British Empire. Commonwealth of Nations. The Commonwealth',
        parents: {
            connect: [
                {
                    id: 'clkv6uiee002kl2rs6ds2q583'
                }
            ]
        }
    },
    {
        id: 'clkv6uj0w00aul2rssmczetk4',
        title: 'England',
        parents: {
            connect: [
                {
                    id: 'clkv6uiee002kl2rs6ds2q583'
                }
            ]
        }
    },
    {
        id: 'clkv6uj1000awl2rseb4tlmzi',
        title: 'Wales',
        parents: {
            connect: [
                {
                    id: 'clkv6uiee002kl2rs6ds2q583'
                }
            ]
        }
    },
    {
        id: 'clkv6uj1400ayl2rsey9t8jf2',
        title: 'Scotland',
        parents: {
            connect: [
                {
                    id: 'clkv6uiee002kl2rs6ds2q583'
                }
            ]
        }
    },
    {
        id: 'clkv6uj4i00c6l2rs9bcgvcyl',
        title: 'Austria. Austro-Hungarian Empire',
        parents: {
            connect: [
                {
                    id: 'clkv6uieo002ol2rs6dvcgk7e'
                }
            ]
        }
    },
    {
        id: 'clkv6uj6200csl2rs49d14qp1',
        title: 'Liechtenstein',
        parents: {
            connect: [
                {
                    id: 'clkv6uieo002ol2rs6dvcgk7e'
                }
            ]
        }
    },
    {
        id: 'clkv6uj6700cul2rsipsfh2mb',
        title: 'Hungary',
        parents: {
            connect: [
                {
                    id: 'clkv6uieo002ol2rs6dvcgk7e'
                }
            ]
        }
    },
    {
        id: 'clkv6uj7h00del2rsfvela4gj',
        title: 'Czechoslovakia',
        parents: {
            connect: [
                {
                    id: 'clkv6uieo002ol2rs6dvcgk7e'
                }
            ]
        }
    },
    {
        id: 'clkv6uj8900dql2rs8tyj89hk',
        title: 'France',
        parents: {
            connect: [
                {
                    id: 'clkv6uieu002ql2rsfpv13zo3'
                }
            ]
        }
    },
    {
        id: 'clkv6ujbd00f4l2rsxwj98lh0',
        title: 'Andorra',
        parents: {
            connect: [
                {
                    id: 'clkv6uieu002ql2rsfpv13zo3'
                }
            ]
        }
    },
    {
        id: 'clkv6ujbh00f6l2rspq6p7l89',
        title: 'Monaco',
        parents: {
            connect: [
                {
                    id: 'clkv6uieu002ql2rsfpv13zo3'
                }
            ]
        }
    },
    {
        id: 'clkv6ujbq00fal2rsjoh95hko',
        title: 'Earliest to 481',
        parents: {
            connect: [
                {
                    id: 'clkv6ui7y0008l2rsv5gbxyzp'
                }
            ]
        }
    },
    {
        id: 'clkv6ujbu00fcl2rsak6nwg4b',
        title: 'Early and medieval to 1519',
        parents: {
            connect: [
                {
                    id: 'clkv6ui7y0008l2rsv5gbxyzp'
                }
            ]
        }
    },
    {
        id: 'clkv6ujcq00fql2rssea4fc0u',
        title: 'Modern, 1519-',
        parents: {
            connect: [
                {
                    id: 'clkv6ui7y0008l2rsv5gbxyzp'
                }
            ]
        }
    },
    {
        id: 'clkv6ujen00gkl2rskl46e92o',
        title: 'Ancient Greece',
        parents: {
            connect: [
                {
                    id: 'clkv6ui83000al2rslhajo8rz'
                },
                {
                    id: 'clkv6ui87000cl2rssv4wpjx0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujfy00h6l2rskr4l0kgy',
        title: 'Medieval Greece. Byzantine Empire, 323-1453',
        parents: {
            connect: [
                {
                    id: 'clkv6ui87000cl2rssv4wpjx0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujgw00hil2rswccwnhoo',
        title: 'Turkish rule, 1453-1821',
        parents: {
            connect: [
                {
                    id: 'clkv6ui87000cl2rssv4wpjx0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujh100hkl2rstccyjkih',
        title: '1821-1913',
        parents: {
            connect: [
                {
                    id: 'clkv6ui87000cl2rssv4wpjx0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujh600hml2rsd7hli3ip',
        title: '20th century',
        parents: {
            connect: [
                {
                    id: 'clkv6ui87000cl2rssv4wpjx0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujhc00hol2rs0r6j2477',
        title: '21st century',
        parents: {
            connect: [
                {
                    id: 'clkv6ui87000cl2rssv4wpjx0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujhw00hwl2rsiccbxmii',
        title: 'Italy',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8c000el2rsqazyv85t'
                }
            ]
        }
    },
    {
        id: 'clkv6ujmt00jql2rsimrpiayx',
        title: 'Malta. Maltese Islands',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8c000el2rsqazyv85t'
                }
            ]
        }
    },
    {
        id: 'clkv6ujn600jul2rsgu9lnvli',
        title: 'Early and medieval to 1384',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8h000gl2rs7gtpc8uv'
                }
            ]
        }
    },
    {
        id: 'clkv6ujna00jwl2rs7jfjqzq4',
        title: '1384-1555. House of Burgundy',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8h000gl2rs7gtpc8uv'
                }
            ]
        }
    },
    {
        id: 'clkv6ujnf00jyl2rs20ixs41q',
        title: 'Wars of Independence, 1555-1648',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8h000gl2rs7gtpc8uv'
                }
            ]
        }
    },
    {
        id: 'clkv6ujnk00k0l2rs17gc94d5',
        title: 'Belgium',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8h000gl2rs7gtpc8uv'
                }
            ]
        }
    },
    {
        id: 'clkv6ujow00kil2rsub9vxefd',
        title: 'Luxembourg',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8h000gl2rs7gtpc8uv'
                }
            ]
        }
    },
    {
        id: 'clkv6ujp000kkl2rs0jm9pxvx',
        title: 'Netherlands (Holland)',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8h000gl2rs7gtpc8uv'
                }
            ]
        }
    },
    {
        id: 'clkv6ujpe00kql2rs97zku1wx',
        title: 'Ukraine',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujqs00lal2rsnie5m57d',
        title: 'Black Sea region',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8r000kl2rszwpp0qpk'
                }
            ]
        }
    },
    {
        id: 'clkv6ujqy00lcl2rs4f9s2cth',
        title: 'Carpathian Mountain region',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8r000kl2rszwpp0qpk'
                }
            ]
        }
    },
    {
        id: 'clkv6ujr200lel2rs2ts8xpf6',
        title: 'Danube River Valley',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8r000kl2rszwpp0qpk'
                }
            ]
        }
    },
    {
        id: 'clkv6ujr700lgl2rsz59oqky1',
        title: 'Pannonia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8r000kl2rszwpp0qpk'
                }
            ]
        }
    },
    {
        id: 'clkv6ujrf00lil2rsu471hhuy',
        title: 'Early to 1613',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujrl00lkl2rscra7rkz2',
        title: 'House of Romanov, 1613-1917',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujrr00lml2rsj1uxyvuy',
        title: 'Revolution, 1917-1921',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujs000lol2rs1a7c6l9h',
        title: 'Soviet regime, 1918-1991',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujs800lql2rsfw8zxqor',
        title: '1991-',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujn000jsl2rsuzku6qwy',
        title: 'Benelux Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8h000gl2rs7gtpc8uv'
                }
            ]
        }
    },
    {
        id: 'clkv6ujsv00lwl2rsf8ztdky2',
        title: 'Baltic States',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujt000lyl2rs3357xzrb',
        title: 'Estonia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujtc00m0l2rswakyrhmx',
        title: 'Latvia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujtj00m2l2rs27n3m546',
        title: 'Lithuania',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujts00m4l2rs9a6x5rfk',
        title: 'Belarus. Byelorussian S.S.R. White Russia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujtx00m6l2rsxcwdagxx',
        title: 'Southern Soviet Union',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6uju400m8l2rs2c8hlfma',
        title: 'Moldova. Moldovian S.S.R. Bessarabia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujuc00mal2rsfbnrj9ed',
        title: 'Russia (Federation). Russian S.F.S.R.',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujui00mcl2rs100p0oa5',
        title: 'Georgia (Republic). Georgian S.S.R. Georgian Sakartvelo',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujuq00mel2rscyq8tks7',
        title: 'Armenia (Republic). Armenian S.S.R.',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujv100mgl2rs4lfhzn3z',
        title: 'Azerbaijan. Azerbaijan S.S.R.',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujv500mil2rsxgyyaw5h',
        title: 'Siberia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujvc00mkl2rs20lso42m',
        title: 'Soviet Central Asia. West Turkestan',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujvm00mml2rsymyyl2eq',
        title: 'Kazakhstan. Kazakh S.S.R.',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujvs00mol2rsfztrmrxe',
        title: 'Kyrgyzstan. Kirghiz S.S.R. Kirghizia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujw900msl2rsigyit5k4',
        title: 'Tajikistan. Tajik S.S.R. Tadzhikistan',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujwd00mul2rsts5psx24',
        title: 'Turkmenistan. Turkmen S.S.R. Turkmenia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujwi00mwl2rsleh0ux3c',
        title: 'Uzbekistan. Uzbek S.S.R.',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujwn00myl2rsa4ekt68l',
        title: 'Poland',
        parents: {
            connect: [
                {
                    id: 'clkv6ui8w000ml2rsstngnzi4'
                }
            ]
        }
    },
    {
        id: 'clkv6ujxi00nal2rstzwth9x3',
        title: 'Earliest to 1387. Scandinavian Empire. Northmen. Vikings',
        parents: {
            connect: [
                {
                    id: 'clkv6ui90000ol2rsym476o78'
                }
            ]
        }
    },
    {
        id: 'clkv6ujxo00ncl2rsg95s49vj',
        title: '1387-1900',
        parents: {
            connect: [
                {
                    id: 'clkv6ui90000ol2rsym476o78'
                }
            ]
        }
    },
    {
        id: 'clkv6ujxw00nel2rslh37wnu1',
        title: '1900- . Period of World War I, 1914-1918',
        parents: {
            connect: [
                {
                    id: 'clkv6ui90000ol2rsym476o78'
                }
            ]
        }
    },
    {
        id: 'clkv6ujy700ngl2rs8s1oxg3b',
        title: 'Denmark',
        parents: {
            connect: [
                {
                    id: 'clkv6ui90000ol2rsym476o78'
                }
            ]
        }
    },
    {
        id: 'clkv6uk0e00oal2rswbipqsqn',
        title: 'Iceland',
        parents: {
            connect: [
                {
                    id: 'clkv6ui90000ol2rsym476o78'
                }
            ]
        }
    },
    {
        id: 'clkv6uk0i00ocl2rsb7el7k2p',
        title: 'Norway',
        parents: {
            connect: [
                {
                    id: 'clkv6ui90000ol2rsym476o78'
                }
            ]
        }
    },
    {
        id: 'clkv6uk1v00oul2rsh99c0a96',
        title: 'Sweden',
        parents: {
            connect: [
                {
                    id: 'clkv6ui90000ol2rsym476o78'
                }
            ]
        }
    },
    {
        id: 'clkv6uk3s00pkl2rs71n81r34',
        title: 'Finland',
        parents: {
            connect: [
                {
                    id: 'clkv6ui90000ol2rsym476o78'
                }
            ]
        }
    },
    {
        id: 'clkv6uk5100q2l2rspda163o0',
        title: 'Spain',
        parents: {
            connect: [
                {
                    id: 'clkv6ui95000ql2rsotjo9z3u'
                }
            ]
        }
    },
    {
        id: 'clkv6uk8k00r6l2rsghw2dico',
        title: 'Portugal',
        parents: {
            connect: [
                {
                    id: 'clkv6ui95000ql2rsotjo9z3u'
                }
            ]
        }
    },
    {
        id: 'clkv6ukbn00s2l2rs4uye3eqe',
        title: 'Early and medieval to 1516',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9a000sl2rsoj39nwha'
                }
            ]
        }
    },
    {
        id: 'clkv6ukbr00s4l2rs3pc6zjnn',
        title: '1516-1798',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9a000sl2rsoj39nwha'
                }
            ]
        }
    },
    {
        id: 'clkv6ukbw00s6l2rsoqfx52lo',
        title: '19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9a000sl2rsoj39nwha'
                }
            ]
        }
    },
    {
        id: 'clkv6ukc300s8l2rsnhym7s58',
        title: '20th & 21st century',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9a000sl2rsoj39nwha'
                }
            ]
        }
    },
    {
        id: 'clkv6ukd700sml2rs91wz7wu9',
        title: 'History. Balkan War, 1912-1913',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukdc00sol2rsokyvp9cs',
        title: 'Thrace',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukdi00sql2rsvl2qctm3',
        title: 'Bulgaria',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukdm00ssl2rseu91pb4m',
        title: 'Arab countries',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9j000wl2rs7k3ydz36'
                }
            ]
        }
    },
    {
        id: 'clkv6ukff00tcl2rs9kal1gdi',
        title: 'Romania',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukii00uel2rs0ckvxa8h',
        title: 'Albania',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukbi00s0l2rs7fyfc4og',
        title: 'Swiss Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9a000sl2rsoj39nwha'
                }
            ]
        }
    },
    {
        id: 'clkv6ukh600tsl2rs2v6tmj3p',
        title: 'Türkiye',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukj300uol2rs47v1ia9q',
        title: 'Yugoslavia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukj800uql2rs197t2m0w',
        title: 'Central Asia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9j000wl2rs7k3ydz36'
                }
            ]
        }
    },
    {
        id: 'clkv6ukk400v4l2rsoyej8smz',
        title: 'Slovenia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukk800v6l2rsm56j1dcg',
        title: 'Croatia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukkd00v8l2rs6pht1ovb',
        title: 'Bosnia and Hercegovina',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukkh00val2rswuf1dih5',
        title: 'Montenegro',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukkl00vcl2rsaa8o9obw',
        title: 'Serbia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukkp00vel2rsd30s9hgf',
        title: 'Macedonia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9e000ul2rs4m0gmdmv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukls00vwl2rsokrouo9d',
        title: 'Asia Minor',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9j000wl2rs7k3ydz36'
                }
            ]
        }
    },
    {
        id: 'clkv6uknf00wml2rsgs5cix90',
        title: 'East Asia. The Far East',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9j000wl2rs7k3ydz36'
                }
            ]
        }
    },
    {
        id: 'clkv6uksc00ykl2rszaqw9uti',
        title: 'Egypt',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9n000yl2rsfhxl579g'
                }
            ]
        }
    },
    {
        id: 'clkv6uksh00yml2rseu1eac2n',
        title: 'Sudan. Anglo-Egyptian Sudan',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9n000yl2rsfhxl579g'
                }
            ]
        }
    },
    {
        id: 'clkv6uksl00yol2rsopwegqea',
        title: 'North Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9n000yl2rsfhxl579g'
                }
            ]
        }
    },
    {
        id: 'clkv6uktv00z6l2rsnzwbf4qi',
        title: 'Central-Sub Saharan Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9n000yl2rsfhxl579g'
                }
            ]
        }
    },
    {
        id: 'clkv6uku000z8l2rssggnt2ee',
        title: 'Eastern Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9n000yl2rsfhxl579g'
                }
            ]
        }
    },
    {
        id: 'clkv6ukwy010cl2rsicukiobv',
        title: 'West Africa. West Coast',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9n000yl2rsfhxl579g'
                }
            ]
        }
    },
    {
        id: 'clkv6ul1b0124l2rswgdyud90',
        title: 'Southern Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9n000yl2rsfhxl579g'
                }
            ]
        }
    },
    {
        id: 'clkv6ul3o0130l2rshqcz41q4',
        title: 'Australia',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9s0010l2rs891jyea1'
                }
            ]
        }
    },
    {
        id: 'clkv6ul440134l2rsdtvo6gpq',
        title: 'New Zealand',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9s0010l2rs891jyea1'
                }
            ]
        }
    },
    {
        id: 'clkv6ul4e0138l2rsyz5l3udd',
        title: 'Melanesia (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9s0010l2rs891jyea1'
                }
            ]
        }
    },
    {
        id: 'clkv6ul4i013al2rs7r3vhlqx',
        title: 'Micronesia (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9s0010l2rs891jyea1'
                }
            ]
        }
    },
    {
        id: 'clkv6ul4n013cl2rs91coj1rk',
        title: 'Polynesia (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9s0010l2rs891jyea1'
                }
            ]
        }
    },
    {
        id: 'clkv6ul4s013el2rsulo1jaim',
        title: 'Hawaiian Islands. Hawaii',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9s0010l2rs891jyea1'
                }
            ]
        }
    },
    {
        id: 'clkv6ul4x013gl2rsn1rvkwq9',
        title: 'New Guinea',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9s0010l2rs891jyea1'
                }
            ]
        }
    },
    {
        id: 'clkv6ul51013il2rs678ut4es',
        title: 'Samoan Islands',
        parents: {
            connect: [
                {
                    id: 'clkv6ui9s0010l2rs891jyea1'
                }
            ]
        }
    },
    {
        id: 'clkv6ul56013kl2rsq226nwgj',
        title: 'North America',
        parents: {
            connect: [
                {
                    id: 'clkv6uia10014l2rslrpfnjlb'
                }
            ]
        }
    },
    {
        id: 'clkv6ul77014el2rsf56bqzs2',
        title: 'Latin America. Spanish America',
        parents: {
            connect: [
                {
                    id: 'clkv6uia10014l2rslrpfnjlb'
                }
            ]
        }
    },
    {
        id: 'clkv6ul9e0158l2rs1n9uvy2i',
        title: 'South America',
        parents: {
            connect: [
                {
                    id: 'clkv6uia10014l2rslrpfnjlb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulc50164l2rsi9xxnjr3',
        title: 'Aerial cartography',
        parents: {
            connect: [
                {
                    id: 'clkv6uiab0018l2rs6fovh0jd'
                }
            ]
        }
    },
    {
        id: 'clkv6ulc90166l2rs57i34aki',
        title: 'Cadastral mapping',
        parents: {
            connect: [
                {
                    id: 'clkv6uiab0018l2rs6fovh0jd'
                }
            ]
        }
    },
    {
        id: 'clkv6ulce0168l2rsmmqn5bzs',
        title: 'Statistical mapping',
        parents: {
            connect: [
                {
                    id: 'clkv6uiab0018l2rs6fovh0jd'
                }
            ]
        }
    },
    {
        id: 'clkv6ulci016al2rsy4ohvvzs',
        title: 'Projection',
        parents: {
            connect: [
                {
                    id: 'clkv6uiab0018l2rs6fovh0jd'
                }
            ]
        }
    },
    {
        id: 'clkv6ulcm016cl2rsptjie27k',
        title: 'Map drawing, modeling, printing, reading, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6uiab0018l2rs6fovh0jd'
                }
            ]
        }
    },
    {
        id: 'clkv6ulcq016el2rsijbngtbz',
        title: 'Methodology',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulcv016gl2rs65jah3jy',
        title: 'Collections of maps, globes, etc. Map libraries',
        parents: {
            connect: [
                {
                    id: 'clkv6uiab0018l2rs6fovh0jd'
                }
            ]
        }
    },
    {
        id: 'clkv6ulcz016il2rsb2m3vrds',
        title: 'Cartographers',
        parents: {
            connect: [
                {
                    id: 'clkv6uiab0018l2rs6fovh0jd'
                }
            ]
        }
    },
    {
        id: 'clkv6uld4016kl2rsbxb6pb6u',
        title: 'Globe making. Globes',
        parents: {
            connect: [
                {
                    id: 'clkv6uiab0018l2rs6fovh0jd'
                }
            ]
        }
    },
    {
        id: 'clkv6uld8016ml2rshhi8ghgf',
        title: 'Geomorphology. Landforms. Terrain',
        parents: {
            connect: [
                {
                    id: 'clkv6uiag001al2rsf378bj60'
                }
            ]
        }
    },
    {
        id: 'clkv6uldh016ol2rsgphrhdxn',
        title: 'Hydrology. Water',
        parents: {
            connect: [
                {
                    id: 'clkv6uiag001al2rsf378bj60'
                }
            ]
        }
    },
    {
        id: 'clkv6uldm016ql2rsr4ox91se',
        title: 'Natural disasters',
        parents: {
            connect: [
                {
                    id: 'clkv6uiag001al2rsf378bj60'
                }
            ]
        }
    },
    {
        id: 'clkv6ulds016sl2rsmitiq8bk',
        title: 'Oceanographic expeditions',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6uldy016ul2rswesyid3k',
        title: 'Underwater exploration',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ule2016wl2rsrm6z4pcz',
        title: 'Submarine topography',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ule7016yl2rsjtxwoofr',
        title: 'Estuarine oceanography',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ulee0170l2rswrl0arf6',
        title: 'Seawater',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ulei0172l2rsijhbamw7',
        title: 'Chemical oceanography',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ulen0174l2rsfepctiu3',
        title: 'Physical oceanography',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ulev0176l2rs161yxxgy',
        title: 'Ocean-atmosphere interaction',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ulf10178l2rs4kr81piu',
        title: 'Dynamics of the ocean',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ulf6017al2rsw8jhhr05',
        title: 'Marine sediments',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ulfb017cl2rsxw3or2ss',
        title: 'Marine resources. Applied oceanography',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ulff017el2rs4313won8',
        title: 'Environmental education',
        parents: {
            connect: [
                {
                    id: 'clkv6uial001cl2rsge4rgyu3'
                }
            ]
        }
    },
    {
        id: 'clkv6ulfk017gl2rssuoaii4k',
        title: 'Environmental policy',
        parents: {
            connect: [
                {
                    id: 'clkv6uiap001el2rstc6g46k4'
                }
            ]
        }
    },
    {
        id: 'clkv6ulfp017il2rsg92yprb3',
        title: 'Environmentalism. Green movement',
        parents: {
            connect: [
                {
                    id: 'clkv6uiap001el2rstc6g46k4'
                }
            ]
        }
    },
    {
        id: 'clkv6ulfw017kl2rsvr7joi3f',
        title: 'Environmental management',
        parents: {
            connect: [
                {
                    id: 'clkv6uiap001el2rstc6g46k4'
                }
            ]
        }
    },
    {
        id: 'clkv6ulg5017ol2rs0lb4rhf1',
        title: 'Value. Utility',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulga017ql2rsqfmk64f6',
        title: 'Price',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulgf017sl2rshiitimnq',
        title: 'Competition. Production. Wealth',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulgj017ul2rs4tkirjnq',
        title: 'Capital. Capitalism',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulgo017wl2rs0mc5y53f',
        title: 'Income. Factor shares',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulgt017yl2rsnu240ps9',
        title: 'Consumption. Demand',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulgx0180l2rsbtl0cdyp',
        title: 'Welfare theory',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulh20182l2rsveamurb8',
        title: 'Demography. Population. Vital events',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulh80184l2rs0jpyvyab',
        title: 'Business cycles. Economic fluctuations',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulhq0188l2rsirnj1jbt',
        title: 'Economic growth, development, planning',
        parents: {
            connect: [
                {
                    id: 'clkv6uiga003al2rs5qdze4nr'
                }
            ]
        }
    },
    {
        id: 'clkv6ulhw018al2rsnfmegwu6',
        title: 'Land use',
        parents: {
            connect: [
                {
                    id: 'clkv6uiga003al2rs5qdze4nr'
                }
            ]
        }
    },
    {
        id: 'clkv6uli0018cl2rs9asqmz2p',
        title: 'Agriculture',
        parents: {
            connect: [
                {
                    id: 'clkv6uiga003al2rs5qdze4nr'
                }
            ]
        }
    },
    {
        id: 'clkv6uli5018el2rslllf3krl',
        title: 'Industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uiga003al2rs5qdze4nr'
                }
            ]
        }
    },
    {
        id: 'clkv6uli9018gl2rs6muu36le',
        title: 'Large industry. Factory system. Big business',
        parents: {
            connect: [
                {
                    id: 'clkv6uiga003al2rs5qdze4nr'
                }
            ]
        }
    },
    {
        id: 'clkv6ulg1017ml2rsseuep7o6',
        title: 'Economics as a science',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6ulhd0186l2rsdb3d3ugg',
        title: 'Business management',
        parents: {
            connect: [
                {
                    id: 'clkv6uiga003al2rs5qdze4nr'
                }
            ]
        }
    },
    {
        id: 'clkv6ulqu01bwl2rsdrdkkzir',
        title: 'Freight (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulqz01byl2rshb3vhnjp',
        title: 'Passenger traffic (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulr501c0l2rsid08nm2m',
        title: 'Urban transportation',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulrb01c2l2rstrqwcbe2',
        title: 'Transportation geography. Trade routes',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulrh01c4l2rsj2i5rcgt',
        title: 'Traffic engineering. Roads and highways. Streets',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulrl01c6l2rs6xawnijb',
        title: 'Water transportation',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulrq01c8l2rs2c39teyt',
        title: 'Railroads. Rapid transit systems',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulru01cal2rsjhxt70c5',
        title: 'Stage lines',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulrz01ccl2rspwh06dsf',
        title: 'Ferries',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6uls301cel2rsirggp1ly',
        title: 'Express service',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6uls801cgl2rsijkdic9q',
        title: 'Postal service. Stamps. Philately',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulsc01cil2rskiaszv4a',
        title: 'Pneumatic service',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulsl01cml2rsjnxaeftc',
        title: 'Telephone industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6umfx01lal2rscw1ldp8f',
        title: 'Municipal engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6ulsx01csl2rs3sqlccjh',
        title: 'Signaling',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ult101cul2rs5nn5z3w5',
        title: 'Messenger service',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ult601cwl2rsn5chvy6y',
        title: 'Air transportation. Airlines',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulta01cyl2rschnor10i',
        title: "Boards of trade. Chambers of commerce. Merchants' associations",
        parents: {
            connect: [
                {
                    id: 'clkv6uigk003el2rswm10fyv8'
                }
            ]
        }
    },
    {
        id: 'clkv6ultf01d0l2rsqjto6ehe',
        title: 'Balance of trade',
        parents: {
            connect: [
                {
                    id: 'clkv6uigk003el2rswm10fyv8'
                }
            ]
        }
    },
    {
        id: 'clkv6ultj01d2l2rsa2ytimei',
        title: 'Commercial geography. Economic geography',
        parents: {
            connect: [
                {
                    id: 'clkv6uigk003el2rswm10fyv8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulto01d4l2rsklkm5bpu',
        title: 'Commodities. Commercial products',
        parents: {
            connect: [
                {
                    id: 'clkv6uigk003el2rswm10fyv8'
                }
            ]
        }
    },
    {
        id: 'clkv6ults01d6l2rssp5gbja3',
        title: 'Tariff. Free trade. Protectionism',
        parents: {
            connect: [
                {
                    id: 'clkv6uigk003el2rswm10fyv8'
                }
            ]
        }
    },
    {
        id: 'clkv6ultw01d8l2rshemkr3n0',
        title: 'Business',
        parents: {
            connect: [
                {
                    id: 'clkv6uigk003el2rswm10fyv8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulu001dal2rs1vj7s660',
        title: 'Liquidity',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6ulu401dcl2rslyns8o8d',
        title: 'Personal finance',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6ulu901del2rsoi6wsuuj',
        title: 'Money',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6ulue01dgl2rst9quchzp',
        title: 'Banking',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6uluj01dil2rsyidtrsb8',
        title: 'Foreign exchange. International finance. International monetary system',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6ulur01dkl2rs25d1i41s',
        title: 'Finance management. Business finance. Corporation finance',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6uluw01dml2rsv4ieolyl',
        title: 'Trust services. Trust companies',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6ulv101dol2rsojb5cjfo',
        title: 'Investment, capital formation, speculation',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6ulv701dql2rsc15y4jsi',
        title: 'Lotteries',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6ulvh01dsl2rslws59nxv',
        title: 'Insurance',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6ulvm01dul2rs0q6u2yor',
        title: 'Revenue. Taxation. Internal revenue',
        parents: {
            connect: [
                {
                    id: 'clkv6uih0003il2rse0gf3xps'
                }
            ]
        }
    },
    {
        id: 'clkv6ulvs01dwl2rsi098x0if',
        title: 'Customs administration',
        parents: {
            connect: [
                {
                    id: 'clkv6uih0003il2rse0gf3xps'
                }
            ]
        }
    },
    {
        id: 'clkv6ulvw01dyl2rsjhplwtqo',
        title: 'Expenditures. Government spending',
        parents: {
            connect: [
                {
                    id: 'clkv6uih0003il2rse0gf3xps'
                }
            ]
        }
    },
    {
        id: 'clkv6ulw101e0l2rswdb8f2rr',
        title: 'Public debts',
        parents: {
            connect: [
                {
                    id: 'clkv6uih0003il2rse0gf3xps'
                }
            ]
        }
    },
    {
        id: 'clkv6ulwa01e4l2rs2wn4c4nh',
        title: 'History of sociology. History of sociological theory',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulwf01e6l2rsxclyjb2z',
        title: 'Theory. Method. Relations to other subjects',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulwl01e8l2rsmch91jsi',
        title: 'Culture',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulwu01ecl2rsm0eud3tz',
        title: 'Social systems',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulwz01eel2rsdnsiqmr5',
        title: 'Social structure',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulx301egl2rszbgb47k1',
        title: 'Groups and organizations',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulx801eil2rsez5k24g9',
        title: 'Deviant behavior. Social deviance',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulxc01ekl2rs2h0r6ura',
        title: 'Social institutions',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulxh01eml2rsy3qdnj6j',
        title: 'Social change',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulxl01eol2rsqa9zts6m',
        title: 'Social psychology',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulyo01eyl2rssv0pkdla',
        title: 'Family size',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6ulyt01f0l2rsycwag19s',
        title: 'Youth. Adolescents. Teenagers',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6ulyy01f2l2rsveddg384',
        title: 'Young men and women',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6ulz501f4l2rs17n4incb',
        title: 'Adulthood',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6ulzc01f6l2rsxbd4t5g4',
        title: 'Single people',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6ulzi01f8l2rsppwui68l',
        title: 'Man woman relationships. Courtship. Dating',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6ulzn01fal2rskxdefn0j',
        title: 'Matrimonial bureaus. Marriage brokerage',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6ulzr01fcl2rs2gaqxwdf',
        title: 'Matrimonial advertisements',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6ulzw01fel2rsuvgawrd1',
        title: 'Temporary marriage. Trial marriage. Companionate marriage',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um0101fgl2rs0354dkxx',
        title: 'Breach of promise',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um0601fil2rsgr2l9x4w',
        title: 'Desertion',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um0b01fkl2rsqv23lpoo',
        title: 'Adultery',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um0h01fml2rs1gz6toxk',
        title: 'Divorce',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um0m01fol2rs7w47q2pe',
        title: 'Free love',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um0q01fql2rsd0v81pv7',
        title: 'Polygamy',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um0v01fsl2rsr3v601jz',
        title: 'Polyandry',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um1001ful2rsg6t57g63',
        title: 'Illegitimacy. Unmarried mothers',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um1501fwl2rs0umw03aa',
        title: 'The state and marriage',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um1d01fyl2rsimu0mfov',
        title: 'The church and marriage',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um1m01g0l2rs3n0bkmr5',
        title: 'Widows and widowers. Widowhood',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um1r01g2l2rszeyqm1yf',
        title: 'Aged. Gerontology (Social aspects). Retirement',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um1w01g4l2rsaoqzahqp',
        title: 'Sexual life',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um2101g6l2rs57pn6ket',
        title: 'Thanatology. Death. Dying',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um2701g8l2rs6qirm4o7',
        title: 'Sex role',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um2c01gal2rscssoahfi',
        title: 'Men',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um2n01gel2rsryq3r1el',
        title: 'Communism/socialism in relation to special topics',
        parents: {
            connect: [
                {
                    id: 'clkv6uii4003wl2rsx5ty3cvw'
                }
            ]
        }
    },
    {
        id: 'clkv6um2t01ggl2rswq728kf4',
        title: 'Communism: Utopian socialism, collective settlements',
        parents: {
            connect: [
                {
                    id: 'clkv6uii4003wl2rsx5ty3cvw'
                }
            ]
        }
    },
    {
        id: 'clkv6um2y01gil2rs1s7o3r6b',
        title: 'Utopias. The ideal state',
        parents: {
            connect: [
                {
                    id: 'clkv6uii4003wl2rsx5ty3cvw'
                }
            ]
        }
    },
    {
        id: 'clkv6um3301gkl2rswpql5t4g',
        title: 'Anarchism',
        parents: {
            connect: [
                {
                    id: 'clkv6uii4003wl2rsx5ty3cvw'
                }
            ]
        }
    },
    {
        id: 'clkv6um3801gml2rsbfssqahe',
        title: 'Mineralogy',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqo0072l2rsplkmhbxb'
                }
            ]
        }
    },
    {
        id: 'clkv6um3d01gol2rsnnp2q0mb',
        title: 'Petrology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqo0072l2rsplkmhbxb'
                }
            ]
        }
    },
    {
        id: 'clkv6um3i01gql2rs96auj5u6',
        title: 'Dynamic and structural geology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqo0072l2rsplkmhbxb'
                }
            ]
        }
    },
    {
        id: 'clkv6um3o01gsl2rs8w3l46yl',
        title: 'Stratigraphy',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqo0072l2rsplkmhbxb'
                }
            ]
        }
    },
    {
        id: 'clkv6um3v01gul2rse56qr988',
        title: 'Paleontology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqo0072l2rsplkmhbxb'
                }
            ]
        }
    },
    {
        id: 'clkv6um4001gwl2rsw7i0h95u',
        title: 'Paleozoology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqo0072l2rsplkmhbxb'
                },
                {
                    id: 'clkv6uir40078l2rsp2xvet66'
                }
            ]
        }
    },
    {
        id: 'clkv6um4501gyl2rsmierxzau',
        title: 'Paleobotany',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqo0072l2rsplkmhbxb'
                },
                {
                    id: 'clkv6uiqz0076l2rse4zmuyv9'
                }
            ]
        }
    },
    {
        id: 'clkv6ulwp01eal2rs74waj9sc',
        title: 'Freedom and social control',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulst01cql2rsbx655k8c',
        title: 'artifical satellites',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulsp01col2rsoraayjkp',
        title: 'Cellular and wireless technology',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6um2i01gcl2rsat8prvm2',
        title: 'Women',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6um4o01h4l2rskxouu89d',
        title: 'Practical and spherical astronomy',
        parents: {
            connect: [
                {
                    id: 'clkv6uiq6006wl2rstcdpuok4'
                }
            ]
        }
    },
    {
        id: 'clkv6um4t01h6l2rssr68kwq5',
        title: 'Geodesy',
        parents: {
            connect: [
                {
                    id: 'clkv6uiq6006wl2rstcdpuok4'
                }
            ]
        }
    },
    {
        id: 'clkv6um4z01h8l2rsx4u8o1vz',
        title: 'Theoretical astronomy and celestial mechanics',
        parents: {
            connect: [
                {
                    id: 'clkv6uiq6006wl2rstcdpuok4'
                }
            ]
        }
    },
    {
        id: 'clkv6um5501hal2rs81g3mkas',
        title: 'Astrogeology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiq6006wl2rstcdpuok4'
                }
            ]
        }
    },
    {
        id: 'clkv6um5f01hcl2rsnzuywx4z',
        title: 'Astrophysics',
        parents: {
            connect: [
                {
                    id: 'clkv6uiq6006wl2rstcdpuok4'
                }
            ]
        }
    },
    {
        id: 'clkv6um5m01hel2rsy6ps8azt',
        title: 'Non optical methods of astronomy',
        parents: {
            connect: [
                {
                    id: 'clkv6uiq6006wl2rstcdpuok4'
                }
            ]
        }
    },
    {
        id: 'clkv6um5s01hgl2rsvyae61z8',
        title: 'Descriptive astronomy',
        parents: {
            connect: [
                {
                    id: 'clkv6uiq6006wl2rstcdpuok4'
                }
            ]
        }
    },
    {
        id: 'clkv6um6701hml2rsm2bfnxg6',
        title: 'Descriptive and experimental mechanics',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um6c01hol2rsx1xz319n',
        title: 'Bacteria',
        parents: {
            connect: [
                {
                    id: 'clkv6uirl007el2rs8m9kxmhp'
                }
            ]
        }
    },
    {
        id: 'clkv6um6h01hql2rsxsvrj5m3',
        title: 'Acoustics. Sound',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um6m01hsl2rsw99dwwz9',
        title: 'Heat',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um6r01hul2rsfcyb4e0a',
        title: 'Optics. Light',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um6w01hwl2rsnss7kk6q',
        title: 'Radiation physics (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um7101hyl2rsxx5lndpj',
        title: 'Electricity and magnetism',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um7501i0l2rs3a42ftm2',
        title: 'Nuclear and particle physics. Atomic energy. Radioactivity',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um7b01i2l2rs5s1l9zdd',
        title: 'Geophysics. Cosmic physics',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um7h01i4l2rsg616rfwz',
        title: 'Geomagnetism',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um7w01i6l2rs6obp1mtv',
        title: 'Atomic physics. Constitution and properties of matter. Including molecular physics, relativity, quantum theory, and solid state physics',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6um9a01iol2rsbau15sib',
        title: 'Analytical chemistry',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqi0070l2rsvvg5kbis'
                }
            ]
        }
    },
    {
        id: 'clkv6um9f01iql2rs9p0bd42s',
        title: 'Inorganic chemistry',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqi0070l2rsvvg5kbis'
                }
            ]
        }
    },
    {
        id: 'clkv6um9k01isl2rsigotj3wt',
        title: 'Organic chemistry',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqi0070l2rsvvg5kbis'
                }
            ]
        }
    },
    {
        id: 'clkv6um9p01iul2rs8e6s1gpz',
        title: 'Physical and theoretical chemistry',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqi0070l2rsvvg5kbis'
                }
            ]
        }
    },
    {
        id: 'clkv6um9u01iwl2rsz0bws1ej',
        title: 'Crystallography',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqi0070l2rsvvg5kbis'
                }
            ]
        }
    },
    {
        id: 'clkv6uma001iyl2rsetk0537x',
        title: 'Cyanobacteria',
        parents: {
            connect: [
                {
                    id: 'clkv6uirl007el2rs8m9kxmhp'
                }
            ]
        }
    },
    {
        id: 'clkv6uma401j0l2rsbswfkm9t',
        title: 'Microbial ecology',
        parents: {
            connect: [
                {
                    id: 'clkv6uirl007el2rs8m9kxmhp'
                }
            ]
        }
    },
    {
        id: 'clkv6uma901j2l2rsrz5ynuc2',
        title: 'Microorganisms in the animal body',
        parents: {
            connect: [
                {
                    id: 'clkv6uirl007el2rs8m9kxmhp'
                }
            ]
        }
    },
    {
        id: 'clkv6umae01j4l2rsxn0q6xnu',
        title: 'Immunology',
        parents: {
            connect: [
                {
                    id: 'clkv6uirl007el2rs8m9kxmhp'
                }
            ]
        }
    },
    {
        id: 'clkv6umak01j6l2rsc6lt3ru2',
        title: 'Virology',
        parents: {
            connect: [
                {
                    id: 'clkv6uirl007el2rs8m9kxmhp'
                }
            ]
        }
    },
    {
        id: 'clkv6umat01j8l2rsiq3s56sw',
        title: 'Industrial engineering. Management engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uivq008sl2rsh8muvs18'
                }
            ]
        }
    },
    {
        id: 'clkv6umaz01jal2rsrb274nq7',
        title: 'Technical education. Technical schools',
        parents: {
            connect: [
                {
                    id: 'clkv6uivq008sl2rsh8muvs18'
                }
            ]
        }
    },
    {
        id: 'clkv6umb401jcl2rssqd0hs8w',
        title: 'Technological change',
        parents: {
            connect: [
                {
                    id: 'clkv6uivq008sl2rsh8muvs18'
                }
            ]
        }
    },
    {
        id: 'clkv6umba01jel2rsb4toro2l',
        title: 'Industrial research. Research and development',
        parents: {
            connect: [
                {
                    id: 'clkv6uivq008sl2rsh8muvs18'
                }
            ]
        }
    },
    {
        id: 'clkv6umbg01jgl2rsw9yl0d69',
        title: 'Patents. Trademarks',
        parents: {
            connect: [
                {
                    id: 'clkv6uivq008sl2rsh8muvs18'
                }
            ]
        }
    },
    {
        id: 'clkv6umbo01jil2rsgpocfxd4',
        title: 'Mechanical drawing. Engineering graphics',
        parents: {
            connect: [
                {
                    id: 'clkv6uivq008sl2rsh8muvs18'
                }
            ]
        }
    },
    {
        id: 'clkv6umbt01jkl2rs4tt27sx7',
        title: 'Bioengineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umbx01jml2rsi0rp27m1',
        title: 'Engineering instruments, meters, etc. Industrial instrumentation',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umc101jol2rs0f3z7pa8',
        title: 'Human engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umc501jql2rsuymt98gi',
        title: 'Systems engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umca01jsl2rsolavjoy4',
        title: 'Environmental engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umcf01jul2rscf6c2ev9',
        title: 'Engineering design',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umcj01jwl2rs7ub3rs53',
        title: 'Engineering economy',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umcn01jyl2rswygwt09z',
        title: 'Management of engineering works',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umcs01k0l2rsposwtu85',
        title: 'Engineering meteorology',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umcw01k2l2rszmyrhsez',
        title: 'Engineering machinery, tools, and implements',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umd201k4l2rstvuwxp3k',
        title: 'Engineering mathematics. Engineering analysis',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umd601k6l2rsu46qmvdi',
        title: 'Mechanics of engineering. Applied mechanics',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umdb01k8l2rsvc0hjdj2',
        title: 'Acoustics in engineering. Acoustical engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umdh01kal2rso1xg92bv',
        title: 'Materials of engineering and construction. Mechanics of materials',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umdn01kcl2rsfhdogs6y',
        title: 'Disasters and engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umdr01kel2rsal22sg3e',
        title: 'Surveying',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umdv01kgl2rs2hny6nhk',
        title: 'Structural engineering (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6ume001kil2rsiac22m0g',
        title: 'Engineering geology. Rock mechanics. Soil mechanics. Underground construction',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6ume701kkl2rsmhcbx6le',
        title: 'Earthwork. Foundations',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umeb01kml2rs3w2kygye',
        title: 'Tunneling. Tunnels',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umeg01kol2rskno90pcq',
        title: 'Transportation engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umek01kql2rslbitdgiv',
        title: 'Applied optics. Photonics',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umeo01ksl2rsbxnaxdo8',
        title: 'Plasma engineering. Applied plasma dynamics',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'clkv6umew01kul2rsrvt6hyju',
        title: 'Technical hydraulics',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw0008wl2rsgixmq1s5'
                }
            ]
        }
    },
    {
        id: 'clkv6umf001kwl2rssccrfzxp',
        title: 'General preliminary operations. Dredging. Submarine building',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw0008wl2rsgixmq1s5'
                }
            ]
        }
    },
    {
        id: 'clkv6umf401kyl2rsxdjsiyve',
        title: 'Harbors and coast protective works. Coastal engineering. Lighthouses',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw0008wl2rsgixmq1s5'
                }
            ]
        }
    },
    {
        id: 'clkv6umf901l0l2rspzjoohi8',
        title: 'River, lake, and water-supply engineering (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw0008wl2rsgixmq1s5'
                }
            ]
        }
    },
    {
        id: 'clkv6umff01l2l2rshxkzzn2m',
        title: 'River protective works. Regulation. Flood control',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw0008wl2rsgixmq1s5'
                }
            ]
        }
    },
    {
        id: 'clkv6umfj01l4l2rsmdfr8f4x',
        title: 'Dams. Barrages',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw0008wl2rsgixmq1s5'
                }
            ]
        }
    },
    {
        id: 'clkv6umfo01l6l2rshh50rcsf',
        title: 'Canals and inland navigation. Waterways',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw0008wl2rsgixmq1s5'
                }
            ]
        }
    },
    {
        id: 'clkv6umfs01l8l2rsz6mzyuch',
        title: 'Irrigation engineering. Reclamation of wasteland. Drainage',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw0008wl2rsgixmq1s5'
                }
            ]
        }
    },
    {
        id: 'clkv6umg201lcl2rsmsiwtznc',
        title: 'Environmental protection',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umgb01lgl2rsn5k6rmyy',
        title: 'Environmental effects of industries and plants',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umgg01lil2rs7li59j6g',
        title: 'Water supply for domestic and industrial purposes',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umgl01lkl2rskgakhy2r',
        title: 'Sewage collection and disposal systems. Sewerage',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umgr01lml2rsimp5cyc9',
        title: 'Municipal refuse. Solid wastes',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umgx01lol2rs67u750qc',
        title: 'Street cleaning. Litter and its removal',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umh101lql2rsjy48yla8',
        title: 'Industrial and factory sanitation',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umh601lsl2rsbe443gkt',
        title: 'Rural and farm sanitary engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umhb01lul2rs4wtgonfs',
        title: 'Low temperature sanitary engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umhg01lwl2rsg7okxg5c',
        title: 'Hazardous substances and their disposal',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                }
            ]
        }
    },
    {
        id: 'clkv6umhl01lyl2rsr7w73yme',
        title: 'Highway design. Interchanges and intersections',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwl0090l2rshs1ekb0w'
                }
            ]
        }
    },
    {
        id: 'clkv6umhy01m0l2rsritmb915',
        title: 'Furs',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umi401m2l2rsy88amw66',
        title: 'Roadside development. Landscaping',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwl0090l2rshs1ekb0w'
                }
            ]
        }
    },
    {
        id: 'clkv6umi901m4l2rsoj6ldvx6',
        title: 'Materials for roadmaking',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwl0090l2rshs1ekb0w'
                }
            ]
        }
    },
    {
        id: 'clkv6umie01m6l2rs6xwfhkyv',
        title: 'Location engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwl0090l2rshs1ekb0w'
                }
            ]
        }
    },
    {
        id: 'clkv6umij01m8l2rsrfujpfqg',
        title: 'Pavements and paved roads',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwl0090l2rshs1ekb0w'
                }
            ]
        }
    },
    {
        id: 'clkv6umio01mal2rsc5mk8xq7',
        title: 'Streets',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwl0090l2rshs1ekb0w'
                }
            ]
        }
    },
    {
        id: 'clkv6umit01mcl2rsh8ktg0tr',
        title: 'Pedestrian facilities',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwl0090l2rshs1ekb0w'
                }
            ]
        }
    },
    {
        id: 'clkv6umix01mel2rs1gy4mtqa',
        title: 'Railway construction',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwq0092l2rsur74axhr'
                }
            ]
        }
    },
    {
        id: 'clkv6umj201mgl2rsews9k4kc',
        title: 'Railway equipment and supplies',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwq0092l2rsur74axhr'
                }
            ]
        }
    },
    {
        id: 'clkv6umj601mil2rsfjkpk41m',
        title: 'Railway operation and management',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwq0092l2rsur74axhr'
                }
            ]
        }
    },
    {
        id: 'clkv6umjb01mkl2rskh9pct42',
        title: 'Local and light railways',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwq0092l2rsur74axhr'
                }
            ]
        }
    },
    {
        id: 'clkv6umjg01mml2rsjp8op4cg',
        title: 'Electric railways',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwq0092l2rsur74axhr'
                }
            ]
        }
    },
    {
        id: 'clkv6umjl01mol2rsp5gejv7d',
        title: 'High speed ground transporation',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwq0092l2rsur74axhr'
                }
            ]
        }
    },
    {
        id: 'clkv6umjr01mql2rssa2s6r40',
        title: 'Architectural engineering. Structural engineering of buildings',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6umjw01msl2rsq05i35up',
        title: 'Construction equipment in building',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6umk101mul2rso3n4u9id',
        title: 'Details in building design and construction',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6umk501mwl2rsswcextbe',
        title: 'Maintenance and repair',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6umka01myl2rs3v9o6osm',
        title: 'Construction by phase of the work (Building trades)',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6umkf01n0l2rsx5f6rm2c',
        title: 'Environmental engineering of buildings. Sanitary engineering of buildings',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6umkj01n2l2rsxsydjv5t',
        title: 'Construction details. Including foundations, maintenance, equipment',
        parents: {
            connect: [
                {
                    id: 'clkv6uiwl0090l2rshs1ekb0w'
                }
            ]
        }
    },
    {
        id: 'clkv6umko01n4l2rsh7d8ld6c',
        title: 'Plumbing and pipefitting',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6umku01n6l2rsjcwjrvuw',
        title: 'Heating and ventilation. Air conditioning',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6umky01n8l2rs7u9i4k7e',
        title: 'Illumination. Lighting',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6uml301nal2rsg4m870jr',
        title: 'Electric meters',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6uml701ncl2rs2deqa1ug',
        title: 'Decoration and decorative furnishings',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6umlc01nel2rs4z4vbfcn',
        title: 'Agricultural machinery. Farm machinery',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umlk01ngl2rsgrl7xptu',
        title: 'Power resources',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umlo01nil2rstgkvhzss',
        title: 'Energy conservation',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umlt01nkl2rstepi279t',
        title: 'Mechanics applied to machinery. Dynamics',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umly01nml2rsdrbcd5xu',
        title: 'Mechanical movements',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umm201nol2rsd5e3rurv',
        title: 'Mechanical devices and figures. Automata. Ingenious mechanisms. Robots (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umm601nql2rsyij77qor',
        title: 'Control engineering systems. Automatic machinery (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6ummb01nsl2rsv4lfmcpm',
        title: 'Machine design and drawing',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6ummh01nul2rsnre7moh6',
        title: 'Machine construction (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6ummn01nwl2rsx4c8nuhq',
        title: 'Heat engines',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umms01nyl2rstxrvu8vd',
        title: 'Turbines. Turbomachines (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umn201o0l2rskwocy4wf',
        title: 'Steam engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umng01o4l2rsq0il9t6t',
        title: 'Hydraulic machinery',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umnn01o6l2rsgoml5ys2',
        title: 'Vacuum technology',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umnu01o8l2rsapsr9zdl',
        title: 'Pneumatic machinery',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umo401ocl2rslwic1xtb',
        title: 'Machinery exclusive of prime movers',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umob01oel2rswxnkqwop',
        title: 'Machine shops and machine shop practice',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umoj01ogl2rsxojhqb7w',
        title: 'Hoisting and conveying machinery',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umop01oil2rsmdytnhg0',
        title: 'Lifting and pressing machinery',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umou01okl2rsft19u943',
        title: 'Sewing machines',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6umoz01oml2rsvqqbh0kc',
        title: 'Electric apparatus and materials. Electric circuits. Electric networks',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6ump301ool2rsf4hcy5ob',
        title: 'Production of electric energy or power. Powerplants. Central stations',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6ump801oql2rsxyw9bgoa',
        title: 'Production of electricity by direct energy conversion',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6umpc01osl2rsuamn83gf',
        title: 'Distribution or transmission of electric power',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6umpj01oul2rs9ntbx6ix',
        title: 'Applications of electric power',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6umpn01owl2rs0r9zyo5o',
        title: 'Electric lighting',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6umps01oyl2rs32tpoujg',
        title: 'Electric heating',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6umpx01p0l2rste23gojz',
        title: 'Telecommunication',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6umq201p2l2rsa44opac8',
        title: 'Electronics',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6umq601p4l2rseps6hfu9',
        title: 'Nuclear engineering. Atomic power',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6umqp01pal2rstmxp0phx',
        title: 'Motor vehicles. Cycles',
        parents: {
            connect: [
                {
                    id: 'clkv6uixg009cl2rsstuu3w6z'
                }
            ]
        }
    },
    {
        id: 'clkv6umqu01pcl2rsk2ohgs0b',
        title: 'Aeronautics. Aeronautical engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uixg009cl2rsstuu3w6z'
                }
            ]
        }
    },
    {
        id: 'clkv6umqy01pel2rsmnk1wgtd',
        title: 'Rocket propulsion. Rockets',
        parents: {
            connect: [
                {
                    id: 'clkv6uixg009cl2rsstuu3w6z'
                }
            ]
        }
    },
    {
        id: 'clkv6umr301pgl2rsqtd2pgqf',
        title: 'Astronautics. Space travel',
        parents: {
            connect: [
                {
                    id: 'clkv6uixg009cl2rsstuu3w6z'
                }
            ]
        }
    },
    {
        id: 'clkv6umrl01pil2rsmixd21l9',
        title: 'Chemical engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umrr01pkl2rs6yfe21ht',
        title: 'Chemicals: Manufacture, use, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umry01pml2rsm88kiw2g',
        title: 'Biotechnology',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6ums301pol2rs1rg8ji0b',
        title: 'Industrial electrochemistry',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6ums701pql2rstb4t050i',
        title: 'Explosives and pyrotechnics',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umsc01psl2rs91pasdxy',
        title: 'Food processing and manufacture',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umsk01pul2rsdqxhxvx1',
        title: 'Low temperature engineering. Cryogenic engineering. Refrigeration',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umss01pwl2rsfllw7oik',
        title: 'Fermentation industries. Beverages. Alcohol',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umt001pyl2rsx5rv53bn',
        title: 'Oils, fats, and waxes',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umt601q0l2rsnq3no5xy',
        title: 'Illuminating industries (Nonelectric)',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umtp01q2l2rsvsiafm9q',
        title: 'Gas industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umtv01q4l2rs2c9w13j0',
        title: 'Clay industries. Ceramics. Glass',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umu101q6l2rs97tmwbs0',
        title: 'Cement industries',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umu601q8l2rsbo4fhgap',
        title: 'Textile bleaching, dyeing, printing, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umua01qal2rsxkt7t55x',
        title: 'Paints, pigments, varnishes, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umuf01qcl2rsfnrg151f',
        title: 'Polymers and polymer manufacture',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6umuj01qel2rsja46tb9e',
        title: 'Production management. Operations management',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umuo01qgl2rsr0cexjr0',
        title: 'Packaging',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umuu01qil2rs7bnqttqh',
        title: 'Metal manufactures. Metalworking',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umuz01qkl2rsrj98pqvv',
        title: 'Stonework',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umv301qml2rsslh27nsr',
        title: 'Wood technology. Lumber',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umv801qol2rsak2lceop',
        title: 'Leather industries. Tanning',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umvc01qql2rs6uwmniar',
        title: 'Paper manufacture and trade',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umvh01qsl2rsky3auj0g',
        title: 'Textile industries',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umvo01qul2rshetgxhxv',
        title: 'Rubber industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umvt01qwl2rs94k4o46n',
        title: 'Animal products',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umvy01qyl2rsohco4o36',
        title: 'Cereals and grain. Milling industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umw301r0l2rsz0mz5ueg',
        title: 'Tobacco industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umw701r2l2rs30a6ltph',
        title: 'Animal feeds and feed mills. Pet food industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uixz009kl2rs3gik1btu'
                }
            ]
        }
    },
    {
        id: 'clkv6umwo01r8l2rsa1l8c4zm',
        title: 'Medical geography. Climatology. Meteorology',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                }
            ]
        }
    },
    {
        id: 'clkv6umwt01ral2rsmrg0pcy1',
        title: 'Forensic medicine. Medical jurisprudence. Legal medicine',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                }
            ]
        }
    },
    {
        id: 'clkv6umx101rcl2rs2oa8hbkt',
        title: 'Toxicology. Poisons',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                }
            ]
        }
    },
    {
        id: 'clkv6umx601rel2rs4esv6qn7',
        title: 'Psychosomatic medicine',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6umxc01rgl2rspt06st7z',
        title: 'Medical emergencies. Critical care. Intensive care. First aid',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6umxg01ril2rs1y5rm4hl',
        title: 'Disease due to physical and chemical agents',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6umxl01rkl2rss5njw10t',
        title: 'Infectious and parasitic diseases',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6umxp01rml2rsgbt85zcx',
        title: 'Constitutional diseases (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6umxu01rol2rs0o2htp3w',
        title: 'Neurosciences. Biological psychiatry. Neuropsychiatry',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6umxy01rql2rs8vtog0ve',
        title: 'Specialties of internal medicine',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6umy301rsl2rsa5f2kuy9',
        title: 'Geriatrics',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6umzo01sel2rsx1k43o0e',
        title: 'Operative surgery. Technique of surgical operations',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6umzt01sgl2rslrf5eaw0',
        title: 'Surgical therapeutics. Preoperative and postoperative care',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6umzx01sil2rsddiqmcm1',
        title: 'Surgical pathology',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un0201skl2rs5u8ujhl6',
        title: 'Reparative processes after operations (Physiological)',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un0801sml2rscpg8ukaj',
        title: 'Surgical shock. Traumatic shock',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un0d01sol2rs82qexicx',
        title: 'Operating rooms and theaters. Instruments, apparatus, and appliances',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un0h01sql2rsvuv9am3x',
        title: 'Anesthesiology',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un0m01ssl2rszg6v2vr6',
        title: 'Asepsis and antisepsis. Sterilization (Operative)',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un0r01sul2rsdsj1n3ac',
        title: 'Emergency surgery. Wounds and injuries',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un0v01swl2rsjp8jw852',
        title: 'Surgical complications',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un1001syl2rssvcmbiwb',
        title: 'Surgical nursing',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un1601t0l2rsg735wv2b',
        title: 'Fractures (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un1e01t2l2rswyf52xhd',
        title: 'Plastic surgery. Reparative surgery',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un1j01t4l2rsnscetepa',
        title: 'Transplantation of organs, tissues, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un1o01t6l2rsrt69wn11',
        title: 'Prosthesis. Artificial organs',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un1t01t8l2rspnpec8gl',
        title: 'Surgery in childhood, adolescence, pregnancy, old age',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un1y01tal2rs9evym756',
        title: 'Military and naval surgery',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un2201tcl2rsqqtk2twj',
        title: 'Surgery by region, system, or organ',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un2601tel2rsspdpcwdg',
        title: 'Neoplasms. Tumors. Oncology',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un2b01tgl2rsk6ra3e2k',
        title: 'Diseases of the locomotor system (Surgical treatment)',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un2f01til2rsgmt2zyiy',
        title: 'Orthopedic surgery',
        parents: {
            connect: [
                {
                    id: 'clkv6uise007ql2rsazisnkq7'
                }
            ]
        }
    },
    {
        id: 'clkv6un2o01tml2rsjtcqpdlk',
        title: 'materials antimicrobial',
        parents: {
            connect: [
                {
                    id: 'clkv6uixq009gl2rsozmvgr1w'
                }
            ]
        }
    },
    {
        id: 'clkv6un4c01ual2rsxz2she5y',
        title: 'cement',
        parents: {
            connect: [
                {
                    id: 'clkv6unbi01wwl2rs9vx32k1b'
                }
            ]
        }
    },
    {
        id: 'clkv6un8z01vul2rsch12o6v2',
        title: 'shale',
        parents: {
            connect: [
                {
                    id: 'clkv6unbi01wwl2rs9vx32k1b'
                }
            ]
        }
    },
    {
        id: 'clkv6un9701vyl2rsqqfln73c',
        title: 'soil',
        parents: {
            connect: [
                {
                    id: 'clkv6unbi01wwl2rs9vx32k1b'
                }
            ]
        }
    },
    {
        id: 'clkv6un9l01w2l2rs0faeq70p',
        title: 'composite material',
        parents: {
            connect: [
                {
                    id: 'clkv6unbi01wwl2rs9vx32k1b'
                }
            ]
        }
    },
    {
        id: 'clkv6unbm01wyl2rsfbrbm8eq',
        title: 'materials',
        parents: {
            connect: [
                {
                    id: 'clkv6unbi01wwl2rs9vx32k1b'
                }
            ]
        }
    },
    {
        id: 'clkv6unc301x6l2rsfn72udn0',
        title: 'plastic deformation',
        parents: {
            connect: [
                {
                    id: 'clkv6unbi01wwl2rs9vx32k1b'
                }
            ]
        }
    },
    {
        id: 'clkv6uodg02cal2rsmvkm11l8',
        title: 'endometriosis',
        parents: {
            connect: [
                {
                    id: 'clkv6uisu007wl2rsi3y77wzq'
                }
            ]
        }
    },
    {
        id: 'clkv6uof502cyl2rsqzqb624p',
        title: 'pregnancy',
        parents: {
            connect: [
                {
                    id: 'clkv6uisu007wl2rsi3y77wzq'
                }
            ]
        }
    },
    {
        id: 'clkv6updi02q2l2rsx6hdf271',
        title: 'retinal degeneration',
        parents: {
            connect: [
                {
                    id: 'clkv6uisi007sl2rs74jseior'
                }
            ]
        }
    },
    {
        id: 'clkv6updr02q6l2rsrbv7e5qz',
        title: 'glaucoma',
        parents: {
            connect: [
                {
                    id: 'clkv6uisi007sl2rs74jseior'
                }
            ]
        }
    },
    {
        id: 'clkv6updw02q8l2rstxv815np',
        title: 'macular degeneration',
        parents: {
            connect: [
                {
                    id: 'clkv6uisi007sl2rs74jseior'
                }
            ]
        }
    },
    {
        id: 'clkv6upe102qal2rsudzus901',
        title: 'corneal blindness',
        parents: {
            connect: [
                {
                    id: 'clkv6uisi007sl2rs74jseior'
                }
            ]
        }
    },
    {
        id: 'clkv6upea02qel2rslxctr006',
        title: 'vision loss',
        parents: {
            connect: [
                {
                    id: 'clkv6uisi007sl2rs74jseior'
                }
            ]
        }
    },
    {
        id: 'clkv6upek02qil2rskw5fet0c',
        title: 'nausea',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6upfb02qol2rsed8nd22y',
        title: 'characterized congenital',
        parents: {
            connect: [
                {
                    id: 'clkv6uis5007ml2rsmdas1r2p'
                }
            ]
        }
    },
    {
        id: 'clkv6upfh02qql2rs87n7p4mw',
        title: 'muscular dystrophy',
        parents: {
            connect: [
                {
                    id: 'clkv6uis5007ml2rsmdas1r2p'
                }
            ]
        }
    },
    {
        id: 'clkv6upgo02r4l2rsl3pn3ld2',
        title: 'rare disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uis5007ml2rsmdas1r2p'
                }
            ]
        }
    },
    {
        id: 'clkv6upk502sel2rskx77x7o8',
        title: 'death worldwide',
        parents: {
            connect: [
                {
                    id: 'clkv6uirq007gl2rslef9w0la'
                }
            ]
        }
    },
    {
        id: 'clkv6upl202ssl2rsgtp78yns',
        title: 'health issue',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                }
            ]
        }
    },
    {
        id: 'clkv6upl602sul2rssh83e6f8',
        title: 'health threat',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                }
            ]
        }
    },
    {
        id: 'clkv6uplb02swl2rs3hxrxyl1',
        title: 'public health',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                }
            ]
        }
    },
    {
        id: 'clkv6uplg02syl2rsvhn1l963',
        title: 'strain healthcare',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                }
            ]
        }
    },
    {
        id: 'clkv6upm302t6l2rs8z1q86qr',
        title: 'sexual minority',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                }
            ]
        }
    },
    {
        id: 'clkv6upmj02tcl2rsfmf2o1h8',
        title: "Meteorology. Climatology, including the earth's atmosphere",
        parents: {
            connect: [
                {
                    id: 'clkv6uiqb006yl2rswqz1n2u3'
                }
            ]
        }
    },
    {
        id: 'clkv6upmn02tel2rsjqbnour8',
        title: 'Buildings: Construction with reference to use including public buildings, dwellings',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6upms02tgl2rsar7qlnok',
        title: 'Protection of buildings including protection from dampness, fire, burglary',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6upn502tml2rsmpz755d6',
        title: 'Miscellaneous motors and engines including gas, gasoline, diesel engines',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6upn902tol2rsv5q2w7uv',
        title: 'Neoplasms. Tumors. Oncology including cancer and carcinogens',
        parents: {
            connect: [
                {
                    id: 'clkv6uis9007ol2rscww8jqhv'
                }
            ]
        }
    },
    {
        id: 'clkv6upnn02tsl2rshbvtl7di',
        title: 'History of economics. History of economic theory. Including special economic schools',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6upns02tul2rs3o2j7sod',
        title: 'Mathematical economics. Quantitative methods. Including econometrics, input-output analysis, game theory',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'clkv6upon02u8l2rs6rk8ssj5',
        title: 'Automotive transportation. Including trucking, bus lines, and taxicab service',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'clkv6upos02ual2rswg7o0a6m',
        title: 'Credit. Debt. Loans. Including credit institutions, credit instruments, consumer credit, bankruptcy',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'clkv6upow02ucl2rsatip5a5k',
        title: 'Local finance. Municipal finance. Including the revenue, budget, expenditure, etc. of counties, boroughs, communes, municipalities, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6uih0003il2rse0gf3xps'
                }
            ]
        }
    },
    {
        id: 'clkv6upp602ugl2rsxqip2f38',
        title: 'Parents. Parenthood. Including parent and child, husbands, fathers, wives, mothers',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6uppb02uil2rsn87ce25x',
        title: "Children. Child development. Including child rearing, child life, play, socialization, children's rights",
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'clkv6uppg02ukl2rseletjvay',
        title: 'Systems of building construction. Including fireproof construction, concrete construction',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6uppk02uml2rsol7x94cz',
        title: 'Including walls, roofs',
        parents: {
            connect: [
                {
                    id: 'clkv6uix10096l2rs6utezvbo'
                }
            ]
        }
    },
    {
        id: 'clkv6uppp02uol2rsvq848khx',
        title: 'Dynamoelectric machinery and auxiliaries. Including generators, motors, transformers',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'clkv6upqt02v2l2rsvrl9spr1',
        title: 'Judaism',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6upr002v4l2rsn3w10yjv',
        title: 'Islam. Bahaism. Theosophy, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6upr502v6l2rs1pnxx3b7',
        title: 'Buddhism',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6upra02v8l2rsoxdig4vr',
        title: 'Christianity',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uprj02vcl2rsgtigdowr',
        title: 'Doctrinal Theology',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6upro02vel2rs9n5o04j9',
        title: 'Practical Theology',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uprx02vil2rsztd6vwmh',
        title: 'Methodology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq202uul2rs71vfudyj'
                }
            ]
        }
    },
    {
        id: 'clkv6ups102vkl2rsgsk7wl6w',
        title: 'Ontology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq202uul2rs71vfudyj'
                }
            ]
        }
    },
    {
        id: 'clkv6ups602vml2rsebviz3o8',
        title: 'Being, the soul, life, death',
        parents: {
            connect: [
                {
                    id: 'clkv6upq202uul2rs71vfudyj'
                }
            ]
        }
    },
    {
        id: 'clkv6upsa02vol2rsbtg0sz3h',
        title: 'Cosmology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq202uul2rs71vfudyj'
                }
            ]
        }
    },
    {
        id: 'clkv6upsi02vql2rsklq395dl',
        title: 'Teleology, space and time, structure of matter, plurality of worlds',
        parents: {
            connect: [
                {
                    id: 'clkv6upq202uul2rs71vfudyj'
                }
            ]
        }
    },
    {
        id: 'clkv6upst02vsl2rsnuukw5aw',
        title: 'Philosophy. Relation to other topics',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upsz02vul2rsmavkl56m',
        title: 'Psychoanalysis',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upt402vwl2rswjc2mrbz',
        title: 'Psychological tests and testing',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upta02vyl2rsjle9yam6',
        title: 'Experimental psychology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upte02w0l2rs6nodzxnm',
        title: 'Gestalt psychology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upv802wol2rsq5xehjwr',
        title: 'Ancient',
        parents: {
            connect: [
                {
                    id: 'clkv6upnj02tql2rsq1aglvh5'
                }
            ]
        }
    },
    {
        id: 'clkv6upvc02wql2rsf96cgh1d',
        title: 'Medieval',
        parents: {
            connect: [
                {
                    id: 'clkv6upnj02tql2rsq1aglvh5'
                }
            ]
        }
    },
    {
        id: 'clkv6upvh02wsl2rsefdcyds7',
        title: 'Renaissance',
        parents: {
            connect: [
                {
                    id: 'clkv6upnj02tql2rsq1aglvh5'
                }
            ]
        }
    },
    {
        id: 'clkv6upvn02wul2rsu22qavdo',
        title: 'Modern',
        parents: {
            connect: [
                {
                    id: 'clkv6upnj02tql2rsq1aglvh5'
                }
            ]
        }
    },
    {
        id: 'clkv6upvt02wwl2rsytf0n9my',
        title: 'Metaphysics',
        parents: {
            connect: [
                {
                    id: 'clkv6upq202uul2rs71vfudyj'
                }
            ]
        }
    },
    {
        id: 'clkv6upvy02wyl2rsye1wp8uz',
        title: 'Epistemology. Theory of knowledge',
        parents: {
            connect: [
                {
                    id: 'clkv6upq202uul2rs71vfudyj'
                }
            ]
        }
    },
    {
        id: 'clkv6upw302x0l2rsi7utsygh',
        title: 'Psychotropic drugs and other substances',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upw702x2l2rs6pdouhl9',
        title: 'Sensation. Aesthesiology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upwc02x4l2rs5ezmwxz6',
        title: 'Parapsychology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upxa02xil2rsxr9cj8uf',
        title: 'History of ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6upxf02xkl2rsh6ed3hy0',
        title: 'Religious ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6upxk02xml2rsrajtfzld',
        title: 'Evolutionary and genetic ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6upxo02xol2rs82ueh5cx',
        title: 'Positivist ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6upxs02xql2rsd1hbjcdz',
        title: 'Socialist ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6upxw02xsl2rsdhjl7fu6',
        title: 'Communist ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6upy002xul2rsj4f6bp3m',
        title: 'Totalitarian ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6upy502xwl2rslwpa1k0k',
        title: 'Feminist ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6upy902xyl2rs1luw6vjz',
        title: 'Individual ethics. Character. Virtue',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6upyd02y0l2rs6mddkgnj',
        title: 'Consciousness. Cognition. Including learning, attention, comprehension, memory, imagination, genius, intelligence, thought and thinking, psycholinguistics, mental fatigue',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upyh02y2l2rsy7q1ykv9',
        title: 'Motivation',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upym02y4l2rs7cvv8tut',
        title: 'Affection. Feeling. Emotion',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upyq02y6l2rsyinfsx3x',
        title: 'Will. Volition. Choice. Control',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upyu02y8l2rs6mguksd3',
        title: 'Applied psychology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upyz02yal2rs9r76eguk',
        title: 'New Thought. Menticulture, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upz302ycl2rsdt8thdj9',
        title: 'Comparative psychology. Animal and human psychology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upz802yel2rs5t5q9zxh',
        title: 'Psychology of sex. Sexual behavior',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upzd02ygl2rs4ixnx4p7',
        title: 'Differential psychology. Individuality. Self',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upzh02yil2rs18ub965z',
        title: 'Personality',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upzl02ykl2rsuh1c5t4t',
        title: 'Genetic psychology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upzq02yml2rsx1qfddw9',
        title: 'Developmental psychology. Including infant psychology, child psychology, adolescence, adulthood.',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upzu02yol2rsi388210p',
        title: 'Class psychology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6upzy02yql2rsmudwld8x',
        title: 'Temperament. Character',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6uq0202ysl2rs7vu7kca6',
        title: 'Physiognomy. Phrenology',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6uq0602yul2rs8wp2pel6',
        title: 'Graphology. Study of handwriting',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6uq0b02ywl2rsftrf7dw5',
        title: 'The hand. Palmistry',
        parents: {
            connect: [
                {
                    id: 'clkv6upq602uwl2rsf928hpia'
                }
            ]
        }
    },
    {
        id: 'clkv6uq0j02z0l2rs1z3lasgy',
        title: 'Practical and applied ethics, conduct of life, vices, success, ethics for children',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6uq0n02z2l2rsfo9k34py',
        title: 'Ethics of social groups, classes, etc. Professional ethics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmw02til2rsrq5otsg3'
                }
            ]
        }
    },
    {
        id: 'clkv6uq0r02z4l2rsh1i44c87',
        title: 'Philosophy of religion. Psychology of religion. Religion in relation to other subjects',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq0w02z6l2rsgrwwumyu',
        title: 'Natural theology',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq0z02z8l2rsr7g5338g',
        title: 'Unity and plurality',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq1402zal2rsv9m4men4',
        title: 'The soul',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq1802zcl2rsqlkk1ztj',
        title: 'The myth. Comparative mythology',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq1c02zel2rsipkv7q69',
        title: 'Classification of religions',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq1g02zgl2rs572j0y7l',
        title: 'Religions in relation to one another',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq1k02zil2rsairj8zsr',
        title: 'Religious doctrines (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq1s02zkl2rs89xpvkqd',
        title: 'Eschatology',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq1x02zml2rs72fhtcfc',
        title: 'Worship. Cultus',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq2102zol2rsg71e9o15',
        title: 'Religious life',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq2602zql2rsi4g2nab6',
        title: 'Religious organization',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq2a02zsl2rslsrep4a1',
        title: 'History and principles of religions',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq2f02zul2rslmajhhh4',
        title: 'Rationalism',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'clkv6uq66031gl2rsz0v54s0t',
        title: 'environmental problems',
        parents: {
            connect: [
                {
                    id: 'clkv6uiap001el2rstc6g46k4'
                }
            ]
        }
    },
    {
        id: 'clwueaif500013s9ot60ojc4t',
        title: 'Library and Information Science',
        parents: {
            connect: [
                {
                    id: 'clkv6uifo0032l2rss499377e'
                }
            ]
        }
    },
    {
        id: 'clwueaou900023s9o6drho4dy',
        title: 'Drama, Theatre and Performing Arts',
        parents: {
            connect: [
                {
                    id: 'clkv6uilm005cl2rsx9weklg5'
                },
                {
                    id: 'clkv6uin2005ql2rsomudbp39'
                }
            ]
        }
    },
    {
        id: 'clwueb73z00043s9oqx3zdqky',
        title: 'Sport Science',
        parents: {
            connect: [
                {
                    id: 'clkv6uirf007cl2rs5jaofpzr'
                }
            ]
        }
    },
    {
        id: 'clkv6umnb01o2l2rsvv8x4mrz',
        title: 'Alternative Energy and Renewable Energy Sources.',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'clkv6ulw601e2l2rswgxf7j00',
        title: 'Public accounting & auditing',
        parents: {
            connect: [
                {
                    id: 'clkv6uih0003il2rse0gf3xps'
                }
            ]
        }
    },
    {
        id: 'clkv6um5x01hil2rsbd75wsdc',
        title: 'Cosmology',
        parents: {
            connect: [
                {
                    id: 'clkv6uiq6006wl2rstcdpuok4'
                }
            ]
        }
    },
    {
        id: 'clkv6upk002scl2rsfxnmur0m',
        title: 'Disability and mortality',
        parents: {
            connect: [
                {
                    id: 'clkv6uirq007gl2rslef9w0la'
                }
            ]
        }
    },
    {
        id: 'clkv6ulie018il2rsgnzwo1y7',
        title: 'Labor and employment',
        parents: {
            connect: [
                {
                    id: 'clkv6uiga003al2rs5qdze4nr'
                }
            ]
        }
    },
    {
        id: 'clkv6umwd01r4l2rscz3kvmf0',
        title: 'Hygiene and preventative medicine',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                }
            ]
        }
    },
    {
        id: 'clkv6ujbl00f8l2rsjfbceicm',
        title: 'German Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ui7y0008l2rsv5gbxyzp'
                }
            ]
        }
    },
    {
        id: 'clkv6ulsh01ckl2rstds29msx',
        title: 'Telecommunication industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uigf003cl2rsanvnjdgl'
                }
            ]
        }
    },
    {
        id: 'cly468yf300007ryzm3e5px2a',
        title: 'Crime',
        parents: {
            connect: [
                {
                    id: 'clkv6uihz003ul2rs01rx3lij'
                }
            ]
        }
    },
    {
        id: 'cly468yph00047ryzwqn34dkp',
        title: 'Terrorism',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468yqj000a7ryzierqdzvf',
        title: 'Accounting & Auditing',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'cly468yrp000g7ryzi1z03yas',
        title: 'Ageism',
        parents: {
            connect: [
                {
                    id: 'clkv6uihb003ml2rsxlkhas5d'
                }
            ]
        }
    },
    {
        id: 'cly468yrz000i7ryzuwowhrgl',
        title: 'Abusive behaviour',
        parents: {
            connect: [
                {
                    id: 'clkv6uihz003ul2rs01rx3lij'
                }
            ]
        }
    },
    {
        id: 'cly468ysb000k7ryzb606kiuh',
        title: 'Bombings',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468ytp000p7ryzmxf18qkz',
        title: 'Budgets and budgeting',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'cly468yu7000s7ryzwsvk9zjs',
        title: 'Border disputes',
        parents: {
            connect: [
                {
                    id: 'cly468yu0000r7ryz7geu8rw9'
                }
            ]
        }
    },
    {
        id: 'cly468yun000t7ryzl4ysmzhy',
        title: 'Belief Systems (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'cly468yv1000v7ryzty41klkp',
        title: 'Bullying',
        parents: {
            connect: [
                {
                    id: 'clkv6uihz003ul2rs01rx3lij'
                }
            ]
        }
    },
    {
        id: 'cly468ywd000x7ryz9e12502q',
        title: 'Civil War',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468yxi00137ryzao3808mf',
        title: 'Jurisprudence',
        parents: {
            connect: [
                {
                    id: 'clkv6uii8003yl2rsc73ua7b5'
                }
            ]
        }
    },
    {
        id: 'cly468yxp00147ryzbhn7wkds',
        title: 'Criminal law in general',
        parents: {
            connect: [
                {
                    id: 'clkv6uii8003yl2rsc73ua7b5'
                }
            ]
        }
    },
    {
        id: 'cly468yyi00187ryzt22ty3w7',
        title: 'Information technology',
        parents: {
            connect: [
                {
                    id: 'cly468yyb00177ryzsvccai51'
                }
            ]
        }
    },
    {
        id: 'cly468yzt001f7ryzdh7hi1gt',
        title: 'Casinos and gambling',
        parents: {
            connect: [
                {
                    id: 'clkv6uifi0030l2rs04184e2h'
                }
            ]
        }
    },
    {
        id: 'cly468z0e001j7ryzzx2yduz4',
        title: 'Currency',
        parents: {
            connect: [
                {
                    id: 'clkv6uigp003gl2rspcc4j1jx'
                }
            ]
        }
    },
    {
        id: 'cly468z14001o7ryzk0n5bh9m',
        title: 'Labour economics',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'cly468z34001u7ryz20wang92',
        title: 'Civil and public service',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468z39001v7ryzas778rb2',
        title: 'Civilian service',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468z3y00207ryzqvis97dw',
        title: 'Disinformation and misinformation',
        parents: {
            connect: [
                {
                    id: 'clkv6uih6003kl2rspbobfpy8'
                }
            ]
        }
    },
    {
        id: 'cly468z4300217ryzhkhex6l3',
        title: 'Disarmament',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468z6200297ryz1ldm7jf8',
        title: 'Data protection',
        parents: {
            connect: [
                {
                    id: 'clkv6uii8003yl2rsc73ua7b5'
                }
            ]
        }
    },
    {
        id: 'cly468z6j002c7ryzfa2idsz5',
        title: 'Discrimination',
        parents: {
            connect: [
                {
                    id: 'clkv6uihv003sl2rs3y8ccll7'
                }
            ]
        }
    },
    {
        id: 'cly468z70002f7ryzzggjsvqh',
        title: 'Emergency Services',
        parents: {
            connect: [
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly468z7g002i7ryzznuni9e5',
        title: 'Economic globalisation',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'cly468z7l002j7ryzftruo94y',
        title: 'Electrical appliances',
        parents: {
            connect: [
                {
                    id: 'clkv6uixa009al2rs677oojle'
                }
            ]
        }
    },
    {
        id: 'cly468z7q002k7ryzx0n8ozf4',
        title: 'e-Commerce',
        parents: {
            connect: [
                {
                    id: 'clkv6uigk003el2rswm10fyv8'
                }
            ]
        }
    },
    {
        id: 'cly468z82002m7ryzhgsy9cic',
        title: 'Economic growth',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'cly468z87002n7ryzwldbhp9z',
        title: 'Economic indicators',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'cly468z8c002o7ryzhn57woce',
        title: 'Economic organisation',
        parents: {
            connect: [
                {
                    id: 'clkv6uig50038l2rs51tojhtj'
                }
            ]
        }
    },
    {
        id: 'cly468z8l002p7ryzw6h9d14c',
        title: 'Emerging markets',
        parents: {
            connect: [
                {
                    id: 'clkv6uig50038l2rs51tojhtj'
                }
            ]
        }
    },
    {
        id: 'cly468z8x002r7ryzlig4ssmt',
        title: 'Exports',
        parents: {
            connect: [
                {
                    id: 'clkv6uigk003el2rswm10fyv8'
                }
            ]
        }
    },
    {
        id: 'cly468z93002s7ryzac474vgn',
        title: 'Imports',
        parents: {
            connect: [
                {
                    id: 'clkv6uigk003el2rswm10fyv8'
                }
            ]
        }
    },
    {
        id: 'cly468z9q002w7ryz2pjwg5fd',
        title: 'Energy resources',
        parents: {
            connect: [
                {
                    id: 'clkv6uix60098l2rsr98k7iur'
                }
            ]
        }
    },
    {
        id: 'cly468za0002y7ryz1tuo1ers',
        title: 'Emergency care',
        parents: {
            connect: [
                {
                    id: 'clkv6uidh0028l2rsv6gu1z7u'
                },
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly468zad00307ryzeekrkmbl',
        title: 'Exercise and fitness',
        parents: {
            connect: [
                {
                    id: 'clkv6uirf007cl2rs5jaofpzr'
                }
            ]
        }
    },
    {
        id: 'cly468zaj00317ryz6edu1iar',
        title: 'Election',
        parents: {
            connect: [
                {
                    id: 'cly468z68002a7ryz50m4553u'
                }
            ]
        }
    },
    {
        id: 'cly468zao00327ryzea10zjej',
        title: 'Electoral system',
        parents: {
            connect: [
                {
                    id: 'cly468z68002a7ryz50m4553u'
                }
            ]
        }
    },
    {
        id: 'cly468zaz00347ryzqdhfzw7o',
        title: 'Executive (government)',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zba00367ryzo19txzma',
        title: 'Elderly care',
        parents: {
            connect: [
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly468zbf00377ryzwb27w8q3',
        title: 'Fashion',
        parents: {
            connect: [
                {
                    id: 'clkv6uifc002yl2rsgbu5pr89'
                }
            ]
        }
    },
    {
        id: 'cly468zbk00387ryzqqksxnwt',
        title: 'Customs in public and social life',
        parents: {
            connect: [
                {
                    id: 'clkv6uifc002yl2rsgbu5pr89'
                }
            ]
        }
    },
    {
        id: 'cly468zcs003h7ryz5w8qsw3l',
        title: 'Forests',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqz0076l2rse4zmuyv9'
                }
            ]
        }
    },
    {
        id: 'cly468zcx003i7ryzk3gz38tq',
        title: 'Flowers and plants',
        parents: {
            connect: [
                {
                    id: 'clkv6uiqz0076l2rse4zmuyv9'
                }
            ]
        }
    },
    {
        id: 'cly468zdh003m7ryzyvhlu07z',
        title: 'Family planning',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'cly468zdm003n7ryz99gozxaz',
        title: 'Guerrilla activity',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468zek003t7ryz0v1e2rjb',
        title: 'Government health care',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                },
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zex003v7ryziabfrx07',
        title: 'Gaming and lottery',
        parents: {
            connect: [
                {
                    id: 'clkv6uifi0030l2rs04184e2h'
                }
            ]
        }
    },
    {
        id: 'cly468zf2003w7ryz7yuynsa3',
        title: 'Government budget',
        parents: {
            connect: [
                {
                    id: 'clkv6uih0003il2rse0gf3xps'
                }
            ]
        }
    },
    {
        id: 'cly468zf7003x7ryzqceye4ra',
        title: 'Government department',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zfd003y7ryzoeleyai4',
        title: 'Government policy',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zfp003z7ryzln4xipiv',
        title: 'Gender',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'cly468zhr004c7ryzr4zoffy6',
        title: 'Civil engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6uivv008ul2rs2ykdg8np'
                }
            ]
        }
    },
    {
        id: 'cly468zi8004f7ryzhyrtdjhj',
        title: 'Influencers',
        parents: {
            connect: [
                {
                    id: 'clkv6uifc002yl2rsgbu5pr89'
                }
            ]
        }
    },
    {
        id: 'cly468zig004g7ryz99dscluy',
        title: 'International military intervention',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468zis004i7ryz9iwyu2po',
        title: 'International court and tribunal',
        parents: {
            connect: [
                {
                    id: 'cly468zim004h7ryzps1o1krb'
                }
            ]
        }
    },
    {
        id: 'cly468zix004j7ryzwskqyclz',
        title: 'Investigation (criminal)',
        parents: {
            connect: [
                {
                    id: 'clkv6uihz003ul2rs01rx3lij'
                }
            ]
        }
    },
    {
        id: 'cly468zjz004q7ryzcxrb7ate',
        title: 'International economic institution',
        parents: {
            connect: [
                {
                    id: 'clkv6uig50038l2rs51tojhtj'
                }
            ]
        }
    },
    {
        id: 'cly468zkx004w7ryzxpjcx0du',
        title: 'Identification technology',
        parents: {
            connect: [
                {
                    id: 'cly468yyb00177ryzsvccai51'
                }
            ]
        }
    },
    {
        id: 'cly468zl2004x7ryzpxvnsszm',
        title: 'Immigration',
        parents: {
            connect: [
                {
                    id: 'clkv6uihv003sl2rs3y8ccll7'
                }
            ]
        }
    },
    {
        id: 'cly468zl7004y7ryzra06lu2c',
        title: 'Indigenous people',
        parents: {
            connect: [
                {
                    id: 'clkv6uihv003sl2rs3y8ccll7'
                }
            ]
        }
    },
    {
        id: 'cly468zli00507ryzh96v7r8o',
        title: 'Justice',
        parents: {
            connect: [
                {
                    id: 'clkv6uii8003yl2rsc73ua7b5'
                }
            ]
        }
    },
    {
        id: 'cly468znf005d7ryzp1bid0u9',
        title: 'Leisue venue',
        parents: {
            connect: [
                {
                    id: 'clkv6uifi0030l2rs04184e2h'
                }
            ]
        }
    },
    {
        id: 'cly468zp6005f7ryz5ohtkyp6',
        title: 'Legislative body',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zpb005g7ryzqfvczo4c',
        title: 'Local government and authority',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zpg005h7ryz58kdp70p',
        title: 'Lobbying',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zpm005i7ryzxt0id187',
        title: 'Lgbtq',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'cly468zpr005j7ryzxj1rttnu',
        title: 'Long-term care',
        parents: {
            connect: [
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly468zpw005k7ryz8c6f6hut',
        title: 'Monument and heritage site',
        parents: {
            connect: [
                {
                    id: 'cly468zlt00527ryz1vpeghn5'
                }
            ]
        }
    },
    {
        id: 'cly468zqc005n7ryzj3wx2is2',
        title: 'Military occupation',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468zqh005o7ryz8y9e96qe',
        title: 'Casualties of war',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468zqs005q7ryzwbayxr2k',
        title: 'Medical devices and equipment',
        parents: {
            connect: [
                {
                    id: 'clkv6uirq007gl2rslef9w0la'
                }
            ]
        }
    },
    {
        id: 'cly468zqx005r7ryz9ijnz94c',
        title: 'Macroeconomics',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'cly468zr2005s7ryz91gz4jm1',
        title: 'Market and exchange',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                }
            ]
        }
    },
    {
        id: 'cly468zr9005t7ryzqyykgski',
        title: 'Mountains',
        parents: {
            connect: [
                {
                    id: 'clkv6uiag001al2rsf378bj60'
                }
            ]
        }
    },
    {
        id: 'cly468zrh005u7ryzod63vd8c',
        title: 'Medical test',
        parents: {
            connect: [
                {
                    id: 'clkv6uirq007gl2rslef9w0la'
                }
            ]
        }
    },
    {
        id: 'cly468zry005x7ryzzghho4sk',
        title: 'Military weaponry',
        parents: {
            connect: [
                {
                    id: 'cly468zrt005w7ryzxabklhk2'
                }
            ]
        }
    },
    {
        id: 'cly468zs9005z7ryz5pc0d036',
        title: 'Micro science',
        parents: {
            connect: [
                {
                    id: 'clkv6uipw006sl2rsc9bvqt4q'
                }
            ]
        }
    },
    {
        id: 'cly468zsg00607ryz11x72kag',
        title: 'Marriage',
        parents: {
            connect: [
                {
                    id: 'clkv6ulyc01eul2rs326z8voe'
                }
            ]
        }
    },
    {
        id: 'cly468zsm00617ryzprjnsd1t',
        title: 'News media',
        parents: {
            connect: [
                {
                    id: 'cly468zqm005p7ryz7f7aazbg'
                }
            ]
        }
    },
    {
        id: 'cly468zsr00627ryzrqdo308o',
        title: 'Man-made disasters',
        parents: {
            connect: [
                {
                    id: 'clkv6uifo0032l2rss499377e'
                }
            ]
        }
    },
    {
        id: 'cly468zti00677ryzj36yrl7q',
        title: 'Natural resources',
        parents: {
            connect: [
                {
                    id: 'clkv6uia50016l2rs51aatj04'
                }
            ]
        }
    },
    {
        id: 'cly468ztn00687ryzjcv3valm',
        title: 'National security',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zug006d7ryzewj8ybmh',
        title: 'National or ethnic minority',
        parents: {
            connect: [
                {
                    id: 'clkv6uihv003sl2rs3y8ccll7'
                }
            ]
        }
    },
    {
        id: 'cly468zvl006k7ryzow3b0idb',
        title: 'Outdoor recreational activities',
        parents: {
            connect: [
                {
                    id: 'clkv6uifi0030l2rs04184e2h'
                }
            ]
        }
    },
    {
        id: 'cly468zvr006l7ryzhisczozb',
        title: 'Peacekeeping force',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468zvw006m7ryzj56815rq',
        title: 'Peace process',
        parents: {
            connect: [
                {
                    id: 'cly468ytv000q7ryz4w8h6vtv'
                }
            ]
        }
    },
    {
        id: 'cly468zy1006x7ryzj4bmuwgc',
        title: 'Parks',
        parents: {
            connect: [
                {
                    id: 'clkv6uifi0030l2rs04184e2h'
                }
            ]
        }
    },
    {
        id: 'cly468zyo00717ryzfw3jswic',
        title: 'Pension',
        parents: {
            connect: [
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly46901h007j7ryzagt6bbof',
        title: 'Radio',
        parents: {
            connect: [
                {
                    id: 'cly468zqm005p7ryz7f7aazbg'
                }
            ]
        }
    },
    {
        id: 'cly46901m007k7ryz5qbyu5y3',
        title: 'Rebellion',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                },
                {
                    id: 'cly469003007a7ryzllbo9p9s'
                }
            ]
        }
    },
    {
        id: 'cly46901s007l7ryzuxi17yge',
        title: 'Revolution',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                },
                {
                    id: 'cly469003007a7ryzllbo9p9s'
                }
            ]
        }
    },
    {
        id: 'cly46902d007p7ryzo2kf877n',
        title: 'Rivers',
        parents: {
            connect: [
                {
                    id: 'clkv6uiag001al2rsf378bj60'
                }
            ]
        }
    },
    {
        id: 'cly46902i007q7ryzgjtct2ew',
        title: 'Royalty',
        parents: {
            connect: [
                {
                    id: 'clkv6uihv003sl2rs3y8ccll7'
                }
            ]
        }
    },
    {
        id: 'cly46902t007s7ryzzod9372k',
        title: 'Referenda',
        parents: {
            connect: [
                {
                    id: 'cly468z68002a7ryz50m4553u'
                }
            ]
        }
    },
    {
        id: 'cly469034007u7ryz1ve92hkj',
        title: 'Regional government and authority',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly469039007v7ryzmjjh8zwn',
        title: 'Regulatory authority',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly46903q007y7ryz6h0bqv73',
        title: 'Refugees and internally displaced people',
        parents: {
            connect: [
                {
                    id: 'clkv6uihv003sl2rs3y8ccll7'
                }
            ]
        }
    },
    {
        id: 'cly46903v007z7ryz3it8nah0',
        title: 'Relations between religion and government',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                },
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly46904100807ryzqd2at8nw',
        title: 'Religious conflict',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                },
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly46904d00827ryzsx1bo97c',
        title: 'Religious leader',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                }
            ]
        }
    },
    {
        id: 'cly46904i00837ryz4b74do0p',
        title: 'Racism',
        parents: {
            connect: [
                {
                    id: 'clkv6uihz003ul2rs01rx3lij'
                }
            ]
        }
    },
    {
        id: 'cly46904n00847ryzfzwklppf',
        title: 'Religious discrimination',
        parents: {
            connect: [
                {
                    id: 'clkv6uihz003ul2rs01rx3lij'
                }
            ]
        }
    },
    {
        id: 'cly469062008d7ryzif5hzuds',
        title: 'Software',
        parents: {
            connect: [
                {
                    id: 'cly468yyb00177ryzsvccai51'
                }
            ]
        }
    },
    {
        id: 'cly46907n008m7ryzxiqkn7rr',
        title: 'State school',
        parents: {
            connect: [
                {
                    id: 'cly46907g008l7ryzg3onr7u1'
                }
            ]
        }
    },
    {
        id: 'cly46907t008n7ryzsdedmo1e',
        title: 'Students',
        parents: {
            connect: [
                {
                    id: 'clkv6uihv003sl2rs3y8ccll7'
                }
            ]
        }
    },
    {
        id: 'cly46908i008q7ryzfvth7486',
        title: 'Safety of citizens',
        parents: {
            connect: [
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly46909g008t7ryzpbsfpfo1',
        title: 'Sexism',
        parents: {
            connect: [
                {
                    id: 'clkv6uihz003ul2rs01rx3lij'
                }
            ]
        }
    },
    {
        id: 'cly4690a4008u7ryz60pokijq',
        title: 'Senior citizens',
        parents: {
            connect: [
                {
                    id: 'clkv6uihv003sl2rs3y8ccll7'
                }
            ]
        }
    },
    {
        id: 'cly4690ac008v7ryzwqff8x5c',
        title: 'Social conditions and problems',
        parents: {
            connect: [
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly4690ao008w7ryz9s0kk8oy',
        title: 'Sexual misconduct',
        parents: {
            connect: [
                {
                    id: 'clkv6uihz003ul2rs01rx3lij'
                }
            ]
        }
    },
    {
        id: 'cly4690bi008z7ryzhf1fx8zi',
        title: 'Sexual behaviour',
        parents: {
            connect: [
                {
                    id: 'clkv6uif3002ul2rshsq00r6h'
                }
            ]
        }
    },
    {
        id: 'cly4690bt00917ryz65dt6osf',
        title: 'Social services',
        parents: {
            connect: [
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly4690ec009d7ryzj0ifu5mq',
        title: 'Teachers',
        parents: {
            connect: [
                {
                    id: 'clkv6uikc004sl2rs74ls77fb'
                }
            ]
        }
    },
    {
        id: 'cly4690em009e7ryzpux3nor9',
        title: 'Travel and tourism',
        parents: {
            connect: [
                {
                    id: 'clkv6uifi0030l2rs04184e2h'
                }
            ]
        }
    },
    {
        id: 'cly4690et009f7ryzmqqwnvxb',
        title: 'Treaty',
        parents: {
            connect: [
                {
                    id: 'cly468ytv000q7ryz4w8h6vtv'
                }
            ]
        }
    },
    {
        id: 'cly4690f1009g7ryz6aioq2hz',
        title: 'Teenagers',
        parents: {
            connect: [
                {
                    id: 'clkv6uihv003sl2rs3y8ccll7'
                }
            ]
        }
    },
    {
        id: 'cly4690in009w7ryzs1uvedvd',
        title: 'Welfare',
        parents: {
            connect: [
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly4690je00a17ryzm89uqdu8',
        title: 'Juvenile delinquency',
        parents: {
            connect: [
                {
                    id: 'clkv6uihz003ul2rs01rx3lij'
                }
            ]
        }
    },
    {
        id: 'cly4690mx00aj7ryz2c8v8o1k',
        title: 'Private school',
        parents: {
            connect: [
                {
                    id: 'cly46907g008l7ryzg3onr7u1'
                }
            ]
        }
    },
    {
        id: 'clkv6uium008gl2rs3d7ene92',
        title: 'Agriculture (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uiza00a4l2rs9xhxgjx5',
        title: 'Conservation and environment',
        parents: {
            connect: [
                {
                    id: 'clkv6uidc0026l2rs6fbvymtt'
                },
                {
                    id: 'clkv6uiyx009yl2rs5jwx6s2x'
                }
            ]
        }
    },
    {
        id: 'clkv6uj0100agl2rsnk9h4c5y',
        title: 'Medieval history',
        parents: {
            connect: [
                {
                    id: 'clkv6uizx00ael2rs3zmmkhs7'
                }
            ]
        }
    },
    {
        id: 'clkv6uj0600ail2rsz8xg5cyp',
        title: 'Modern history, 1453-',
        parents: {
            connect: [
                {
                    id: 'clkv6uizx00ael2rs3zmmkhs7'
                }
            ]
        }
    },
    {
        id: 'clkv6uj1900b0l2rs2upxzl24',
        title: 'Early and medieval to 1485',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj1d00b2l2rs1x099pzp',
        title: 'Celts. Romans. Saxons. Danes. Normans',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj1h00b4l2rs4wd3ikpm',
        title: 'Modern, 1485-',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj1m00b6l2rsvvmcdshf',
        title: 'Tudors, 1485-1603',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj1q00b8l2rsiyb3a4pd',
        title: 'Early Stuarts, 1603-1642',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj1v00bal2rsxuaxd22r',
        title: 'Civil War and Commonwealth, 1642-1660',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj2500bcl2rs4fl2t9ke',
        title: 'Later Stuarts',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj2a00bel2rsatzuz6w4',
        title: '1714-1760',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj2e00bgl2rsebk33pfh',
        title: 'George III, 1760-1820',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj2k00bil2rsdza974lz',
        title: 'Victorian era, 1837-1901',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj2p00bkl2rssgshioei',
        title: '20th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0w00aul2rssmczetk4'
                }
            ]
        }
    },
    {
        id: 'clkv6uj2u00bml2rs3oguyqmo',
        title: 'Early and medieval',
        parents: {
            connect: [
                {
                    id: 'clkv6uj1400ayl2rsey9t8jf2'
                }
            ]
        }
    },
    {
        id: 'clkv6uj2y00bol2rsgrdulrll',
        title: 'War of Independence, 1285-1371',
        parents: {
            connect: [
                {
                    id: 'clkv6uj1400ayl2rsey9t8jf2'
                }
            ]
        }
    },
    {
        id: 'clkv6uj3800bql2rsjpwiuf1n',
        title: 'Stuarts, 1371-1603',
        parents: {
            connect: [
                {
                    id: 'clkv6uj1400ayl2rsey9t8jf2'
                }
            ]
        }
    },
    {
        id: 'clkv6uj3f00bsl2rsut3tzv4o',
        title: 'The Union, 1707',
        parents: {
            connect: [
                {
                    id: 'clkv6uj1400ayl2rsey9t8jf2'
                }
            ]
        }
    },
    {
        id: 'clkv6uj3m00bul2rsfrxye3bo',
        title: '1707-1745. Jacobite movements',
        parents: {
            connect: [
                {
                    id: 'clkv6uj1400ayl2rsey9t8jf2'
                }
            ]
        }
    },
    {
        id: 'clkv6uj3t00bwl2rsvh6o22lb',
        title: 'Early and medieval',
        parents: {
            connect: [
                {
                    id: 'clkv6ui790000l2rs39iifv8f'
                }
            ]
        }
    },
    {
        id: 'clkv6uj3x00byl2rs8v0a7z3p',
        title: 'English conquest, 1154-1189',
        parents: {
            connect: [
                {
                    id: 'clkv6ui790000l2rs39iifv8f'
                }
            ]
        }
    },
    {
        id: 'clkv6uj4300c0l2rs7j9ep445',
        title: 'The Union, 1800',
        parents: {
            connect: [
                {
                    id: 'clkv6ui790000l2rs39iifv8f'
                }
            ]
        }
    },
    {
        id: 'clkv6uj4700c2l2rspv2e8j7s',
        title: '19th-20th centuries. Irish question',
        parents: {
            connect: [
                {
                    id: 'clkv6ui790000l2rs39iifv8f'
                }
            ]
        }
    },
    {
        id: 'clkv6uj4c00c4l2rsuree0zi4',
        title: '21st century',
        parents: {
            connect: [
                {
                    id: 'clkv6ui790000l2rs39iifv8f'
                }
            ]
        }
    },
    {
        id: 'clkv6uj4m00c8l2rscuzsjqk6',
        title: 'Early and medieval to 1521',
        parents: {
            connect: [
                {
                    id: 'clkv6uj4i00c6l2rs9bcgvcyl'
                }
            ]
        }
    },
    {
        id: 'clkv6uj4w00ccl2rsi88n9967',
        title: '1521-1648',
        parents: {
            connect: [
                {
                    id: 'clkv6uj4i00c6l2rs9bcgvcyl'
                }
            ]
        }
    },
    {
        id: 'clkv6uj5100cel2rsh8cxegd2',
        title: '1648-1740',
        parents: {
            connect: [
                {
                    id: 'clkv6uj4i00c6l2rs9bcgvcyl'
                }
            ]
        }
    },
    {
        id: 'clkv6uj5600cgl2rsbjub95xx',
        title: '1740-1815',
        parents: {
            connect: [
                {
                    id: 'clkv6uj4i00c6l2rs9bcgvcyl'
                }
            ]
        }
    },
    {
        id: 'clkv6uj5c00cil2rsv98yqq7v',
        title: '19th-20th centuries',
        parents: {
            connect: [
                {
                    id: 'clkv6uj4i00c6l2rs9bcgvcyl'
                }
            ]
        }
    },
    {
        id: 'clkv6uj6c00cwl2rsk4xqoeki',
        title: 'Early to 1792',
        parents: {
            connect: [
                {
                    id: 'clkv6uj6700cul2rsipsfh2mb'
                }
            ]
        }
    },
    {
        id: 'clkv6uj6p00d2l2rst50bm7sj',
        title: '1792-1918. 19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uj6700cul2rsipsfh2mb'
                }
            ]
        }
    },
    {
        id: 'clkv6uj7200d8l2rs1ije2s51',
        title: '20th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uj6700cul2rsipsfh2mb'
                }
            ]
        }
    },
    {
        id: 'clkv6uj7m00dgl2rsgsudq7fv',
        title: 'Early and medieval to 1526',
        parents: {
            connect: [
                {
                    id: 'clkv6uj7h00del2rsfvela4gj'
                }
            ]
        }
    },
    {
        id: 'clkv6uj7r00dil2rsk0x0xjn3',
        title: 'Hapsburg rule, 1526-1918',
        parents: {
            connect: [
                {
                    id: 'clkv6uj7h00del2rsfvela4gj'
                }
            ]
        }
    },
    {
        id: 'clkv6uj7v00dkl2rsffyocm7a',
        title: 'Czechoslovak Republic, 1918-1992',
        parents: {
            connect: [
                {
                    id: 'clkv6uj7h00del2rsfvela4gj'
                }
            ]
        }
    },
    {
        id: 'clkv6uj7z00dml2rsx4bblgxv',
        title: '1993- . Independent Czech Republic',
        parents: {
            connect: [
                {
                    id: 'clkv6uj7h00del2rsfvela4gj'
                }
            ]
        }
    },
    {
        id: 'clkv6uj8400dol2rsm4nu6luy',
        title: 'Slovakia',
        parents: {
            connect: [
                {
                    id: 'clkv6uj7h00del2rsfvela4gj'
                }
            ]
        }
    },
    {
        id: 'clkv6uj8i00dul2rs8ejgo6zg',
        title: 'Early and medieval to 1515',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8900dql2rs8tyj89hk'
                }
            ]
        }
    },
    {
        id: 'clkv6uj8m00dwl2rsd3ratnq0',
        title: 'Modern, 1515-',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8900dql2rs8tyj89hk'
                }
            ]
        }
    },
    {
        id: 'clkv6ujc300fgl2rs9js2xmm0',
        title: 'Medieval Empire, 481-1273',
        parents: {
            connect: [
                {
                    id: 'clkv6ujbu00fcl2rsak6nwg4b'
                }
            ]
        }
    },
    {
        id: 'clkv6ujcl00fol2rs45mf09mi',
        title: '1273-1519. Houses of Habsburg and Luxemburg',
        parents: {
            connect: [
                {
                    id: 'clkv6ujbu00fcl2rsak6nwg4b'
                }
            ]
        }
    },
    {
        id: 'clkv6ujcu00fsl2rs2zidzpnk',
        title: '1519-1648. Reformation and Counter reformation',
        parents: {
            connect: [
                {
                    id: 'clkv6ujcq00fql2rssea4fc0u'
                }
            ]
        }
    },
    {
        id: 'clkv6ujcy00ful2rspr7zllbe',
        title: '1648-1815. 18th century. French Revolutionary and Napoleonic period',
        parents: {
            connect: [
                {
                    id: 'clkv6ujcq00fql2rssea4fc0u'
                }
            ]
        }
    },
    {
        id: 'clkv6ujd300fwl2rss7l20k2v',
        title: '19th-20th centuries',
        parents: {
            connect: [
                {
                    id: 'clkv6ujcq00fql2rssea4fc0u'
                }
            ]
        }
    },
    {
        id: 'clkv6ujd700fyl2rsvtfj3p9w',
        title: '21st century',
        parents: {
            connect: [
                {
                    id: 'clkv6ujcq00fql2rssea4fc0u'
                }
            ]
        }
    },
    {
        id: 'clkv6ujer00gml2rs8m1qgvjl',
        title: 'Bronze Age, Minoan, and Mycenaean ages',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujew00gol2rs1rrt0l2m',
        title: 'ca. 1125-500 B.C. Age of Tyrants',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujf000gql2rs4p0sphv1',
        title: 'Persian wars, 499-479 B.C.',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujf500gsl2rs00twjs02',
        title: 'Athenian supremacy. Age of Pericles. 479-431 B.C.',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujf900gul2rs4zz0d0hd',
        title: 'Peloponnesian War, 431-404 B.C.',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujfd00gwl2rsddcup7br',
        title: 'Spartan and Theban supremacies, 404-362 B.C.',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujfh00gyl2rstsfxin01',
        title: 'Macedonian epoch. Age of Philip. 359-336 B.C.',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujfl00h0l2rsu8ehjs8w',
        title: 'Alexander the Great, 336-323 B.C.',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujfq00h2l2rsmd2q53ek',
        title: 'Hellenistic period, 323-146.B.C.',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujfu00h4l2rsw6k1k0ew',
        title: 'Roman epoch, 140 B.C. 323/476 A.D.',
        parents: {
            connect: [
                {
                    id: 'clkv6ujen00gkl2rskl46e92o'
                }
            ]
        }
    },
    {
        id: 'clkv6ujg300h8l2rs8887qhuq',
        title: 'Eastern Empire, 323/476-1057. Constantine the Great',
        parents: {
            connect: [
                {
                    id: 'clkv6ujfy00h6l2rskr4l0kgy'
                }
            ]
        }
    },
    {
        id: 'clkv6ujg900hal2rsd4trj2ev',
        title: '1057-1453',
        parents: {
            connect: [
                {
                    id: 'clkv6ujfy00h6l2rskr4l0kgy'
                }
            ]
        }
    },
    {
        id: 'clkv6uj8d00dsl2rs6nnkbcmh',
        title: 'French Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8900dql2rs8tyj89hk'
                }
            ]
        }
    },
    {
        id: 'clkv6ujhh00hql2rswck99xis',
        title: 'War of Independence, 1821-1829',
        parents: {
            connect: [
                {
                    id: 'clkv6ujh100hkl2rstccyjkih'
                }
            ]
        }
    },
    {
        id: 'clkv6ujhm00hsl2rs86pl1u10',
        title: 'Kapodistrias, 1827-1831',
        parents: {
            connect: [
                {
                    id: 'clkv6ujh100hkl2rstccyjkih'
                }
            ]
        }
    },
    {
        id: 'clkv6ujhr00hul2rs9pxcve6p',
        title: 'Republic, 1924-1935',
        parents: {
            connect: [
                {
                    id: 'clkv6ujh600hml2rsd7hli3ip'
                }
            ]
        }
    },
    {
        id: 'clkv6uji100hyl2rs37lx5c5i',
        title: 'Ancient Italy. Rome to 476',
        parents: {
            connect: [
                {
                    id: 'clkv6ui83000al2rslhajo8rz'
                },
                {
                    id: 'clkv6ujhw00hwl2rsiccbxmii'
                }
            ]
        }
    },
    {
        id: 'clkv6ujk700iul2rsqhtkpadj',
        title: 'Medieval and modern Italy, 476-',
        parents: {
            connect: [
                {
                    id: 'clkv6ujhw00hwl2rsiccbxmii'
                }
            ]
        }
    },
    {
        id: 'clkv6ujns00k4l2rsxg31vxzo',
        title: 'Early and medieval to 1555',
        parents: {
            connect: [
                {
                    id: 'clkv6ujnk00k0l2rs17gc94d5'
                }
            ]
        }
    },
    {
        id: 'clkv6ujnx00k6l2rsafnov8qu',
        title: '1555-1794. Spanish and Austrian rule',
        parents: {
            connect: [
                {
                    id: 'clkv6ujnk00k0l2rs17gc94d5'
                }
            ]
        }
    },
    {
        id: 'clkv6ujo200k8l2rs8klkq5fi',
        title: '1794-1909',
        parents: {
            connect: [
                {
                    id: 'clkv6ujnk00k0l2rs17gc94d5'
                }
            ]
        }
    },
    {
        id: 'clkv6ujoc00kal2rsgvtafd8j',
        title: '20th & 21st century',
        parents: {
            connect: [
                {
                    id: 'clkv6ujnk00k0l2rs17gc94d5'
                }
            ]
        }
    },
    {
        id: 'clkv6ujpa00kol2rss87p5l26',
        title: 'Early and medieval to 1555',
        parents: {
            connect: [
                {
                    id: 'clkv6ujp000kkl2rs0jm9pxvx'
                }
            ]
        }
    },
    {
        id: 'clkv6ujpl00ksl2rsvp8geyxg',
        title: '1555-1795. United provinces',
        parents: {
            connect: [
                {
                    id: 'clkv6ujp000kkl2rs0jm9pxvx'
                }
            ]
        }
    },
    {
        id: 'clkv6ujpq00kul2rsbl319r3a',
        title: '1795-1806. Batavian Republic',
        parents: {
            connect: [
                {
                    id: 'clkv6ujp000kkl2rs0jm9pxvx'
                }
            ]
        }
    },
    {
        id: 'clkv6ujpv00kwl2rs4z5jrvaq',
        title: '19th-21st centuries',
        parents: {
            connect: [
                {
                    id: 'clkv6ujp000kkl2rs0jm9pxvx'
                }
            ]
        }
    },
    {
        id: 'clkv6ujsh00lsl2rs35z2pxzx',
        title: 'Rus’',
        parents: {
            connect: [
                {
                    id: 'clkv6ujrf00lil2rsu471hhuy'
                }
            ]
        }
    },
    {
        id: 'clkv6ujno00k2l2rsftwwzkc1',
        title: 'Belgian Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ujnk00k0l2rs17gc94d5'
                }
            ]
        }
    },
    {
        id: 'clkv6ujsl00lul2rs5ch79bng',
        title: 'Muscovy',
        parents: {
            connect: [
                {
                    id: 'clkv6ujrf00lil2rsu471hhuy'
                }
            ]
        }
    },
    {
        id: 'clkv6ujw300mql2rs6zdkwua7',
        title: 'Iran (Persia)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukls00vwl2rsokrouo9d'
                }
            ]
        }
    },
    {
        id: 'clkv6ujwr00n0l2rs2jncnlt0',
        title: 'To 1795',
        parents: {
            connect: [
                {
                    id: 'clkv6ujwn00myl2rsa4ekt68l'
                }
            ]
        }
    },
    {
        id: 'clkv6ujww00n2l2rs8kv17i54',
        title: '1795-1918. 19th century (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6ujwn00myl2rsa4ekt68l'
                }
            ]
        }
    },
    {
        id: 'clkv6ujx200n4l2rsjndhfcqr',
        title: '1918-1945',
        parents: {
            connect: [
                {
                    id: 'clkv6ujwn00myl2rsa4ekt68l'
                }
            ]
        }
    },
    {
        id: 'clkv6ujx700n6l2rs8r0sbmdk',
        title: '1945-1989. People’s Republic',
        parents: {
            connect: [
                {
                    id: 'clkv6ujwn00myl2rsa4ekt68l'
                }
            ]
        }
    },
    {
        id: 'clkv6ujxc00n8l2rs222swbl9',
        title: '1989-',
        parents: {
            connect: [
                {
                    id: 'clkv6ujwn00myl2rsa4ekt68l'
                }
            ]
        }
    },
    {
        id: 'clkv6ujyh00nkl2rspgado2zb',
        title: 'Early and medieval to 1523',
        parents: {
            connect: [
                {
                    id: 'clkv6ujy700ngl2rs8s1oxg3b'
                }
            ]
        }
    },
    {
        id: 'clkv6ujym00nml2rsel2vi8rc',
        title: 'Modern, 1523-',
        parents: {
            connect: [
                {
                    id: 'clkv6ujy700ngl2rs8s1oxg3b'
                }
            ]
        }
    },
    {
        id: 'clkv6uk0s00ogl2rstl5k9t2a',
        title: 'Early and medieval to 1387',
        parents: {
            connect: [
                {
                    id: 'clkv6uk0i00ocl2rsb7el7k2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uk0x00oil2rsdgd7votv',
        title: '1387-1814. Union of Kalmar, 1397',
        parents: {
            connect: [
                {
                    id: 'clkv6uk0i00ocl2rsb7el7k2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uk1300okl2rsu6exiez7',
        title: '1814-1905. 19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uk0i00ocl2rsb7el7k2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uk1800oml2rstthiwvus',
        title: '20th century. Period of World War II, 1939-1945',
        parents: {
            connect: [
                {
                    id: 'clkv6uk0i00ocl2rsb7el7k2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uk2800oyl2rs88uh9s1i',
        title: 'Early and medieval to 1523. Union of Kalmar, 1397',
        parents: {
            connect: [
                {
                    id: 'clkv6uk1v00oul2rsh99c0a96'
                }
            ]
        }
    },
    {
        id: 'clkv6uk2g00p0l2rskq9nx1km',
        title: 'Modern, 1523-',
        parents: {
            connect: [
                {
                    id: 'clkv6uk1v00oul2rsh99c0a96'
                }
            ]
        }
    },
    {
        id: 'clkv6uk4100pol2rsgwgsrke4',
        title: 'Early to 1523',
        parents: {
            connect: [
                {
                    id: 'clkv6uk3s00pkl2rs71n81r34'
                }
            ]
        }
    },
    {
        id: 'clkv6uk4500pql2rsf5vd60v5',
        title: 'Modern, 1523-',
        parents: {
            connect: [
                {
                    id: 'clkv6uk3s00pkl2rs71n81r34'
                }
            ]
        }
    },
    {
        id: 'clkv6uk4a00psl2rs509q10ms',
        title: '1945-1981',
        parents: {
            connect: [
                {
                    id: 'clkv6uk3s00pkl2rs71n81r34'
                }
            ]
        }
    },
    {
        id: 'clkv6uk4f00pul2rsljyzs2qk',
        title: '1981-',
        parents: {
            connect: [
                {
                    id: 'clkv6uk3s00pkl2rs71n81r34'
                }
            ]
        }
    },
    {
        id: 'clkv6uk5j00q6l2rss8e5tweb',
        title: 'Earliest to 711',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5100q2l2rspda163o0'
                }
            ]
        }
    },
    {
        id: 'clkv6uk3w00pml2rs00pozgis',
        title: 'Finnish Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6uk3s00pkl2rs71n81r34'
                }
            ]
        }
    },
    {
        id: 'clkv6uk2200owl2rsq3kchkto',
        title: 'Swedish Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6uk1v00oul2rsh99c0a96'
                }
            ]
        }
    },
    {
        id: 'clkv6uk0n00oel2rsl8iyb8vm',
        title: 'Norwegian Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6uk0i00ocl2rsb7el7k2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uk5p00q8l2rspt9b0w6e',
        title: '711-1516. Moorish domination and the Reconquest',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5100q2l2rspda163o0'
                }
            ]
        }
    },
    {
        id: 'clkv6uk5u00qal2rsdobhjpjw',
        title: 'Modern Spain, 1479/1516-',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5100q2l2rspda163o0'
                }
            ]
        }
    },
    {
        id: 'clkv6uk8u00ral2rsbvnrbmif',
        title: 'Early and medieval to 1580',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8k00r6l2rsghw2dico'
                }
            ]
        }
    },
    {
        id: 'clkv6uk8z00rcl2rskq2c59bj',
        title: '1580-',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8k00r6l2rsghw2dico'
                }
            ]
        }
    },
    {
        id: 'clkv6ukc700sal2rsp1l6gpxf',
        title: 'Early to 687. Celts and Romans. Teutonic tribes',
        parents: {
            connect: [
                {
                    id: 'clkv6ukbn00s2l2rs4uye3eqe'
                }
            ]
        }
    },
    {
        id: 'clkv6ukcc00scl2rsk4semott',
        title: '687-1291. Carolingian and German rule',
        parents: {
            connect: [
                {
                    id: 'clkv6ukbn00s2l2rs4uye3eqe'
                }
            ]
        }
    },
    {
        id: 'clkv6ukcg00sel2rsjesbzrw3',
        title: '1291-1516. Federation and independence',
        parents: {
            connect: [
                {
                    id: 'clkv6ukbn00s2l2rs4uye3eqe'
                }
            ]
        }
    },
    {
        id: 'clkv6ukcl00sgl2rszzvxobx1',
        title: '1789/1798-1815. Helvetic Republic, 1798-1803',
        parents: {
            connect: [
                {
                    id: 'clkv6ukbw00s6l2rsoqfx52lo'
                }
            ]
        }
    },
    {
        id: 'clkv6ukcp00sil2rsnsjyemo2',
        title: '1815-1848. Sonderbund, 1845-1847',
        parents: {
            connect: [
                {
                    id: 'clkv6ukbw00s6l2rsoqfx52lo'
                }
            ]
        }
    },
    {
        id: 'clkv6ukcu00skl2rs29ohbd5n',
        title: '1848-1900',
        parents: {
            connect: [
                {
                    id: 'clkv6ukbw00s6l2rsoqfx52lo'
                }
            ]
        }
    },
    {
        id: 'clkv6ukdz00swl2rs7wcay8os',
        title: 'Early and medieval',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdi00sql2rsvl2qctm3'
                }
            ]
        }
    },
    {
        id: 'clkv6uke600syl2rsykwuehv7',
        title: 'Turkish rule, 1396-1878',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdi00sql2rsvl2qctm3'
                }
            ]
        }
    },
    {
        id: 'clkv6ukeb00t0l2rsatchcd0v',
        title: '1878-1944',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdi00sql2rsvl2qctm3'
                }
            ]
        }
    },
    {
        id: 'clkv6ukek00t2l2rsh41rw70l',
        title: '1944-1990',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdi00sql2rsvl2qctm3'
                }
            ]
        }
    },
    {
        id: 'clkv6ukeq00t4l2rs35o377mn',
        title: '1990-',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdi00sql2rsvl2qctm3'
                }
            ]
        }
    },
    {
        id: 'clkv6ukfr00tgl2rs6wl9m2sx',
        title: 'Early and medieval to 1601. Roman period',
        parents: {
            connect: [
                {
                    id: 'clkv6ukff00tcl2rs9kal1gdi'
                }
            ]
        }
    },
    {
        id: 'clkv6ukfx00til2rs8vekvuci',
        title: 'Phanariote regime, 1601-1822',
        parents: {
            connect: [
                {
                    id: 'clkv6ukff00tcl2rs9kal1gdi'
                }
            ]
        }
    },
    {
        id: 'clkv6ukgb00tkl2rspk8uh3o1',
        title: '1822-1881. 19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6ukff00tcl2rs9kal1gdi'
                }
            ]
        }
    },
    {
        id: 'clkv6ukgk00tml2rs1qzoe85a',
        title: '1866/1881-1944',
        parents: {
            connect: [
                {
                    id: 'clkv6ukff00tcl2rs9kal1gdi'
                }
            ]
        }
    },
    {
        id: 'clkv6ukgx00tol2rswckwq2ue',
        title: '1944-1989',
        parents: {
            connect: [
                {
                    id: 'clkv6ukff00tcl2rs9kal1gdi'
                }
            ]
        }
    },
    {
        id: 'clkv6ukh100tql2rs1opxq35a',
        title: '1989-',
        parents: {
            connect: [
                {
                    id: 'clkv6ukff00tcl2rs9kal1gdi'
                }
            ]
        }
    },
    {
        id: 'clkv6ukhe00twl2rsrf5a13ed',
        title: 'Earliest to 1281/1453',
        parents: {
            connect: [
                {
                    id: 'clkv6ukh600tsl2rs2v6tmj3p'
                }
            ]
        }
    },
    {
        id: 'clkv6ukhj00tyl2rsu3zbjn29',
        title: '1281/1453-1789. Fall of Constantinople, 1453',
        parents: {
            connect: [
                {
                    id: 'clkv6ukh600tsl2rs2v6tmj3p'
                }
            ]
        }
    },
    {
        id: 'clkv6ukhn00u0l2rsj6bhhval',
        title: '1566-1640. Period of decline',
        parents: {
            connect: [
                {
                    id: 'clkv6ukh600tsl2rs2v6tmj3p'
                }
            ]
        }
    },
    {
        id: 'clkv6ukhs00u2l2rse7vjo0i6',
        title: '1640-1789',
        parents: {
            connect: [
                {
                    id: 'clkv6ukh600tsl2rs2v6tmj3p'
                }
            ]
        }
    },
    {
        id: 'clkv6ukhw00u4l2rsjpu24w5x',
        title: '1789-1861. 19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6ukh600tsl2rs2v6tmj3p'
                }
            ]
        }
    },
    {
        id: 'clkv6uki000u6l2rsdij7bqpc',
        title: '1861-1909. War with Russia, 1877-1878',
        parents: {
            connect: [
                {
                    id: 'clkv6ukh600tsl2rs2v6tmj3p'
                }
            ]
        }
    },
    {
        id: 'clkv6uki500u8l2rspy3ac84p',
        title: '20th century. Constitutional movement',
        parents: {
            connect: [
                {
                    id: 'clkv6ukh600tsl2rs2v6tmj3p'
                }
            ]
        }
    },
    {
        id: 'clkv6ukiq00uil2rsol0s8gv1',
        title: 'To 1501',
        parents: {
            connect: [
                {
                    id: 'clkv6ukii00uel2rs0ckvxa8h'
                }
            ]
        }
    },
    {
        id: 'clkv6ukiu00ukl2rs4o1zsnnm',
        title: '1501-1912. Turkish rule',
        parents: {
            connect: [
                {
                    id: 'clkv6ukii00uel2rs0ckvxa8h'
                }
            ]
        }
    },
    {
        id: 'clkv6ukha00tul2rsohwmpw9t',
        title: 'Turkish Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ukh600tsl2rs2v6tmj3p'
                }
            ]
        }
    },
    {
        id: 'clkv6ukfl00tel2rsab06da1g',
        title: 'Romanian Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ukff00tcl2rs9kal1gdi'
                }
            ]
        }
    },
    {
        id: 'clkv6uk8p00r8l2rssl7z3u44',
        title: 'Portuguese Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8k00r6l2rsghw2dico'
                }
            ]
        }
    },
    {
        id: 'clkv6ukiz00uml2rs8qlf0t2u',
        title: '20th century',
        parents: {
            connect: [
                {
                    id: 'clkv6ukii00uel2rs0ckvxa8h'
                }
            ]
        }
    },
    {
        id: 'clkv6ukji00uul2rs2cshv83w',
        title: 'Early and medieval to 1500',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj300uol2rs47v1ia9q'
                }
            ]
        }
    },
    {
        id: 'clkv6ukjn00uwl2rs8rad5dy5',
        title: '1500-1800',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj300uol2rs47v1ia9q'
                }
            ]
        }
    },
    {
        id: 'clkv6ukjr00uyl2rs6p2wllmo',
        title: '1800-1918',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj300uol2rs47v1ia9q'
                }
            ]
        }
    },
    {
        id: 'clkv6ukjw00v0l2rsvki6bt4u',
        title: '1918-',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj300uol2rs47v1ia9q'
                }
            ]
        }
    },
    {
        id: 'clkv6ukkx00vil2rsm0pn7yki',
        title: 'Middle East. Southwestern Asia. Ancient Orient. Arab East. Near East',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdm00ssl2rseu91pb4m'
                }
            ]
        }
    },
    {
        id: 'clkv6ukl200vkl2rs7za822p2',
        title: 'Iraq (Assyria, Babylonia, Mesopotamia)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdm00ssl2rseu91pb4m'
                }
            ]
        }
    },
    {
        id: 'clkv6ukl600vml2rs30rsgb9y',
        title: 'Lebanon (Phenicia)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdm00ssl2rseu91pb4m'
                }
            ]
        }
    },
    {
        id: 'clkv6uklb00vol2rsgcnd56tf',
        title: 'Syria',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdm00ssl2rseu91pb4m'
                }
            ]
        }
    },
    {
        id: 'clkv6uklf00vql2rstxx9rt2s',
        title: 'Israel (Palestine). The Jews',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdm00ssl2rseu91pb4m'
                }
            ]
        }
    },
    {
        id: 'clkv6uklj00vsl2rs7fjhjlvj',
        title: 'Jordan. Transjordan',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdm00ssl2rseu91pb4m'
                }
            ]
        }
    },
    {
        id: 'clkv6uklx00vyl2rsb5n1wf61',
        title: 'Armenia',
        parents: {
            connect: [
                {
                    id: 'clkv6ukls00vwl2rsokrouo9d'
                }
            ]
        }
    },
    {
        id: 'clkv6ukm100w0l2rsgj2ma6dd',
        title: 'Arabian Peninsula. Saudi Arabia',
        parents: {
            connect: [
                {
                    id: 'clkv6ukls00vwl2rsokrouo9d'
                }
            ]
        }
    },
    {
        id: 'clkv6ukm500w2l2rsex9s80ce',
        title: 'Southern Asia. Indian Ocean Region',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj800uql2rs197t2m0w'
                }
            ]
        }
    },
    {
        id: 'clkv6ukme00w6l2rs3to1bced',
        title: 'Afghanistan',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj800uql2rs197t2m0w'
                }
            ]
        }
    },
    {
        id: 'clkv6ukmi00w8l2rs93h17ly1',
        title: 'Pakistan',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj800uql2rs197t2m0w'
                }
            ]
        }
    },
    {
        id: 'clkv6ukmm00wal2rsq2d2vaz2',
        title: 'Bangladesh. East Pakistan',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj800uql2rs197t2m0w'
                }
            ]
        }
    },
    {
        id: 'clkv6ukmr00wcl2rs9vl3qmu9',
        title: 'India (Bharat)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj800uql2rs197t2m0w'
                }
            ]
        }
    },
    {
        id: 'clkv6ukmv00wel2rskytqefyw',
        title: 'Sri Lanka',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj800uql2rs197t2m0w'
                }
            ]
        }
    },
    {
        id: 'clkv6ukn000wgl2rswphva0uo',
        title: 'Bhutan',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj800uql2rs197t2m0w'
                }
            ]
        }
    },
    {
        id: 'clkv6ukn600wil2rsi4zvu962',
        title: 'Nepal',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj800uql2rs197t2m0w'
                }
            ]
        }
    },
    {
        id: 'clkv6uknb00wkl2rsmk4wd3hr',
        title: 'Goa. Portuguese in India',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj800uql2rs197t2m0w'
                }
            ]
        }
    },
    {
        id: 'clkv6ukns00wol2rs7ln2jo8i',
        title: 'Relation of individual countries to East Asia',
        parents: {
            connect: [
                {
                    id: 'clkv6uknf00wml2rsgs5cix90'
                }
            ]
        }
    },
    {
        id: 'clkv6uknx00wql2rsqks6xty9',
        title: 'Southeast Asia',
        parents: {
            connect: [
                {
                    id: 'clkv6uknf00wml2rsgs5cix90'
                }
            ]
        }
    },
    {
        id: 'clkv6uksp00yql2rs8x8hiizt',
        title: 'Carthaginian period',
        parents: {
            connect: [
                {
                    id: 'clkv6uksl00yol2rsopwegqea'
                }
            ]
        }
    },
    {
        id: 'clkv6ukst00ysl2rsox111plx',
        title: 'Northwest Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6uksl00yol2rsopwegqea'
                }
            ]
        }
    },
    {
        id: 'clkv6uku500zal2rs3i3tgcjp',
        title: 'Northeast Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6uku000z8l2rssggnt2ee'
                }
            ]
        }
    },
    {
        id: 'clkv6ukv000zkl2rsf67lw7g3',
        title: 'West Indies',
        parents: {
            connect: [
                {
                    id: 'clkv6ul77014el2rsf56bqzs2'
                }
            ]
        }
    },
    {
        id: 'clkv6ukv500zml2rs0h20hufz',
        title: 'East Africa. British East Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6uku000z8l2rssggnt2ee'
                }
            ]
        }
    },
    {
        id: 'clkv6ukva00zol2rsj43xfqw6',
        title: 'Uganda',
        parents: {
            connect: [
                {
                    id: 'clkv6uku000z8l2rssggnt2ee'
                }
            ]
        }
    },
    {
        id: 'clkv6ukvf00zql2rsecmkjjft',
        title: 'Kenya',
        parents: {
            connect: [
                {
                    id: 'clkv6uku000z8l2rssggnt2ee'
                }
            ]
        }
    },
    {
        id: 'clkv6ukvj00zsl2rsczmpy9x0',
        title: 'Tanzania. Tanganyika. German East Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6uku000z8l2rssggnt2ee'
                }
            ]
        }
    },
    {
        id: 'clkv6ukvo00zul2rsyfs928es',
        title: 'Rwanda. Ruanda-Urundi',
        parents: {
            connect: [
                {
                    id: 'clkv6uku000z8l2rssggnt2ee'
                }
            ]
        }
    },
    {
        id: 'clkv6ukvw00zwl2rsikicd74m',
        title: 'Burundi',
        parents: {
            connect: [
                {
                    id: 'clkv6uku000z8l2rssggnt2ee'
                }
            ]
        }
    },
    {
        id: 'clkv6ukw000zyl2rs9gjgazis',
        title: 'Islands (East African coast)',
        parents: {
            connect: [
                {
                    id: 'clkv6uku000z8l2rssggnt2ee'
                }
            ]
        }
    },
    {
        id: 'clkv6ukx3010el2rsbljuqcny',
        title: 'Upper Guinea',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukx8010gl2rs2qmw3z84',
        title: 'Lower Guinea',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukxd010il2rsxn1yp5pi',
        title: 'British West Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukxi010kl2rsm2cuhmve',
        title: 'Ashanti Empire',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukxm010ml2rsiix40o2z',
        title: 'Gambia',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukxr010ol2rs484chuup',
        title: 'Ghana (Gold Coast)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukxv010ql2rscr1hf73h',
        title: 'Nigeria',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukxz010sl2rsixvao589',
        title: 'Sierra Leone',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6uky4010ul2rsijdaz4me',
        title: 'French West Africa. French Sahara. West Sahara. Sahel',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6uky9010wl2rstp135c1m',
        title: 'Benin. Dahomey',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukye010yl2rspuxun5l3',
        title: 'Guinea',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukyj0110l2rswgwaps3v',
        title: "Côte d'Ivoire. Ivory Coast",
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukyp0112l2rszmumglhz',
        title: 'Gabon (Gaboon, Gabun)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukyu0114l2rsm6qnnk1a',
        title: 'Congo (Brazzaville). Middle Congo',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukyz0116l2rsl67qvcxk',
        title: 'Central African Republic. Central African Empire. Ubangi Shari',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukz40118l2rs6enzxspd',
        title: 'Chad (Tchad)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukza011al2rsv8im0ssk',
        title: 'Niger',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukzf011cl2rsvmtbufd2',
        title: 'West Sahara',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukzk011el2rsdia0khnm',
        title: 'Senegal',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukzo011gl2rsz03o8jmy',
        title: 'Mali. Mali Federation. Sudanese Republic. French Sudan',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukzt011il2rsluifk6ny',
        title: 'Mauritania',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul02011kl2rsjwrp8dg0',
        title: 'Burkina Faso. Upper Volta',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul06011ml2rsdfqfm1ps',
        title: 'Cameroon (Cameroun, Kamerun)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul0a011ol2rsl6inuzv9',
        title: 'Togo. Togoland',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul0f011ql2rs1l7b7vhn',
        title: 'Guinea-Bissau. Portuguese Guinea',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul0k011sl2rszd534l8y',
        title: 'Sao Tome and Principe',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul0o011ul2rsjnuy2276',
        title: 'Equatorial Guinea (Spanish Guinea)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul0t011wl2rsk1x6jf80',
        title: 'Liberia',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul0x011yl2rskh4rr43h',
        title: 'Congo (Kongo) River region',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul110120l2rsam4mz6m9',
        title: 'Zaire. Congo (Democratic Republic). Belgian Congo',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul160122l2rs0fqtjkqg',
        title: 'Cape Verde',
        parents: {
            connect: [
                {
                    id: 'clkv6ukwy010cl2rsicukiobv'
                }
            ]
        }
    },
    {
        id: 'clkv6ul1f0126l2rshylke7ex',
        title: 'Angola',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul1l0128l2rsadmyho56',
        title: 'Namibia. South West Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul1r012al2rs5zeji9be',
        title: 'South Africa',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul2l012kl2rsjfl4hnij',
        title: 'Botswana. Bechuanaland',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul2p012ml2rsvotaz3cr',
        title: 'Lesotho. Basutoland',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul2u012ol2rsxbzixvqq',
        title: 'Swaziland',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul2y012ql2rsyvg0trpu',
        title: 'British Central Africa. Federation of Rhodesia and Nyasaland',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul33012sl2rsuhg9fmuf',
        title: 'Zimbabwe. Southern Rhodesia',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul38012ul2rsgmp4jozf',
        title: 'Zambia. Northern Rhodesia',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul3d012wl2rsl31nhifs',
        title: 'Malawi. Nyasaland',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul3j012yl2rsnvylwy0e',
        title: 'Mozambique',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1b0124l2rswgdyud90'
                }
            ]
        }
    },
    {
        id: 'clkv6ul3t0132l2rs2i4h7zmo',
        title: 'Australian aborigines',
        parents: {
            connect: [
                {
                    id: 'clkv6ul3o0130l2rshqcz41q4'
                }
            ]
        }
    },
    {
        id: 'clkv6ul490136l2rsj2joijnh',
        title: 'Maoris',
        parents: {
            connect: [
                {
                    id: 'clkv6ul440134l2rsdtvo6gpq'
                }
            ]
        }
    },
    {
        id: 'clkv6ul5a013ml2rseo2la8h5',
        title: 'Pre-Columbian America. The Indians',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul5f013ol2rs8yjyk508',
        title: 'Discovery of America and early explorations',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul5z013wl2rs7z4d0h3w',
        title: 'Diplomatic history. Foreign and general relations.',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul65013yl2rsqfm19fx9',
        title: 'Colonial history (1607-1775)',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul6a0140l2rso4udwobk',
        title: 'The Revolution, 1775-1783',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul6f0142l2rs64ay5c2q',
        title: 'Revolution to the Civil War, 1775/1783-1861',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul6k0144l2rspsgt32pd',
        title: 'Civil War period, 1861-1865',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul6p0146l2rs7apn9cok',
        title: 'Late nineteenth century, 1865-1900',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul6t0148l2rswfiihwet',
        title: 'Twentieth century',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul6y014al2rsxt1szffg',
        title: 'Twenty-first century',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul72014cl2rs8c2m1xvs',
        title: 'Canada',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ul7b014gl2rsrnxmy0q5',
        title: 'Mexico',
        parents: {
            connect: [
                {
                    id: 'clkv6ul77014el2rsf56bqzs2'
                }
            ]
        }
    },
    {
        id: 'clkv6ul7g014il2rs7d4ycrs5',
        title: 'Central America',
        parents: {
            connect: [
                {
                    id: 'clkv6ul77014el2rsf56bqzs2'
                }
            ]
        }
    },
    {
        id: 'clkv6ul9i015al2rshikdvksk',
        title: 'Colombia',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ul9n015cl2rsjmk6nk89',
        title: 'Venezuela',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ul9s015el2rs6l4787in',
        title: 'Guiana',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulaa015ml2rst0y8t2m4',
        title: 'Brazil',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulaj015ol2rs0vpeeocx',
        title: 'Paraguay',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulay015ql2rsqzhcxm58',
        title: 'Uruguay',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulbd015sl2rs5gysj5hu',
        title: 'Argentina',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulbi015ul2rs13ldy8l1',
        title: 'Falkland Islands',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulbn015wl2rscpaevkdx',
        title: 'Chile',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulbr015yl2rs4q13gt73',
        title: 'Bolivia',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulbw0160l2rswl5lrakc',
        title: 'Peru',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulc00162l2rsflqsz5pk',
        title: 'Ecuador',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9e0158l2rs1n9uvy2i'
                }
            ]
        }
    },
    {
        id: 'clkv6ulii018kl2rshdeb1p7r',
        title: 'Capital. Capital investments',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6ulim018ml2rsc40chtbp',
        title: 'Competition',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6ulir018ol2rsn2d0ardz',
        title: 'Technological innovations. Automation',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6uliw018ql2rswvm0oynn',
        title: 'Costs',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6ulj2018sl2rsjon67weh',
        title: 'Crisis management. Emergency management. Inflation',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6ulj7018ul2rs7atpjwvw',
        title: 'Delegation of authority. Decentralization. Span of control',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6uljb018wl2rs1lszlvoo',
        title: 'Industrial productivity',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6uljg018yl2rs94lxof04',
        title: 'Location of industry',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6uljl0190l2rsuhieibei',
        title: 'Organizational behavior, change and effectiveness. Corporate culture',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6uljr0192l2rs8yug8ouu',
        title: 'Public relations. Industrial publicity',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6uljx0194l2rstvryozzd',
        title: 'Social responsibility of business',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6ulk30196l2rsqrdz3jku',
        title: 'Risk in industry. Risk management',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6ulk70198l2rs6pt39c1h',
        title: 'Standardization. Simplification. Waste',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6ulkh019al2rsa2r37iin',
        title: 'Management of special enterprises',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6ulky019cl2rs2qkmck8u',
        title: 'Work groups. Team work in industry. Quality circles',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'clkv6ull3019el2rskyoav8ur',
        title: 'Land tenure',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ull9019gl2rs3oy558i7',
        title: 'Communal ownership',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ulle019il2rsc0y40dz8',
        title: 'Municipal ownership',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ulli019kl2rsvo3mjmvl',
        title: 'Nationalization (Agrarian socialism)',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ulln019ml2rshe0ph5an',
        title: 'Large holdings',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ullr019ol2rs0j94h3kb',
        title: 'Landlord and peasant',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ullw019ql2rstin180qk',
        title: 'Land reform. Agrarian reform',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ulm0019sl2rsqaqlkukv',
        title: 'Consolidation of land holdings',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ulm4019ul2rssi4taqcc',
        title: 'Small holdings. Peasant proprietors. Parcellation',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ulm9019wl2rsnf7e4t2z',
        title: 'Real estate business',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhw018al2rsnfmegwu6'
                }
            ]
        }
    },
    {
        id: 'clkv6ulmd019yl2rsgexyw39o',
        title: 'International cooperation',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6ulmh01a0l2rsy2z9k52r',
        title: 'Size of farms',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6ulmm01a2l2rsyr9fmnai',
        title: 'Sharecropping',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6ulmr01a4l2rs1c67euav',
        title: 'Agricultural associations, societies, etc.',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6ulmw01a6l2rseiavgkjb',
        title: 'Cooperative agriculture',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uln001a8l2rsryp8sd34',
        title: 'Collective farms',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uln501aal2rshuh0nvji',
        title: 'Government owned and operated farms. State farms. Sovkhozes',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uln901acl2rs2mto0jt3',
        title: 'Gleaning',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6ulne01ael2rsyta9qvy5',
        title: 'Reclamation of agricultural land. Melioration',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6ulnj01agl2rsi36lofbk',
        title: 'Irrigation',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6ulnn01ail2rs6da00l7j',
        title: 'Industrialization',
        parents: {
            connect: [
                {
                    id: 'clkv6uli5018el2rslllf3krl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulns01akl2rsjgr54l2z',
        title: 'Rural industries',
        parents: {
            connect: [
                {
                    id: 'clkv6uli5018el2rslllf3krl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulnw01aml2rsdtbomuh8',
        title: 'Home labor. Home based businesses',
        parents: {
            connect: [
                {
                    id: 'clkv6uli5018el2rslllf3krl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulo201aol2rs1vo8d6hn',
        title: 'Sweatshops',
        parents: {
            connect: [
                {
                    id: 'clkv6uli5018el2rslllf3krl'
                }
            ]
        }
    },
    {
        id: 'clkv6ulo701aql2rsiwso3r1g',
        title: 'Small and medium sized businesses, artisans, handicrafts, trades',
        parents: {
            connect: [
                {
                    id: 'clkv6uli5018el2rslllf3krl'
                }
            ]
        }
    },
    {
        id: 'clkv6uloc01asl2rsonw0aikx',
        title: 'Contracting. Letting of contracts',
        parents: {
            connect: [
                {
                    id: 'clkv6uli9018gl2rs6muu36le'
                }
            ]
        }
    },
    {
        id: 'clkv6ulog01aul2rs73sewbjw',
        title: 'Trade associations',
        parents: {
            connect: [
                {
                    id: 'clkv6uli9018gl2rs6muu36le'
                }
            ]
        }
    },
    {
        id: 'clkv6ulol01awl2rslwv6ml7b',
        title: 'Cooperation. Cooperative societies',
        parents: {
            connect: [
                {
                    id: 'clkv6uli9018gl2rs6muu36le'
                }
            ]
        }
    },
    {
        id: 'clkv6uloq01ayl2rssz8t56rz',
        title: 'Labor systems',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6uloy01b2l2rscmz49fjp',
        title: 'Labor disputes. Strikes and lockouts',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulp301b4l2rsj6adkejk',
        title: 'Industrial arbitration. Mediation and conciliation',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulp801b6l2rss04l1l4l',
        title: 'Employee participation in management. Employee ownership. Industrial democracy. Works councils',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulpc01b8l2rs7u6ws9jo',
        title: "Trade unions. Labor unions. Workers' associations",
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulph01bal2rsktque9rl',
        title: "Employers' associations",
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulpl01bcl2rs16nscan4',
        title: 'Industrial sociology. Social conditions of labor',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulpq01bel2rsak5ts3e9',
        title: 'Industrial relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulpu01bgl2rscxv34lkj',
        title: 'Cost and standard of living',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulpz01bil2rsg8ihl49w',
        title: 'Social insurance. Social security. Pension',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulq301bkl2rsway5x8e9',
        title: 'Vocational rehabilitation. Employment of people with disabilities',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulq801bml2rs7hxk2lpz',
        title: 'Industrial hygiene. Industrial welfare',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulqc01bol2rskuvzc3m6',
        title: 'Stars',
        parents: {
            connect: [
                {
                    id: 'clkv6um5s01hgl2rsvyae61z8'
                }
            ]
        }
    },
    {
        id: 'clkv6ulqh01bql2rs7he7fswc',
        title: 'Labor policy. Labor and the state',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulql01bsl2rskrzmnbtk',
        title: 'Labor in politics. Political activity of the working class',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulqp01bul2rsej2xl7go',
        title: 'Professions (General). Professional employees',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6ulxq01eql2rsfz53q1ay',
        title: 'Interpersonal relations. Social behavior',
        parents: {
            connect: [
                {
                    id: 'clkv6ulxl01eol2rsqa9zts6m'
                }
            ]
        }
    },
    {
        id: 'clkv6uly401esl2rsov2a0dzr',
        title: 'Social influence. Social pressure',
        parents: {
            connect: [
                {
                    id: 'clkv6ulxl01eol2rsqa9zts6m'
                }
            ]
        }
    },
    {
        id: 'clkv6um4b01h0l2rszbbp8x9r',
        title: 'Volcanoes and earthquakes',
        parents: {
            connect: [
                {
                    id: 'clkv6um3i01gql2rs96auj5u6'
                }
            ]
        }
    },
    {
        id: 'clkv6um4h01h2l2rs5q5r5yog',
        title: 'Structural geology',
        parents: {
            connect: [
                {
                    id: 'clkv6um3i01gql2rs96auj5u6'
                }
            ]
        }
    },
    {
        id: 'clkv6um6201hkl2rs548wzbro',
        title: 'Solar system',
        parents: {
            connect: [
                {
                    id: 'clkv6um5s01hgl2rsvyae61z8'
                }
            ]
        }
    },
    {
        id: 'clkv6um8501i8l2rs9zi1xchu',
        title: 'Thermodynamics',
        parents: {
            connect: [
                {
                    id: 'clkv6um6m01hsl2rsw99dwwz9'
                }
            ]
        }
    },
    {
        id: 'clkv6um8b01ial2rsoe1k5jv3',
        title: 'Spectroscopy',
        parents: {
            connect: [
                {
                    id: 'clkv6um6r01hul2rsfcyb4e0a'
                }
            ]
        }
    },
    {
        id: 'clkv6um8g01icl2rstlco8nae',
        title: 'Electricity',
        parents: {
            connect: [
                {
                    id: 'clkv6um7101hyl2rsxx5lndpj'
                }
            ]
        }
    },
    {
        id: 'clkv6um8l01iel2rsvguh15v7',
        title: 'Magnetism',
        parents: {
            connect: [
                {
                    id: 'clkv6um7101hyl2rsxx5lndpj'
                }
            ]
        }
    },
    {
        id: 'clkv6um8q01igl2rsr132xglj',
        title: 'Elementary particle physics',
        parents: {
            connect: [
                {
                    id: 'clkv6um7501i0l2rs3a42ftm2'
                }
            ]
        }
    },
    {
        id: 'clkv6um8v01iil2rsz02jn3sv',
        title: 'Radioactivity and radioactive substances',
        parents: {
            connect: [
                {
                    id: 'clkv6um7501i0l2rs3a42ftm2'
                }
            ]
        }
    },
    {
        id: 'clkv6um9001ikl2rsboo22b26',
        title: 'Meteorological optics',
        parents: {
            connect: [
                {
                    id: 'clkv6upmj02tcl2rsfmf2o1h8'
                }
            ]
        }
    },
    {
        id: 'clkv6um9501iml2rswip4awcm',
        title: 'Climatology and weather',
        parents: {
            connect: [
                {
                    id: 'clkv6upmj02tcl2rsfmf2o1h8'
                }
            ]
        }
    },
    {
        id: 'clkv6umnz01oal2rsssnv8qfa',
        title: 'Metabolic diseases',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umqg01p8l2rs4r1wzn56',
        title: 'Photoelectronic devices (General)',
        parents: {
            connect: [
                {
                    id: 'clkv6umq201p2l2rsa44opac8'
                }
            ]
        }
    },
    {
        id: 'clkv6umqc01p6l2rs30lyrpgn',
        title: 'Computer engineering',
        parents: {
            connect: [
                {
                    id: 'clkv6umq201p2l2rsa44opac8'
                }
            ]
        }
    },
    {
        id: 'clkv6umy701rul2rscu18o7ue',
        title: 'Immunologic diseases. Allergy',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umyc01rwl2rsnvh7hu4a',
        title: 'Nutritional diseases. Deficiency diseases',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umyg01ryl2rsmidggye5',
        title: 'Diseases of the blood and blood-forming organs',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umyp01s0l2rsar5yowv1',
        title: 'Diseases of the endocrine glands. Clinical endocrinology',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umyu01s2l2rs70m0wr8x',
        title: 'Diseases of the circulatory (Cardiovascular) system',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umz101s4l2rsk31zex3i',
        title: 'Diseases of the respiratory system',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umz501s6l2rswuuw68b1',
        title: 'Diseases of the digestive system. Gastroenterology',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umz901s8l2rseyrdrtwf',
        title: 'Diseases of the genitourinary system. Urology',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umze01sal2rs2dydct7q',
        title: 'Diseases of the connective tissues',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6umzj01scl2rslzy4apkr',
        title: 'Diseases of the musculoskeletal system',
        parents: {
            connect: [
                {
                    id: 'clkv6umxy01rql2rs8vtog0ve'
                }
            ]
        }
    },
    {
        id: 'clkv6un2k01tkl2rs4gdwxmfe',
        title: 'neurodegenerative disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6un2s01tol2rs5rdrr4di',
        title: 'bacterial cellulose',
        parents: {
            connect: [
                {
                    id: 'clkv6un2o01tml2rsjtcqpdlk'
                }
            ]
        }
    },
    {
        id: 'clkv6un4g01ucl2rstw4c06al',
        title: 'asphalt',
        parents: {
            connect: [
                {
                    id: 'clkv6un4c01ual2rsxz2she5y'
                }
            ]
        }
    },
    {
        id: 'clkv6un4p01uel2rszyko6xxp',
        title: 'bridge deck',
        parents: {
            connect: [
                {
                    id: 'clkv6umdv01kgl2rs2hny6nhk'
                }
            ]
        }
    },
    {
        id: 'clkv6un4u01ugl2rs4wlv8kzt',
        title: 'degradation',
        parents: {
            connect: [
                {
                    id: 'clkv6un4c01ual2rsxz2she5y'
                }
            ]
        }
    },
    {
        id: 'clkv6un8101vgl2rs7eo1qvvv',
        title: 'industrial application',
        parents: {
            connect: [
                {
                    id: 'clkv6umba01jel2rsb4toro2l'
                }
            ]
        }
    },
    {
        id: 'clkv6un8q01vql2rsulf4damp',
        title: 'reinforced concrete',
        parents: {
            connect: [
                {
                    id: 'clkv6un4c01ual2rsxz2she5y'
                }
            ]
        }
    },
    {
        id: 'clkv6un9301vwl2rs7k0dtiog',
        title: 'geotechnical',
        parents: {
            connect: [
                {
                    id: 'clkv6un8z01vul2rsch12o6v2'
                }
            ]
        }
    },
    {
        id: 'clkv6un9c01w0l2rsx94jva82',
        title: 'sludge',
        parents: {
            connect: [
                {
                    id: 'clkv6un9701vyl2rsqqfln73c'
                }
            ]
        }
    },
    {
        id: 'clkv6un9q01w4l2rs8adq71eb',
        title: 'bearings',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6una301wal2rsfmt7h6g0',
        title: 'carbon fiber',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unan01wil2rs94ep39e7',
        title: 'ceramic products',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unaw01wml2rswnhsolmk',
        title: 'composite',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unb001wol2rsfaik1x1b',
        title: 'composites suitable',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unb501wql2rsb7oxcnou',
        title: 'fabrication advanced',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unb901wsl2rsceclj2mz',
        title: 'fibre reinforced',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unbq01x0l2rsuc1i3gqe',
        title: 'structural material',
        parents: {
            connect: [
                {
                    id: 'clkv6unbm01wyl2rsfbrbm8eq'
                }
            ]
        }
    },
    {
        id: 'clkv6unby01x4l2rslyw56da8',
        title: 'synthetic materials',
        parents: {
            connect: [
                {
                    id: 'clkv6unbm01wyl2rsfbrbm8eq'
                }
            ]
        }
    },
    {
        id: 'clkv6uncc01x8l2rsa0tvx3hd',
        title: 'matrix composite',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6uncl01xcl2rsmksz3kpq',
        title: 'metal corrosion',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unel01y8l2rslox8udyp',
        title: 'multiferroic materials',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unez01yel2rsgiwgal4o',
        title: 'polymer based',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6ungc01z0l2rs2ue6tacb',
        title: 'porous materials',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unh701zcl2rski902ki2',
        title: 'resin',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unhb01zel2rsgx60xye0',
        title: 'various biomaterials',
        parents: {
            connect: [
                {
                    id: 'clkv6un9l01w2l2rs0faeq70p'
                }
            ]
        }
    },
    {
        id: 'clkv6unhk01zgl2rslgq0fyky',
        title: 'energy devices',
        parents: {
            connect: [
                {
                    id: 'clkv6umq201p2l2rsa44opac8'
                }
            ]
        }
    },
    {
        id: 'clkv6unrk0232l2rsgqsomxtp',
        title: 'graphene',
        parents: {
            connect: [
                {
                    id: 'clkv6umq201p2l2rsa44opac8'
                }
            ]
        }
    },
    {
        id: 'clkv6unsz023il2rs6dmlom18',
        title: 'inorganic materials',
        parents: {
            connect: [
                {
                    id: 'clkv6umq201p2l2rsa44opac8'
                }
            ]
        }
    },
    {
        id: 'clkv6unwp0254l2rsy0xyl2yt',
        title: 'nano semiconductors',
        parents: {
            connect: [
                {
                    id: 'clkv6umq201p2l2rsa44opac8'
                }
            ]
        }
    },
    {
        id: 'clkv6uo1j0276l2rs1zk3w1r2',
        title: 'photocatalytic',
        parents: {
            connect: [
                {
                    id: 'clkv6umq201p2l2rsa44opac8'
                }
            ]
        }
    },
    {
        id: 'clkv6uo55028kl2rshlqwqg0f',
        title: 'ultrasonic',
        parents: {
            connect: [
                {
                    id: 'clkv6umq201p2l2rsa44opac8'
                }
            ]
        }
    },
    {
        id: 'clkv6uo5s028ul2rsh6kyvuov',
        title: 'vulvar cancer',
        parents: {
            connect: [
                {
                    id: 'clkv6uodg02cal2rsmvkm11l8'
                }
            ]
        }
    },
    {
        id: 'clkv6uo660290l2rsphjr0e9s',
        title: 'antiretroviral therapy',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6uo6s029al2rsog5ry59p',
        title: 'penile cancer',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uo7f029kl2rst3h5s53t',
        title: 'environmental toxicant',
        parents: {
            connect: [
                {
                    id: 'clkv6umx101rcl2rs2oa8hbkt'
                }
            ]
        }
    },
    {
        id: 'clkv6uo84029ul2rsve6wfz9r',
        title: 'anthrax',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6uocl02bwl2rsc77atwhq',
        title: 'infectious disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6uodl02ccl2rssyjo1p3w',
        title: 'ovarian tumors',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uof002cwl2rsgn0hu2tg',
        title: 'tumors uterus',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uofa02d0l2rsjtt675qi',
        title: 'radiation therapy',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uog402dcl2rsg7e92e7f',
        title: 'infertility problems',
        parents: {
            connect: [
                {
                    id: 'clkv6uof502cyl2rsqzqb624p'
                }
            ]
        }
    },
    {
        id: 'clkv6uog902del2rst0kboory',
        title: 'maternal death',
        parents: {
            connect: [
                {
                    id: 'clkv6uof502cyl2rsqzqb624p'
                }
            ]
        }
    },
    {
        id: 'clkv6uogi02dil2rsphm9e1sa',
        title: 'foodborne illnesses',
        parents: {
            connect: [
                {
                    id: 'clkv6umwd01r4l2rscz3kvmf0'
                },
                {
                    id: 'clkv6umx101rcl2rs2oa8hbkt'
                }
            ]
        }
    },
    {
        id: 'clkv6uogn02dkl2rsvlkv9m7c',
        title: 'perinatal death',
        parents: {
            connect: [
                {
                    id: 'clkv6uof502cyl2rsqzqb624p'
                }
            ]
        }
    },
    {
        id: 'clkv6uoha02dul2rs5lwcx4a6',
        title: 'preterm labor',
        parents: {
            connect: [
                {
                    id: 'clkv6uof502cyl2rsqzqb624p'
                }
            ]
        }
    },
    {
        id: 'clkv6uohn02e0l2rsd4a48el5',
        title: 'cervical cancer',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uoia02eal2rst23545se',
        title: 'drug resistant',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6uokb02f0l2rs73az8t98',
        title: 'diaphragmatic hernia',
        parents: {
            connect: [
                {
                    id: 'clkv6un2201tcl2rsqqtk2twj'
                }
            ]
        }
    },
    {
        id: 'clkv6uokv02f4l2rstezsgeuj',
        title: 'lumbar',
        parents: {
            connect: [
                {
                    id: 'clkv6un2201tcl2rsqqtk2twj'
                }
            ]
        }
    },
    {
        id: 'clkv6uokz02f6l2rsmi57ytw0',
        title: 'purpose intracerebral',
        parents: {
            connect: [
                {
                    id: 'clkv6un2201tcl2rsqqtk2twj'
                }
            ]
        }
    },
    {
        id: 'clkv6uol902fal2rseqly59iz',
        title: 'recent peritoneal',
        parents: {
            connect: [
                {
                    id: 'clkv6un2201tcl2rsqqtk2twj'
                }
            ]
        }
    },
    {
        id: 'clkv6uolu02fgl2rsukiy6aw6',
        title: 'trauma',
        parents: {
            connect: [
                {
                    id: 'clkv6un1601t0l2rsg735wv2b'
                }
            ]
        }
    },
    {
        id: 'clkv6uom002fil2rszs0t7fx2',
        title: 'knee arthroplasty',
        parents: {
            connect: [
                {
                    id: 'clkv6un2f01til2rsgmt2zyiy'
                }
            ]
        }
    },
    {
        id: 'clkv6uom502fkl2rse1at3abi',
        title: 'cancer',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uoma02fml2rsc5py1ouo',
        title: 'cell transplantation',
        parents: {
            connect: [
                {
                    id: 'clkv6un1j01t4l2rsnscetepa'
                },
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uome02fol2rsxrp5oe3x',
        title: 'genetic disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uis5007ml2rsmdas1r2p'
                },
                {
                    id: 'clkv6umxp01rml2rsgbt85zcx'
                }
            ]
        }
    },
    {
        id: 'clkv6uonr02g6l2rsutlrni6t',
        title: 'organ transplantation',
        parents: {
            connect: [
                {
                    id: 'clkv6un1j01t4l2rsnscetepa'
                }
            ]
        }
    },
    {
        id: 'clkv6uoq302h2l2rs0zjyzrq4',
        title: 'neuroendocrine neoplasm',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uoq802h4l2rs3w1v173j',
        title: 'benign neoplasm',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uoul02iul2rsepzzbnkk',
        title: 'prostatic hyperplasia',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uov702j4l2rs8xvg6255',
        title: 'benign tumors',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6up2z02m4l2rsdiw52pln',
        title: 'medulloblastoma',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6up3502m6l2rsahlf8okw',
        title: 'giardia',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6up3e02m8l2rs98nhsima',
        title: 'toxoplasmosis',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6up3o02mal2rsoffyemqc',
        title: 'piriformospora',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6up4202mcl2rsenndj6rw',
        title: 'trichomoniasis',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6up4b02mel2rs0f7u7mj3',
        title: 'onychomycosis',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6up5302mml2rs644xhvkr',
        title: 'chronic disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umxp01rml2rsgbt85zcx'
                }
            ]
        }
    },
    {
        id: 'clkv6up5r02mwl2rs810zbtzc',
        title: 'meningitis sepsis',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6up5w02myl2rswgbo5vac',
        title: 'condition septic',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                }
            ]
        }
    },
    {
        id: 'clkv6up6r02nal2rswh1eeea2',
        title: 'polyneuropathy',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6up9x02oml2rs32d8pixo',
        title: 'neurological conditions',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6upa502oql2rsgz6hty8l',
        title: 'amyloidosis',
        parents: {
            connect: [
                {
                    id: 'clkv6umxp01rml2rsgbt85zcx'
                }
            ]
        }
    },
    {
        id: 'clkv6upav02p2l2rsr4lbpeo3',
        title: 'mental disorders',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6upb002p4l2rsz7tdvogp',
        title: 'adhd prevalent',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6upb402p6l2rsdjo5ph6x',
        title: 'anxiety',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6upbe02pal2rsogzt7ino',
        title: 'depressive disorder',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6upbx02pgl2rsnv484lnx',
        title: 'disorders',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6upc202pil2rsjxpxhk4y',
        title: 'mental health',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6upd802pyl2rsd285qqyz',
        title: 'spinal cord',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6updn02q4l2rsj9jhbt23',
        title: 'complications retinopathy',
        parents: {
            connect: [
                {
                    id: 'clkv6updi02q2l2rsx6hdf271'
                }
            ]
        }
    },
    {
        id: 'clkv6upe502qcl2rsb59i1qte',
        title: 'corneal disease',
        parents: {
            connect: [
                {
                    id: 'clkv6upe102qal2rsudzus901'
                }
            ]
        }
    },
    {
        id: 'clkv6upef02qgl2rss6pewufj',
        title: 'exposure ultraviolet',
        parents: {
            connect: [
                {
                    id: 'clkv6updi02q2l2rsx6hdf271'
                }
            ]
        }
    },
    {
        id: 'clkv6upep02qkl2rs6bg3tab8',
        title: 'migraine',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6upfm02qsl2rs96ou42fb',
        title: 'dysplasia',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                },
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6upgd02r0l2rs2bxvtrht',
        title: 'neurodevelopmental disorder',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6upji02s6l2rs8wiuyfax',
        title: 'skin cancer',
        parents: {
            connect: [
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6upka02sgl2rs3anz6fdh',
        title: 'death',
        parents: {
            connect: [
                {
                    id: 'clkv6upk502sel2rskx77x7o8'
                }
            ]
        }
    },
    {
        id: 'clkv6upke02sil2rsglcp0c9h',
        title: 'morbidity mortality',
        parents: {
            connect: [
                {
                    id: 'clkv6upk502sel2rskx77x7o8'
                }
            ]
        }
    },
    {
        id: 'clkv6upki02skl2rscn2s6x9v',
        title: 'mortality children',
        parents: {
            connect: [
                {
                    id: 'clkv6upk502sel2rskx77x7o8'
                }
            ]
        }
    },
    {
        id: 'clkv6upkn02sml2rs3g5qmcfh',
        title: 'disability',
        parents: {
            connect: [
                {
                    id: 'clkv6upk002scl2rsfxnmur0m'
                }
            ]
        }
    },
    {
        id: 'clkv6upkt02sol2rsbulfhe56',
        title: 'economic burden',
        parents: {
            connect: [
                {
                    id: 'clkv6uirv007il2rsxv47dw45'
                },
                {
                    id: 'clkv6upk002scl2rsfxnmur0m'
                }
            ]
        }
    },
    {
        id: 'clkv6upkx02sql2rst60p79gl',
        title: 'fatigue',
        parents: {
            connect: [
                {
                    id: 'clkv6upk002scl2rsfxnmur0m'
                }
            ]
        }
    },
    {
        id: 'clkv6upll02t0l2rs3kbnv8ub',
        title: 'older adults',
        parents: {
            connect: [
                {
                    id: 'clkv6umy301rsl2rsa5f2kuy9'
                }
            ]
        }
    },
    {
        id: 'clkv6uplp02t2l2rsrdbcs7da',
        title: 'tobacco',
        parents: {
            connect: [
                {
                    id: 'clkv6umx101rcl2rs2oa8hbkt'
                },
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6upmf02tal2rsbu48bxhq',
        title: 'african swine',
        parents: {
            connect: [
                {
                    id: 'clkv6uma901j2l2rsrz5ynuc2'
                }
            ]
        }
    },
    {
        id: 'clkv6upn002tkl2rsfqvh8kad',
        title: 'Dualism',
        parents: {
            connect: [
                {
                    id: 'clkv6uq0w02z6l2rsgrwwumyu'
                }
            ]
        }
    },
    {
        id: 'clkv6upnx02twl2rs3ttgeq2q',
        title: 'Agricultural classes. Including farm tenancy, agricultural laborers',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6upo102tyl2rsnc8eklni',
        title: 'Utilization and culture of special classes of lands. Including pasture lands, water resources development',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6upo602u0l2rsowdqkb8c',
        title: 'Corporations. Including international business enterprises, diversification, industrial concentration, public utilities',
        parents: {
            connect: [
                {
                    id: 'clkv6uli9018gl2rs6muu36le'
                }
            ]
        }
    },
    {
        id: 'clkv6upoa02u2l2rscmlag8wa',
        title: 'Hours of labor. Including overtime, shift work, sick leave, vacations',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6upoe02u4l2rsfkf7tbhg',
        title: 'Labor market. Labor supply. Labor demand. Including unemployment, manpower policy, occupational training, employment agencies',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6upoj02u6l2rsdy26wweg',
        title: 'Classes of labor. Including women, children, students, middle aged and older persons, minorities',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'clkv6upp102uel2rsjsf4afd7',
        title: 'Social perception. Social cognition. Including perception of the self and others, prejudices, stereotype',
        parents: {
            connect: [
                {
                    id: 'clkv6ulxl01eol2rsqa9zts6m'
                }
            ]
        }
    },
    {
        id: 'clkv6uppt02uql2rs9fx6xjsi',
        title: '19th century onwards',
        parents: {
            connect: [
                {
                    id: 'clkv6uj1400ayl2rsey9t8jf2'
                }
            ]
        }
    },
    {
        id: 'clkv6uprf02val2rskavirb5w',
        title: 'The Bible',
        parents: {
            connect: [
                {
                    id: 'clkv6upra02v8l2rsoxdig4vr'
                }
            ]
        }
    },
    {
        id: 'clkv6uprs02vgl2rsv3voyf5n',
        title: 'Christian Denominations',
        parents: {
            connect: [
                {
                    id: 'clkv6upra02v8l2rsoxdig4vr'
                }
            ]
        }
    },
    {
        id: 'clkv6upwg02x6l2rs5f98bsod',
        title: 'Psychic research. Psychology of the conscious',
        parents: {
            connect: [
                {
                    id: 'clkv6upwc02x4l2rs5ezmwxz6'
                }
            ]
        }
    },
    {
        id: 'clkv6upwn02x8l2rsx3zc9x1d',
        title: 'Hallucinations. Sleep. Dreaming. Visions',
        parents: {
            connect: [
                {
                    id: 'clkv6upwc02x4l2rs5ezmwxz6'
                }
            ]
        }
    },
    {
        id: 'clkv6upwr02xal2rscbcmmprp',
        title: 'Hypnotism. Suggestion. Mesmerism. Subliminal projection',
        parents: {
            connect: [
                {
                    id: 'clkv6upwc02x4l2rs5ezmwxz6'
                }
            ]
        }
    },
    {
        id: 'clkv6upwx02xcl2rsc2f5o7nw',
        title: 'Telepathy. Mind reading. Thought transference',
        parents: {
            connect: [
                {
                    id: 'clkv6upwc02x4l2rs5ezmwxz6'
                }
            ]
        }
    },
    {
        id: 'clkv6upx202xel2rs82ww19ng',
        title: 'Spiritualism',
        parents: {
            connect: [
                {
                    id: 'clkv6upwc02x4l2rs5ezmwxz6'
                }
            ]
        }
    },
    {
        id: 'clkv6upx602xgl2rsxcyp9irk',
        title: 'Mediumship, spirit messages, clairvoyance',
        parents: {
            connect: [
                {
                    id: 'clkv6upwc02x4l2rs5ezmwxz6'
                }
            ]
        }
    },
    {
        id: 'clkv6uq0f02yyl2rsq88f2ttc',
        title: 'Polytheism',
        parents: {
            connect: [
                {
                    id: 'clkv6uq0w02z6l2rsgrwwumyu'
                }
            ]
        }
    },
    {
        id: 'clkv6uq2k02zwl2rsn4sahe65',
        title: 'Theism',
        parents: {
            connect: [
                {
                    id: 'clkv6uq0w02z6l2rsgrwwumyu'
                }
            ]
        }
    },
    {
        id: 'clkv6uq2o02zyl2rsiqxc4hk9',
        title: 'Nature and attributes of Deity',
        parents: {
            connect: [
                {
                    id: 'clkv6uq0w02z6l2rsgrwwumyu'
                }
            ]
        }
    },
    {
        id: 'clkv6uq2u0300l2rs7inr0bi9',
        title: 'Pantheism',
        parents: {
            connect: [
                {
                    id: 'clkv6uq0w02z6l2rsgrwwumyu'
                }
            ]
        }
    },
    {
        id: 'clkv6uq2y0302l2rsm1yr0s3r',
        title: 'Monotheism',
        parents: {
            connect: [
                {
                    id: 'clkv6uq0w02z6l2rsgrwwumyu'
                }
            ]
        }
    },
    {
        id: 'clkv6uq320304l2rsr1yn3jep',
        title: 'Creation. Theory of the earth',
        parents: {
            connect: [
                {
                    id: 'clkv6uq0w02z6l2rsgrwwumyu'
                }
            ]
        }
    },
    {
        id: 'clkv6uq370306l2rsjjkjrp73',
        title: 'Religion and science',
        parents: {
            connect: [
                {
                    id: 'clkv6uq0w02z6l2rsgrwwumyu'
                }
            ]
        }
    },
    {
        id: 'clkv6uq3b0308l2rs76fyqdqd',
        title: 'Origins of religion',
        parents: {
            connect: [
                {
                    id: 'clkv6uq1k02zil2rsairj8zsr'
                }
            ]
        }
    },
    {
        id: 'clkv6uq3g030al2rshoe4g3vn',
        title: 'Nature worship',
        parents: {
            connect: [
                {
                    id: 'clkv6uq1k02zil2rsairj8zsr'
                }
            ]
        }
    },
    {
        id: 'clkv6uq3k030cl2rs4xf3968z',
        title: 'Women in comparative religion',
        parents: {
            connect: [
                {
                    id: 'clkv6uq1k02zil2rsairj8zsr'
                }
            ]
        }
    },
    {
        id: 'clkv6uq3p030el2rsbksibgtf',
        title: 'Sex worship. Phallicism',
        parents: {
            connect: [
                {
                    id: 'clkv6uq1k02zil2rsairj8zsr'
                }
            ]
        }
    },
    {
        id: 'clkv6uq3u030gl2rsfh9jdjzu',
        title: 'Worship of human beings',
        parents: {
            connect: [
                {
                    id: 'clkv6uq1k02zil2rsairj8zsr'
                }
            ]
        }
    },
    {
        id: 'clkv6uq3z030il2rsvtndn6ap',
        title: 'Industrial policy. The state and industrial organization. Including licensing of occupations and professions, subsidies, inspection, government ownership, municipal services',
        parents: {
            connect: [
                {
                    id: 'clkv6uli9018gl2rs6muu36le'
                }
            ]
        }
    },
    {
        id: 'clkv6uq5x031cl2rsl1a6892a',
        title: 'ecosystem',
        parents: {
            connect: [
                {
                    id: 'clkv6uq66031gl2rsz0v54s0t'
                }
            ]
        }
    },
    {
        id: 'clkv6uq6a031il2rs2kt5tfm3',
        title: 'anaerobic',
        parents: {
            connect: [
                {
                    id: 'clkv6uq66031gl2rsz0v54s0t'
                }
            ]
        }
    },
    {
        id: 'clkv6uq6f031kl2rsmrms8ske',
        title: 'carbon soil',
        parents: {
            connect: [
                {
                    id: 'clkv6uq66031gl2rsz0v54s0t'
                }
            ]
        }
    },
    {
        id: 'clkv6uq6k031ml2rs1d91rng2',
        title: 'pollution',
        parents: {
            connect: [
                {
                    id: 'clkv6uq66031gl2rsz0v54s0t'
                }
            ]
        }
    },
    {
        id: 'clwueayzb00033s9o9lrgdmn7',
        title: 'Film and Screen',
        parents: {
            connect: [
                {
                    id: 'clkv6uilm005cl2rsx9weklg5'
                },
                {
                    id: 'clwueaou900023s9o6drho4dy'
                }
            ]
        }
    },
    {
        id: 'clx338nr10000okedb0njbvdu',
        title: 'Veterinary medicine',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'clkv6uocq02byl2rs1l4o0jln',
        title: 'Drug abuse',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'clkv6ul5k013ql2rshxv9b7lg',
        title: 'North American Military, Naval and Political History',
        parents: {
            connect: [
                {
                    id: 'clkv6ul56013kl2rsq226nwgj'
                }
            ]
        }
    },
    {
        id: 'clkv6ukje00usl2rsuue1rgkh',
        title: 'Yugoslavian Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ukj300uol2rs47v1ia9q'
                }
            ]
        }
    },
    {
        id: 'clkv6ukim00ugl2rsg8xst3wk',
        title: 'Albanian Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ukii00uel2rs0ckvxa8h'
                }
            ]
        }
    },
    {
        id: 'clkv6ukdu00sul2rsdq7ms8vd',
        title: 'Bulgarian Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdi00sql2rsvl2qctm3'
                }
            ]
        }
    },
    {
        id: 'clkv6uk5600q4l2rsjhwhd5mo',
        title: 'Spanish Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5100q2l2rspda163o0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujyc00nil2rsnhj9qeh6',
        title: 'Danish Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ujy700ngl2rs8s1oxg3b'
                }
            ]
        }
    },
    {
        id: 'clkv6ujp500kml2rsh249vzd5',
        title: 'Dutch Military, naval, and political history. Foreign relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ujp000kkl2rs0jm9pxvx'
                }
            ]
        }
    },
    {
        id: 'clkv6ulou01b0l2rsd0bt8pvr',
        title: 'Wages and benefits',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'cly468yp200027ryzf4lfdzbi',
        title: 'Avalanches',
        parents: {
            connect: [
                {
                    id: 'clkv6uldm016ql2rsr4ox91se'
                }
            ]
        }
    },
    {
        id: 'cly468ypo00057ryzwnow9c9d',
        title: 'Bioterrorism',
        parents: {
            connect: [
                {
                    id: 'cly468yph00047ryzwqn34dkp'
                }
            ]
        }
    },
    {
        id: 'cly468ypv00067ryzdvo9slxf',
        title: 'Animal Abuse',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468yq100077ryz7nlywdi6',
        title: 'Assault',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468yq800087ryzydbfodpg',
        title: 'Anti-trust crime',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468yqd00097ryzpptlmhx2',
        title: 'Arrest',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468yr1000c7ryz88vm043g',
        title: 'Advertising',
        parents: {
            connect: [
                {
                    id: 'clkv6ultw01d8l2rshemkr3n0'
                }
            ]
        }
    },
    {
        id: 'cly468yru000h7ryzjw8h8iv0',
        title: 'Adults',
        parents: {
            connect: [
                {
                    id: 'clkv6ulh20182l2rsveamurb8'
                }
            ]
        }
    },
    {
        id: 'cly468ys4000j7ryzai03jt0j',
        title: 'Addiction',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                }
            ]
        }
    },
    {
        id: 'cly468ysi000l7ryzubvl0qsy',
        title: 'Bribery',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468yt5000m7ryzroat6b69',
        title: 'Business information',
        parents: {
            connect: [
                {
                    id: 'clkv6ultw01d8l2rshemkr3n0'
                }
            ]
        }
    },
    {
        id: 'cly468ytd000n7ryzqcz547g2',
        title: 'Business governance',
        parents: {
            connect: [
                {
                    id: 'clkv6ultw01d8l2rshemkr3n0'
                }
            ]
        }
    },
    {
        id: 'cly468ytj000o7ryzzb0u5flo',
        title: 'Bonds',
        parents: {
            connect: [
                {
                    id: 'clkv6ulv101dol2rsojb5cjfo'
                }
            ]
        }
    },
    {
        id: 'cly468yuu000u7ryz2eh5vx2v',
        title: 'Biotechnology business',
        parents: {
            connect: [
                {
                    id: 'clkv6ultw01d8l2rshemkr3n0'
                }
            ]
        }
    },
    {
        id: 'cly468yv8000w7ryzkaz1an14',
        title: 'Cultural Development',
        parents: {
            connect: [
                {
                    id: 'clkv6ulwl01e8l2rsmch91jsi'
                }
            ]
        }
    },
    {
        id: 'cly468yx000107ryzzw3v9it5',
        title: 'Corporate crime',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468yx700117ryzko2uvxbq',
        title: 'Corruption',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468yxd00127ryz787ov3b9',
        title: 'Cyber crime',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468yxw00157ryzkwufkpsk',
        title: 'Corporate actions',
        parents: {
            connect: [
                {
                    id: 'clkv6ultw01d8l2rshemkr3n0'
                }
            ]
        }
    },
    {
        id: 'cly468yyp00197ryzp2zsnqmy',
        title: 'Computer networking',
        parents: {
            connect: [
                {
                    id: 'cly468yyi00187ryzt22ty3w7'
                }
            ]
        }
    },
    {
        id: 'cly468yyv001a7ryz2djgivhh',
        title: 'Computer security',
        parents: {
            connect: [
                {
                    id: 'cly468yyi00187ryzt22ty3w7'
                }
            ]
        }
    },
    {
        id: 'cly468yz8001c7ryzzhf5yfmq',
        title: 'Consumer goods',
        parents: {
            connect: [
                {
                    id: 'clkv6ulgt017yl2rsnu240ps9'
                }
            ]
        }
    },
    {
        id: 'cly468yze001d7ryzgeq4mksc',
        title: 'Consumer electronics',
        parents: {
            connect: [
                {
                    id: 'clkv6umq201p2l2rsa44opac8'
                }
            ]
        }
    },
    {
        id: 'cly468yzo001e7ryzi83h1wj8',
        title: 'Coal',
        parents: {
            connect: [
                {
                    id: 'clkv6ui7h0002l2rsxsh5efd7'
                }
            ]
        }
    },
    {
        id: 'cly468yzz001g7ryz8xds2lbp',
        title: 'Central banks',
        parents: {
            connect: [
                {
                    id: 'clkv6ulue01dgl2rst9quchzp'
                }
            ]
        }
    },
    {
        id: 'cly468z04001h7ryzlesrkxdt',
        title: 'Consumer confidence',
        parents: {
            connect: [
                {
                    id: 'clkv6ulgt017yl2rsnu240ps9'
                }
            ]
        }
    },
    {
        id: 'cly468z0a001i7ryz5dsdasm1',
        title: 'Consumer issues',
        parents: {
            connect: [
                {
                    id: 'clkv6ulgt017yl2rsnu240ps9'
                }
            ]
        }
    },
    {
        id: 'cly468z0k001k7ryzehpfxpbn',
        title: 'Cryptocurrency',
        parents: {
            connect: [
                {
                    id: 'cly468z0e001j7ryzzx2yduz4'
                }
            ]
        }
    },
    {
        id: 'cly468z0z001n7ryzops8focq',
        title: 'Child labour',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468z19001p7ryzl7vgq9c3',
        title: 'Commuting',
        parents: {
            connect: [
                {
                    id: 'cly468z14001o7ryzk0n5bh9m'
                }
            ]
        }
    },
    {
        id: 'cly468z1p001s7ryzh3wpv4y1',
        title: 'Censorship and freedom of speech',
        parents: {
            connect: [
                {
                    id: 'clkv6ulwp01eal2rs74waj9sc'
                }
            ]
        }
    },
    {
        id: 'cly468z3f001w7ryz77rdi80s',
        title: 'Cosmogony',
        parents: {
            connect: [
                {
                    id: 'clkv6um5x01hil2rsbd75wsdc'
                }
            ]
        }
    },
    {
        id: 'cly468z3j001x7ryzonzszypv',
        title: 'Children',
        parents: {
            connect: [
                {
                    id: 'clkv6ulh20182l2rsveamurb8'
                }
            ]
        }
    },
    {
        id: 'cly468z3o001y7ryzxhm8jre3',
        title: 'Charity',
        parents: {
            connect: [
                {
                    id: 'clkv6ulxh01eml2rsy3qdnj6j'
                }
            ]
        }
    },
    {
        id: 'cly468z3t001z7ryznn7syb7p',
        title: 'Dance',
        parents: {
            connect: [
                {
                    id: 'clwueaou900023s9o6drho4dy'
                }
            ]
        }
    },
    {
        id: 'cly468z4c00227ryz8xid7zfc',
        title: 'Drug related crimes',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468z4i00237ryzbucb6ll8',
        title: 'Drug trafficking',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468z4n00247ryzts9vje10',
        title: 'Drought',
        parents: {
            connect: [
                {
                    id: 'clkv6uldm016ql2rsr4ox91se'
                }
            ]
        }
    },
    {
        id: 'cly468z4x00257ryz23hywv1c',
        title: 'Dividends',
        parents: {
            connect: [
                {
                    id: 'clkv6ulv101dol2rsojb5cjfo'
                }
            ]
        }
    },
    {
        id: 'cly468z5400267ryzw7y0mtkb',
        title: 'Inflation and Deflation',
        parents: {
            connect: [
                {
                    id: 'clkv6ulga017ql2rsqfmk64f6'
                }
            ]
        }
    },
    {
        id: 'cly468z5d00277ryz2z3gq165',
        title: 'Debt market',
        parents: {
            connect: [
                {
                    id: 'clkv6upos02ual2rswg7o0a6m'
                }
            ]
        }
    },
    {
        id: 'cly468z6o002d7ryz50jmkdsc',
        title: 'Embezzlement',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468z75002g7ryzya07dp9h',
        title: 'Emergency Response',
        parents: {
            connect: [
                {
                    id: 'cly468z70002f7ryzzggjsvqh'
                }
            ]
        }
    },
    {
        id: 'cly468z7a002h7ryzc5101veq',
        title: 'Earnings',
        parents: {
            connect: [
                {
                    id: 'clkv6ulgo017wl2rs0mc5y53f'
                }
            ]
        }
    },
    {
        id: 'cly468z7w002l7ryz6fg7kcv7',
        title: 'Entrepreneurship',
        parents: {
            connect: [
                {
                    id: 'clkv6ultw01d8l2rshemkr3n0'
                }
            ]
        }
    },
    {
        id: 'cly468z8r002q7ryzc91mghol',
        title: 'Employment statistics',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                },
                {
                    id: 'cly468z87002n7ryzwldbhp9z'
                }
            ]
        }
    },
    {
        id: 'cly468z99002t7ryz7zooeobl',
        title: 'Energy market',
        parents: {
            connect: [
                {
                    id: 'clkv6ulto01d4l2rsklkm5bpu'
                }
            ]
        }
    },
    {
        id: 'cly468zb500357ryzqg25h22s',
        title: 'Sanctions',
        parents: {
            connect: [
                {
                    id: 'clkv6ults01d6l2rssp5gbja3'
                },
                {
                    id: 'cly468zat00337ryz1omx361g'
                }
            ]
        }
    },
    {
        id: 'cly468zbp00397ryzjqsa6oq3',
        title: 'Festivals and events',
        parents: {
            connect: [
                {
                    id: 'cly468zbk00387ryzqqksxnwt'
                }
            ]
        }
    },
    {
        id: 'cly468zbu003a7ryzcx8lpu68',
        title: 'Fraud',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468zbz003b7ryzc2s01vz7',
        title: 'Flood',
        parents: {
            connect: [
                {
                    id: 'clkv6uldm016ql2rsr4ox91se'
                }
            ]
        }
    },
    {
        id: 'cly468zc3003c7ryzgxa7u0p2',
        title: 'Punishment',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468zcd003e7ryzbbnk8ku3',
        title: 'Financial statement',
        parents: {
            connect: [
                {
                    id: 'cly468yqj000a7ryzierqdzvf'
                }
            ]
        }
    },
    {
        id: 'cly468zci003f7ryzrxngksbz',
        title: 'Financial and business service',
        parents: {
            connect: [
                {
                    id: 'clkv6ultw01d8l2rshemkr3n0'
                }
            ]
        }
    },
    {
        id: 'cly468zcn003g7ryz4eavc8jw',
        title: 'Food industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uli0018cl2rs9asqmz2p'
                }
            ]
        }
    },
    {
        id: 'cly468zd2003j7ryz22fgedqs',
        title: 'Freedom of religion',
        parents: {
            connect: [
                {
                    id: 'clkv6ulwp01eal2rs74waj9sc'
                }
            ]
        }
    },
    {
        id: 'cly468zd7003k7ryzv4bb30w7',
        title: 'Freedom of the press',
        parents: {
            connect: [
                {
                    id: 'clkv6ulwp01eal2rs74waj9sc'
                }
            ]
        }
    },
    {
        id: 'cly468zdr003o7ryzc0se6vqb',
        title: 'Genocide',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                },
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                }
            ]
        }
    },
    {
        id: 'cly468zdw003p7ryzvl4zcdh4',
        title: 'Gang activity',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468ze6003r7ryzv3q129h6',
        title: 'Gross domestic product',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhq0188l2rsirnj1jbt'
                }
            ]
        }
    },
    {
        id: 'cly468zer003u7ryzg26iw2m7',
        title: 'Gig economy',
        parents: {
            connect: [
                {
                    id: 'clkv6ultw01d8l2rshemkr3n0'
                }
            ]
        }
    },
    {
        id: 'cly468zfv00407ryz8dxi5b27',
        title: 'Homicide',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468zg100417ryzhz91jmwk',
        title: 'Human smuggling and trafficking',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468zg800427ryz5ff0twr1',
        title: 'Human resources',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'cly468zgj00447ryz4hfiddyt',
        title: 'Healthcare industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uiga003al2rs5qdze4nr'
                },
                {
                    id: 'clkv6uplb02swl2rs3hxrxyl1'
                }
            ]
        }
    },
    {
        id: 'cly468zhg004a7ryza5n7nlh2',
        title: 'Human rights',
        parents: {
            connect: [
                {
                    id: 'clkv6ulwp01eal2rs74waj9sc'
                }
            ]
        }
    },
    {
        id: 'cly468zhx004d7ryzsezmjjyt',
        title: 'Housing and urban planning policy',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                },
                {
                    id: 'cly468zhr004c7ryzr4zoffy6'
                }
            ]
        }
    },
    {
        id: 'cly468zi2004e7ryzplw6y1eq',
        title: 'Homelessness',
        parents: {
            connect: [
                {
                    id: 'clkv6ulxh01eml2rsy3qdnj6j'
                }
            ]
        }
    },
    {
        id: 'cly468zj8004l7ryzpwb62r27',
        title: 'Internet of things',
        parents: {
            connect: [
                {
                    id: 'cly468yyi00187ryzt22ty3w7'
                }
            ]
        }
    },
    {
        id: 'cly468zje004m7ryzqweo8iuj',
        title: 'Infrastructure projects',
        parents: {
            connect: [
                {
                    id: 'cly468zhr004c7ryzr4zoffy6'
                }
            ]
        }
    },
    {
        id: 'cly468zjj004n7ryzn4d5ulni',
        title: 'Industrial components and devices',
        parents: {
            connect: [
                {
                    id: 'clkv6umba01jel2rsb4toro2l'
                }
            ]
        }
    },
    {
        id: 'cly468zjo004o7ryzfdhg729h',
        title: 'Inventories',
        parents: {
            connect: [
                {
                    id: 'cly468yqj000a7ryzierqdzvf'
                }
            ]
        }
    },
    {
        id: 'cly468zk4004r7ryz969humw0',
        title: 'Invasive species',
        parents: {
            connect: [
                {
                    id: 'clkv6uiyx009yl2rs5jwx6s2x'
                }
            ]
        }
    },
    {
        id: 'cly468zka004s7ryzogn1sx12',
        title: 'Interior policy',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly468zkg004t7ryz2tcdsi21',
        title: 'Infrastructure policy',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                },
                {
                    id: 'cly468zhr004c7ryzr4zoffy6'
                }
            ]
        }
    },
    {
        id: 'cly468zkl004u7ryz4y8evn1t',
        title: 'Integration policy',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly468zkr004v7ryzkep45td7',
        title: 'International organisations',
        parents: {
            connect: [
                {
                    id: 'clkv6ulx301egl2rszbgb47k1'
                }
            ]
        }
    },
    {
        id: 'cly468zlc004z7ryzoma8h38r',
        title: 'Infants',
        parents: {
            connect: [
                {
                    id: 'clkv6ulh20182l2rsveamurb8'
                }
            ]
        }
    },
    {
        id: 'cly468zln00517ryzqd66cry8',
        title: 'Kerosene/paraffin',
        parents: {
            connect: [
                {
                    id: 'clkv6ui7h0002l2rsxsh5efd7'
                }
            ]
        }
    },
    {
        id: 'cly468zly00537ryzfs9vsasl',
        title: 'Law enforcement',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                },
                {
                    id: 'cly468z70002f7ryzzggjsvqh'
                }
            ]
        }
    },
    {
        id: 'cly468zm300547ryzcawoxdsq',
        title: 'Landslide',
        parents: {
            connect: [
                {
                    id: 'clkv6uldm016ql2rsr4ox91se'
                }
            ]
        }
    },
    {
        id: 'cly468zm800557ryzf4wzw8pt',
        title: 'Merger or acquisition',
        parents: {
            connect: [
                {
                    id: 'clkv6ultw01d8l2rshemkr3n0'
                }
            ]
        }
    },
    {
        id: 'cly468zmo00587ryz3lxg9rcg',
        title: 'Land price',
        parents: {
            connect: [
                {
                    id: 'clkv6ulga017ql2rsqfmk64f6'
                }
            ]
        }
    },
    {
        id: 'cly468zmt00597ryzoiabfiej',
        title: 'Luxury good',
        parents: {
            connect: [
                {
                    id: 'clkv6ulgt017yl2rsnu240ps9'
                }
            ]
        }
    },
    {
        id: 'cly468zmy005a7ryz7imk4y8l',
        title: 'Logistics',
        parents: {
            connect: [
                {
                    id: 'clkv6ulrb01c2l2rstrqwcbe2'
                }
            ]
        }
    },
    {
        id: 'cly468zn4005b7ryzj2ntt6e7',
        title: 'Loans',
        parents: {
            connect: [
                {
                    id: 'clkv6upos02ual2rswg7o0a6m'
                }
            ]
        }
    },
    {
        id: 'cly468zp0005e7ryzbw5rnp57',
        title: 'Local elections',
        parents: {
            connect: [
                {
                    id: 'cly468zaj00317ryz6edu1iar'
                }
            ]
        }
    },
    {
        id: 'cly468zq1005l7ryzhsx7onas',
        title: 'Social media',
        parents: {
            connect: [
                {
                    id: 'cly468yyi00187ryzt22ty3w7'
                }
            ]
        }
    },
    {
        id: 'cly468zq7005m7ryzog5eucqu',
        title: 'Mass media',
        parents: {
            connect: [
                {
                    id: 'clkv6uimi005ml2rskdan8yvo'
                },
                {
                    id: 'clkv6umpx01p0l2rste23gojz'
                }
            ]
        }
    },
    {
        id: 'cly468zs4005y7ryz18bc8mgy',
        title: 'Migration policy',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly468zsw00637ryz9c6t5jo2',
        title: 'Nuclear accident and incident',
        parents: {
            connect: [
                {
                    id: 'clkv6uldm016ql2rsr4ox91se'
                },
                {
                    id: 'cly468zsr00627ryzrqdo308o'
                }
            ]
        }
    },
    {
        id: 'cly468zt200647ryz28ppzwu4',
        title: 'Non-durable good',
        parents: {
            connect: [
                {
                    id: 'clkv6ulgt017yl2rsnu240ps9'
                }
            ]
        }
    },
    {
        id: 'cly468zt700657ryz8mvzhj4k',
        title: 'News agency',
        parents: {
            connect: [
                {
                    id: 'cly468zsm00617ryzprjnsd1t'
                }
            ]
        }
    },
    {
        id: 'cly468ztc00667ryz6wh6ejf5',
        title: 'Newspaper and magazine',
        parents: {
            connect: [
                {
                    id: 'cly468zsm00617ryzprjnsd1t'
                }
            ]
        }
    },
    {
        id: 'cly468ztz006a7ryzihan74l9',
        title: 'Nuclear policy',
        parents: {
            connect: [
                {
                    id: 'clkv6umq601p4l2rseps6hfu9'
                },
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly468zu4006b7ryzx5avvv1v',
        title: 'Non-governmental organisations',
        parents: {
            connect: [
                {
                    id: 'clkv6ulx301egl2rszbgb47k1'
                }
            ]
        }
    },
    {
        id: 'cly468zuq006f7ryzitm7wkyh',
        title: 'Organised crime',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly468zv8006i7ryzs6fqsr4p',
        title: 'Online and remote learning',
        parents: {
            connect: [
                {
                    id: 'clkv6uick001yl2rsah3paagu'
                },
                {
                    id: 'cly468yyi00187ryzt22ty3w7'
                }
            ]
        }
    },
    {
        id: 'cly468zw8006o7ryz74m4ug7h',
        title: 'Prisoners of war',
        parents: {
            connect: [
                {
                    id: 'cly468zqh005o7ryz8y9e96qe'
                }
            ]
        }
    },
    {
        id: 'cly468zws006r7ryzwekbbi5o',
        title: 'Product recall',
        parents: {
            connect: [
                {
                    id: 'clkv6uli9018gl2rs6muu36le'
                }
            ]
        }
    },
    {
        id: 'cly468zxi006u7ryzfzhnaoam',
        title: 'Public relations',
        parents: {
            connect: [
                {
                    id: 'clkv6ulx301egl2rszbgb47k1'
                }
            ]
        }
    },
    {
        id: 'cly468zxp006v7ryzq3hdwvmo',
        title: 'Productivity',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'cly468zy6006y7ryzcky612r6',
        title: 'Population growth',
        parents: {
            connect: [
                {
                    id: 'clkv6ulh20182l2rsveamurb8'
                }
            ]
        }
    },
    {
        id: 'cly468zyi00707ryz3s8rwbk6',
        title: 'Parental leave',
        parents: {
            connect: [
                {
                    id: 'clkv6upp602ugl2rsxqip2f38'
                },
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'cly468zyt00727ryzqn1r7695',
        title: 'Political campaigns',
        parents: {
            connect: [
                {
                    id: 'cly468zaj00317ryz6edu1iar'
                }
            ]
        }
    },
    {
        id: 'cly468zyz00737ryz3j7ykvsr',
        title: 'Political candidates',
        parents: {
            connect: [
                {
                    id: 'cly468zaj00317ryz6edu1iar'
                }
            ]
        }
    },
    {
        id: 'cly468zz400747ryzv2xmoukw',
        title: 'Primary elections',
        parents: {
            connect: [
                {
                    id: 'cly468zaj00317ryz6edu1iar'
                }
            ]
        }
    },
    {
        id: 'cly468zza00757ryz5441m3c1',
        title: 'Privacy',
        parents: {
            connect: [
                {
                    id: 'clkv6ulwp01eal2rs74waj9sc'
                },
                {
                    id: 'cly468z6200297ryz1ldm7jf8'
                }
            ]
        }
    },
    {
        id: 'cly468zzg00767ryz9xeo8ahy',
        title: 'Public employees',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                },
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zzl00777ryzd3ljaytn',
        title: 'Public inquiry',
        parents: {
            connect: [
                {
                    id: 'clkv6ulw601e2l2rswgxf7j00'
                },
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                }
            ]
        }
    },
    {
        id: 'cly468zzx00797ryzpidize51',
        title: 'Personal data collection policy',
        parents: {
            connect: [
                {
                    id: 'cly468z6200297ryz1ldm7jf8'
                },
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly46901x007m7ryzmp9e30k6',
        title: 'Regulations',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly469022007n7ryzdpju08rs',
        title: 'Radio industry',
        parents: {
            connect: [
                {
                    id: 'cly46901h007j7ryzagt6bbof'
                }
            ]
        }
    },
    {
        id: 'cly469028007o7ryzi0cmflj6',
        title: 'Retail',
        parents: {
            connect: [
                {
                    id: 'clkv6ulgt017yl2rsnu240ps9'
                }
            ]
        }
    },
    {
        id: 'cly46902o007r7ryzbqwsgonx',
        title: 'Retirement',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'cly46902z007t7ryzbl25imf6',
        title: 'Regional elections',
        parents: {
            connect: [
                {
                    id: 'cly468zaj00317ryz6edu1iar'
                }
            ]
        }
    },
    {
        id: 'cly46903f007w7ryzt9bsgjx3',
        title: 'Regional development policy',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly46904s00857ryzvkjic9m5',
        title: 'Sex crime',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly46905900887ryzqliemlep',
        title: 'Structural failure',
        parents: {
            connect: [
                {
                    id: 'clkv6umdv01kgl2rs2hny6nhk'
                }
            ]
        }
    },
    {
        id: 'cly46905f00897ryzhv6ghehc',
        title: 'Stocks',
        parents: {
            connect: [
                {
                    id: 'clkv6ulv101dol2rsojb5cjfo'
                }
            ]
        }
    },
    {
        id: 'cly46905x008c7ryzo48dyw2v',
        title: 'Strategy and marketing',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'cly469068008e7ryz1j5eqhih',
        title: 'Sales channels',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'cly46906i008g7ryz2dhbi3zf',
        title: 'Shipbuilding',
        parents: {
            connect: [
                {
                    id: 'clkv6ulrl01c6l2rs6xawnijb'
                }
            ]
        }
    },
    {
        id: 'cly46906s008i7ryz17mwojzz',
        title: 'Small and medium enterprise',
        parents: {
            connect: [
                {
                    id: 'clkv6ulhd0186l2rsdb3d3ugg'
                }
            ]
        }
    },
    {
        id: 'cly46906x008j7ryz86wt5o6b',
        title: 'Securities',
        parents: {
            connect: [
                {
                    id: 'clkv6ulv101dol2rsojb5cjfo'
                }
            ]
        }
    },
    {
        id: 'cly46908u008r7ryzlqzha3jd',
        title: 'Sports policies',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly469095008s7ryza8mmg5ps',
        title: 'Summit meetings',
        parents: {
            connect: [
                {
                    id: 'clkv6ulx301egl2rszbgb47k1'
                }
            ]
        }
    },
    {
        id: 'cly4690ax008x7ryzk9wwfj7a',
        title: 'Slavery',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly4690bn00907ryz5irup3w1',
        title: 'Pornography',
        parents: {
            connect: [
                {
                    id: 'cly4690bi008z7ryzhf1fx8zi'
                }
            ]
        }
    },
    {
        id: 'cly4690c800937ryzkn1vxvm3',
        title: 'Sport industry',
        parents: {
            connect: [
                {
                    id: 'clwueb73z00043s9oqx3zdqky'
                }
            ]
        }
    },
    {
        id: 'cly4690dg00977ryzzokcasye',
        title: 'Tax evasion',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly4690dl00987ryz3v66v2br',
        title: 'Transportation accident and incident',
        parents: {
            connect: [
                {
                    id: 'cly468zsr00627ryzrqdo308o'
                }
            ]
        }
    },
    {
        id: 'cly4690dw009a7ryzdzgz0du1',
        title: 'Textile and clothing',
        parents: {
            connect: [
                {
                    id: 'clkv6umvh01qsl2rsky3auj0g'
                }
            ]
        }
    },
    {
        id: 'cly4690e2009b7ryz85lte3ly',
        title: 'Trade agreements',
        parents: {
            connect: [
                {
                    id: 'clkv6ults01d6l2rssp5gbja3'
                }
            ]
        }
    },
    {
        id: 'cly4690e7009c7ryzpl7w9su3',
        title: 'Tariffs',
        parents: {
            connect: [
                {
                    id: 'clkv6ults01d6l2rssp5gbja3'
                }
            ]
        }
    },
    {
        id: 'cly4690fy009i7ryzvfgidusd',
        title: 'Unemployment',
        parents: {
            connect: [
                {
                    id: 'clkv6ulie018il2rsgnzwo1y7'
                }
            ]
        }
    },
    {
        id: 'cly4690g6009j7ryz9qn4t2cq',
        title: 'Vandalism',
        parents: {
            connect: [
                {
                    id: 'cly468yf300007ryzm3e5px2a'
                }
            ]
        }
    },
    {
        id: 'cly4690gw009m7ryz58n9pj1j',
        title: 'Voting',
        parents: {
            connect: [
                {
                    id: 'cly468zao00327ryzea10zjej'
                }
            ]
        }
    },
    {
        id: 'cly4690h8009n7ryzmrn7xhkl',
        title: 'Wildfire',
        parents: {
            connect: [
                {
                    id: 'clkv6uldm016ql2rsr4ox91se'
                }
            ]
        }
    },
    {
        id: 'cly4690he009o7ryzxnujud52',
        title: 'Windstorms',
        parents: {
            connect: [
                {
                    id: 'clkv6uldm016ql2rsr4ox91se'
                }
            ]
        }
    },
    {
        id: 'cly4690hk009p7ryzbs8irtej',
        title: 'Wireless technology',
        parents: {
            connect: [
                {
                    id: 'clkv6ulsp01col2rsoraayjkp'
                }
            ]
        }
    },
    {
        id: 'cly4690ic009u7ryz09kw0joe',
        title: 'Water',
        parents: {
            connect: [
                {
                    id: 'clkv6uldh016ol2rsgphrhdxn'
                }
            ]
        }
    },
    {
        id: 'cly4690is009x7ryzuir33f13',
        title: 'Feminism',
        parents: {
            connect: [
                {
                    id: 'clkv6um2i01gcl2rsat8prvm2'
                }
            ]
        }
    },
    {
        id: 'cly4690iy009y7ryzrr21tg4x',
        title: 'Credit rating',
        parents: {
            connect: [
                {
                    id: 'clkv6upos02ual2rswg7o0a6m'
                }
            ]
        }
    },
    {
        id: 'cly4690j3009z7ryzccgt0daa',
        title: 'Trade dispute',
        parents: {
            connect: [
                {
                    id: 'clkv6ults01d6l2rssp5gbja3'
                }
            ]
        }
    },
    {
        id: 'cly4690j800a07ryzk48cvryl',
        title: 'Espionage and intelligence',
        parents: {
            connect: [
                {
                    id: 'cly468ztn00687ryzjcv3valm'
                }
            ]
        }
    },
    {
        id: 'cly4690jj00a27ryzbypufx5p',
        title: 'Local government policy',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly4690js00a37ryzt8w3ufe6',
        title: 'Meteorological disaster',
        parents: {
            connect: [
                {
                    id: 'clkv6uldm016ql2rsr4ox91se'
                }
            ]
        }
    },
    {
        id: 'cly4690k100a47ryzhfqhnbbd',
        title: 'Court',
        parents: {
            connect: [
                {
                    id: 'cly468zli00507ryzh96v7r8o'
                }
            ]
        }
    },
    {
        id: 'cly4690kb00a57ryzg1f59ik9',
        title: 'Cultural policies',
        parents: {
            connect: [
                {
                    id: 'clkv6ulwl01e8l2rsmch91jsi'
                },
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly4690ko00a67ryzsp8y2xls',
        title: 'Child care',
        parents: {
            connect: [
                {
                    id: 'clkv6uppb02uil2rsn87ce25x'
                },
                {
                    id: 'cly468z6u002e7ryzlb1oxcau'
                }
            ]
        }
    },
    {
        id: 'cly4690kv00a77ryz3kopawt1',
        title: 'Environmental, social and governance policy',
        parents: {
            connect: [
                {
                    id: 'clkv6ulfk017gl2rssuoaii4k'
                },
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly4690l200a87ryz3uvra0tu',
        title: 'Energy and resource',
        parents: {
            connect: [
                {
                    id: 'clkv6ump301ool2rsf4hcy5ob'
                },
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly4690l800a97ryz4df4j0s5',
        title: 'Economic policy',
        parents: {
            connect: [
                {
                    id: 'clkv6uifz0036l2rsmcyhgjwb'
                },
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly4690lq00ab7ryzpg64y15x',
        title: 'Education policy',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly4690mc00af7ryz4os3d7ey',
        title: 'Judiciary',
        parents: {
            connect: [
                {
                    id: 'cly468zli00507ryzh96v7r8o'
                }
            ]
        }
    },
    {
        id: 'cly4690mh00ag7ryzoutg05mz',
        title: 'Judge',
        parents: {
            connect: [
                {
                    id: 'cly468zli00507ryzh96v7r8o'
                }
            ]
        }
    },
    {
        id: 'cly4690ni00an7ryz4d4to50j',
        title: 'Tourism and leisure industry',
        parents: {
            connect: [
                {
                    id: 'cly4690em009e7ryzpux3nor9'
                }
            ]
        }
    },
    {
        id: 'clkv6ui7u0006l2rsv2v47fbd',
        title: 'glycolysis',
        parents: {
            connect: [
                {
                    id: 'clkv6uo7f029kl2rst3h5s53t'
                }
            ]
        }
    },
    {
        id: 'clkv6uib5001gl2rsbj6m0wja',
        title: '1989-',
        parents: {
            connect: [
                {
                    id: 'clkv6uj7200d8l2rs1ije2s51'
                }
            ]
        }
    },
    {
        id: 'clkv6uiut008il2rss8m7wa1w',
        title: 'Plant culture',
        parents: {
            connect: [
                {
                    id: 'clkv6uium008gl2rs3d7ene92'
                }
            ]
        }
    },
    {
        id: 'clkv6uiv6008kl2rs61tnwvbn',
        title: 'Forestry',
        parents: {
            connect: [
                {
                    id: 'clkv6uium008gl2rs3d7ene92'
                }
            ]
        }
    },
    {
        id: 'clkv6uivc008ml2rsztxbm01f',
        title: 'Animal culture',
        parents: {
            connect: [
                {
                    id: 'clkv6uium008gl2rs3d7ene92'
                }
            ]
        }
    },
    {
        id: 'clkv6uivg008ol2rsdommaht8',
        title: 'Aquaculture. Fisheries. Angling',
        parents: {
            connect: [
                {
                    id: 'clkv6uium008gl2rs3d7ene92'
                }
            ]
        }
    },
    {
        id: 'clkv6uivl008ql2rsfv6bw99x',
        title: 'Hunting sports',
        parents: {
            connect: [
                {
                    id: 'clkv6uium008gl2rs3d7ene92'
                }
            ]
        }
    },
    {
        id: 'clkv6uizf00a6l2rsck5tw4cb',
        title: 'Climate change',
        parents: {
            connect: [
                {
                    id: 'clkv6uiza00a4l2rs9xhxgjx5'
                }
            ]
        }
    },
    {
        id: 'clkv6uj0a00akl2rsaldlty05',
        title: 'Migrations',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0100agl2rsnk9h4c5y'
                }
            ]
        }
    },
    {
        id: 'clkv6uj0e00aml2rs10mbv4ju',
        title: 'Crusades',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0100agl2rsnk9h4c5y'
                }
            ]
        }
    },
    {
        id: 'clkv6uj0j00aol2rsjy3ufbyq',
        title: 'Latin Kingdom of Jerusalem. Latin Orient, 1099-1291',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0100agl2rsnk9h4c5y'
                }
            ]
        }
    },
    {
        id: 'clkv6uj0n00aql2rsmgghvamz',
        title: 'Later medieval. 11th-15th centuries',
        parents: {
            connect: [
                {
                    id: 'clkv6uj0100agl2rsnk9h4c5y'
                }
            ]
        }
    },
    {
        id: 'clkv6uj4r00cal2rs1r7azvoa',
        title: 'Wars with the Turks',
        parents: {
            connect: [
                {
                    id: 'clkv6uj4m00c8l2rscuzsjqk6'
                }
            ]
        }
    },
    {
        id: 'clkv6uj5i00ckl2rs87lzjtd5',
        title: 'Revolution, 1848',
        parents: {
            connect: [
                {
                    id: 'clkv6uj5c00cil2rsv98yqq7v'
                }
            ]
        }
    },
    {
        id: 'clkv6uj5n00cml2rson3khfgv',
        title: 'Republic, 1918-',
        parents: {
            connect: [
                {
                    id: 'clkv6uj5c00cil2rsv98yqq7v'
                }
            ]
        }
    },
    {
        id: 'clkv6uj6g00cyl2rsfi4d8bkw',
        title: 'Árpád dynasty, 896-1301',
        parents: {
            connect: [
                {
                    id: 'clkv6uj6c00cwl2rsk4xqoeki'
                }
            ]
        }
    },
    {
        id: 'clkv6uj6l00d0l2rsheiwitqt',
        title: 'Elective kings, 1301-1526',
        parents: {
            connect: [
                {
                    id: 'clkv6uj6c00cwl2rsk4xqoeki'
                }
            ]
        }
    },
    {
        id: 'clkv6uj6t00d4l2rslbkg7vwp',
        title: 'Revolution of 1848-1849',
        parents: {
            connect: [
                {
                    id: 'clkv6uj6p00d2l2rst50bm7sj'
                }
            ]
        }
    },
    {
        id: 'clkv6uj6y00d6l2rs0eiwzq01',
        title: '1849-1918',
        parents: {
            connect: [
                {
                    id: 'clkv6uj6p00d2l2rst50bm7sj'
                }
            ]
        }
    },
    {
        id: 'clkv6uj7800dal2rsbst617xv',
        title: '1918-1945. Revolution of 1919-1920',
        parents: {
            connect: [
                {
                    id: 'clkv6uj7200d8l2rs1ije2s51'
                }
            ]
        }
    },
    {
        id: 'clkv6uj7d00dcl2rse6kzkdo1',
        title: '1945-1989. Revolution of 1956',
        parents: {
            connect: [
                {
                    id: 'clkv6uj7200d8l2rs1ije2s51'
                }
            ]
        }
    },
    {
        id: 'clkv6uj8r00dyl2rsp2m2zleg',
        title: 'Gauls. Celts. Franks',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8i00dul2rs8ejgo6zg'
                }
            ]
        }
    },
    {
        id: 'clkv6uj8w00e0l2rschotplwp',
        title: '476-1328. Merovingians. Carlovingians. Capetians',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8i00dul2rs8ejgo6zg'
                }
            ]
        }
    },
    {
        id: 'clkv6uj9000e2l2rs938q168f',
        title: '1328-1515',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8i00dul2rs8ejgo6zg'
                }
            ]
        }
    },
    {
        id: 'clkv6uj9d00e8l2rsdbexj7ih',
        title: '1515-1589. 16th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8m00dwl2rsd3ratnq0'
                }
            ]
        }
    },
    {
        id: 'clkv6uj9i00eal2rs1yjk4wly',
        title: '1589-1715. Henri IV, Louis XIII, Louis XIV',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8m00dwl2rsd3ratnq0'
                }
            ]
        }
    },
    {
        id: 'clkv6uj9m00ecl2rspwca8paz',
        title: '1715-1789. 18th century. Louis XV, Louis XVI',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8m00dwl2rsd3ratnq0'
                }
            ]
        }
    },
    {
        id: 'clkv6uj9q00eel2rsgyidnwt5',
        title: 'Revolutionary and Napoleonic period, 1789-1815',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8m00dwl2rsd3ratnq0'
                }
            ]
        }
    },
    {
        id: 'clkv6uj9v00egl2rsc2hgiys5',
        title: '19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8m00dwl2rsd3ratnq0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujar00eul2rs87xf854w',
        title: '20th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8m00dwl2rsd3ratnq0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujb900f2l2rsek1piv7p',
        title: '21st century',
        parents: {
            connect: [
                {
                    id: 'clkv6uj8m00dwl2rsd3ratnq0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujc700fil2rsf5iz9x9g',
        title: '481-918. Merovingians. Carolingians',
        parents: {
            connect: [
                {
                    id: 'clkv6ujc300fgl2rs9js2xmm0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujcb00fkl2rsvemea1wh',
        title: '919-1125. Houses of Saxony and Franconia',
        parents: {
            connect: [
                {
                    id: 'clkv6ujc300fgl2rs9js2xmm0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujcg00fml2rsqs87m7md',
        title: '1125-1273. Hohenstaufen period',
        parents: {
            connect: [
                {
                    id: 'clkv6ujc300fgl2rs9js2xmm0'
                }
            ]
        }
    },
    {
        id: 'clkv6ujdc00g0l2rs50j4pl2c',
        title: 'Peasants’ War, 1524-1525',
        parents: {
            connect: [
                {
                    id: 'clkv6ujcu00fsl2rs2zidzpnk'
                }
            ]
        }
    },
    {
        id: 'clkv6ujdg00g2l2rsif2s9bab',
        title: 'Schmalkaldic League and War, 1530-1547',
        parents: {
            connect: [
                {
                    id: 'clkv6ujcu00fsl2rs2zidzpnk'
                }
            ]
        }
    },
    {
        id: 'clkv6ujdk00g4l2rsnqzu0qra',
        title: 'Period of Thirty Years’ War, 1618-1648',
        parents: {
            connect: [
                {
                    id: 'clkv6ujcu00fsl2rs2zidzpnk'
                }
            ]
        }
    },
    {
        id: 'clkv6ujdp00g6l2rsymyes2wx',
        title: '1815-1871',
        parents: {
            connect: [
                {
                    id: 'clkv6ujd300fwl2rss7l20k2v'
                }
            ]
        }
    },
    {
        id: 'clkv6ujdv00g8l2rs5tsxflk8',
        title: 'New Empire, 1871-1918',
        parents: {
            connect: [
                {
                    id: 'clkv6ujd300fwl2rss7l20k2v'
                }
            ]
        }
    },
    {
        id: 'clkv6ujdz00gal2rsa76luipq',
        title: 'Revolution and Republic, 1918-',
        parents: {
            connect: [
                {
                    id: 'clkv6ujd300fwl2rss7l20k2v'
                }
            ]
        }
    },
    {
        id: 'clkv6uje300gcl2rs3ghrhr4q',
        title: 'Period of Allied occupation, 1945-',
        parents: {
            connect: [
                {
                    id: 'clkv6ujd300fwl2rss7l20k2v'
                }
            ]
        }
    },
    {
        id: 'clkv6ujed00ggl2rs8q8czsx2',
        title: 'Hitler, 1933-1945. National socialism',
        parents: {
            connect: [
                {
                    id: 'clkv6ujd300fwl2rss7l20k2v'
                }
            ]
        }
    },
    {
        id: 'clkv6ujge00hcl2rskpegncrp',
        title: '1204-1261. Latin Empire',
        parents: {
            connect: [
                {
                    id: 'clkv6ujg900hal2rsd4trj2ev'
                }
            ]
        }
    },
    {
        id: 'clkv6ujgj00hel2rsbqyfmj4d',
        title: '1261-1453. Palaeologi',
        parents: {
            connect: [
                {
                    id: 'clkv6ujg900hal2rsd4trj2ev'
                }
            ]
        }
    },
    {
        id: 'clkv6uji500i0l2rsppqh03hl',
        title: 'Pre-Roman Italy. Etruria. Etruscans',
        parents: {
            connect: [
                {
                    id: 'clkv6uji100hyl2rs37lx5c5i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujia00i2l2rs5ih7fs6d',
        title: 'Kings and Republic, 753-27 B.C.',
        parents: {
            connect: [
                {
                    id: 'clkv6uji100hyl2rs37lx5c5i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujie00i4l2rsp1xix24k',
        title: 'Empire, 27 B.C.-476 A.D.',
        parents: {
            connect: [
                {
                    id: 'clkv6uji100hyl2rs37lx5c5i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujkc00iwl2rslj1uh42i',
        title: 'Medieval, 476-1492',
        parents: {
            connect: [
                {
                    id: 'clkv6ujk700iul2rsqhtkpadj'
                }
            ]
        }
    },
    {
        id: 'clkv6ujkj00iyl2rsaw3xv3gr',
        title: 'Modern, 1492-',
        parents: {
            connect: [
                {
                    id: 'clkv6ujk700iul2rsqhtkpadj'
                }
            ]
        }
    },
    {
        id: 'clkv6ujoh00kcl2rszv4sj72u',
        title: '1714-1794. Austrian Netherlands',
        parents: {
            connect: [
                {
                    id: 'clkv6ujnx00k6l2rsafnov8qu'
                }
            ]
        }
    },
    {
        id: 'clkv6ujon00kel2rsqznoeo8i',
        title: 'French rule, 1794-1813',
        parents: {
            connect: [
                {
                    id: 'clkv6ujo200k8l2rs8klkq5fi'
                }
            ]
        }
    },
    {
        id: 'clkv6ujor00kgl2rsc0l30v13',
        title: 'Revolution of 1830',
        parents: {
            connect: [
                {
                    id: 'clkv6ujo200k8l2rs8klkq5fi'
                }
            ]
        }
    },
    {
        id: 'clkv6ujq000kyl2rs1uwj6a33',
        title: 'Anglo-Dutch wars, 1652-1667',
        parents: {
            connect: [
                {
                    id: 'clkv6ujpl00ksl2rsvp8geyxg'
                }
            ]
        }
    },
    {
        id: 'clkv6ujq500l0l2rs538w49an',
        title: 'War with France, 1672-1678',
        parents: {
            connect: [
                {
                    id: 'clkv6ujpl00ksl2rsvp8geyxg'
                }
            ]
        }
    },
    {
        id: 'clkv6ujqa00l2l2rs0vl0tlwq',
        title: 'Anglo-Dutch War, 1672-1674',
        parents: {
            connect: [
                {
                    id: 'clkv6ujpl00ksl2rsvp8geyxg'
                }
            ]
        }
    },
    {
        id: 'clkv6ujqe00l4l2rscitalg9i',
        title: 'Stadtholders, 1702-1747',
        parents: {
            connect: [
                {
                    id: 'clkv6ujpl00ksl2rsvp8geyxg'
                }
            ]
        }
    },
    {
        id: 'clkv6ujqj00l6l2rsmioupmri',
        title: 'Anglo-Dutch War, 1780-1784',
        parents: {
            connect: [
                {
                    id: 'clkv6ujpl00ksl2rsvp8geyxg'
                }
            ]
        }
    },
    {
        id: 'clkv6ujqo00l8l2rs0ikln5ae',
        title: 'War with France, 1793-1795',
        parents: {
            connect: [
                {
                    id: 'clkv6ujpl00ksl2rsvp8geyxg'
                }
            ]
        }
    },
    {
        id: 'clkv6ujys00nol2rszteq5wfn',
        title: '750-1241. Norwegian rule, 1042-1047',
        parents: {
            connect: [
                {
                    id: 'clkv6ujyh00nkl2rspgado2zb'
                }
            ]
        }
    },
    {
        id: 'clkv6ujyy00nql2rs4gvu6tkg',
        title: '1241-1523. Union of Kalmar, 1397',
        parents: {
            connect: [
                {
                    id: 'clkv6ujyh00nkl2rspgado2zb'
                }
            ]
        }
    },
    {
        id: 'clkv6ujz400nsl2rsud6ior61',
        title: '1523-1670',
        parents: {
            connect: [
                {
                    id: 'clkv6ujym00nml2rsel2vi8rc'
                }
            ]
        }
    },
    {
        id: 'clkv6ujz900nul2rsanxcbxwn',
        title: '1670-1808',
        parents: {
            connect: [
                {
                    id: 'clkv6ujym00nml2rsel2vi8rc'
                }
            ]
        }
    },
    {
        id: 'clkv6ujze00nwl2rsmc6afcqe',
        title: '1808-1906. 19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6ujym00nml2rsel2vi8rc'
                }
            ]
        }
    },
    {
        id: 'clkv6ujzi00nyl2rs4kpc5vpc',
        title: '20th & 21st century',
        parents: {
            connect: [
                {
                    id: 'clkv6ujym00nml2rsel2vi8rc'
                }
            ]
        }
    },
    {
        id: 'clkv6uk1d00ool2rslz3cezgy',
        title: 'War of 1807-1814',
        parents: {
            connect: [
                {
                    id: 'clkv6uk0x00oil2rsdgd7votv'
                }
            ]
        }
    },
    {
        id: 'clkv6uk1i00oql2rswy4a0jxe',
        title: 'Union with Sweden, 1814',
        parents: {
            connect: [
                {
                    id: 'clkv6uk0x00oil2rsdgd7votv'
                }
            ]
        }
    },
    {
        id: 'clkv6uk1o00osl2rs96a37z9i',
        title: 'Dissolution of the Swedish Norwegian union, 1905',
        parents: {
            connect: [
                {
                    id: 'clkv6uk1300okl2rsu6exiez7'
                }
            ]
        }
    },
    {
        id: 'clkv6uk2m00p2l2rs7t8yhkkj',
        title: 'Vasa dynasty, 1523-1654. Gustaf II Adolf, 1611-1632',
        parents: {
            connect: [
                {
                    id: 'clkv6uk2g00p0l2rskq9nx1km'
                }
            ]
        }
    },
    {
        id: 'clkv6uk2q00p4l2rsz2jv8qip',
        title: 'Zweibrücken dynasty, 1654-1718',
        parents: {
            connect: [
                {
                    id: 'clkv6uk2g00p0l2rskq9nx1km'
                }
            ]
        }
    },
    {
        id: 'clkv6uk2v00p6l2rsu22xzzsh',
        title: '1718-1818',
        parents: {
            connect: [
                {
                    id: 'clkv6uk2g00p0l2rskq9nx1km'
                }
            ]
        }
    },
    {
        id: 'clkv6uk3000p8l2rs3bgk7u70',
        title: '1814-1907. 19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uk2g00p0l2rskq9nx1km'
                }
            ]
        }
    },
    {
        id: 'clkv6uk3400pal2rs2d1dtfxp',
        title: '20th & 21st century',
        parents: {
            connect: [
                {
                    id: 'clkv6uk2g00p0l2rskq9nx1km'
                }
            ]
        }
    },
    {
        id: 'clkv6uk4k00pwl2rs77s9wyv6',
        title: 'Revolution, 1917-1918. Civil War',
        parents: {
            connect: [
                {
                    id: 'clkv6uk4500pql2rsf5vd60v5'
                }
            ]
        }
    },
    {
        id: 'clkv6uk4q00pyl2rsgu61lelq',
        title: '1939-1945',
        parents: {
            connect: [
                {
                    id: 'clkv6uk4500pql2rsf5vd60v5'
                }
            ]
        }
    },
    {
        id: 'clkv6uk6100qcl2rsh264pixu',
        title: 'Pre-Roman, Roman, and Gothic periods',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5j00q6l2rss8e5tweb'
                }
            ]
        }
    },
    {
        id: 'clkv6uk6700qel2rsxvplptvr',
        title: 'Moors in Spain. Córdoba. Kingdom of Granada',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5p00q8l2rspt9b0w6e'
                }
            ]
        }
    },
    {
        id: 'clkv6uk6b00qgl2rsry054qwe',
        title: 'Aragon (Catalonia)',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5p00q8l2rspt9b0w6e'
                }
            ]
        }
    },
    {
        id: 'clkv6uk6g00qil2rsk8w9chyj',
        title: 'Castile and Leon',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5p00q8l2rspt9b0w6e'
                }
            ]
        }
    },
    {
        id: 'clkv6uk6l00qkl2rs6tq4ziza',
        title: 'León (Asturias)',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5p00q8l2rspt9b0w6e'
                }
            ]
        }
    },
    {
        id: 'clkv6uk6u00qml2rse5zvgfdx',
        title: 'Navarre',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5p00q8l2rspt9b0w6e'
                }
            ]
        }
    },
    {
        id: 'clkv6uk7000qol2rsian3q8n6',
        title: '1479-1516. Fernando V and Isabel I',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5u00qal2rsdobhjpjw'
                }
            ]
        }
    },
    {
        id: 'clkv6uk7700qql2rsnsn24s3t',
        title: '1516-1700. Habsburgs',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5u00qal2rsdobhjpjw'
                }
            ]
        }
    },
    {
        id: 'clkv6uk7c00qsl2rso28b6yp4',
        title: '1700-1808. Bourbons',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5u00qal2rsdobhjpjw'
                }
            ]
        }
    },
    {
        id: 'clkv6uk7h00qul2rs7du3bhdn',
        title: '1808-1886. 19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5u00qal2rsdobhjpjw'
                }
            ]
        }
    },
    {
        id: 'clkv6uk7m00qwl2rs4lalrnxp',
        title: '20th & 21st century. 1886-',
        parents: {
            connect: [
                {
                    id: 'clkv6uk5u00qal2rsdobhjpjw'
                }
            ]
        }
    },
    {
        id: 'clkv6uk9700rel2rs0d5e4aom',
        title: '1580-1640. Spanish dynasty (Sixty years’ captivity)',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8z00rcl2rskq2c59bj'
                }
            ]
        }
    },
    {
        id: 'clkv6uk9v00rgl2rspesp6zeb',
        title: '1640-1816. House of Braganza',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8z00rcl2rskq2c59bj'
                }
            ]
        }
    },
    {
        id: 'clkv6uka900ril2rsebkzoxuv',
        title: '1816-1908',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8z00rcl2rskq2c59bj'
                }
            ]
        }
    },
    {
        id: 'clkv6ukah00rkl2rs42qzfv2x',
        title: '20th & 21st century',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8z00rcl2rskq2c59bj'
                }
            ]
        }
    },
    {
        id: 'clkv6ukam00rml2rsvif91cv0',
        title: 'House of Burgundy, 1095-1383',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8u00ral2rsbvnrbmif'
                }
            ]
        }
    },
    {
        id: 'clkv6ukaq00rol2rscji642a3',
        title: 'Interregnum, 1383-1385',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8u00ral2rsbvnrbmif'
                }
            ]
        }
    },
    {
        id: 'clkv6ukav00rql2rscbywdsyv',
        title: 'House of Aviz, 1385-1580',
        parents: {
            connect: [
                {
                    id: 'clkv6uk8u00ral2rsbvnrbmif'
                }
            ]
        }
    },
    {
        id: 'clkv6ukez00t6l2rsedp2ohwk',
        title: 'First Bulgarian Empire, 681-1018',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdz00swl2rs7wcay8os'
                }
            ]
        }
    },
    {
        id: 'clkv6ukf400t8l2rsmei81wgy',
        title: 'Greek rule 1018-1185',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdz00swl2rs7wcay8os'
                }
            ]
        }
    },
    {
        id: 'clkv6ukfa00tal2rsersuu0j1',
        title: 'Second Bulgarian Empire, 1185-1396',
        parents: {
            connect: [
                {
                    id: 'clkv6ukdz00swl2rs7wcay8os'
                }
            ]
        }
    },
    {
        id: 'clkv6uki900ual2rs50rbh6jo',
        title: 'Cyprian War, 1570-1571. Holy League, 1571',
        parents: {
            connect: [
                {
                    id: 'clkv6ukhn00u0l2rsj6bhhval'
                }
            ]
        }
    },
    {
        id: 'clkv6ukid00ucl2rsfxi50dzc',
        title: 'War of Candia, 1644-1669',
        parents: {
            connect: [
                {
                    id: 'clkv6ukhs00u2l2rse7vjo0i6'
                }
            ]
        }
    },
    {
        id: 'clkv6ukk000v2l2rs1b1aynz3',
        title: 'Yugoslav War, 1991-1995',
        parents: {
            connect: [
                {
                    id: 'clkv6ukjw00v0l2rsvki6bt4u'
                }
            ]
        }
    },
    {
        id: 'clkv6ukln00vul2rsp1b9ac0z',
        title: 'Jews outside of Palestine',
        parents: {
            connect: [
                {
                    id: 'clkv6uklf00vql2rstxx9rt2s'
                }
            ]
        }
    },
    {
        id: 'clkv6ukm900w4l2rsol6box1a',
        title: 'Islands of the Indian Ocean',
        parents: {
            connect: [
                {
                    id: 'clkv6ukm500w2l2rsex9s80ce'
                }
            ]
        }
    },
    {
        id: 'clkv6uko200wsl2rshunja01g',
        title: 'Burma',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6uko600wul2rs0zj7va6c',
        title: 'French Indochina',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukp100x6l2rsj1obrjxh',
        title: 'Thailand (Siam)',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukp900x8l2rs0p7c2c3e',
        title: 'Malaysia. Malay Peninsula. Straits Settlements',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukpt00xgl2rs1k6o4vd9',
        title: 'Singapore',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukpy00xil2rsmc60bjze',
        title: 'Indonesia (Dutch East Indies)',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukqt00xwl2rsjyq7chrm',
        title: 'Brunei',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukqy00xyl2rsrpm9b0v4',
        title: 'Philippines',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukr200y0l2rsmckhfsfm',
        title: 'China',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukrt00ycl2rsf20x8dye',
        title: 'Japan',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukry00yel2rswxdcv5wt',
        title: 'Korea',
        parents: {
            connect: [
                {
                    id: 'clkv6uknx00wql2rsqks6xty9'
                }
            ]
        }
    },
    {
        id: 'clkv6uksy00yul2rsqtxjbrxh',
        title: 'Maghrib. Barbary States',
        parents: {
            connect: [
                {
                    id: 'clkv6ukst00ysl2rsox111plx'
                }
            ]
        }
    },
    {
        id: 'clkv6ukub00zcl2rs7v6e3jaa',
        title: 'Ethiopia (Abyssinia)',
        parents: {
            connect: [
                {
                    id: 'clkv6uku500zal2rs3i3tgcjp'
                }
            ]
        }
    },
    {
        id: 'clkv6ukul00zel2rsflja80ph',
        title: 'Eritrea',
        parents: {
            connect: [
                {
                    id: 'clkv6uku500zal2rs3i3tgcjp'
                }
            ]
        }
    },
    {
        id: 'clkv6ukup00zgl2rstcso7msg',
        title: 'Somalia. Somaliland and adjacent territory',
        parents: {
            connect: [
                {
                    id: 'clkv6uku500zal2rs3i3tgcjp'
                }
            ]
        }
    },
    {
        id: 'clkv6ukuu00zil2rskxhgqysi',
        title: 'Djibouti. French Territory of the Afarsand Issas. French Somaliland',
        parents: {
            connect: [
                {
                    id: 'clkv6uku500zal2rs3i3tgcjp'
                }
            ]
        }
    },
    {
        id: 'clkv6ukw50100l2rs6lly3s5b',
        title: 'Madagascar',
        parents: {
            connect: [
                {
                    id: 'clkv6ukw000zyl2rs9gjgazis'
                }
            ]
        }
    },
    {
        id: 'clkv6ukw90102l2rsaqkq4pkj',
        title: 'Mascarene Islands',
        parents: {
            connect: [
                {
                    id: 'clkv6ukw000zyl2rs9gjgazis'
                }
            ]
        }
    },
    {
        id: 'clkv6ukwd0104l2rscpjt8y44',
        title: 'Mautitius (Ile de France)',
        parents: {
            connect: [
                {
                    id: 'clkv6ukw000zyl2rs9gjgazis'
                }
            ]
        }
    },
    {
        id: 'clkv6ukwh0106l2rsme79g65t',
        title: 'Mayotte',
        parents: {
            connect: [
                {
                    id: 'clkv6ukw000zyl2rs9gjgazis'
                }
            ]
        }
    },
    {
        id: 'clkv6ukwp0108l2rsigia5azt',
        title: 'Reunion',
        parents: {
            connect: [
                {
                    id: 'clkv6ukw000zyl2rs9gjgazis'
                }
            ]
        }
    },
    {
        id: 'clkv6ukwu010al2rs74yv2kj7',
        title: 'Seychelles',
        parents: {
            connect: [
                {
                    id: 'clkv6ukw000zyl2rs9gjgazis'
                }
            ]
        }
    },
    {
        id: 'clkv6ul1x012cl2rsa7aq5shs',
        title: 'Cape Province. Cape of Good Hope',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1r012al2rs5zeji9be'
                }
            ]
        }
    },
    {
        id: 'clkv6ul27012el2rsugeu1opp',
        title: 'Orange Free State. Oranje Vrystaat',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1r012al2rs5zeji9be'
                }
            ]
        }
    },
    {
        id: 'clkv6ul2b012gl2rsz3r15qbf',
        title: 'KwaZulu Natal. Natal',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1r012al2rs5zeji9be'
                }
            ]
        }
    },
    {
        id: 'clkv6ul2g012il2rsz6iiewvn',
        title: 'Transvaal. South African Republic',
        parents: {
            connect: [
                {
                    id: 'clkv6ul1r012al2rs5zeji9be'
                }
            ]
        }
    },
    {
        id: 'clkv6ul7l014kl2rs8a8j6l01',
        title: 'Mayas',
        parents: {
            connect: [
                {
                    id: 'clkv6ul7g014il2rs7d4ycrs5'
                }
            ]
        }
    },
    {
        id: 'clkv6ul7q014ml2rs805iqftn',
        title: 'Belize',
        parents: {
            connect: [
                {
                    id: 'clkv6ul7g014il2rs7d4ycrs5'
                }
            ]
        }
    },
    {
        id: 'clkv6ul7u014ol2rsvsk8ypwi',
        title: 'Guatemala',
        parents: {
            connect: [
                {
                    id: 'clkv6ul7g014il2rs7d4ycrs5'
                }
            ]
        }
    },
    {
        id: 'clkv6ul7z014ql2rszxtoz5jw',
        title: 'Salvador (El Salvador)',
        parents: {
            connect: [
                {
                    id: 'clkv6ul7g014il2rs7d4ycrs5'
                }
            ]
        }
    },
    {
        id: 'clkv6ul87014sl2rsng0g0l4r',
        title: 'Honduras',
        parents: {
            connect: [
                {
                    id: 'clkv6ul7g014il2rs7d4ycrs5'
                }
            ]
        }
    },
    {
        id: 'clkv6ul8d014ul2rs2tsk5nnp',
        title: 'Nicaragua',
        parents: {
            connect: [
                {
                    id: 'clkv6ul7g014il2rs7d4ycrs5'
                }
            ]
        }
    },
    {
        id: 'clkv6ul8k014wl2rseg0ipvih',
        title: 'Costa Rica',
        parents: {
            connect: [
                {
                    id: 'clkv6ul7g014il2rs7d4ycrs5'
                }
            ]
        }
    },
    {
        id: 'clkv6ul8o014yl2rs4cs622ea',
        title: 'Panama',
        parents: {
            connect: [
                {
                    id: 'clkv6ul7g014il2rs7d4ycrs5'
                }
            ]
        }
    },
    {
        id: 'clkv6ul8t0150l2rs6lmoj1mz',
        title: 'Bermudas',
        parents: {
            connect: [
                {
                    id: 'clkv6ukv000zkl2rsf67lw7g3'
                }
            ]
        }
    },
    {
        id: 'clkv6ul8y0152l2rs16tapoar',
        title: 'Bahamas',
        parents: {
            connect: [
                {
                    id: 'clkv6ukv000zkl2rsf67lw7g3'
                }
            ]
        }
    },
    {
        id: 'clkv6ul940154l2rsdabbntjh',
        title: 'Greater Antilles',
        parents: {
            connect: [
                {
                    id: 'clkv6ukv000zkl2rsf67lw7g3'
                }
            ]
        }
    },
    {
        id: 'clkv6ul980156l2rshqjjn6mv',
        title: 'Lesser Antilles',
        parents: {
            connect: [
                {
                    id: 'clkv6ukv000zkl2rsf67lw7g3'
                }
            ]
        }
    },
    {
        id: 'clkv6ul9x015gl2rszhbtqtj3',
        title: 'Guyana. British Guiana',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9s015el2rs6l4787in'
                }
            ]
        }
    },
    {
        id: 'clkv6ula1015il2rsul013xqt',
        title: 'Surinam',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9s015el2rs6l4787in'
                }
            ]
        }
    },
    {
        id: 'clkv6ula6015kl2rs2hnro72p',
        title: 'French Guiana',
        parents: {
            connect: [
                {
                    id: 'clkv6ul9s015el2rs6l4787in'
                }
            ]
        }
    },
    {
        id: 'clkv6umg701lel2rsspppgoem',
        title: 'Environmental pollution including soil pollution, air pollution, noise pollution',
        parents: {
            connect: [
                {
                    id: 'clkv6uiw5008yl2rshxpbd39q'
                },
                {
                    id: 'clkv6uiza00a4l2rs9xhxgjx5'
                }
            ]
        }
    },
    {
        id: 'clkv6un2x01tql2rs777dy8iv',
        title: 'antibiotic',
        parents: {
            connect: [
                {
                    id: 'clkv6un2s01tol2rs5rdrr4di'
                }
            ]
        }
    },
    {
        id: 'clkv6un3b01twl2rs7ua7zrn8',
        title: 'biological tissue',
        parents: {
            connect: [
                {
                    id: 'clkv6un2s01tol2rs5rdrr4di'
                }
            ]
        }
    },
    {
        id: 'clkv6un5101uil2rsvf2qne9d',
        title: 'delamination',
        parents: {
            connect: [
                {
                    id: 'clkv6un4u01ugl2rs4wlv8kzt'
                }
            ]
        }
    },
    {
        id: 'clkv6un5k01uql2rs8qfzsc6q',
        title: 'environmental problem',
        parents: {
            connect: [
                {
                    id: 'clkv6un4u01ugl2rs4wlv8kzt'
                }
            ]
        }
    },
    {
        id: 'clkv6un8701vil2rs8vmevdso',
        title: 'aerosol',
        parents: {
            connect: [
                {
                    id: 'clkv6un8101vgl2rs7eo1qvvv'
                }
            ]
        }
    },
    {
        id: 'clkv6un8c01vkl2rs9wp4vj8e',
        title: 'aircraft structures',
        parents: {
            connect: [
                {
                    id: 'clkv6un8101vgl2rs7eo1qvvv'
                }
            ]
        }
    },
    {
        id: 'clkv6un8h01vml2rsy3mqjqyc',
        title: 'wind turbine',
        parents: {
            connect: [
                {
                    id: 'clkv6un8101vgl2rs7eo1qvvv'
                }
            ]
        }
    },
    {
        id: 'clkv6un8u01vsl2rstdz9xrph',
        title: 'concrete structures',
        parents: {
            connect: [
                {
                    id: 'clkv6un8q01vql2rsulf4damp'
                }
            ]
        }
    },
    {
        id: 'clkv6un9u01w6l2rswe44nz3o',
        title: 'ball bearings',
        parents: {
            connect: [
                {
                    id: 'clkv6un9q01w4l2rs8adq71eb'
                }
            ]
        }
    },
    {
        id: 'clkv6un9y01w8l2rsd11885jp',
        title: 'solid lubrication',
        parents: {
            connect: [
                {
                    id: 'clkv6un9q01w4l2rs8adq71eb'
                }
            ]
        }
    },
    {
        id: 'clkv6una801wcl2rsgto9i60m',
        title: 'optical fiber',
        parents: {
            connect: [
                {
                    id: 'clkv6una301wal2rsfmt7h6g0'
                }
            ]
        }
    },
    {
        id: 'clkv6unad01wel2rs8f4fwisq',
        title: 'textile',
        parents: {
            connect: [
                {
                    id: 'clkv6una301wal2rsfmt7h6g0'
                }
            ]
        }
    },
    {
        id: 'clkv6unas01wkl2rsq4wx9gzr',
        title: 'ceramics structural',
        parents: {
            connect: [
                {
                    id: 'clkv6unan01wil2rs94ep39e7'
                }
            ]
        }
    },
    {
        id: 'clkv6unbd01wul2rsq63p837q',
        title: 'reinforced polymer',
        parents: {
            connect: [
                {
                    id: 'clkv6unb901wsl2rsceclj2mz'
                }
            ]
        }
    },
    {
        id: 'clkv6unbu01x2l2rsrr98uz19',
        title: 'material construction',
        parents: {
            connect: [
                {
                    id: 'clkv6unbq01x0l2rsuc1i3gqe'
                }
            ]
        }
    },
    {
        id: 'clkv6uncg01xal2rsxos2v1em',
        title: 'metal matrix',
        parents: {
            connect: [
                {
                    id: 'clkv6uncc01x8l2rsa0tvx3hd'
                }
            ]
        }
    },
    {
        id: 'clkv6uncp01xel2rstvow2q4t',
        title: 'galvanic corrosion',
        parents: {
            connect: [
                {
                    id: 'clkv6uncl01xcl2rsmksz3kpq'
                }
            ]
        }
    },
    {
        id: 'clkv6uncu01xgl2rsaar936ok',
        title: 'magnetic properties',
        parents: {
            connect: [
                {
                    id: 'clkv6uncl01xcl2rsmksz3kpq'
                }
            ]
        }
    },
    {
        id: 'clkv6undg01xql2rsin7vw0w2',
        title: 'metals alloys',
        parents: {
            connect: [
                {
                    id: 'clkv6uncl01xcl2rsmksz3kpq'
                }
            ]
        }
    },
    {
        id: 'clkv6unep01yal2rsf6c457bn',
        title: 'applications multiferroic',
        parents: {
            connect: [
                {
                    id: 'clkv6unel01y8l2rslox8udyp'
                }
            ]
        }
    },
    {
        id: 'clkv6uneu01ycl2rse9f2xejb',
        title: 'refractory materials',
        parents: {
            connect: [
                {
                    id: 'clkv6unel01y8l2rslox8udyp'
                }
            ]
        }
    },
    {
        id: 'clkv6unf401ygl2rsok2ovg1x',
        title: 'biodegradable',
        parents: {
            connect: [
                {
                    id: 'clkv6unez01yel2rsgiwgal4o'
                }
            ]
        }
    },
    {
        id: 'clkv6unf801yil2rsf3e3rcc8',
        title: 'conjugate polymer',
        parents: {
            connect: [
                {
                    id: 'clkv6unez01yel2rsgiwgal4o'
                }
            ]
        }
    },
    {
        id: 'clkv6unfd01ykl2rsntgj5dc0',
        title: 'photopolymers crucial',
        parents: {
            connect: [
                {
                    id: 'clkv6unez01yel2rsgiwgal4o'
                }
            ]
        }
    },
    {
        id: 'clkv6unfi01yml2rscpzupv6l',
        title: 'polyelectrolytes',
        parents: {
            connect: [
                {
                    id: 'clkv6unez01yel2rsgiwgal4o'
                }
            ]
        }
    },
    {
        id: 'clkv6unfz01yul2rs73io6kvv',
        title: 'polyurethane foam',
        parents: {
            connect: [
                {
                    id: 'clkv6unez01yel2rsgiwgal4o'
                }
            ]
        }
    },
    {
        id: 'clkv6ung801yyl2rswu8rr4e4',
        title: 'processes polymer',
        parents: {
            connect: [
                {
                    id: 'clkv6unez01yel2rsgiwgal4o'
                }
            ]
        }
    },
    {
        id: 'clkv6ungj01z2l2rsxwj2nev4',
        title: 'coatings deposited',
        parents: {
            connect: [
                {
                    id: 'clkv6ungc01z0l2rs2ue6tacb'
                }
            ]
        }
    },
    {
        id: 'clkv6unh201zal2rsemoa11c9',
        title: 'membrane',
        parents: {
            connect: [
                {
                    id: 'clkv6ungc01z0l2rs2ue6tacb'
                }
            ]
        }
    },
    {
        id: 'clkv6unhp01zil2rsmdha9x8f',
        title: 'lithium batteries',
        parents: {
            connect: [
                {
                    id: 'clkv6unhk01zgl2rslgq0fyky'
                }
            ]
        }
    },
    {
        id: 'clkv6unl7020ml2rsjpkxihau',
        title: 'thermal energy',
        parents: {
            connect: [
                {
                    id: 'clkv6unhk01zgl2rslgq0fyky'
                }
            ]
        }
    },
    {
        id: 'clkv6unrr0234l2rsinwyynf6',
        title: 'epoxy based',
        parents: {
            connect: [
                {
                    id: 'clkv6unrk0232l2rsgqsomxtp'
                }
            ]
        }
    },
    {
        id: 'clkv6uns00238l2rs8qfb7xxf',
        title: 'graphite',
        parents: {
            connect: [
                {
                    id: 'clkv6unrk0232l2rsgqsomxtp'
                }
            ]
        }
    },
    {
        id: 'clkv6uns4023al2rsf8xb7fw1',
        title: 'tribological',
        parents: {
            connect: [
                {
                    id: 'clkv6unrk0232l2rsgqsomxtp'
                }
            ]
        }
    },
    {
        id: 'clkv6unst023gl2rs5d1xwfd2',
        title: 'zirconia',
        parents: {
            connect: [
                {
                    id: 'clkv6unrk0232l2rsgqsomxtp'
                }
            ]
        }
    },
    {
        id: 'clkv6unt7023kl2rspu95t30s',
        title: 'crystallization',
        parents: {
            connect: [
                {
                    id: 'clkv6unsz023il2rs6dmlom18'
                }
            ]
        }
    },
    {
        id: 'clkv6unuf0244l2rsr7l800qm',
        title: 'oxide',
        parents: {
            connect: [
                {
                    id: 'clkv6unsz023il2rs6dmlom18'
                }
            ]
        }
    },
    {
        id: 'clkv6unw6024wl2rsl6yti6oh',
        title: 'plasmonic',
        parents: {
            connect: [
                {
                    id: 'clkv6unsz023il2rs6dmlom18'
                }
            ]
        }
    },
    {
        id: 'clkv6unwu0256l2rsakh2hern',
        title: 'diode oled',
        parents: {
            connect: [
                {
                    id: 'clkv6unwp0254l2rsy0xyl2yt'
                }
            ]
        }
    },
    {
        id: 'clkv6unx3025al2rsec0sadn8',
        title: 'nanotube',
        parents: {
            connect: [
                {
                    id: 'clkv6unwp0254l2rsy0xyl2yt'
                }
            ]
        }
    },
    {
        id: 'clkv6uny7025sl2rsrmy3sf63',
        title: 'semiconductor material',
        parents: {
            connect: [
                {
                    id: 'clkv6unwp0254l2rsy0xyl2yt'
                }
            ]
        }
    },
    {
        id: 'clkv6uo1a0272l2rsnri3sp4n',
        title: 'silicon carbide',
        parents: {
            connect: [
                {
                    id: 'clkv6unwp0254l2rsy0xyl2yt'
                }
            ]
        }
    },
    {
        id: 'clkv6uo1v0278l2rshu285sp1',
        title: 'artificial photosynthesis',
        parents: {
            connect: [
                {
                    id: 'clkv6uo1j0276l2rs1zk3w1r2'
                }
            ]
        }
    },
    {
        id: 'clkv6uo21027al2rsx4o96p5k',
        title: 'luminescence',
        parents: {
            connect: [
                {
                    id: 'clkv6uo1j0276l2rs1zk3w1r2'
                }
            ]
        }
    },
    {
        id: 'clkv6uo26027cl2rs9kzn2one',
        title: 'optical material',
        parents: {
            connect: [
                {
                    id: 'clkv6uo1j0276l2rs1zk3w1r2'
                }
            ]
        }
    },
    {
        id: 'clkv6uo4k028el2rsxn8w0bgb',
        title: 'photocatalytic degradation',
        parents: {
            connect: [
                {
                    id: 'clkv6uo1j0276l2rs1zk3w1r2'
                }
            ]
        }
    },
    {
        id: 'clkv6uo4o028gl2rs6fxft3w7',
        title: 'photodetector',
        parents: {
            connect: [
                {
                    id: 'clkv6uo1j0276l2rs1zk3w1r2'
                }
            ]
        }
    },
    {
        id: 'clkv6uo50028il2rsv9r28b4e',
        title: 'photoelectrochemical activities',
        parents: {
            connect: [
                {
                    id: 'clkv6uo1j0276l2rs1zk3w1r2'
                }
            ]
        }
    },
    {
        id: 'clkv6uo5a028ml2rsnunccr19',
        title: 'sensor',
        parents: {
            connect: [
                {
                    id: 'clkv6uo55028kl2rshlqwqg0f'
                }
            ]
        }
    },
    {
        id: 'clkv6uo5f028ol2rscfini3z3',
        title: 'vibration',
        parents: {
            connect: [
                {
                    id: 'clkv6uo55028kl2rshlqwqg0f'
                }
            ]
        }
    },
    {
        id: 'clkv6uo5n028sl2rszjc9g207',
        title: 'pelvic',
        parents: {
            connect: [
                {
                    id: 'clkv6umz901s8l2rseyrdrtwf'
                }
            ]
        }
    },
    {
        id: 'clkv6uo6a0292l2rs299k3boy',
        title: 'infection',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uo6o0298l2rsmmqezhsa',
        title: 'access antiretroviral',
        parents: {
            connect: [
                {
                    id: 'clkv6uo660290l2rsphjr0e9s'
                }
            ]
        }
    },
    {
        id: 'clkv6uo76029gl2rsnl5s2x40',
        title: 'vulvar',
        parents: {
            connect: [
                {
                    id: 'clkv6umz901s8l2rseyrdrtwf'
                }
            ]
        }
    },
    {
        id: 'clkv6uo7k029ml2rsqrhdlzv3',
        title: 'communicable diseases',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uo7p029ol2rsiotco0wf',
        title: 'growth factor',
        parents: {
            connect: [
                {
                    id: 'clkv6uo7f029kl2rst3h5s53t'
                }
            ]
        }
    },
    {
        id: 'clkv6uo88029wl2rsrikc5rl4',
        title: 'alcohol consumption',
        parents: {
            connect: [
                {
                    id: 'clkv6uocq02byl2rs1l4o0jln'
                }
            ]
        }
    },
    {
        id: 'clkv6uo8d029yl2rsbmonp2w1',
        title: 'aids',
        parents: {
            connect: [
                {
                    id: 'clkv6uo660290l2rsphjr0e9s'
                }
            ]
        }
    },
    {
        id: 'clkv6uo8u02a6l2rske7c0fy5',
        title: 'carcinogenic hazardous',
        parents: {
            connect: [
                {
                    id: 'clkv6uo7f029kl2rst3h5s53t'
                },
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uo9c02ael2rs2u3d8we2',
        title: 'progressive disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uoai02ayl2rs5cv3xhta',
        title: 'influenza',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uoas02b2l2rsofcfmccp',
        title: 'heavy metal',
        parents: {
            connect: [
                {
                    id: 'clkv6uo7f029kl2rst3h5s53t'
                }
            ]
        }
    },
    {
        id: 'clkv6uob102b6l2rsz3dqlsz4',
        title: 'hypoxia typical',
        parents: {
            connect: [
                {
                    id: 'clkv6uo7f029kl2rst3h5s53t'
                }
            ]
        }
    },
    {
        id: 'clkv6uobe02bcl2rsp9zadb4p',
        title: 'syphilis',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uobn02bgl2rs4vy4ude9',
        title: 'radiation induced',
        parents: {
            connect: [
                {
                    id: 'clkv6uofa02d0l2rsjtt675qi'
                }
            ]
        }
    },
    {
        id: 'clkv6uobw02bkl2rs1mjg6ydw',
        title: 'leptospirosis common',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uoc002bml2rsvb7g7qv6',
        title: 'radiotherapy',
        parents: {
            connect: [
                {
                    id: 'clkv6uofa02d0l2rsjtt675qi'
                }
            ]
        }
    },
    {
        id: 'clkv6uocz02c2l2rsriukh2qm',
        title: 'cocaine',
        parents: {
            connect: [
                {
                    id: 'clkv6uocq02byl2rs1l4o0jln'
                }
            ]
        }
    },
    {
        id: 'clkv6uod302c4l2rs7ml19z3s',
        title: 'malaria',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uod702c6l2rs3thozxnq',
        title: 'zoonotic disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uodz02cil2rskk39wpsp',
        title: 'estrogen receptor',
        parents: {
            connect: [
                {
                    id: 'clkv6uodl02ccl2rssyjo1p3w'
                }
            ]
        }
    },
    {
        id: 'clkv6uoef02col2rs67rywhdr',
        title: 'trypanosoma',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uofg02d2l2rsontpg2cb',
        title: 'nosocomial infections',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uofu02d8l2rssloc7lem',
        title: 'pathogenic microbial',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uogr02dml2rsarzt16pg',
        title: 'incontinence',
        parents: {
            connect: [
                {
                    id: 'clkv6umz501s6l2rswuuw68b1'
                },
                {
                    id: 'clkv6umz901s8l2rseyrdrtwf'
                }
            ]
        }
    },
    {
        id: 'clkv6uogw02dol2rsa10ttaur',
        title: 'inflammatory disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umnz01oal2rsssnv8qfa'
                }
            ]
        }
    },
    {
        id: 'clkv6uoh102dql2rsnfqb7fin',
        title: 'diseases common',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uoh502dsl2rshzf2zch0',
        title: 'immunodeficiency',
        parents: {
            connect: [
                {
                    id: 'clkv6umy701rul2rscu18o7ue'
                },
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uohj02dyl2rswqu3adtf',
        title: 'antibiotic resistant',
        parents: {
            connect: [
                {
                    id: 'clkv6uoia02eal2rst23545se'
                }
            ]
        }
    },
    {
        id: 'clkv6uoi502e8l2rs450jz3m2',
        title: 'cervical spine',
        parents: {
            connect: [
                {
                    id: 'clkv6umzj01scl2rslzy4apkr'
                }
            ]
        }
    },
    {
        id: 'clkv6uoij02eel2rs7dvgn9cm',
        title: 'food insecurity',
        parents: {
            connect: [
                {
                    id: 'clkv6uium008gl2rs3d7ene92'
                },
                {
                    id: 'clkv6uogi02dil2rsphm9e1sa'
                }
            ]
        }
    },
    {
        id: 'clkv6uoiw02eil2rsoc0iu7nv',
        title: 'disease burden',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uoj402ekl2rsfvwz3jf1',
        title: 'disease china',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uok602eyl2rszou5l0zj',
        title: 'bone diseases',
        parents: {
            connect: [
                {
                    id: 'clkv6umzj01scl2rslzy4apkr'
                }
            ]
        }
    },
    {
        id: 'clkv6uokp02f2l2rsqvuovqr9',
        title: 'hernia',
        parents: {
            connect: [
                {
                    id: 'clkv6uokb02f0l2rs73az8t98'
                }
            ]
        }
    },
    {
        id: 'clkv6uomi02fql2rsiitnrxm6',
        title: 'chromosomal',
        parents: {
            connect: [
                {
                    id: 'clkv6uome02fol2rsxrp5oe3x'
                }
            ]
        }
    },
    {
        id: 'clkv6uomr02ful2rscynebthv',
        title: 'fusion gene',
        parents: {
            connect: [
                {
                    id: 'clkv6uome02fol2rsxrp5oe3x'
                }
            ]
        }
    },
    {
        id: 'clkv6uomx02fwl2rsxgo7whpz',
        title: 'germline mutations',
        parents: {
            connect: [
                {
                    id: 'clkv6uome02fol2rsxrp5oe3x'
                }
            ]
        }
    },
    {
        id: 'clkv6uon102fyl2rsq18xnbbo',
        title: 'macrophages',
        parents: {
            connect: [
                {
                    id: 'clkv6uoma02fml2rsc5py1ouo'
                }
            ]
        }
    },
    {
        id: 'clkv6uonx02g8l2rsrhhzrrrw',
        title: 'liver transplantation',
        parents: {
            connect: [
                {
                    id: 'clkv6uonr02g6l2rsutlrni6t'
                }
            ]
        }
    },
    {
        id: 'clkv6uoo102gal2rs7kjg8cni',
        title: 'marrow transplantation',
        parents: {
            connect: [
                {
                    id: 'clkv6uonr02g6l2rsutlrni6t'
                }
            ]
        }
    },
    {
        id: 'clkv6uoo602gcl2rs8hxna8oo',
        title: 'stem cell',
        parents: {
            connect: [
                {
                    id: 'clkv6uoma02fml2rsc5py1ouo'
                }
            ]
        }
    },
    {
        id: 'clkv6uoor02gil2rsil9pvxhe',
        title: 'leiomyoma common',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uoox02gkl2rso7suhj37',
        title: 'thyroid cancer',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uopl02gul2rs2034ap9f',
        title: 'tumor cancer',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uoqd02h6l2rs3bzfaeyw',
        title: 'common neoplasm',
        parents: {
            connect: [
                {
                    id: 'clkv6uoq802h4l2rs3w1v173j'
                }
            ]
        }
    },
    {
        id: 'clkv6uoqh02h8l2rs8y9eqfzt',
        title: 'epithelial tumors',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uoqm02hal2rsujdb2dn9',
        title: 'neuroblastoma',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uoqr02hcl2rstrrwfceb',
        title: 'neuroendocrine tumors',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uor002hgl2rs6m3aw55e',
        title: 'breast cancer',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uora02hkl2rsryxlf4ow',
        title: 'cancer colorectal',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uory02hsl2rsscne8cww',
        title: 'cancer treatment',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uos702hwl2rsn2hol8i8',
        title: 'cancer worldwide',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uosb02hyl2rsp0aghtw1',
        title: 'cell carcinoma',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uosg02i0l2rsptbn68x8',
        title: 'tumor rare',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uosl02i2l2rs8whfnaoa',
        title: 'deaths cancers',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uosq02i4l2rs33v94hh2',
        title: 'lymphoma',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uotq02iil2rsxvgft5zm',
        title: 'myofibroblastomas unusual',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uouh02isl2rss5qd5xsl',
        title: 'neck cancer',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uoup02iwl2rs5zayv252',
        title: 'benign prostatic',
        parents: {
            connect: [
                {
                    id: 'clkv6uoul02iul2rsepzzbnkk'
                }
            ]
        }
    },
    {
        id: 'clkv6uovb02j6l2rs9ib1gnfm',
        title: 'cardiovascular disorder',
        parents: {
            connect: [
                {
                    id: 'clkv6umyu01s2l2rs70m0wr8x'
                }
            ]
        }
    },
    {
        id: 'clkv6uowh02jil2rsrdkudxvp',
        title: 'angiogenesis',
        parents: {
            connect: [
                {
                    id: 'clkv6uom502fkl2rse1at3abi'
                }
            ]
        }
    },
    {
        id: 'clkv6uoxh02jyl2rsa2b0u0qw',
        title: 'kidney disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umz901s8l2rseyrdrtwf'
                }
            ]
        }
    },
    {
        id: 'clkv6uoxl02k0l2rs2phvhusw',
        title: 'anemia',
        parents: {
            connect: [
                {
                    id: 'clkv6umyg01ryl2rsmidggye5'
                }
            ]
        }
    },
    {
        id: 'clkv6uoyw02kkl2rspsgbdrw7',
        title: 'patients diabetes',
        parents: {
            connect: [
                {
                    id: 'clkv6umnz01oal2rsssnv8qfa'
                }
            ]
        }
    },
    {
        id: 'clkv6uoz102kml2rsl1b9suu4',
        title: 'hypertensive',
        parents: {
            connect: [
                {
                    id: 'clkv6umnz01oal2rsssnv8qfa'
                },
                {
                    id: 'clkv6umyu01s2l2rs70m0wr8x'
                }
            ]
        }
    },
    {
        id: 'clkv6uozj02kul2rswyuk3gqr',
        title: 'hyperparathyroidism',
        parents: {
            connect: [
                {
                    id: 'clkv6umyp01s0l2rsar5yowv1'
                }
            ]
        }
    },
    {
        id: 'clkv6uozz02kyl2rsfmvpvbwr',
        title: 'metabolic disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umnz01oal2rsssnv8qfa'
                }
            ]
        }
    },
    {
        id: 'clkv6up6202n0l2rso8n4nog3',
        title: 'sepsis',
        parents: {
            connect: [
                {
                    id: 'clkv6up5w02myl2rswgbo5vac'
                }
            ]
        }
    },
    {
        id: 'clkv6up6802n2l2rsevmmuy29',
        title: 'meningitis',
        parents: {
            connect: [
                {
                    id: 'clkv6up5r02mwl2rs810zbtzc'
                }
            ]
        }
    },
    {
        id: 'clkv6up6n02n8l2rspbsfxoac',
        title: 'chronic obstructive',
        parents: {
            connect: [
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                }
            ]
        }
    },
    {
        id: 'clkv6up7002nel2rszcc66wtf',
        title: 'allergic rhinitis',
        parents: {
            connect: [
                {
                    id: 'clkv6umy701rul2rscu18o7ue'
                }
            ]
        }
    },
    {
        id: 'clkv6up7502ngl2rsfzv9lp7c',
        title: 'sclerosis',
        parents: {
            connect: [
                {
                    id: 'clkv6umze01sal2rs2dydct7q'
                }
            ]
        }
    },
    {
        id: 'clkv6up7902nil2rsxe1kcnjj',
        title: 'disease huntington',
        parents: {
            connect: [
                {
                    id: 'clkv6uis5007ml2rsmdas1r2p'
                },
                {
                    id: 'clkv6un2k01tkl2rs4gdwxmfe'
                }
            ]
        }
    },
    {
        id: 'clkv6up7j02nkl2rsp49dqeaw',
        title: 'eosinophilia',
        parents: {
            connect: [
                {
                    id: 'clkv6umyg01ryl2rsmidggye5'
                }
            ]
        }
    },
    {
        id: 'clkv6up8502nul2rs9spmedjt',
        title: 'liver disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umz501s6l2rswuuw68b1'
                }
            ]
        }
    },
    {
        id: 'clkv6up8902nwl2rs9141f8en',
        title: 'bowel syndrome',
        parents: {
            connect: [
                {
                    id: 'clkv6umz501s6l2rswuuw68b1'
                }
            ]
        }
    },
    {
        id: 'clkv6up8m02o2l2rsy8fcml9z',
        title: 'pancreatic',
        parents: {
            connect: [
                {
                    id: 'clkv6umz501s6l2rswuuw68b1'
                }
            ]
        }
    },
    {
        id: 'clkv6up8t02o4l2rsk1q1tx8k',
        title: 'esophageal large',
        parents: {
            connect: [
                {
                    id: 'clkv6umz501s6l2rswuuw68b1'
                }
            ]
        }
    },
    {
        id: 'clkv6up8y02o6l2rs0mgn8ksy',
        title: 'gallbladder disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umz501s6l2rswuuw68b1'
                }
            ]
        }
    },
    {
        id: 'clkv6upae02oul2rsu8ogbgee',
        title: 'brain injury',
        parents: {
            connect: [
                {
                    id: 'clkv6up9x02oml2rs32d8pixo'
                }
            ]
        }
    },
    {
        id: 'clkv6upai02owl2rs13islil4',
        title: 'disease dementia',
        parents: {
            connect: [
                {
                    id: 'clkv6un2k01tkl2rs4gdwxmfe'
                }
            ]
        }
    },
    {
        id: 'clkv6upam02oyl2rs3sxqnb25',
        title: 'deficiency',
        parents: {
            connect: [
                {
                    id: 'clkv6umyc01rwl2rsnvh7hu4a'
                }
            ]
        }
    },
    {
        id: 'clkv6upaq02p0l2rseg34tr8x',
        title: 'deficiency disorder',
        parents: {
            connect: [
                {
                    id: 'clkv6umyc01rwl2rsnvh7hu4a'
                }
            ]
        }
    },
    {
        id: 'clkv6upb902p8l2rsntvucr4m',
        title: 'anxiety disorders',
        parents: {
            connect: [
                {
                    id: 'clkv6upb402p6l2rsdjo5ph6x'
                }
            ]
        }
    },
    {
        id: 'clkv6upbn02pcl2rsza39blax',
        title: 'depression',
        parents: {
            connect: [
                {
                    id: 'clkv6upbe02pal2rsogzt7ino'
                }
            ]
        }
    },
    {
        id: 'clkv6upc702pkl2rscm65z5hx',
        title: 'parkinsonism',
        parents: {
            connect: [
                {
                    id: 'clkv6un2k01tkl2rs4gdwxmfe'
                }
            ]
        }
    },
    {
        id: 'clkv6upcc02pml2rswoovetau',
        title: 'disease alzheimer',
        parents: {
            connect: [
                {
                    id: 'clkv6un2k01tkl2rs4gdwxmfe'
                }
            ]
        }
    },
    {
        id: 'clkv6upco02pql2rs8crm697r',
        title: 'epilepsy considerable',
        parents: {
            connect: [
                {
                    id: 'clkv6up9x02oml2rs32d8pixo'
                }
            ]
        }
    },
    {
        id: 'clkv6upct02psl2rsldh69fmb',
        title: 'encephalopathy',
        parents: {
            connect: [
                {
                    id: 'clkv6up9x02oml2rs32d8pixo'
                }
            ]
        }
    },
    {
        id: 'clkv6upcx02pul2rsfn0nfimb',
        title: 'neuropathic condition',
        parents: {
            connect: [
                {
                    id: 'clkv6up9x02oml2rs32d8pixo'
                }
            ]
        }
    },
    {
        id: 'clkv6updd02q0l2rsvbnyej2e',
        title: 'cord injury',
        parents: {
            connect: [
                {
                    id: 'clkv6upd802pyl2rsd285qqyz'
                }
            ]
        }
    },
    {
        id: 'clkv6upf002qml2rsjrdxehbq',
        title: 'syndrome characterized',
        parents: {
            connect: [
                {
                    id: 'clkv6up9x02oml2rs32d8pixo'
                }
            ]
        }
    },
    {
        id: 'clkv6upfs02qul2rsx4edlare',
        title: 'dyskinesia',
        parents: {
            connect: [
                {
                    id: 'clkv6un2k01tkl2rs4gdwxmfe'
                }
            ]
        }
    },
    {
        id: 'clkv6upg202qwl2rs2ra5qdr7',
        title: 'musculoskeletal disorders',
        parents: {
            connect: [
                {
                    id: 'clkv6umzj01scl2rslzy4apkr'
                }
            ]
        }
    },
    {
        id: 'clkv6upgi02r2l2rsbtabzxmh',
        title: 'disease childhood',
        parents: {
            connect: [
                {
                    id: 'clkv6upgd02r0l2rs2bxvtrht'
                }
            ]
        }
    },
    {
        id: 'clkv6upgt02r6l2rsgv0bs96a',
        title: 'pulmonary disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                }
            ]
        }
    },
    {
        id: 'clkv6upgx02r8l2rs262pgwor',
        title: 'allergic asthma',
        parents: {
            connect: [
                {
                    id: 'clkv6umy701rul2rscu18o7ue'
                },
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                }
            ]
        }
    },
    {
        id: 'clkv6uph802rcl2rsa206xdf0',
        title: 'bronchial asthma',
        parents: {
            connect: [
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                }
            ]
        }
    },
    {
        id: 'clkv6uphk02rel2rsjjtgqw04',
        title: 'airway obstruction',
        parents: {
            connect: [
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                }
            ]
        }
    },
    {
        id: 'clkv6uphq02rgl2rs4x09eakc',
        title: 'bronchiolitis',
        parents: {
            connect: [
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                }
            ]
        }
    },
    {
        id: 'clkv6upi802rol2rsn1hd2rx5',
        title: 'respiratory disease',
        parents: {
            connect: [
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                }
            ]
        }
    },
    {
        id: 'clkv6upid02rql2rs6g84w96x',
        title: 'acute respiratory',
        parents: {
            connect: [
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                }
            ]
        }
    },
    {
        id: 'clkv6upiy02ryl2rs89utbtc0',
        title: 'tracheomalacia',
        parents: {
            connect: [
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                }
            ]
        }
    },
    {
        id: 'clkv6upjv02sal2rswqdmjhw9',
        title: 'mast cells',
        parents: {
            connect: [
                {
                    id: 'clkv6umy701rul2rscu18o7ue'
                }
            ]
        }
    },
    {
        id: 'clkv6uplu02t4l2rs3xdyiz7x',
        title: 'children adolescents',
        parents: {
            connect: [
                {
                    id: 'clkv6uplp02t2l2rsrdbcs7da'
                }
            ]
        }
    },
    {
        id: 'clkv6uq4m030sl2rshvcop9hj',
        title: 'crucial ecosystem',
        parents: {
            connect: [
                {
                    id: 'clkv6uiyx009yl2rs5jwx6s2x'
                },
                {
                    id: 'clkv6uq5x031cl2rsl1a6892a'
                }
            ]
        }
    },
    {
        id: 'clkv6uq4q030ul2rsrngk7zf4',
        title: 'marine environment',
        parents: {
            connect: [
                {
                    id: 'clkv6uiyx009yl2rs5jwx6s2x'
                },
                {
                    id: 'clkv6uq5x031cl2rsl1a6892a'
                }
            ]
        }
    },
    {
        id: 'clkv6uq4u030wl2rstw995ijo',
        title: 'terrestrial ecosystems',
        parents: {
            connect: [
                {
                    id: 'clkv6uiyx009yl2rs5jwx6s2x'
                },
                {
                    id: 'clkv6uq5x031cl2rsl1a6892a'
                }
            ]
        }
    },
    {
        id: 'clkv6uq4y030yl2rsdbtjai3p',
        title: 'wetland',
        parents: {
            connect: [
                {
                    id: 'clkv6uiyx009yl2rs5jwx6s2x'
                },
                {
                    id: 'clkv6uq5x031cl2rsl1a6892a'
                }
            ]
        }
    },
    {
        id: 'clkv6uq62031el2rsk8gjheo0',
        title: 'climate',
        parents: {
            connect: [
                {
                    id: 'clkv6uiyx009yl2rs5jwx6s2x'
                },
                {
                    id: 'clkv6uq5x031cl2rsl1a6892a'
                }
            ]
        }
    },
    {
        id: 'clkv6uq6o031ol2rsdmyhiamp',
        title: 'carbon dioxide',
        parents: {
            connect: [
                {
                    id: 'clkv6uq6k031ml2rs1d91rng2'
                }
            ]
        }
    },
    {
        id: 'clkv6uq75031wl2rs9i17nktz',
        title: 'nitrogen deposition',
        parents: {
            connect: [
                {
                    id: 'clkv6uq6k031ml2rs1d91rng2'
                }
            ]
        }
    },
    {
        id: 'clkv6uq7i0322l2rsweut4bpi',
        title: 'soil',
        parents: {
            connect: [
                {
                    id: 'clkv6uq6f031kl2rsmrms8ske'
                }
            ]
        }
    },
    {
        id: 'clwueaapw00003s9olja0g7pw',
        title: 'Machine Learning',
        parents: {
            connect: [
                {
                    id: 'clkv6umqc01p6l2rs30lyrpgn'
                }
            ]
        }
    },
    {
        id: 'clkv6upci02pol2rsvk291d6s',
        title: 'Cognitive Impairment',
        parents: {
            connect: [
                {
                    id: 'clkv6umxu01rol2rs0o2htp3w'
                },
                {
                    id: 'clkv6un2k01tkl2rs4gdwxmfe'
                }
            ]
        }
    },
    {
        id: 'clkv6uofl02d4l2rs02qblfb8',
        title: 'Epidemic and Pandemic',
        parents: {
            connect: [
                {
                    id: 'clkv6uocl02bwl2rsc77atwhq'
                }
            ]
        }
    },
    {
        id: 'clkv6uozt02kwl2rscnr2a5lw',
        title: 'Obesity',
        parents: {
            connect: [
                {
                    id: 'clkv6umnz01oal2rsssnv8qfa'
                }
            ]
        }
    },
    {
        id: 'cly468yqt000b7ryzqdcaywaw',
        title: 'Arable Farming',
        parents: {
            connect: [
                {
                    id: 'clkv6uium008gl2rs3d7ene92'
                }
            ]
        }
    },
    {
        id: 'cly468yrd000e7ryzlyum706i',
        title: 'Agricultural technology',
        parents: {
            connect: [
                {
                    id: 'clkv6uium008gl2rs3d7ene92'
                },
                {
                    id: 'clkv6umlc01nel2rs4z4vbfcn'
                }
            ]
        }
    },
    {
        id: 'cly468yrk000f7ryzepbgmcok',
        title: 'Artificial intelligence',
        parents: {
            connect: [
                {
                    id: 'clkv6umqc01p6l2rs30lyrpgn'
                }
            ]
        }
    },
    {
        id: 'cly468ywj000y7ryzrwynwtqz',
        title: 'Civil unrest',
        parents: {
            connect: [
                {
                    id: 'clkv6ulxq01eql2rsfz53q1ay'
                }
            ]
        }
    },
    {
        id: 'cly468yy500167ryzcl85ugvl',
        title: 'Corporate spin-off',
        parents: {
            connect: [
                {
                    id: 'cly468yxw00157ryzkwufkpsk'
                }
            ]
        }
    },
    {
        id: 'cly468yz1001b7ryzzrj7r2gm',
        title: 'Commercial building',
        parents: {
            connect: [
                {
                    id: 'clkv6ulm9019wl2rsnf7e4t2z'
                }
            ]
        }
    },
    {
        id: 'cly468z1e001q7ryzbmskntnn',
        title: 'Unions',
        parents: {
            connect: [
                {
                    id: 'clkv6ulpc01b8l2rs7u6ws9jo'
                },
                {
                    id: 'cly468z14001o7ryzk0n5bh9m'
                }
            ]
        }
    },
    {
        id: 'cly468z5o00287ryzt01vaqde',
        title: 'Drug rehabilitation',
        parents: {
            connect: [
                {
                    id: 'clkv6uocq02byl2rs1l4o0jln'
                }
            ]
        }
    },
    {
        id: 'cly468z9e002u7ryzvk4k7kdp',
        title: 'Energy saving',
        parents: {
            connect: [
                {
                    id: 'clkv6uiza00a4l2rs9xhxgjx5'
                },
                {
                    id: 'clkv6umlo01nil2rstgkvhzss'
                }
            ]
        }
    },
    {
        id: 'cly468z9v002x7ryzrh2jtmuc',
        title: 'Endangered species',
        parents: {
            connect: [
                {
                    id: 'clkv6uiza00a4l2rs9xhxgjx5'
                }
            ]
        }
    },
    {
        id: 'cly468za8002z7ryz8g8pl8bx',
        title: 'Employment',
        parents: {
            connect: [
                {
                    id: 'clkv6upoe02u4l2rsfkf7tbhg'
                }
            ]
        }
    },
    {
        id: 'cly468zc8003d7ryz3u7hzwb5',
        title: 'Fine (penalty)',
        parents: {
            connect: [
                {
                    id: 'cly468zc3003c7ryzgxa7u0p2'
                }
            ]
        }
    },
    {
        id: 'cly468zdc003l7ryzr1939mt0',
        title: 'Foreign aid',
        parents: {
            connect: [
                {
                    id: 'cly468z3o001y7ryzxhm8jre3'
                },
                {
                    id: 'cly468zat00337ryz1omx361g'
                }
            ]
        }
    },
    {
        id: 'cly468ze1003q7ryzlz6ixmop',
        title: 'Grocery',
        parents: {
            connect: [
                {
                    id: 'cly468zcn003g7ryz4eavc8jw'
                }
            ]
        }
    },
    {
        id: 'cly468zec003s7ryz48yvjca4',
        title: 'Government aid',
        parents: {
            connect: [
                {
                    id: 'cly468z1u001t7ryzkbpl2w86'
                },
                {
                    id: 'cly468z3o001y7ryzxhm8jre3'
                }
            ]
        }
    },
    {
        id: 'cly468zgp00457ryz4toyrdsw',
        title: 'Health care provider',
        parents: {
            connect: [
                {
                    id: 'cly468zgj00447ryz4hfiddyt'
                }
            ]
        }
    },
    {
        id: 'cly468zgu00467ryzrjbt02sa',
        title: 'Health facility',
        parents: {
            connect: [
                {
                    id: 'cly468zgj00447ryz4hfiddyt'
                }
            ]
        }
    },
    {
        id: 'cly468zh000477ryzes6s6mk7',
        title: 'Hospital',
        parents: {
            connect: [
                {
                    id: 'cly468zgj00447ryz4hfiddyt'
                }
            ]
        }
    },
    {
        id: 'cly468zh500487ryzrc5kgwfh',
        title: 'Health care approach',
        parents: {
            connect: [
                {
                    id: 'cly468zgj00447ryz4hfiddyt'
                }
            ]
        }
    },
    {
        id: 'cly468zj3004k7ryzr5nnrthn',
        title: 'Workplace safety',
        parents: {
            connect: [
                {
                    id: 'clkv6ulq801bml2rs7hxk2lpz'
                }
            ]
        }
    },
    {
        id: 'cly468zju004p7ryz5hf0c210',
        title: 'Interest rates',
        parents: {
            connect: [
                {
                    id: 'clkv6upos02ual2rswg7o0a6m'
                },
                {
                    id: 'cly468yzz001g7ryz8xds2lbp'
                }
            ]
        }
    },
    {
        id: 'cly468zmd00567ryze6zg11wu',
        title: 'Leveraged buyout',
        parents: {
            connect: [
                {
                    id: 'cly468zm800557ryzf4wzw8pt'
                }
            ]
        }
    },
    {
        id: 'cly468zmj00577ryzqkpsfor8',
        title: 'Licensing agreement',
        parents: {
            connect: [
                {
                    id: 'clkv6uloc01asl2rsonw0aikx'
                }
            ]
        }
    },
    {
        id: 'cly468zna005c7ryzyva6xiop',
        title: 'Loan markets',
        parents: {
            connect: [
                {
                    id: 'cly468zn4005b7ryzj2ntt6e7'
                }
            ]
        }
    },
    {
        id: 'cly468zro005v7ryzdi2eap4l',
        title: 'Medical professions',
        parents: {
            connect: [
                {
                    id: 'cly468zgj00447ryz4hfiddyt'
                }
            ]
        }
    },
    {
        id: 'cly468ztt00697ryzfn0j6xlf',
        title: 'Nationalisation',
        parents: {
            connect: [
                {
                    id: 'clkv6uq3z030il2rsvtndn6ap'
                },
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly468zv2006h7ryz7uez83km',
        title: 'Online media industry',
        parents: {
            connect: [
                {
                    id: 'cly468yyi00187ryzt22ty3w7'
                },
                {
                    id: 'cly468zq7005m7ryzog5eucqu'
                }
            ]
        }
    },
    {
        id: 'cly468zwf006p7ryzx9fhum9r',
        title: 'Prison',
        parents: {
            connect: [
                {
                    id: 'cly468zc3003c7ryzgxa7u0p2'
                }
            ]
        }
    },
    {
        id: 'cly468zwn006q7ryz8sx9s51d',
        title: 'Patent, copyright and trademark',
        parents: {
            connect: [
                {
                    id: 'clkv6uloc01asl2rsonw0aikx'
                }
            ]
        }
    },
    {
        id: 'cly468zx3006s7ryzayc5tkf8',
        title: 'Public contract',
        parents: {
            connect: [
                {
                    id: 'clkv6uloc01asl2rsonw0aikx'
                }
            ]
        }
    },
    {
        id: 'cly468zzr00787ryzj0rg7xzw',
        title: 'Privatisation',
        parents: {
            connect: [
                {
                    id: 'clkv6uq3z030il2rsvtndn6ap'
                },
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly469016007h7ryzmwcrlqgy',
        title: 'Poverty',
        parents: {
            connect: [
                {
                    id: 'clkv6ulpu01bgl2rscxv34lkj'
                }
            ]
        }
    },
    {
        id: 'cly46901c007i7ryzo4bwz9av',
        title: 'Public housing',
        parents: {
            connect: [
                {
                    id: 'cly468zhx004d7ryzsezmjjyt'
                }
            ]
        }
    },
    {
        id: 'cly46903l007x7ryzgan8igh3',
        title: 'Regulation of industry',
        parents: {
            connect: [
                {
                    id: 'cly46901x007m7ryzmp9e30k6'
                }
            ]
        }
    },
    {
        id: 'cly46904700817ryzhdwkwbqn',
        title: 'Religious festival and holiday',
        parents: {
            connect: [
                {
                    id: 'clkv6upqj02v0l2rshhv9tj7i'
                },
                {
                    id: 'cly468zbp00397ryzjqsa6oq3'
                }
            ]
        }
    },
    {
        id: 'cly46904x00867ryzbuvrb16z',
        title: 'Sentencing (criminal)',
        parents: {
            connect: [
                {
                    id: 'cly468zc3003c7ryzgxa7u0p2'
                },
                {
                    id: 'cly468zli00507ryzh96v7r8o'
                }
            ]
        }
    },
    {
        id: 'cly46905300877ryz37f35gz6',
        title: 'Surveillance',
        parents: {
            connect: [
                {
                    id: 'clkv6uivq008sl2rsh8muvs18'
                },
                {
                    id: 'cly468zly00537ryzfs9vsasl'
                }
            ]
        }
    },
    {
        id: 'cly46905k008a7ryzu3k34byn',
        title: 'Stock activity',
        parents: {
            connect: [
                {
                    id: 'cly46905f00897ryzhv6ghehc'
                }
            ]
        }
    },
    {
        id: 'cly46905q008b7ryz0y0xl16f',
        title: 'Stock option',
        parents: {
            connect: [
                {
                    id: 'cly46905f00897ryzhv6ghehc'
                }
            ]
        }
    },
    {
        id: 'cly46906d008f7ryzu4uzbfnf',
        title: 'Shipping service',
        parents: {
            connect: [
                {
                    id: 'cly468zmy005a7ryz7imk4y8l'
                }
            ]
        }
    },
    {
        id: 'cly46906n008h7ryzjqpasf9x',
        title: 'Shopping malls and physical retail',
        parents: {
            connect: [
                {
                    id: 'cly469028007o7ryzi0cmflj6'
                }
            ]
        }
    },
    {
        id: 'cly469072008k7ryzm0ca4vxx',
        title: 'Stock recommendation',
        parents: {
            connect: [
                {
                    id: 'cly46905f00897ryzhv6ghehc'
                }
            ]
        }
    },
    {
        id: 'cly4690b3008y7ryzciu062os',
        title: 'Suicide',
        parents: {
            connect: [
                {
                    id: 'clkv6upc202pil2rsjxpxhk4y'
                }
            ]
        }
    },
    {
        id: 'cly4690c100927ryzw7c4npqa',
        title: 'Sport event',
        parents: {
            connect: [
                {
                    id: 'cly468zbp00397ryzjqsa6oq3'
                }
            ]
        }
    },
    {
        id: 'cly4690ch00947ryzt6xddipi',
        title: 'Sport organisation',
        parents: {
            connect: [
                {
                    id: 'cly4690c800937ryzkn1vxvm3'
                }
            ]
        }
    },
    {
        id: 'cly4690co00957ryztkfcbjgc',
        title: 'Sports management and ownership',
        parents: {
            connect: [
                {
                    id: 'cly4690c800937ryzkn1vxvm3'
                }
            ]
        }
    },
    {
        id: 'cly4690da00967ryzyo70nyoh',
        title: 'Television',
        parents: {
            connect: [
                {
                    id: 'cly468zq7005m7ryzog5eucqu'
                }
            ]
        }
    },
    {
        id: 'cly4690f8009h7ryzvwwyc6rj',
        title: 'Utilities',
        parents: {
            connect: [
                {
                    id: 'clkv6upo602u0l2rsowdqkb8c'
                }
            ]
        }
    },
    {
        id: 'cly4690gk009l7ryz50brnmfu',
        title: 'Volunteering',
        parents: {
            connect: [
                {
                    id: 'cly468z3o001y7ryzxhm8jre3'
                }
            ]
        }
    },
    {
        id: 'cly4690i1009s7ryzimpc0vct',
        title: 'Waste materials',
        parents: {
            connect: [
                {
                    id: 'clkv6ulk70198l2rs6pt39c1h'
                }
            ]
        }
    },
    {
        id: 'cly4690ii009v7ryz0gnpgdxu',
        title: 'Wellness',
        parents: {
            connect: [
                {
                    id: 'clkv6upc202pil2rsjxpxhk4y'
                }
            ]
        }
    },
    {
        id: 'cly4690li00aa7ryz51fumo8r',
        title: 'Economic development incentive',
        parents: {
            connect: [
                {
                    id: 'cly4690l800a97ryz4df4j0s5'
                }
            ]
        }
    },
    {
        id: 'cly4690lw00ac7ryzonqwj5zq',
        title: 'Environmental policy',
        parents: {
            connect: [
                {
                    id: 'clkv6uiza00a4l2rs9xhxgjx5'
                },
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                }
            ]
        }
    },
    {
        id: 'cly4690m100ad7ryzmxkvj4b1',
        title: 'Food and drink regulation',
        parents: {
            connect: [
                {
                    id: 'cly46901x007m7ryzmp9e30k6'
                }
            ]
        }
    },
    {
        id: 'cly4690m600ae7ryz39oitxki',
        title: 'Hot stock',
        parents: {
            connect: [
                {
                    id: 'cly46905f00897ryzhv6ghehc'
                }
            ]
        }
    },
    {
        id: 'cly4690n700al7ryzl8g2w5ro',
        title: 'Supreme and high court',
        parents: {
            connect: [
                {
                    id: 'cly4690k100a47ryzhfqhnbbd'
                }
            ]
        }
    },
    {
        id: 'cly4690nc00am7ryzpyp4nz8d',
        title: 'Trial (court)',
        parents: {
            connect: [
                {
                    id: 'cly4690k100a47ryzhfqhnbbd'
                }
            ]
        }
    },
    {
        id: 'clkv6uj5r00col2rsmqlihivk',
        title: '1938-1955. German annexation. Allied occupation',
        parents: {
            connect: [
                {
                    id: 'clkv6uj5n00cml2rson3khfgv'
                }
            ]
        }
    },
    {
        id: 'clkv6uj5x00cql2rsr1evv936',
        title: '1955-',
        parents: {
            connect: [
                {
                    id: 'clkv6uj5n00cml2rson3khfgv'
                }
            ]
        }
    },
    {
        id: 'clkv6uj9500e4l2rsjcv0x6nw',
        title: 'Hundred Years’ War, 1339-1453',
        parents: {
            connect: [
                {
                    id: 'clkv6uj9000e2l2rs938q168f'
                }
            ]
        }
    },
    {
        id: 'clkv6uj9900e6l2rsbw4hawod',
        title: '15th century. Jeanne d’Arc, Saint',
        parents: {
            connect: [
                {
                    id: 'clkv6uj9000e2l2rs938q168f'
                }
            ]
        }
    },
    {
        id: 'clkv6uj9z00eil2rs1bpok13f',
        title: 'Restoration, 1815-1830',
        parents: {
            connect: [
                {
                    id: 'clkv6uj9v00egl2rsc2hgiys5'
                }
            ]
        }
    },
    {
        id: 'clkv6uja400ekl2rsqp2kctfy',
        title: 'July Revolution of 1830. July Monarchy, 1830-1848',
        parents: {
            connect: [
                {
                    id: 'clkv6uj9v00egl2rsc2hgiys5'
                }
            ]
        }
    },
    {
        id: 'clkv6uja900eml2rs2wh9edrj',
        title: 'February Revolution and Second Republic',
        parents: {
            connect: [
                {
                    id: 'clkv6uj9v00egl2rsc2hgiys5'
                }
            ]
        }
    },
    {
        id: 'clkv6ujae00eol2rso0sd4x7k',
        title: 'Second Empire, 1852-1870',
        parents: {
            connect: [
                {
                    id: 'clkv6uj9v00egl2rsc2hgiys5'
                }
            ]
        }
    },
    {
        id: 'clkv6ujai00eql2rsho1veu1z',
        title: 'Franco-German or Franco-Prussian War, 1870-1871',
        parents: {
            connect: [
                {
                    id: 'clkv6uj9v00egl2rsc2hgiys5'
                }
            ]
        }
    },
    {
        id: 'clkv6ujan00esl2rs8clvfxc6',
        title: 'Later 19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6uj9v00egl2rsc2hgiys5'
                }
            ]
        }
    },
    {
        id: 'clkv6ujav00ewl2rs7i1vkgzl',
        title: '1940-1946',
        parents: {
            connect: [
                {
                    id: 'clkv6ujar00eul2rs87xf854w'
                }
            ]
        }
    },
    {
        id: 'clkv6ujb000eyl2rsqw5pebk6',
        title: 'Fourth Republic, 1947-1958',
        parents: {
            connect: [
                {
                    id: 'clkv6ujar00eul2rs87xf854w'
                }
            ]
        }
    },
    {
        id: 'clkv6ujb400f0l2rssq576p6p',
        title: 'Fifth Republic, 1958',
        parents: {
            connect: [
                {
                    id: 'clkv6ujar00eul2rs87xf854w'
                }
            ]
        }
    },
    {
        id: 'clkv6ujby00fel2rs4oxsyhfv',
        title: '1268-1492',
        parents: {
            connect: [
                {
                    id: 'clkv6ujkc00iwl2rslj1uh42i'
                }
            ]
        }
    },
    {
        id: 'clkv6uje900gel2rsggi29o2x',
        title: 'Period of World War I, 1914-1918',
        parents: {
            connect: [
                {
                    id: 'clkv6ujdv00g8l2rs5tsxflk8'
                }
            ]
        }
    },
    {
        id: 'clkv6ujei00gil2rsiezsskfo',
        title: 'Period of World War II, 1939-1945',
        parents: {
            connect: [
                {
                    id: 'clkv6ujed00ggl2rs8q8czsx2'
                }
            ]
        }
    },
    {
        id: 'clkv6ujgo00hgl2rsoqm0j4yw',
        title: '1453. Fall of Constantinople',
        parents: {
            connect: [
                {
                    id: 'clkv6ujgj00hel2rsbqyfmj4d'
                }
            ]
        }
    },
    {
        id: 'clkv6ujij00i6l2rs1o2ulp77',
        title: 'Foundations and kings, 753-510',
        parents: {
            connect: [
                {
                    id: 'clkv6ujia00i2l2rs5ih7fs6d'
                }
            ]
        }
    },
    {
        id: 'clkv6ujin00i8l2rs7drrhsjf',
        title: 'Republic, 509-27',
        parents: {
            connect: [
                {
                    id: 'clkv6ujia00i2l2rs5ih7fs6d'
                }
            ]
        }
    },
    {
        id: 'clkv6ujjy00iql2rsiksb2gxe',
        title: 'Constitutional Empire, 27 B.C.-284 A.D.',
        parents: {
            connect: [
                {
                    id: 'clkv6ujie00i4l2rsp1xix24k'
                }
            ]
        }
    },
    {
        id: 'clkv6ujk200isl2rs3or32egv',
        title: '284-476. Decline and fall',
        parents: {
            connect: [
                {
                    id: 'clkv6ujie00i4l2rsp1xix24k'
                }
            ]
        }
    },
    {
        id: 'clkv6ujkn00j0l2rsvsekirtn',
        title: '476-1268',
        parents: {
            connect: [
                {
                    id: 'clkv6ujkc00iwl2rslj1uh42i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujlg00j8l2rsaa530rrs',
        title: '16th-18th centuries',
        parents: {
            connect: [
                {
                    id: 'clkv6ujkj00iyl2rsaw3xv3gr'
                }
            ]
        }
    },
    {
        id: 'clkv6ujll00jal2rsuxqhvkmc',
        title: '1792-1815. Napoleonic period',
        parents: {
            connect: [
                {
                    id: 'clkv6ujkj00iyl2rsaw3xv3gr'
                }
            ]
        }
    },
    {
        id: 'clkv6ujlt00jel2rsqcj1z75d',
        title: '19th century',
        parents: {
            connect: [
                {
                    id: 'clkv6ujkj00iyl2rsaw3xv3gr'
                }
            ]
        }
    },
    {
        id: 'clkv6ujlz00jgl2rs625qivro',
        title: '1871-1947. United Italy (Monarchy)',
        parents: {
            connect: [
                {
                    id: 'clkv6ujkj00iyl2rsaw3xv3gr'
                }
            ]
        }
    },
    {
        id: 'clkv6ujm300jil2rsb9hvbfmn',
        title: '1948-. Republic',
        parents: {
            connect: [
                {
                    id: 'clkv6ujkj00iyl2rsaw3xv3gr'
                }
            ]
        }
    },
    {
        id: 'clkv6ujzn00o0l2rsfhxu102w',
        title: 'War with Sweden, 1643-1645',
        parents: {
            connect: [
                {
                    id: 'clkv6ujz400nsl2rsud6ior61'
                }
            ]
        }
    },
    {
        id: 'clkv6ujzt00o2l2rsb7mzoqgt',
        title: 'War with Sweden, 1657-1660',
        parents: {
            connect: [
                {
                    id: 'clkv6ujz400nsl2rsud6ior61'
                }
            ]
        }
    },
    {
        id: 'clkv6ujzy00o4l2rs70kk6odk',
        title: 'Period of Northern War, 1700-1721',
        parents: {
            connect: [
                {
                    id: 'clkv6ujz900nul2rsanxcbxwn'
                }
            ]
        }
    },
    {
        id: 'clkv6uk0400o6l2rs0lbsoy69',
        title: 'Schleswig Holstein War, 1848-1850',
        parents: {
            connect: [
                {
                    id: 'clkv6ujze00nwl2rsmc6afcqe'
                }
            ]
        }
    },
    {
        id: 'clkv6uk0800o8l2rsc82t8t4d',
        title: 'Schleswig Holstein War, 1864',
        parents: {
            connect: [
                {
                    id: 'clkv6ujze00nwl2rsmc6afcqe'
                }
            ]
        }
    },
    {
        id: 'clkv6uk3900pcl2rshibss5dc',
        title: 'Wars with Denmark, Russia, Poland',
        parents: {
            connect: [
                {
                    id: 'clkv6uk2m00p2l2rs7t8yhkkj'
                }
            ]
        }
    },
    {
        id: 'clkv6uk3e00pel2rsofqtq524',
        title: 'Northern War, 1700-1721',
        parents: {
            connect: [
                {
                    id: 'clkv6uk2q00p4l2rsz2jv8qip'
                }
            ]
        }
    },
    {
        id: 'clkv6uk3j00pgl2rsdcks6gge',
        title: 'Revolution and loss of Finland, 1809',
        parents: {
            connect: [
                {
                    id: 'clkv6uk2v00p6l2rsu22xzzsh'
                }
            ]
        }
    },
    {
        id: 'clkv6uk3n00pil2rsjaj0xnjf',
        title: 'Union with Norway, 1814',
        parents: {
            connect: [
                {
                    id: 'clkv6uk0x00oil2rsdgd7votv'
                },
                {
                    id: 'clkv6uk2v00p6l2rsu22xzzsh'
                }
            ]
        }
    },
    {
        id: 'clkv6uk4v00q0l2rsvh2f7njv',
        title: 'Russo Finnish War, 1939-1940',
        parents: {
            connect: [
                {
                    id: 'clkv6uk4q00pyl2rsgu61lelq'
                }
            ]
        }
    },
    {
        id: 'clkv6uk7y00qyl2rsfxspovc9',
        title: 'Second Republic, 1931-1939',
        parents: {
            connect: [
                {
                    id: 'clkv6uk7m00qwl2rs4lalrnxp'
                }
            ]
        }
    },
    {
        id: 'clkv6uk8a00r2l2rsdn2m9yoe',
        title: '1939-1975',
        parents: {
            connect: [
                {
                    id: 'clkv6uk7m00qwl2rs4lalrnxp'
                }
            ]
        }
    },
    {
        id: 'clkv6uk8f00r4l2rs582pk19p',
        title: '1975-',
        parents: {
            connect: [
                {
                    id: 'clkv6uk7m00qwl2rs4lalrnxp'
                }
            ]
        }
    },
    {
        id: 'clkv6ukb000rsl2rs2ukw82mw',
        title: 'Revolution of 1820',
        parents: {
            connect: [
                {
                    id: 'clkv6uka900ril2rsebkzoxuv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukb400rul2rs7uia3xnc',
        title: 'Wars of succession, 1826-1840',
        parents: {
            connect: [
                {
                    id: 'clkv6uka900ril2rsebkzoxuv'
                }
            ]
        }
    },
    {
        id: 'clkv6ukb900rwl2rs9cyjv6tg',
        title: 'Revolution of October 1910',
        parents: {
            connect: [
                {
                    id: 'clkv6ukah00rkl2rs42qzfv2x'
                }
            ]
        }
    },
    {
        id: 'clkv6ukbd00ryl2rshte24qja',
        title: 'Republic, 1910- . Revolution of 1919',
        parents: {
            connect: [
                {
                    id: 'clkv6ukah00rkl2rs42qzfv2x'
                }
            ]
        }
    },
    {
        id: 'clkv6ukob00wwl2rsulylaxsp',
        title: 'Cambodia',
        parents: {
            connect: [
                {
                    id: 'clkv6uko600wul2rs0zj7va6c'
                }
            ]
        }
    },
    {
        id: 'clkv6ukof00wyl2rstifd99qq',
        title: 'Laos',
        parents: {
            connect: [
                {
                    id: 'clkv6uko600wul2rs0zj7va6c'
                }
            ]
        }
    },
    {
        id: 'clkv6ukoj00x0l2rs9o0u9amm',
        title: 'Vietnam. Annam',
        parents: {
            connect: [
                {
                    id: 'clkv6uko600wul2rs0zj7va6c'
                }
            ]
        }
    },
    {
        id: 'clkv6ukpf00xal2rsqnd1s5tn',
        title: 'Sabah. British North Borneo',
        parents: {
            connect: [
                {
                    id: 'clkv6ukp900x8l2rs0p7c2c3e'
                }
            ]
        }
    },
    {
        id: 'clkv6ukpk00xcl2rsyx6nen9t',
        title: 'Sarawak',
        parents: {
            connect: [
                {
                    id: 'clkv6ukp900x8l2rs0p7c2c3e'
                }
            ]
        }
    },
    {
        id: 'clkv6ukpp00xel2rspmu4wbhv',
        title: 'Malay Archipelago',
        parents: {
            connect: [
                {
                    id: 'clkv6ukp900x8l2rs0p7c2c3e'
                }
            ]
        }
    },
    {
        id: 'clkv6ukq200xkl2rspplbykta',
        title: 'Sumatra',
        parents: {
            connect: [
                {
                    id: 'clkv6ukpy00xil2rsmc60bjze'
                }
            ]
        }
    },
    {
        id: 'clkv6ukq700xml2rs5ei7zjgc',
        title: 'Java',
        parents: {
            connect: [
                {
                    id: 'clkv6ukpy00xil2rsmc60bjze'
                }
            ]
        }
    },
    {
        id: 'clkv6ukqb00xol2rsdcgjo1ng',
        title: 'Borneo. Kalimantan, Indonesia',
        parents: {
            connect: [
                {
                    id: 'clkv6ukpy00xil2rsmc60bjze'
                }
            ]
        }
    },
    {
        id: 'clkv6ukqf00xql2rspyhhrf3a',
        title: 'Celebes. Sulawesi',
        parents: {
            connect: [
                {
                    id: 'clkv6ukpy00xil2rsmc60bjze'
                }
            ]
        }
    },
    {
        id: 'clkv6ukqk00xsl2rsm1chpivy',
        title: 'Timor',
        parents: {
            connect: [
                {
                    id: 'clkv6ukpy00xil2rsmc60bjze'
                }
            ]
        }
    },
    {
        id: 'clkv6ukqo00xul2rsyjxqvwzq',
        title: 'Moluccas. Maluku',
        parents: {
            connect: [
                {
                    id: 'clkv6ukpy00xil2rsmc60bjze'
                }
            ]
        }
    },
    {
        id: 'clkv6ukr600y2l2rsvgvgsyuy',
        title: 'Manchuria',
        parents: {
            connect: [
                {
                    id: 'clkv6ukr200y0l2rsmckhfsfm'
                }
            ]
        }
    },
    {
        id: 'clkv6ukra00y4l2rscj1vfa4h',
        title: 'Tibet',
        parents: {
            connect: [
                {
                    id: 'clkv6ukr200y0l2rsmckhfsfm'
                }
            ]
        }
    },
    {
        id: 'clkv6ukrf00y6l2rs699pqcu2',
        title: 'Hong Kong',
        parents: {
            connect: [
                {
                    id: 'clkv6ukr200y0l2rsmckhfsfm'
                }
            ]
        }
    },
    {
        id: 'clkv6ukrk00y8l2rshyj3r3ab',
        title: 'Taiwan',
        parents: {
            connect: [
                {
                    id: 'clkv6ukr200y0l2rsmckhfsfm'
                }
            ]
        }
    },
    {
        id: 'clkv6ukrp00yal2rsl8uzbwak',
        title: "Outer Mongolia. Mongolian People's Republic",
        parents: {
            connect: [
                {
                    id: 'clkv6ukr200y0l2rsmckhfsfm'
                }
            ]
        }
    },
    {
        id: 'clkv6uks300ygl2rsk4dv3vpt',
        title: 'War and intervention, 1950-1953',
        parents: {
            connect: [
                {
                    id: 'clkv6ukry00yel2rswxdcv5wt'
                }
            ]
        }
    },
    {
        id: 'clkv6uks800yil2rsfptdv8dv',
        title: "Democratic People's Republic, 1948",
        parents: {
            connect: [
                {
                    id: 'clkv6ukry00yel2rswxdcv5wt'
                }
            ]
        }
    },
    {
        id: 'clkv6ukt300ywl2rsk2lont9k',
        title: 'Libya',
        parents: {
            connect: [
                {
                    id: 'clkv6uksy00yul2rsqtxjbrxh'
                }
            ]
        }
    },
    {
        id: 'clkv6ukt800yyl2rscc8qgyy6',
        title: 'Tunisia (Tunis)',
        parents: {
            connect: [
                {
                    id: 'clkv6uksy00yul2rsqtxjbrxh'
                }
            ]
        }
    },
    {
        id: 'clkv6uktf00z0l2rs4eju06i9',
        title: 'Algeria',
        parents: {
            connect: [
                {
                    id: 'clkv6uksy00yul2rsqtxjbrxh'
                }
            ]
        }
    },
    {
        id: 'clkv6uktj00z2l2rsdezqqro4',
        title: 'Morocco',
        parents: {
            connect: [
                {
                    id: 'clkv6uksy00yul2rsqtxjbrxh'
                }
            ]
        }
    },
    {
        id: 'clkv6ukto00z4l2rsnrdbi9xw',
        title: 'Sahara',
        parents: {
            connect: [
                {
                    id: 'clkv6uksy00yul2rsqtxjbrxh'
                }
            ]
        }
    },
    {
        id: 'clkv6un3101tsl2rset8hknh1',
        title: 'bacterial infection',
        parents: {
            connect: [
                {
                    id: 'clkv6un2x01tql2rs777dy8iv'
                }
            ]
        }
    },
    {
        id: 'clkv6un3l01tyl2rszce4sbqz',
        title: 'bioactive',
        parents: {
            connect: [
                {
                    id: 'clkv6un3b01twl2rs7ua7zrn8'
                }
            ]
        }
    },
    {
        id: 'clkv6un3y01u4l2rsyuyq0gk3',
        title: 'bionanocomposites',
        parents: {
            connect: [
                {
                    id: 'clkv6un3b01twl2rs7ua7zrn8'
                }
            ]
        }
    },
    {
        id: 'clkv6un4301u6l2rsttap4qdi',
        title: 'involves adhesion',
        parents: {
            connect: [
                {
                    id: 'clkv6un3b01twl2rs7ua7zrn8'
                }
            ]
        }
    },
    {
        id: 'clkv6un4701u8l2rsdaqqrnas',
        title: 'materials cellulose',
        parents: {
            connect: [
                {
                    id: 'clkv6un3b01twl2rs7ua7zrn8'
                }
            ]
        }
    },
    {
        id: 'clkv6un5701ukl2rs1aykrxbr',
        title: 'adsorption based',
        parents: {
            connect: [
                {
                    id: 'clkv6un5101uil2rsvf2qne9d'
                }
            ]
        }
    },
    {
        id: 'clkv6un5f01uol2rsmjpxoz5a',
        title: 'nondestructive evaluation',
        parents: {
            connect: [
                {
                    id: 'clkv6un5101uil2rsvf2qne9d'
                }
            ]
        }
    },
    {
        id: 'clkv6un5o01usl2rsykfmirb1',
        title: 'defects crucial',
        parents: {
            connect: [
                {
                    id: 'clkv6un5k01uql2rs8qfzsc6q'
                }
            ]
        }
    },
    {
        id: 'clkv6un6g01v2l2rsnxsssx4g',
        title: 'environmental pollution',
        parents: {
            connect: [
                {
                    id: 'clkv6umg701lel2rsspppgoem'
                },
                {
                    id: 'clkv6un5k01uql2rs8qfzsc6q'
                }
            ]
        }
    },
    {
        id: 'clkv6un8l01vol2rs1hh138wx',
        title: 'turbine blade',
        parents: {
            connect: [
                {
                    id: 'clkv6un8h01vml2rsy3mqjqyc'
                }
            ]
        }
    },
    {
        id: 'clkv6unai01wgl2rsk5uy692c',
        title: 'fibers textile',
        parents: {
            connect: [
                {
                    id: 'clkv6unad01wel2rs8f4fwisq'
                }
            ]
        }
    },
    {
        id: 'clkv6uncy01xil2rs07c4glca',
        title: 'ferroelectric',
        parents: {
            connect: [
                {
                    id: 'clkv6uncu01xgl2rsaar936ok'
                }
            ]
        }
    },
    {
        id: 'clkv6und701xml2rsb0fquhgf',
        title: 'magnetization',
        parents: {
            connect: [
                {
                    id: 'clkv6uncu01xgl2rsaar936ok'
                }
            ]
        }
    },
    {
        id: 'clkv6undk01xsl2rs8arzrdb9',
        title: 'aluminium based',
        parents: {
            connect: [
                {
                    id: 'clkv6undg01xql2rsin7vw0w2'
                }
            ]
        }
    },
    {
        id: 'clkv6undo01xul2rs9y4auz28',
        title: 'austenitic stainless',
        parents: {
            connect: [
                {
                    id: 'clkv6undg01xql2rsin7vw0w2'
                }
            ]
        }
    },
    {
        id: 'clkv6undt01xwl2rsfkzz9iok',
        title: 'strength steel',
        parents: {
            connect: [
                {
                    id: 'clkv6undg01xql2rsin7vw0w2'
                }
            ]
        }
    },
    {
        id: 'clkv6une701y2l2rsqs4aicz1',
        title: 'titanium',
        parents: {
            connect: [
                {
                    id: 'clkv6undg01xql2rsin7vw0w2'
                }
            ]
        }
    },
    {
        id: 'clkv6unec01y4l2rsreamd7yh',
        title: 'transition metal',
        parents: {
            connect: [
                {
                    id: 'clkv6undg01xql2rsin7vw0w2'
                }
            ]
        }
    },
    {
        id: 'clkv6unfm01yol2rs1um3pfvg',
        title: 'conjugated polyelectrolytes',
        parents: {
            connect: [
                {
                    id: 'clkv6unfi01yml2rscpzupv6l'
                }
            ]
        }
    },
    {
        id: 'clkv6unfq01yql2rsyjbgx011',
        title: 'content polypropylene',
        parents: {
            connect: [
                {
                    id: 'clkv6unfi01yml2rscpzupv6l'
                }
            ]
        }
    },
    {
        id: 'clkv6unfv01ysl2rsp1igvq1e',
        title: 'versatile polydopamine',
        parents: {
            connect: [
                {
                    id: 'clkv6unfi01yml2rscpzupv6l'
                }
            ]
        }
    },
    {
        id: 'clkv6ung301ywl2rsgj35rf5o',
        title: 'foamed materials',
        parents: {
            connect: [
                {
                    id: 'clkv6unfz01yul2rs73io6kvv'
                }
            ]
        }
    },
    {
        id: 'clkv6ungo01z4l2rsqdfr1d4m',
        title: 'coatings',
        parents: {
            connect: [
                {
                    id: 'clkv6ungj01z2l2rsxwj2nev4'
                }
            ]
        }
    },
    {
        id: 'clkv6ungt01z6l2rsclvshabw',
        title: 'layer deposition',
        parents: {
            connect: [
                {
                    id: 'clkv6ungj01z2l2rsxwj2nev4'
                }
            ]
        }
    },
    {
        id: 'clkv6ungy01z8l2rs895e51bz',
        title: 'surface quality',
        parents: {
            connect: [
                {
                    id: 'clkv6ungj01z2l2rsxwj2nev4'
                }
            ]
        }
    },
    {
        id: 'clkv6unhu01zkl2rskqy70eqn',
        title: 'material lithium',
        parents: {
            connect: [
                {
                    id: 'clkv6unhp01zil2rsmdha9x8f'
                }
            ]
        }
    },
    {
        id: 'clkv6unil01zul2rsjh2gtu0f',
        title: 'solar cell',
        parents: {
            connect: [
                {
                    id: 'clkv6unhp01zil2rsmdha9x8f'
                }
            ]
        }
    },
    {
        id: 'clkv6unlb020ol2rsm1pjst4g',
        title: 'hydrogenated carbon',
        parents: {
            connect: [
                {
                    id: 'clkv6unl7020ml2rsjpkxihau'
                }
            ]
        }
    },
    {
        id: 'clkv6unox0220l2rscqznv5ci',
        title: 'thermoelectric',
        parents: {
            connect: [
                {
                    id: 'clkv6unl7020ml2rsjpkxihau'
                }
            ]
        }
    },
    {
        id: 'clkv6unrw0236l2rs8ips3im0',
        title: 'redox',
        parents: {
            connect: [
                {
                    id: 'clkv6unrr0234l2rsinwyynf6'
                }
            ]
        }
    },
    {
        id: 'clkv6unsg023cl2rs1nxw9az6',
        title: 'elastomers',
        parents: {
            connect: [
                {
                    id: 'clkv6uns4023al2rsf8xb7fw1'
                }
            ]
        }
    },
    {
        id: 'clkv6unsp023el2rseb9scrms',
        title: 'rheological properties',
        parents: {
            connect: [
                {
                    id: 'clkv6uns4023al2rsf8xb7fw1'
                }
            ]
        }
    },
    {
        id: 'clkv6untb023ml2rsm4v2b75r',
        title: 'amorphous',
        parents: {
            connect: [
                {
                    id: 'clkv6unt7023kl2rspu95t30s'
                }
            ]
        }
    },
    {
        id: 'clkv6untk023ql2rs09wbhpun',
        title: 'entropy alloys',
        parents: {
            connect: [
                {
                    id: 'clkv6unt7023kl2rspu95t30s'
                }
            ]
        }
    },
    {
        id: 'clkv6unts023ul2rsving4m6u',
        title: 'liquid crystals',
        parents: {
            connect: [
                {
                    id: 'clkv6unt7023kl2rspu95t30s'
                }
            ]
        }
    },
    {
        id: 'clkv6unu1023yl2rs1tk01r11',
        title: 'mesoporous silica',
        parents: {
            connect: [
                {
                    id: 'clkv6unt7023kl2rspu95t30s'
                }
            ]
        }
    },
    {
        id: 'clkv6unuj0246l2rs30670tok',
        title: 'metal oxide',
        parents: {
            connect: [
                {
                    id: 'clkv6unuf0244l2rsr7l800qm'
                }
            ]
        }
    },
    {
        id: 'clkv6unvx024sl2rsfp7m0eon',
        title: 'organic inorganic',
        parents: {
            connect: [
                {
                    id: 'clkv6unuf0244l2rsr7l800qm'
                }
            ]
        }
    },
    {
        id: 'clkv6unwa024yl2rs2ph0iu6q',
        title: 'phosphors',
        parents: {
            connect: [
                {
                    id: 'clkv6unw6024wl2rsl6yti6oh'
                }
            ]
        }
    },
    {
        id: 'clkv6unwj0252l2rsvd6gsdzp',
        title: 'surface plasmon',
        parents: {
            connect: [
                {
                    id: 'clkv6unw6024wl2rsl6yti6oh'
                }
            ]
        }
    },
    {
        id: 'clkv6unwy0258l2rs6zce83aq',
        title: 'oled',
        parents: {
            connect: [
                {
                    id: 'clkv6unwu0256l2rsakh2hern'
                }
            ]
        }
    },
    {
        id: 'clkv6unx7025cl2rsr7uev5hr',
        title: 'microelectronics',
        parents: {
            connect: [
                {
                    id: 'clkv6unx3025al2rsec0sadn8'
                }
            ]
        }
    },
    {
        id: 'clkv6unxg025gl2rsyx2wztv4',
        title: 'microfluid',
        parents: {
            connect: [
                {
                    id: 'clkv6unx3025al2rsec0sadn8'
                }
            ]
        }
    },
    {
        id: 'clkv6unxk025il2rsf52niw6o',
        title: 'nanoparticles based',
        parents: {
            connect: [
                {
                    id: 'clkv6unx3025al2rsec0sadn8'
                }
            ]
        }
    },
    {
        id: 'clkv6unxy025ol2rs13h2v99t',
        title: 'nanowires',
        parents: {
            connect: [
                {
                    id: 'clkv6unx3025al2rsec0sadn8'
                }
            ]
        }
    },
    {
        id: 'clkv6uny2025ql2rsdugfwc90',
        title: 'polycrystalline',
        parents: {
            connect: [
                {
                    id: 'clkv6unx3025al2rsec0sadn8'
                }
            ]
        }
    },
    {
        id: 'clkv6unz80268l2rs0m42tx62',
        title: 'developments microwave',
        parents: {
            connect: [
                {
                    id: 'clkv6uny7025sl2rsrmy3sf63'
                }
            ]
        }
    },
    {
        id: 'clkv6unzf026al2rs1mvi5h8o',
        title: 'dielectric',
        parents: {
            connect: [
                {
                    id: 'clkv6uny7025sl2rsrmy3sf63'
                }
            ]
        }
    },
    {
        id: 'clkv6uo11026yl2rs39ygw8li',
        title: 'interconnection',
        parents: {
            connect: [
                {
                    id: 'clkv6uny7025sl2rsrmy3sf63'
                }
            ]
        }
    },
    {
        id: 'clkv6uo1e0274l2rsypcxi9ln',
        title: 'carbide based',
        parents: {
            connect: [
                {
                    id: 'clkv6uo1a0272l2rsnri3sp4n'
                }
            ]
        }
    },
    {
        id: 'clkv6uo2a027el2rszg6oa2sa',
        title: 'glassy polymers',
        parents: {
            connect: [
                {
                    id: 'clkv6uo26027cl2rs9kzn2one'
                }
            ]
        }
    },
    {
        id: 'clkv6uo2s027ml2rsj7mdh862',
        title: 'laser applications',
        parents: {
            connect: [
                {
                    id: 'clkv6uo26027cl2rs9kzn2one'
                }
            ]
        }
    },
    {
        id: 'clkv6uo36027sl2rsckix30g0',
        title: 'microscope',
        parents: {
            connect: [
                {
                    id: 'clkv6uo26027cl2rs9kzn2one'
                }
            ]
        }
    },
    {
        id: 'clkv6uo3o0280l2rs5zketymp',
        title: 'near infrared',
        parents: {
            connect: [
                {
                    id: 'clkv6uo26027cl2rs9kzn2one'
                }
            ]
        }
    },
    {
        id: 'clkv6uo460288l2rsutsidwmz',
        title: 'photonic',
        parents: {
            connect: [
                {
                    id: 'clkv6uo26027cl2rs9kzn2one'
                }
            ]
        }
    },
    {
        id: 'clkv6uo5j028ql2rsnxgr7o0w',
        title: 'acoustic performance',
        parents: {
            connect: [
                {
                    id: 'clkv6uo5f028ol2rscfini3z3'
                }
            ]
        }
    },
    {
        id: 'clkv6uo5w028wl2rs91zq4biz',
        title: 'staphylococcus',
        parents: {
            connect: [
                {
                    id: 'clkv6uofu02d8l2rssloc7lem'
                }
            ]
        }
    },
    {
        id: 'clkv6uo61028yl2rs8r6qvy1z',
        title: 'innate immunity',
        parents: {
            connect: [
                {
                    id: 'clkv6uoh502dsl2rshzf2zch0'
                }
            ]
        }
    },
    {
        id: 'clkv6uo6e0294l2rsvpm55b4k',
        title: 'pelvic pain',
        parents: {
            connect: [
                {
                    id: 'clkv6uo5n028sl2rszjc9g207'
                }
            ]
        }
    },
    {
        id: 'clkv6uo6x029cl2rsrxfm7jot',
        title: 'cadmium',
        parents: {
            connect: [
                {
                    id: 'clkv6uoas02b2l2rsofcfmccp'
                }
            ]
        }
    },
    {
        id: 'clkv6uo72029el2rszuke4o0q',
        title: 'bloodstream infection',
        parents: {
            connect: [
                {
                    id: 'clkv6uo6a0292l2rs299k3boy'
                }
            ]
        }
    },
    {
        id: 'clkv6uo7b029il2rsk5gbfouo',
        title: 'human pathogen',
        parents: {
            connect: [
                {
                    id: 'clkv6uo6a0292l2rs299k3boy'
                }
            ]
        }
    },
    {
        id: 'clkv6uo7v029ql2rs86ek9lpx',
        title: 'infections common',
        parents: {
            connect: [
                {
                    id: 'clkv6uo6a0292l2rs299k3boy'
                }
            ]
        }
    },
    {
        id: 'clkv6uo7z029sl2rsuoiuzyfq',
        title: 'allergic',
        parents: {
            connect: [
                {
                    id: 'clkv6upgx02r8l2rs262pgwor'
                }
            ]
        }
    },
    {
        id: 'clkv6uo8h02a0l2rszqxksr02',
        title: 'opportunistic infection',
        parents: {
            connect: [
                {
                    id: 'clkv6uo6a0292l2rs299k3boy'
                }
            ]
        }
    },
    {
        id: 'clkv6uo8q02a4l2rsjoxyga22',
        title: 'asthma',
        parents: {
            connect: [
                {
                    id: 'clkv6umz101s4l2rsk31zex3i'
                },
                {
                    id: 'clkv6upgx02r8l2rs262pgwor'
                }
            ]
        }
    },
    {
        id: 'clkv6uo9g02agl2rs710g0r9j',
        title: 'vitamin',
        parents: {
            connect: [
                {
                    id: 'clkv6uob102b6l2rsz3dqlsz4'
                }
            ]
        }
    },
    {
        id: 'clkv6uo9k02ail2rsowrnovsp',
        title: 'multidrug resistance',
        parents: {
            connect: [
                {
                    id: 'clkv6uohj02dyl2rswqu3adtf'
                }
            ]
        }
    },
    {
        id: 'clkv6uo9p02akl2rshfdswoxd',
        title: 'aerobic glycolysis',
        parents: {
            connect: [
                {
                    id: 'clkv6ui7u0006l2rsv2v47fbd'
                }
            ]
        }
    },
    {
        id: 'clkv6uo9t02aml2rs2tsolkb5',
        title: 'parasite illness',
        parents: {
            connect: [
                {
                    id: 'clkv6uo6a0292l2rs299k3boy'
                }
            ]
        }
    },
    {
        id: 'clkv6uo9x02aol2rsz2qu23ls',
        title: 'pneumoniae',
        parents: {
            connect: [
                {
                    id: 'clkv6uo6a0292l2rs299k3boy'
                }
            ]
        }
    },
    {
        id: 'clkv6uoa102aql2rscajik2uw',
        title: 'factor cardiovascular',
        parents: {
            connect: [
                {
                    id: 'clkv6uo7p029ol2rsiotco0wf'
                }
            ]
        }
    },
    {
        id: 'clkv6uoa602asl2rs69r5r1v6',
        title: 'growth hormone',
        parents: {
            connect: [
                {
                    id: 'clkv6uo7p029ol2rsiotco0wf'
                }
            ]
        }
    },
    {
        id: 'clkv6uoae02awl2rskgc8ammh',
        title: 'viral disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uo6a0292l2rs299k3boy'
                }
            ]
        }
    },
    {
        id: 'clkv6uoan02b0l2rsff8wxhxp',
        title: 'avian influenza',
        parents: {
            connect: [
                {
                    id: 'clkv6uoai02ayl2rs5cv3xhta'
                }
            ]
        }
    },
    {
        id: 'clkv6uob602b8l2rsomzkxjih',
        title: 'reactive oxygen',
        parents: {
            connect: [
                {
                    id: 'clkv6uob102b6l2rsz3dqlsz4'
                }
            ]
        }
    },
    {
        id: 'clkv6uoba02bal2rs99gobl2k',
        title: 'paget disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uo9c02ael2rs2u3d8we2'
                }
            ]
        }
    },
    {
        id: 'clkv6uobj02bel2rs4qogmytb',
        title: 'coronavirus',
        parents: {
            connect: [
                {
                    id: 'clkv6uo7k029ml2rsqrhdlzv3'
                }
            ]
        }
    },
    {
        id: 'clkv6uoc402bol2rs3tnta5i6',
        title: 'fever',
        parents: {
            connect: [
                {
                    id: 'clkv6uoai02ayl2rs5cv3xhta'
                }
            ]
        }
    },
    {
        id: 'clkv6uoc802bql2rsd2t077sc',
        title: 'human herpesvirus',
        parents: {
            connect: [
                {
                    id: 'clkv6uo7k029ml2rsqrhdlzv3'
                }
            ]
        }
    },
    {
        id: 'clkv6uodb02c8l2rsad88evha',
        title: 'plasmodium',
        parents: {
            connect: [
                {
                    id: 'clkv6uod302c4l2rs7ml19z3s'
                }
            ]
        }
    },
    {
        id: 'clkv6uodp02cel2rscbbvnkyb',
        title: 'chagas disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uod702c6l2rs3thozxnq'
                }
            ]
        }
    },
    {
        id: 'clkv6uoe502ckl2rsliq588km',
        title: 'postmenopausal women',
        parents: {
            connect: [
                {
                    id: 'clkv6uodz02cil2rskk39wpsp'
                }
            ]
        }
    },
    {
        id: 'clkv6uoea02cml2rsrqprgwrj',
        title: 'rhinosinusitis',
        parents: {
            connect: [
                {
                    id: 'clkv6uod702c6l2rs3thozxnq'
                }
            ]
        }
    },
    {
        id: 'clkv6uoeq02csl2rswko9q6lb',
        title: 'fungal infection',
        parents: {
            connect: [
                {
                    id: 'clkv6uofu02d8l2rssloc7lem'
                }
            ]
        }
    },
    {
        id: 'clkv6uocu02c0l2rs67ybx8b3',
        title: 'Pests',
        parents: {
            connect: [
                {
                    id: 'clkv6uiut008il2rss8m7wa1w'
                },
                {
                    id: 'clkv6uiv6008kl2rs61tnwvbn'
                }
            ]
        }
    },
    {
        id: 'clkv6uohs02e2l2rs5j3ftqq4',
        title: 'bladder',
        parents: {
            connect: [
                {
                    id: 'clkv6uogr02dml2rsarzt16pg'
                }
            ]
        }
    },
    {
        id: 'clkv6uohw02e4l2rsu1kn9476',
        title: 'antibiotic',
        parents: {
            connect: [
                {
                    id: 'clkv6uohj02dyl2rswqu3adtf'
                }
            ]
        }
    },
    {
        id: 'clkv6uojr02esl2rso33lt7wy',
        title: 'human bacterial',
        parents: {
            connect: [
                {
                    id: 'clkv6uofu02d8l2rssloc7lem'
                }
            ]
        }
    },
    {
        id: 'clkv6uojw02eul2rssu9ia45j',
        title: 'bacterial wilt',
        parents: {
            connect: [
                {
                    id: 'clkv6uiut008il2rss8m7wa1w'
                }
            ]
        }
    },
    {
        id: 'clkv6uol402f8l2rs1o667ed4',
        title: 'soft tissue',
        parents: {
            connect: [
                {
                    id: 'clkv6uokp02f2l2rsqvuovqr9'
                }
            ]
        }
    },
    {
        id: 'clkv6uole02fcl2rsrj98mkvx',
        title: 'osteoporosis',
        parents: {
            connect: [
                {
                    id: 'clkv6uok602eyl2rszou5l0zj'
                }
            ]
        }
    },
    {
        id: 'clkv6uomn02fsl2rsncgfpmld',
        title: 'chromosomal abnormality',
        parents: {
            connect: [
                {
                    id: 'clkv6uomi02fql2rsiitnrxm6'
                }
            ]
        }
    },
    {
        id: 'clkv6uon902g0l2rsmk7j66oc',
        title: 'kinase inhibitor',
        parents: {
            connect: [
                {
                    id: 'clkv6uon102fyl2rsq18xnbbo'
                }
            ]
        }
    },
    {
        id: 'clkv6uooi02gel2rsl17codig',
        title: 'basal cell',
        parents: {
            connect: [
                {
                    id: 'clkv6uoo602gcl2rs8hxna8oo'
                }
            ]
        }
    },
    {
        id: 'clkv6uoom02ggl2rsp8kbapqk',
        title: 'cell death',
        parents: {
            connect: [
                {
                    id: 'clkv6uoo602gcl2rs8hxna8oo'
                }
            ]
        }
    },
    {
        id: 'clkv6uop102gml2rs5lx2ohr8',
        title: 'medullary thyroid',
        parents: {
            connect: [
                {
                    id: 'clkv6uoox02gkl2rso7suhj37'
                }
            ]
        }
    },
    {
        id: 'clkv6uop602gol2rskyndr3ma',
        title: 'papillary mucinous',
        parents: {
            connect: [
                {
                    id: 'clkv6uoox02gkl2rso7suhj37'
                }
            ]
        }
    },
    {
        id: 'clkv6uopb02gql2rsk3z73vxd',
        title: 'salivary glands',
        parents: {
            connect: [
                {
                    id: 'clkv6uoox02gkl2rso7suhj37'
                }
            ]
        }
    },
    {
        id: 'clkv6uopg02gsl2rsakbrafpm',
        title: 'thymoma common',
        parents: {
            connect: [
                {
                    id: 'clkv6uoox02gkl2rso7suhj37'
                }
            ]
        }
    },
    {
        id: 'clkv6uopp02gwl2rs5ru918lc',
        title: 'adenomatoid',
        parents: {
            connect: [
                {
                    id: 'clkv6uopl02gul2rs2034ap9f'
                }
            ]
        }
    },
    {
        id: 'clkv6uoqv02hel2rsmiu5till',
        title: 'peripheral neuroepitheliomas',
        parents: {
            connect: [
                {
                    id: 'clkv6uoqm02hal2rsujdb2dn9'
                }
            ]
        }
    },
    {
        id: 'clkv6uor502hil2rse044dhgv',
        title: 'cancer cell',
        parents: {
            connect: [
                {
                    id: 'clkv6uopl02gul2rs2034ap9f'
                }
            ]
        }
    },
    {
        id: 'clkv6uorg02hml2rsx3bauuk7',
        title: 'cancer molecular',
        parents: {
            connect: [
                {
                    id: 'clkv6uopl02gul2rs2034ap9f'
                }
            ]
        }
    },
    {
        id: 'clkv6uors02hql2rsjk9c56i9',
        title: 'cancer sixth',
        parents: {
            connect: [
                {
                    id: 'clkv6uopl02gul2rs2034ap9f'
                }
            ]
        }
    },
    {
        id: 'clkv6uos302hul2rsar6njklz',
        title: 'chemotherapy induced',
        parents: {
            connect: [
                {
                    id: 'clkv6uory02hsl2rsscne8cww'
                }
            ]
        }
    },
    {
        id: 'clkv6uosv02i6l2rsvfkmt575',
        title: 'hodgkin lymphoma',
        parents: {
            connect: [
                {
                    id: 'clkv6uosq02i4l2rs33v94hh2'
                }
            ]
        }
    },
    {
        id: 'clkv6uot102i8l2rsyf5tiewk',
        title: 'intraocular lymphoma',
        parents: {
            connect: [
                {
                    id: 'clkv6uosq02i4l2rs33v94hh2'
                }
            ]
        }
    },
    {
        id: 'clkv6uot702ial2rs8nwneof1',
        title: 'leukemia',
        parents: {
            connect: [
                {
                    id: 'clkv6uosq02i4l2rs33v94hh2'
                }
            ]
        }
    },
    {
        id: 'clkv6uotc02icl2rsfringygf',
        title: 'lymphoproliferative disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uosq02i4l2rs33v94hh2'
                }
            ]
        }
    },
    {
        id: 'clkv6uoth02iel2rs0rsnhx7f',
        title: 'myelogenous leukemia',
        parents: {
            connect: [
                {
                    id: 'clkv6uosq02i4l2rs33v94hh2'
                }
            ]
        }
    },
    {
        id: 'clkv6uou702iol2rs58m8g7rd',
        title: 'malignancy',
        parents: {
            connect: [
                {
                    id: 'clkv6uopl02gul2rs2034ap9f'
                }
            ]
        }
    },
    {
        id: 'clkv6uouc02iql2rsxjkgorck',
        title: 'metastasis',
        parents: {
            connect: [
                {
                    id: 'clkv6uopl02gul2rs2034ap9f'
                }
            ]
        }
    },
    {
        id: 'clkv6uout02iyl2rsfenvwpbc',
        title: 'sarcoma',
        parents: {
            connect: [
                {
                    id: 'clkv6uopl02gul2rs2034ap9f'
                }
            ]
        }
    },
    {
        id: 'clkv6uov202j2l2rsjpa1gjle',
        title: 'tumor',
        parents: {
            connect: [
                {
                    id: 'clkv6uopl02gul2rs2034ap9f'
                }
            ]
        }
    },
    {
        id: 'clkv6uovn02j8l2rs98poiucx',
        title: 'aortic valve',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6uovt02jal2rssvm6vg7u',
        title: 'cardiomyopathy',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6uovy02jcl2rs6ozgzgq9',
        title: 'coronary artery',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6uow702jgl2rsov3eo70n',
        title: 'disorder endothelial',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6uowy02jql2rsbg1yr84q',
        title: 'heart failure',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6uoxc02jwl2rspxhxp6qg',
        title: 'ischemic diseases',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6uoxq02k2l2rsrb2c8pj2',
        title: 'thalassemia characterized',
        parents: {
            connect: [
                {
                    id: 'clkv6uis5007ml2rsmdas1r2p'
                },
                {
                    id: 'clkv6uoxl02k0l2rs2phvhusw'
                }
            ]
        }
    },
    {
        id: 'clkv6uoxu02k4l2rs3ap7e8ps',
        title: 'chronic kidney',
        parents: {
            connect: [
                {
                    id: 'clkv6uoxh02jyl2rsa2b0u0qw'
                }
            ]
        }
    },
    {
        id: 'clkv6uoxy02k6l2rsmjuq50wb',
        title: 'dialysis',
        parents: {
            connect: [
                {
                    id: 'clkv6uoxh02jyl2rsa2b0u0qw'
                }
            ]
        }
    },
    {
        id: 'clkv6uoy202k8l2rsal4bzcw5',
        title: 'nephropathy',
        parents: {
            connect: [
                {
                    id: 'clkv6uoxh02jyl2rsa2b0u0qw'
                }
            ]
        }
    },
    {
        id: 'clkv6uoyc02kcl2rsje23zr0m',
        title: 'stage renal',
        parents: {
            connect: [
                {
                    id: 'clkv6uoxh02jyl2rsa2b0u0qw'
                }
            ]
        }
    },
    {
        id: 'clkv6uoyh02kel2rsvt65ycb5',
        title: 'myocardial infarction',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6uoyl02kgl2rs2se0tcfq',
        title: 'necrosis factor',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6uoz502kol2rsvplbewy8',
        title: 'hypertension',
        parents: {
            connect: [
                {
                    id: 'clkv6uoz102kml2rsl1b9suu4'
                }
            ]
        }
    },
    {
        id: 'clkv6uozf02ksl2rsmbuipr81',
        title: 'hyperglycemia',
        parents: {
            connect: [
                {
                    id: 'clkv6umyg01ryl2rsmidggye5'
                },
                {
                    id: 'clkv6uoyw02kkl2rspsgbdrw7'
                }
            ]
        }
    },
    {
        id: 'clkv6up0402l0l2rsutw4ng5a',
        title: 'obesity worldwide',
        parents: {
            connect: [
                {
                    id: 'clkv6uozt02kwl2rscnr2a5lw'
                }
            ]
        }
    },
    {
        id: 'clkv6up0a02l2l2rsepisfi8m',
        title: 'insulin resistance',
        parents: {
            connect: [
                {
                    id: 'clkv6uoyw02kkl2rspsgbdrw7'
                }
            ]
        }
    },
    {
        id: 'clkv6up0k02l6l2rsd97xfe7m',
        title: 'right ventricular',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6up0t02lal2rs018togic',
        title: 'venous thromboembolic',
        parents: {
            connect: [
                {
                    id: 'clkv6uovb02j6l2rs9ib1gnfm'
                }
            ]
        }
    },
    {
        id: 'clkv6up2c02lwl2rsjajwvv2x',
        title: 'cholelithiasis',
        parents: {
            connect: [
                {
                    id: 'clkv6uogw02dol2rsa10ttaur'
                }
            ]
        }
    },
    {
        id: 'clkv6up4i02mgl2rsm3jt7wsx',
        title: 'chronic inflammation',
        parents: {
            connect: [
                {
                    id: 'clkv6uogw02dol2rsa10ttaur'
                }
            ]
        }
    },
    {
        id: 'clkv6up6i02n6l2rseqfihm59',
        title: 'alopecia',
        parents: {
            connect: [
                {
                    id: 'clkv6umxp01rml2rsgbt85zcx'
                },
                {
                    id: 'clkv6uory02hsl2rsscne8cww'
                }
            ]
        }
    },
    {
        id: 'clkv6up7o02nml2rsst3soo8m',
        title: 'fibrosis',
        parents: {
            connect: [
                {
                    id: 'clkv6uogw02dol2rsa10ttaur'
                }
            ]
        }
    },
    {
        id: 'clkv6up8d02nyl2rsxcjnnggc',
        title: 'diarrheal',
        parents: {
            connect: [
                {
                    id: 'clkv6up8902nwl2rs9141f8en'
                }
            ]
        }
    },
    {
        id: 'clkv6up8i02o0l2rs4hnedw6w',
        title: 'disease gastro',
        parents: {
            connect: [
                {
                    id: 'clkv6up8902nwl2rs9141f8en'
                }
            ]
        }
    },
    {
        id: 'clkv6up9202o8l2rsi62eai91',
        title: 'ulcer',
        parents: {
            connect: [
                {
                    id: 'clkv6up8902nwl2rs9141f8en'
                }
            ]
        }
    },
    {
        id: 'clkv6up9702oal2rsb5wztwci',
        title: 'ulcerative colitis',
        parents: {
            connect: [
                {
                    id: 'clkv6up8902nwl2rs9141f8en'
                }
            ]
        }
    },
    {
        id: 'clkv6up9b02ocl2rs9duhdn3k',
        title: 'chronic liver',
        parents: {
            connect: [
                {
                    id: 'clkv6up8502nul2rs9spmedjt'
                }
            ]
        }
    },
    {
        id: 'clkv6up9g02oel2rsyt9khzrg',
        title: 'fatty liver',
        parents: {
            connect: [
                {
                    id: 'clkv6up8502nul2rs9spmedjt'
                }
            ]
        }
    },
    {
        id: 'clkv6up9k02ogl2rsd44509rh',
        title: 'hepatocellular carcinoma',
        parents: {
            connect: [
                {
                    id: 'clkv6up8502nul2rs9spmedjt'
                }
            ]
        }
    },
    {
        id: 'clkv6up9o02oil2rss9wocw5x',
        title: 'infectious hepatitis',
        parents: {
            connect: [
                {
                    id: 'clkv6up8502nul2rs9spmedjt'
                }
            ]
        }
    },
    {
        id: 'clkv6up9t02okl2rskk6btbdx',
        title: 'nonalcoholic steatohepatitis',
        parents: {
            connect: [
                {
                    id: 'clkv6up8502nul2rs9spmedjt'
                }
            ]
        }
    },
    {
        id: 'clkv6upa102ool2rs9chn59bm',
        title: 'autoinflammatory disorders',
        parents: {
            connect: [
                {
                    id: 'clkv6umy701rul2rscu18o7ue'
                },
                {
                    id: 'clkv6uogw02dol2rsa10ttaur'
                }
            ]
        }
    },
    {
        id: 'clkv6upbt02pel2rsa7qq4gdd',
        title: 'bipolar depressive',
        parents: {
            connect: [
                {
                    id: 'clkv6upbn02pcl2rsza39blax'
                }
            ]
        }
    },
    {
        id: 'clkv6upd302pwl2rsepbkfkum',
        title: 'neurodegenerative',
        parents: {
            connect: [
                {
                    id: 'clkv6un2k01tkl2rs4gdwxmfe'
                },
                {
                    id: 'clkv6upcx02pul2rsfn0nfimb'
                }
            ]
        }
    },
    {
        id: 'clkv6upg702qyl2rs08b94ri9',
        title: 'spastic paraplegias',
        parents: {
            connect: [
                {
                    id: 'clkv6upg202qwl2rs2ra5qdr7'
                }
            ]
        }
    },
    {
        id: 'clkv6uph302ral2rsq3ckrtnb',
        title: 'allergens',
        parents: {
            connect: [
                {
                    id: 'clkv6upgx02r8l2rs262pgwor'
                }
            ]
        }
    },
    {
        id: 'clkv6uphv02ril2rsb2qmyk78',
        title: 'obstructive pulmonary',
        parents: {
            connect: [
                {
                    id: 'clkv6upgt02r6l2rsgv0bs96a'
                }
            ]
        }
    },
    {
        id: 'clkv6uphz02rkl2rsurj2yafz',
        title: 'pulmonary hypertension',
        parents: {
            connect: [
                {
                    id: 'clkv6umyu01s2l2rs70m0wr8x'
                },
                {
                    id: 'clkv6upgt02r6l2rsgv0bs96a'
                }
            ]
        }
    },
    {
        id: 'clkv6upi402rml2rsyfh22swj',
        title: 'pulmonary embolism',
        parents: {
            connect: [
                {
                    id: 'clkv6umyu01s2l2rs70m0wr8x'
                },
                {
                    id: 'clkv6upgt02r6l2rsgv0bs96a'
                }
            ]
        }
    },
    {
        id: 'clkv6upij02rsl2rsiooj8lb7',
        title: 'lung disease',
        parents: {
            connect: [
                {
                    id: 'clkv6upgt02r6l2rsgv0bs96a'
                }
            ]
        }
    },
    {
        id: 'clkv6upit02rwl2rs8ektpbd5',
        title: 'respiratory syncytial',
        parents: {
            connect: [
                {
                    id: 'clkv6upgt02r6l2rsgv0bs96a'
                }
            ]
        }
    },
    {
        id: 'clkv6upj202s0l2rs3lk1r74m',
        title: 'tuberculosis nowadays',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                },
                {
                    id: 'clkv6upgt02r6l2rsgv0bs96a'
                }
            ]
        }
    },
    {
        id: 'clkv6upj702s2l2rsgu9bs2nh',
        title: 'skin disorders',
        parents: {
            connect: [
                {
                    id: 'clkv6umze01sal2rs2dydct7q'
                },
                {
                    id: 'clkv6uogw02dol2rsa10ttaur'
                }
            ]
        }
    },
    {
        id: 'clkv6upma02t8l2rs8x1a1s5s',
        title: 'crop production',
        parents: {
            connect: [
                {
                    id: 'clkv6uiut008il2rss8m7wa1w'
                }
            ]
        }
    },
    {
        id: 'clkv6uq44030kl2rsi7s2u6o9',
        title: 'epitaxial growth',
        parents: {
            connect: [
                {
                    id: 'clkv6ungj01z2l2rsxwj2nev4'
                }
            ]
        }
    },
    {
        id: 'clkv6uq6s031ql2rsa7qtlpyc',
        title: 'carbon sequestration',
        parents: {
            connect: [
                {
                    id: 'clkv6uq6o031ol2rsdmyhiamp'
                }
            ]
        }
    },
    {
        id: 'clkv6uq71031ul2rscek4mc80',
        title: 'fossil fuel',
        parents: {
            connect: [
                {
                    id: 'clkv6uq6o031ol2rsdmyhiamp'
                }
            ]
        }
    },
    {
        id: 'clkv6uq79031yl2rsb4nt4v23',
        title: 'heavy metal',
        parents: {
            connect: [
                {
                    id: 'clkv6uq75031wl2rs9i17nktz'
                }
            ]
        }
    },
    {
        id: 'clkv6uq7n0324l2rsz9ztbxzc',
        title: 'irrigated agriculture',
        parents: {
            connect: [
                {
                    id: 'clkv6uq7i0322l2rsweut4bpi'
                }
            ]
        }
    },
    {
        id: 'clkv6uq7r0326l2rsib2z9fz8',
        title: 'soil organic',
        parents: {
            connect: [
                {
                    id: 'clkv6uq7i0322l2rsweut4bpi'
                }
            ]
        }
    },
    {
        id: 'clkv6uq7w0328l2rsciwzy3tl',
        title: 'wastewater',
        parents: {
            connect: [
                {
                    id: 'clkv6uq7i0322l2rsweut4bpi'
                }
            ]
        }
    },
    {
        id: 'clx33loas00008ngpifhztsn9',
        title: 'Plant disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uiut008il2rss8m7wa1w'
                }
            ]
        }
    },
    {
        id: 'clkv6unyb025ul2rs11rkvy4v',
        title: 'Semiconductors',
        parents: {
            connect: [
                {
                    id: 'clkv6uny7025sl2rsrmy3sf63'
                }
            ]
        }
    },
    {
        id: 'clkv6uohe02dwl2rstxm1mydy',
        title: 'Poultry diseases',
        parents: {
            connect: [
                {
                    id: 'clkv6uivc008ml2rsztxbm01f'
                },
                {
                    id: 'clkv6uma901j2l2rsrz5ynuc2'
                }
            ]
        }
    },
    {
        id: 'cly468yr7000d7ryz957r1m4a',
        title: 'Air pollution',
        parents: {
            connect: [
                {
                    id: 'clkv6umg701lel2rsspppgoem'
                }
            ]
        }
    },
    {
        id: 'cly468z1k001r7ryz8vuhxy09',
        title: 'Collective agreements',
        parents: {
            connect: [
                {
                    id: 'clkv6uloc01asl2rsonw0aikx'
                },
                {
                    id: 'cly468z1e001q7ryzbmskntnn'
                }
            ]
        }
    },
    {
        id: 'cly468zhm004b7ryzy93xd6to',
        title: 'Healthcare policy',
        parents: {
            connect: [
                {
                    id: 'cly468zfd003y7ryzoeleyai4'
                },
                {
                    id: 'cly468zh500487ryzrc5kgwfh'
                }
            ]
        }
    },
    {
        id: 'cly468zve006j7ryzhoby5u2f',
        title: 'Oceans',
        parents: {
            connect: [
                {
                    id: 'clkv6uq4q030ul2rsrngk7zf4'
                }
            ]
        }
    },
    {
        id: 'cly468zw2006n7ryz2zvxtuxj',
        title: 'Post-war reconstruction',
        parents: {
            connect: [
                {
                    id: 'cly468yoi00017ryzu49uigcw'
                },
                {
                    id: 'cly468zdc003l7ryzr1939mt0'
                }
            ]
        }
    },
    {
        id: 'cly46908d008p7ryz4lsn9slt',
        title: 'State-owned enterprise',
        parents: {
            connect: [
                {
                    id: 'cly468ztt00697ryzfn0j6xlf'
                }
            ]
        }
    },
    {
        id: 'cly4690dr00997ryzxt9ef6d0',
        title: 'Television industry',
        parents: {
            connect: [
                {
                    id: 'cly4690da00967ryzyo70nyoh'
                }
            ]
        }
    },
    {
        id: 'cly4690gd009k7ryzjiy6zdsd',
        title: 'Viniculture',
        parents: {
            connect: [
                {
                    id: 'clkv6uiut008il2rss8m7wa1w'
                }
            ]
        }
    },
    {
        id: 'cly4690hw009r7ryzduazw3r8',
        title: 'Water supply',
        parents: {
            connect: [
                {
                    id: 'cly4690f8009h7ryzvwwyc6rj'
                }
            ]
        }
    },
    {
        id: 'cly4690mm00ah7ryzubqy2w7t',
        title: 'Online media outlet',
        parents: {
            connect: [
                {
                    id: 'cly468zv2006h7ryz7uez83km'
                }
            ]
        }
    },
    {
        id: 'cly4690mr00ai7ryzjgnzmqhj',
        title: 'Olympic games',
        parents: {
            connect: [
                {
                    id: 'cly4690c100927ryzw7c4npqa'
                }
            ]
        }
    },
    {
        id: 'cly4690n200ak7ryzlqn311g9',
        title: 'Paralympic games',
        parents: {
            connect: [
                {
                    id: 'cly4690c100927ryzw7c4npqa'
                }
            ]
        }
    },
    {
        id: 'clkv6ui7p0004l2rsrzd2osox',
        title: 'cryogenic',
        parents: {
            connect: [
                {
                    id: 'clkv6unox0220l2rscqznv5ci'
                }
            ]
        }
    },
    {
        id: 'clkv6ujis00ial2rs5fvjujic',
        title: 'Subjection of Italy, 343-290',
        parents: {
            connect: [
                {
                    id: 'clkv6ujin00i8l2rs7drrhsjf'
                }
            ]
        }
    },
    {
        id: 'clkv6ujiw00icl2rsitybd86i',
        title: 'Conquest of Mediterranean world. 264-133',
        parents: {
            connect: [
                {
                    id: 'clkv6ujin00i8l2rs7drrhsjf'
                }
            ]
        }
    },
    {
        id: 'clkv6ujku00j2l2rs42sxekti',
        title: '489-774. Gothic and Lombard kingdoms. Byzantine exarchate, 553-568',
        parents: {
            connect: [
                {
                    id: 'clkv6ujkn00j0l2rsvsekirtn'
                }
            ]
        }
    },
    {
        id: 'clkv6ujkz00j4l2rsjtp03qkz',
        title: '774-1268. Frankish and German emperors',
        parents: {
            connect: [
                {
                    id: 'clkv6ujkn00j0l2rsvsekirtn'
                }
            ]
        }
    },
    {
        id: 'clkv6ujl800j6l2rsjfbk0226',
        title: 'Renaissance',
        parents: {
            connect: [
                {
                    id: 'clkv6ujby00fel2rs4oxsyhfv'
                }
            ]
        }
    },
    {
        id: 'clkv6ujlp00jcl2rse693ntgw',
        title: 'Kingdom of Italy',
        parents: {
            connect: [
                {
                    id: 'clkv6ujll00jal2rsuxqhvkmc'
                }
            ]
        }
    },
    {
        id: 'clkv6ujmb00jkl2rsf0o8dokn',
        title: '1848-1871. Risorgimento',
        parents: {
            connect: [
                {
                    id: 'clkv6ujlt00jel2rsqcj1z75d'
                }
            ]
        }
    },
    {
        id: 'clkv6ujmn00jol2rsdjt60oaj',
        title: '1919-1945. Fascism',
        parents: {
            connect: [
                {
                    id: 'clkv6ujlz00jgl2rs625qivro'
                }
            ]
        }
    },
    {
        id: 'clkv6uk8400r0l2rsxq8vof9v',
        title: 'Civil War, 1936-1939',
        parents: {
            connect: [
                {
                    id: 'clkv6uk7y00qyl2rsfxspovc9'
                }
            ]
        }
    },
    {
        id: 'clkv6ukor00x2l2rs4ufzulkv',
        title: 'Vietnamese Conflict',
        parents: {
            connect: [
                {
                    id: 'clkv6ukoj00x0l2rs9o0u9amm'
                }
            ]
        }
    },
    {
        id: 'clkv6ukox00x4l2rsq9cmlalx',
        title: 'Democratic Republic (North Vietnam), 1945-',
        parents: {
            connect: [
                {
                    id: 'clkv6ukoj00x0l2rs9o0u9amm'
                }
            ]
        }
    },
    {
        id: 'clkv6un3601tul2rs1fbmn4n1',
        title: 'effective antibacterial',
        parents: {
            connect: [
                {
                    id: 'clkv6un3101tsl2rset8hknh1'
                }
            ]
        }
    },
    {
        id: 'clkv6un3p01u0l2rsv6ov1vqw',
        title: 'biological soft',
        parents: {
            connect: [
                {
                    id: 'clkv6un3l01tyl2rszce4sbqz'
                }
            ]
        }
    },
    {
        id: 'clkv6un5b01uml2rsxd5hnhlg',
        title: 'separation processes',
        parents: {
            connect: [
                {
                    id: 'clkv6un5701ukl2rs1aykrxbr'
                }
            ]
        }
    },
    {
        id: 'clkv6un5t01uul2rsd6neq66h',
        title: 'environmental fatigue',
        parents: {
            connect: [
                {
                    id: 'clkv6un5o01usl2rsykfmirb1'
                }
            ]
        }
    },
    {
        id: 'clkv6un5x01uwl2rsp60nizhf',
        title: 'mechanical behavior',
        parents: {
            connect: [
                {
                    id: 'clkv6un5o01usl2rsykfmirb1'
                }
            ]
        }
    },
    {
        id: 'clkv6un6n01v4l2rsv4zi1p53',
        title: 'cavitation',
        parents: {
            connect: [
                {
                    id: 'clkv6un6g01v2l2rsnxsssx4g'
                }
            ]
        }
    },
    {
        id: 'clkv6un7p01vcl2rslhr274a0',
        title: 'wastewaters treatment',
        parents: {
            connect: [
                {
                    id: 'clkv6un6g01v2l2rsnxsssx4g'
                }
            ]
        }
    },
    {
        id: 'clkv6und301xkl2rstcqo8vti',
        title: 'ferromagnetic layers',
        parents: {
            connect: [
                {
                    id: 'clkv6uncy01xil2rs07c4glca'
                }
            ]
        }
    },
    {
        id: 'clkv6undb01xol2rslov2k5z7',
        title: 'magnetoresistance',
        parents: {
            connect: [
                {
                    id: 'clkv6und701xml2rsb0fquhgf'
                }
            ]
        }
    },
    {
        id: 'clkv6undx01xyl2rsn8jt98it',
        title: 'steel',
        parents: {
            connect: [
                {
                    id: 'clkv6undt01xwl2rsfkzz9iok'
                }
            ]
        }
    },
    {
        id: 'clkv6une201y0l2rsr9hj5qux',
        title: 'structural steel',
        parents: {
            connect: [
                {
                    id: 'clkv6undt01xwl2rsfkzz9iok'
                }
            ]
        }
    },
    {
        id: 'clkv6uneh01y6l2rsprx48hac',
        title: 'metals',
        parents: {
            connect: [
                {
                    id: 'clkv6unec01y4l2rsreamd7yh'
                }
            ]
        }
    },
    {
        id: 'clkv6unhy01zml2rsnua066py',
        title: 'electrochemical',
        parents: {
            connect: [
                {
                    id: 'clkv6unhu01zkl2rskqy70eqn'
                }
            ]
        }
    },
    {
        id: 'clkv6uniq01zwl2rs3eebgvh4',
        title: 'batteries libs',
        parents: {
            connect: [
                {
                    id: 'clkv6unil01zul2rsjh2gtu0f'
                }
            ]
        }
    },
    {
        id: 'clkv6unjy0208l2rsqegwag0s',
        title: 'solar energy',
        parents: {
            connect: [
                {
                    id: 'clkv6unil01zul2rsjh2gtu0f'
                }
            ]
        }
    },
    {
        id: 'clkv6unlg020ql2rsbp9pr8jz',
        title: 'carbon',
        parents: {
            connect: [
                {
                    id: 'clkv6unlb020ol2rsm1pjst4g'
                }
            ]
        }
    },
    {
        id: 'clkv6unmi0212l2rs27y8izew',
        title: 'hydrogen generation',
        parents: {
            connect: [
                {
                    id: 'clkv6unlb020ol2rsm1pjst4g'
                }
            ]
        }
    },
    {
        id: 'clkv6unp10222l2rsisu68ml2',
        title: 'nuclear reactor',
        parents: {
            connect: [
                {
                    id: 'clkv6unox0220l2rscqznv5ci'
                }
            ]
        }
    },
    {
        id: 'clkv6unpw022gl2rs1jl2nm31',
        title: 'photothermal therapy',
        parents: {
            connect: [
                {
                    id: 'clkv6unox0220l2rscqznv5ci'
                }
            ]
        }
    },
    {
        id: 'clkv6unq7022kl2rsn7ezd9ev',
        title: 'plasma',
        parents: {
            connect: [
                {
                    id: 'clkv6unox0220l2rscqznv5ci'
                }
            ]
        }
    },
    {
        id: 'clkv6unqc022ml2rs1wc3jzec',
        title: 'thermal properties',
        parents: {
            connect: [
                {
                    id: 'clkv6unox0220l2rscqznv5ci'
                }
            ]
        }
    },
    {
        id: 'clkv6unr6022yl2rs0zdsghoo',
        title: 'thermoplastics',
        parents: {
            connect: [
                {
                    id: 'clkv6unox0220l2rscqznv5ci'
                }
            ]
        }
    },
    {
        id: 'clkv6untf023ol2rsdg6e6h55',
        title: 'solidification',
        parents: {
            connect: [
                {
                    id: 'clkv6untb023ml2rsm4v2b75r'
                }
            ]
        }
    },
    {
        id: 'clkv6unto023sl2rs6e2rxvr9',
        title: 'high entropy',
        parents: {
            connect: [
                {
                    id: 'clkv6untk023ql2rs09wbhpun'
                }
            ]
        }
    },
    {
        id: 'clkv6untx023wl2rs0q8xingp',
        title: 'crystal growth',
        parents: {
            connect: [
                {
                    id: 'clkv6unts023ul2rsving4m6u'
                }
            ]
        }
    },
    {
        id: 'clkv6unu60240l2rsrcowvr01',
        title: 'hydrogels',
        parents: {
            connect: [
                {
                    id: 'clkv6unu1023yl2rs1tk01r11'
                }
            ]
        }
    },
    {
        id: 'clkv6unua0242l2rshkjt6v0f',
        title: 'silica',
        parents: {
            connect: [
                {
                    id: 'clkv6unu1023yl2rs1tk01r11'
                }
            ]
        }
    },
    {
        id: 'clkv6unun0248l2rs4ihjnuiz',
        title: 'complex oxides',
        parents: {
            connect: [
                {
                    id: 'clkv6unuj0246l2rs30670tok'
                }
            ]
        }
    },
    {
        id: 'clkv6unus024al2rs34kio9sh',
        title: 'nitride materials',
        parents: {
            connect: [
                {
                    id: 'clkv6unuj0246l2rs30670tok'
                }
            ]
        }
    },
    {
        id: 'clkv6unvf024kl2rso1v6z2jp',
        title: 'oxide surface',
        parents: {
            connect: [
                {
                    id: 'clkv6unuj0246l2rs30670tok'
                }
            ]
        }
    },
    {
        id: 'clkv6unvk024ml2rswdhes28m',
        title: 'sulfides',
        parents: {
            connect: [
                {
                    id: 'clkv6unuj0246l2rs30670tok'
                }
            ]
        }
    },
    {
        id: 'clkv6unvs024ql2rs14wwc8ly',
        title: 'zinc oxide',
        parents: {
            connect: [
                {
                    id: 'clkv6unuj0246l2rs30670tok'
                }
            ]
        }
    },
    {
        id: 'clkv6unw1024ul2rsvj24u06q',
        title: 'properties organic',
        parents: {
            connect: [
                {
                    id: 'clkv6unvx024sl2rsfp7m0eon'
                }
            ]
        }
    },
    {
        id: 'clkv6unwe0250l2rsbuuz1roy',
        title: 'pyrolysis',
        parents: {
            connect: [
                {
                    id: 'clkv6unwa024yl2rs2ph0iu6q'
                }
            ]
        }
    },
    {
        id: 'clkv6unxb025el2rs2o59he4h',
        title: 'nanometer',
        parents: {
            connect: [
                {
                    id: 'clkv6unx7025cl2rsr7uev5hr'
                }
            ]
        }
    },
    {
        id: 'clkv6unxp025kl2rs82i6cl74',
        title: 'magnetic nanoparticles',
        parents: {
            connect: [
                {
                    id: 'clkv6unxk025il2rsf52niw6o'
                }
            ]
        }
    },
    {
        id: 'clkv6unxt025ml2rsm3a93ua9',
        title: 'nanostructures',
        parents: {
            connect: [
                {
                    id: 'clkv6unxk025il2rsf52niw6o'
                }
            ]
        }
    },
    {
        id: 'clkv6unyf025wl2rsftarfkhe',
        title: 'integrated circuits',
        parents: {
            connect: [
                {
                    id: 'clkv6unyb025ul2rs11rkvy4v'
                }
            ]
        }
    },
    {
        id: 'clkv6unyk025yl2rsyuetvftr',
        title: 'mosfet technology',
        parents: {
            connect: [
                {
                    id: 'clkv6unyb025ul2rs11rkvy4v'
                }
            ]
        }
    },
    {
        id: 'clkv6unyo0260l2rss8l6mveq',
        title: 'organic semiconductor',
        parents: {
            connect: [
                {
                    id: 'clkv6unyb025ul2rs11rkvy4v'
                }
            ]
        }
    },
    {
        id: 'clkv6unyt0262l2rsqvmn3b1e',
        title: 'semiconductor metal',
        parents: {
            connect: [
                {
                    id: 'clkv6unyb025ul2rs11rkvy4v'
                }
            ]
        }
    },
    {
        id: 'clkv6unyx0264l2rslv0rthxd',
        title: 'silicon',
        parents: {
            connect: [
                {
                    id: 'clkv6unyb025ul2rs11rkvy4v'
                }
            ]
        }
    },
    {
        id: 'clkv6unzl026cl2rssutx7sio',
        title: 'anode material',
        parents: {
            connect: [
                {
                    id: 'clkv6unzf026al2rs1mvi5h8o'
                }
            ]
        }
    },
    {
        id: 'clkv6uo01026il2rsc5j4ngib',
        title: 'dielectric constant',
        parents: {
            connect: [
                {
                    id: 'clkv6unzf026al2rs1mvi5h8o'
                }
            ]
        }
    },
    {
        id: 'clkv6uo06026kl2rsd7imeog6',
        title: 'flexible electronic',
        parents: {
            connect: [
                {
                    id: 'clkv6unzf026al2rs1mvi5h8o'
                }
            ]
        }
    },
    {
        id: 'clkv6uo0s026ul2rs7zkpc9vs',
        title: 'piezoelectric',
        parents: {
            connect: [
                {
                    id: 'clkv6unzf026al2rs1mvi5h8o'
                }
            ]
        }
    },
    {
        id: 'clkv6uo150270l2rsbjgpz8n5',
        title: 'transistors igbts',
        parents: {
            connect: [
                {
                    id: 'clkv6uo11026yl2rs39ygw8li'
                }
            ]
        }
    },
    {
        id: 'clkv6uo2f027gl2rsvaphlicb',
        title: 'glass fiber',
        parents: {
            connect: [
                {
                    id: 'clkv6uo2a027el2rszg6oa2sa'
                }
            ]
        }
    },
    {
        id: 'clkv6uo2o027kl2rs6q6x7rij',
        title: 'transparent materials',
        parents: {
            connect: [
                {
                    id: 'clkv6uo2a027el2rszg6oa2sa'
                }
            ]
        }
    },
    {
        id: 'clkv6uo2x027ol2rsc7u7kssq',
        title: 'laser diodes',
        parents: {
            connect: [
                {
                    id: 'clkv6uo2s027ml2rsj7mdh862'
                }
            ]
        }
    },
    {
        id: 'clkv6uo32027ql2rs9i4oapq1',
        title: 'ultrashort laser',
        parents: {
            connect: [
                {
                    id: 'clkv6uo2s027ml2rsj7mdh862'
                }
            ]
        }
    },
    {
        id: 'clkv6uo3b027ul2rs8s8ioscy',
        title: 'measurement techniques',
        parents: {
            connect: [
                {
                    id: 'clkv6uo36027sl2rsckix30g0'
                }
            ]
        }
    },
    {
        id: 'clkv6uo3f027wl2rsorfvxzte',
        title: 'spectroscopy techniques',
        parents: {
            connect: [
                {
                    id: 'clkv6uo36027sl2rsckix30g0'
                }
            ]
        }
    },
    {
        id: 'clkv6uo3s0282l2rszgd8129w',
        title: 'emission',
        parents: {
            connect: [
                {
                    id: 'clkv6uo3o0280l2rs5zketymp'
                }
            ]
        }
    },
    {
        id: 'clkv6uo410286l2rsry2v8ble',
        title: 'solar spectrum',
        parents: {
            connect: [
                {
                    id: 'clkv6uo3o0280l2rs5zketymp'
                }
            ]
        }
    },
    {
        id: 'clkv6uo4a028al2rsatw74ijn',
        title: 'optical devices',
        parents: {
            connect: [
                {
                    id: 'clkv6uo460288l2rsutsidwmz'
                }
            ]
        }
    },
    {
        id: 'clkv6uo4f028cl2rsqxw31ow6',
        title: 'optoelectronic',
        parents: {
            connect: [
                {
                    id: 'clkv6uo460288l2rsutsidwmz'
                }
            ]
        }
    },
    {
        id: 'clkv6uo6j0296l2rsxo5r0m81',
        title: 'helicobacter pylori',
        parents: {
            connect: [
                {
                    id: 'clkv6uo5w028wl2rs91zq4biz'
                }
            ]
        }
    },
    {
        id: 'clkv6uo8m02a2l2rswvvq7jpu',
        title: 'circovirus',
        parents: {
            connect: [
                {
                    id: 'clkv6uobj02bel2rs4qogmytb'
                }
            ]
        }
    },
    {
        id: 'clkv6uo9302aal2rsqq9qnd5g',
        title: 'streptococcus',
        parents: {
            connect: [
                {
                    id: 'clkv6uo5w028wl2rs91zq4biz'
                }
            ]
        }
    },
    {
        id: 'clkv6uo9802acl2rs8hnbcsj8',
        title: 'oxidative',
        parents: {
            connect: [
                {
                    id: 'clkv6uob602b8l2rsomzkxjih'
                }
            ]
        }
    },
    {
        id: 'clkv6uoax02b4l2rsqkrw87kr',
        title: 'influenza virus',
        parents: {
            connect: [
                {
                    id: 'clkv6uoan02b0l2rsff8wxhxp'
                }
            ]
        }
    },
    {
        id: 'clkv6uobr02bil2rs4huyactt',
        title: 'covid',
        parents: {
            connect: [
                {
                    id: 'clkv6uobj02bel2rs4qogmytb'
                }
            ]
        }
    },
    {
        id: 'clkv6uocc02bsl2rsc5vuz0i4',
        title: 'polyomaviruses',
        parents: {
            connect: [
                {
                    id: 'clkv6uoc802bql2rsd2t077sc'
                }
            ]
        }
    },
    {
        id: 'clkv6uoch02bul2rsq5jusvub',
        title: 'swine fever',
        parents: {
            connect: [
                {
                    id: 'clkv6uoc402bol2rs3tnta5i6'
                }
            ]
        }
    },
    {
        id: 'clkv6uodu02cgl2rs9mtbqith',
        title: 'plasmodium falciparum',
        parents: {
            connect: [
                {
                    id: 'clkv6uodb02c8l2rsad88evha'
                }
            ]
        }
    },
    {
        id: 'clkv6uoie02ecl2rs7cslbcpu',
        title: 'summary poultry',
        parents: {
            connect: [
                {
                    id: 'clkv6uohe02dwl2rstxm1mydy'
                }
            ]
        }
    },
    {
        id: 'clkv6uoiq02egl2rsmqsy8fb5',
        title: 'insect pest',
        parents: {
            connect: [
                {
                    id: 'clkv6uocu02c0l2rs67ybx8b3'
                }
            ]
        }
    },
    {
        id: 'clkv6uojc02eml2rs7z4b3qhf',
        title: 'candida albicans',
        parents: {
            connect: [
                {
                    id: 'clkv6uoeq02csl2rswko9q6lb'
                }
            ]
        }
    },
    {
        id: 'clkv6uoji02eol2rsr0u5lytv',
        title: 'cryptococcus',
        parents: {
            connect: [
                {
                    id: 'clkv6uoeq02csl2rswko9q6lb'
                }
            ]
        }
    },
    {
        id: 'clkv6uojm02eql2rskle0r2am',
        title: 'fungi',
        parents: {
            connect: [
                {
                    id: 'clkv6uoeq02csl2rswko9q6lb'
                }
            ]
        }
    },
    {
        id: 'clkv6uok102ewl2rswfjj0i74',
        title: 'mycobacterium',
        parents: {
            connect: [
                {
                    id: 'clkv6uojr02esl2rso33lt7wy'
                }
            ]
        }
    },
    {
        id: 'clkv6uolo02fel2rsnjsarvy9',
        title: 'fractures',
        parents: {
            connect: [
                {
                    id: 'clkv6un1601t0l2rsg735wv2b'
                },
                {
                    id: 'clkv6uole02fcl2rsrj98mkvx'
                }
            ]
        }
    },
    {
        id: 'clkv6uone02g2l2rspc7er53g',
        title: 'cytokine',
        parents: {
            connect: [
                {
                    id: 'clkv6uon902g0l2rsmk7j66oc'
                }
            ]
        }
    },
    {
        id: 'clkv6uonj02g4l2rsk2u4nwbw',
        title: 'receptor egfr',
        parents: {
            connect: [
                {
                    id: 'clkv6uon902g0l2rsmk7j66oc'
                }
            ]
        }
    },
    {
        id: 'clkv6uopu02gyl2rssdpaknhi',
        title: 'adenocarcinoma',
        parents: {
            connect: [
                {
                    id: 'clkv6uopp02gwl2rs5ru918lc'
                }
            ]
        }
    },
    {
        id: 'clkv6uopz02h0l2rsgny8gt5f',
        title: 'anaplasma',
        parents: {
            connect: [
                {
                    id: 'clkv6uopp02gwl2rs5ru918lc'
                }
            ]
        }
    },
    {
        id: 'clkv6uorl02hol2rs1ax0wjvt',
        title: 'cancer heterogeneous',
        parents: {
            connect: [
                {
                    id: 'clkv6uorg02hml2rsx3bauuk7'
                }
            ]
        }
    },
    {
        id: 'clkv6uotl02igl2rsztn4wazm',
        title: 'mycoplasma',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                },
                {
                    id: 'clkv6uoth02iel2rs0rsnhx7f'
                }
            ]
        }
    },
    {
        id: 'clkv6uotv02ikl2rspiua66tw',
        title: 'primary myelofibrosis',
        parents: {
            connect: [
                {
                    id: 'clkv6uoth02iel2rs0rsnhx7f'
                }
            ]
        }
    },
    {
        id: 'clkv6uouy02j0l2rsnodunk6x',
        title: 'glioma',
        parents: {
            connect: [
                {
                    id: 'clkv6uout02iyl2rsfenvwpbc'
                }
            ]
        }
    },
    {
        id: 'clkv6uow202jel2rsu4yoyyte',
        title: 'vascular disease',
        parents: {
            connect: [
                {
                    id: 'clkv6uovy02jcl2rs6ozgzgq9'
                }
            ]
        }
    },
    {
        id: 'clkv6uowm02jkl2rsugbf1gec',
        title: 'endocarditis',
        parents: {
            connect: [
                {
                    id: 'clkv6uow702jgl2rsov3eo70n'
                }
            ]
        }
    },
    {
        id: 'clkv6uox302jsl2rsepeif5bz',
        title: 'cardiac death',
        parents: {
            connect: [
                {
                    id: 'clkv6uowy02jql2rsbg1yr84q'
                }
            ]
        }
    },
    {
        id: 'clkv6uoy802kal2rsuyrbth7a',
        title: 'primary nephrotic',
        parents: {
            connect: [
                {
                    id: 'clkv6uoy202k8l2rsal4bzcw5'
                }
            ]
        }
    },
    {
        id: 'clkv6uoyr02kil2rsjm15wdrt',
        title: 'tumor necrosis',
        parents: {
            connect: [
                {
                    id: 'clkv6uoyl02kgl2rs2se0tcfq'
                }
            ]
        }
    },
    {
        id: 'clkv6uoza02kql2rs80ui5rue',
        title: 'hypercholesterolemia',
        parents: {
            connect: [
                {
                    id: 'clkv6umyg01ryl2rsmidggye5'
                },
                {
                    id: 'clkv6uoz502kol2rsvplbewy8'
                }
            ]
        }
    },
    {
        id: 'clkv6up0f02l4l2rssxa7sxpt',
        title: 'insulin',
        parents: {
            connect: [
                {
                    id: 'clkv6up0a02l2l2rsepisfi8m'
                }
            ]
        }
    },
    {
        id: 'clkv6up0p02l8l2rs4hw6r6af',
        title: 'cardiac arrhythmias',
        parents: {
            connect: [
                {
                    id: 'clkv6up0k02l6l2rsd97xfe7m'
                }
            ]
        }
    },
    {
        id: 'clkv6up0z02lcl2rs4p6ovttw',
        title: 'cerebrovascular disease',
        parents: {
            connect: [
                {
                    id: 'clkv6up0t02lal2rs018togic'
                }
            ]
        }
    },
    {
        id: 'clkv6up1302lel2rsog4yshz4',
        title: 'chronic venous',
        parents: {
            connect: [
                {
                    id: 'clkv6up0t02lal2rs018togic'
                }
            ]
        }
    },
    {
        id: 'clkv6up1f02lil2rsxalc470i',
        title: 'haemorrhage',
        parents: {
            connect: [
                {
                    id: 'clkv6up0t02lal2rs018togic'
                }
            ]
        }
    },
    {
        id: 'clkv6up1y02lql2rsyq0w98a0',
        title: 'thrombocythemia',
        parents: {
            connect: [
                {
                    id: 'clkv6up0t02lal2rs018togic'
                }
            ]
        }
    },
    {
        id: 'clkv6up2h02lyl2rswq21vpid',
        title: 'cholangiocarcinoma',
        parents: {
            connect: [
                {
                    id: 'clkv6up2c02lwl2rsjajwvv2x'
                }
            ]
        }
    },
    {
        id: 'clkv6up4o02mil2rshopjqypp',
        title: 'autoimmune',
        parents: {
            connect: [
                {
                    id: 'clkv6umy701rul2rscu18o7ue'
                },
                {
                    id: 'clkv6up4i02mgl2rsm3jt7wsx'
                }
            ]
        }
    },
    {
        id: 'clkv6up4t02mkl2rsl7vxk8gk',
        title: 'chronic pain',
        parents: {
            connect: [
                {
                    id: 'clkv6up4i02mgl2rsm3jt7wsx'
                }
            ]
        }
    },
    {
        id: 'clkv6up5h02msl2rs46q5jc0n',
        title: 'disease nafld',
        parents: {
            connect: [
                {
                    id: 'clkv6up4i02mgl2rsm3jt7wsx'
                }
            ]
        }
    },
    {
        id: 'clkv6up5m02mul2rs1ri1nlqn',
        title: 'fasciitis',
        parents: {
            connect: [
                {
                    id: 'clkv6up4i02mgl2rsm3jt7wsx'
                }
            ]
        }
    },
    {
        id: 'clkv6up6d02n4l2rs7hxn94u0',
        title: 'occlusive disease',
        parents: {
            connect: [
                {
                    id: 'clkv6up4i02mgl2rsm3jt7wsx'
                }
            ]
        }
    },
    {
        id: 'clkv6up6w02ncl2rsoanuifxf',
        title: 'rheumatoid',
        parents: {
            connect: [
                {
                    id: 'clkv6umyp01s0l2rsar5yowv1'
                },
                {
                    id: 'clkv6up4i02mgl2rsm3jt7wsx'
                }
            ]
        }
    },
    {
        id: 'clkv6up7s02nol2rs7q19fzqi',
        title: 'fibrous tumor',
        parents: {
            connect: [
                {
                    id: 'clkv6up7o02nml2rsst3soo8m'
                },
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6up7w02nql2rsizsuadnk',
        title: 'mucositis',
        parents: {
            connect: [
                {
                    id: 'clkv6up7o02nml2rsst3soo8m'
                }
            ]
        }
    },
    {
        id: 'clkv6upa902osl2rs3lpr7jaq',
        title: 'ataxia characterized',
        parents: {
            connect: [
                {
                    id: 'clkv6upa102ool2rs9chn59bm'
                }
            ]
        }
    },
    {
        id: 'clkv6upip02rul2rs88pf6usc',
        title: 'respiratory infections',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                },
                {
                    id: 'clkv6upij02rsl2rsiooj8lb7'
                }
            ]
        }
    },
    {
        id: 'clkv6upje02s4l2rsewlyq6uu',
        title: 'chronic granulomatous',
        parents: {
            connect: [
                {
                    id: 'clkv6upj702s2l2rsgu9bs2nh'
                }
            ]
        }
    },
    {
        id: 'clkv6upjq02s8l2rsptl01bu7',
        title: 'dermatologic disease',
        parents: {
            connect: [
                {
                    id: 'clkv6upj702s2l2rsgu9bs2nh'
                }
            ]
        }
    },
    {
        id: 'clkv6uq5t031al2rsyyflcnu9',
        title: 'groundwater',
        parents: {
            connect: [
                {
                    id: 'clkv6uq7w0328l2rsciwzy3tl'
                }
            ]
        }
    },
    {
        id: 'clkv6uq6x031sl2rssb08r1dl',
        title: 'emission greenhouse',
        parents: {
            connect: [
                {
                    id: 'clkv6uq6s031ql2rsa7qtlpyc'
                }
            ]
        }
    },
    {
        id: 'clkv6uq7e0320l2rst5mv7pd7',
        title: 'phosphorus',
        parents: {
            connect: [
                {
                    id: 'clkv6uq79031yl2rsb4nt4v23'
                }
            ]
        }
    },
    {
        id: 'cly468z9j002v7ryzh0s9x23r',
        title: 'Environmental clean-up',
        parents: {
            connect: [
                {
                    id: 'clkv6un6g01v2l2rsnxsssx4g'
                }
            ]
        }
    },
    {
        id: 'cly468zuw006g7ryztzazgghy',
        title: 'Oil and gas industry',
        parents: {
            connect: [
                {
                    id: 'clkv6uli9018gl2rs6muu36le'
                },
                {
                    id: 'clkv6uq71031ul2rscek4mc80'
                }
            ]
        }
    },
    {
        id: 'cly468zxb006t7ryzeyysv5gd',
        title: 'Petrol',
        parents: {
            connect: [
                {
                    id: 'clkv6uq71031ul2rscek4mc80'
                }
            ]
        }
    },
    {
        id: 'cly4690i7009t7ryzq9wujgxb',
        title: 'Water pollution',
        parents: {
            connect: [
                {
                    id: 'clkv6un6g01v2l2rsnxsssx4g'
                }
            ]
        }
    },
    {
        id: 'clkv6ujj000iel2rsps1815op',
        title: 'First and Second Punic Wars. Illyrian wars. 264-201',
        parents: {
            connect: [
                {
                    id: 'clkv6ujiw00icl2rsitybd86i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujj400igl2rst1brc45r',
        title: 'Wars in the East and in the West. 200-133',
        parents: {
            connect: [
                {
                    id: 'clkv6ujiw00icl2rsitybd86i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujj900iil2rsak5pveei',
        title: 'Fall of the Republic and establishment of the Empire. 133-27',
        parents: {
            connect: [
                {
                    id: 'clkv6ujiw00icl2rsitybd86i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujjd00ikl2rse0zs3au6',
        title: 'Period of Marius and Sulla (Pompey). 111-78',
        parents: {
            connect: [
                {
                    id: 'clkv6ujiw00icl2rsitybd86i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujji00iml2rs5xhyfcut',
        title: 'Julius Caesar. First Triumvirate, 60',
        parents: {
            connect: [
                {
                    id: 'clkv6ujiw00icl2rsitybd86i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujjo00iol2rs1hwnwiel',
        title: 'Second Triumvirate, 43-31',
        parents: {
            connect: [
                {
                    id: 'clkv6ujiw00icl2rsitybd86i'
                }
            ]
        }
    },
    {
        id: 'clkv6ujmi00jml2rswj85rm13',
        title: '1848-1849. Austro-Sardinian War',
        parents: {
            connect: [
                {
                    id: 'clkv6ujmb00jkl2rsf0o8dokn'
                }
            ]
        }
    },
    {
        id: 'clkv6umwj01r6l2rsocgfd9zm',
        title: 'defects',
        parents: {
            connect: [
                {
                    id: 'clkv6un5x01uwl2rsp60nizhf'
                }
            ]
        }
    },
    {
        id: 'clkv6un3u01u2l2rshirrusdo',
        title: 'science bionic',
        parents: {
            connect: [
                {
                    id: 'clkv6un3p01u0l2rsv6ov1vqw'
                }
            ]
        }
    },
    {
        id: 'clkv6un6a01v0l2rsbrvsrqxn',
        title: 'structural health',
        parents: {
            connect: [
                {
                    id: 'clkv6un5x01uwl2rsp60nizhf'
                }
            ]
        }
    },
    {
        id: 'clkv6un6s01v6l2rscn6u377l',
        title: 'barrier discharge',
        parents: {
            connect: [
                {
                    id: 'clkv6un6n01v4l2rsv4zi1p53'
                }
            ]
        }
    },
    {
        id: 'clkv6un7001v8l2rszf9a4t30',
        title: 'permeability',
        parents: {
            connect: [
                {
                    id: 'clkv6un6n01v4l2rsv4zi1p53'
                }
            ]
        }
    },
    {
        id: 'clkv6un7v01vel2rsmyhs25qe',
        title: 'decontamination cleanup',
        parents: {
            connect: [
                {
                    id: 'clkv6un7p01vcl2rslhr274a0'
                }
            ]
        }
    },
    {
        id: 'clkv6uni301zol2rsexxl6wa2',
        title: 'cathode material',
        parents: {
            connect: [
                {
                    id: 'clkv6unhy01zml2rsnua066py'
                }
            ]
        }
    },
    {
        id: 'clkv6uni801zql2rsjvmqr41k',
        title: 'electrochromic devices',
        parents: {
            connect: [
                {
                    id: 'clkv6unhy01zml2rsnua066py'
                }
            ]
        }
    },
    {
        id: 'clkv6unig01zsl2rs2u7lrb4b',
        title: 'electrolytes',
        parents: {
            connect: [
                {
                    id: 'clkv6unhy01zml2rsnua066py'
                }
            ]
        }
    },
    {
        id: 'clkv6uniu01zyl2rsouf7fd53',
        title: 'battery',
        parents: {
            connect: [
                {
                    id: 'clkv6uniq01zwl2rs3eebgvh4'
                }
            ]
        }
    },
    {
        id: 'clkv6unj20200l2rsy023ipxe',
        title: 'high voltage',
        parents: {
            connect: [
                {
                    id: 'clkv6uniq01zwl2rs3eebgvh4'
                }
            ]
        }
    },
    {
        id: 'clkv6unjd0204l2rs9yxc1t8b',
        title: 'rechargeable battery',
        parents: {
            connect: [
                {
                    id: 'clkv6uniq01zwl2rs3eebgvh4'
                }
            ]
        }
    },
    {
        id: 'clkv6unk3020al2rse48g5537',
        title: 'energy storage',
        parents: {
            connect: [
                {
                    id: 'clkv6unjy0208l2rsqegwag0s'
                }
            ]
        }
    },
    {
        id: 'clkv6unl2020kl2rs0j8h5p9f',
        title: 'photovoltaic',
        parents: {
            connect: [
                {
                    id: 'clkv6unjy0208l2rsqegwag0s'
                }
            ]
        }
    },
    {
        id: 'clkv6unlk020sl2rsnyrirf0n',
        title: 'carbonaceous materials',
        parents: {
            connect: [
                {
                    id: 'clkv6unlg020ql2rsbp9pr8jz'
                }
            ]
        }
    },
    {
        id: 'clkv6unlo020ul2rsvj97qvg6',
        title: 'multiwall carbon',
        parents: {
            connect: [
                {
                    id: 'clkv6unlg020ql2rsbp9pr8jz'
                }
            ]
        }
    },
    {
        id: 'clkv6unm0020wl2rsztvie1od',
        title: 'superconductors',
        parents: {
            connect: [
                {
                    id: 'clkv6unlg020ql2rsbp9pr8jz'
                }
            ]
        }
    },
    {
        id: 'clkv6unmn0214l2rsrww960dq',
        title: 'catalysts based',
        parents: {
            connect: [
                {
                    id: 'clkv6unmi0212l2rs27y8izew'
                }
            ]
        }
    },
    {
        id: 'clkv6unnj021el2rsqtr37ga6',
        title: 'derived fuel',
        parents: {
            connect: [
                {
                    id: 'clkv6unmi0212l2rs27y8izew'
                }
            ]
        }
    },
    {
        id: 'clkv6unon021wl2rsmpinhgfs',
        title: 'hydrogen',
        parents: {
            connect: [
                {
                    id: 'clkv6unmi0212l2rs27y8izew'
                }
            ]
        }
    },
    {
        id: 'clkv6unp60224l2rsyymsmthp',
        title: 'blast furnace',
        parents: {
            connect: [
                {
                    id: 'clkv6unp10222l2rsisu68ml2'
                }
            ]
        }
    },
    {
        id: 'clkv6unpa0226l2rse6t1nchr',
        title: 'fusion devices',
        parents: {
            connect: [
                {
                    id: 'clkv6unp10222l2rsisu68ml2'
                }
            ]
        }
    },
    {
        id: 'clkv6unpf0228l2rsliv9nvql',
        title: 'gamma radiation',
        parents: {
            connect: [
                {
                    id: 'clkv6unp10222l2rsisu68ml2'
                }
            ]
        }
    },
    {
        id: 'clkv6unpj022al2rsafs2e11d',
        title: 'neutron science',
        parents: {
            connect: [
                {
                    id: 'clkv6unp10222l2rsisu68ml2'
                }
            ]
        }
    },
    {
        id: 'clkv6unpo022cl2rsd6l2qzbs',
        title: 'nuclear fuel',
        parents: {
            connect: [
                {
                    id: 'clkv6unp10222l2rsisu68ml2'
                }
            ]
        }
    },
    {
        id: 'clkv6unps022el2rs2sqi81lt',
        title: 'reactor',
        parents: {
            connect: [
                {
                    id: 'clkv6unp10222l2rsisu68ml2'
                }
            ]
        }
    },
    {
        id: 'clkv6unq2022il2rsptikrspg',
        title: 'geothermal',
        parents: {
            connect: [
                {
                    id: 'clkv6unpw022gl2rs1jl2nm31'
                }
            ]
        }
    },
    {
        id: 'clkv6unqg022ol2rsi7a2mmlg',
        title: 'insulation',
        parents: {
            connect: [
                {
                    id: 'clkv6unqc022ml2rs1wc3jzec'
                }
            ]
        }
    },
    {
        id: 'clkv6unql022ql2rsvpp9msm0',
        title: 'temperature applications',
        parents: {
            connect: [
                {
                    id: 'clkv6unqc022ml2rs1wc3jzec'
                }
            ]
        }
    },
    {
        id: 'clkv6unqq022sl2rsz0anl1jo',
        title: 'thermal conductivity',
        parents: {
            connect: [
                {
                    id: 'clkv6unqc022ml2rs1wc3jzec'
                }
            ]
        }
    },
    {
        id: 'clkv6unqu022ul2rs2u9ix0pn',
        title: 'thermal stability',
        parents: {
            connect: [
                {
                    id: 'clkv6unqc022ml2rs1wc3jzec'
                }
            ]
        }
    },
    {
        id: 'clkv6unra0230l2rskku6bhwk',
        title: 'thermosets',
        parents: {
            connect: [
                {
                    id: 'clkv6unr6022yl2rs0zdsghoo'
                }
            ]
        }
    },
    {
        id: 'clkv6unuy024cl2rsvndw9avw',
        title: 'boron compounds',
        parents: {
            connect: [
                {
                    id: 'clkv6unus024al2rs34kio9sh'
                }
            ]
        }
    },
    {
        id: 'clkv6unv2024el2rs0c32nlaz',
        title: 'niobium niobium',
        parents: {
            connect: [
                {
                    id: 'clkv6unus024al2rs34kio9sh'
                }
            ]
        }
    },
    {
        id: 'clkv6unv6024gl2rsmud53k9y',
        title: 'silicon nitride',
        parents: {
            connect: [
                {
                    id: 'clkv6unus024al2rs34kio9sh'
                }
            ]
        }
    },
    {
        id: 'clkv6unvo024ol2rsrzsy1bss',
        title: 'alumina combined',
        parents: {
            connect: [
                {
                    id: 'clkv6unvk024ml2rswdhes28m'
                }
            ]
        }
    },
    {
        id: 'clkv6unz30266l2rs87r9wywo',
        title: 'amorphous silicon',
        parents: {
            connect: [
                {
                    id: 'clkv6unyx0264l2rslv0rthxd'
                }
            ]
        }
    },
    {
        id: 'clkv6unzr026el2rs4eifwxys',
        title: 'conductivity materials',
        parents: {
            connect: [
                {
                    id: 'clkv6unzl026cl2rssutx7sio'
                }
            ]
        }
    },
    {
        id: 'clkv6unzw026gl2rs2bp7xnfq',
        title: 'spintronic devices',
        parents: {
            connect: [
                {
                    id: 'clkv6unzl026cl2rssutx7sio'
                }
            ]
        }
    },
    {
        id: 'clkv6uo0a026ml2rs546bm6ys',
        title: 'electronic properties',
        parents: {
            connect: [
                {
                    id: 'clkv6uo06026kl2rsd7imeog6'
                }
            ]
        }
    },
    {
        id: 'clkv6uo0w026wl2rs4fpsq8o7',
        title: 'pyroelectric',
        parents: {
            connect: [
                {
                    id: 'clkv6uo0s026ul2rs7zkpc9vs'
                }
            ]
        }
    },
    {
        id: 'clkv6uo2j027il2rseotpk087',
        title: 'glass optical',
        parents: {
            connect: [
                {
                    id: 'clkv6uo2f027gl2rsvaphlicb'
                }
            ]
        }
    },
    {
        id: 'clkv6uo3k027yl2rsgbhmpoxv',
        title: 'ftir spectrometers',
        parents: {
            connect: [
                {
                    id: 'clkv6uo3f027wl2rsorfvxzte'
                }
            ]
        }
    },
    {
        id: 'clkv6uo3x0284l2rs3w2935oi',
        title: 'emission field',
        parents: {
            connect: [
                {
                    id: 'clkv6uo3s0282l2rszgd8129w'
                }
            ]
        }
    },
    {
        id: 'clkv6uo8z02a8l2rsmy35l11g',
        title: 'aedes aegypti',
        parents: {
            connect: [
                {
                    id: 'clkv6umxl01rkl2rss5njw10t'
                },
                {
                    id: 'clkv6uoiq02egl2rsmqsy8fb5'
                }
            ]
        }
    },
    {
        id: 'clkv6uoaa02aul2rs8x42vr5o',
        title: 'natural killer',
        parents: {
            connect: [
                {
                    id: 'clkv6uoiq02egl2rsmqsy8fb5'
                }
            ]
        }
    },
    {
        id: 'clkv6uoek02cql2rsecwslq11',
        title: 'enteroviruses',
        parents: {
            connect: [
                {
                    id: 'clkv6uocc02bsl2rsc5vuz0i4'
                }
            ]
        }
    },
    {
        id: 'clkv6uoev02cul2rsggt3kqyv',
        title: 'papillomavirus',
        parents: {
            connect: [
                {
                    id: 'clkv6uocc02bsl2rsc5vuz0i4'
                }
            ]
        }
    },
    {
        id: 'clkv6uou102iml2rsu9b2lqt0',
        title: 'multiple myeloma',
        parents: {
            connect: [
                {
                    id: 'clkv6uotv02ikl2rspiua66tw'
                }
            ]
        }
    },
    {
        id: 'clkv6uowq02jml2rsfe3fovof',
        title: 'endocrine neoplasia',
        parents: {
            connect: [
                {
                    id: 'clkv6uowm02jkl2rsugbf1gec'
                }
            ]
        }
    },
    {
        id: 'clkv6uox802jul2rshefcewud',
        title: 'cardiac',
        parents: {
            connect: [
                {
                    id: 'clkv6uox302jsl2rsepeif5bz'
                }
            ]
        }
    },
    {
        id: 'clkv6up1902lgl2rs2mhbkghu',
        title: 'systemic vasculitis',
        parents: {
            connect: [
                {
                    id: 'clkv6up1302lel2rsog4yshz4'
                }
            ]
        }
    },
    {
        id: 'clkv6up1j02lkl2rsngfya23k',
        title: 'haemorrhagic fever',
        parents: {
            connect: [
                {
                    id: 'clkv6up1f02lil2rsxalc470i'
                }
            ]
        }
    },
    {
        id: 'clkv6up1o02lml2rsaty2xvn2',
        title: 'hemorrhage',
        parents: {
            connect: [
                {
                    id: 'clkv6up1f02lil2rsxalc470i'
                }
            ]
        }
    },
    {
        id: 'clkv6up2302lsl2rszap4kua4',
        title: 'peripheral arterial',
        parents: {
            connect: [
                {
                    id: 'clkv6up1y02lql2rsyq0w98a0'
                }
            ]
        }
    },
    {
        id: 'clkv6up2n02m0l2rsgbfmfeqr',
        title: 'cholestatic',
        parents: {
            connect: [
                {
                    id: 'clkv6up2h02lyl2rswq21vpid'
                }
            ]
        }
    },
    {
        id: 'clkv6up5802mol2rsqw6qq6jg',
        title: 'pain',
        parents: {
            connect: [
                {
                    id: 'clkv6up4t02mkl2rsl7vxk8gk'
                }
            ]
        }
    },
    {
        id: 'clkv6up8102nsl2rs48o2khhv',
        title: 'mucoepidermoid carcinoma',
        parents: {
            connect: [
                {
                    id: 'clkv6up7w02nql2rsizsuadnk'
                },
                {
                    id: 'clkv6upn902tol2rsv5q2w7uv'
                }
            ]
        }
    },
    {
        id: 'clkv6uq48030ml2rs77qobvwk',
        title: 'aplastic',
        parents: {
            connect: [
                {
                    id: 'clkv6uobr02bil2rs4huyactt'
                }
            ]
        }
    },
    {
        id: 'clkv6uq4h030ql2rssqzrbomi',
        title: 'porphyrias group',
        parents: {
            connect: [
                {
                    id: 'clkv6uobr02bil2rs4huyactt'
                }
            ]
        }
    },
    {
        id: 'clkv6un6601uyl2rscu0jw6ok',
        title: 'failure mechanism',
        parents: {
            connect: [
                {
                    id: 'clkv6umwj01r6l2rsocgfd9zm'
                }
            ]
        }
    },
    {
        id: 'clkv6un7g01val2rs82wqaqea',
        title: 'moisture content',
        parents: {
            connect: [
                {
                    id: 'clkv6un7001v8l2rszf9a4t30'
                }
            ]
        }
    },
    {
        id: 'clkv6unj70202l2rssx738nm4',
        title: 'power devices',
        parents: {
            connect: [
                {
                    id: 'clkv6unj20200l2rsy023ipxe'
                }
            ]
        }
    },
    {
        id: 'clkv6unjs0206l2rs4eg1fgjw',
        title: 'density rechargeable',
        parents: {
            connect: [
                {
                    id: 'clkv6unjd0204l2rs9yxc1t8b'
                }
            ]
        }
    },
    {
        id: 'clkv6unka020cl2rsdsf3ngpi',
        title: 'electric energy',
        parents: {
            connect: [
                {
                    id: 'clkv6unk3020al2rse48g5537'
                }
            ]
        }
    },
    {
        id: 'clkv6unkk020el2rs6fhgdrjo',
        title: 'electric vehicles',
        parents: {
            connect: [
                {
                    id: 'clkv6unk3020al2rse48g5537'
                }
            ]
        }
    },
    {
        id: 'clkv6unkq020gl2rsqt1rj7g6',
        title: 'energy consumption',
        parents: {
            connect: [
                {
                    id: 'clkv6unk3020al2rse48g5537'
                }
            ]
        }
    },
    {
        id: 'clkv6unm6020yl2rsochmfgka',
        title: 'capacitors',
        parents: {
            connect: [
                {
                    id: 'clkv6unm0020wl2rsztvie1od'
                }
            ]
        }
    },
    {
        id: 'clkv6unmc0210l2rsh144gqc0',
        title: 'supercritical carbon',
        parents: {
            connect: [
                {
                    id: 'clkv6unm0020wl2rsztvie1od'
                }
            ]
        }
    },
    {
        id: 'clkv6unms0216l2rsrjor6n43',
        title: 'advanced oxidation',
        parents: {
            connect: [
                {
                    id: 'clkv6unmn0214l2rsrww960dq'
                }
            ]
        }
    },
    {
        id: 'clkv6unn0021al2rsetrjb9v8',
        title: 'catalytic performance',
        parents: {
            connect: [
                {
                    id: 'clkv6unmn0214l2rsrww960dq'
                }
            ]
        }
    },
    {
        id: 'clkv6unnd021cl2rsepaf705o',
        title: 'electrocatalysis',
        parents: {
            connect: [
                {
                    id: 'clkv6unmn0214l2rsrww960dq'
                }
            ]
        }
    },
    {
        id: 'clkv6unno021gl2rsgpawpe0y',
        title: 'combustion technology',
        parents: {
            connect: [
                {
                    id: 'clkv6unnj021el2rsqtr37ga6'
                }
            ]
        }
    },
    {
        id: 'clkv6uno2021ml2rsx7z7m3ij',
        title: 'diesel engine',
        parents: {
            connect: [
                {
                    id: 'clkv6unnj021el2rsqtr37ga6'
                }
            ]
        }
    },
    {
        id: 'clkv6uno6021ol2rsr6z5phrj',
        title: 'fuel cell',
        parents: {
            connect: [
                {
                    id: 'clkv6unnj021el2rsqtr37ga6'
                }
            ]
        }
    },
    {
        id: 'clkv6unos021yl2rsh6y14zlh',
        title: 'catalytic hydrogenation',
        parents: {
            connect: [
                {
                    id: 'clkv6unon021wl2rsmpinhgfs'
                }
            ]
        }
    },
    {
        id: 'clkv6unr1022wl2rshtepyw6b',
        title: 'thermal barrier',
        parents: {
            connect: [
                {
                    id: 'clkv6unqu022ul2rs2u9ix0pn'
                }
            ]
        }
    },
    {
        id: 'clkv6unva024il2rs29ibpcuv',
        title: 'titanium nitride',
        parents: {
            connect: [
                {
                    id: 'clkv6unv6024gl2rsmud53k9y'
                }
            ]
        }
    },
    {
        id: 'clkv6uo0f026ol2rszk6by7tt',
        title: 'electronic devices',
        parents: {
            connect: [
                {
                    id: 'clkv6uo0a026ml2rs546bm6ys'
                }
            ]
        }
    },
    {
        id: 'clkv6uo0n026sl2rsslpjs8bv',
        title: 'organic electronic',
        parents: {
            connect: [
                {
                    id: 'clkv6uo0a026ml2rs546bm6ys'
                }
            ]
        }
    },
    {
        id: 'clkv6uofq02d6l2rspyy2tmvq',
        title: 'lymphotropic virus',
        parents: {
            connect: [
                {
                    id: 'clkv6uoev02cul2rsggt3kqyv'
                }
            ]
        }
    },
    {
        id: 'clkv6uofz02dal2rspa72yles',
        title: 'syncytial virus',
        parents: {
            connect: [
                {
                    id: 'clkv6uoev02cul2rsggt3kqyv'
                }
            ]
        }
    },
    {
        id: 'clkv6uowu02jol2rsgo2gb7jh',
        title: 'endocrine disorders',
        parents: {
            connect: [
                {
                    id: 'clkv6uowq02jml2rsfe3fovof'
                }
            ]
        }
    },
    {
        id: 'clkv6up1t02lol2rsf8eforq1',
        title: 'hemangioma',
        parents: {
            connect: [
                {
                    id: 'clkv6up1o02lml2rsaty2xvn2'
                }
            ]
        }
    },
    {
        id: 'clkv6up2702lul2rs4s1eoe6g',
        title: 'arteriovenous fistula',
        parents: {
            connect: [
                {
                    id: 'clkv6up2302lsl2rszap4kua4'
                }
            ]
        }
    },
    {
        id: 'clkv6up2u02m2l2rs9d70z0gi',
        title: 'cholesteatoma progressive',
        parents: {
            connect: [
                {
                    id: 'clkv6up2n02m0l2rsgbfmfeqr'
                }
            ]
        }
    },
    {
        id: 'clkv6up5c02mql2rsrq4hslmt',
        title: 'pain frequent',
        parents: {
            connect: [
                {
                    id: 'clkv6up5802mol2rsqw6qq6jg'
                }
            ]
        }
    },
    {
        id: 'clkv6uq4c030ol2rsvygi21n5',
        title: 'investigate syncope',
        parents: {
            connect: [
                {
                    id: 'clkv6uq48030ml2rs77qobvwk'
                }
            ]
        }
    },
    {
        id: 'clkv6uq530310l2rsd8qnw77d',
        title: 'renewable energy',
        parents: {
            connect: [
                {
                    id: 'clkv6uq66031gl2rsz0v54s0t'
                },
                {
                    id: 'clkv6unk3020al2rse48g5537'
                }
            ]
        }
    },
    {
        id: 'clkv6unmw0218l2rs4dssnuts',
        title: 'oxidation processes',
        parents: {
            connect: [
                {
                    id: 'clkv6unms0216l2rsrjor6n43'
                }
            ]
        }
    },
    {
        id: 'clkv6unnt021il2rslw1jwzg6',
        title: 'flame retardant',
        parents: {
            connect: [
                {
                    id: 'clkv6unno021gl2rsgpawpe0y'
                }
            ]
        }
    },
    {
        id: 'clkv6unoa021ql2rsli0o2mio',
        title: 'biomass generated',
        parents: {
            connect: [
                {
                    id: 'clkv6uno6021ol2rsr6z5phrj'
                }
            ]
        }
    },
    {
        id: 'clkv6unof021sl2rsoj23tx8r',
        title: 'diesel fuel',
        parents: {
            connect: [
                {
                    id: 'clkv6uno6021ol2rsr6z5phrj'
                }
            ]
        }
    },
    {
        id: 'clkv6unoj021ul2rsxsimy458',
        title: 'oxide fuel',
        parents: {
            connect: [
                {
                    id: 'clkv6uno6021ol2rsr6z5phrj'
                }
            ]
        }
    },
    {
        id: 'clkv6uo0j026ql2rsewhca6w8',
        title: 'electronic applications',
        parents: {
            connect: [
                {
                    id: 'clkv6uo0f026ol2rszk6by7tt'
                }
            ]
        }
    },
    {
        id: 'clkv6uogd02dgl2rsggnrpbne',
        title: 'nile virus',
        parents: {
            connect: [
                {
                    id: 'clkv6uofz02dal2rspa72yles'
                }
            ]
        }
    },
    {
        id: 'clkv6uq570312l2rs02ynk9pp',
        title: 'biomass',
        parents: {
            connect: [
                {
                    id: 'clkv6uq530310l2rsd8qnw77d'
                }
            ]
        }
    },
    {
        id: 'clkv6uq5p0318l2rsejpcxvvc',
        title: 'solar energy',
        parents: {
            connect: [
                {
                    id: 'clkv6uq530310l2rsd8qnw77d'
                }
            ]
        }
    },
    {
        id: 'cly468zge00437ryzrnyrflwc',
        title: 'Hydroelectric power',
        parents: {
            connect: [
                {
                    id: 'clkv6uq530310l2rsd8qnw77d'
                },
                {
                    id: 'cly468yz1001b7ryzzrj7r2gm'
                }
            ]
        }
    },
    {
        id: 'cly4690hq009q7ryzwsfsak16',
        title: 'Wind power',
        parents: {
            connect: [
                {
                    id: 'clkv6uq530310l2rsd8qnw77d'
                }
            ]
        }
    },
    {
        id: 'clkv6unny021kl2rsygu3fto1',
        title: 'propellants combustion',
        parents: {
            connect: [
                {
                    id: 'clkv6unnt021il2rslw1jwzg6'
                }
            ]
        }
    },
    {
        id: 'clkv6uq5d0314l2rssy0nzosp',
        title: 'biofuels',
        parents: {
            connect: [
                {
                    id: 'clkv6uq570312l2rs02ynk9pp'
                }
            ]
        }
    },
    {
        id: 'clkv6uq5j0316l2rsnorkixm0',
        title: 'bioenergy crops',
        parents: {
            connect: [
                {
                    id: 'clkv6uq5d0314l2rssy0nzosp'
                }
            ]
        }
    }
];

export default topics;
