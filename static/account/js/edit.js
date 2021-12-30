/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let profile = document.querySelector(".profile");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    profile.classList.toggle("active");
}