import * as NextDocument from 'next/document';

const AppDocument = () => (
    <NextDocument.Html lang="en">
        <NextDocument.Head>
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="robots" content="noindex, nofollow" />

            <link rel="apple-touch-icon" sizes="180x180" href="/meta/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/meta/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/meta/favicon-16x16.png" />
            <link rel="manifest" href="/meta/site.webmanifest" />
            <link rel="mask-icon" href="/meta/safari-pinned-tab.svg" color="#348bb2" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="theme-color" content="#ffffff" />

            <meta property="og:url" content="https://octopus.ac" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Octopus" />
            <meta
                property="og:description"
                content="A new way to publish your scientific work that's fast, free and fair."
            />
            <meta property="og:image" content="/meta/og-image.jpg" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="https://octopus.ac" />
            <meta property="twitter:url" content="https://twitter.com/science_octopus" />
            <meta name="twitter:title" content="Octopus" />
            <meta
                name="twitter:description"
                content="A new way to publish your scientific work that's fast, free and fair."
            />
            <meta name="twitter:image" content="/meta/og-image.jpg"></meta>

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            />
            <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </NextDocument.Head>
        <body className="overflow-x-hidden font-inter antialiased">
            <NextDocument.Main />
            <NextDocument.NextScript />
        </body>
    </NextDocument.Html>
);

export default AppDocument;
