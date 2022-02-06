/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let search = document.querySelector(".search");
let publicNote = document.querySelector(".public")

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    search.classList.toggle("active");
    publicNote.classList.toggle("active");
}

$("#search-submit").click(function () {
    submitQuery()
})

$("#search-query").keypress(function (e) {
    if (e.which == 13) {
        submitQuery()
    }
})

function submitQuery() {
    let query = $("#search-query").val();
    let submitURL = $("#search-submit").attr("data-url-search")

    if (query != "") {
        let loader = $("#loader-skeleton").html()
        $('.course-container').html(loader)
        $.ajax({
            type: "GET",
            url: submitURL, 
            data: {
                "query": query
            },
            success: function(response) {
                console.log(response)
                $(".course-container").html(response.html)
                courseClick()
            }
        })
    }
}

function courseClick() {
    $(".course-link").click(function() {
        let url = $(this).attr("data-link")
        window.location.href = url
    })
}
