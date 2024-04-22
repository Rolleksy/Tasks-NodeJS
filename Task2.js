const getFullName = person => {
  return `${person.firstName} ${person.lastName}`;
};

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// filter unique words
const sortWords = words => words.sort((a, b) => a.localeCompare(b));
const toLowerAndSplit = text => text.toLowerCase().split(" ");
const filterUnique = words => words.filter((word, index, arr) => arr.indexOf(word) === index);


const filterUniqueWords = compose(sortWords, filterUnique, toLowerAndSplit);

// get average grade
const getAverage = grades => 
  grades.reduce((total, grade) => total + grade, 0) / grades.length;

const flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);

const getAverageGrade = compose(
  getAverage, flatten, students => students.map(student => student.grades));

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