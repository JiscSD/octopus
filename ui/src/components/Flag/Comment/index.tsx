import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';

type Props = {
    flagComment: Interfaces.FlagComment;
};

const Comment: React.FC<Props> = (props): React.ReactElement => (
    <div className="grid grid-cols-12">
        <div className="col-span-2">
            <Components.Avatar user={props.flagComment.user} />
            <span className="text-xs text-grey-500">
                {props.flagComment.user.firstName} {props.flagComment.user.lastName}
            </span>
        </div>
        <div className="col-span-10">
            <p>{props.flagComment.comment}</p>
        </div>
    </div>
);

export default Comment;
