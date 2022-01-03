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
    let query = $(this).siblings("#search-query").val();
    search_notes(query)
})

$("#search-query").on("keypress", function (e) {
    if (e.which == 13) {
        let query = $(this).val()
        search_notes(query)
    }
})

function search_notes (query) {
    let loader = $("#loader-skeleton").html()
    $('.notes-container').html(loader)
    let url = $("#search-submit").attr("data-url-search")
    $.ajax({
        type: "POST",
        url: url,
        data: {
            "csrfmiddlewaretoken": token, 
            "query": query,
        },
        success: function(response){
            if (response.html_response != '') {
                $('.notes-container').html(response.html_response)
            } 
            else {
                $('.notes-container').html('<div class="no-notes">No notes found</div>')
            }
            clicked()
        }
    })
}

function clicked() {
    $(".notes").find('img').on("click", function () {
        let url = $(this).attr('data-link')
        view_notes(url)
    })

    $(".notes").find('h4').on("click", function () {
        let url = $(this).attr('data-link')
        view_notes(url)
    })
}
clicked()

function view_notes(url_id) {
    window.location.href = url_id
}