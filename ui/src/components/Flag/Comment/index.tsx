import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    flagComment: Interfaces.FlagComment;
};

const Comment: React.FC<Props> = (props): React.ReactElement => (
    <div className="grid grid-cols-12 gap-4 border-b border-dashed border-teal-400/25 py-8 lg:gap-y-1">
        <Components.Link
            href={`${Config.urls.viewUser.path}/${props.flagComment.user.id}`}
            ariaLabel={`View user profile for ${props.flagComment.user.firstName} ${props.flagComment.user.lastName}`}
            title={`View user profile for ${props.flagComment.user.firstName} ${props.flagComment.user.lastName}`}
            className="group col-span-12 w-fit space-y-2 lg:col-span-2"
        >
            <Components.Avatar user={props.flagComment.user} />
            <span className="block text-xs text-grey-500 transition-colors duration-500 group-hover:underline dark:text-white-100">
                {props.flagComment.user.firstName} {props.flagComment.user.lastName}
            </span>
            <span className="block text-xs text-grey-500 transition-colors duration-500 group-hover:underline dark:text-white-100">
                Posted: {Helpers.formatDate(props.flagComment.createdAt)}
            </span>
        </Components.Link>
        <div className="col-span-12 lg:col-span-8">
            <p className="text-grey-700 transition-colors duration-500 dark:text-white-50">
                {props.flagComment.comment}
            </p>
        </div>
    </div>
);

export default Comment;
