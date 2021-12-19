/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let search = document.querySelector(".search");
let privateNote = document.querySelector(".private")
let publicNote = document.querySelector(".public")

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    search.classList.toggle("active");
    privateNote.classList.toggle("active");
    publicNote.classList.toggle("active");
}