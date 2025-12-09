const { log } = require('console');

// Part 1

//1
let string = '123';
let num = Number(string);
num += 7
log(num);

//2 Falsy value ==> 0, "", null, undefined, false, NaN
const checkFalsyValue = (value) => {
    return value ? 'Valid' : 'Invalid';
};

log(checkFalsyValue(0));
log(checkFalsyValue('mo'));

//3 
const printOddNum = (num1, num2) => {
    for (let i = num1; i <= num2; i++) {
        if (!(i & 1)) continue;
        log(i);
    }
}

printOddNum(1, 10);

//4 
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const printEvenNum = (array) => {
    log(array.filter(num => num % 2 === 0))
    //    log(array.filter(num => !(num & 1)))
}

printEvenNum(array);

//5
const arrayOne = [1, 2, 3];
const arrayTwo = [4, 5, 6];

const mergeArrays = (arrOne, arrTwo) => {
    let bigArr = [...arrOne, ...arrTwo];
    return bigArr
};

log(mergeArrays(arrayOne, arrayTwo));

//6 
const getDayOfWeek = (num) => {
    switch (num) {
        case 1:
            return "Sunday";
        case 2:
            return "Monday";
        case 3:
            return "Tuesday";
        case 4:
            return "Wednesday";
        case 5:
            return "Thursday";
        case 6:
            return "Friday";
        case 7:
            return "Saturday";
        default:
            return "Invalid day";
    }
};

log(getDayOfWeek(2));

//7
const strings = ["a", "ab", "abc"];
const lengths = strings.map(str => str.length);

log(lengths);

//8
function checkDivisible(num) {
    if (num % 3 === 0 && num % 5 === 0) {
        return "Divisible by both";
    } else if (num % 3 === 0) {
        return "Divisible by 3";
    } else if (num % 5 === 0) {
        return "Divisible by 5";
    } else {
        return "Not divisible by 3 or 5";
    }
};

log(checkDivisible(9));  // "9 / 3 = 3"
log(checkDivisible(7));  // "7 / 3 = 2.33 | 7 / 5 = 1.4"
log(checkDivisible(10)); // "10 / 3 = 3.3 | 10 / 5 = 2"
log(checkDivisible(15)); // "15 / 3 = 5   | 15 / 5 = 3"

//9
const square = num => num * num;
log(square(5));

//10
const personObj = {
    name: 'John',
    age: 25
};

const Person = ({ name, age }) => {
    return `${name} is ${age} years old`;
};

log(Person(personObj));

//11
function sumNums(...nums) {
    let sum = 0;
    for (let num of nums) {
        sum += num;
    }
    return sum;
}

log(sumNums(1, 2, 3, 4, 5));

//12
const delay = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Success");
        }, 3000);
    });
};

delay().then((message) => {
    console.log(message)
});

//13
const findLargest = (arr) => {
    return Math.max(...arr);
};

log(findLargest(array));

//14
const person = {
    name: "John",
    age: 30
};
let keys = Object.keys(person);
log(keys);

//15
const spliter = function (inputStr, spliter){
    return inputStr.split(spliter);
}

log(spliter("The quick brown fox", ' '));
log(spliter("The/quick/brown/fox", '/'));
