import * as Components from '@/components';

type Props = {
    fixedHeader?: boolean;
    children: React.ReactNode;
};

const Topic: React.FC<Props> = (props): React.ReactElement => (
    <>
        <Components.JumpToContent />
        <Components.Header fixed={props.fixedHeader} />
        <main className="container mx-auto px-8 pb-6 pt-4 lg:grid lg:grid-cols-12 lg:gap-8 lg:pb-16 lg:pt-8 2xl:gap-16">
            {props.children}
        </main>
        <Components.Footer waves={true} />
    </>
);

export default Topic;
