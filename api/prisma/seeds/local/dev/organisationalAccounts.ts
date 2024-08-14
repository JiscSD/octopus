import { Prisma } from '@prisma/client';

const userSeeds: Prisma.UserCreateManyInput[] = [
    {
        role: 'ORGANISATION',
        firstName: 'UK Policing: Office of Police Chief Scientific Adviser (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468yf300007ryzm3e5px2a' // Crime
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for Science, Innovation & Technology (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uivq008sl2rsh8muvs18', // Technology (General)
        url: 'https://www.gov.uk/government/organisations/department-for-science-innovation-and-technology'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Nuclear Decommissioning Authority (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468ztz006a7ryzihan74l9', // Nuclear policy
        url: 'https://www.gov.uk/government/organisations/nuclear-decommissioning-authority'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Office for Statistics Regulation (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zfd003y7ryzoeleyai4', // Government policy
        url: 'https://osr.statisticsauthority.gov.uk/'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Metropolitan Police (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468yf300007ryzm3e5px2a', // Crime
        url: 'https://www.met.police.uk/'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Ministry of Justice (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zli00507ryzh96v7r8o', // Justice
        ror: 'https://ror.org/01xdnwc75',
        url: 'https://www.gov.uk/government/organisations/ministry-of-justice'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Ministry of Defence (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uidy002el2rsrw12sj6v', // Military science
        ror: 'https://ror.org/01bvxzn29',
        url: 'https://www.gov.uk/government/organisations/ministry-of-defence'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Health and Safety Executive (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly46908i008q7ryzfvth7486', // Safety of Citizens
        url: 'https://www.hse.gov.uk/'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Home Office (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zka004s7ryzogn1sx12', // Interior policy
        ror: 'https://ror.org/00y81cg83',
        url: 'https://www.gov.uk/government/organisations/home-office'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Food Standards Agency (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zcn003g7ryz4eavc8jw', // Food industry
        url: 'https://www.food.gov.uk/'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Foreign, Commonwealth & Development Office (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zfd003y7ryzoeleyai4', // Government policy
        url: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for Work and Pensions (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468za8002z7ryz8g8pl8bx', // Employment
        ror: 'https://ror.org/0499kfe57',
        url: 'https://www.gov.uk/government/organisations/department-for-work-pensions'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for Levelling Up, Housing and Communities (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zhx004d7ryzsezmjjyt', // Housing and urban planning policy
        ror: 'https://ror.org/01w88hp45',
        url: 'https://www.gov.uk/government/organisations/department-for-levelling-up-housing-and-communities'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for International Trade (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uigk003el2rswm10fyv8', // Commerce
        ror: 'https://ror.org/01bgmsb44',
        url: 'https://www.great.gov.uk/'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for Health and Social Care (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468z6u002e7ryzlb1oxcau', // Social and public welfare
        url: 'https://www.gov.uk/government/organisations/department-of-health-and-social-care'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for Transport (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uigf003cl2rsanvnjdgl', // Transportation and communications
        ror: 'https://ror.org/010mf0m52',
        url: 'https://www.gov.uk/government/organisations/department-for-transport'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for Education (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly4690lq00ab7ryzpg64y15x', // Education policy
        ror: 'https://ror.org/0320bge18',
        url: 'https://www.gov.uk/government/organisations/department-for-education'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for Environment, Food & Rural Affairs (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'clkv6uium008gl2rs3d7ene92', // Agriculture (General)
        ror: 'https://ror.org/00tnppw48',
        url: 'https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for Digital, Culture, Media & Sport (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly4690kb00a57ryzg1f59ik9', // Cultural policies
        ror: 'https://ror.org/02zqy3981',
        url: 'https://www.gov.uk/government/organisations/department-for-digital-culture-media-sport'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Cabinet Office (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly468zfd003y7ryzoeleyai4', // Government policy
        url: 'https://www.gov.uk/government/organisations/cabinet-office'
    },
    {
        role: 'ORGANISATION',
        firstName: 'Department for Business, Energy & Industrial Strategy (GB)',
        email: 'ari.comment@go-science.gov.uk',
        defaultTopicId: 'cly46903l007x7ryzgan8igh3', // Regulation of industry
        ror: 'https://ror.org/019ya6433',
        url: 'https://www.gov.uk/government/organisations/department-for-business-energy-and-industrial-strategy'
    }
];
export default userSeeds;
