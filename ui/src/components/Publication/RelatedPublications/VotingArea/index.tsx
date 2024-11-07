import React, { useState } from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as I from '@/interfaces';
import * as Stores from '@/stores';
import * as Types from '@/types';

type Props = {
    suggestedFromPublication: {
        id: string;
        title: string;
    };
    crosslink: I.Crosslink;
    vote: boolean | null;
};

const VotingArea: React.FC<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);
    const [userHasUpvoted, setUserHasUpvoted] = useState<boolean>(props.vote === true);
    const [userHasDownVoted, setUserHasDownVoted] = useState<boolean>(props.vote === false);
    const [upvotes, setUpvotes] = useState<number>(props.crosslink.upvotes);
    const [downvotes, setDownvotes] = useState<number>(props.crosslink.downvotes);
    const paragraphClasses = 'mt-4 text-sm text-white-100 dark:text-grey-50';

    const handleVote = async (isUpVote: boolean) => {
        const resettingUpvote = isUpVote && userHasUpvoted;
        const resettingDownVote = !isUpVote && userHasDownVoted;
        const resettingVote = resettingUpvote || resettingDownVote;
        const neutralToVote = !userHasUpvoted && !userHasDownVoted;
        const downToUp = isUpVote && userHasDownVoted;
        const upToDown = !isUpVote && userHasUpvoted;
        const changingVote = neutralToVote || downToUp || upToDown;

        if (resettingVote) {
            if (resettingUpvote) {
                setUserHasUpvoted(false);
                setUpvotes((prev) => prev - 1);
            } else if (resettingDownVote) {
                setUserHasDownVoted(false);
                setDownvotes((prev) => prev - 1);
            }
            try {
                await api.destroy(`/crosslinks/${props.crosslink.id}/vote`, user?.token);
            } catch (err) {
                console.log(err);
            } finally {
                return;
            }
        }
        if (changingVote) {
            if (isUpVote) {
                setUserHasUpvoted(true);
                setUpvotes((prev) => prev + 1);
                if (downToUp) {
                    setUserHasDownVoted(false);
                    setDownvotes((prev) => prev - 1);
                }
            } else {
                setUserHasDownVoted(true);
                setDownvotes((prev) => prev + 1);
                if (upToDown) {
                    setUserHasUpvoted(false);
                    setUpvotes((prev) => prev - 1);
                }
            }
            try {
                await api.put(`/crosslinks/${props.crosslink.id}/vote`, { vote: isUpVote }, user?.token);
            } catch (err) {
                console.log(err);
            } finally {
                return;
            }
        }
    };

    return (
        <Components.Alert severity="INFO" className="mb-4">
            <p className="text-sm font-medium text-white-100 dark:text-white-50">
                You have navigated to this publication via a link from “{props.suggestedFromPublication.title}”.
            </p>
            <p className={paragraphClasses}>
                This link was suggested by another user as they felt that the two publications are related.
            </p>
            <p className={paragraphClasses}>
                {!user ? 'Log in to' : 'Please'} use the voting options to record whether or not you feel that these two
                publications should be linked.
            </p>
            <div className="mt-4 flex gap-4">
                <button
                    onClick={() => handleVote(true)}
                    title="Upvote"
                    className={`bg-white-50 flex items-center rounded disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed ${userHasUpvoted ? 'text-green-700 font-medium shadow-md shadow-green-400' : 'text-grey-600'}`}
                    disabled={!user}
                >
                    <span className="p-2">
                        <OutlineIcons.HandThumbUpIcon className="w-4 stroke-2" />
                    </span>
                    <span className="p-2 border-l border-grey-200 min-w-8">{upvotes}</span>
                </button>
                <button
                    onClick={() => handleVote(false)}
                    title="Downvote"
                    className={`bg-white-50 flex items-center rounded disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed ${userHasDownVoted ? 'text-red-800 font-medium shadow-md shadow-red-500' : 'text-grey-600'}`}
                    disabled={!user}
                >
                    <span className="p-2">
                        <OutlineIcons.HandThumbDownIcon className="w-4 stroke-2" />
                    </span>
                    <span className="p-2 border-l border-grey-200 min-w-8">{downvotes}</span>
                </button>
            </div>
            <p className={paragraphClasses}>
                <a
                    href={Config.urls.viewPublication.path + '/' + props.suggestedFromPublication.id}
                    className="underline underline-offset-4"
                >
                    Return to previous publication
                </a>
            </p>
        </Components.Alert>
    );
};

export default VotingArea;
