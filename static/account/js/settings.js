/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let options = document.querySelector(".options");
let title = document.querySelector("h2");
let display = document.querySelector(".display");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    options.classList.toggle("active");
    title.classList.toggle("active");
    display.classList.toggle("active");
}

let contact = document.querySelector(".contact");

contact.onclick = function(){
    contact.classList.toggle("on");
}

let add = document.querySelector(".add");

var counter = 0

add.onclick = function(){
    counter += 1
    if(counter > 4){
        return
    }
    document.getElementById("added").innerHTML += "<input class='display_text' placeholder='Enter a Text' type='text'><br>";
}