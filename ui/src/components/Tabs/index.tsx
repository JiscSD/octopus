import React from 'react';

type Props = {
    tabHead: string[];
    tabBody: React.ReactElement[];
};

const Tabs: React.FC<Props> = (props): React.ReactElement => {
    const [current, setCurrent] = React.useState(0);

    return (
        <div className="">
            <header className="">
                <nav className="">
                    <ul className="flex justify-around">
                        {props.tabHead.map((head, index) => (
                            <li key={head}>
                                <button
                                    onClick={() => setCurrent(index)}
                                    className={`border-b-2 border-transparent p-4 ${
                                        index === current ? 'border-teal-500' : ''
                                    } hover:border-grey-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                                >
                                    {head}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            <section className="mx-4 mt-8">{props.tabBody.map((body, index) => index === current && body)}</section>
        </div>
    );
};

export default Tabs;
