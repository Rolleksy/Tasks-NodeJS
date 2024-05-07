function throttle(func, interval) 
{
    let lastExecutionTime = 0;
    let timeoutId;

    return function(...args) {
        const currentTime = Date.now();

        if (currentTime - lastExecutionTime >= interval) 
        {
            func.apply(this, args);
            lastExecutionTime = currentTime;
        } 
        else 
        {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => 
            {
                func.apply(this, args);
                lastExecutionTime = Date.now();
            }, interval - (currentTime - lastExecutionTime));
        }
    };
}

// module.exports = { throttle }; // Somehow it breaks the code, so I commented it out

function onScroll(event) 
{
    console.log("Scroll event:", event);
}

const throttledScrollHandler = throttle(onScroll, 1000);

window.addEventListener("scroll", throttledScrollHandler);