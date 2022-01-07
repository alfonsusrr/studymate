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

$(document).ready(function() {
    let course_rating_now = parseInt($("#course-rating").val())
    for (let i = 1; i <= course_rating_now; i++) {
        let id = "rating-" + String(i);
        $("#" + id).addClass("star-rating-active")
    }
})

$(".week-content-title").click(function () {
    $(this).siblings(".content-box-wrapper").slideToggle("fast")
    $(this).find(".expand-icon").toggleClass("rotated")
})

$("#enroll").click(function() {
    $.ajax({
        type: "POST",
        url: url_enroll,
        data: {
            "csrfmiddlewaretoken": token
        },
        success: function(response) {
            if (response.status == "success") {
                window.location.href = url_continue
            }
        }
    })
})
$("#resume").click(function() {
    window.location.href = url_continue
})