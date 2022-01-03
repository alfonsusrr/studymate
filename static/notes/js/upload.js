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
    private_value = false
}

setprivate.onclick = function(){
    setprivate.classList.toggle("selected")
    setpublic.classList.toggle("unselected")
    private_value = true
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
    $(this).prop("disabled", true)
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
                alert("Uploaded!")
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