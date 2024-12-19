document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM loaded");

    //linking button
    let button = document.getElementById("contact_tab");

    button.addEventListener("click", () => {
        window.location.href = "contact.html";
    });

});


