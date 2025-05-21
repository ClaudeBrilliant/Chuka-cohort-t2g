"use strict";
function userData(name) {
    return name;
}
let username = userData(5);
console.log(`Hello ${username}`);
function userDto(firstname) {
    return firstname;
}
let user1 = userDto("John Doe");
console.log(`${user1} is a valid username`);
let user2 = userDto(4657);
console.log(`${user2} is a valid user id`);
let bool1 = userDto(true);
console.log(`${bool1} should resolve to 1`);
// type PartialDto = 
function updateUser() {
}
