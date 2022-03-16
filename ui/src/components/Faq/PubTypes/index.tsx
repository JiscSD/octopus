import React from 'react';

const FaqPubTypes: React.FC = (): JSX.Element => (
    <div className="">
        <dl>
            <dt>A Problem:</dt>{' '}
            <dd>
                A Problem publication defines a research problem or question. You will need to explain what is known so
                far about the problem – rather like the ‘Introduction’ to a traditional paper.
            </dd>
            <dt>A Hypothesis/Rationale:</dt>{' '}
            <dd>
                A Hypothesis/Rationale publication sets out the theoretical basis for a potential solution, or partial
                solution, to the Problem it is linked to. In some fields a formal hypothesis is appropriate, and in some
                fields it will be more a description of an approach that might be taken.
            </dd>
            <dt>A Protocol/Method:</dt>{' '}
            <dd>
                A Protocol/Method publication describes in detail a way of testing a hypothesis, or carrying out a
                theoretical rationale. You can include links to sites such as protocols.io to give more detail of the
                method if that would be helpful to readers.
            </dd>
            <dt>Results/Data:</dt>{' '}
            <dd>
                A Results/Data publication comprises raw data or summarised results collected according to an existing
                published Protocol/Method. It should only describe the data or results themselves, without any analysis,
                along with details of the exact conditions under which the method was carried out – anything that might
                be needed for an analysis or interpretation of the results. You can include links to the raw data files.
            </dd>
            <dt>An Analysis:</dt>{' '}
            <dd>
                An Analysis publication describes manipulations of results to help conclusions be drawn from them. For
                example, thematic or statistical analysis.
            </dd>
            <dt>An Interpretation:</dt>{' '}
            <dd>An Interpretation publication describes conclusions drawn from an Analysis of results.</dd>
            <dt>A Real-world Application:</dt>{' '}
            <dd>
                An Application publication describes how findings might have (or have had) an impact in the real world.
                This might be through a practical or policy application, and would be the appropriate publication type
                for Case Studies.
            </dd>
            <dt>A (Peer) Review:</dt>{' '}
            <dd>
                A Review publication should be a carefully considered and constructive critique of an existing
                publication by someone else. Your review should help other readers assess the publication, and should be
                written in the same style as any other kind of publication (with relevant references). Authors may
                reversion publications in the light of reviews.
            </dd>
        </dl>
    </div>
);

export default FaqPubTypes;
