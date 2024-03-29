import * as Types from '@/types';
import * as Helpers from '@/helpers';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { useMemo } from 'react';

type Props = Pick<Types.BlogFields, 'title' | 'author' | 'content' | 'publishedDate'>;

const BlogCard: React.FC<Props> = (props) => {
    const shortBlogText = useMemo(() => {
        const text = documentToPlainTextString(props.content).trim();
        return text.length > 250 ? `${text.slice(0, 250).trim()}...` : text;
    }, [props.content]);

    return (
        <div className="blog-card flex h-full flex-col gap-4 rounded-md p-4 shadow transition-colors hover:bg-grey-50 dark:bg-grey-700 dark:hover:bg-grey-600 xl:p-6">
            <h3 className="blog-card-title font-montserrat text-lg font-bold leading-snug text-grey-900 transition-colors dark:text-white-50 2xl:text-xl">
                {props.title}
            </h3>
            <div className="flex h-full flex-col justify-between gap-6">
                <div className="blog-card-text text-sm text-grey-800 transition-colors dark:text-white-50 lg:text-base">
                    {shortBlogText}
                </div>
                <p className="blog-card-footer text-xs font-medium tracking-wide text-grey-800 transition-colors dark:text-grey-100">
                    By {props.author} | <time suppressHydrationWarning>{Helpers.formatDate(props.publishedDate)}</time>
                </p>
            </div>
        </div>
    );
};

export default BlogCard;
