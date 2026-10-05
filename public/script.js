const form = document.getElementById("userForm");
const usersContainer = document.getElementById("users");
const loginForm = document.getElementById("loginForm");

// const deleteButton = document.getElementById ("deleteButton");
// const userCard = document.querySelectorAll(".users");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

   const response = await fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
           email,
            password
        }),
    });

    const data = await response.json();
    console.log(data);
    form.reset();
    getUsers();
 });

 async function getUsers() {
    const response = await fetch("/users");
    const users = await response.json();
    usersContainer.innerHTML = "";

   users.forEach((user) => {
    console.log(user)
    const deleteButton = document.createElement ("button");
    deleteButton.className = "delete-button"
    deleteButton.innerHTML = "Delete account";

    
       const div = document.createElement("div");
       div.className = "user";
       div.innerHTML = `
       <a href="user.html">
      <h3>${user.email}</h3>
      <p>${user.role}</p>
      <img id="userImg" src="/users/profile-picture/${user.profilePicture}" alt="profile-picture">
      </a>
      `;

      
        usersContainer.appendChild(div);
         div.appendChild(deleteButton);

         div.addEventListener("click", () => {
            document.location.href = "user.html";
         })
        deleteButton.addEventListener("click", deleteUser)
        
        
    });
}

// log in user
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password
        }),
    });

   const data = await response.json();
    console.log(data.userId);
   localStorage.setItem ("userId",data.userId)
   localStorage.setItem ("token",data.token);
   
   
 });
 
 // delete user
  
 async function deleteUser () {
  const id = await localStorage.getItem("userId");
  const token = await localStorage.getItem ("token");
  await fetch(`/users/${id}`, 
     {
        method: "DELETE",
        headers: {
             "Content-Type": "application/json",
              "Authorization": `bearer ${token}`
      },    
     });
     getUsers();
 };
  
 getUsers();