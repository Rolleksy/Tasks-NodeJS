# JSON Parser
---

This project's purpose is to understand syntax and regex usage by implementing JSON Parser as a `myJSONParse()` in JavaScript.

> Implementation of the `myJSONParse` function is in `src/JsonParser.js` file.

What is JSON?

**JSON** (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write and easy for machines to parse and generate. JSON syntax is derived from JavaScript object notation but is language-independent, with parsers available for many programming languages. A JSON document is composed of key-value pairs, where keys are always strings enclosed in double quotes, and values can be strings, numbers, objects, arrays, true, false, or null. Objects are enclosed in curly braces `{}` and consist of a collection of key-value pairs separated by commas. Arrays are ordered lists of values enclosed in square brackets `[]`and also separated by commas. Strings are enclosed in double quotes and can contain any Unicode character, while numbers can be integers or floating-point and can include exponential notation. Boolean values are represented by the literals `true` and `false`, and `null` is used to represent an empty value. This structured yet flexible format makes JSON a popular choice for data exchange in web applications and APIs.

### 1. Function `myJSONParse`

The `myJSONParse` function is a custom implementation for parsing JSON strings into their corresponding JavaScript objects. This function operates by sequentially calling several helper functions to parse different components of a JSON string. 
The `trim`function removes leading and trailing whitespaces from the input string. Depending on the initial character of the trimmed string, `parseValue` dispatches the parsing task to the appropriate function: `parseString` for string values, `parseNumber` for numeric values, `parseLiteral` for boolean and null values, `parseArray` for arrays, and `parseObject` for objects. 
Each helper function uses regular expressions to match and extract specific JSON elements, recursively parsing nested structures where necessary. The main function, `parseValue`, coordinates this process and ensures that any remaining characters in the string after parsing are also trimmed and checked for validity. If there are any remaining non-whitespace characters, an error is thrown, indicating an invalid JSON format. This systematic approach ensures robust and accurate parsing of JSON strings into JavaScript objects, mimicking the functionality of the native `JSON.parse` method.

### 2. Helper functions:

2.1. `trim` function.

Function's purpose is to remove leading and trailing whitespaces. It replaces found matches of regex with ''.

Used regular expression:
>`/^\s+|\s+$/g`

Which stands for:
- `^\s+` - asserts position at the start of the string `^`, matches any whitespace character with `\s`, and with `+` so it matches if whitespaces happen multiple times in a row.
- `|` - OR,
- `\s+$` - asserts position at the end of the string `$`, matches any whitespace character with `\s`, and with `+` so it matches if whitespaces happen multiple times in a row.
- `/g` - global modifier, finds all matches. 


2.2. `parseString(str)` function.

Function's purpose is to return value from between `"` characters.

Used regular expression:
>`/^"(.*?)"/`

Which stands for:
- `^"` - asserts position at the start of the string `^` with character `"`,
- `(.*?)` - groups any character `.` in the string and `*?` for expanding,
- `"` - closing `"` character.

2.3. `parseNumber(str)` function.

Function`s purpose is to return numerical value from string.

Used regular expression:
> `/^-?\d+(\.\d+)?([eE][+-]?\d+)?/`

Which stands for:
- `^-?` - asserts position at the start of the string `^` with character `-` and `?` making previous character optional for negative numbers,
- `\d+` - matches with digits with `\d` and `+` for multiple in a row,
- `(\.\d+)` - captures digits `\d` after optional character `\.` for decimals,
- `([eE][+-])` - captures charaters `e`, `E`, `+` and `-` for exponential

2.4. `parseLiteral(str)` function.

Function's purpose is to return literal `true`, `false` and `null`.

Used regular expression:
> `/^(true|false|null)/`
Only matches if first word of string is `true` or `false` or `null` and then passes it to ifelse loop.


2.5. `parseArray(str)` function.

Function's purpose is to parse data between characters `[` and `]` and return array. It slices first character, so `[`, then passes the string to `parseValue()` to receive next value, until it's reached `]` character.

2.6. `parseObject(str)` function.

Function's purpose is to parse data between `{` and `}`and return them as Object. It slices first character so `{` and then passess the string to `parseString` to receive key and then to `parseValue` to receive value, until it's reached `}` character.

2.7. `parseValue(str)` function.

The purpose of the parseValue function is to act as the main dispatch function that determines how to parse a given JSON string based on the first character of the string. It delegates the parsing task to the appropriate parsing function (`parseString`, `parseNumber`, `parseLiteral`, `parseArray`, or `parseObject`) based on the detected type of the value.

### 3. Testing 

> In order to test this project, `mocha` and `chai` dependencies have to be installed.
> With command: `npm i --save-dev mocha chai`

Testing is based on comparing parsed and returned by `myJSONParser(str)` object with expected output being `JSON.parse(str)`. Any number of new tests can be added/removed to/from `./test/json` folder dynamically. It's `*.mjs` file because of need to use dynamic imports for `expect` value from `chai`.

Full code in file `ParserTests.test.mjs`


>Run test with `npm test` command.


### 4. Reflection

The project aimed at testing my understanding of JSON syntax and the use of regular expressions (regex) to find patterns was highly educational. Initially, I focused on understanding the JSON syntax, which included identifying and comprehending the meaning of various characters and the data types they define.

During the project, I realized that the string passed to the function had to be searched character by character. When a specific character such as `", -, 0, 9, t, f, n, [, {` was found, the appropriate function was called to find matches. The key was to develop these functions in a way that allowed for effective and efficient parsing and in cases of `parseString`, `parseNumber`, `parseLiteral` and `trim` using regular expressions.

While creating the functions that used regex, visualization tools for regular expressions found in web, proved to be extremely helpful. These tools allowed me to make changes to the expressions and immediately see the visual results of the matches without changing the code. This was incredibly useful because even small changes in the expressions, which might seem insignificant at first glance, could halt the progress of writing the functions for a significant amount of time.

In summary, this project allowed me to solidify my knowledge of JSON syntax and how data is stored within it. Using regular expressions to find patterns significantly improved the parsing of JSON strings and deepened my understanding of how regex works. I learned how to construct regular expressions, how to use logic within them to achieve desired patterns, and how to group search results. Overall, this project enhanced my skills in using regular expressions and understanding their practical applications.