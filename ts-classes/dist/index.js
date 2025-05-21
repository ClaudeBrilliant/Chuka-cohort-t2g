"use strict";
// Dog class (without interface)
// class Dog {
//     constructor(public name:string, public breed: string){
//         console.log(`${this.name} is of breed ${this.breed} !!`);
class Dog {
    constructor(name, breed) {
        this.name = name;
        this.breed = breed;
        console.log(`${this.name} is of breed ${this.breed}`);
    }
    bark() {
        console.log(`${this.name} is barking`);
    }
    fetch(item) {
        console.log(`${this.name} fetches the ${item}`);
    }
    makeSound() {
        this.bark();
    }
    move() {
        console.log(`${this.name} moves on four legs.`);
    }
}
class Cat {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        console.log(`${this.name} the ${this.color} cat is a menace`);
    }
    purr() {
        console.log(`${this.name} purrs`);
    }
    makeSound() {
        this.purr();
    }
    move() {
        console.log(`${this.name} moves silently`);
    }
}
class Shape {
    constructor(color) {
        this.color = color;
    }
    displayColor() {
        console.log(`color ${this.color}`);
    }
}
class Circle extends Shape {
    constructor(color, radius) {
        super(color);
        this.radius = radius;
    }
    getArea() {
        return Math.PI * this.radius * this.radius;
    }
}
class Rectangle extends Shape {
    constructor(color, width, height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
}
// const triangle = new Shape("red")
const circle = new Circle("Blue", 7);
circle.displayColor();
console.log(`The area of this circle is: ${circle.getArea()}`);
const rectangle = new Rectangle("Green", 4, 6);
rectangle.displayColor();
console.log(`The area of this circle is: ${rectangle.getArea()}`);
class Customer {
    constructor(id, name, email, creditScore) {
        this.id = id;
        this.name = name;
        this.creditScore = creditScore;
        this.email = email;
        this.notes = [];
    }
    getCreditScore() {
        return this.creditScore;
    }
    addNotes(note) {
        this.notes.push(note);
        console.log(`Note has been added succesfully`);
    }
    displayCustomerInfo() {
        console.log(`ID: ${this.id}`);
        console.log(`Name ${this.name}`);
        console.log(`Email ${this.email}`);
        console.log(`Credit Score: ${this.creditScore}`);
    }
}
class VIPCustomer extends Customer {
    constructor(id, name, email, creditScore, vip) {
        super(id, name, email, creditScore);
        this.vip = vip;
    }
    discount(percentage) {
        console.log(`${this.name} (VIP: ${this.vip}) gets a ${percentage} discount on interest`);
        this.addNotes(`Offered ${percentage}% discount to vip client`);
    }
    displayCustomerInfo() {
        super.displayCustomerInfo();
        console.log(`Success`);
    }
}
const regular = new Customer("bcuer42333", "John Doe", "johndoe@gmail.com", 600);
const vip = new VIPCustomer("bovb3r34f3", "Steve Jobs", "stevejobs@gmail.com", 900, "gold");
console.log(regular.name);
regular.displayCustomerInfo();
vip.displayCustomerInfo();
vip.discount(20);
