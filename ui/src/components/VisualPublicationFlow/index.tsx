import React from 'react';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/24/outline';

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
            className={`relative mx-20 ${props.position === 'LEFT' ? 'lg:ml-4 lg:pl-12' : 'lg:mr-4 lg:pr-12'} ${
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
                <h3 className="mb-2 font-montserrat text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:text-lg">
                    {props.title}
                </h3>
                <p className="text-grey-800 transition-colors duration-500 dark:text-grey-50">{props.content}</p>
            </Framer.motion.div>
            <Framer.motion.span
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.75 }}
                className={`absolute top-6 z-10 hidden rounded-full bg-teal-500 p-1 lg:block ${
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
    <section className="relative mt-20 grid gap-y-12 lg:grid-cols-2 lg:gap-y-16">
        <span className="absolute -left-3 top-0 z-10 h-full w-1 -translate-x-1/2 rounded bg-teal-500 lg:left-1/2" />
        <GridItem
            className="row-start-1 row-end-1 !pt-0 lg:col-start-1 lg:col-end-2"
            title="Research Problem"
            content="A neatly defined scientific problem."
            icon={<OutlineIcons.BeakerIcon className="h-5 w-5 text-white-50" />}
            position="RIGHT"
        />
        <GridItem
            className="row-start-2 row-end-2 lg:col-start-2 lg:col-end-2"
            title="Rationale / Hypothesis"
            content="An original hypothesis relating to an existing published Research Problem or the rationale for how you think the Research Problem could be addressed."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white-50" />}
            position="LEFT"
        />
        <GridItem
            className="row-start-3 row-end-3 lg:col-start-1 lg:col-end-2"
            title="Methods"
            content="A practical method of testing an existing published Rationale/Hypothesis."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white-50" />}
            position="RIGHT"
        />
        <GridItem
            className="row-start-4 row-end-4 lg:col-start-2 lg:col-end-2"
            title="Results / Sources"
            content="Results can be raw data or summarised results collected according to an existing published Method (can be linked to a data repository). Sources refers to any existing evidence or material that are the object(s) of study for the research."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white-50" />}
            position="LEFT"
        />
        <GridItem
            className="row-start-5 row-end-5 lg:col-start-1 lg:col-end-2"
            title="Analysis"
            content="A statistical or thematic analysis of existing published Results."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white-50" />}
            position="RIGHT"
        />
        <GridItem
            className="row-start-6 row-end-6 lg:col-start-2 lg:col-end-2"
            title="Interpretation"
            content="A discussion around an existing published Analysis or several Analyses."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white-50" />}
            position="LEFT"
        />
        <GridItem
            className="row-start-7 row-end-7 lg:col-start-1 lg:col-end-2"
            title="Applications / Implications"
            content="Applications or implications arising from an existing published Interpretation."
            icon={<OutlineIcons.LinkIcon className="h-5 w-5 text-white-50" />}
            position="RIGHT"
        />
    </section>
);

export default VisualPublicationFlow;
