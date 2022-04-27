import * as NextDocument from 'next/document';

const AppDocument = () => (
    <NextDocument.Html lang="en">
        <NextDocument.Head>
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

            <link rel="icon" href="/meta/favicon.ico" />
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
        </NextDocument.Head>
        <body className="overflow-x-hidden font-inter antialiased">
            <NextDocument.Main />
            <NextDocument.NextScript />
        </body>
    </NextDocument.Html>
);

export default AppDocument;
