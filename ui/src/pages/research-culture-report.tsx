import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';

const ResearchCultureReport: Types.NextPage = (): React.ReactElement => {
    return (
        <>
            <Head>
                <title>{Config.urls.researchCultureReport.title}</title>
                <meta name="description" content={Config.urls.researchCultureReport.description} />
                <meta name="og:title" content={Config.urls.researchCultureReport.title} />
                <meta name="og:description" content={Config.urls.researchCultureReport.description} />
                <meta name="keywords" content={Config.urls.researchCultureReport.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.researchCultureReport.canonical} />
            </Head>

            <Layouts.Standard>
                <section className="container mx-auto px-8 pb-10 pt-10 text-grey-800 transition-colors duration-500 dark:text-white-100 lg:gap-4 lg:pt-20">
                    <Components.PageTitle
                        className="mb-8"
                        text={`New report questions impact of
publishing on research culture`}
                    />
                    <h2 className="flex space-x-1 pb-16 font-montserrat text-xl font-normal">
                        Open research publishing platforms could be an important mechanism for reform
                    </h2>
                    <div className="text-sm text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        <p>
                            To explore the need for a platform like Octopus and create a benchmark for its
                            effectiveness, a report was conducted by researchers from the University of Bristol, which
                            found academic researchers demoralised by a culture that disincentivises sharing and
                            collaboration, encourages questionable research practices (QRPs), and increases the risk of
                            bias.
                        </p>
                        <br />
                        <p>
                            The researchers carried out a literature study, one-to-one interviews, and a survey of over
                            400 research professionals to understand how they felt about their work, careers, and the
                            state of open research.
                        </p>
                        <br />
                        <p>Their findings are published in a report which can be accessed here:</p>
                        <br />
                        <br />
                        <p className="text-center">
                            <Components.Link
                                className="rounded-lg border-transparent bg-grey-700 p-4 font-medium text-white-50 decoration-teal-500 underline-offset-2 outline-0 transition-colors duration-500 hover:bg-grey-600 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:bg-teal-600 dark:hover:bg-teal-600 sm:w-fit sm:px-4"
                                title="Report"
                                href="https://doi.org/10.5281/zenodo.8165704"
                                openNew
                            >
                                Read the report
                            </Components.Link>
                        </p>
                    </div>
                    <br />
                    <br />
                    <h3 className="font-montserrat text-xl font-semibold">Summary:</h3>
                    <br />
                    <div className="text-sm text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        <p>
                            The work, “A snapshot of the academic research culture in 2023 and how it might be
                            improved”, was conducted to create a benchmark to measure the effectiveness of the Research
                            England funded, and Jisc supported online publishing platform Octopus.ac.
                        </p>
                        <br />
                        <p>
                            Interviewees claimed that the current culture was unfair and is enabled by a focus on
                            traditional peer-reviewed papers. One described writing research under the pressure to find
                            ‘impactful’ results as feeling like ‘I’m a novel writer instead of a researcher’.
                        </p>
                        <br />
                        <p>
                            The report found that a third of researchers had not published research because it did not
                            have a clean enough ‘story’ to make it attractive to publishers, and one in five had not
                            published research they had undertaken because they felt it would not help their career.
                        </p>
                        <br />
                        <p>
                            Nearly half (46%) of respondents said they would not publish ideas or methods for fear of
                            being ‘scooped’, because only ‘findings’ mattered. About a third said they saw no benefit to
                            their careers in sharing work quickly and openly.
                        </p>
                        <br />
                        <p>
                            Sixty percent of respondents said they believed that their publication record (for example,
                            a researcher’s number of publications and citations) had a strong influence on research
                            assessment, and 41% of respondents thought that open research practices had “no influence”
                            on assessment.
                        </p>
                        <br />
                        <p>
                            The researchers also found multiple causes for bias in research assessment and fear of
                            discrimination based on the personal characteristics of the researcher, such as gender.
                        </p>
                        <br />
                        <p>
                            Researchers reported feeling under pressure to achieve an “interesting” or statistically
                            significant result that is more likely to appeal to a journal. The authors found this could
                            encourage questionable research practices such as data manipulation. The report also showed
                            that younger or less-experienced researchers don’t receive proportional credit for their
                            work.
                        </p>
                        <br />
                        <p>To combat these challenges, the report recommends:</p>
                        <br />
                        <ul className="list-inside list-disc indent-6 leading-relaxed">
                            <li>Outreach and education about open research publishing platforms</li>
                            <li>
                                Changing funder and institutional policies to ensure they reward and do not hinder
                                research sharing
                            </li>
                            <li>
                                Changing peer review and research assessment to focus on smaller units of work, rather
                                than a narrative “paper” to minimise publication bias and the pressures that lead to
                                QRPs.
                            </li>
                        </ul>
                        <br />
                        <p>
                            Report co-author, Dr Pen-Yuan Hsing, said: “We found that the current research culture
                            encourages researchers to hide their work at least until a traditional journal paper is
                            published. In some situations, these pressures lead to questionable research practices.
                        </p>
                        <br />
                        <p>
                            “In general, open research practices are viewed as not beneficial, or even detrimental, to
                            job security and career advancement. This is especially true given competing demands and the
                            need for academics to prioritise their time on outputs that count in assessments that they
                            are subject to.”
                        </p>
                        <br />
                        <p>
                            Jisc&apos;s director of product for research management, Liz Bal, said: “We’re committed to
                            supporting our members explore future research dissemination models, with Octopus being one
                            such model. As a technology partner to Octopus, we welcome this report in guiding its
                            development and hope that it stimulates further discussion among institutions on the
                            relationships between research culture and research dissemination.”
                        </p>
                        <br />
                        <p>
                            Octopus platform founder Dr Alexandra Freeman said: “It’s heartbreaking to read how
                            researchers currently feel. The current system incentivises the wrong things.
                        </p>
                        <br />
                        <p>
                            “This means that those wanting to do the best quality research have to actively swim against
                            the tide. Octopus is designed to realign research incentives to reward people for the
                            intrinsic quality of what they do, removing the concept of ‘scooping’, encouraging
                            specialisation, and removing the feeling of having to ‘be good at everything’.”
                        </p>
                    </div>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default ResearchCultureReport;
