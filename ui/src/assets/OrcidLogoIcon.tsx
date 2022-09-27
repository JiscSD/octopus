import React from 'react';

type Props = {
    width: number;
    className?: string;
};

const OrcidLogoIcon: React.FC<Props> = (props): React.ReactElement => (
    <svg
        className={props.className || ''}
        width={props.width}
        height="auto"
        viewBox="0 0 72 72"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="hero" transform="translate(-924.000000, -72.000000)" fillRule="nonzero">
                <g id="Group-4">
                    <g id="vector_iD_icon" transform="translate(924.000000, 72.000000)">
                        <path
                            d="M72,36 C72,55.884375 55.884375,72 36,72 C16.115625,72 0,55.884375 0,36 C0,16.115625 16.115625,0 36,0 C55.884375,0 72,16.115625 72,36 Z"
                            id="Path"
                            fill="#A6CE39"
                        ></path>
                        <g id="Group" transform="translate(18.868966, 12.910345)" fill="#FFFFFF">
                            <polygon
                                id="Path"
                                points="5.03734929 39.1250878 0.695429861 39.1250878 0.695429861 9.14431787 5.03734929 9.14431787 5.03734929 22.6930505 5.03734929 39.1250878"
                            ></polygon>
                            <path
                                d="M11.409257,9.14431787 L23.1380784,9.14431787 C34.303014,9.14431787 39.2088191,17.0664074 39.2088191,24.1486995 C39.2088191,31.846843 33.1470485,39.1530811 23.1944669,39.1530811 L11.409257,39.1530811 L11.409257,9.14431787 Z M15.7511765,35.2620194 L22.6587756,35.2620194 C32.49858,35.2620194 34.7541226,27.8438084 34.7541226,24.1486995 C34.7541226,18.1301509 30.8915059,13.0353795 22.4332213,13.0353795 L15.7511765,13.0353795 L15.7511765,35.2620194 Z"
                                id="Shape"
                            ></path>
                            <path
                                d="M5.71401206,2.90182329 C5.71401206,4.441452 4.44526937,5.72914146 2.86638958,5.72914146 C1.28750978,5.72914146 0.0187670918,4.441452 0.0187670918,2.90182329 C0.0187670918,1.33420133 1.28750978,0.0745051096 2.86638958,0.0745051096 C4.44526937,0.0745051096 5.71401206,1.36219458 5.71401206,2.90182329 Z"
                                id="Path"
                            ></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
);

export default OrcidLogoIcon;
