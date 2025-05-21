interface PersonalInfo{
    firstName: string;
    lastname: string;
    email: string;
    profileImage?:string
}

interface Address {
    street:string;
    city:string;
    zipCode: string;
    country: string;
}

interface AccountInfo{
    userId: string;
    createdAt: Date;
    isActive:boolean;

}
// Intersection type combining three interfaces
type Customer = PersonalInfo & Address & AccountInfo;

const customer :Customer = {
    //Personal Info properties
    firstName: "John",
    lastname:"Doe",
    email:"johndoe@yopmail.com",
    profileImage: "profile.jpeg",

    //Address properties
    street: "Kanu Street",
    city:"Nakuru",
    zipCode: "165184",
    country:"Kenya",

    //Account properties
    userId: "user1",
    createdAt: new Date(),
    isActive: true
}


interface Track {
    track():void
}

interface Save{
    save():Promise<void>;
}

//Method intersection
type OrderDto = Track & Save;

class Order implements OrderDto {
    constructor(public orderId: string, public amount:number){}

    track(): void {
        console.log(`Tracking order ${this.orderId}`);
        
    }

    async save() {
        console.log(`Saving order ${this.orderId} to db`);
        
        
    }
}

const order = new Order("u3v24", 5000);

// order.track();
// order.save();
//Union type
type PaymentAmount = string | number;
//Using typeof typeguard
function processPayment(amount: PaymentAmount){
    if(typeof amount === "string") {
        const charge = parseFloat(amount) * 2.5
        console.log(charge);
        
    }
    else{
        const charge = amount * 2.5;
        console.log(charge);
        
         
    }
}

processPayment(100);
processPayment("100");


interface CreditCardPayment{
    type: "creditCard";
    cardNumber: string;
    expiryDate: string;
}

interface PaypalPayment{
    type: "paypal";
    email: string;
}

interface BankPayment{
    type:"bank";
    accountNumber: string;
    routingNumber: string
}
//Uniion type
type Payment = CreditCardPayment | PaypalPayment | BankPayment;
// Using the 'in' operator guard
function validatePayment(payment: Payment){
    if("cardNumber" in payment) {
        console.log(`Processing card payment for card ending in ${payment.cardNumber.slice(-4)}`);
        
    }
    else if ("email" in payment) {
        console.log(`Processing paypal payment for user with email: ${payment.email}`);
        
    }
    else{
        console.log(`Processing bank transfer for account ${payment.accountNumber}`);
        
    }
}
// validatePayment("bank", "email@gmail.com")
const creditCardDetails: CreditCardPayment = {
    type: "creditCard",
    cardNumber: "1234567890123456",
    expiryDate: "12/28"
};
validatePayment(creditCardDetails);

// Paypal
const paypalDetails: PaypalPayment = {
    type: "paypal",
    email: "johndoe@yopmail.com"
};
validatePayment(paypalDetails);

// Bank Transfer
const bankDetails: BankPayment = {
    type: "bank",
    accountNumber: "987654321",
    routingNumber: "123456"
};
validatePayment(bankDetails);

class Product{
    constructor(public id:string, public name:string){

    }

     
}


class DigitalProduct extends Product {
    constructor(id: string, name: string,  public downloadUrl: string){
        super(id, name)
    }
}


class PhysicalProduct extends Product{
    constructor(id: string, name: string, public weight:number){
        super(id, name);
    }

}
//instanceOf guard
function calaculateShipping(product: Product):number{
    if(product instanceof DigitalProduct){
        
        return 0;
    }

    else if ( product instanceof PhysicalProduct){
        return product.weight * 5;
    }
    else{
        return 5;
    }
}

interface ProductData {
    id:string;
    name:string;
    price:number;
    category:string;
}

function fetchProduct(): unknown {
    return {
        id: "rgfvb54",
        name: "Lenovo Legion",
        price: 80000,
        category: "Elecronic and appliances"
    }
}
//Typecasting
function processProduct() {
    const data = fetchProduct();

    //Type Casting Method 1
    const product = data as ProductData;

    //Type Casting Method 2
    const product2 = <ProductData>data;
    console.log(product);
    
    console.log(product2);
    
}

// processProduct()

//Type guard + casting
function isProductData(data: unknown): data is ProductData{
    return typeof data === "object" &&
    data !== null &&
    typeof (data as any).id === "string" &&
    typeof (data as any).name === "string" &&
    typeof (data as any).price === "number"
}


function safeProcessProduct(){
    const data = fetchProduct();

    if(isProductData(data)) {
        console.log(`Product: ${data.name}, Price: ${data.price}, Category: ${data.category}`);
        
    } else{
        console.log("Invalid product data received");
        
    }
}

safeProcessProduct()