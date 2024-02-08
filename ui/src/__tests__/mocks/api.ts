import * as api from '@/api';

jest.mock('@/api');

const mockedApi = api as jest.Mocked<typeof api>;

export default mockedApi;
