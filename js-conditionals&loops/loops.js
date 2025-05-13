// for(initialization: condition: increment/ decrement){}

for (let i = 0; i <= 5; i++){
    console.log(`Iteration ${i}`);
    
}

// while(condition){

// increment/decrement
// }
let counter = 0;

while(counter <= 5){
    console.log(`Count ${counter}`);
    counter++;
}

// do{
//     block
// increment/decrement
// } while(condition ==true)


let num =1;
do{
    console.log(`Number ${num}`);
    num++
    
}while(num <= 5);


const cars =["BMW", "Porsche", "VW", "Audi", "Aston Martin"];

for(const car of cars){
    console.log(car);
    
}


let user = {
    name: "Brian Kimutai",
    age: 20,
    weight: 70,
    height: 185

}

for(const property in user){
    console.log(`${property}: ${user[property]}`);
    
}

for (let i = 0; i <= 5; i++){
    if(i ===3){
        break;
    }
    console.log(`Lcontrol ${i}`);
    
}

for (let i = 0; i <= 5; i++){
    if(i ===3){
        continue;
    }
    console.log(`Lcontrol(cont) ${i}`);
    
}


for (let i =1; i <= 5; i++){
    let row = "";
    for(let j = 1; j <= i; j++)
    {
        row += "* "
    }

    console.log(row);
    
}

const numbers =[1,2,3,4,5,6,7,8,9,10];

for(let i = 0; i < numbers.length; i++){
    if(numbers[i] % 2 === 0){
        if(numbers[i] % 4 === 0){
            console.log(`${numbers[i]} is divisible by 4`);
            
        }
        else{
            console.log(`${numbers[i]} is even but not divisible by 4`);
            
        }
    }
    else{
        console.log(`${numbers[i]} is odd`);
        
    }
}