import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';

const Error404: Types.NextPage = () => (
    <Layouts.Error
        title="Page not found."
        windowTitle={Config.urls[404].title}
        content="Nothing to see here!"
        statusCode={404}
    />
);

export default Error404;
