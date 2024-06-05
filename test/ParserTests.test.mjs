import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { myJSONParse } from '../src/JsonParser.js';


// helper - no dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


describe('Parsing JSON files with my JSON Parser. Using built-in JSON Parse as expected.', () => {
    function getJsonFilesInFolder() {
        const testPath = path.join(__dirname, 'json');
        const files = fs.readdirSync(testPath);
        return files.filter(file => path.extname(file) === '.json');
    }
    const jsonFiles = getJsonFilesInFolder();
    jsonFiles.forEach((file) => {
        it(`- should correctly parse ${file}`, () => {
            const jsonFilePath = path.join(__dirname, 'json', file);
            const jsonString = fs.readFileSync(jsonFilePath, 'utf8');
            const expectedOutput = JSON.parse(jsonString);

            const result = myJSONParse(jsonString);

            expect(result).to.deep.equal(expectedOutput);
        });
    });
});

