/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
}

let up = document.querySelector(".goUp");

up.onclick = function(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function heart(){
    this.classList.toggle("fa-heart-o");
}

let comment = document.querySelector(".fa-comment-o");

comment.onclick = function(){
    comment.classList.toggle("fa-comment-o");
}

let bookmark = document.querySelector(".fa-bookmark-o");

bookmark.onclick = function(){
    bookmark.classList.toggle("fa-bookmark-o");
}