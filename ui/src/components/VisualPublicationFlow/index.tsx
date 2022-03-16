import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Helpers from '@helpers';

type GrowthLineProps = {
    height: number;
};
const GrowthLine: React.FC<GrowthLineProps> = (props) => (
    <span
        style={{ height: `${props.height}%` }}
        className="absolute top-0 left-1/2 z-20 h-0 w-1 -translate-x-1/2 rounded bg-teal-500 transition-all duration-500"
    >
        <OutlineIcons.LinkIcon className="absolute bottom-0 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-teal-500 p-2 text-white" />
    </span>
);

type GridItemProps = {
    className: string;
    title: string;
    content: string;
    children?: React.ReactElement[];
};

// eslint-disable-next-line react/display-name
const GridItem = React.forwardRef((props: GridItemProps, ref: any) => (
    <div ref={ref} className={`py-16 ${props.className}`}>
        <div className="rounded-2xl border-2 border-dashed border-teal-500 p-2 lg:p-6">
            <h3 className="mb-2 font-montserrat text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-white lg:text-lg">
                {props.title}
            </h3>
            <p className="text-grey-800 transition-colors duration-500 dark:text-grey-50">{props.content}</p>
            {props.children}
        </div>
    </div>
));

const VisualPublicationFlow: React.FC = (): React.ReactElement => {
    const gridItemOneRef = React.useRef<HTMLElement>();
    const gridItemTwoRef = React.useRef<HTMLElement>();
    const gridItemThreeRef = React.useRef<HTMLElement>();
    const gridItemFourRef = React.useRef<HTMLElement>();
    const gridItemFiveRef = React.useRef<HTMLElement>();
    const gridItemSixRef = React.useRef<HTMLElement>();
    const gridItemSevenRef = React.useRef<HTMLElement>();
    const gridItemEightRef = React.useRef<HTMLElement>();

    const [height, setHeight] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            if (
                gridItemOneRef.current &&
                gridItemTwoRef.current &&
                gridItemThreeRef.current &&
                gridItemFourRef.current &&
                gridItemFiveRef.current &&
                gridItemSixRef.current &&
                gridItemSevenRef.current &&
                gridItemEightRef.current
            ) {
                if (Helpers.elementInViewport(gridItemOneRef.current)) {
                    setHeight(4);
                } else if (Helpers.elementInViewport(gridItemTwoRef.current)) {
                    setHeight(18);
                } else if (Helpers.elementInViewport(gridItemThreeRef.current)) {
                    setHeight(31);
                } else if (Helpers.elementInViewport(gridItemFourRef.current)) {
                    setHeight(45);
                } else if (Helpers.elementInViewport(gridItemFiveRef.current)) {
                    setHeight(59);
                } else if (Helpers.elementInViewport(gridItemSixRef.current)) {
                    setHeight(72);
                } else if (Helpers.elementInViewport(gridItemSevenRef.current)) {
                    setHeight(85);
                } else if (Helpers.elementInViewport(gridItemEightRef.current)) {
                    setHeight(98);
                } else {
                    setHeight(100);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="relative grid grid-cols-2 gap-x-4 lg:gap-x-24">
            <GrowthLine height={height} />
            <span className="absolute top-0 left-1/2 z-10 h-full w-1 -translate-x-1/2 rounded bg-grey-100" />
            <GridItem
                ref={gridItemOneRef}
                className="col-start-1 col-end-2 row-start-1 row-end-1 !pt-0"
                title="Research Problem"
                content="A neatly defined scientific problem."
            />
            <GridItem
                ref={gridItemTwoRef}
                className="col-start-2 col-end-2 row-start-2 row-end-2"
                title="Hypothesis/Rationale"
                content="An original hypothesis relating to an existing published Problem or the rationale for how you think the Problem could be addressed."
            />
            <GridItem
                ref={gridItemThreeRef}
                className="col-start-1 col-end-2 row-start-3 row-end-3"
                title="Methods/Protocols"
                content="A practical method of testing an existing published Hypothesis."
            />
            <GridItem
                ref={gridItemFourRef}
                className="col-start-2 col-end-2 row-start-4 row-end-4"
                title="Data/Results"
                content="Raw data or summarised results collected according to an existing published Method (can be linked to a data repository)."
            />
            <GridItem
                ref={gridItemFiveRef}
                className="col-start-1 col-end-2 row-start-5 row-end-5"
                title="Analysis"
                content="A statistical or thematic analysis of existing published Data or Results."
            />
            <GridItem
                ref={gridItemSixRef}
                className="col-start-2 col-end-2 row-start-6 row-end-6"
                title="Interpretation"
                content="A discussion around an existing published Analysis."
            />
            <GridItem
                ref={gridItemSevenRef}
                className="col-start-1 col-end-2 row-start-7 row-end-7"
                title="Real-world Application"
                content="Real world applications arising from an existing published Interpretation."
            />
            <GridItem
                ref={gridItemEightRef}
                className="col-start-2 col-end-2 row-start-8 row-end-8 !pb-0"
                title="Peer Review"
                content="A considered, detailed review of any of the above kinds of publication."
            />
        </section>
    );
};

export default VisualPublicationFlow;
