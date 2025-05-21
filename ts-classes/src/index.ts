// Dog class (without interface)
// class Dog {
//     constructor(public name:string, public breed: string){
//         console.log(`${this.name} is of breed ${this.breed} !!`);
        
//     }

//     bark(): void{
//         console.log(`${this.name} is barking`);
        
//     }

//     fetch(item: string): void{
//         console.log(`${this.name} fetches the ${item}`);
        
//     }
// }

// const Rex = new Dog("Rex", "Golden Retreiver");
// const Tom = new Dog("Tom", "Borebell");

// Rex.bark();
// Tom.fetch("ball")

// console.log();


interface Animal {
    name: string;
    makeSound():void;
    move():void
}

class Dog implements Animal{
    constructor(public name:string, public breed: string){
        console.log(`${this.name} is of breed ${this.breed}`);
        
    }

    bark(): void{
        console.log(`${this.name} is barking`);
        
    }

    fetch(item: string): void{
        console.log(`${this.name} fetches the ${item}`);
        
    }

    makeSound(): void {
        this.bark();
    }

    move(): void {
        console.log(`${this.name} moves on four legs.`);
        
    }
}

class Cat implements Animal {
    constructor(public name:string, public color:string){
        console.log(`${this.name} the ${this.color} cat is a menace`);
    }

    purr():void {
        console.log(`${this.name} purrs`);
        
    }

    makeSound():void{
        this.purr();
    }

    move(): void {
        console.log(`${this.name} moves silently`);
        
    }
}



abstract class Shape{
    constructor(public color: string){}

    abstract getArea(): number;

    displayColor(): void{
        console.log(`color ${this.color}`);
        
    }
}


class Circle extends Shape{
    constructor(color: string, public radius: number){
        super(color)
    }

    getArea(): number {
      return  Math.PI * this.radius *this.radius;
    }
}

class Rectangle extends Shape{
    constructor(color:string, public width:number, public height: number){
        super(color)
    }

    getArea(): number {
        return this.width * this.height;
    }
}

// const triangle = new Shape("red")

const circle = new Circle("Blue", 7);

circle.displayColor();

console.log(`The area of this circle is: ${circle.getArea()}`);


const rectangle = new Rectangle("Green", 4,6);

rectangle.displayColor();

console.log(`The area of this circle is: ${rectangle.getArea()}`);



class Customer{
    public id: string;
    public name: string;
    public email: string;

    private creditScore: number;
    protected notes: string[];

    constructor(id: string, name: string, email:string, creditScore:number){
        this.id =id;
        this.name = name;
        this.creditScore = creditScore;
        this.email = email;
        this.notes = [];
    }

    public getCreditScore(): number{
        return this.creditScore;
    }

    protected addNotes(note:string){
        this.notes.push(note);
        console.log(`Note has been added succesfully`);
        
    }

    public displayCustomerInfo(){
        console.log(`ID: ${this.id}`);

        console.log(`Name ${this.name}`);
        console.log(`Email ${this.email}`);
        console.log(`Credit Score: ${this.creditScore}`);
        
        
        
    }
}

class VIPCustomer extends Customer{
    public vip: string;

    constructor(id:string, name: string, email:string, creditScore: number, vip: string){
        super(id, name, email, creditScore);
        this.vip = vip
    }

    public discount(percentage: number){
        console.log(`${this.name} (VIP: ${this.vip}) gets a ${percentage} discount on interest`);
        this.addNotes(`Offered ${percentage}% discount to vip client`)
    }

    public displayCustomerInfo(): void {
        super.displayCustomerInfo();
        console.log(`Success`);
        
    }
}


const regular = new Customer("bcuer42333", "John Doe", "johndoe@gmail.com", 600);
const vip = new VIPCustomer("bovb3r34f3", "Steve Jobs", "stevejobs@gmail.com", 900,"gold")

console.log(regular.name);
regular.displayCustomerInfo();

vip.displayCustomerInfo();
vip.discount(20);
