// let user = new Object();


let user = {
    name: "Brian Kimutai",
    age: 20,
    weight: 70,
    height: 185

}

user.name = "Mark Otwane";

user.isMale = true;

delete user.height;

console.log(user.BMI === undefined); //true

console.log("BMI" in user); //false


let classes = {
    id: 101,
    title: "Introduction to JavaScript",
    lecturer: "John Doe",
    topics:["String Manipulation", "Data Structures", "Arrays and Objects"]
}

//Object.assign(targetObject, object1, object2)

let profile = Object.assign({}, user, classes);

console.log(profile);



const person = {}
const propertyName = 'username';
const value = 'Jane Doe';

person[propertyName] = value;

console.log(person);


const key = 'status';
const user1 ={
    name: "Jimmy Kimunyi",
    [key] : 'active',
    [`user-${Date.now()}`]: 'unique ID'
};

console.log(user1);








// console.log(user); //Return User object

