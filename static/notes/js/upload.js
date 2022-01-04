/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let data = document.querySelector(".data")
let title = document.querySelector("h2")

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    data.classList.toggle("active");
    title.classList.toggle("active");
}

$('.delete-tag').click(function() {
    $(this).parent().remove()
})

$('#category-input').on("keypress", function(e) {
    if(e.which == 13) {
        if ($(this).val()) {
            let tag_card = document.createElement("div")
            tag_card.classList.add("category-tag")
            let category = $("#category-tag-html").html();
            tag_card.innerHTML = category;
            tag_card.querySelector('.tag').innerHTML = $(this).val()
            $('.category-container').append(tag_card)
            $(this).val("")

            
            $('.delete-tag').click(function() {
                $(this).parent().remove()
            })
        }
    }
})
let formdata = new FormData()
$("#file").on("change", function() {
    const [file] = document.querySelector("#file").files
    if (file) {
        $("#file-viewer").attr("src", URL.createObjectURL(file))
        $("#file-viewer").show()
        formdata.append("file", file)
    }
})

let formEl = document.querySelector(".data");
$("#save-note").on("click", function(e) {
    // Disable button
    $("#cancel-edit").prop("disabled", true)
    $("#save-note").prop("disabled", true)
    $(this).addClass("disabled")
    // Show loader
    $(".loader-upload").show()
    $(".loader").show()

    let id = $(this).attr("data-note-id")
    let data_new = $(this).attr("data-new")

    let title = $('#title').val()
    let file = $('#file').val()

    let valid = true;
    if (data_new == "true")
        if (file == '') {
            $("#file-required").show()
            valid = false
        }

    if (title == "") {
        $("#title-required").show()
        valid = false
    }

    if (valid) {
        let desc = $('#desc').val()
        let allCategory = $('.tag');
        let categories = []
        for (let i = 0; i < allCategory.length; i++) {
            categories.push(allCategory[i].innerHTML)
        }

        categories = JSON.stringify(categories)

        formdata.append("title", title)
        formdata.append("desc", desc)
        formdata.append("category", categories)
        formdata.append("private", private_value)
        formdata.append("id", id)
        formdata.append("new", data_new)
        $.ajax({
            type: "POST",
            url: url,
            data: formdata,
            processData: false,
		    contentType: false,
            success: function(response) {
                $(".loader").hide()
                $(".upload-message").show()
                if (response.status == "success") {
                    $("#success").show()
                    $("#failed").hide()
                    $(".status-message").html("File is sucessfully uploaded!")
                    $("#go-notes-btn").show()
                    $("#back-btn").show()
                    $("#close-btn").hide()

                    $("#back-btn").click(function() {
                        history.back()
                    })

                    $("#go-notes-btn").click(function() {
                        window.location.href = response.notes_url
                    })
                }
                else {
                    $("#success").hide()
                    $("#failed").show()
                    $(".status-message").html("File is failed to be uploaded! Please try again")
                    $("#go-notes-btn").hide()
                    $("#back-btn").hide()
                    $("#close-btn").show()

                    $("#close-btn").click(function() {
                        $(".loader-upload").hide()
                    })
                } 
                $("#cancel-edit").prop("disabled", false)
                $("#save-note").prop("disabled", false)
                $("#save-note").removeClass("disabled")
            }
        })
    }
    $("#file-required").hide()
    $("#title-required").hide()
    $(this).prop("disabled", false)
})

$(".data").on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        return false
    }
})

$("#private").click(function() {
    private_value = !private_value
})

$("#cancel-edit").click(function() {
    history.back()
})

