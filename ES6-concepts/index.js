
// Nullish Coaleasing (Setting a default value if a required valueis undefined)
const config = {
    theme: undefined,
    fontSize:null,
    showSidebar: false,
    timeout: 0
}

const theme = config.theme ?? 'dark';
const fontSize = config.fontSize ?? 16;
const showSidebar = config.showSidebar ?? true;
const timeout = config.timeout ?? 400000;

console.log({theme, fontSize, showSidebar, timeout});

//Array and object Destructuring
const colors = ['red', 'green', 'blue', 'yellow', 'black'];
const [primaryColor, secondaryColor, ...otherColors] = colors;

console.log({primaryColor, secondaryColor, otherColors});

const[first, ,third, ,fifth] = colors;
console.log("Skipping items by destructuring",{first, third, fifth});

let i = 'John Doe';
let j = "Jane Doe";

[i, j] = [j, i];

console.log("Swapping elements by destructuring", {i, j});

//Swapping elements in an array by destructuring**

const person ={
    name: 'John Doe',
    age: 22,
    occupation: 'Developer',
    address:{
        city: ' Nairobi', 
        estate:'greenspan',

    }
}

const {name, age} =person;

console.log("Object destructuring", {name, age});

// Rest operator in arrays
const [winner, runnerUp, ...participants] = ["John Kyalo", "Nick Munene", "Jonathan Mulinge", "Dan Njuguna", "Leah Achieng", "Mark Ndwiga"]
console.log("Rest ops", {winner, runnerUp, participants});
//Rest operator in objects
const {name:userName, age:userAge, ...userDetails} ={
    name: 'John Doe',
    age: 22,
    occupation: 'Developer',
    address:{
        city: ' Nairobi', 
        estate:'greenspan',

    }
}
console.log("Rest ops in objects", {userName, userAge, userDetails});


//Spread operator in arrays
const numbers = [1,2,3,4,5];
const nums = [6,7,8,9,10];
const numCom=[...numbers, ...nums];

console.log("Spread ops in arrays", numCom);


//Spread ops in objects
const obj1 = {
    name: 'John Doe',
    age: 22,
    occupation: 'Developer'
}
const objfull = {
    ...obj1,
    address:{
        city: ' Nairobi', 
        estate:'greenspan',

    }
}

console.log("Spread ops in objects", objfull);

const people = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 }
];

const [p1, p2, p3] =people;
// people.reverse()
console.log("Log people",{p3,p2,p1});


const multiply = num1 => num1 * 2;
console.log("Multiplication", multiply(9))

const area = (width, height) => {
    const rectangle = width * height;
    return rectangle;
};

console.log("Area of a rectangle is ", area(4,7));





