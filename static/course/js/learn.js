/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let content = document.querySelector(".content");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    content.classList.toggle("active");
}

let enroll = document.querySelector(".enroll");

enroll.onclick = function() {
    let ans = confirm("Are You Sure You Want to Un-Enroll?");
    if (ans){
        console.log("Back to unenrolled page");
        return;
    }
}