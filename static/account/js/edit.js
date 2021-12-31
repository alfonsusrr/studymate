/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let profile = document.querySelector(".profile");
let title = document.querySelector("h2");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    profile.classList.toggle("active");
    title.classList.toggle("active");
}