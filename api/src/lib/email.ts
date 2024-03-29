import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as aws from '@aws-sdk/client-ses';
import * as I from 'interface';

const from = {
    name: 'Octopus.ac',
    address: process.env.EMAIL_SENDER_ADDRESS || ''
};
const baseURL = process.env.BASE_URL;

const ses = new aws.SES({
    region: 'eu-west-1'
});

let mailConfig;

switch (process.env.STAGE) {
    case 'local':
        mailConfig = {
            host: process.env.MAIL_SERVER,
            port: 1025
        };
        break;
    default:
        mailConfig = {
            SES: { ses, aws }
        };
        break;
}

const transporter = nodemailer.createTransport(mailConfig);

const styles = {
    body: `
        background-color: #f2f2f2;
        font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
        color: #333333;
    `,
    h1: `
        font-size: 56px;
        font-weight: 300;
        margin: 0;
        padding: 0 0 32px 0;
    `,
    h3: `
        font-size: 16px;
        font-weight: 300;
        margin: 0;
        padding: 0 0 8px 0;
    `,
    p: `
        font-size: 16px;
        font-weight: 300;
        margin: 0;
        line-height: 1.6;
    `,
    a: `
        color: #333333;
        text-decoration: underline;
    `,
    wrapper: `
        max-width: 720px;
        margin: auto;
        padding-top: 32px;
    `,
    header: `
        background-color: #296d8a;
        padding: 16px 32px;
    `,
    headerImg: `
        width: 40px;
        margin-right: 12px;
        display: inline-block;
        vertical-align: middle;
    `,
    headerH3: `
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        vertical-align: middle;
    `,
    content: `
        background-color: #ffffff;
        padding: 32px 32px 128px;
    `,
    footer: `
        padding: 64px 0 32px;
    `,
    footerLogo: `
        vertical-align: top;
        display: inline-block;
        margin-right: 2%;
    `,
    footerImg: `
        width: 45px;
        margin-right: 10px;
    `,
    footerImgLink: `
        text-decoration: none;
    `,
    footerContent: `
        display: inline-block;
        vertical-align: top;
        margin-right: 5%;
        max-width: 350px;
    `,
    footerLinks: `
        display: inline-block;
        vertical-align: top;
    `,
    button: `
        display: inline-block;
        color: #00619E;
        padding: 16px 64px;
        border: 1px solid #00619E;
        border-radius: 3px;
        text-decoration: none;
    `,
    code: `
        font-size: 32px;
        letter-spacing: 5px;
        text-align: center;
    `
};

