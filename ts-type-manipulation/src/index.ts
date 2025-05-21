
// Before generics - not reusable
function getStringArray(items:string[]): string[]{
    console.log(items);
    
    return items.slice();
}

function getNumberArray(items: number[]): number[] {
    console.log(items);
    
    return items.slice();
}

// getStringArray(["John Doe", "John Smith", "Jane Doe", "XYZ"]);

// getNumberArray([1,2,3,4,5,6,7,8,9,10]);

//With generics - one function for all types
function getArray<K>(items: K[]): K[]{
    console.log(items);
    return items.slice()
    
}

getArray(["John Doe", "John Smith", "Jane Doe", "XYZ"]);
getArray([1,2,3,4,5,6,7,8,9,10]);

//Scenario: API Responses
interface ApiResponse<T> {
    data:T;
    status: 'sucess' | 'error';
    timestamp: number;
}
interface User{
    id:string;
    name: string;
    password: string;
    email:string;
    profileImage: string;

}
interface Product{
    id: string;
    name:string,
    price: number;
    quantity: number;
    reviews: string;
    rating:number;
    inStock: boolean;
}
type UserResponse = ApiResponse<User>;
type ProductResponse = ApiResponse<Product>

// retreives key's of a certain object
type userKeys = keyof User;

//Building a type-safe property getter
function getProperty<T, K extends keyof T>(obj: T, key: K){
    return obj[key];
}

const user :User ={
    id:"bcueibc",
    name: "John Doe",
    email: "johndoe@yopmail.com",
    password: "1234buer5",
    profileImage: "image.jpeg"
};

console.log(getProperty(user, "id"));
console.log(getProperty(user, "password"));

//Conditional type syntac
type isString<T> = T extends string ? true : false;

type Test1 = isString<string> //true

type Test2 = isString<number> //false

type Test3 = isString<"hello world"> //true


//Mapped Types
type MakeOptional <T> = {
    [L in keyof T]? : T[L];
};

type OptionalUser = MakeOptional<User>

//converting a type to string
type Stringify<T> = {
    [K in keyof T]: string;
}

type UpdatedProduct = Stringify<Product>

//converting a type to nulable
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
}

type NullableProduct = Nullable<Product>

// Template literal types
type Greeting = `Hello ${string}`

const welcome: Greeting = "Hello World"

type isActive = `Said account is active ${boolean}`;

const st: isActive =  `Said account is active true`