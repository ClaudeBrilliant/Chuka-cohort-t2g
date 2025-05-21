let isDone: boolean= true;
let num1: number= 6;
let color: string = "green";

let firstName;
let lastName;

function userData (firstName:string, lastName:any){
    console.log(`Username is ${firstName} ${lastName}`);
    
}

userData("John", "Doe")

function userDto (firstName:string, lastName:string, age:number, height:number, weight:number): number{
    let BMI: number = height / weight;
    console.log(`Username: ${firstName} ${lastName}, Age: ${age}, Height: ${height}, BMI:${BMI} `);
    return BMI;
}

userDto("Jane", "Doe", 27, 185, 70);



interface User {
    id: number,
    name: string,
    email: string,
    isAdmin:boolean, 
    profileImage?: string
}

function greet(user: User): string{
    console.log(`Hello, ${user.name}`);
    
    return `Hello, ${user.name}`;
}

greet({id: 1, name:"John Smith", email: "johnsmith@gmail.com", isAdmin: false, profileImage: "https://images.app.goo.gl/g6MbQSEDhCg2FZ6r8"});


let list:number[] = [1,2,3,4,5,6,7,8,9,10];

console.log(list);

let fruits: Array<string> = ["apple", "mango", "orange"];

console.log(fruits);

let person: [string, number] = ['Jane Doe', 30];


let num3: any = 4;
num3= "This is a string";
num3= false;


let newVar: unknown = 4;

if(typeof newVar === 'number'){
    console.log(newVar);
    
}