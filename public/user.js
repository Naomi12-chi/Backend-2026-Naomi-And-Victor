const userInfo = document.getElementById ("userInfo");

async function getUser () {
    console.log ("clicked")
    const id = await localStorage.getItem("userId");
    const token = await localStorage.getItem ("token");
    console.log (id, token);
    const response = await fetch(`/users/${id}`, {
         method: "GET",
         headers: {
             "Content-Type": "application/json",
            "Authorization": `bearer ${token}`
        },
       
    });
     console.log (response)
     const user = await response.json();
     console.log(user)
    userInfo.innerHTML = "";
    const userDetails = document.createElement("div");
    userDetails.className = "user-details";
    userDetails.innerHTML = `
       <a href="user.html">
       
      <h3>${user.email}</h3>
      <p>${user.role}</p>
      </a>`;
      
      userInfo.appendChild (userDetails)

}
getUser();