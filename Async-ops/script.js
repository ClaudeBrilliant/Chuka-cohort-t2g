const { resolve } = require("chart.js/helpers");

function fetchData(callback) {
  console.log("Starting fetch data operation...");

  setTimeout(() => {
    const data = { id: 1, name: "John Doe" };
    callback(data);
  }, 1500);
}

console.log("Program start...,");

// fetchData((data) => {
//     console.log("Data retrieved", data);

// });

// console.log("Program terminates...,");

// console.log("1. Script starts");

// setTimeout(() =>{
//     console.log("4. Timeout callback executed");

// },0)

// Promise.resolve().then(() => {
//     console.log("3. Promise resolves");

// })

// console.log("2. Script terminates");

function readFile(path, callback) {
  console.log(`Reading file from ${path}..`);

  setTimeout(() => {
    const sucess = Math.random() > 0.3;

    if (sucess) {
      const data = "This is the file content";
      callback(null, data);
    } else {
      callback(new Error("Failed to read from file, check file path"), null);
    }
  }, 1500);
}

// console.log("Program execution starts");

// readFile("home/user/Documents/text.txt", (err,data) => {
//     if(err){
//         console.log("Error: ", err.message);

//     }
//     else{
//         console.log("File data", data);

//     }
// })

// CALLBACK HELL (PROBLEM)
// function getUserData(userId, callback){
//     console.log(`Fetching data for user with ID: ${userId}..`);

//     setTimeout(() => {
//         const userData = {id: 1, name: "John Doe"};
//         callback(null, userData);
//     }, 1000);

// }

// function getUserPosts(userId, callback) {
//     console.log(`Fetching posts for user with ID: ${userId}`);

//     setTimeout(() => {
//         const posts = [
//             {id:1, title:"Hello World",content: "First post in a while"},
//             {id:2, title:"Hello Citizens of World",content: "Second post in a while"}

//         ];
//         callback(null, posts);
//     }, 1000);

// }

// function getPostComments(postId, callback){
//     console.log(`Fetching comments for post with ID: ${postId}`);

//     setTimeout(()=>{
//         const comments =[
//             {id: 1, text: "Welcome Back"},
//             {id: 2, text: "Been a while"}
//         ];

//         callback(null, comments);
//     }, 1000)

// }

// getUserData(123 , (error, user) =>{
//     if(error){
//         console.log("Error fetching user:" , error);
//         return;

//     }

// console.log("User data", user);

//     getUserPosts(user.id, (error, posts) =>{
//         if(error){
//             console.log("Error fetching posts:", posts);
//             return;
//         }

//         console.log("User posts:", posts);

//     getPostComments(posts[0].id, (error, comments) => {
//         if(error){
//             console.log("Error fetching comments:", comments);
//             return;
//         }

//         console.log("Post comments:", comments);

//     })

//     })

// })


//Promise Chaining && Error Handling
// function getUserData(userId) {
//   return new Promise((resolve, reject) => {
//     console.log("Fetching user data for ID:", userId);

//     setTimeout(() => {
//       const userData = { id: 2, name: "John Doe" };
//       resolve(userData);
//     }, 1000);
//   });
// }

// function getUserPosts(userId) {
//   return new Promise((resolve, reject) => {
//     console.log(`Fetching posts for user with ID: ${userId}`);

//     setTimeout(() => {
//       const posts = [
//         { id: 1, title: "Hello World", content: "First post in a while" },
//         {
//           id: 2,
//           title: "Hello Citizens of World",
//           content: "Second post in a while",
//         },
//       ];
//       resolve(posts);
//     }, 1000);
//   });
// }

// function getPostComments(postId) {
//   return new Promise((resolve, reject) => {
//     console.log(`Fetching comments for post with ID: ${postId}`);

//     setTimeout(() => {
//       const comments = [
//         { id: 1, text: "Welcome Back" },
//         { id: 2, text: "Been a while" },
//       ];

//       resolve(comments);
//     }, 1000);
//   });
// }


// getUserData(123)
// .then(user =>{
//     console.log("User data:", user);
//     return getUserPosts(user.id);
    
// })
// .then(posts => {
//     console.log("User posts:", posts);
//     return getPostComments(posts[0].id);
    
// })
// .then(comments =>{
//     console.log("Post comments:", comments);
    
// })

// .catch(error =>{
//     console.log("Error in the chain", error);
    
// })

// Promise methods (.all(), .any, .race())
// function getUserProfile(userId){
//     return new Promise(resolve => {
//         setTimeout(() => resolve({id:userId, name:"John Doe"}),1000)
//     })
// }

// function getUserPreferences(userId) {
//     return new Promise(resolve => {
//         setTimeout(() => resolve({theme:"dark", notifications: true }),1000)
//     })
// }

// function getUserFriends(userId) {
//     return new Promise(resolve => {
//         setTimeout(() =>(["John", "James", "June", "Jake"]),1000)
//     })
// }

// console.log("Fetching all relevant user intel..");

// const userId = 123;

// Promise.all([
//     getUserProfile(userId),
//     getUserPreferences(userId),
//     getUserFriends(userId)
// ])
// .then(([profile,preferences, friends]) => {
//     console.log("User profile", profile);
//     console.log("User preferences", preferences);
//     console.log("User friends", friends);
//     console.log("All the data has been loaded");
    
    
    
// }) 
// .catch(error => {
//     console.log("One of the requests failed:", error);
    
// }) 


// Promise.race([
//     new Promise(resolve => setTimeout(() => resolve("This is a fast API"), 800)),
//     new Promise(resolve => setTimeout(() => resolve("This is a slow API"), 1500))

// ])
// .then(winner =>{
//     console.log("The winner is:", winner);
    
// })


// Promise.any([
//     new Promise((_,reject) => setTimeout(() => reject(new Error("Failed to get data")), 800)),
//     new Promise(resolve => setTimeout(() => resolve("This is a slow API"), 1500))

// ])
// .then(resolves =>{
//     console.log("The API that resolves is:", resolves);
    
// })


function fetchData () {
    return new Promise((resolve, reject) =>{
        console.log("Fetching data....");
        setTimeout(() =>{
            const success = Math.random() > 0.2;

            if(success) {
                resolve({id:1, name:"John Doe"})

            }
            else{
                reject(new Error("Failed to fetch data"))
            }
        }, 1500)
        
    })
}


async function getData(){
    console.log("Starting async op");

    try{
        const data = await fetchData();
        console.log(
            "Data retrieved", data
        );
        
    }
    catch(error){
        console.log("Error caught :", error);
        
    } finally{
        console.log("Op completed");
        
    }

      
}

console.log("Program starts now");
getData();

