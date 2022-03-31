import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Types from '@types';

type Props = {
    to: Interfaces.LinkTo[];
    from: Interfaces.LinkFrom[];
};

const RenderLinks: React.FC<Props> = (props): React.ReactElement => {
    const cache: Types.PublicationType[] = [];
    const links: { id: string; ref: Interfaces.PublicationRef; direction: 'LEFT' | 'RIGHT' }[] = [];

    props.to.map((item) => links.push({ id: item.id, ref: item.publicationToRef, direction: 'LEFT' }));
    props.from.map((item) => links.push({ id: item.id, ref: item.publicationFromRef, direction: 'RIGHT' }));

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {!!props.to && (
                <Components.List ordered={true} className="">
                    {props.to.map((link) => {
                        let show = false;
                        if (!cache.includes(link.publicationToRef.type)) {
                            cache.push(link.publicationToRef.type);
                            show = true;
                        }
                        return (
                            <Components.ListItem key={link.id} className="flex items-start font-semibold leading-3">
                                <Components.PublicationLink
                                    publicationRef={link.publicationToRef}
                                    showType={show}
                                    direction="LEFT"
                                />
                            </Components.ListItem>
                        );
                    })}
                </Components.List>
            )}

            {!!props.from && (
                <Components.List ordered={true} className="">
                    {props.from.map((link) => {
                        let show = false;
                        if (!cache.includes(link.publicationFromRef.type)) {
                            cache.push(link.publicationFromRef.type);
                            show = true;
                        }
                        return (
                            <Components.ListItem key={link.id} className="flex items-start font-semibold leading-3">
                                <Components.PublicationLink
                                    publicationRef={link.publicationFromRef}
                                    showType={show}
                                    direction="RIGHT"
                                />
                            </Components.ListItem>
                        );
                    })}
                </Components.List>
            )}
        </div>
    );
};

export default RenderLinks;
