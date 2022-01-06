/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let page = document.querySelector(".page-wrapper")

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    page.classList.toggle("active");
}


$(".nav-btn").click(function() {
    $(".nav-active").removeClass("nav-active")
    $(this).addClass("nav-active")
})

$("#nav-in-progress").click(function () {
    $(".in-progress").show()
    $(".completed").hide()
    $(".by-me").hide()
})

$("#nav-completed").click(function () {
    $(".in-progress").hide()
    $(".completed").show()
    $(".by-me").hide()
})

$("#nav-by-me").click(function () {
    $(".in-progress").hide()
    $(".completed").hide()
    $(".by-me").show()
})

$("#add-course").click(function() {
    window.location.href = $(this).attr("data-link")
})