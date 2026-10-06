const updateForm = document.getElementById ("updateForm");

updateForm.addEventListener ("submit", async (event) => {
   
    console.log ("clicked")
     event.preventDefault ();
     const id = await localStorage.getItem("userId");
     const token = await localStorage.getItem ("token");
     console.log (id);
   const email = document.getElementById("updateEmail").value;

     await fetch(`/users/user/${id}`, {
       method: "PUT",
        headers: {
           "Content-Type": "application/json",
           "Authorization": `bearer ${token}`
       },
       body: JSON.stringify({
            email
        }),
    });
    // getUsers ();
    
 });

const updateButton = document.getElementById("updateButton");
updateButton.addEventListener("click", updateForm);
