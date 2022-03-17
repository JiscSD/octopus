import React from 'react';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';

type GridItemProps = {
    title: string;
    content: string;
    icon: React.ReactElement;
    position: 'LEFT' | 'RIGHT';
    className: string;
};

const GridItem: React.FC<GridItemProps> = (props): React.ReactElement => {
    const varients = React.useMemo(() => {
        return props.position === 'LEFT' ? { x: -40 } : { x: 40 };
    }, [props.position]);

    return (
        <div
            className={`relative ${props.position === 'LEFT' ? 'lg:ml-4 lg:pl-12' : 'lg:mr-4 lg:pr-12'} ${
                props.className ?? ''
            }`}
        >
            <Framer.motion.div
                initial={{ opacity: 0, ...varients }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 75, delay: 0.5 }}
                className="rounded-2xl border-2 border-dashed border-teal-500 p-2 lg:p-6"
            >
                <h3 className="mb-2 font-montserrat text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-white lg:text-lg">
                    {props.title}
                </h3>
                <p className="text-grey-800 transition-colors duration-500 dark:text-grey-50">{props.content}</p>
            </Framer.motion.div>
            <Framer.motion.span
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.75 }}
                className={`absolute top-6 hidden rounded-full bg-teal-500 p-1 lg:block ${
                    props.position === 'LEFT' ? '-left-0' : '-right-0'
                }`}
                title={`${props.title} link`}
            >
                {props.icon}
                <span
                    className={`absolute top-1/2 -z-10 h-1 w-6 -translate-y-1/2 bg-teal-500 ${
                        props.position === 'LEFT' ? '-left-4' : '-right-4'
                    }`}
                />
            </Framer.motion.span>
        </div>
    );
};

const VisualPublicationFlow: React.FC = (): React.ReactElement => (
    <section className="relative grid gap-y-12 lg:grid-cols-2 lg:gap-y-16">
        <span className="absolute top-0 -left-3 z-10 h-full w-1 -translate-x-1/2 rounded bg-teal-500 lg:left-1/2" />
        <GridItem
            className="row-start-1 row-end-1 !pt-0 lg:col-start-1 lg:col-end-2"
            title="Research Problem"
            content="A neatly defined scientific problem."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white" />}
            position="RIGHT"
        />
        <GridItem
            className="row-start-2 row-end-2 lg:col-start-2 lg:col-end-2"
            title="Hypothesis/Rationale"
            content="An original hypothesis relating to an existing published Problem or the rationale for how you think the Problem could be addressed."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white" />}
            position="LEFT"
        />
        <GridItem
            className="row-start-3 row-end-3 lg:col-start-1 lg:col-end-2"
            title="Methods/Protocols"
            content="A practical method of testing an existing published Hypothesis."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white" />}
            position="RIGHT"
        />
        <GridItem
            className="row-start-4 row-end-4 lg:col-start-2 lg:col-end-2"
            title="Data/Results"
            content="Raw data or summarised results collected according to an existing published Method (can be linked to a data repository)."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white" />}
            position="LEFT"
        />
        <GridItem
            className="row-start-5 row-end-5 lg:col-start-1 lg:col-end-2"
            title="Analysis"
            content="A statistical or thematic analysis of existing published Data or Results."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white" />}
            position="RIGHT"
        />
        <GridItem
            className="row-start-6 row-end-6 lg:col-start-2 lg:col-end-2"
            title="Interpretation"
            content="A discussion around an existing published Analysis."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white" />}
            position="LEFT"
        />
        <GridItem
            className="row-start-7 row-end-7 lg:col-start-1 lg:col-end-2"
            title="Real-world Application"
            content="Real world applications arising from an existing published Interpretation."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white" />}
            position="RIGHT"
        />
        <GridItem
            className="row-start-8 row-end-8 !pb-0 lg:col-start-2 lg:col-end-2"
            title="Peer Review"
            content="A considered, detailed review of any of the above kinds of publication."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white" />}
            position="LEFT"
        />
    </section>
);

export default VisualPublicationFlow;
