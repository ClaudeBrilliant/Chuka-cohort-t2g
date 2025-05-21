"use strict";
let isDone = true;
let num1 = 6;
let color = "green";
let firstName;
let lastName;
function userData(firstName, lastName) {
    console.log(`Username is ${firstName} ${lastName}`);
}
userData("John", "Doe");
function userDto(firstName, lastName, age, height, weight) {
    let BMI = height / weight;
    console.log(`Username: ${firstName} ${lastName}, Age: ${age}, Height: ${height}, BMI:${BMI} `);
    return BMI;
}
userDto("Jane", "Doe", 27, 185, 70);
function greet(user) {
    console.log(`Hello, ${user.name}`);
    return `Hello, ${user.name}`;
}
greet({ id: 1, name: "John Smith", email: "johnsmith@gmail.com", isAdmin: false, profileImage: "https://images.app.goo.gl/g6MbQSEDhCg2FZ6r8" });
let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(list);
let fruits = ["apple", "mango", "orange"];
console.log(fruits);
let person = ['Jane Doe', 30];
let num3 = 4;
num3 = "This is a string";
num3 = false;
let newVar = 4;
if (typeof newVar === 'number') {
    console.log(newVar);
}
