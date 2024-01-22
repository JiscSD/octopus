import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';

const Error500: Types.NextPage = () => (
    <Layouts.Error
        title="Internal server error"
        windowTitle={Config.urls[500].title}
        content="There is a problem with the server"
        statusCode={500}
    />
);

export default Error500;
