const getFullName = person => {
  return `${person.firstName} ${person.lastName}`;
};

const filterUniqueWords = text =>
    text
        .split(" ")
        .filter((word, index, arr) => arr.indexOf(word) === index)
        .sort((a,b) => a.localeCompare(b));

const getAverageGrade = students =>
    students
        .map(student => student.grades)
        .flat()
        .reduce((total, grade) => total + grade, 0) / students
        .map(student => student.grades.length)
        .reduce((total, count) => total + count, 0);

// Test - Task 2

const person = { firstName: "John", lastName: "Paul" };
console.log(getFullName(person)); // result: John Paul

const text = "Lorem ipsum dolor sit amet ipsum";
console.log(filterUniqueWords(text)); // result: ["amet", "dolor", "ipsum", "Lorem", "sit"]

const students = [
  { name: "Alice", grades: [80, 90, 75] },
  { name: "Adam", grades: [85, 88, 92] },
  { name: "John", grades: [95, 85, 90] }
];
console.log(getAverageGrade(students)); // result: 86.6667