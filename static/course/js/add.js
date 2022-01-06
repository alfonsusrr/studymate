/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let setpublic = document.querySelector(".public")
let setprivate = document.querySelector(".private")
let data = document.querySelector(".page-wrapper")

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    data.classList.toggle("active");
}

function publish (data_content) {
    let valid = true
    $(".req-input").each(function() {
        if ($(this).val() == '') {
            $(this).siblings(".label-input").children(".required-message").show()
            valid = false
        }
        else {
            $(this).siblings(".label-input").children(".required-message").hide()
        }
    })
    if (valid) {
        let part = parseInt($(this).parents(".data-container").attr("data-id-part"))
        $(".data-" + String(part)).hide()
        $(".data-" + String(part + 1)).show()
    }
    console.log(data_content)
}

function add_instructor() {
    let name = $("#instructors-input").val()

    if (name == '') {
        $(this).parents(".input-wrapper").siblings(".label-input").children(".required-message").show()
    }
    else {
        $(this).parents(".input-wrapper").siblings(".label-input").children(".required-message").hide()
        let instructor_card = $("#instructor-card").html()
        instructor_card = instructor_card.replace(/&name&/g, name)
        $(".instructors").append(instructor_card)

        delete_instructor()
        input_instructor_img()
        $("#instructors-input").val("")
    }
}

function delete_instructor () {
    $(".delete-instructor").click(function () {
        $(this).parents(".instructor-card").remove()
    })
}

function input_instructor_img () {
    $(".instructor-img-image").click(function () {
        $(this).siblings(".input-instructor-img").trigger("click")
    })

    $(".input-instructor-img").on("change", function() {
        const file = $(this).prop("files")[0]
        if (file) {
            $(this).siblings(".instructor-img-image").attr("src", URL.createObjectURL(file))
        }
    })
}
