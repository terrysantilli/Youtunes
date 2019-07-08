const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
const clientBuildPath = path.resolve(__dirname, '../client/src/ethereumBuild');
fs.removeSync(buildPath);
fs.removeSync(clientBuildPath);

const songPath = path.resolve(__dirname, 'contracts', 'Song.sol');
const source = fs.readFileSync(songPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);
fs.ensureDirSync(clientBuildPath);


for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
    fs.outputJSONSync(
        path.resolve(clientBuildPath, contract.replace(':', '') + '.json'),
    output[contract]
    );
}