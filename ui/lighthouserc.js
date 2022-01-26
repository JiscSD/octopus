module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run dev',
            url: ['http://localhost:3000/']
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};
