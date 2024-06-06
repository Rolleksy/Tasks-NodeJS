// const json = require('../Test.json');
// const fs = require('fs');


function myJSONParse(json) {
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
         // remove leading and trailing whitespaces
    }
    function parseString(str) {
        const stringPattern = /^"(.*?)"/;
        // match anything between double quotes
        const match = stringPattern.exec(str);
        if (match) {
            return [match[1], str.slice(match[0].length)];
        }
        throw new Error('Invalid String in parseString method');
    }

    function parseNumber(str) {
        const numberPattern = /^-?\d+(\.\d+)?([eE][+-]?\d+)?/; 
        // match any number including exponential notation [eE][+-], negative numbers, and decimals
        const match = numberPattern.exec(str);
        if (match) {
            return [parseFloat(match[0]), str.slice(match[0].length)];
        }
        throw new Error('Invalid Number in parseNumber method');
    }

    function parseLiteral(str) {
        const literalPattern = /^(true|false|null)/; // match true, false, or null
        const match = literalPattern.exec(str);
        if (match) {
            const literal = match[0];
            const remaining = str.slice(literal.length);
            if (literal === 'true') {
                return [true, remaining];
            } else if (literal === 'false') {
                return [false, remaining];
            } else if (literal === 'null') {
                return [null, remaining];
            }
        }
        throw new Error('Invalid Literal in parseLiteral method');
    }
    function parseArray(str) {
        let result = [];
        str = trim(str.slice(1));
        if (str[0] === ']') {
            return [result, str.slice(1)];
        }
        while (str.length > 0) {
            let value;
            [value, str] = parseValue(str);
            result.push(value);
            str = trim(str);
            if (str[0] === ']') {
                return [result, str.slice(1)];
            } else if (str[0] === ',') {
                str = trim(str.slice(1));
            } else {
                throw new Error('Invalid Array in parseArray method else');
            }
        }
        throw new Error('Invalid Array in parseArray method');
    }

    function parseObject(str) {
        let result = {};
        str = trim(str.slice(1));
        if (str[0] === '}') {
            return [result, str.slice(1)];
        }
        while (str.length > 0) {
            let key, value;
            // Retrieving Keys
            [key, str] = parseString(str);
            
            str = trim(str);
            if (str[0] !== ':') {
                throw new Error('Invalid Object in parseObject method');
            }
            str = trim(str.slice(1));
            
            // Retrieving Values
            [value, str] = parseValue(str); 
            result[key] = value;
            
            str = trim(str);
            if (str[0] === '}') {
                return [result, str.slice(1)];
            }
            if (str[0] !== ',') {
                throw new Error('Invalid Object in parseObject method, missing , character.');
            }
            str = trim(str.slice(1));
        }
        throw new Error('Invalid Object in parseObject method');
    }

    function parseValue(str) {
        str = trim(str);
        if (str[0] === '"') {
            return parseString(str);
        } if (str[0] === '-' || (str[0] >= '0' && str[0] <= '9')) {
            return parseNumber(str);
        } if (str[0] === 't' || str[0] === 'f' || str[0] === 'n') {
            return parseLiteral(str);
        } if (str[0] === '[') {
            return parseArray(str);
        } if (str[0] === '{') {
            return parseObject(str);
        }
        throw new Error('Invalid Value in parseValue method. Unexpected character.');   
    }

    const [result, remaining] = parseValue(json);

    if (trim(remaining).length > 0) {
        throw new Error('Invalid JSON');
    }
    return result;
}

module.exports = { myJSONParse };

// const jsonFile = fs.readFileSync('./Test.json', 'utf8');


// let parsedJson = myJSONParse(jsonFile);
// console.log(parsedJson);
