String.prototype.plus = function(other) {
    // Convert strings to arrays of numbers and reverse them
    let num1 = this.split('').map(Number).reverse();
    let num2 = other.split('').map(Number).reverse();
    
    let maxLength = Math.max(num1.length, num2.length);
    let result = [];
    let carry = 0;

    for (let i = 0; i < maxLength; i++) {
        // (num1[i] || 0) returns 0 if num1[i] is out of range
        let sum = (num1[i] || 0) + (num2[i] || 0) + carry;
        result.push(sum % 10);
        carry = Math.floor(sum / 10);
    }

    if (carry > 0) {
        result.push(carry);
    }

    return result.reverse().join('');
}

String.prototype.minus = function(other) {
    // Convert strings to arrays of numbers and reverse them
    let num1 = this.split('').map(Number).reverse();
    let num2 = other.split('').map(Number).reverse();
    
    let result = [];
    let borrow = 0;

    // Check if the first parameter is greater than the second parameter
    if (parseInt(this) < parseInt(other)) {
        console.log("Subtraction constraint violated: First parameter must be greater than the second parameter.");
        return null;
    }
    else {
        for (let i = 0; i < num1.length; i++) {
            let diff = (num1[i] || 0) - (num2[i] || 0) - borrow;
            if (diff < 0) {
                diff += 10;
                borrow = 1;
            } else {
                borrow = 0;
            }
            result.push(diff);
        }
        // (/^0+(?=\d)/, '') removes leading zeroes
        return result.reverse().join('').replace(/^0+(?=\d)/, '');
    }
    
}

String.prototype.multiply = function(other) {
    
    // Convert strings to arrays of numbers and reverse them
    let num1 = this.split('').map(Number).reverse();
    let num2 = other.split('').map(Number).reverse();
    
    // Initialize result array with zeros
    let result = Array(num1.length + num2.length).fill(0);

    for (let i = 0; i < num1.length; i++) {
        for (let j = 0; j < num2.length; j++) {
            result[i + j] += num1[i] * num2[j];
            result[i + j + 1] += Math.floor(result[i + j] / 10);
            result[i + j] %= 10;
        }
    }
    // (/^0+(?=\d)/, '') removes leading zeroes
    return result.reverse().join('').replace(/^0+(?=\d)/, '');
}

// Fixed division of big numbers
String.prototype.divide = function(other) {
    let dividend = this.toString();
    let divisor = other.toString();

    // Check if divisor is zero
    if (divisor === "0") {
        throw new Error("Division by zero is not allowed.");
    }

    // Convert strings to arrays of numbers
    let dividendArr = dividend.split('').map(Number);
    let divisorArr = divisor.split('').map(Number);

    let quotient = [];
    let tempDividend = 0;
    let index = 0;


    while (index < dividendArr.length) {
        // Get the next digit from the dividend and shift it to the left by one decimal place
        tempDividend = tempDividend * 10 + dividendArr[index];
        index++;

        // Check if the dividend is less than the divisor and add a zero to the quotient
        if (tempDividend < divisor) {
            quotient.push(0);
            continue;
        }

        // Perform division
        let tempQuotient = Math.floor(tempDividend / divisor);
        // Add the quotient to the result
        quotient.push(tempQuotient);
        // Calculate the new dividend
        tempDividend = tempDividend - tempQuotient * divisor;
    }

    // (/^0+(?=\d)/, '') removes leading zeroes
    quotient = quotient.join('').replace(/^0+(?=\d)/, '');

    return quotient || "0";
};

module.exports = {
    plus: String.prototype.plus,
    minus: String.prototype.minus,
    multiply: String.prototype.multiply,
    divide: String.prototype.divide
};
