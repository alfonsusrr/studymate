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

let private_value = false

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
$("#save-note").click(function(e) {
    e.preventDefault()
    let valid = formEl.reportValidity()
    if (valid) {
        let title = $('#title').val()
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
})

$(".data").on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        return false
    }
})