export const standardHTMLEmailTemplate = (subject: string, html: string, previewText = ''): string => {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${subject}</title>
            </head>
            <body style="${styles.body}">
                <div style="display: none; max-height: 0px; overflow: hidden;">${previewText}&zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj;</div>
                <div style="${styles.wrapper}">
                    <div style="${styles.header}">
                        <img
                            src="https://science-octopus-publishing-images-prod.s3.eu-west-1.amazonaws.com/OCTOPUS_LOGO_ILLUSTRATION_WHITE_500PX.png"
                            style="${styles.headerImg}"
                            width="40"
                        />
                        <h3 style="${styles.headerH3}">Octopus</h3>
                    </div>
                    <div style="${styles.content}">${html}</div>
                    <div style="${styles.footer}">
                        <div style="${styles.footerLogo}">
                            <p>
                                <a href="${baseURL}" style="${styles.footerImgLink}">
                                    <img
                                    src="https://science-octopus-publishing-images-prod.s3.eu-west-1.amazonaws.com/OCTOPUS_LOGO_ILLUSTRATION_WHITE_500PX.png"
                                    style="${styles.footerImg}"
                                    width="45"
                                    />
                                </a>
                                <a href="https://www.jisc.ac.uk/" style="${styles.footerImgLink}">
                                    <img
                                    src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg"
                                    style="${styles.footerImg}"
                                    width="45"
                                    />
                                </a>
                            </p>
                        </div>
                        <div style="${styles.footerContent}">
                            <p>Octopus: the fast, free and fair way to share your research.</p>
                            <p>This service is delivered by Jisc in collaboration <br/> with Octopus Publishing CIC.</p>
                        </div>
                        <div style="${styles.footerLinks}">
                            <p>
                                <a href="mailto:help@jisc.ac.uk" target="_blank" rel="noreferrer noopener">help@jisc.ac.uk</a>
                            </p>
                            <p>0300 300 2212</p>
                            <p>
                                Support hours: Mon - Fri
                                <br />
                                09:00 – 17:00 (UK time)
                            </p>
                            <p>
                                <a href="${baseURL}/privacy">Privacy Notice</a>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>    
    `;
};

export const send = async (options: I.EmailSendOptions): Promise<SMTPTransport.SentMessageInfo> => {
    const emailResponse = await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
    });

    return emailResponse;
};

/* Templates */

type NotifyCoAuthor = {
    userFirstName: string;
    userLastName: string | null;
    coAuthor: string;
    publicationId: string;
    versionId: string;
    publicationTitle: string;
    code: string;
};

export const notifyCoAuthor = async (options: NotifyCoAuthor): Promise<void> => {
    const html = `
    <p>${options.userFirstName} ${options.userLastName} has added you as an author of the following publication on Octopus:</p>
    <br>
    <p style="text-align: center;"><strong><i>${options.publicationTitle}</i></strong></p>
    <br>
    <p>Please use the button below to confirm that you are involved with the publication and review the draft to ensure you are happy with it:</p> 
    <br>
    <p style="text-align: center;"><a style="${styles.button}" href='${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publicationId=${options.publicationId}&versionId=${options.versionId}&approve=true'>Confirm & Review Publication</a></p>
    <br>
    <p>If you are not an author of this publication, please click the button below:</p>
    <br>
    <p style="text-align: center;"><a style="${styles.button}" href='${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publicationId=${options.publicationId}&versionId=${options.versionId}&approve=false'>I am not an author</a></p>
    </br>
    <p>An Octopus user has provided this email address so that you can receive this message. If you select that you are not involved with the publication named above, your data will be deleted immediately.</p>
    `;

    const text = `${options.userFirstName} ${options.userLastName} has added you as an author of the following publication on Octopus: ${options.publicationTitle}. To confirm your involvement, and see a preview of the publication, you can use this link: ${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publicationId=${options.publicationId}&versionId=${options.versionId}&approve=true . If you are not an author of this publication, you can use this link: ${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publicationId=${options.publicationId}&versionId=${options.versionId}&approve=false . An Octopus user has provided this email address so that you can receive this message. If you select that you are not involved with the publication named above, your data will be deleted immediately.`;

    await send({
        html: standardHTMLEmailTemplate(
            'You’ve been added as a co-author on Octopus',
            html,
            'Next, confirm your involvement, and log in to get started'
        ),
        text,
        to: options.coAuthor,
        subject: 'You’ve been added as a co-author on Octopus'
    });
};

type VerificationCode = {
    to: string;
    code: string;
    userFirstName: string;
    userLastName: string | null;
};

export const verificationCode = async (options: VerificationCode): Promise<void> => {
    const html = `
    <p>Hi ${options.userFirstName} ${options?.userLastName},</p>
    <p>Welcome to Octopus!</p>
    <br/>
    <p>To start publishing your research and reviewing the work of others, please verify your email address below.</p>
    <br/>
    <p id="verification-code" style="${styles.code}">${options.code}</p>
    <br/>
    <p>This email address will be used to deliver the Octopus service, as described in our <a href="${baseURL}/privacy">privacy policy</a>. You can update your 
    email at any time via your account page on the Octopus platform. If you no longer wish to have an account on Octopus, notify 
    us at <a href='mailto:help@jisc.ac.uk'>help@jisc.ac.uk</a>.</p>
    <br/>
    <p>Your account was created using your <a href="https://orcid.org/">ORCID identifier</a>. By creating an account, you have given
    permission for us to use your ORCID credentials to log you into the Octopus platform, and to display information from your ORCID 
    account, including name, affiliation, and existing works, on your Octopus profile page. If any information on your profile appears 
    incorrect or out of date, please update it in ORCID.</p>
    `;

    const text = `Please enter the following code to verify your email address: ${options.code}`;

    await send({
        html: standardHTMLEmailTemplate('Verify your Octopus account', html, 'Use the code within to get started'),
        text,
        to: options.to,
        subject: 'Verify your Octopus account'
    });
};

type NewRedFlagAuthorNotification = {
    to: string;
    publicationName: string | null;
    publicationId: string | null;
    flagId: string;
    type: string;
    submitter: string;
    flagReason: string;
};

export const newRedFlagAuthorNotification = async (
    options: NewRedFlagAuthorNotification
): Promise<SMTPTransport.SentMessageInfo> => {
    const html = `
    <p>A potential concern has been flagged with your publication, <strong><i>${options.publicationName}</i></strong>. This will be displayed on the platform until resolved. You can respond to the red flag via the publication page.</p>
    <br>
    <p>Red flag details:</p>
    <br>
    <p><strong>Type:</strong> ${options.type}</p>
    <br>
    <p><strong>Submitter:</strong> ${options.submitter}</p>
    <br>
    <p><strong>Reason for flag:</strong> ${options.flagReason}</p>
    <br>
    <p style="text-align: center;"><a style="${styles.button}" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>Respond to red flag</a></p>
    <br>
    <p>The red flag feature is designed to encourage an open dialogue between the author(s) and their peers. Both parties can add comments, and view responses, via the publication page. Note that all comments are public. The submitter can also resolve a red flag following discussion.</p>
    <br>
    <p>We hope that the majority of red flags can be resolved, in some cases with a new version of the publication released. If you are unable to reach a resolution with the creator of the red flag, please escalate to the Octopus team via <a href='mailto:help@jisc.ac.uk'>help@jisc.ac.uk</a>.</p>
    `;

    const text = `Your publication '${options.publicationName}' has been red flagged by ${options.submitter}. Flag type: ${options.type}. Flag message: ${options.flagReason}.`;

    return send({
        html: standardHTMLEmailTemplate(
            'Your publication has been red flagged',
            html,
            'Somebody has identified a potential concern'
        ),
        text,
        to: options.to,
        subject: 'Your publication has been red flagged'
    });
};

type NewRedFlagCreatorNotification = {
    to: string;
    publicationName: string | null;
    publicationId: string;
    flagId: string;
};

export const newRedFlagCreatorNotification = async (
    options: NewRedFlagCreatorNotification
): Promise<SMTPTransport.SentMessageInfo> => {
    const html = `
    <p>Thank you for flagging a potential concern with <strong><i>${options.publicationName}</i></strong>. The submitting author has been notified, and has the option to respond to your message.</p>
    <br>
    <p style="text-align: center;"><a style="${styles.button}" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>View red flag</a></p>
    <br>
    <p>The red flag feature is designed to encourage an open dialogue between the author(s) and their peers. Both parties can add comments, and view responses, via the publication page. Note that all 
    comments are public.</p>
    <br>
    <p>If you are happy to resolve a red flag following discussion with the author, you can do so on the publication page. We hope that the majority of red flags can be resolved, in some cases with a 
    new version of the publication released. If you are unable to reach a resolution with the author, please escalate to the Octopus team via <a href='mailto:help@jisc.ac.uk'>help@jisc.ac.uk</a>.</p>
    `;

    const text = `You have successfully red flagged this publication. You can view it here: ${baseURL}/publications/${options.publicationId}/flag/${options.flagId}`;

    return send({
        html: standardHTMLEmailTemplate('Red flag created', html, "The publication's author has been notified"),
        text,
        to: options.to,
        subject: 'Red flag created'
    });
};

type UpdateRedFlagNotification = {
    to: string;
    publicationName: string;
    publicationId: string;
    flagId: string;
    type: string;
    submitter: string;
};

export const updateRedFlagNotification = async (
    options: UpdateRedFlagNotification
): Promise<SMTPTransport.SentMessageInfo> => {
    const html = `
    <p>A new comment has been received against the following red flag.</p>
    <br>
    <p><strong>Publication:</strong> ${options.publicationName}</p>
    <br>
    <p><strong>Type:</strong> ${options.type}</p>
    <br>
    <p><strong>Submitter:</strong> ${options.submitter}</p>
    <br>
    <p style="text-align: center;"><a style="${styles.button}" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>View red flag</a></p>
    <br>
    <p>The red flag feature is designed to encourage an open dialogue between the author(s) and their peers. Both parties can add comments, and view responses, 
    via the publication page. Note that all comments are public.</p>
    <br>
    <p>We hope that the majority of red flags can be resolved, in some cases with a new version of the publication released. If you are unable to reach a 
    resolution, please escalate to the Octopus team via <a href='mailto:help@jisc.ac.uk'>help@jisc.ac.uk</a>.</p>
    `;

    const text = `A new comment has been added against the red flag submitted by ${options.submitter}. Flag type: ${options.type}. You can view it here: ${baseURL}/publications/${options.publicationId}/flag/${options.flagId}`;

    return send({
        html: standardHTMLEmailTemplate('Red flag updated', html, `${options.submitter} has added a comment`),
        text,
        to: options.to,
        subject: 'Red flag updated'
    });
};

type ResolveRedFlagAuthorNotification = {
    to: string;
    publicationName: string;
    publicationId: string;
    flagId: string;
    type: string;
};

export const resolveRedFlagAuthorNotification = async (
    options: ResolveRedFlagAuthorNotification
): Promise<SMTPTransport.SentMessageInfo> => {
    const html = `
    <p>A red flag for <strong>${options.type}</strong> has been resolved for <strong><i>${options.publicationName}</i></strong>. The red flag 
    warning banner is no longer prominently displayed on the publication page.</p>
    <br>
    <p>For the sake of transparency, the history of the red flag and its full comment thread are retained on the platform and can 
    be viewed via the publication page. However, it is made clear where a flag is resolved rather than active.</p>
    <br>
    <p style="text-align: center;"><a style="${styles.button}" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>View red flag</a></p>
    `;

    const text = `A red flag has been resolved for '${options.publicationName}'. Flag type: ${options.type}. You can view it here: ${baseURL}/publications/${options.publicationId}/flag/${options.flagId}`;

    return send({
        html: standardHTMLEmailTemplate(
            'Red flag resolved',
            html,
            'It will no longer appear prominently against the publication'
        ),
        text,
        to: options.to,
        subject: 'Red flag resolved'
    });
};

type ResolveRedFlagCreatorNotification = {
    to: string;
    publicationName: string;
    publicationId: string;
    flagId: string;
};

export const resolveRedFlagCreatorNotification = async (
    options: ResolveRedFlagCreatorNotification
): Promise<SMTPTransport.SentMessageInfo> => {
    const html = `
    <p>Thank you for resolving the red flag you created for <strong><i>${options.publicationName}</i></strong>. The submitting 
    author has been notified, and the warning banner is no longer prominently displayed on the publication page.</p>
    <br>
    <p>For the sake of transparency, the history of the red flag and its full comment thread are retained on the platform and can 
    be viewed via the publication page. However, it is made clear where a flag is resolved rather than active.</p>
    <br>
    <p style="text-align: center;"><a style="${styles.button}" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>View red flag</a></p>
    `;

    const text = `Thank you for resolving the red flag you created for '${options.publicationName}'. You can view it here: ${baseURL}/publications/${options.publicationId}/flag/${options.flagId}`;

    return send({
        html: standardHTMLEmailTemplate('Red flag resolved', html, "The publication's author has been notified"),
        text,
        to: options.to,
        subject: 'Red flag resolved'
    });
};

type NotifyCoAuthorConfirmation = {
    coAuthor: {
        firstName: string;
        lastName: string;
    };
    publication: {
        title: string;
        url: string;
        authorEmail: string;
    };
    remainingConfirmationsCount: number;
};

export const notifyCoAuthorConfirmation = async (options: NotifyCoAuthorConfirmation): Promise<void> => {
    if (options.remainingConfirmationsCount) {
        // one or more confirmations left
        const html = `
           <p><strong>${options.coAuthor.firstName} ${
            options.coAuthor.lastName
        }</strong> has confirmed their involvement in <strong><i>${
            options.publication.title
        }</i></strong> and has confirmed that the draft is ready to publish.</p>
            <br>
            <p style="text-align: center;"><a style="${styles.button}" href="${
            options.publication.url
        }" target="_blank" rel="noreferrer noopener">View publication</a></p>
            <br>
            <p><strong>${options.remainingConfirmationsCount}</strong> co-author${
            options.remainingConfirmationsCount === 1 ? '' : 's'
        } still need to confirm your draft before this publication can go live.</p> 
            <br>
            <p>Note that all co-authors must approve before this publication can go live.</p>
        `;

        const text = `${options.coAuthor.firstName} ${options.coAuthor.lastName} has confirmed their involvement in '${
            options.publication.title
        }' and has confirmed that the draft is ready to publish. You can view the publication here: ${
            options.publication.url
        } . ${options.remainingConfirmationsCount} co-author${
            options.remainingConfirmationsCount === 1 ? '' : 's'
        } still need to confirm your draft before this publication can go live. Note that all co-authors must approve before this publication can go live`;

        await send({
            html: standardHTMLEmailTemplate(
                'A co-author has approved your Octopus publication',
                html,
                'One step closer to going live'
            ),
            text,
            to: options.publication.authorEmail,
            subject: 'A co-author has approved your Octopus publication'
        });

        return;
    }

    // last confirmation
    const html = `
                <p>All co-authors have confirmed their involvement in <strong><i>${options.publication.title}</i></strong> and have confirmed that the draft is ready to publish.</p>
                <br>
                <p>You are now ready to publish!</p>
                <br>
                <p style="text-align: center;"><a style="${styles.button}" href="${options.publication.url}" target="_blank" rel="noreferrer noopener">View publication</a></p>
                <br>
                <p>Note that any changes to the draft publication at this stage will require co-authors to reapprove.</p>
            `;

    const text = `All co-authors have confirmed their involvement in '${options.publication.title}' and have confirmed that the draft is ready to publish. You are now ready to publish! You can view the publication here: ${options.publication.url} . Note that any changes to the draft publication at this stage will require co-authors to reapprove.`;

    await send({
        html: standardHTMLEmailTemplate(
            'All co-authors have approved your Octopus publication',
            html,
            'You are ready to publish!'
        ),
        text,
        to: options.publication.authorEmail,
        subject: 'All co-authors have approved your Octopus publication'
    });
};

type NotifyCoAuthorRejection = {
    coAuthor: {
        email: string;
    };
    publication: {
        title: string;
        authorEmail: string;
    };
};

export const notifyCoAuthorRejection = async (options: NotifyCoAuthorRejection): Promise<void> => {
    const html = `
                <p>The request that you sent to <strong>${options.coAuthor.email}</strong> to be registered as a co-author of <strong><i>${options.publication.title}</i></strong> has been rejected, and this individual has denied their involvement.</p>
                <br>
                <p>If you feel that this may have been a mistake, please check that the email address was spelled correctly, or contact this individual directly to discuss their involvement.</p>
                <br>
                <p>This individual’s approval is no longer required before this publication can go live.</p>
            `;

    const text = `The request that you sent to ${options.coAuthor.email} to be register as a co-author of '${options.publication.title}' has been rejected, and this individual has denied their involvement. If you feel that this may have been a mistake, please check that the email address was spelled correctly, or contact this individual directly to discuss their involvement. This individual’s approval is no longer required before this publication can go live.`;

    await send({
        html: standardHTMLEmailTemplate(
            'A co-author has denied their involvement',
            html,
            'Their approval is no longer required to go live'
        ),
        text,
        to: options.publication.authorEmail,
        subject: 'A co-author has denied their involvement'
    });
};

type NotifyCoAuthorRemoval = {
    coAuthor: {
        email: string;
    };
    publication: {
        title: string;
    };
};

export const notifyCoAuthorRemoval = async (options: NotifyCoAuthorRemoval): Promise<void> => {
    const html = `
                <p>You are no longer listed as a co-author on <strong><i>${options.publication.title}</i></strong> and will not receive emails about updates to this publication in future.</p>
                <p>If you feel that this may have been a mistake, you may wish to contact the author directly to discuss your involvement.</p>
            `;

    const text = `You are no longer listed as a co-author on '${options.publication.title}' and will not receive emails about updates to this publication in future. If you feel that this may have been a mistake, you may wish to contact the author directly to discuss your involvement.`;

    await send({
        html: standardHTMLEmailTemplate(
            'You are no longer listed as a co-author',
            html,
            "You won't receive any more updates about this publication"
        ),
        text,
        to: options.coAuthor.email,
        subject: 'You are no longer listed as a co-author'
    });
};

type SendApprovalReminder = {
    coAuthor: {
        email: string;
        code: string;
    };
    publication: {
        id: string;
        title: string;
        creator: string;
        versionId: string;
    };
};

export const sendApprovalReminder = async (options: SendApprovalReminder): Promise<void> => {
    const html = `
        <p>${options.publication.creator} has sent you a reminder to confirm or deny your involvement as an author of the following publication on Octopus:</p>
        <br>
        <p style="text-align: center;"><strong><i>${options.publication.title}</i></strong></p>
        <br>
        <p>Please use the button below to confirm that you are involved with the publication and review the draft to ensure you are happy with it:</p> 
        <br>
        <p style="text-align: center;"><a style="${styles.button}" href='${baseURL}/author-link?email=${options.coAuthor.email}&code=${options.coAuthor.code}&publicationId=${options.publication.id}&versionId=${options.publication.versionId}&approve=true'>Confirm & Review Publication</a></p>
        <br>
        <p>If you are not an author of this publication, please click the button below:</p>
        <br>
        <p style="text-align: center;"><a style="${styles.button}" href='${baseURL}/author-link?email=${options.coAuthor.email}&code=${options.coAuthor.code}&publicationId=${options.publication.id}&versionId=${options.publication.versionId}&approve=false'>I am not an author</a></p>
        </br>
        <p>An Octopus user has provided this email address so that you can receive this message. If you select that you are not involved with the publication named above, your data will be deleted immediately.</p>
    `;

    const text = `${options.publication.creator} has sent you a reminder to confirm or deny your involvement as an author of the following publication on Octopus: ${options.publication.title}. To confirm your involvement, and see a preview of the publication, follow this link: ${baseURL}/author-link?email=${options.coAuthor.email}&code=${options.coAuthor.code}&publicationId=${options.publication.id}&versionId=${options.publication.versionId}&approve=true. If you are not the co-author, follow this link: ${baseURL}/author-link?email=${options.coAuthor.email}&code=${options.coAuthor.code}&publicationId=${options.publication.id}&versionId=${options.publication.versionId}&approve=false. An Octopus user has provided this email address so that you can receive this message. If you select that you are not involved with the publication named above, your data will be deleted immediately.`;

    await send({
        html: standardHTMLEmailTemplate(
            'You’ve been added as a co-author on Octopus',
            html,
            `A reminder from ${options.publication.creator}`
        ),
        text,
        to: options.coAuthor.email,
        subject: 'You’ve been added as a co-author on Octopus'
    });
};

type NotifyCoAuthorsAboutChanges = {
    coAuthor: {
        email: string;
    };
    publication: {
        title: string;
        url: string;
    };
};

export const notifyCoAuthorsAboutChanges = async (options: NotifyCoAuthorsAboutChanges): Promise<void> => {
    const html = `
        <p>The corresponding author has made changes to a publication you are involved with:</p>
        <br>
        <p style="text-align: center"><strong><i>${options.publication.title}</i></strong></p>
        <br>
        <p>Please use the button below to review the draft publication to ensure you are happy with the changes:</p> 
        <br>
        <p style="text-align: center;"><a style="${styles.button}" href="${options.publication.url}">View publication</a></p>
        <br>
        <p>Your approval is required before the corresponding author can publish. If you have any concerns with the publication, please contact the corresponding author directly to discuss them.</p>
    `;

    const text = `The corresponding author has made changes to a publication you are involved with. Please use the link below to review the draft publication to ensure you are happy with the changes: ${options.publication.url} . Your approval is required before the corresponding author can publish. If you have any concerns with the publication, please contact the corresponding author directly to discuss them.`;

    await send({
        html: standardHTMLEmailTemplate(
            'Changes have been made to a publication that you are an author on',
            html,
            'These are waiting for your review'
        ),
        text,
        to: options.coAuthor.email,
        subject: 'Changes have been made to a publication that you are an author on'
    });
};

type NotifyCoAuthorCancelledApproval = {
    publication: {
        id: string;
        title: string;
        authorEmail: string;
        url: string;
    };
};

export const notifyCoAuthorCancelledApproval = async (options: NotifyCoAuthorCancelledApproval): Promise<void> => {
    const html = `
                <p>A co-author had previously approved your publication, <strong><i>${options.publication.title}</i></strong>, but has now changed their mind, indicating that changes might be needed.</p>
                <br>
                <p style="text-align: center;"><a style="${styles.button}" href="${options.publication.url}">View publication</a></p>
                <br>
                <p>This author’s approval is required before publishing. Please discuss whether any further changes are needed with the author.</p>
            `;

    const text = `A co-author had previously approved your publication, ${options.publication.title}, but has now changed their mind, indicating that changes might be needed. You can view the publication following this link: ${options.publication.url}. This author’s approval is required before publishing. Please discuss whether any further changes are needed with the author.`;

    await send({
        html: standardHTMLEmailTemplate(
            'A co-author has cancelled their approval',
            html,
            'You may need to discuss their concerns directly to proceed'
        ),
        text,
        to: options.publication.authorEmail,
        subject: 'A co-author has cancelled their approval'
    });
};

/**
 * @todo: remove once functionality has been tested.
 */
export const dummyEventNotification = async (to: string): Promise<void> => {
    const html = '<p>This is a test notification to demonstrate the scheduled notification functionality.</p>';
    const text = 'This is a test notification to demonstrate the scheduled notification functionality.';

    await send({
        html: standardHTMLEmailTemplate('Dummy event nofication', html, 'This was sent by a scheduled function'),
        text,
        to,
        subject: 'Dummy event nofication'
    });
};

type RequestControlOptions = {
    requesterName: string;
    eventId: string;
    publicationVersion: {
        id: string;
        versionOf: string;
        title: string;
        authorEmail: string;
    };
};

export const requestControl = async (options: RequestControlOptions): Promise<void> => {
    const subject = `${options.requesterName} is requesting to take over editing`;
    const approveUrl = `${process.env.BASE_URL}/approve-control-request?approve=true&eventId=${options.eventId}&versionId=${options.publicationVersion.id}&versionOf=${options.publicationVersion.versionOf}`;
    const rejectUrl = approveUrl.replace('approve=true', 'approve=false');

    const html = `
                <p>${options.requesterName} has asked for permission to take over as the corresponding author of the following publication on Octopus so they can make edits to it:</p>
                <br>
                <p style="text-align: center"><strong><i>${options.publicationVersion.title}</i></strong></p>
                <br>
                <p>Please use the buttons below to either confirm they can take over the editing of this publication, or reject the request. <strong>If you do not take action, they will take over from you as the corresponding author after two weeks have passed.</strong>.</p>
                <br/>
                <p style="text-decoration: underline;">Note that you will lose the ability to edit the publication yourself if you confirm this request.</p>
                <br/>
                <p style="text-align: center;">
                    <a style="${styles.button}" href="${approveUrl}">
                        Transfer control to ${options.requesterName}
                    </a>
                </p>
                <br/>
                <p>If you would like to remain in control of the editing process instead of ${options.requesterName}, use the button below to reject their request:</p>
                <br/>
                <p style="text-align: center;">
                    <a style="${styles.button}" href="${rejectUrl}">
                        Reject request
                    </a>
                </p>
                <br/>
                <p>You are seeing this message as you have initiated the creation of a new version of a publication you are an author on.</p>
            `;

    const text = `${options.requesterName} is requesting to take over editing. ${options.requesterName} has asked for permission to take over as the corresponding author of the following publication on Octopus so they can make edits to it: ${options.publicationVersion.title}. Please use the following link to confirm they can take over the editing of this publication (Note that you will lose the ability to edit the publication yourself if you confirm this request.): ${approveUrl}. If you would like to remain in control of the editing process instead of ${options.requesterName}, use the following link to reject their request: ${rejectUrl}. If you do not take action, they will take over from you as the corresponding author after two weeks have passed. You are seeing this message as you have initiated the creation of a new version of a publication you are an author on.`;

    await send({
        html: standardHTMLEmailTemplate(subject, html, 'Your response is required to confirm or reject their request.'),
        text,
        to: options.publicationVersion.authorEmail,
        subject
    });
};

type RejectControlRequestOptions = {
    requesterEmail: string;
    publicationVersion: {
        title: string;
        authorFullName: string;
    };
};

export const rejectControlRequest = async (options: RejectControlRequestOptions): Promise<void> => {
    const subject = `${options.publicationVersion.authorFullName} has rejected your request to take over editing`;
    const html = `
                <p>${options.publicationVersion.authorFullName} has rejected your request to take over as the corresponding author of the following publication on Octopus:</p>
                <br>
                <p style="text-align: center"><strong><i>${options.publicationVersion.title}</i></strong></p>
                <br>
                <p>Please discuss with the current corresponding author if you feel there may have been a mistake. Making additional requests to take over as corresponding author is discouraged until you have discussed the situation with the current corresponding author.</p>
            `;

    const text = `${options.publicationVersion.authorFullName} has rejected your request to take over as the corresponding author of the following publication on Octopus: ${options.publicationVersion.title}. Please discuss with the current corresponding author if you feel there may have been a mistake. Making additional requests to take over as corresponding author is discouraged until you have discussed the situation with the current corresponding author.`;

    await send({
        html: standardHTMLEmailTemplate(subject, html, 'Please discuss with the current corresponding author.'),
        text,
        to: options.requesterEmail,
        subject
    });
};

type ApproveControlRequestOptions = {
    requesterEmail: string;
    publicationVersion: {
        title: string;
        authorFullName: string;
        url: string;
    };
};

export const approveControlRequest = async (
    options: ApproveControlRequestOptions,
    isAutomaticallyApproved = false
): Promise<void> => {
    const subject = isAutomaticallyApproved
        ? 'You have been automatically approved as corresponding author'
        : `${options.publicationVersion.authorFullName} has approved your request to take over editing`;

    const html = `
                <p>${
                    isAutomaticallyApproved
                        ? `${options.publicationVersion.authorFullName} has not responded to your request within the 2 week window, and you have been automatically given corresponding authorship of the following publication on Octopus:`
                        : `${options.publicationVersion.authorFullName} has approved your request to take over as the corresponding author of the following publication on Octopus:`
                }</p>
                <br>
                <p style="text-align: center"><strong><i>${options.publicationVersion.title}</i></strong></p>
                <br>
                <p>You are now able to make edits to this publication. To get started, please click the button below, or visit your account on Octopus and open the publication</p>
                <br/>
                <p style="text-align: center;">
                    <a style="${styles.button}" href="${options.publicationVersion.url}">
                        Open publication
                    </a>
                </p>
                <br/>
                <p>Please note that ${
                    options.publicationVersion.authorFullName
                } has lost the ability to make edits of their own.</p>
            </p>
            `;

    const text = `${options.publicationVersion.authorFullName} has rejected your request to take over as the corresponding author of the following publication on Octopus: ${options.publicationVersion.title}. Please discuss with the current corresponding author if you feel there may have been a mistake. Making additional requests to take over as corresponding author is discouraged until you have discussed the situation with the current corresponding author.`;

    await send({
        html: standardHTMLEmailTemplate(
            subject,
            html,
            isAutomaticallyApproved
                ? 'You are now able to make edits to this publication.'
                : 'You have been approved as corresponding author.'
        ),
        text,
        to: options.requesterEmail,
        subject
    });
};

type RemoveCorrespondingAuthorOptions = {
    oldCorrespondingAuthorEmail: string;
    newCorrespondingAuthorFullName: string;
    publicationVersionTitle: string;
};

export const removeCorrespondingAuthor = async (options: RemoveCorrespondingAuthorOptions): Promise<void> => {
    const subject =
        'Another author has taken over editing and correspondence responsibility for one of your publications.';

    const html = `
                <p>${options.newCorrespondingAuthorFullName} had made a request to take over as corresponding author on <strong><i>${options.publicationVersionTitle}</i></strong>. As two weeks have passed since this request was made without any confirmation or rejection, corresponding authorship has automatically been passed to them. You will no longer be able to make edits to this publication yourself.</p>
                <br/>
                <p>Please discuss with the current corresponding author if you feel there may have been a mistake.</p>
            </p>
            `;

    const text = `${options.newCorrespondingAuthorFullName} had made a request to take over as corresponding author on '${options.publicationVersionTitle}'. As two weeks have passed since this request was made without any confirmation or rejection, corresponding authorship has automatically been passed to them. You will no longer be able to make edits to this publication yourself. Please discuss with the current corresponding author if you feel there may have been a mistake.`;

    await send({
        html: standardHTMLEmailTemplate(subject, html, 'Corresponding author status has been transferred.'),
        text,
        to: options.oldCorrespondingAuthorEmail,
        subject
    });
};

type ControlRequestSupersededOptions = {
    requesterEmail: string;
    newCorrespondingAuthorFullName: string;
    publicationVersionTitle: string;
};

export const controlRequestSuperseded = async (options: ControlRequestSupersededOptions): Promise<void> => {
    const subject = `${options.newCorrespondingAuthorFullName} has been approved as the new corresponding author.`;

    const html = `
                <p>${options.newCorrespondingAuthorFullName} is now the corresponding author for the following publication on Octopus:</p>
                <br>
                <p style="text-align: center"><strong><i>${options.publicationVersionTitle}</i></strong></p>
                <br>
                <p>Your request to take over corresponding authorship of this publication has been invalidated by this change. If you would still like to take over corresponding authorship, please discuss this with ${options.newCorrespondingAuthorFullName} or raise a new request.</p>
            </p>
            `;

    const text = `${options.newCorrespondingAuthorFullName} is now the corresponding author for the following publication on Octopus: ${options.publicationVersionTitle}. Your request to take over corresponding authorship of this publication has been invalidated by this change. If you would still like to take over corresponding authorship, please discuss this with ${options.newCorrespondingAuthorFullName} or raise a new request.`;

    await send({
        html: standardHTMLEmailTemplate(subject, html, 'Another author has taken over as corresponding author'),
        text,
        to: options.requesterEmail,
        subject
    });
};
