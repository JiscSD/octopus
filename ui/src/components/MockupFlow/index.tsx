import React from 'react';

import * as Components from '@components';
import * as Assets from '@assets';

const MockupFlow: React.FC = (): React.ReactElement => (
    <>
        <div className="mb-16 grid grid-cols-3">
            <div className="mt-8 space-y-4">
                <Components.PageSubTitle text="Lorem ipsum" />
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae adipisci harum eius autem,
                    laudantium iste labore libero voluptatem nisi praesentium. Sint, fuga possimus animi accusantium
                    recusandae excepturi deleniti! Perspiciatis, nesciunt!
                </p>
            </div>
            <div className="col-span-2 flex justify-end">
                <Assets.Window />
            </div>
        </div>
        <div className="mb-16 grid grid-cols-3">
            <div className="mt-8 space-y-4">
                <Components.PageSubTitle text="Lorem ipsum" />
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae adipisci harum eius autem,
                    laudantium iste labore libero voluptatem nisi praesentium. Sint, fuga possimus animi accusantium
                    recusandae excepturi deleniti! Perspiciatis, nesciunt!
                </p>
            </div>
            <div className="col-span-2 flex justify-end">
                <Assets.Window />
            </div>
        </div>
        <div className="mb-16 grid grid-cols-3">
            <div className="mt-8 space-y-4">
                <Components.PageSubTitle text="Lorem ipsum" />
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae adipisci harum eius autem,
                    laudantium iste labore libero voluptatem nisi praesentium. Sint, fuga possimus animi accusantium
                    recusandae excepturi deleniti! Perspiciatis, nesciunt!
                </p>
            </div>
            <div className="col-span-2 flex justify-end">
                <Assets.Window />
            </div>
        </div>
    </>
);

export default MockupFlow;
