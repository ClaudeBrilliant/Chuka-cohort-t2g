
//Constructor implementation
// function Person(name, age) {
//     this.name =name;
//     this.age = age;
//     this.greet =function () {
//         console.log(`Hello World,my name is ${name} and I am ${age} years old`);
        
//     }
// }

// let john = new Person('John Doe', 30);
// let jane = new Person('Jane Doe', 38);

// john.greet();
// jane.greet();

class People{
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet(){
        console.log(`Hello World,my name is ${this.name} and I am ${this.age} years old`);
    }

    birthday(){
        this.age++;
        console.log(`${this.name} is officially ${this.age} years old.`);
        
    }


}

let john = new People('John Doe', 30);
let jane = new People('Jane Doe', 38);

john.greet();
jane.birthday();


class Calculator{
    constructor(x, y){
        this.x =x;
        this.y =y
    }

    add(){
        return this.x +this.y
    }

    static multiply(a , b){
        return a * b;
    }

    static decription = "Math util"
}

const math = new Calculator(5,4);
console.log(math.add());


class Person{
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet(){
        console.log(`Hello World,my name is ${this.name} and I am ${this.age} years old`);
    }

    birthday(){
        this.age++;
        console.log(`${this.name} is officially ${this.age} years old.`);
        
    }


}

class Employee extends Person{
    constructor(name, age, jobTitle, salary){
        super(name, age);
        this.jobTitle =jobTitle;
        this.salary = salary;
    }

    work(){
        console.log(`${this.name} is working as a ${this.jobTitle}`);
        
    }

    greet(){
        super.greet();
        console.log(`I am a ${this.jobTitle}`);
        
    }
}

let employee = new Employee("John Doe", 23, "Developer", 75000);

employee.greet();
employee.work();


class BankAccount{
    constructor(owner){
        this.owner = owner;
        this._balance = 0;
    }

    get balance(){
        return `KES ${this._balance}`
    }

    set balance(amount){
        if(isNaN(amount)){
            throw new Error("Amount must be a number");
        }
        if(amount < 0) {
            throw new Error("Cannot add a negative amount")
        }
        this._balance = amount
    }

    deposit(amount){
        if(amount <= 0){
            throw new Error("Deposit must be a positive value");

        }
        return this._balance += amount;
    }

    withdraw(amount){
        if(amount <= 0){
            throw new Error("Withdrawal must be a positive value");

        }
        else if ( amount > this._balance){
            throw new Error("Insufficient funds");

        }
        else{
            this._balance -= amount;
            return this._balance
        }
    }
}

const account = new BankAccount("John Smith");


account.balance = 2000;
console.log(account.balance);

account.deposit(10000);
console.log(account.balance);

const person = {
    name: "John Doe",
    age:30
};

const nameDescriptor = Object.getOwnPropertyDescriptor(person, 'name');
console.log(nameDescriptor);

Object.defineProperty(person, 'readonly', {
    value: 'Cannot change this',
    writable:false,
    enumerable:true,
    configurable:false
}

);

person.readonly = 'Jane Doe'
console.log(person.readonly);


Object.defineProperty(person, 'description', {
    get: function () {
        return `${this.name}, ${this.age} years old`;
    },
    enumerable:true,
    configurable:true
});

console.log(person.decription);

