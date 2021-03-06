// Mock for Jest unittest
// In production, this module is built by PEG.js CLI
import { memoize } from 'lodash';
import { readFileSync } from 'fs';
import PEG from 'pegjs';
import path from 'path';

const getParser = memoize(() => {
    const data = readFileSync(path.join(__dirname, '../../fluorite5/fluorite5.pegjs'));

    return PEG.generate(data.toString(), {
        cache: true,
        allowedStartRules: [
            'Expression',
            'VMFactory',
        ],
    });
});

export default {
    parse: (...args) => getParser().parse(...args),
};
