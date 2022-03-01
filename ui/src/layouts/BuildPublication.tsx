import React from 'react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    steps: { title: string; subTitle: string }[];
    currentStep: number;
    setStep: any; // need to know the type of number or prev state
    publication: any; // update to n interface soon
    children: React.ReactNode;
};

const BuildPublication: React.FC<Props> = (props) => {
    const prev = () => {
        props.setStep((prevState: number) => prevState - 1);
    };

    const next = () => {
        props.setStep((prevState: number) => prevState + 1);
    };

    const publish = () => {
        alert('Please confirm etc...');
    };

    const saveExit = () => {
        alert('save & exit etc...');
    };

    return (
        <div className="dark:bg-grey-800">
            <Components.Header fixed={true} />
            <main className="container mx-auto grid min-h-screen grid-cols-12 dark:bg-yellow-800 lg:pt-20">
                <section className="col-span-12 p-8 dark:bg-blue-800 lg:col-span-9">
                    <div className="">
                        <div>{Object.values(props.steps)[props.currentStep].subTitle}</div>
                        <div>{props.children}</div>
                    </div>
                    <div>
                        <button onClick={saveExit}>Save and exit</button>
                        <div>
                            <button disabled={props.currentStep <= 0} onClick={prev} className="disabled:text-pink-200">
                                Previous
                            </button>
                            {props.currentStep < props.steps.length - 1 && (
                                <button
                                    disabled={props.currentStep >= props.steps.length - 1}
                                    onClick={next}
                                    className="disabled:text-pink-200"
                                >
                                    Next
                                </button>
                            )}
                            {props.currentStep === props.steps.length - 1 && (
                                <button onClick={publish} className="bg-pink-400">
                                    Publish
                                </button>
                            )}
                        </div>
                    </div>
                </section>
                <aside className="hidden pt-8 pl-12 dark:bg-pink-800 lg:col-span-3 lg:block">
                    <h2>steps</h2>
                    <ul>
                        {props.steps.map((step, index) => (
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
