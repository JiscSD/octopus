import { Prisma } from '@prisma/client';

// Note: Prisma client extension ensures titles are turned to lower case on save.
const topicMappings: Prisma.TopicMappingCreateManyInput[] = [
    {
        title: 'Architecture',
        source: 'ARI',
        topicId: 'clkv6uilr005el2rsoak021o0',
        isMapped: true
    },
    {
        title: 'Act of terror',
        source: 'ARI',
        topicId: 'cly468yph00047ryzwqn34dkp',
        isMapped: true
    },
    {
        title: 'Act of bioterrorism',
        source: 'ARI',
        topicId: 'cly468ypo00057ryzwnow9c9d',
        isMapped: true
    },
    {
        title: 'Armed conflict',
        source: 'ARI',
        topicId: 'cly468yoi00017ryzu49uigcw',
        isMapped: true
    },
    {
        title: 'Animal abuse',
        source: 'ARI',
        topicId: 'cly468ypv00067ryzdvo9slxf',
        isMapped: true
    },
    {
        title: 'Assault',
        source: 'ARI',
        topicId: 'cly468yq100077ryz7nlywdi6',
        isMapped: true
    },
    {
        title: 'Anti-trust crime',
        source: 'ARI',
        topicId: 'cly468yq800087ryzydbfodpg',
        isMapped: true
    },
    {
        title: 'Arbitration and mediation',
        source: 'ARI',
        topicId: 'cly468ypa00037ryzacwr3ufc',
        isMapped: true
    },
    {
        title: 'Arrest',
        source: 'ARI',
        topicId: 'cly468yqd00097ryzpptlmhx2',
        isMapped: true
    },
    {
        title: 'Avalanche',
        source: 'ARI',
        topicId: 'cly468yp200027ryzf4lfdzbi',
        isMapped: true
    },
    {
        title: 'Accounting and audit',
        source: 'ARI',
        topicId: 'cly468yqj000a7ryzierqdzvf',
        isMapped: true
    },
    {
        title: 'Agriculture',
        source: 'ARI',
        topicId: 'clkv6uli0018cl2rs9asqmz2p',
        isMapped: true
    },
    {
        title: 'Aquaculture',
        source: 'ARI',
        topicId: 'clkv6uivg008ol2rsdommaht8',
        isMapped: true
    },
    {
        title: 'Arable farming',
        source: 'ARI',
        topicId: 'cly468yqt000b7ryzqdcaywaw',
        isMapped: true
    },
    {
        title: 'Alternative energy',
        source: 'ARI',
        topicId: 'clkv6umnb01o2l2rsvv8x4mrz',
        isMapped: true
    },
    {
        title: 'Accountancy and auditing',
        source: 'ARI',
        topicId: 'cly468yqj000a7ryzierqdzvf',
        isMapped: true
    },
    {
        title: 'Aerospace',
        source: 'ARI',
        topicId: 'clkv6umqu01pcl2rsk2ohgs0b',
        isMapped: true
    },
    {
        title: 'Automotive',
        source: 'ARI',
        topicId: 'clkv6umqp01pal2rstmxp0phx',
        isMapped: true
    },
    {
        title: 'Advertising',
        source: 'ARI',
        topicId: 'cly468yr1000c7ryz88vm043g',
        isMapped: true
    },
    {
        title: 'Air pollution',
        source: 'ARI',
        topicId: 'cly468yr7000d7ryz957r1m4a',
        isMapped: true
    },
    {
        title: 'Animal',
        source: 'ARI',
        topicId: 'clkv6uir40078l2rsp2xvet66',
        isMapped: true
    },
    {
        title: 'Animal disease',
        source: 'ARI',
        topicId: 'clkv6uod702c6l2rs3thozxnq',
        isMapped: true
    },
    {
        title: 'Award and prize',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Armed forces',
        source: 'ARI',
        topicId: 'clkv6uidy002el2rsrw12sj6v',
        isMapped: true
    },
    {
        title: 'Astronomy',
        source: 'ARI',
        topicId: 'clkv6uiq6006wl2rstcdpuok4',
        isMapped: true
    },
    {
        title: 'Anthropology',
        source: 'ARI',
        topicId: 'clkv6uif3002ul2rshsq00r6h',
        isMapped: true
    },
    {
        title: 'Aerospace engineering',
        source: 'ARI',
        topicId: 'clkv6umqu01pcl2rsk2ohgs0b',
        isMapped: true
    },
    {
        title: 'Agricultural technology',
        source: 'ARI',
        topicId: 'cly468yrd000e7ryzlyum706i',
        isMapped: true
    },
    {
        title: 'Artificial intelligence',
        source: 'ARI',
        topicId: 'cly468yrk000f7ryzepbgmcok',
        isMapped: true
    },
    {
        title: 'Ageism',
        source: 'ARI',
        topicId: 'cly468yrp000g7ryzi1z03yas',
        isMapped: true
    },
    {
        title: 'Adults',
        source: 'ARI',
        topicId: 'cly468yru000h7ryzjw8h8iv0',
        isMapped: true
    },
    {
        title: 'Abusive behaviour',
        source: 'ARI',
        topicId: 'cly468yrz000i7ryzuwowhrgl',
        isMapped: true
    },
    {
        title: 'Addiction',
        source: 'ARI',
        topicId: 'cly468ys4000j7ryzai03jt0j',
        isMapped: true
    },
    {
        title: 'Bombings',
        source: 'ARI',
        topicId: 'cly468ysb000k7ryzb606kiuh',
        isMapped: true
    },
    {
        title: 'Bribery',
        source: 'ARI',
        topicId: 'cly468ysi000l7ryzubvl0qsy',
        isMapped: true
    },
    {
        title: 'Business information',
        source: 'ARI',
        topicId: 'cly468yt5000m7ryzroat6b69',
        isMapped: true
    },
    {
        title: 'Business governance',
        source: 'ARI',
        topicId: 'cly468ytd000n7ryzqcz547g2',
        isMapped: true
    },
    {
        title: 'Biofuel',
        source: 'ARI',
        topicId: 'clkv6uq5d0314l2rssy0nzosp',
        isMapped: true
    },
    {
        title: 'Biotechnology business',
        source: 'ARI',
        topicId: 'cly468yuu000u7ryz2eh5vx2v',
        isMapped: true
    },
    {
        title: 'Bonds',
        source: 'ARI',
        topicId: 'cly468ytj000o7ryzzb0u5flo',
        isMapped: true
    },
    {
        title: 'Budgets and budgeting',
        source: 'ARI',
        topicId: 'cly468ytp000p7ryzmxf18qkz',
        isMapped: true
    },
    {
        title: 'Border disputes',
        source: 'ARI',
        topicId: 'cly468yu7000s7ryzwsvk9zjs',
        isMapped: true
    },
    {
        title: 'Belief systems',
        source: 'ARI',
        topicId: 'cly468yun000t7ryzl4ysmzhy',
        isMapped: true
    },
    {
        title: 'Biomedical science',
        source: 'ARI',
        topicId: 'clkv6uirq007gl2rslef9w0la',
        isMapped: true
    },
    {
        title: 'Biotechnology',
        source: 'ARI',
        topicId: 'clkv6umry01pml2rsm88kiw2g',
        isMapped: true
    },
    {
        title: 'Biology',
        source: 'ARI',
        topicId: 'clkv6uiqu0074l2rstds34z8q',
        isMapped: true
    },
    {
        title: 'Botany',
        source: 'ARI',
        topicId: 'clkv6uiqz0076l2rse4zmuyv9',
        isMapped: true
    },
    {
        title: 'Bullying',
        source: 'ARI',
        topicId: 'cly468yv1000v7ryzty41klkp',
        isMapped: true
    },
    {
        title: 'Cinema',
        source: 'ARI',
        topicId: 'clwueayzb00033s9o9lrgdmn7',
        isMapped: true
    },
    {
        title: 'Culture',
        source: 'ARI',
        topicId: 'clkv6ulwl01e8l2rsmch91jsi',
        isMapped: true
    },
    {
        title: 'Cultural development',
        source: 'ARI',
        topicId: 'cly468yv8000w7ryzkaz1an14',
        isMapped: true
    },
    {
        title: 'Customs and tradition',
        source: 'ARI',
        topicId: 'clkv6uifc002yl2rsgbu5pr89',
        isMapped: true
    },
    {
        title: 'Civil Rights',
        source: 'ARI',
        topicId: 'cm2it6nkj00009k9lehmh7vkj',
        isMapped: true
    },
    {
        title: 'Civil war',
        source: 'ARI',
        topicId: 'cly468ywd000x7ryz9e12502q',
        isMapped: true
    },
    {
        title: 'Civil unrest',
        source: 'ARI',
        topicId: 'cly468ywj000y7ryzrwynwtqz',
        isMapped: true
    },
    {
        title: 'Cyber warfare',
        source: 'ARI',
        topicId: 'cly468ywr000z7ryzszujb6nl',
        isMapped: true
    },
    {
        title: 'Crime',
        source: 'ARI',
        topicId: 'cly468yf300007ryzm3e5px2a',
        isMapped: true
    },
    {
        title: 'Corporate crime',
        source: 'ARI',
        topicId: 'cly468yx000107ryzzw3v9it5',
        isMapped: true
    },
    {
        title: 'Corruption',
        source: 'ARI',
        topicId: 'cly468yx700117ryzko2uvxbq',
        isMapped: true
    },
    {
        title: 'Cyber crime',
        source: 'ARI',
        topicId: 'cly468yxd00127ryz787ov3b9',
        isMapped: true
    },
    {
        title: 'Court',
        source: 'ARI',
        topicId: 'cly4690k100a47ryzhfqhnbbd',
        isMapped: true
    },
    {
        title: 'Criminal law',
        source: 'ARI',
        topicId: 'cly468yxp00147ryzbhn7wkds',
        isMapped: true
    },
    {
        title: 'Corporate financing',
        source: 'ARI',
        topicId: 'clkv6ulur01dkl2rs25d1i41s',
        isMapped: true
    },
    {
        title: 'Credit rating',
        source: 'ARI',
        topicId: 'cly4690iy009y7ryzrr21tg4x',
        isMapped: true
    },
    {
        title: 'Commercial contract',
        source: 'ARI',
        topicId: 'clkv6uloc01asl2rsonw0aikx',
        isMapped: true
    },
    {
        title: 'Company spin-off',
        source: 'ARI',
        topicId: 'cly468yy500167ryzcl85ugvl',
        isMapped: true
    },
    {
        title: 'Chemicals',
        source: 'ARI',
        topicId: 'clkv6umrr01pkl2rs6yfe21ht',
        isMapped: true
    },
    {
        title: 'Computing and information technology',
        source: 'ARI',
        topicId: 'cly468yyi00187ryzt22ty3w7',
        isMapped: true
    },
    {
        title: 'Computer networking',
        source: 'ARI',
        topicId: 'cly468yyp00197ryzp2zsnqmy',
        isMapped: true
    },
    {
        title: 'Computer security',
        source: 'ARI',
        topicId: 'cly468yyv001a7ryz2djgivhh',
        isMapped: true
    },
    {
        title: 'Construction and property',
        source: 'ARI',
        topicId: 'clkv6uix10096l2rs6utezvbo',
        isMapped: true
    },
    {
        title: 'Commercial building',
        source: 'ARI',
        topicId: 'cly468yz1001b7ryzzrj7r2gm',
        isMapped: true
    },
    {
        title: 'Consumer goods',
        source: 'ARI',
        topicId: 'cly468yz8001c7ryzzhf5yfmq',
        isMapped: true
    },
    {
        title: 'Consumer electronics',
        source: 'ARI',
        topicId: 'cly468yze001d7ryzgeq4mksc',
        isMapped: true
    },
    {
        title: 'Coal',
        source: 'ARI',
        topicId: 'cly468yzo001e7ryzi83h1wj8',
        isMapped: true
    },
    {
        title: 'Casino and gambling',
        source: 'ARI',
        topicId: 'cly468yzt001f7ryzdh7hi1gt',
        isMapped: true
    },
    {
        title: 'Cooperative',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Central bank',
        source: 'ARI',
        topicId: 'cly468yzz001g7ryz8xds2lbp',
        isMapped: true
    },
    {
        title: 'Consumers',
        source: 'ARI',
        topicId: 'clkv6ulgt017yl2rsnu240ps9',
        isMapped: true
    },
    {
        title: 'Consumer confidence',
        source: 'ARI',
        topicId: 'cly468z04001h7ryzlesrkxdt',
        isMapped: true
    },
    {
        title: 'Consumer issue',
        source: 'ARI',
        topicId: 'cly468z0a001i7ryz5dsdasm1',
        isMapped: true
    },
    {
        title: 'Credit and debt',
        source: 'ARI',
        topicId: 'clkv6upos02ual2rswg7o0a6m',
        isMapped: true
    },
    {
        title: 'Currency',
        source: 'ARI',
        topicId: 'cly468z0e001j7ryzzx2yduz4',
        isMapped: true
    },
    {
        title: 'Cryptocurrency',
        source: 'ARI',
        topicId: 'cly468z0k001k7ryzehpfxpbn',
        isMapped: true
    },
    {
        title: 'College and university',
        source: 'ARI',
        topicId: 'cly468z0p001l7ryz5vfq79sl',
        isMapped: true
    },
    {
        title: 'Climate change',
        source: 'ARI',
        topicId: 'clkv6uizf00a6l2rsck5tw4cb',
        isMapped: true
    },
    {
        title: 'Conservation',
        source: 'ARI',
        topicId: 'clkv6uiza00a4l2rs9xhxgjx5',
        isMapped: true
    },
    {
        title: 'Cancer',
        source: 'ARI',
        topicId: 'clkv6uom502fkl2rse1at3abi',
        isMapped: true
    },
    {
        title: 'Child labour',
        source: 'ARI',
        topicId: 'cly468z0z001n7ryzops8focq',
        isMapped: true
    },
    {
        title: 'Commuting',
        source: 'ARI',
        topicId: 'cly468z19001p7ryzl7vgq9c3',
        isMapped: true
    },
    {
        title: 'Collective agreements',
        source: 'ARI',
        topicId: 'cly468z1k001r7ryz8vuhxy09',
        isMapped: true
    },
    {
        title: 'Censorship and freedom of speech',
        source: 'ARI',
        topicId: 'cly468z1p001s7ryzh3wpv4y1',
        isMapped: true
    },
    {
        title: 'Civil and public service',
        source: 'ARI',
        topicId: 'cly468z34001u7ryz20wang92',
        isMapped: true
    },
    {
        title: 'Civilian service',
        source: 'ARI',
        topicId: 'cly468z39001v7ryzas778rb2',
        isMapped: true
    },
    {
        title: 'Cultural policies',
        source: 'ARI',
        topicId: 'cly4690kb00a57ryzg1f59ik9',
        isMapped: true
    },
    {
        title: 'Chemistry',
        source: 'ARI',
        topicId: 'clkv6uiqi0070l2rsvvg5kbis',
        isMapped: true
    },
    {
        title: 'Cosmology',
        source: 'ARI',
        topicId: 'clkv6um5x01hil2rsbd75wsdc',
        isMapped: true
    },
    {
        title: 'Civil engineering',
        source: 'ARI',
        topicId: 'cly468zhr004c7ryzr4zoffy6',
        isMapped: true
    },
    {
        title: 'Communities',
        source: 'ARI',
        topicId: 'clkv6uihv003sl2rs3y8ccll7',
        isMapped: true
    },
    {
        title: 'Children',
        source: 'ARI',
        topicId: 'cly468z3j001x7ryzonzszypv',
        isMapped: true
    },
    {
        title: 'Charity',
        source: 'ARI',
        topicId: 'cly468z3o001y7ryzxhm8jre3',
        isMapped: true
    },
    {
        title: 'Child care',
        source: 'ARI',
        topicId: 'cly4690ko00a67ryzsp8y2xls',
        isMapped: true
    },
    {
        title: 'Dance',
        source: 'ARI',
        topicId: 'cly468z3t001z7ryznn7syb7p',
        isMapped: true
    },
    {
        title: 'Design (visual arts)',
        source: 'ARI',
        topicId: 'clkv6uim1005il2rs09cnigt6',
        isMapped: true
    },
    {
        title: 'Disinformation and misinformation',
        source: 'ARI',
        topicId: 'cly468z3y00207ryzqvis97dw',
        isMapped: true
    },
    {
        title: 'Demonstration',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Disarmament',
        source: 'ARI',
        topicId: 'cly468z4300217ryzhkhex6l3',
        isMapped: true
    },
    {
        title: 'Drug related crimes',
        source: 'ARI',
        topicId: 'cly468z4c00227ryz8xid7zfc',
        isMapped: true
    },
    {
        title: 'Drug trafficking',
        source: 'ARI',
        topicId: 'cly468z4i00237ryzbucb6ll8',
        isMapped: true
    },
    {
        title: 'Drought',
        source: 'ARI',
        topicId: 'cly468z4n00247ryzts9vje10',
        isMapped: true
    },
    {
        title: 'Dividend announcement',
        source: 'ARI',
        topicId: 'cly468z4x00257ryz23hywv1c',
        isMapped: true
    },
    {
        title: 'Design and engineering',
        source: 'ARI',
        topicId: 'clkv6umcf01jul2rscf6c2ev9',
        isMapped: true
    },
    {
        title: 'Diesel fuel',
        source: 'ARI',
        topicId: 'clkv6unof021sl2rsoj23tx8r',
        isMapped: true
    },
    {
        title: 'Deflation',
        source: 'ARI',
        topicId: 'cly468z5400267ryzw7y0mtkb',
        isMapped: true
    },
    {
        title: 'Debt market',
        source: 'ARI',
        topicId: 'cly468z5d00277ryz2z3gq165',
        isMapped: true
    },
    {
        title: 'Developmental disorder',
        source: 'ARI',
        topicId: 'clkv6upgd02r0l2rs2bxvtrht',
        isMapped: true
    },
    {
        title: 'Drug rehabilitation',
        source: 'ARI',
        topicId: 'cly468z5o00287ryzt01vaqde',
        isMapped: true
    },
    {
        title: 'Data protection policy',
        source: 'ARI',
        topicId: 'cly468z6200297ryz1ldm7jf8',
        isMapped: true
    },
    {
        title: 'Diplomacy',
        source: 'ARI',
        topicId: 'cly468ytv000q7ryz4w8h6vtv',
        isMapped: true
    },
    {
        title: 'Democracy',
        source: 'ARI',
        topicId: 'cly468z68002a7ryz50m4553u',
        isMapped: true
    },
    {
        title: 'Dictatorship',
        source: 'ARI',
        topicId: 'cly468z6d002b7ryzefcyh6ee',
        isMapped: true
    },
    {
        title: 'Demographics',
        source: 'ARI',
        topicId: 'clkv6ulh20182l2rsveamurb8',
        isMapped: true
    },
    {
        title: 'Discrimination',
        source: 'ARI',
        topicId: 'cly468z6j002c7ryzfa2idsz5',
        isMapped: true
    },
    {
        title: 'Divorce',
        source: 'ARI',
        topicId: 'clkv6um0h01fml2rs1gz6toxk',
        isMapped: true
    },
    {
        title: 'Disabilities',
        source: 'ARI',
        topicId: 'clkv6upkn02sml2rs3g5qmcfh',
        isMapped: true
    },
    {
        title: 'Embezzlement',
        source: 'ARI',
        topicId: 'cly468z6o002d7ryz50jmkdsc',
        isMapped: true
    },
    {
        title: 'Emergency response',
        source: 'ARI',
        topicId: 'cly468z75002g7ryzya07dp9h',
        isMapped: true
    },
    {
        title: 'Earnings',
        source: 'ARI',
        topicId: 'cly468z7a002h7ryzc5101veq',
        isMapped: true
    },
    {
        title: 'Environmental, social and governance policy (esg)',
        source: 'ARI',
        topicId: 'cly4690kv00a77ryz3kopawt1',
        isMapped: true
    },
    {
        title: 'Economic globalisation',
        source: 'ARI',
        topicId: 'cly468z7g002i7ryzznuni9e5',
        isMapped: true
    },
    {
        title: 'Economic sector',
        source: 'ARI',
        topicId: 'clkv6uli9018gl2rs6muu36le',
        isMapped: true
    },
    {
        title: 'Energy and resource',
        source: 'ARI',
        topicId: 'cly4690l200a87ryz3uvra0tu',
        isMapped: true
    },
    {
        title: 'Electricity production and distribution',
        source: 'ARI',
        topicId: 'clkv6ump301ool2rsf4hcy5ob',
        isMapped: true
    },
    {
        title: 'Electrical appliance',
        source: 'ARI',
        topicId: 'cly468z7l002j7ryzftruo94y',
        isMapped: true
    },
    {
        title: 'Electronic commerce',
        source: 'ARI',
        topicId: 'cly468z7q002k7ryzx0n8ozf4',
        isMapped: true
    },
    {
        title: 'Economy',
        source: 'ARI',
        topicId: 'clkv6uig50038l2rs51tojhtj',
        isMapped: true
    },
    {
        title: 'Entrepreneurship',
        source: 'ARI',
        topicId: 'cly468z7w002l7ryz6fg7kcv7',
        isMapped: true
    },
    {
        title: 'Economic growth',
        source: 'ARI',
        topicId: 'cly468z82002m7ryzhgsy9cic',
        isMapped: true
    },
    {
        title: 'Economic indicator',
        source: 'ARI',
        topicId: 'cly468z87002n7ryzwldbhp9z',
        isMapped: true
    },
    {
        title: 'Economic organisation',
        source: 'ARI',
        topicId: 'cly468z8c002o7ryzhn57woce',
        isMapped: true
    },
    {
        title: 'Emerging market',
        source: 'ARI',
        topicId: 'cly468z8l002p7ryzw6h9d14c',
        isMapped: true
    },
    {
        title: 'Employment statistics',
        source: 'ARI',
        topicId: 'cly468z8r002q7ryzc91mghol',
        isMapped: true
    },
    {
        title: 'Exports',
        source: 'ARI',
        topicId: 'cly468z8x002r7ryzlig4ssmt',
        isMapped: true
    },
    {
        title: 'Energy market',
        source: 'ARI',
        topicId: 'cly468z99002t7ryz7zooeobl',
        isMapped: true
    },
    {
        title: 'Energy saving',
        source: 'ARI',
        topicId: 'cly468z9e002u7ryzvk4k7kdp',
        isMapped: true
    },
    {
        title: 'Environmental pollution',
        source: 'ARI',
        topicId: 'clkv6un6g01v2l2rsnxsssx4g',
        isMapped: true
    },
    {
        title: 'Environmental clean-up',
        source: 'ARI',
        topicId: 'cly468z9j002v7ryzh0s9x23r',
        isMapped: true
    },
    {
        title: 'Energy resources',
        source: 'ARI',
        topicId: 'cly468z9q002w7ryz2pjwg5fd',
        isMapped: true
    },
    {
        title: 'Ecosystem',
        source: 'ARI',
        topicId: 'clkv6uq5x031cl2rsl1a6892a',
        isMapped: true
    },
    {
        title: 'Endangered species',
        source: 'ARI',
        topicId: 'cly468z9v002x7ryzrh2jtmuc',
        isMapped: true
    },
    {
        title: 'Epidemic and pandemic',
        source: 'ARI',
        topicId: 'clkv6uofl02d4l2rs02qblfb8',
        isMapped: true
    },
    {
        title: 'Emergency care',
        source: 'ARI',
        topicId: 'cly468za0002y7ryz1tuo1ers',
        isMapped: true
    },
    {
        title: 'Employment',
        source: 'ARI',
        topicId: 'cly468za8002z7ryz8g8pl8bx',
        isMapped: true
    },
    {
        title: 'Exercise and fitness',
        source: 'ARI',
        topicId: 'cly468zad00307ryzeekrkmbl',
        isMapped: true
    },
    {
        title: 'Election',
        source: 'ARI',
        topicId: 'cly468zaj00317ryz6edu1iar',
        isMapped: true
    },
    {
        title: 'Electoral system',
        source: 'ARI',
        topicId: 'cly468zao00327ryzea10zjej',
        isMapped: true
    },
    {
        title: 'Espionage and intelligence',
        source: 'ARI',
        topicId: 'cly4690j800a07ryzk48cvryl',
        isMapped: true
    },
    {
        title: 'Executive (government)',
        source: 'ARI',
        topicId: 'cly468zaz00347ryzqdhfzw7o',
        isMapped: true
    },
    {
        title: 'Economic policy',
        source: 'ARI',
        topicId: 'cly4690l800a97ryz4df4j0s5',
        isMapped: true
    },
    {
        title: 'Economic development incentive',
        source: 'ARI',
        topicId: 'cly4690li00aa7ryz51fumo8r',
        isMapped: true
    },
    {
        title: 'Education policy',
        source: 'ARI',
        topicId: 'cly4690lq00ab7ryzpg64y15x',
        isMapped: true
    },
    {
        title: 'Environmental policy',
        source: 'ARI',
        topicId: 'clkv6ulfk017gl2rssuoaii4k',
        isMapped: true
    },
    {
        title: 'Economic sanction',
        source: 'ARI',
        topicId: 'cly468zb500357ryzqg25h22s',
        isMapped: true
    },
    {
        title: 'Electromagnetism',
        source: 'ARI',
        topicId: 'clkv6um7101hyl2rsxx5lndpj',
        isMapped: true
    },
    {
        title: 'Economics',
        source: 'ARI',
        topicId: 'clkv6uifz0036l2rsmcyhgjwb',
        isMapped: true
    },
    {
        title: 'Electronic engineering',
        source: 'ARI',
        topicId: 'clkv6uixa009al2rs677oojle',
        isMapped: true
    },
    {
        title: 'Ethics',
        source: 'ARI',
        topicId: 'clkv6upmw02til2rsrq5otsg3',
        isMapped: true
    },
    {
        title: 'Elderly care',
        source: 'ARI',
        topicId: 'cly468zba00367ryzo19txzma',
        isMapped: true
    },
    {
        title: 'Fashion',
        source: 'ARI',
        topicId: 'cly468zbf00377ryzwb27w8q3',
        isMapped: true
    },
    {
        title: 'Festive event (culture)',
        source: 'ARI',
        topicId: 'cly468zbp00397ryzjqsa6oq3',
        isMapped: true
    },
    {
        title: 'Fraud',
        source: 'ARI',
        topicId: 'cly468zbu003a7ryzcx8lpu68',
        isMapped: true
    },
    {
        title: 'Fine (penalty)',
        source: 'ARI',
        topicId: 'cly468zc8003d7ryz3u7hzwb5',
        isMapped: true
    },
    {
        title: 'Flood',
        source: 'ARI',
        topicId: 'cly468zbz003b7ryzc2s01vz7',
        isMapped: true
    },
    {
        title: 'Financial statement',
        source: 'ARI',
        topicId: 'cly468zcd003e7ryzbbnk8ku3',
        isMapped: true
    },
    {
        title: 'Fishing industry',
        source: 'ARI',
        topicId: 'clkv6uivg008ol2rsdommaht8',
        isMapped: true
    },
    {
        title: 'Forestry and timber',
        source: 'ARI',
        topicId: 'clkv6uiv6008kl2rs61tnwvbn',
        isMapped: true
    },
    {
        title: 'Financial and business service',
        source: 'ARI',
        topicId: 'cly468zci003f7ryzrxngksbz',
        isMapped: true
    },
    {
        title: 'Food industry',
        source: 'ARI',
        topicId: 'cly468zcn003g7ryz4eavc8jw',
        isMapped: true
    },
    {
        title: 'Foreign exchange market',
        source: 'ARI',
        topicId: 'clkv6uluj01dil2rsyidtrsb8',
        isMapped: true
    },
    {
        title: 'Forests',
        source: 'ARI',
        topicId: 'cly468zcs003h7ryz5w8qsw3l',
        isMapped: true
    },
    {
        title: 'Flowers and plants',
        source: 'ARI',
        topicId: 'cly468zcx003i7ryzk3gz38tq',
        isMapped: true
    },
    {
        title: 'Freedom of religion',
        source: 'ARI',
        topicId: 'cly468zd2003j7ryz22fgedqs',
        isMapped: true
    },
    {
        title: 'Freedom of the press',
        source: 'ARI',
        topicId: 'cly468zd7003k7ryzv4bb30w7',
        isMapped: true
    },
    {
        title: 'Food and drink regulations',
        source: 'ARI',
        topicId: 'cly4690m100ad7ryzmxkvj4b1',
        isMapped: true
    },
    {
        title: 'Foreign aid',
        source: 'ARI',
        topicId: 'cly468zdc003l7ryzr1939mt0',
        isMapped: true
    },
    {
        title: 'Fraternal and community group',
        source: 'ARI',
        topicId: 'clkv6ulx301egl2rszbgb47k1',
        isMapped: true
    },
    {
        title: 'Family',
        source: 'ARI',
        topicId: 'clkv6ulyc01eul2rs326z8voe',
        isMapped: true
    },
    {
        title: 'Family planning',
        source: 'ARI',
        topicId: 'cly468zdh003m7ryzyvhlu07z',
        isMapped: true
    },
    {
        title: 'Guerrilla activity',
        source: 'ARI',
        topicId: 'cly468zdm003n7ryz99gozxaz',
        isMapped: true
    },
    {
        title: 'Genocide',
        source: 'ARI',
        topicId: 'cly468zdr003o7ryzc0se6vqb',
        isMapped: true
    },
    {
        title: 'Gang activity',
        source: 'ARI',
        topicId: 'cly468zdw003p7ryzvl4zcdh4',
        isMapped: true
    },
    {
        title: 'Grocery',
        source: 'ARI',
        topicId: 'cly468ze1003q7ryzlz6ixmop',
        isMapped: true
    },
    {
        title: 'Geothermal power',
        source: 'ARI',
        topicId: 'clkv6unq2022il2rsptikrspg',
        isMapped: true
    },
    {
        title: 'Gross domestic product',
        source: 'ARI',
        topicId: 'cly468ze6003r7ryzv3q129h6',
        isMapped: true
    },
    {
        title: 'Government aid',
        source: 'ARI',
        topicId: 'cly468zec003s7ryz48yvjca4',
        isMapped: true
    },
    {
        title: 'Government debt',
        source: 'ARI',
        topicId: 'clkv6ulw101e0l2rswdb8f2rr',
        isMapped: true
    },
    {
        title: 'Global warming',
        source: 'ARI',
        topicId: 'clkv6uizf00a6l2rsck5tw4cb',
        isMapped: true
    },
    {
        title: 'Government health care',
        source: 'ARI',
        topicId: 'cly468zek003t7ryz0v1e2rjb',
        isMapped: true
    },
    {
        title: 'Gig economy',
        source: 'ARI',
        topicId: 'cly468zer003u7ryzg26iw2m7',
        isMapped: true
    },
    {
        title: 'Gaming and lottery',
        source: 'ARI',
        topicId: 'cly468zex003v7ryziabfrx07',
        isMapped: true
    },
    {
        title: 'Government',
        source: 'ARI',
        topicId: 'cly468z1u001t7ryzkbpl2w86',
        isMapped: true
    },
    {
        title: 'Government budget',
        source: 'ARI',
        topicId: 'cly468zf2003w7ryz7yuynsa3',
        isMapped: true
    },
    {
        title: 'Government department',
        source: 'ARI',
        topicId: 'cly468zf7003x7ryzqceye4ra',
        isMapped: true
    },
    {
        title: 'Government policy',
        source: 'ARI',
        topicId: 'cly468zfd003y7ryzoeleyai4',
        isMapped: true
    },
    {
        title: 'Genetics',
        source: 'ARI',
        topicId: 'clkv6uiyj009sl2rskzws5x45',
        isMapped: true
    },
    {
        title: 'Geology',
        source: 'ARI',
        topicId: 'clkv6uiqo0072l2rsplkmhbxb',
        isMapped: true
    },
    {
        title: 'Geography',
        source: 'ARI',
        topicId: 'clkv6uia50016l2rs51aatj04',
        isMapped: true
    },
    {
        title: 'Gender',
        source: 'ARI',
        topicId: 'cly468zfp003z7ryzln4xipiv',
        isMapped: true
    },
    {
        title: 'Homicide',
        source: 'ARI',
        topicId: 'cly468zfv00407ryz8dxi5b27',
        isMapped: true
    },
    {
        title: 'Human smuggling and trafficking',
        source: 'ARI',
        topicId: 'cly468zg100417ryzhz91jmwk',
        isMapped: true
    },
    {
        title: 'Human resources',
        source: 'ARI',
        topicId: 'cly468zg800427ryz5ff0twr1',
        isMapped: true
    },
    {
        title: 'House building',
        source: 'ARI',
        topicId: 'clkv6uix10096l2rs6utezvbo',
        isMapped: true
    },
    {
        title: 'Hydroelectric power',
        source: 'ARI',
        topicId: 'cly468zge00437ryzrnyrflwc',
        isMapped: true
    },
    {
        title: 'Healthcare industry',
        source: 'ARI',
        topicId: 'cly468zgj00447ryz4hfiddyt',
        isMapped: true
    },
    {
        title: 'Health care provider',
        source: 'ARI',
        topicId: 'cly468zgp00457ryz4toyrdsw',
        isMapped: true
    },
    {
        title: 'Hot stock',
        source: 'ARI',
        topicId: 'cly4690m600ae7ryz39oitxki',
        isMapped: true
    },
    {
        title: 'Hazardous materials',
        source: 'ARI',
        topicId: 'clkv6umhg01lwl2rsg7okxg5c',
        isMapped: true
    },
    {
        title: 'Health facility',
        source: 'ARI',
        topicId: 'cly468zgu00467ryzrjbt02sa',
        isMapped: true
    },
    {
        title: 'Hospital',
        source: 'ARI',
        topicId: 'cly468zh000477ryzes6s6mk7',
        isMapped: true
    },
    {
        title: 'Health care approach',
        source: 'ARI',
        topicId: 'cly468zh500487ryzrc5kgwfh',
        isMapped: true
    },
    {
        title: 'House and home',
        source: 'ARI',
        topicId: 'clkv6uiy9009ol2rsub7ycbuz',
        isMapped: true
    },
    {
        title: 'Human rights',
        source: 'ARI',
        topicId: 'cly468zhg004a7ryza5n7nlh2',
        isMapped: true
    },
    {
        title: 'Healthcare policy',
        source: 'ARI',
        topicId: 'cly468zhm004b7ryzy93xd6to',
        isMapped: true
    },
    {
        title: 'Housing and urban planning policy',
        source: 'ARI',
        topicId: 'cly468zhx004d7ryzsezmjjyt',
        isMapped: true
    },
    {
        title: 'Horticulture',
        source: 'ARI',
        topicId: 'clkv6uiut008il2rss8m7wa1w',
        isMapped: true
    },
    {
        title: 'History',
        source: 'ARI',
        topicId: 'clkv6uibo001ol2rs28ahmsia',
        isMapped: true
    },
    {
        title: 'Homelessness',
        source: 'ARI',
        topicId: 'cly468zi2004e7ryzplw6y1eq',
        isMapped: true
    },
    {
        title: 'Influencers',
        source: 'ARI',
        topicId: 'cly468zi8004f7ryzhyrtdjhj',
        isMapped: true
    },
    {
        title: 'International military intervention',
        source: 'ARI',
        topicId: 'cly468zig004g7ryz99dscluy',
        isMapped: true
    },
    {
        title: 'International law',
        source: 'ARI',
        topicId: 'cly468zim004h7ryzps1o1krb',
        isMapped: true
    },
    {
        title: 'International court and tribunal',
        source: 'ARI',
        topicId: 'cly468zis004i7ryz9iwyu2po',
        isMapped: true
    },
    {
        title: 'Investigation (criminal)',
        source: 'ARI',
        topicId: 'cly468zix004j7ryzwskqyclz',
        isMapped: true
    },
    {
        title: 'Industrial accident and incident',
        source: 'ARI',
        topicId: 'cly468zj3004k7ryzr5nnrthn',
        isMapped: true
    },
    {
        title: 'Internet of things',
        source: 'ARI',
        topicId: 'cly468zj8004l7ryzpwb62r27',
        isMapped: true
    },
    {
        title: 'Infrastructure projects',
        source: 'ARI',
        topicId: 'cly468zje004m7ryzqweo8iuj',
        isMapped: true
    },
    {
        title: 'Insurance',
        source: 'ARI',
        topicId: 'clkv6ulvh01dsl2rslws59nxv',
        isMapped: true
    },
    {
        title: 'Industrial component',
        source: 'ARI',
        topicId: 'cly468zjj004n7ryzn4d5ulni',
        isMapped: true
    },
    {
        title: 'Industrial production',
        source: 'ARI',
        topicId: 'clkv6uljb018wl2rs1lszlvoo',
        isMapped: true
    },
    {
        title: 'Inventories',
        source: 'ARI',
        topicId: 'cly468zjo004o7ryzfdhg729h',
        isMapped: true
    },
    {
        title: 'Imports',
        source: 'ARI',
        topicId: 'cly468z93002s7ryzac474vgn',
        isMapped: true
    },
    {
        title: 'Inflation',
        source: 'ARI',
        topicId: 'cly468z5400267ryzw7y0mtkb',
        isMapped: true
    },
    {
        title: 'Interest rate',
        source: 'ARI',
        topicId: 'cly468zju004p7ryz5hf0c210',
        isMapped: true
    },
    {
        title: 'International economic institution',
        source: 'ARI',
        topicId: 'cly468zjz004q7ryzcxrb7ate',
        isMapped: true
    },
    {
        title: 'International trade',
        source: 'ARI',
        topicId: 'clkv6uigk003el2rswm10fyv8',
        isMapped: true
    },
    {
        title: 'Investments',
        source: 'ARI',
        topicId: 'clkv6ulv101dol2rsojb5cjfo',
        isMapped: true
    },
    {
        title: 'Invasive species',
        source: 'ARI',
        topicId: 'cly468zk4004r7ryz969humw0',
        isMapped: true
    },
    {
        title: 'Injury',
        source: 'ARI',
        topicId: 'clkv6un0r01sul2rsdsj1n3ac',
        isMapped: true
    },
    {
        title: 'Interior policy',
        source: 'ARI',
        topicId: 'cly468zka004s7ryzogn1sx12',
        isMapped: true
    },
    {
        title: 'Infrastructure policy',
        source: 'ARI',
        topicId: 'cly468zkg004t7ryz2tcdsi21',
        isMapped: true
    },
    {
        title: 'Integration policy',
        source: 'ARI',
        topicId: 'cly468zkl004u7ryz4y8evn1t',
        isMapped: true
    },
    {
        title: 'International relations',
        source: 'ARI',
        topicId: 'cly468zat00337ryz1omx361g',
        isMapped: true
    },
    {
        title: 'International organisation',
        source: 'ARI',
        topicId: 'cly468zkr004v7ryzkep45td7',
        isMapped: true
    },
    {
        title: 'Information science',
        source: 'ARI',
        topicId: 'clwueaif500013s9ot60ojc4t',
        isMapped: true
    },
    {
        title: 'Identification technology',
        source: 'ARI',
        topicId: 'cly468zkx004w7ryzxpjcx0du',
        isMapped: true
    },
    {
        title: 'Information technology and computer science',
        source: 'ARI',
        topicId: 'cly468yyi00187ryzt22ty3w7',
        isMapped: true
    },
    {
        title: 'Immigration',
        source: 'ARI',
        topicId: 'cly468zl2004x7ryzpxvnsszm',
        isMapped: true
    },
    {
        title: 'Indigenous people',
        source: 'ARI',
        topicId: 'cly468zl7004y7ryzra06lu2c',
        isMapped: true
    },
    {
        title: 'Infants',
        source: 'ARI',
        topicId: 'cly468zlc004z7ryzoma8h38r',
        isMapped: true
    },
    {
        title: 'Judiciary',
        source: 'ARI',
        topicId: 'cly4690mc00af7ryz4os3d7ey',
        isMapped: true
    },
    {
        title: 'Judge',
        source: 'ARI',
        topicId: 'cly4690mh00ag7ryzoutg05mz',
        isMapped: true
    },
    {
        title: 'Justice',
        source: 'ARI',
        topicId: 'cly468zli00507ryzh96v7r8o',
        isMapped: true
    },
    {
        title: 'Joint venture',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Juvenile delinquency',
        source: 'ARI',
        topicId: 'cly4690je00a17ryzm89uqdu8',
        isMapped: true
    },
    {
        title: 'Kerosene/paraffin',
        source: 'ARI',
        topicId: 'cly468zln00517ryzqd66cry8',
        isMapped: true
    },
    {
        title: 'Literature',
        source: 'ARI',
        topicId: 'clkv6uid20024l2rsvzkyu0d0',
        isMapped: true
    },
    {
        title: 'Language',
        source: 'ARI',
        topicId: 'clkv6uid20024l2rsvzkyu0d0',
        isMapped: true
    },
    {
        title: 'Library and museum',
        source: 'ARI',
        topicId: 'cly468zlt00527ryz1vpeghn5',
        isMapped: true
    },
    {
        title: 'Law',
        source: 'ARI',
        topicId: 'clkv6uicc001wl2rsctkelkiz',
        isMapped: true
    },
    {
        title: 'Law enforcement',
        source: 'ARI',
        topicId: 'cly468zly00537ryzfs9vsasl',
        isMapped: true
    },
    {
        title: 'Landslide',
        source: 'ARI',
        topicId: 'cly468zm300547ryzcawoxdsq',
        isMapped: true
    },
    {
        title: 'Leveraged buyout',
        source: 'ARI',
        topicId: 'cly468zmd00567ryze6zg11wu',
        isMapped: true
    },
    {
        title: 'Licensing agreement',
        source: 'ARI',
        topicId: 'cly468zmj00577ryzqkpsfor8',
        isMapped: true
    },
    {
        title: 'Livestock farming',
        source: 'ARI',
        topicId: 'clkv6uivc008ml2rsztxbm01f',
        isMapped: true
    },
    {
        title: 'Land price',
        source: 'ARI',
        topicId: 'cly468zmo00587ryz3lxg9rcg',
        isMapped: true
    },
    {
        title: 'Luxury good',
        source: 'ARI',
        topicId: 'cly468zmt00597ryzoiabfiej',
        isMapped: true
    },
    {
        title: 'Logistics',
        source: 'ARI',
        topicId: 'cly468zmy005a7ryz7imk4y8l',
        isMapped: true
    },
    {
        title: 'Loan market',
        source: 'ARI',
        topicId: 'cly468zna005c7ryzyva6xiop',
        isMapped: true
    },
    {
        title: 'Loans',
        source: 'ARI',
        topicId: 'cly468zn4005b7ryzj2ntt6e7',
        isMapped: true
    },
    {
        title: 'Land resources',
        source: 'ARI',
        topicId: 'clkv6ulhw018al2rsnfmegwu6',
        isMapped: true
    },
    {
        title: 'Labour market',
        source: 'ARI',
        topicId: 'clkv6upoe02u4l2rsfkf7tbhg',
        isMapped: true
    },
    {
        title: 'Labour relations',
        source: 'ARI',
        topicId: 'clkv6ulie018il2rsgnzwo1y7',
        isMapped: true
    },
    {
        title: 'Labour dispute',
        source: 'ARI',
        topicId: 'clkv6uloy01b2l2rscmz49fjp',
        isMapped: true
    },
    {
        title: 'Leisure venue',
        source: 'ARI',
        topicId: 'cly468znf005d7ryzp1bid0u9',
        isMapped: true
    },
    {
        title: 'Local elections',
        source: 'ARI',
        topicId: 'cly468zp0005e7ryzbw5rnp57',
        isMapped: true
    },
    {
        title: 'Legislative body',
        source: 'ARI',
        topicId: 'cly468zp6005f7ryz5ohtkyp6',
        isMapped: true
    },
    {
        title: 'Local government and authority',
        source: 'ARI',
        topicId: 'cly468zpb005g7ryzqfvczo4c',
        isMapped: true
    },
    {
        title: 'Local government policy',
        source: 'ARI',
        topicId: 'cly4690jj00a27ryzbypufx5p',
        isMapped: true
    },
    {
        title: 'Lobbying',
        source: 'ARI',
        topicId: 'cly468zpg005h7ryz58kdp70p',
        isMapped: true
    },
    {
        title: 'Lgbtq',
        source: 'ARI',
        topicId: 'cly468zpm005i7ryzxt0id187',
        isMapped: true
    },
    {
        title: 'Long-term care',
        source: 'ARI',
        topicId: 'cly468zpr005j7ryzxj1rttnu',
        isMapped: true
    },
    {
        title: 'Music',
        source: 'ARI',
        topicId: 'clkv6uicq0020l2rs1c1mx1hy',
        isMapped: true
    },
    {
        title: 'Monument and heritage site',
        source: 'ARI',
        topicId: 'cly468zpw005k7ryz8c6f6hut',
        isMapped: true
    },
    {
        title: 'Mass media',
        source: 'ARI',
        topicId: 'cly468zq7005m7ryzog5eucqu',
        isMapped: true
    },
    {
        title: 'Military occupation',
        source: 'ARI',
        topicId: 'cly468zqc005n7ryzj3wx2is2',
        isMapped: true
    },
    {
        title: 'Missing in action',
        source: 'ARI',
        topicId: 'cly468zqh005o7ryz8y9e96qe',
        isMapped: true
    },
    {
        title: 'Meteorological disaster',
        source: 'ARI',
        topicId: 'cly4690js00a37ryzt8w3ufe6',
        isMapped: true
    },
    {
        title: 'Management',
        source: 'ARI',
        topicId: 'clkv6ulhd0186l2rsdb3d3ugg',
        isMapped: true
    },
    {
        title: 'Merger or acquisition',
        source: 'ARI',
        topicId: 'cly468zm800557ryzf4wzw8pt',
        isMapped: true
    },
    {
        title: 'Manufacturing and engineering',
        source: 'ARI',
        topicId: 'clkv6umat01j8l2rsiq3s56sw',
        isMapped: true
    },
    {
        title: 'Machine manufacturing',
        source: 'ARI',
        topicId: 'clkv6uix60098l2rsr98k7iur',
        isMapped: true
    },
    {
        title: 'Media',
        source: 'ARI',
        topicId: 'cly468zqm005p7ryz7f7aazbg',
        isMapped: true
    },
    {
        title: 'Medical equipment',
        source: 'ARI',
        topicId: 'cly468zqs005q7ryzwbayxr2k',
        isMapped: true
    },
    {
        title: 'Macro economics',
        source: 'ARI',
        topicId: 'cly468zqx005r7ryz9ijnz94c',
        isMapped: true
    },
    {
        title: 'Market and exchange',
        source: 'ARI',
        topicId: 'cly468zr2005s7ryz91gz4jm1',
        isMapped: true
    },
    {
        title: 'Mountains',
        source: 'ARI',
        topicId: 'cly468zr9005t7ryzqyykgski',
        isMapped: true
    },
    {
        title: 'Medical condition',
        source: 'ARI',
        topicId: 'clkv6uirq007gl2rslef9w0la',
        isMapped: true
    },
    {
        title: 'Mental health and disorder',
        source: 'ARI',
        topicId: 'clkv6upc202pil2rsjxpxhk4y',
        isMapped: true
    },
    {
        title: 'Medical test',
        source: 'ARI',
        topicId: 'cly468zrh005u7ryzod63vd8c',
        isMapped: true
    },
    {
        title: 'Medical profession',
        source: 'ARI',
        topicId: 'cly468zro005v7ryzdi2eap4l',
        isMapped: true
    },
    {
        title: 'Medical service',
        source: 'ARI',
        topicId: 'cly468zgj00447ryz4hfiddyt',
        isMapped: true
    },
    {
        title: 'Mental wellbeing',
        source: 'ARI',
        topicId: 'clkv6upc202pil2rsjxpxhk4y',
        isMapped: true
    },
    {
        title: 'Military equipment',
        source: 'ARI',
        topicId: 'cly468zrt005w7ryzxabklhk2',
        isMapped: true
    },
    {
        title: 'Military weaponry',
        source: 'ARI',
        topicId: 'cly468zry005x7ryzzghho4sk',
        isMapped: true
    },
    {
        title: 'Migration policy',
        source: 'ARI',
        topicId: 'cly468zs4005y7ryz18bc8mgy',
        isMapped: true
    },
    {
        title: 'Mathematics',
        source: 'ARI',
        topicId: 'clkv6uiq1006ul2rs307fcz5p',
        isMapped: true
    },
    {
        title: 'Marine science',
        source: 'ARI',
        topicId: 'clkv6uq4q030ul2rsrngk7zf4',
        isMapped: true
    },
    {
        title: 'Meteorology',
        source: 'ARI',
        topicId: 'clkv6upmj02tcl2rsfmf2o1h8',
        isMapped: true
    },
    {
        title: 'Medical research',
        source: 'ARI',
        topicId: 'clkv6uirq007gl2rslef9w0la',
        isMapped: true
    },
    {
        title: 'Materials science',
        source: 'ARI',
        topicId: 'clkv6unbi01wwl2rs9vx32k1b',
        isMapped: true
    },
    {
        title: 'Mechanical engineering',
        source: 'ARI',
        topicId: 'clkv6uix60098l2rsr98k7iur',
        isMapped: true
    },
    {
        title: 'Micro science',
        source: 'ARI',
        topicId: 'cly468zs9005z7ryz5pc0d036',
        isMapped: true
    },
    {
        title: 'Marriage',
        source: 'ARI',
        topicId: 'cly468zsg00607ryz11x72kag',
        isMapped: true
    },
    {
        title: 'News media',
        source: 'ARI',
        topicId: 'cly468zsm00617ryzprjnsd1t',
        isMapped: true
    },
    {
        title: 'Nuclear accident and incident',
        source: 'ARI',
        topicId: 'cly468zsw00637ryz9c6t5jo2',
        isMapped: true
    },
    {
        title: 'Natural disaster',
        source: 'ARI',
        topicId: 'clkv6uldm016ql2rsr4ox91se',
        isMapped: true
    },
    {
        title: 'New product or service',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Non-durable good',
        source: 'ARI',
        topicId: 'cly468zt200647ryz28ppzwu4',
        isMapped: true
    },
    {
        title: 'Nuclear power',
        source: 'ARI',
        topicId: 'clkv6umq601p4l2rseps6hfu9',
        isMapped: true
    },
    {
        title: 'Natural gas',
        source: 'ARI',
        topicId: 'clkv6umtp01q2l2rsvsiafm9q',
        isMapped: true
    },
    {
        title: 'News agency',
        source: 'ARI',
        topicId: 'cly468zt700657ryz8mvzhj4k',
        isMapped: true
    },
    {
        title: 'Newspaper and magazine',
        source: 'ARI',
        topicId: 'cly468ztc00667ryz6wh6ejf5',
        isMapped: true
    },
    {
        title: 'Natural resources',
        source: 'ARI',
        topicId: 'cly468zti00677ryzj36yrl7q',
        isMapped: true
    },
    {
        title: 'Nature',
        source: 'ARI',
        topicId: 'clkv6uiyx009yl2rs5jwx6s2x',
        isMapped: true
    },
    {
        title: 'National security',
        source: 'ARI',
        topicId: 'cly468ztn00687ryzjcv3valm',
        isMapped: true
    },
    {
        title: 'National government',
        source: 'ARI',
        topicId: 'cly468z1u001t7ryzkbpl2w86',
        isMapped: true
    },
    {
        title: 'Nationalisation',
        source: 'ARI',
        topicId: 'cly468ztt00697ryzfn0j6xlf',
        isMapped: true
    },
    {
        title: 'Nuclear policy',
        source: 'ARI',
        topicId: 'cly468ztz006a7ryzihan74l9',
        isMapped: true
    },
    {
        title: 'Non-governmental organisation',
        source: 'ARI',
        topicId: 'cly468zu4006b7ryzx5avvv1v',
        isMapped: true
    },
    {
        title: 'Natural science',
        source: 'ARI',
        topicId: 'clkv6uipw006sl2rsc9bvqt4q',
        isMapped: true
    },
    {
        title: 'Nuclear physics',
        source: 'ARI',
        topicId: 'clkv6um7501i0l2rs3a42ftm2',
        isMapped: true
    },
    {
        title: 'Nanotechnology',
        source: 'ARI',
        topicId: 'cly468zua006c7ryzoeeoajoc',
        isMapped: true
    },
    {
        title: 'National or ethnic minority',
        source: 'ARI',
        topicId: 'cly468zug006d7ryzewj8ybmh',
        isMapped: true
    },
    {
        title: 'Online media outlet',
        source: 'ARI',
        topicId: 'cly4690mm00ah7ryzubqy2w7t',
        isMapped: true
    },
    {
        title: 'Ordnance clearance',
        source: 'ARI',
        topicId: 'cly468zul006e7ryznuojk8m2',
        isMapped: true
    },
    {
        title: 'Organised crime',
        source: 'ARI',
        topicId: 'cly468zuq006f7ryzitm7wkyh',
        isMapped: true
    },
    {
        title: 'Oil and gas industry',
        source: 'ARI',
        topicId: 'cly468zuw006g7ryztzazgghy',
        isMapped: true
    },
    {
        title: 'Online media industry',
        source: 'ARI',
        topicId: 'cly468zv2006h7ryz7uez83km',
        isMapped: true
    },
    {
        title: 'Online and remote learning',
        source: 'ARI',
        topicId: 'cly468zv8006i7ryzs6fqsr4p',
        isMapped: true
    },
    {
        title: 'Oceans',
        source: 'ARI',
        topicId: 'cly468zve006j7ryzhoby5u2f',
        isMapped: true
    },
    {
        title: 'Obesity',
        source: 'ARI',
        topicId: 'clkv6uozt02kwl2rscnr2a5lw',
        isMapped: true
    },
    {
        title: 'Outdoor recreational activities',
        source: 'ARI',
        topicId: 'cly468zvl006k7ryzow3b0idb',
        isMapped: true
    },
    {
        title: 'Olympic games',
        source: 'ARI',
        topicId: 'cly4690mr00ai7ryzjgnzmqhj',
        isMapped: true
    },
    {
        title: 'Photography',
        source: 'ARI',
        topicId: 'clkv6uixv009il2rs4i0jm22v',
        isMapped: true
    },
    {
        title: 'Peacekeeping force',
        source: 'ARI',
        topicId: 'cly468zvr006l7ryzhisczozb',
        isMapped: true
    },
    {
        title: 'Peace process',
        source: 'ARI',
        topicId: 'cly468zvw006m7ryzj56815rq',
        isMapped: true
    },
    {
        title: 'Post-war reconstruction',
        source: 'ARI',
        topicId: 'cly468zw2006n7ryz2zvxtuxj',
        isMapped: true
    },
    {
        title: 'Prisoners of war',
        source: 'ARI',
        topicId: 'cly468zw8006o7ryz74m4ug7h',
        isMapped: true
    },
    {
        title: 'Prison',
        source: 'ARI',
        topicId: 'cly468zwf006p7ryzx9fhum9r',
        isMapped: true
    },
    {
        title: 'Police',
        source: 'ARI',
        topicId: 'cly468zly00537ryzfs9vsasl',
        isMapped: true
    },
    {
        title: 'Patent, copyright and trademark',
        source: 'ARI',
        topicId: 'cly468zwn006q7ryz8sx9s51d',
        isMapped: true
    },
    {
        title: 'Product recall',
        source: 'ARI',
        topicId: 'cly468zws006r7ryzwekbbi5o',
        isMapped: true
    },
    {
        title: 'Public contract',
        source: 'ARI',
        topicId: 'cly468zx3006s7ryzayc5tkf8',
        isMapped: true
    },
    {
        title: 'Petrol',
        source: 'ARI',
        topicId: 'cly468zxb006t7ryzeyysv5gd',
        isMapped: true
    },
    {
        title: 'Pharmaceutical',
        source: 'ARI',
        topicId: 'clkv6uitk0084l2rsqq4s4ukx',
        isMapped: true
    },
    {
        title: 'Public relations',
        source: 'ARI',
        topicId: 'cly468zxi006u7ryzfzhnaoam',
        isMapped: true
    },
    {
        title: 'Productivity',
        source: 'ARI',
        topicId: 'cly468zxp006v7ryzq3hdwvmo',
        isMapped: true
    },
    {
        title: 'Prices',
        source: 'ARI',
        topicId: 'clkv6ulga017ql2rsqfmk64f6',
        isMapped: true
    },
    {
        title: 'Primary education',
        source: 'ARI',
        topicId: 'cly468zxu006w7ryzr7rqosug',
        isMapped: true
    },
    {
        title: 'Private school',
        source: 'ARI',
        topicId: 'cly4690mx00aj7ryz2c8v8o1k',
        isMapped: true
    },
    {
        title: 'Parks',
        source: 'ARI',
        topicId: 'cly468zy1006x7ryzj4bmuwgc',
        isMapped: true
    },
    {
        title: 'Population growth',
        source: 'ARI',
        topicId: 'cly468zy6006y7ryzcky612r6',
        isMapped: true
    },
    {
        title: 'Pests',
        source: 'ARI',
        topicId: 'clkv6uocu02c0l2rs67ybx8b3',
        isMapped: true
    },
    {
        title: 'Plant disease',
        source: 'ARI',
        topicId: 'clx33loas00008ngpifhztsn9',
        isMapped: true
    },
    {
        title: 'Public health',
        source: 'ARI',
        topicId: 'clkv6uplb02swl2rs3hxrxyl1',
        isMapped: true
    },
    {
        title: 'Parental leave',
        source: 'ARI',
        topicId: 'cly468zyi00707ryz3s8rwbk6',
        isMapped: true
    },
    {
        title: 'Pension',
        source: 'ARI',
        topicId: 'cly468zyo00717ryzfw3jswic',
        isMapped: true
    },
    {
        title: 'Political campaigns',
        source: 'ARI',
        topicId: 'cly468zyt00727ryzqn1r7695',
        isMapped: true
    },
    {
        title: 'Political candidates',
        source: 'ARI',
        topicId: 'cly468zyz00737ryz3j7ykvsr',
        isMapped: true
    },
    {
        title: 'Primary elections',
        source: 'ARI',
        topicId: 'cly468zz400747ryzv2xmoukw',
        isMapped: true
    },
    {
        title: 'Privacy',
        source: 'ARI',
        topicId: 'cly468zza00757ryz5441m3c1',
        isMapped: true
    },
    {
        title: 'Public employees',
        source: 'ARI',
        topicId: 'cly468zzg00767ryz9xeo8ahy',
        isMapped: true
    },
    {
        title: 'Public officials',
        source: 'ARI',
        topicId: 'cly468zzg00767ryz9xeo8ahy',
        isMapped: true
    },
    {
        title: 'Public finance',
        source: 'ARI',
        topicId: 'clkv6uih0003il2rse0gf3xps',
        isMapped: true
    },
    {
        title: 'Public inquiry',
        source: 'ARI',
        topicId: 'cly468zzl00777ryzd3ljaytn',
        isMapped: true
    },
    {
        title: 'Privatisation',
        source: 'ARI',
        topicId: 'cly468zzr00787ryzj0rg7xzw',
        isMapped: true
    },
    {
        title: 'Pension and welfare policy',
        source: 'ARI',
        topicId: 'cly468ztz006a7ryzihan74l9',
        isMapped: true
    },
    {
        title: 'Personal data collection policy',
        source: 'ARI',
        topicId: 'cly468zzx00797ryzpidize51',
        isMapped: true
    },
    {
        title: 'Political crisis',
        source: 'ARI',
        topicId: 'cly469003007a7ryzllbo9p9s',
        isMapped: true
    },
    {
        title: 'Political dissent',
        source: 'ARI',
        topicId: 'cly469009007b7ryze3qayi3l',
        isMapped: true
    },
    {
        title: 'Political process',
        source: 'ARI',
        topicId: 'cly46900e007c7ryz2tppi1xh',
        isMapped: true
    },
    {
        title: 'Political development',
        source: 'ARI',
        topicId: 'cly46900k007d7ryz29mct3fe',
        isMapped: true
    },
    {
        title: 'Political parties and movements',
        source: 'ARI',
        topicId: 'cly46900q007e7ryz2e3k7f2u',
        isMapped: true
    },
    {
        title: 'Political leadership',
        source: 'ARI',
        topicId: 'cly46900w007f7ryz5lbe374x',
        isMapped: true
    },
    {
        title: 'Political system',
        source: 'ARI',
        topicId: 'cly469011007g7ryzi8dtz3hc',
        isMapped: true
    },
    {
        title: 'Palaeontology',
        source: 'ARI',
        topicId: 'clkv6um3v01gul2rse56qr988',
        isMapped: true
    },
    {
        title: 'Physiology',
        source: 'ARI',
        topicId: 'clkv6uirf007cl2rs5jaofpzr',
        isMapped: true
    },
    {
        title: 'Physics',
        source: 'ARI',
        topicId: 'clkv6uiqb006yl2rswqz1n2u3',
        isMapped: true
    },
    {
        title: 'Philosophy',
        source: 'ARI',
        topicId: 'clkv6upnj02tql2rsq1aglvh5',
        isMapped: true
    },
    {
        title: 'Political science',
        source: 'ARI',
        topicId: 'clkv6uic7001ul2rs4gvln7x8',
        isMapped: true
    },
    {
        title: 'Psychology',
        source: 'ARI',
        topicId: 'clkv6upq602uwl2rsf928hpia',
        isMapped: true
    },
    {
        title: 'Population and census',
        source: 'ARI',
        topicId: 'clkv6ulh20182l2rsveamurb8',
        isMapped: true
    },
    {
        title: 'Parenting',
        source: 'ARI',
        topicId: 'clkv6upp602ugl2rsxqip2f38',
        isMapped: true
    },
    {
        title: 'Poverty',
        source: 'ARI',
        topicId: 'cly469016007h7ryzmwcrlqgy',
        isMapped: true
    },
    {
        title: 'Pornography',
        source: 'ARI',
        topicId: 'cly4690bn00907ryz5irup3w1',
        isMapped: true
    },
    {
        title: 'Public housing',
        source: 'ARI',
        topicId: 'cly46901c007i7ryzo4bwz9av',
        isMapped: true
    },
    {
        title: 'Paralympic games',
        source: 'ARI',
        topicId: 'cly4690n200ak7ryzlqn311g9',
        isMapped: true
    },
    {
        title: 'Radio',
        source: 'ARI',
        topicId: 'cly46901h007j7ryzagt6bbof',
        isMapped: true
    },
    {
        title: 'Rebellion',
        source: 'ARI',
        topicId: 'cly46901m007k7ryz5qbyu5y3',
        isMapped: true
    },
    {
        title: 'Revolution',
        source: 'ARI',
        topicId: 'cly46901s007l7ryzuxi17yge',
        isMapped: true
    },
    {
        title: 'Regulations',
        source: 'ARI',
        topicId: 'cly46901x007m7ryzmp9e30k6',
        isMapped: true
    },
    {
        title: 'Research and development',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Real estate',
        source: 'ARI',
        topicId: 'clkv6ulm9019wl2rsnf7e4t2z',
        isMapped: true
    },
    {
        title: 'Railway manufacturing',
        source: 'ARI',
        topicId: 'clkv6uiwq0092l2rsur74axhr',
        isMapped: true
    },
    {
        title: 'Radio industry',
        source: 'ARI',
        topicId: 'cly469022007n7ryzdpju08rs',
        isMapped: true
    },
    {
        title: 'Retail',
        source: 'ARI',
        topicId: 'cly469028007o7ryzi0cmflj6',
        isMapped: true
    },
    {
        title: 'Renewable energy',
        source: 'ARI',
        topicId: 'clkv6uq530310l2rsd8qnw77d',
        isMapped: true
    },
    {
        title: 'Rivers',
        source: 'ARI',
        topicId: 'cly46902d007p7ryzo2kf877n',
        isMapped: true
    },
    {
        title: 'Royalty',
        source: 'ARI',
        topicId: 'cly46902i007q7ryzgjtct2ew',
        isMapped: true
    },
    {
        title: 'Retirement',
        source: 'ARI',
        topicId: 'cly46902o007r7ryzbqwsgonx',
        isMapped: true
    },
    {
        title: 'Referenda',
        source: 'ARI',
        topicId: 'cly46902t007s7ryzzod9372k',
        isMapped: true
    },
    {
        title: 'Regional elections',
        source: 'ARI',
        topicId: 'cly46902z007t7ryzbl25imf6',
        isMapped: true
    },
    {
        title: 'Regional government and authority',
        source: 'ARI',
        topicId: 'cly469034007u7ryz1ve92hkj',
        isMapped: true
    },
    {
        title: 'Regulatory authority',
        source: 'ARI',
        topicId: 'cly469039007v7ryzmjjh8zwn',
        isMapped: true
    },
    {
        title: 'Regional development policy',
        source: 'ARI',
        topicId: 'cly46903f007w7ryzt9bsgjx3',
        isMapped: true
    },
    {
        title: 'Regulation of industry',
        source: 'ARI',
        topicId: 'cly46903l007x7ryzgan8igh3',
        isMapped: true
    },
    {
        title: 'Refugees and internally displaced people',
        source: 'ARI',
        topicId: 'cly46903q007y7ryz6h0bqv73',
        isMapped: true
    },
    {
        title: 'Relations between religion and government',
        source: 'ARI',
        topicId: 'cly46903v007z7ryz3it8nah0',
        isMapped: true
    },
    {
        title: 'Religious conflict',
        source: 'ARI',
        topicId: 'cly46904100807ryzqd2at8nw',
        isMapped: true
    },
    {
        title: 'Religious festival and holiday',
        source: 'ARI',
        topicId: 'cly46904700817ryzhdwkwbqn',
        isMapped: true
    },
    {
        title: 'Religious leader',
        source: 'ARI',
        topicId: 'cly46904d00827ryzsx1bo97c',
        isMapped: true
    },
    {
        title: 'Rocketry',
        source: 'ARI',
        topicId: 'clkv6umqy01pel2rsmnk1wgtd',
        isMapped: true
    },
    {
        title: 'Racism',
        source: 'ARI',
        topicId: 'cly46904i00837ryz4b74do0p',
        isMapped: true
    },
    {
        title: 'Religious discrimination',
        source: 'ARI',
        topicId: 'cly46904n00847ryzfzwklppf',
        isMapped: true
    },
    {
        title: 'Social media',
        source: 'ARI',
        topicId: 'cly468zq1005l7ryzhsx7onas',
        isMapped: true
    },
    {
        title: 'Sex crime',
        source: 'ARI',
        topicId: 'cly46904s00857ryzvkjic9m5',
        isMapped: true
    },
    {
        title: 'Supreme and high court',
        source: 'ARI',
        topicId: 'cly4690n700al7ryzl8g2w5ro',
        isMapped: true
    },
    {
        title: 'Sentencing (criminal)',
        source: 'ARI',
        topicId: 'cly46904x00867ryzbuvrb16z',
        isMapped: true
    },
    {
        title: 'Surveillance',
        source: 'ARI',
        topicId: 'cly46905300877ryz37f35gz6',
        isMapped: true
    },
    {
        title: 'Structural failure',
        source: 'ARI',
        topicId: 'cly46905900887ryzqliemlep',
        isMapped: true
    },
    {
        title: 'Stock activity',
        source: 'ARI',
        topicId: 'cly46905k008a7ryzu3k34byn',
        isMapped: true
    },
    {
        title: 'Stock option',
        source: 'ARI',
        topicId: 'cly46905q008b7ryz0y0xl16f',
        isMapped: true
    },
    {
        title: 'Strategy and marketing',
        source: 'ARI',
        topicId: 'cly46905x008c7ryzo48dyw2v',
        isMapped: true
    },
    {
        title: 'Satellite technology',
        source: 'ARI',
        topicId: 'clkv6ulst01cql2rsbx655k8c',
        isMapped: true
    },
    {
        title: 'Semiconductors and active components',
        source: 'ARI',
        topicId: 'clkv6unyb025ul2rs11rkvy4v',
        isMapped: true
    },
    {
        title: 'Software',
        source: 'ARI',
        topicId: 'cly469062008d7ryzif5hzuds',
        isMapped: true
    },
    {
        title: 'Sales channels',
        source: 'ARI',
        topicId: 'cly469068008e7ryz1j5eqhih',
        isMapped: true
    },
    {
        title: 'Solar power',
        source: 'ARI',
        topicId: 'clkv6uq5p0318l2rsejpcxvvc',
        isMapped: true
    },
    {
        title: 'Shipping service',
        source: 'ARI',
        topicId: 'cly46906d008f7ryzu4uzbfnf',
        isMapped: true
    },
    {
        title: 'Shipbuilding',
        source: 'ARI',
        topicId: 'cly46906i008g7ryz2dhbi3zf',
        isMapped: true
    },
    {
        title: 'Shopping district and high street',
        source: 'ARI',
        topicId: 'cly46906n008h7ryzjqpasf9x',
        isMapped: true
    },
    {
        title: 'Shopping mall',
        source: 'ARI',
        topicId: 'cly46906n008h7ryzjqpasf9x',
        isMapped: true
    },
    {
        title: 'Small and medium enterprise',
        source: 'ARI',
        topicId: 'cly46906s008i7ryz17mwojzz',
        isMapped: true
    },
    {
        title: 'Securities',
        source: 'ARI',
        topicId: 'cly46906x008j7ryz86wt5o6b',
        isMapped: true
    },
    {
        title: 'Stocks',
        source: 'ARI',
        topicId: 'cly46905f00897ryzhv6ghehc',
        isMapped: true
    },
    {
        title: 'Stock recommendation',
        source: 'ARI',
        topicId: 'cly469072008k7ryzm0ca4vxx',
        isMapped: true
    },
    {
        title: 'School',
        source: 'ARI',
        topicId: 'cly46907g008l7ryzg3onr7u1',
        isMapped: true
    },
    {
        title: 'State school',
        source: 'ARI',
        topicId: 'cly46907n008m7ryzxiqkn7rr',
        isMapped: true
    },
    {
        title: 'Students',
        source: 'ARI',
        topicId: 'cly46907t008n7ryzsdedmo1e',
        isMapped: true
    },
    {
        title: 'Social security',
        source: 'ARI',
        topicId: 'cly468z6u002e7ryzlb1oxcau',
        isMapped: true
    },
    {
        title: 'Security measures (defence)',
        source: 'ARI',
        topicId: 'cly46907z008o7ryzot5yqt7g',
        isMapped: true
    },
    {
        title: 'State-owned enterprise',
        source: 'ARI',
        topicId: 'cly46908d008p7ryz4lsn9slt',
        isMapped: true
    },
    {
        title: 'Safety of citizens',
        source: 'ARI',
        topicId: 'cly46908i008q7ryzfvth7486',
        isMapped: true
    },
    {
        title: 'Sports policies',
        source: 'ARI',
        topicId: 'cly46908u008r7ryzlqzha3jd',
        isMapped: true
    },
    {
        title: 'Summit meetings',
        source: 'ARI',
        topicId: 'cly469095008s7ryza8mmg5ps',
        isMapped: true
    },
    {
        title: 'Scientific institution',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Scientific research',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Scientific exploration',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Space exploration',
        source: 'ARI',
        topicId: 'clkv6umr301pgl2rsqtd2pgqf',
        isMapped: true
    },
    {
        title: 'Scientific innovation',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Scientific publication',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Scientific standards',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Social sciences',
        source: 'ARI',
        topicId: 'clkv6uifo0032l2rss499377e',
        isMapped: true
    },
    {
        title: 'Sociology',
        source: 'ARI',
        topicId: 'clkv6uih6003kl2rspbobfpy8',
        isMapped: true
    },
    {
        title: 'Social networking',
        source: 'ARI',
        topicId: 'cly468zq1005l7ryzhsx7onas',
        isMapped: true
    },
    {
        title: 'Sexism',
        source: 'ARI',
        topicId: 'cly46909g008t7ryzpbsfpfo1',
        isMapped: true
    },
    {
        title: 'Senior citizens',
        source: 'ARI',
        topicId: 'cly4690a4008u7ryz60pokijq',
        isMapped: true
    },
    {
        title: 'Social condition',
        source: 'ARI',
        topicId: 'cly4690ac008v7ryzwqff8x5c',
        isMapped: true
    },
    {
        title: 'Social problem',
        source: 'ARI',
        topicId: 'cly4690ac008v7ryzwqff8x5c',
        isMapped: true
    },
    {
        title: 'Sexual misconduct',
        source: 'ARI',
        topicId: 'cly4690ao008w7ryz9s0kk8oy',
        isMapped: true
    },
    {
        title: 'Slavery',
        source: 'ARI',
        topicId: 'cly4690ax008x7ryzk9wwfj7a',
        isMapped: true
    },
    {
        title: 'Suicide',
        source: 'ARI',
        topicId: 'cly4690b3008y7ryzciu062os',
        isMapped: true
    },
    {
        title: 'Sexual behaviour',
        source: 'ARI',
        topicId: 'cly4690bi008z7ryzhf1fx8zi',
        isMapped: true
    },
    {
        title: 'Social services',
        source: 'ARI',
        topicId: 'cly4690bt00917ryz65dt6osf',
        isMapped: true
    },
    {
        title: 'Sport event',
        source: 'ARI',
        topicId: 'cly4690c100927ryzw7c4npqa',
        isMapped: true
    },
    {
        title: 'Sport industry',
        source: 'ARI',
        topicId: 'cly4690c800937ryzkn1vxvm3',
        isMapped: true
    },
    {
        title: 'Sport organisation',
        source: 'ARI',
        topicId: 'cly4690ch00947ryzt6xddipi',
        isMapped: true
    },
    {
        title: 'Sports management and ownership',
        source: 'ARI',
        topicId: 'cly4690co00957ryztkfcbjgc',
        isMapped: true
    },
    {
        title: 'Theatre',
        source: 'ARI',
        topicId: 'clwueaou900023s9o6drho4dy',
        isMapped: true
    },
    {
        title: 'Television',
        source: 'ARI',
        topicId: 'cly4690da00967ryzyo70nyoh',
        isMapped: true
    },
    {
        title: 'Tax evasion',
        source: 'ARI',
        topicId: 'cly4690dg00977ryzzokcasye',
        isMapped: true
    },
    {
        title: 'Terrorism',
        source: 'ARI',
        topicId: 'cly468yph00047ryzwqn34dkp',
        isMapped: true
    },
    {
        title: 'Trial (court)',
        source: 'ARI',
        topicId: 'cly4690nc00am7ryzpyp4nz8d',
        isMapped: true
    },
    {
        title: 'Transportation accident and incident',
        source: 'ARI',
        topicId: 'cly4690dl00987ryz3v66v2br',
        isMapped: true
    },
    {
        title: 'Telecommunication equipment',
        source: 'ARI',
        topicId: 'clkv6umpx01p0l2rste23gojz',
        isMapped: true
    },
    {
        title: 'Telecommunication service',
        source: 'ARI',
        topicId: 'clkv6ulsh01ckl2rstds29msx',
        isMapped: true
    },
    {
        title: 'Television industry',
        source: 'ARI',
        topicId: 'cly4690dr00997ryzxt9ef6d0',
        isMapped: true
    },
    {
        title: 'Textile and clothing',
        source: 'ARI',
        topicId: 'cly4690dw009a7ryzdzgz0du1',
        isMapped: true
    },
    {
        title: 'Tourism and leisure industry',
        source: 'ARI',
        topicId: 'cly4690ni00an7ryz4d4to50j',
        isMapped: true
    },
    {
        title: 'Transport',
        source: 'ARI',
        topicId: 'clkv6uigf003cl2rsanvnjdgl',
        isMapped: true
    },
    {
        title: 'Traffic',
        source: 'ARI',
        topicId: 'clkv6ulqz01byl2rshb3vhnjp',
        isMapped: true
    },
    {
        title: 'Trade agreements',
        source: 'ARI',
        topicId: 'cly4690e2009b7ryz85lte3ly',
        isMapped: true
    },
    {
        title: 'Trade balance',
        source: 'ARI',
        topicId: 'clkv6ultf01d0l2rsqjto6ehe',
        isMapped: true
    },
    {
        title: 'Trade dispute',
        source: 'ARI',
        topicId: 'cly4690j3009z7ryzccgt0daa',
        isMapped: true
    },
    {
        title: 'Trade policy',
        source: 'ARI',
        topicId: 'cly46903f007w7ryzt9bsgjx3',
        isMapped: true
    },
    {
        title: 'Tariff',
        source: 'ARI',
        topicId: 'cly4690e7009c7ryzpl7w9su3',
        isMapped: true
    },
    {
        title: 'Teachers',
        source: 'ARI',
        topicId: 'cly4690ec009d7ryzj0ifu5mq',
        isMapped: true
    },
    {
        title: 'Travel and tourism',
        source: 'ARI',
        topicId: 'cly4690em009e7ryzpux3nor9',
        isMapped: true
    },
    {
        title: 'Trend',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'Taxation',
        source: 'ARI',
        topicId: 'clkv6ulvm01dul2rs0q6u2yor',
        isMapped: true
    },
    {
        title: 'Treaty',
        source: 'ARI',
        topicId: 'cly4690et009f7ryzmqqwnvxb',
        isMapped: true
    },
    {
        title: 'Technology and engineering',
        source: 'ARI',
        topicId: 'clkv6uivq008sl2rsh8muvs18',
        isMapped: true
    },
    {
        title: 'Teenagers',
        source: 'ARI',
        topicId: 'cly4690f1009g7ryz6aioq2hz',
        isMapped: true
    },
    {
        title: 'Utilities',
        source: 'ARI',
        topicId: 'cly4690f8009h7ryzvwwyc6rj',
        isMapped: true
    },
    {
        title: 'Unemployment',
        source: 'ARI',
        topicId: 'cly4690fy009i7ryzvfgidusd',
        isMapped: true
    },
    {
        title: 'Unions',
        source: 'ARI',
        topicId: 'clkv6ulpc01b8l2rs7u6ws9jo',
        isMapped: true
    },
    {
        title: 'Visual arts',
        source: 'ARI',
        topicId: 'clkv6uilm005cl2rsx9weklg5',
        isMapped: true
    },
    {
        title: 'Vandalism',
        source: 'ARI',
        topicId: 'cly4690g6009j7ryz9qn4t2cq',
        isMapped: true
    },
    {
        title: 'Viniculture',
        source: 'ARI',
        topicId: 'cly4690gd009k7ryzjiy6zdsd',
        isMapped: true
    },
    {
        title: 'Viral disease',
        source: 'ARI',
        topicId: 'clkv6uoae02awl2rskgc8ammh',
        isMapped: true
    },
    {
        title: 'Volunteering',
        source: 'ARI',
        topicId: 'cly4690gk009l7ryz50brnmfu',
        isMapped: true
    },
    {
        title: 'Voting',
        source: 'ARI',
        topicId: 'cly4690gw009m7ryz58n9pj1j',
        isMapped: true
    },
    {
        title: 'War',
        source: 'ARI',
        topicId: 'cly468yoi00017ryzu49uigcw',
        isMapped: true
    },
    {
        title: 'Wildfire',
        source: 'ARI',
        topicId: 'cly4690h8009n7ryzmrn7xhkl',
        isMapped: true
    },
    {
        title: 'Windstorms',
        source: 'ARI',
        topicId: 'cly4690he009o7ryzxnujud52',
        isMapped: true
    },
    {
        title: 'Wireless technology',
        source: 'ARI',
        topicId: 'cly4690hk009p7ryzbs8irtej',
        isMapped: true
    },
    {
        title: 'Wind power',
        source: 'ARI',
        topicId: 'cly4690hq009q7ryzwsfsak16',
        isMapped: true
    },
    {
        title: 'Water supply',
        source: 'ARI',
        topicId: 'cly4690hw009r7ryzduazw3r8',
        isMapped: true
    },
    {
        title: 'Waste materials',
        source: 'ARI',
        topicId: 'cly4690i1009s7ryzimpc0vct',
        isMapped: true
    },
    {
        title: 'Water pollution',
        source: 'ARI',
        topicId: 'cly4690i7009t7ryzq9wujgxb',
        isMapped: true
    },
    {
        title: 'Water',
        source: 'ARI',
        topicId: 'cly4690ic009u7ryz09kw0joe',
        isMapped: true
    },
    {
        title: 'Wetlands',
        source: 'ARI',
        topicId: 'clkv6uq4y030yl2rsdbtjai3p',
        isMapped: true
    },
    {
        title: 'Wages and benefits',
        source: 'ARI',
        topicId: 'clkv6ulou01b0l2rsd0bt8pvr',
        isMapped: true
    },
    {
        title: 'Wellness',
        source: 'ARI',
        topicId: 'cly4690ii009v7ryz0gnpgdxu',
        isMapped: true
    },
    {
        title: 'Women',
        source: 'ARI',
        topicId: 'clkv6um2i01gcl2rsat8prvm2',
        isMapped: true
    },
    {
        title: 'Welfare',
        source: 'ARI',
        topicId: 'cly4690in009w7ryzs1uvedvd',
        isMapped: true
    },
    {
        title: 'Zoology',
        source: 'ARI',
        topicId: 'clkv6uir40078l2rsp2xvet66',
        isMapped: true
    },
    {
        title: 'arts, culture, entertainment and media',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'conflict, war and peace',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'crime, law and justice',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'disaster, accident and emergency incident',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'economy, business and finance',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'education',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'environment',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'health',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'labour',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'lifestyle and leisure',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'politics',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'religion',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'science and technology',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'society',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'sport',
        source: 'ARI',
        isMapped: false
    },
    {
        title: 'weather',
        source: 'ARI',
        isMapped: false
    }
];

export default topicMappings;
