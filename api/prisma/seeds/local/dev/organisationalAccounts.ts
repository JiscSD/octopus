import { Prisma } from '@prisma/client';

const userSeeds: Prisma.UserCreateManyInput[] = [
    {
        id: 'clyheq7ko0001eg48k2id2jao',
        role: 'ORGANISATION',
        firstName: 'Office of Police Chief Scientific Adviser (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468yf300007ryzm3e5px2a' // Crime
    },
    {
        id: 'clyheq7kp0003eg48dlp686sc',
        role: 'ORGANISATION',
        firstName: 'Department for Science, Innovation & Technology (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uivq008sl2rsh8muvs18', // Technology (General)
        url: 'https://www.gov.uk/government/organisations/department-for-science-innovation-and-technology'
    },
    {
        id: 'clyheq7kp0005eg48dlythcrr',
        role: 'ORGANISATION',
        firstName: 'Nuclear Decommissioning Authority (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468ztz006a7ryzihan74l9', // Nuclear policy
        url: 'https://www.gov.uk/government/organisations/nuclear-decommissioning-authority'
    },
    {
        id: 'clyheq7kp0007eg48jc3ot4id',
        role: 'ORGANISATION',
        firstName: 'Office for Statistics Regulation (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zfd003y7ryzoeleyai4', // Government policy
        url: 'https://osr.statisticsauthority.gov.uk/'
    },
    {
        id: 'clyheq7kp0009eg48m1tg5fxx',
        role: 'ORGANISATION',
        firstName: 'Metropolitan Police (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468yf300007ryzm3e5px2a', // Crime
        url: 'https://www.met.police.uk/'
    },
    {
        id: 'clyheq7kq000beg48wlra7tm4',
        role: 'ORGANISATION',
        firstName: 'Ministry of Justice (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zli00507ryzh96v7r8o', // Justice
        ror: 'https://ror.org/01xdnwc75',
        url: 'https://www.gov.uk/government/organisations/ministry-of-justice'
    },
    {
        id: 'clyheq7kq000deg48a1gvgiuv',
        role: 'ORGANISATION',
        firstName: 'Ministry of Defence (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uidy002el2rsrw12sj6v', // Military science
        ror: 'https://ror.org/01bvxzn29',
        url: 'https://www.gov.uk/government/organisations/ministry-of-defence'
    },
    {
        id: 'clyheq7kq000feg48xcu4ue2h',
        role: 'ORGANISATION',
        firstName: 'Health and Safety Executive (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly46908i008q7ryzfvth7486', // Safety of Citizens
        url: 'https://www.hse.gov.uk/'
    },
    {
        id: 'clyheq7kq000heg48srz2qf7s',
        role: 'ORGANISATION',
        firstName: 'Home Office (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zka004s7ryzogn1sx12', // Interior policy
        ror: 'https://ror.org/00y81cg83',
        url: 'https://www.gov.uk/government/organisations/home-office'
    },
    {
        id: 'clyheq7kr000jeg48uq3wh46r',
        role: 'ORGANISATION',
        firstName: 'Food Standards Agency (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zcn003g7ryz4eavc8jw', // Food industry
        url: 'https://www.food.gov.uk/'
    },
    {
        id: 'clyheq7kr000leg48rrycwbjb',
        role: 'ORGANISATION',
        firstName: 'Foreign, Commonwealth & Development Office (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zfd003y7ryzoeleyai4', // Government policy
        url: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office'
    },
    {
        id: 'clyheq7kr000neg48k9n53zik',
        role: 'ORGANISATION',
        firstName: 'Department for Work and Pensions (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468za8002z7ryz8g8pl8bx', // Employment
        ror: 'https://ror.org/0499kfe57',
        url: 'https://www.gov.uk/government/organisations/department-for-work-pensions'
    },
    {
        id: 'clyheq7kr000peg482et9g4zb',
        role: 'ORGANISATION',
        firstName: 'Ministry of Housing, Communities and Local Government (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zhx004d7ryzsezmjjyt', // Housing and urban planning policy
        ror: 'https://ror.org/01w88hp45',
        url: 'https://www.gov.uk/government/organisations/department-for-levelling-up-housing-and-communities'
    },
    {
        id: 'clyheq7kr000reg484lhdl5e0',
        role: 'ORGANISATION',
        firstName: 'Department for International Trade (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uigk003el2rswm10fyv8', // Commerce
        ror: 'https://ror.org/01bgmsb44',
        url: 'https://www.great.gov.uk/'
    },
    {
        id: 'clyheq7ks000teg48wgwhlqmh',
        role: 'ORGANISATION',
        firstName: 'Department of Health and Social Care (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468z6u002e7ryzlb1oxcau', // Social and public welfare
        url: 'https://www.gov.uk/government/organisations/department-of-health-and-social-care'
    },
    {
        id: 'clyheq7ks000veg48nu1n7mfa',
        role: 'ORGANISATION',
        firstName: 'Department for Transport (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uigf003cl2rsanvnjdgl', // Transportation and communications
        ror: 'https://ror.org/010mf0m52',
        url: 'https://www.gov.uk/government/organisations/department-for-transport'
    },
    {
        id: 'clyheq7ks000xeg48iuio6m3m',
        role: 'ORGANISATION',
        firstName: 'Department for Education (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly4690lq00ab7ryzpg64y15x', // Education policy
        ror: 'https://ror.org/0320bge18',
        url: 'https://www.gov.uk/government/organisations/department-for-education'
    },
    {
        id: 'clyheq7ks000zeg48qrotkx5x',
        role: 'ORGANISATION',
        firstName: 'Department for Environment, Food & Rural Affairs (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uium008gl2rs3d7ene92', // Agriculture (General)
        ror: 'https://ror.org/00tnppw48',
        url: 'https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs'
    },
    {
        id: 'clyheq7kt0011eg489wbiaxgv',
        role: 'ORGANISATION',
        firstName: 'Department for Digital, Culture, Media & Sport (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly4690kb00a57ryzg1f59ik9', // Cultural policies
        ror: 'https://ror.org/02zqy3981',
        url: 'https://www.gov.uk/government/organisations/department-for-digital-culture-media-sport'
    },
    {
        id: 'clyheq7kt0013eg48l8ukuwzn',
        role: 'ORGANISATION',
        firstName: 'Cabinet Office (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zfd003y7ryzoeleyai4', // Government policy
        url: 'https://www.gov.uk/government/organisations/cabinet-office'
    },
    {
        id: 'clyheq7kt0015eg48i58jtf3a',
        role: 'ORGANISATION',
        firstName: 'Department for Business, Energy & Industrial Strategy (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly46903l007x7ryzgan8igh3', // Regulation of industry
        ror: 'https://ror.org/019ya6433',
        url: 'https://www.gov.uk/government/organisations/department-for-business-energy-and-industrial-strategy'
    },
    {
        id: 'cm3fzp3x80001i9po2idoiksv',
        role: 'ORGANISATION',
        firstName: 'HM Treasury (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6ulvw01dyl2rsjhplwtqo' // Expenditures. Government spending
    },
    {
        id: 'cm3fzp3x80003i9po45lfun1h',
        role: 'ORGANISATION',
        firstName: 'HMRC (UK)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6ulvm01dul2rs0q6u2yor' // Revenue. Taxation. Internal revenue
    }
];
export default userSeeds;
