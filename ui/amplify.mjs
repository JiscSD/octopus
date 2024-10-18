import { join } from 'node:path';
import { writeFileSync, mkdirSync, existsSync, cpSync, rmSync } from 'node:fs';

// Define all the Amplify related directories
const amplifyDirectories = [
    join(process.cwd(), '.amplify-hosting'),
    join(process.cwd(), '.amplify-hosting', 'static'),
    join(process.cwd(), '.amplify-hosting', 'static', '_next'),
    join(process.cwd(), '.amplify-hosting', 'compute'),
    join(process.cwd(), '.amplify-hosting', 'compute', 'default'),
    join(process.cwd(), '.amplify-hosting', 'compute', 'default', 'node_modules'),
]

// Create directories if they do no exist already
if (existsSync(amplifyDirectories[0])) rmSync(amplifyDirectories[0], { force: true, recursive: true })

// Create directories if they do no exist already
amplifyDirectories.forEach((i => mkdirSync(i)))

// A general default configuration to fallback to compute if no matching static assets found
const deployManifestConfig = {
    version: 1,
    routes: [
        {
            path: `/assets/*`,
            target: {
                kind: "Static",
            },
        },
        {
            path: `/*.*`,
            target: {
                kind: "Static",
            },
            fallback: {
                kind: "Compute",
                src: "default",
            },
        },
        {
            path: "/*",
            target: {
                kind: "Compute",
                src: "default",
            },
        },
    ],
    computeResources: [
        {
            name: "default",
            entrypoint: "sensor.bin.js",
            runtime: "nodejs18.x",
        },
    ],
    framework: {
        name: "next",
        version: "13.5.6",
    },
};

// Write the config to .amplify-hosting/deploy-manifest.json
writeFileSync(
    join(process.cwd(), ".amplify-hosting", "deploy-manifest.json"),
    JSON.stringify(deployManifestConfig),
);

// Copy the static assets generated in .next/static and public to .amplify-hosting/static directory
cpSync(join(process.cwd(), 'public'), amplifyDirectories[1], { recursive: true })
cpSync(join(process.cwd(), '.next', 'static'), amplifyDirectories[2], { recursive: true })
// copy acusensor to compute folder
cpSync(join(process.cwd(), 'acusensor/package'), amplifyDirectories[4], { recursive: true })

// Copy the static assets generated in .next/standalone to .amplify-hosting/compute directory
//cpSync(join(process.cwd(), '.next', 'standalone'), amplifyDirectories[4], { recursive: true })

// Remove .next/static and public from .amplify-hosting/compute/default
rmSync(join(amplifyDirectories[4], '.next', 'static'), { force: true, recursive: true })
rmSync(join(amplifyDirectories[4], 'public'), { force: true, recursive: true })