import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import * as I from 'interface';

const from = process.env.EMAIL_SENDER_ADDRESS;
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

export const standardHTMLEmailTemplate = (subject: string, html: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
    </head>
    <style>
        body {
            background-color: #f2f2f2;
            font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
            color: #333333;
        }
        h1 {
            font-size: 56px;
            font-weight: 300;
            margin: 0;
            padding: 0 0 32px 0;
        }
        h3 {
            font-size: 16px;
            font-weight: 300;
            margin: 0;
            padding: 0 0 8px 0;
        }
        p {
            font-size: 16px;
            font-weight: 300;
            margin: 0;
            line-height: 1.6;
        }
        a {
            color: #333333;
            text-decoration: underline;
        }
        .wrapper {
            max-width: 720px;
            padding: 16px 0;
            margin: auto;
        }
        .header {
            background-color: #296d8a;
            padding: 32px;
        }
        .header img {
            width: 40px;
            margin-right: 12px;
            display: inline-block;
        }
        .header h3 {
            vertical-align: text-bottom;
            display: inline-block;
            font-size: 20px;
            font-weight: bold;
            color: #fff;
        }
        .content {
            background-color: #ffffff;
            padding: 32px 32px 128px;
        }
        .footer {
            padding: 64px 0 32px;
        }
        .footer-logo, footer-content, .footer-links {
            vertical-align: top;
        }
        .footer-logo {
            display: inline-block;
            width: 17.5%;
        }
        .footer-logo img {
            width: 45px;
            margin-right: 10px;
        }
        .footer-content {
            display: inline-block;
            width: 55%;
        }
        .footer-links {
            display: inline-block;
            width: 25%;
        }
        .button {
            display: inline-block;
            color: #00619E;
            padding: 16px 64px;
            border: 1px solid #00619E;
            border-radius: 3px; 
            text-decoration: none;
        }
        .code {
            font-size: 32px;
            letter-spacing: 5px;
            text-align: center;
        }
    </style>
    <body>
        <div class="wrapper">
            <div class="header">
                <img 
                    src="https://science-octopus-publishing-images-prod.s3.eu-west-1.amazonaws.com/OCTOPUS_LOGO_ILLUSTRATION_WHITE_500PX.png"
                    style = "width: 40px;"
                >
                <h3>Octopus</h3>
            </div>
            <div class="content">
            ${html}
            </div>
            <div class="footer">
                <div class="footer-logo">
                    <a href="${baseURL}" style='text-decoration: none;'>
                        <img 
                            src="https://science-octopus-publishing-images-prod.s3.eu-west-1.amazonaws.com/OCTOPUS_LOGO_ILLUSTRATION_WHITE_500PX.png"
                            style = "width: 45px;"
                        >
                    </a>
                    <a href="https://www.jisc.ac.uk/" style='text-decoration: none;'>
                        <img 
                            src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg"
                            style = "width: 45px;"
                        >
                    </a>
                </div>
                <div class="footer-content">
                    <p style='margin-bottom: 8px;'>Octopus: the fast, free and fair way to share your research.</p>
                    <p>This service is delivered by Jisc in collaboration</p>
                    <p>with Octopus Publishing CIC.</p>
                </div>
                <div class="footer-links">
                    <p>
                        <a href="mailto:help@jisc.ac.uk" target="_blank" rel="noreferrer noopener">help@jisc.ac.uk</a>
                    </p>
                    <p>0300 300 2212</p>
                    <p>Support hours: Mon - Fri 09:00 – 17:00 (UK time)</p>
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

export const send = async (options: I.EmailSendOptions) => {
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
    publicationId: string | null;
    publicationTitle: string | null;
    code: string;
};

export const notifyCoAuthor = async (options: NotifyCoAuthor) => {
    const html = `
    <p>${options.userFirstName} ${options?.userLastName} has added you as an author of the following publication on Octopus:</p>
    <br>
    <p style="text-align: center;"><strong><i>${options.publicationTitle}</i></strong></p>
    <br>
    <p>To <strong>confirm your involvement</strong>, and see a preview of the publication, click the button below:</p> 
    <br>
    <p style="text-align: center;"><a class="button" href='${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publication=${options.publicationId}&approve=true'>I am an author</a></p>
    <br>
    <p>If you are <strong>not</strong> an author of this publication, please click the button below:</p>
    <br>
    <p style="text-align: center;"><a class="button" href='${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publication=${options.publicationId}&approve=false'>I am not an author</a></p>
    </br>
    <p>An Octopus user has provided this email address so that you can receive this message. We’ll use your contact details for this author validation process only, as described in our 
    <a href="${baseURL}/privacy">privacy policy</a>. If you select that you are not involved with the publication named above, your data will be deleted immediately. If you are involved, your data will not be retained 
    after the publication date.</p>
    `;

    const text = `You have been added as a co-author to the following publication: ${options.publicationTitle}. You were added by ${options.userFirstName} ${options?.userLastName}. To approve that you are the co-author, follow this link: ${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publication=${options.publicationId}&approve=true. If you are not the co-author, follow this link: ${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publication=${options.publicationId}&approve=false.`;

    await send({
        html: standardHTMLEmailTemplate('You’ve been added as a co-author on Octopus', html),
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

export const verificationCode = async (options: VerificationCode) => {
    const html = `
    <p>Hi ${options.userFirstName} ${options?.userLastName},</p>
    <br>
    <p>Welcome to Octopus!</p>
    <br>
    <p>To start publishing your research and reviewing the work of others, please verify your email address below.</p>
    <br>
    <p class="code">${options.code}</p>
    <br>
    <p>This email address will be used to deliver the Octopus service, as described in our <a href="${baseURL}/privacy">privacy policy</a>. You can update your 
    email at any time via your account page on the Octopus platform. If you no longer wish to have an account on Octopus, notify 
    us at <a href='mailto:help@jisc.ac.uk'>help@jisc.ac.uk</a>.</p>
    <br>
    <p>Your account was created using your <a href="https://orcid.org/">ORCID identifier</a>. By creating an account, you have given
    permission for us to use your ORCID credentials to log you into the Octopus platform, and to display information from your ORCID 
    account, including name, affiliation, and existing works, on your Octopus profile page. If any information on your profile appears 
    incorrect or out of date, please update it in ORCID.</p>
    `;

    const text = `Please enter the following code to verify your email address: ${options.code}`;

    await send({
        html: standardHTMLEmailTemplate('Verify your Octopus account', html),
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

export const newRedFlagAuthorNotification = async (options: NewRedFlagAuthorNotification) => {
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
    <p style="text-align: center;"><a class="button" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>Respond to red flag</a></p>
    <br>
    <p>The red flag feature is designed to encourage an open dialogue between the author(s) and their peers. Both parties can add comments, and view responses, via the publication page. Note that all comments are public. The submitter can also resolve a red flag following discussion.</p>
    <br>
    <p>We hope that the majority of red flags can be resolved, in some cases with a new version of the publication released. If you are unable to reach a resolution with the creator of the red flag, please escalate to the Octopus team via <a href='mailto:help@jisc.ac.uk'>help@jisc.ac.uk</a>.</p>
    `;

    const text = `Your publication '${options.publicationName}' has been red flagged by ${options.submitter}. Flag type: ${options.type}. Flag message: ${options.flagReason}.`;

    return send({
        html: standardHTMLEmailTemplate('Your publication has been red flagged', html),
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

export const newRedFlagCreatorNotification = async (options: NewRedFlagCreatorNotification) => {
    const html = `
    <p>Thank you for flagging a potential concern with <strong><i>${options.publicationName}</i></strong>. The submitting author has been notified, and has the option to respond to your message.</p>
    <br>
    <p style="text-align: center;"><a class="button" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>View red flag</a></p>
    <br>
    <p>The red flag feature is designed to encourage an open dialogue between the author(s) and their peers. Both parties can add comments, and view responses, via the publication page. Note that all 
    comments are public.</p>
    <br>
    <p>If you are happy to resolve a red flag following discussion with the author, you can do so on the publication page. We hope that the majority of red flags can be resolved, in some cases with a 
    new version of the publication released. If you are unable to reach a resolution with the author, please escalate to the Octopus team via <a href='mailto:help@jisc.ac.uk'>help@jisc.ac.uk</a>.</p>
    `;

    const text = `You have successfully red flagged this publication. You can view it here: ${baseURL}/publications/${options.publicationId}/flag/${options.flagId}`;

    return send({
        html: standardHTMLEmailTemplate('Red flag created', html),
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

export const updateRedFlagNotification = async (options: UpdateRedFlagNotification) => {
    const html = `
    <p>A new comment has been received against the following red flag.</p>
    <br>
    <p><strong>Publication:</strong> ${options.publicationName}</p>
    <br>
    <p><strong>Type:</strong> ${options.type}</p>
    <br>
    <p><strong>Submitter:</strong> ${options.submitter}</p>
    <br>
    <p style="text-align: center;"><a class="button" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>View red flag</a></p>
    <br>
    <p>The red flag feature is designed to encourage an open dialogue between the author(s) and their peers. Both parties can add comments, and view responses, 
    via the publication page. Note that all comments are public.</p>
    <br>
    <p>We hope that the majority of red flags can be resolved, in some cases with a new version of the publication released. If you are unable to reach a 
    resolution, please escalate to the Octopus team via <a href='mailto:help@jisc.ac.uk'>help@jisc.ac.uk</a>.</p>
    `;

    const text = `A new comment has been added against the red flag submitted by ${options.submitter}. Flag type: ${options.type}. You can view it here: ${baseURL}/publications/${options.publicationId}/flag/${options.flagId}`;

    return send({
        html: standardHTMLEmailTemplate('Red flag updated', html),
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

export const resolveRedFlagAuthorNotification = async (options: ResolveRedFlagAuthorNotification) => {
    const html = `
    <p>A red flag for <strong>${options.type}</strong> has been resolved for <strong><i>${options.publicationName}</i></strong>. The red flag 
    warning banner is no longer prominently displayed on the publication page.</p>
    <br>
    <p>For the sake of transparency, the history of the red flag and its full comment thread are retained on the platform and can 
    be viewed via the publication page. However, it is made clear where a flag is resolved rather than active.</p>
    <br>
    <p style="text-align: center;"><a class="button" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>View red flag</a></p>
    `;

    const text = `A red flag has been resolved for '${options.publicationName}'. Flag type: ${options.type}. You can view it here: ${baseURL}/publications/${options.publicationId}/flag/${options.flagId}`;

    return send({
        html: standardHTMLEmailTemplate('Red flag resolved', html),
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

export const resolveRedFlagCreatorNotification = async (options: ResolveRedFlagCreatorNotification) => {
    const html = `
    <p>Thank you for resolving the red flag you created for <strong><i>${options.publicationName}</i></strong>. The submitting 
    author has been notified, and the warning banner is no longer prominently displayed on the publication page.</p>
    <br>
    <p>For the sake of transparency, the history of the red flag and its full comment thread are retained on the platform and can 
    be viewed via the publication page. However, it is made clear where a flag is resolved rather than active.</p>
    <br>
    <p style="text-align: center;"><a class="button" href='${baseURL}/publications/${options.publicationId}/flag/${options.flagId}'>View red flag</a></p>
    `;

    const text = `Thank you for resolving the red flag you created for '${options.publicationName}'. You can view it here: ${baseURL}/publications/${options.publicationId}/flag/${options.flagId}`;

    return send({
        html: standardHTMLEmailTemplate('Red flag resolved', html),
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

export const notifyCoAuthorConfirmation = async (options: NotifyCoAuthorConfirmation) => {
    if (options.remainingConfirmationsCount) {
        // one or more confirmations left
        const html = `
           <p><strong>${options.coAuthor.firstName} ${
            options.coAuthor.lastName
        }</strong> has confirmed their involvement in <strong><i>${
            options.publication.title
        }</i></strong> and has confirmed that the draft is ready to publish.</p>
            <br>
            <p style="text-align: center;"><a class="button" href="${
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
            html: standardHTMLEmailTemplate('A co-author has approved your Octopus publication', html),
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
                <p style="text-align: center;"><a class="button" href="${options.publication.url}" target="_blank" rel="noreferrer noopener">View publication</a></p>
                <br>
                <p>Note that any changes to the draft publication at this stage will require co-authors to reapprove.</p>
            `;

    const text = `All co-authors have confirmed their involvement in '${options.publication.title}' and have confirmed that the draft is ready to publish. You are now ready to publish! You can view the publication here: ${options.publication.url} . Note that any changes to the draft publication at this stage will require co-authors to reapprove.`;

    await send({
        html: standardHTMLEmailTemplate('All co-authors have approved your Octopus publication', html),
        text,
        to: options.publication.authorEmail,
        subject: 'All co-authors have approved your Octopus publication'
    });
};
