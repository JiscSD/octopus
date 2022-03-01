import React from 'react';

import * as Components from '@components';

type Props = {
    currentStep: number;
    setStep: any; // need to know the type of number or prev state
    publication: any; // update to n interface soon
    children: React.ReactNode;
};

const steps = [
    {
        title: 'Some step'
    },
    {
        title: 'another step'
    },
    {
        title: 'another step'
    },
    {
        title: 'another step'
    }
];

const BuildPublication: React.FC<Props> = (props) => {
    const prev = () => {
        props.setStep((prevState: number) => prevState - 1);
    };

    const next = () => {
        props.setStep((prevState: number) => prevState + 1);
    };

    return (
        <div className="dark:bg-grey-800">
            <Components.Header fixed={true} />
            <main className="container mx-auto grid min-h-screen grid-cols-12 dark:bg-yellow-800 lg:pt-20">
                <section className="col-span-12 p-8 dark:bg-blue-800 lg:col-span-9">
                    <div className="">{props.children}</div>
                    <div>
                        <button>Save and exit</button>
                        <div>
                            <button disabled={props.currentStep <= 0} onClick={prev} className="disabled:text-pink-200">
                                Previous
                            </button>
                            <button
                                disabled={props.currentStep >= steps.length - 1}
                                onClick={next}
                                className="disabled:text-pink-200"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>
                <aside className="hidden pt-8 pl-12 dark:bg-pink-800 lg:col-span-3 lg:block">
                    <h2>steps</h2>
                    <ul>
                        {steps.map((step, index) => (
                            <li key={step.title} className={`${index === props.currentStep ? 'bg-pink-300' : ''}`}>
                                <button onClick={() => props.setStep(index)}>{step.title}</button>
                            </li>
                        ))}
                    </ul>
                </aside>
            </main>
        </div>
    );
};

export default BuildPublication;
