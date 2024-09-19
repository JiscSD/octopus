import React from 'react';
import parse from 'html-react-parser';

import * as Config from '@/config';

type Props = {
    content: string;
};

const ParseHTML: React.FC<Props> = (props): React.ReactElement => {
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

    return <article className={Config.values.HTMLStyles}>{parse(props.content)}</article>;
};

export default ParseHTML;
