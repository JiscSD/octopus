import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import * as I from 'interface';

let from;
let mailConfig;
let baseURL;

const ses = new aws.SES({
    region: 'eu-west-1'
});

switch (process.env.STAGE) {
    case 'local':
        mailConfig = {
            host: '0.0.0.0',
            port: 1025
        };
        from = 'no-reply@local.ac';
        baseURL = 'https://localhost:3001';
        break;
    case 'prod':
        mailConfig = {
            SES: { ses, aws }
        };
        from = 'no-reply@octopus.ac';
        baseURL = 'https://octopus.ac';
        break;
    default:
        mailConfig = {
            SES: { ses, aws }
        };
        from = `no-reply@${process.env.STAGE}.octopus.ac`;
        baseURL = `https://${process.env.STAGE}.octopus.ac`;
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
            background-color: #ffffff;
            padding: 32px;
        }
        .header img {
            width: 40px;
            display: inline-block;
        }
        .header h3 {
            height: 20px;
            vertical-align: text-bottom;
            display: inline-block;
            padding-bottom: 12px;
            padding-left: 12px;
        }
        .content {
            background-color: #ffffff;
            padding: 32px 32px 128px;
            text-align: center;
        }
        .footer {
            padding: 64px 0 32px;
        }
        .footer-logo, footer-content, .footer-links {
            vertical-align: top;
        }
        .footer-logo {
            display: inline-block;
            width: 20%;
        }
        .footer-logo img {
            width: 95px;
        }
        .footer-content {
            display: inline-block;
            width: 50%;
        }
        .footer-links {
            display: inline-block;
            width: 28%;
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
        }
    </style>
    <body>
        <div class="wrapper">
            <div class="header">
                <img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg">
                <h3>Octopus</h3>
            </div>
            <div class="content">
            ${html}
            </div>
            <div class="footer">
                <div class="footer-logo">
                    <img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg">
                </div>
                <div class="footer-content">
                    <h3>Octopus</h3>
                    <p>Vision statement. We’re a membership</p>
                    <p>organisation, providing digital solutions for</p>
                    <p>UK education and research.</p>
                    <br>
                    <p>
                        <a href="https://www.jisc.ac.uk" target="_blank" rel="noreferrer noopener">Jisc.ac.uk</a>
                    </p>
                </div>
                <div class="footer-links">
                    <h3>Contact</h3>
                    <p>
                        <a href="mailto:help@jisc.ac.uk" target="_blank" rel="noreferrer noopener">help@jisc.ac.uk</a>
                    </p>
                    <p>0300 300 2212</p>
                    <p>07:00 - 12 midnight</p>
                    <p>(Mon - Fri)</p>
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
    userLastName: string;
    coAuthor: string;
    publicationId: string;
    publicationTitle: string;
    code: string;
};

export const notifyCoAuthor = async (options: NotifyCoAuthor) => {
    const html = `
    <p>${options.userFirstName} ${options.userLastName} has added you as an author of the following publication on Octopus:</p>
    <br>
    <p><strong><i>${options.publicationTitle}</i></strong></p>
    <br>
    <p>To <strong>confirm</strong> your involvement, and see a preview of the publication, click the link below:</p> 
    <br>
    <p><a class="button" href='${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publication=${options.publicationId}&approve=true'>I am a co-author</a></p>
    <br>
    <p>If you are <strong>not</strong> an author of this publication, please click the link below:</p>
    <br>
    <p><a class="button" href='${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publication=${options.publicationId}&approve=false'>I am not the co-author</a></p>
    </br>
    <p>An Octopus user has provided this email address so that you can receive this message. We’ll use your contact details for this author validation process only, as described in our 
    privacy policy. If you select that you are not involved with the publication named above, your data will be deleted immediately. If you are involved, your data will not be retained 
    after the publication date.</p>
    `;

    const text = `You have been added as a co-author to the following publication: ${options.publicationTitle}. You were added by ${options.userFirstName} ${options.userLastName}. To approve that you are the co-author, follow this link: ${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publication=${options.publicationId}&approve=true. If you are not the co-author, follow this link: ${baseURL}/author-link?email=${options.coAuthor}&code=${options.code}&publication=${options.publicationId}&approve=false.`;

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
    name: string;
};

export const verificationCode = async (options: VerificationCode) => {
    const html = `
    <p>Hi ${options.name}</p>
    <br>
    <p>Welcome to Octopus!</p>
    <br>
    <p>To start publishing your research and reviewing the work of others, please verify your email address below.</p>
    <br>
    <p class="code">${options.code}</p>
    <br>
    <p>Your account was created using your ORCID identifier. Information from your ORCID account, including name, affiliation, 
    and existing works, will be displayed on your Octopus profile page. If any information on your profile appears incorrect 
    or out of date, please update your ORCID account.</p>
    <br>
    <p>This email address will be used to deliver the Octopus service, as described in our privacy policy. You can update your 
    email at any time via your account page on the Octopus platform. If you no longer wish to have an account on Octopus, notify 
    us at</p><a href='mailto:help@jisc.ac.uk'>help@jisc.ac.uk</a>.
    `;

    const text = `Please enter the following code to verify your email address: ${options.code}`;

    await send({
        html: standardHTMLEmailTemplate('Verify your Octopus account', html),
        text,
        to: options.to,
        subject: 'Verify your Octopus account'
    });
};
