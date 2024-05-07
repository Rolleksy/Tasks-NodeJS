function multiline(strings) {
    let result = '';
    const lines = strings[0].split('\n'); // spliting the string by new line character

    lines.forEach((line, index) => {
        if (line.trim().length > 0) {
            if (index > 1)
            {
                result += ` ${index} ${line}\n`;
            }
            else
            {
                result += `${index} ${line}\n`;
            }
            
        }
    });
    return result = `"${result.slice(0, -1)}"`; // Remove the last newline character
}

module.exports = { multiline };

// Test

const code = multiline`
function add(a, b) {
    return a + b;
}
`;

console.log(code);
// Expected:
// "1 function add(a, b) {
//  2 return a + b;
//  3 }"