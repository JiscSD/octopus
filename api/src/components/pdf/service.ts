import * as cheerio from 'cheerio';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import { Browser, launch } from 'puppeteer-core';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as referenceService from 'reference/service';
import * as s3 from 'lib/s3';

import { licences } from 'lib/enum';

const formatPDFDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const nthNumber = day > 0 ? ['th', 'st', 'nd', 'rd'][(day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10] : '';

    return `${day}<sup>${nthNumber}</sup> ${month} ${year}`;
};

const doiLinkBase = `https://${process.env.STAGE === 'prod' ? 'doi.org' : 'handle.test.datacite.org'}/`;

const createPublicationHTMLTemplate = (
    publicationVersion: I.PublicationVersion,
    references: I.Reference[],
    linkedTo: I.LinkedToPublication[]
): string => {
    const {
        title,
        content,
        coAuthors,
        funders,
        conflictOfInterestText,
        language,
        licence,
        ethicalStatement,
        ethicalStatementFreeText,
        dataPermissionsStatement,
        dataPermissionsStatementProvidedBy,
        dataAccessStatement,
        selfDeclaration,
        additionalInformation
    } = publicationVersion;

    // cheerio uses htmlparser2
    // parsing the publication content can sometimes help with unpaired opening/closing tags
    const mainText = content ? cheerio.load(content).html() : '';

    // For setting lang attribute on HTML
    const languageIfNotEnglish = language !== 'en' ? language : undefined;

    const authors = coAuthors.filter((author) => Boolean(author.confirmedCoAuthor && author.linkedUser));

    // Get array of all affiliations from all authors
    const allAffiliations = authors
        .map((author) => author.affiliations)
        .flat() as unknown as I.MappedOrcidAffiliation[];
    const allAffiliationsWithNames = allAffiliations.map((affiliation) => ({
        ...affiliation,
        name: Helpers.formatAffiliationName(affiliation)
    })) as I.AffiliationWithFormattedName[];

    // De-duplicate affiliations based on their name
    const seen = new Set();
    const uniqueAffiliations = allAffiliationsWithNames.filter((affiliation) => {
        const duplicate = seen.has(affiliation.name);
        seen.add(affiliation.name);

        return !duplicate;
    });
    // Sort affiliations by name
    const affiliations = uniqueAffiliations.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    // Store the numbers (their index in the ordered "affiliations" array) of an author's affiliations
    // with the author. Then, we can write them alongside the author's name in superscript.
    const authorsWithAffiliationNumbers = authors.map((author) => {
        const authorAffiliations = author.affiliations as unknown as I.MappedOrcidAffiliation[];
        const affiliationNumbers = authorAffiliations
            .map(
                (affiliation) =>
                    affiliations.findIndex((orderedAffiliation) => orderedAffiliation.id === affiliation.id) + 1
            )
            .sort()
            // Remove any zeros. These would arise when the number of the affiliation can't be found.
            .filter((number) => number !== 0)
            .join(', ');

        return {
            ...author,
            affiliationNumbers
        };
    });

    const base64InterRegular = fs.readFileSync('assets/fonts/Inter-Regular.ttf', { encoding: 'base64' });
    const base64InterSemiBold = fs.readFileSync('assets/fonts/Inter-SemiBold.ttf', { encoding: 'base64' });
    const base64InterBold = fs.readFileSync('assets/fonts/Inter-Bold.ttf', { encoding: 'base64' });
    const base64MontserratMedium = fs.readFileSync('assets/fonts/Montserrat-Medium.ttf', { encoding: 'base64' });
    const katexCSS = fs.readFileSync('assets/katex/katex.min.css', { encoding: 'utf-8' });

    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    @font-face {
                        font-family: 'Montserrat';
                        src: url(data:font/ttf;base64,${base64MontserratMedium});
                        font-weight: 500;
                        font-style: normal;
                    }
                    
                    @font-face {
                        font-family: 'Inter';
                        src: url(data:font/ttf;base64,${base64InterRegular});
                        font-weight: normal;
                        font-style: normal;
                    }
    
                    @font-face {
                        font-family: 'Inter';
                        src: url(data:font/ttf;base64,${base64InterSemiBold});
                        font-weight: 600;
                        font-style: normal;
                    }
                
                    @font-face {
                        font-family: 'Inter';
                        src: url(data:font/ttf;base64,${base64InterBold});
                        font-weight: 700;
                        font-style: normal;
                    }
    
                    @page {
                        margin: 2.5cm 2.5cm 3cm 2.5cm;
                    }
    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
    
                    html {
                        font-size: 10pt;
                    }
    
                    body {
                        font-family: "Inter", Arial, sans-serif;
                        line-height: 1.6;
                        overflow: hidden;
                    }
    
                    img, svg, video, canvas, audio, iframe, embed, object {
                        display: block;
                        max-width: 100%;
                    }
    
                    table, th, td {
                        border: 1px solid #000;
                    }
    
                    table {
                        table-layout: fixed;
                        width: 100%;
                        border-collapse: collapse;
                        margin: 2rem 0rem;
                    }
    
                    th {
                        text-align: unset;
                        background-color: #eee;
                        font-weight: bold;
                    }
    
                    th, td {
                        padding: 5px;
                        word-wrap: break-word;
                    }
    
                    tr {
                        break-inside: avoid;
                    }
    
                    .section {
                        break-inside: avoid;
                    }
    
                    .section-title {
                        margin-top: 5rem;
                        margin-bottom: 1rem;
                        font-weight: 600;
                        font-size: 12pt;
                    }
    
                    .section-subtitle {
                        font-size: 10pt;
                    }
    
                    #title {
                        font-family: 'Montserrat', sans-serif;
                        text-align: center;
                        max-width: 90%;
                        margin: 0 auto;
                        padding-bottom: 2rem;
                        font-weight: 500;
                    }
    
                    h1 {
                        margin-top: 3rem;
                        font-size: 20pt;
                    }
    
                    h2 {
                        margin-top: 3rem;
                        font-size: 18pt;
                    }
    
                    h3 {
                        margin-top: 2rem;
                        font-size: 16pt;
                    }
    
                    h4 {
                        margin-top: 2rem;
                        font-size: 14pt;
                    }
    
                    h5 {
                        margin-top: 1rem;
                        font-size: 12pt;
                    }
    
                    h6 {
                        margin-top: 1rem;
                        font-size: 10pt;
                    }
    
                    #main-text {
                        margin-top: 4rem;
                        text-align: justify;
                    }
    
                    ul, ol {
                        padding-left: 2rem;
                        margin: 1rem 0rem;
                    }
    
                    li {
                        margin: 0.5rem 0rem;
                    }
    
                    p {
                        margin: 0.5rem 0rem;
                    }
    
                    a {
                        color: #296D89;
                        text-decoration-color: #296D89;
                        text-underline-offset: 2px;
                    }
    
                    .metadata {
                        font-size: 11pt;
                        margin-bottom: 10px;
                    }
    
                    pre {
                        margin: 1rem 0rem;
                        border: 1px solid #121212;
                        background-color: #eee;
                        padding: 1rem;
                        border-radius: 5px;
                    }
                    
                    code {
                        white-space: pre-wrap;
                    }
    
                    sup {
                        font-size: 10px;
                    }
    
                    .reference-location {
                        position: relative;
                        top: -0.5rem;
                        margin-bottom: 1rem;
                    }
                </style>
                <style>${katexCSS}</style>
            </head>
            <body>
            <h1 id="title" lang=${languageIfNotEnglish}>${title}</h1>
                <p class="metadata">
                    <strong>Authors:</strong> ${authorsWithAffiliationNumbers
                        .map(
                            (author) =>
                                `<a href="${process.env.BASE_URL}/authors/${
                                    author.linkedUser
                                }">${Helpers.getUserFullName(author.user)}` +
                                (author.affiliationNumbers.length ? `<sup>${author.affiliationNumbers}</sup>` : '') +
                                '</a>'
                        )
                        .join(', ')}
                </p>
                <p class="metadata">
                    <strong>Publication Type:</strong> ${Helpers.formatPublicationType(
                        publicationVersion.publication.type
                    )}
                </p>
                <p class="metadata">
                    <strong>Publication Date:</strong> ${
                        publicationVersion.publishedDate
                            ? formatPDFDate(publicationVersion.publishedDate)
                            : formatPDFDate(new Date())
                    }
                </p>
                <p class="metadata">
                    <strong>Language:</strong> ${language.toUpperCase()}
                </p>
                <p class="metadata">
                    <strong>License Type:</strong> ${licences[licence]?.niceName}
                </p>
                <p class="metadata">
                    <strong>DOI:</strong> 
                    <a href="${doiLinkBase + publicationVersion.publication.doi}">
                        ${publicationVersion.publication.doi}
                    </a>
                </p>
    
                <div id="main-text" lang=${languageIfNotEnglish}>
                    ${Helpers.renderLatexInHTMLString(mainText)}
                </div>
    
                ${
                    additionalInformation.length
                        ? `<div class="section">
                        <h2 class="section-title">Additional parts of this work hosted elsewhere</h2>
                        <ul>
                        ${additionalInformation
                            .map(
                                (additionalInfoEntry) =>
                                    `<li>
                                        <h3 class="section-subtitle" lang=${languageIfNotEnglish}><b>${
                                        additionalInfoEntry.title
                                    }</b></h3>
                                        ${
                                            additionalInfoEntry.description &&
                                            `<p lang=${languageIfNotEnglish}>${additionalInfoEntry.description}</p>`
                                        }
                                        <p><a href="${additionalInfoEntry.url}" aria-label="${
                                        additionalInfoEntry.title
                                    }">
                                            Link to ${additionalInfoEntry.title}
                                        </a></p>
                                    </li>`
                            )
                            .join('')}
                        </ul>
                    </div>`
                        : ''
                }
    
                <div class="section affiliations">
                    <h2 class="section-title">Affiliations</h2>
                    ${
                        affiliations.length
                            ? '<ol>' +
                              affiliations
                                  .map(
                                      (affiliation) =>
                                          '<li>' +
                                          (affiliation.url
                                              ? `<a href="${affiliation.url}">${affiliation.name}</a>`
                                              : affiliation.name) +
                                          '</li>'
                                  )
                                  .join('') +
                              '</ol>'
                            : '<p>No affiliations have been specified for this publication.</p>'
                    }
                </div>
    
                <div class="section references">
                    <h2 class="section-title">References</h2>
                    ${
                        references.length
                            ? references
                                  .map(
                                      (reference) =>
                                          `${reference.text}${
                                              reference.location
                                                  ? `<p class="reference-location"><a href="${reference.location}">${reference.location}</a></p>`
                                                  : ''
                                          }`
                                  )
                                  .join('')
                            : '<p>No references have been specified for this publication.</p>'
                    }
                </div>
    
                ${
                    linkedTo.length
                        ? ` <div class="section">
                                <h2 class="section-title">Parent publications</h2>
                                ${linkedTo
                                    .map(
                                        (link) =>
                                            `<p style="margin-bottom: 1rem"><a href="${doiLinkBase + link.doi}">${
                                                link.title
                                            }</a></p>`
                                    )
                                    .join('')}
                            </div>`
                        : ''
                }
    
                ${
                    selfDeclaration && ['PROTOCOL', 'HYPOTHESIS'].includes(publicationVersion.publication.type)
                        ? ` <div class="section">
                                <h2 class="section-title">Data access statement</h2>
                                ${
                                    publicationVersion.publication.type === 'PROTOCOL'
                                        ? '<p>Data has not yet been collected according to this method/protocol.</p>'
                                        : '<p>Data has not yet been collected to test this hypothesis (i.e. this is a preregistration)</p>'
                                }
                            </div>`
                        : ''
                }
                
                ${
                    ethicalStatement
                        ? ` <div class="section">
                                <h2 class="section-title">Ethical statement</h2>
                                <p lang=${languageIfNotEnglish}>${ethicalStatement}</p>
                                ${
                                    ethicalStatementFreeText
                                        ? `<p lang=${languageIfNotEnglish}>${ethicalStatementFreeText}</p>`
                                        : ''
                                }
                            </div>`
                        : ''
                }
    
                ${
                    dataPermissionsStatement
                        ? ` <div class="section">
                                <h2 class="section-title">Data permissions statement</h2>
                                <p lang=${languageIfNotEnglish}>${dataPermissionsStatement}</p>
                                ${
                                    dataPermissionsStatementProvidedBy
                                        ? `<p>${dataPermissionsStatementProvidedBy}</p>`
                                        : ''
                                }
                            </div>`
                        : ''
                }
               
                ${
                    dataAccessStatement
                        ? ` <div class="section">
                                <h2 class="section-title">Data access statement</h2>
                                <p lang=${languageIfNotEnglish}>${dataAccessStatement}</p>
                            </div>`
                        : ''
                }
    
                <div class="section">
                    <h2 class="section-title">Funders</h2>
                    ${
                        funders.length
                            ? ` <div>
                        <p>This Research Problem has the following sources of funding:</p>
                        <ul class="funders-list">
                        ${funders
                            .map(
                                (funder) =>
                                    `<li><a href="${funder.link}">${funder.name}</a> - ${funder.city}, ${funder.country}</li>`
                            )
                            .join('')}
                                </ul>
                                </div>`
                            : '<p>No sources of funding have been specified for this publication.</p>'
                    }
                </div>
                <div class="section">
                    <h2 class="section-title">Conflict of interest</h2>
                    ${
                        conflictOfInterestText
                            ? `<p lang=${languageIfNotEnglish}>${conflictOfInterestText}</p>`
                            : '<p>This publication does not have any specified conflicts of interest.</p>'
                    }
                </div>   
            </body>
        </html>`
        .split('\n')
        .join('');

    return htmlTemplate;
};

const createPublicationHeaderTemplate = (publicationVersion: I.PublicationVersion): string => {
    const authors = publicationVersion.coAuthors.filter((author) => author.confirmedCoAuthor && author.linkedUser);
    const base64InterRegular = fs.readFileSync('assets/fonts/Inter-Regular.ttf', { encoding: 'base64' });

    return `
    <style>
        @font-face {
            font-family: 'Inter';
            src: url(data:font/ttf;base64,${base64InterRegular});
            font-weight: normal;
            font-style: normal;
        }

        .header {
            width: 100%;
            padding: 0.5cm 1.86cm;
            display: flex;
            justify-content: space-between;
            font-family: "Inter", Arial, sans-serif;
            font-size: 8pt;
        }

        .header a {
            color: #296D89;
            text-decoration-color: #296D89;
            text-underline-offset: 2px;
        }

        .header sup {
            font-size: 7px;
        }
    </style>
    <div class="header">
        <span>
            ${Helpers.getUserFullName(authors[0]?.user) + (authors.length > 1 ? ' et al.' : '')}
        </span>
        <span>
            Published ${
                publicationVersion.publishedDate
                    ? formatPDFDate(publicationVersion.publishedDate)
                    : formatPDFDate(new Date())
            }
        </span>
    </div>`;
};

const createPublicationFooterTemplate = (publicationVersion: I.PublicationVersion): string => {
    const base64InterRegular = fs.readFileSync('assets/fonts/Inter-Regular.ttf', { encoding: 'base64' });
    const base64OctopusLogo = fs.readFileSync('assets/img/OCTOPUS_LOGO_ILLUSTRATION_WHITE_500PX.svg', {
        encoding: 'base64'
    });

    return `
    <style>
        @font-face {
            font-family: 'Inter';
            src: url(data:font/ttf;base64,${base64InterRegular});
            font-weight: normal;
            font-style: normal;
        }

        .footer {
            width: 100%;
            padding: 0.5cm 1.86cm;
            display: grid;
            grid-template-columns: 1fr 0.7fr 1fr;
            align-items: start;
            font-family: "Inter", Arial, sans-serif;
            font-size: 8pt;
            line-height: 1.5;
        }

        .footer > div:nth-of-type(2) {
            text-align: center;
        }

        .footer > div:nth-of-type(3) {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            gap: 3px;
        }

        .footer a {
            color: #296D89;
            text-decoration-color: #296D89;
            text-underline-offset: 1px;
            word-break: break-all;
        }

        #octopus-logo {
            width: 24px;
            vertical-align: middle;
            position: relative;
            bottom: 6px;
            text-decoration: none;
        }
    </style>
    <div class="footer">            
        <div>
            <span>DOI: <a href="${doiLinkBase + publicationVersion.publication.doi}">${
        publicationVersion.publication.doi
    }</a></span>
        </div>
        <div>
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>        
        <div>
            Published on <a href="${process.env.BASE_URL}">Octopus.ac</a>
            <a href="${
                process.env.BASE_URL
            }"><img id="octopus-logo" src="data:image/svg+xml;base64,${base64OctopusLogo}"/></a>
        </div>
    </div>`;
};

// AWS Lambda + Puppeteer walkthrough -  https://medium.com/@keshavkumaresan/generating-pdf-documents-within-aws-lambda-with-nodejs-and-puppeteer-46ac7ca299bf
export const generatePublicationVersionPDF = async (
    publicationVersion: I.PublicationVersion
): Promise<string | null> => {
    const references = await referenceService.getAllByPublicationVersion(publicationVersion.id);
    const { linkedTo } = await publicationService.getDirectLinksForPublication(publicationVersion.versionOf);
    const htmlTemplate = createPublicationHTMLTemplate(publicationVersion, references, linkedTo);
    const isLocal = process.env.STAGE === 'local';

    let browser: Browser | null = null;

    try {
        chromium.setGraphicsMode = false;

        browser = await launch({
            args: [...chromium.args, '--font-render-hinting=none'],
            executablePath: isLocal ? (await import('puppeteer')).executablePath() : await chromium.executablePath(),
            headless: !!chromium.headless
        });

        console.log('Browser opened!');

        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        console.log('Page viewport set');
        await page.setContent(htmlTemplate, {
            waitUntil: htmlTemplate.includes('<img') ? ['load', 'networkidle0'] : undefined
        });
        console.log('Page content set');

        const pdf = await page.pdf({
            format: 'a4',
            preferCSSPageSize: true,
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: createPublicationHeaderTemplate(publicationVersion),
            footerTemplate: createPublicationFooterTemplate(publicationVersion)
        });
        console.log('Page exported to PDF');

        // upload pdf to S3
        await s3.client.send(
            new PutObjectCommand({
                Bucket: s3.buckets.pdfs,
                Key: `${publicationVersion.versionOf}.pdf`,
                ContentType: 'application/pdf',
                Body: pdf
            })
        );

        console.log('Successfully generated PDF for publicationId: ', publicationVersion.versionOf);

        return `${s3.endpoint}/${s3.buckets.pdfs}/${publicationVersion.versionOf}.pdf`;
    } catch (err) {
        console.error(err);

        return null;
    } finally {
        if (browser) {
            // close all pages
            for (const page of await browser.pages()) {
                await page.close();
            }

            // close browser
            await browser.close();
            console.log('Browser closed!');
        }
    }
};
