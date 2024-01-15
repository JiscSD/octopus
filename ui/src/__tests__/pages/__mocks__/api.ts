export default jest.mock('@/api', () => ({
    get: jest.fn(),
    destroy: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    put: jest.fn()
}));
