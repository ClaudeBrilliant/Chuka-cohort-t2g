function userData(name: any): any {
    return name;
}

let username =userData(5);

console.log(`Hello ${username}`);


function userDto<T>(firstname: T): T {
    return firstname;
}

let user1 = userDto("John Doe");
console.log(`${user1} is a valid username`);


let user2 = userDto(4657)
console.log(`${user2} is a valid user id`);

let bool1 = userDto(true);
console.log(`${bool1} should resolve to 1`);


interface User {
    id: number;
    name:string;
    email: string;
    profileImage?: string;
    posts: string[];
    comments:string[];
    Likes: string[];
    isActive: boolean;

}

interface Social{
    posts: string[];
    comments:string[];
    Likes: string[];
}

// type PartialDto = 
function updateUser(user: Partial<User>){
        user.name = "Jane Doe";
        user.email = "janedoe@yopmail.com";
        user.profileImage = "image.jpeg";
}

function deleteUser(user: User){
    console.log(`${user.name} has been deleted permernently`);
}



