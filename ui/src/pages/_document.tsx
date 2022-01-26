import { Html, Head, Main, NextScript } from 'next/document';

const AppDocument = () => {
    return (
        <Html lang="en" className="scroll-smooth bg-teal-50 motion-reduce:scroll-auto dark:bg-grey-800">
            <Head>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

                <link rel="icon" href="/meta/favicon.ico" />
                {/* <link rel="apple-touch-icon" sizes="180x180" href="/meta/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/meta/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/meta/favicon-16x16.png" />
                <link rel="manifest" href="/meta/site.webmanifest" /> */}
                <link rel="mask-icon" href="/meta/safari-pinned-tab.svg" color="#34a4b1" />
                <meta name="msapplication-TileColor" content="#34a4b1" />
                <meta name="theme-color" content="#34a4b1"></meta>

                {/* <meta property="og:url" content="" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="" />
                <meta property="og:description" content="" />
                <meta property="og:image" content="/meta/og-image.jpg" /> */}

                {/* <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="" />
                <meta property="twitter:url" content="" />
                <meta name="twitter:title" content="" />
                <meta name="twitter:description" content="" />
                <meta name="twitter:image" content="/meta/og-image.jpg"></meta> */}

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default AppDocument;
