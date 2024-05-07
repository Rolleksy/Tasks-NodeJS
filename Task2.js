function highlightKeywords(template, ...keywords) {
    let result = template;
    keywords.forEach((keyword, index) => {
        const regex = new RegExp(`\\$\\{${index}\\}`, 'gi'); // gi: _g_lobal, case-_i_nsensitive
        result = result.replace(regex, `<span class='highlight'>${keyword}</span>`);
    });
    return result;
}

module.exports = {highlightKeywords};

// Test 
const keywords = ["JavaScript", "template", "tagged"];
const template = "Learn \${0} tagged templates to create custom \${1} literals for \${2} manipulation.";

const highlighted = highlightKeywords(template, ...keywords);

console.log(highlighted);
// Expected: "Learn <span class='highlight'>JavaScript</span> tagged templates to create custom <span class='highlight'>template</span> literals for <span class='highlight'>tagged</span> manipulation."