let users = ["Duncan", "Alex" , "Claude", "Jimmy", "Mellisa"];

let userT2= ["Ajay", "Max", "Peter" ]

//Add item to the end of an array (append)
users.push("Steve")

// Add item to the start of an array
users.unshift("Leah")

// Remove item from the end of an array
users.pop()

//Remove item from the start of an array
users.shift()

//Removing/replacing exisitng elements with new ones
// splice(starting-point, no. items, item to insert)
// users.splice(1,3, "Abdul");

//Fill entire array elements with a defined value
// users.fill("John Smith");

// Selects a specific portion of the array
const recruits =users.slice(1,3);

console.log(recruits);


const selected = users.concat(userT2);
console.log("Those selected are",selected);

// Reverses the order of the array
// selected.reverse();

//Sorts an array alphabetically
selected.sort();


console.log(selected);


let ages = [22, 25, 26, 29, 30, 19, 18, 24];
//Gets ages divisible by 2
const num = ages.filter((i) => i % 2 == 0);
console.log(num);
//Greater than 20 yo
const age20 = ages.filter((i) => i >= 20);
console.log(age20);

//returns index of first element that passes a test
const num1 = ages.findIndex((i) => i % 2 == 0);
console.log(num1);

const num2 = ages.includes(30);
console.log(num2);




// Returns array elements with their index
const  map = users.map((i,j) => console.log(`${i}, ${j}`));
console.log(map);

//flattens an array w sub arrays (Returns a new array with flattened elements)
let trainers = ["John Doe", "Jane Doe", "John Smith", "Todd", ["Ajay", "Rick", "Morty"]];
let flattenned = trainers.flat();
console.log(flattenned);
//finds and returns an index of an element
let index = trainers.indexOf("John Doe");
console.log(index);




console.log(users);
