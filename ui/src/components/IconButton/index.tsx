import * as Components from '@components';

type IconButtonProps = {
    className?: string;
    disabled?: boolean;
    icon: React.ReactElement;
    title: string;
    onClick?: () => void;
};

const IconButton: React.FC<IconButtonProps> = (props) => (
    <button
        title={props.title}
        disabled={props.disabled}
        className={`${
            props.className ? props.className : ''
        } font-lg flex items-center p-1 text-teal-500 outline-none transition-colors duration-500 focus:rounded focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:hover:cursor-not-allowed`}
        onClick={props.onClick}
    >
        {props.icon}
    </button>
);

export default IconButton;
