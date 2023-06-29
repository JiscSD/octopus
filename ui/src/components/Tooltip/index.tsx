type TooltipProps = {
    message: string | React.ReactElement;
    children: React.ReactElement;
};

const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
    return (
        <div className="tooltip group relative flex flex-col items-center">
            {children}
            <div
                className={`${
                    children.props.disabled ? 'invisible' : ''
                } absolute bottom-full flex flex-col items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            >
                <span className="relative z-10 whitespace-nowrap rounded-md bg-teal-700 p-2 text-xs leading-none text-white-50 shadow-sm">
                    {message}
                </span>
                <div className="-mt-2 h-3 w-3 rotate-45 bg-teal-700"></div>
            </div>
        </div>
    );
};

export default Tooltip;
