module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run start',
            url: ['http://localhost:3000/'],
            url: ['http://localhost:3000/404']
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};
