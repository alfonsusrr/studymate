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
let page_public = 1;
let page_private = 1
$("#more-public").click(function() {
    $(this).hide()
    $("#loader-public").css("display", "block")
    $.ajax({
        type: "POST",
        url: url,
        data: {
            csrfmiddlewaretoken: token,
            private: false,
            page: page_public + 1
        },
        success: function(response) {
            $("#loader-public").css("display", "none")
            $("#public-notes").append(response.notes_html)
            console.log(response.has_next)
            if (response.has_next) {
                $('#more-public').show()
            }
            page_public += 1
            action()
        }
    })
})

$("#more-private").click(function() {
    $(this).hide()
    $("#loader-private").css("display", "block")
    $.ajax({
        type: "POST",
        url: url,
        data: {
            csrfmiddlewaretoken: token,
            private: true,
            page: page_private + 1
        },
        success: function(response) {
            $("#loader-private").css("display", "none")
            $("#private-notes").append(response.notes_html)
            console.log(response.has_next)
            if (response.has_next) {
                $('#more-private').show()
            }
            page_private += 1
            action()
        }
    })
})

function action() {
    $(".delete").click(function() {
        let notes_id = $(this).parents(".notes").find(".notes-id").val()
        let notes_is_private =  JSON.parse($(this).parents(".action").find(".notes-is-private").val())
        $(".confirm-delete").show()
        $(".delete-confirm").click(function() {
            $.ajax({
                type: "POST",
                url: url_delete,
                data: {
                    "id": notes_id, 
                    "csrfmiddlewaretoken": token
                },
                success: function() {

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: {
                            page: 1,
                            csrfmiddlewaretoken: token,
                            private: notes_is_private
                        },
                        success: function(response) {
                            if (notes_is_private) {
                                if (response.notes_html != '') {
                                    $("#private-notes").html(response.notes_html)
                                }
                                else {
                                    $("#private-notes").html('<div class="no-notes">You have no private notes</div>')
                                }
                            }
                            else {
                                if (response.notes_html != '') {
                                    $("#public-notes").html(response.notes_html)
                                }
                                else {
                                    $("#public-notes").html('<div class="no-notes">You have no public notes</div>')
                                }
                            }
                            console.log(response.has_next)
                            if (response.has_next) {
                                $('#more-private').show()
                            }
                            page_private = 1
                        }
                    })
                    $(".confirm-delete").hide()
                }
            })
        })
        $(".cancel-confirm").click(function() {
            $(".confirm-delete").hide()
        })
    })
}
action()

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
    $('#public-notes').html(loader)
    $('#private-notes').html(loader)
    $.ajax({
        type: "POST",
        url: url,
        data: {
            "csrfmiddlewaretoken": token, 
            "query": query,
        },
        success: function(response){
            if (response.public_html != '') {
                $('#public-notes').html(response.public_html)
            } 
            else {
                $('#public-notes').html('<div class="no-notes">No notes found</div>')
            }
            if (response.private_html != '') {
                $('#private-notes').html(response.private_html)
            } 
            else {
                $('#private-notes').html('<div class="no-notes">No notes found</div>')
            }
            $('#more-private').hide()
            $('#more-public').hide()
        }
    })
}