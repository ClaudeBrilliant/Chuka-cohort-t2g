let num1 = 15;

if(num1 % 2 === 0){
    console.log(`${num1} is divisible by 2`);
    
}
else {
    console.log(`${num1} is not divisible by 2`);
    
}


function divisibleBySix(num){
    if(num % 2 === 0 && num % 3 === 0){
        console.log(`${num} is divisible by 6`);
        
    }
    // else if (num % 3 ===0){
    //     console.log(`${num} is divisible by 3`);
        
    // }
    else{
        console.log(`${num} is not divisible by 6`);
    }
}

// divisibleBySix(15);

function scores(grade){
    if (grade < 40 || grade === 'F') {
        console.log('Student should retake the exam');
        
    }

    else if (grade >= 40 || grade === 'D'){
        console.log('Student shold work harder');
        

    }
    else if (grade >= 50 || grade === 'C'){
        console.log('Student should work smart');
        
    }


}

// scores(50);


const isMember = false;
const hasCoupon = false;
const cartTotal = 150;

if(isMember || hasCoupon){
    console.log("You qualify for free shipping");
    
}
else if (!hasCoupon && cartTotal > 100){
    console.log('You qualify for a discount');
    
}


const day =3

let weekDay;

switch (day){
    case 1:
        weekDay ="Monday";
    break;
    case 2:
        weekDay = "Tuesday";
    break;
    case 3:
        weekDay = "Wednesday";
    break;
    case 4:
        weekDay = "Thursday";
    break;
    case 5:
        weekDay = "Friday"
    break;
    default:
        weekDay = "Day does not exist"
}

console.log(weekDay);


function isAdult(age){
    let access = age > 18 ? 'granted':'denied'

    console.log(access);
    

}

isAdult(10);
