function debounce(func, delay) 
{
    let timeoutId;

    return function(...args) 
    {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => 
        {
            func.apply(this, args);
        }, delay); // Setting new timeout
    };
}

module.exports = { debounce };

// Test
function debouncedSearch(query) 
{
    console.log("Searching for:", query);
}

const debouncedSearchHandler = debounce(debouncedSearch, 900);

const queries = ["one", "two", "three", "searched query"];

queries.forEach(query => 
{
    debouncedSearchHandler(query);
});
