import React from 'react';
import parse from 'html-react-parser';

type Props = {
    content: string;
};

const ParseHTML: React.FC<Props> = (props): JSX.Element => {
    /**
     * @description Sets the CSS rules for markdown or html content
     * @see https://tailwindcss.com/docs/typography-plugin
     * @see https://www.npmjs.com/package/html-react-parser
     *
     * Content Order:
     * - Global
     * - Headings
     * - Lead
     * - H1
     * - H2
     * - H3
     * - H4
     * - P
     * - A
     * - Blockquote
     * - Figure
     * - Figcaptions
     * - Strong
     * - Em
     * - Code
     * - Pre
     * - Ol
     * - Ul
     * - Li
     * - Table
     * - Thead
     * - Tr
     * - Th
     * - Td
     * - Img
     * - Video
     * - Hr
     */

    return (
        <article
            className={`
            prose
            lg:max-w-7xl
            text-grey-800 dark:text-grey-100
            transition-colors
            duration-500

            prose-headings:text-teal-700 dark:prose-headings:text-teal-400

            prose-a:text-grey-800 dark:prose-a:text-white
            prose-a:underline
            prose-a:underline-offset-1
            prose-a:decoration-teal-500
            prose-a:decoration-2
            prose-a:outline-none
            focus:prose-a:bg-yellow-300
            dark:focus:prose-a:text-grey-800

            prose-blockquote:text-grey-600 dark:prose-blockquote:text-grey-300
            prose-blockquote:border-teal-500

            prose-strong:text-grey-800 dark:prose-strong:text-teal-300

            `}
        >
            {parse(props.content)}
        </article>
    );
};

export default ParseHTML;
