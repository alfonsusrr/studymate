/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let setpublic = document.querySelector(".public")
let setprivate = document.querySelector(".private")
let data = document.querySelector(".data")
let title = document.querySelector("h2")

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    data.classList.toggle("active");
    title.classList.toggle("active");
}

setpublic.onclick = function(){
    setpublic.classList.toggle("unselected")
    setprivate.classList.toggle("selected")
}

setprivate.onclick = function(){
    setprivate.classList.toggle("selected")
    setpublic.classList.toggle("unselected")
}