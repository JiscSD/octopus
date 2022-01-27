module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run lighthouse',
            url: ['http://localhost:3000/']
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};
