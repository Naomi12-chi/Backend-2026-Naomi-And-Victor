const userInfo = document.getElementById ("userInfo");
const deleteButton = document.getElementById("deleteButton")
const deleteContainer = document.getElementById("deleteContainer")

deleteButton.addEventListener("click", deleteUser)

async function getUser () {
    console.log ("clicked")
    const id = await localStorage.getItem("userId");
    const token = await localStorage.getItem ("token");
    console.log (id, token);
    const response = await fetch(`/users/user/${id}`, {
         method: "GET",
         headers: {
             "Content-Type": "application/json"
        },
       
    });
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
      console.log(userDetails)
      
      userInfo.appendChild (userDetails)
      console.log(userInfo)

}

async function deleteUser() {
  const id = await localStorage.getItem("userId");
  const token = await localStorage.getItem("token");
  await fetch(
    `/users/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  document.location.href = "index.html";
}
getUser();