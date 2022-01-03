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

$(document).ready(function() {
    let rating_before = $('#user-star-1').attr("data-rating-user")
    for (let i = 1; i <= rating_before; i++) {
        let id = "user-star-" + String(i);
        $("#" + id).addClass("fa")
        $("#" + id).removeClass("far")
    }

    let notes_rating_now = parseInt($("#notes-rating").val())
    for (let i = 1; i <= notes_rating_now; i++) {
        let id = "rating-" + String(i);
        $("#" + id).addClass("star-rating-active")
    }
})

function mouseOver() {
    let id_now = $(this).attr("data-id-star")
    star = parseInt(id_now)
    for (let i = 1; i <= id_now; i++) {
        let id = "user-star-" + String(i);
        $("#" + id).addClass("fa")
        $("#" + id).removeClass("far")
    }
    for (let i = 5; i > id_now; i-- ) {
        let id = "user-star-" + String(i);
        $("#" + id).addClass("far")
        $("#" + id).removeClass("fa")
    }
    $(this).addClass("star-active")
}

function mouseOut() {
    var isHovered;
    for (let i = 1; i <= 5; i++) {
        isHovered = isHovered || $('#user-star-' + String(i)).is(":hover") 
    }
    if (!isHovered) {
        for (let i = 1; i <= 5; i++) {
            let id = "user-star-" + String(i);
            $("#" + id).addClass("far")
            $("#" + id).removeClass("fa")
        }
        let rating_before = $("#user-star-1").attr("data-rating-user")
        for (let i = 1; i <= rating_before; i++) {
            let id = "user-star-" + String(i);
            $("#" + id).addClass("fa")
            $("#" + id).removeClass("far")
        }
    }
}

$(".user-star").hover(mouseOver, function(){
    $(this).removeClass("star-active")
})

$(".star-wrap").on("mouseleave", mouseOut)

$(".user-star").click(function(e) {
    e.preventDefault();
    $('.loader-rate').show()
    let rate = $(this).attr("data-id-star")
    $(".user-star").unbind("mouseenter", mouseOver)
    $(".star-wrap").unbind('mouseleave', mouseOut)
    $.ajax({
        type: "POST",
        url: url_rate,
        data: {
            'rate': rate,
            'csrfmiddlewaretoken': token,
        },
        success: function(response) {
            if (response.status == "success") {
                for (let i = 1; i <= 5; i++) {
                    let id = "user-star-" + String(i)
                    $("#" + id).attr("data-rating-user", rate)
                }
                $(".user-star").bind("mouseenter", mouseOver)
                $(".star-wrap").bind('mouseleave', mouseOut)
                $('.loader').hide()
            }
            else {
                alert(response.message)
                $('.loader-rate').hide()
            }
        }
    })
})

let reply_on = false
$('.reply').click(function () {
    if (reply_on == true) {
        $(".reply-box-new").remove()
        reply_on = false
    }
    let reply_template = $("#reply-input-template").html()
    $(this).closest(".comment-box").append(reply_template)
    $(".reply-input").focus()
    reply_on = true
})

$("#submit-review").on("click", submit_review)

function submit_review() {
    let button = $(this)
    button.prop("disabled", true)
    $(this).unbind("click", submit_review)
    let rating_now = $("#user-star-1").attr("data-rating-user")
    if (rating_now == 0) {
        $(".message").html("You must rate this notes first")
        $(".message").show()
    }
    else {
        $(".loader-review").show()
        $(".message").hide()
        let review = $("#review").val()
        if (review == "") {
            $(".message").html("Please input your review")
            $(".message").show()
        }
        else {
            let user_id = $(this).attr("data-user-id")
            let review_url = $(this).attr("data-url-review")
            let get_comment_url = $(this).attr("data-url-get-comment")
            $.ajax({
                type: "POST",
                url: review_url,
                data: {
                    'review': review,
                    'csrfmiddlewaretoken': token,
                },
                success: function (response) {
                    let user_comment_box = $('.comment-box[data-user-id="' + user_id + '"]')
                    let review_id = response.id;
                    get_comment_url = get_comment_url.replace(/&id/g, review_id)
                    $.ajax({
                        type: "POST",
                        url: get_comment_url,
                        data: {
                            'review_id': review_id,
                            'csrfmiddlewaretoken': token,
                        },
                        success: function (response) {
                            if (response.status == "success") {
                                if (user_comment_box.length != 0) {
                                    user_comment_box.remove()
                                }
                                console.log(response)
                                $(".comments").prepend(response.html_response)
                            }
                            button.prop("disabled", false)
                            $('#review').val('')
                            $('#submit-review').bind("click", submit_review)
                            $(".loader-review").hide()
                            vote_click()
                        }
                    })
                }
            })
        }
    }
}

(function vote_click() {
    $(".fa-caret-up").on("click", function() {
        $(this).siblings(".fa-caret-down").removeClass("down-active")
        $(this).toggleClass("up-active")
        let url = $(this).attr("data-url-vote")
        if ($(this).hasClass("up-active")) {
            vote_review(url, 1)
        }
        else {
            vote_review(url, 0)
        }
    })
    
    $(".fa-caret-down").on("click", function() {
        $(this).siblings(".fa-caret-up").removeClass("up-active")
        $(this).toggleClass("down-active")
        let url = $(this).attr("data-url-vote")
        if ($(this).hasClass("down-active")) {
            vote_review(url, -1)
        }
        else {
            vote_review(url, 0)
        }
    })
})();

function vote_review(url, val) {
    $.ajax({
        type:"POST",
        url: url,
        data: {
            "value": val,
            "csrfmiddlewaretoken": token
        },
        success: function(response){
            update_vote(response.id, response.total_vote)
        }
    })
}

function update_vote(id, vote_now) {
    $('.votes-total[data-review-id="' + id  + '"').html(vote_now + " votes")
}

$(".category-tag").click(function() {
    window.location.href = $(this).attr("data-url-category")
})

$(".owner-name").click(function() {
    window.location.href = $(this).attr("data-url-user")
})