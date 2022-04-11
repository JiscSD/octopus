import Home from '../../pages/index';

export default {
    title: 'Pages/Home',
    component: Home
};

export const Page = () => (
    <div className="bg-teal-50 transition-colors duration-500 dark:bg-grey-800">
        <Home errors={{ latest: null }} latest={[]} />
    </div>
);
