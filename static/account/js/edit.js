/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let profile = document.querySelector(".profile");
let title = document.querySelector("h2");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    profile.classList.toggle("active");
    title.classList.toggle("active");
}

let date = new Date().getTime();
$("#edit-profile").click(function() {
    let popup = document.createElement('div');
    popup.classList.add("popup-edit-profile")
    popup.innerHTML = document.getElementById('popup-block').innerHTML;
    document.querySelector(".profile").appendChild(popup);
    $("#close-popup").click(function() {
        $(".popup-edit-profile").remove()
    })

    $("#profile-image-edit-pop").click(function() {
        $("#profile-image-input").trigger("click")
    })
    
    $("#cover-image-edit-pop").click(function() {
        $("#cover-image-input").trigger("click")
    })
    
    $("#cover-image-input").on("change", function() {
        const [file] = document.querySelector("#cover-image-input").files
        if (file) {
            $("#cover-image-edit-pop").attr("src", URL.createObjectURL(file))
        }
    })
    
    $("#profile-image-input").on("change", function() {
        const [file] = document.querySelector("#profile-image-input").files
        if (file) {
            $("#profile-image-edit-pop").attr("src", URL.createObjectURL(file))
        }
    })

    let formdata = new FormData();	
    $("#profile-image-input").on("change", function() {
        var file = this.files[0];
        if (formdata) {
            formdata.append("profile", file);
        }
    });

    $("#cover-image-input").on("change", function() {
        var file = this.files[0];
        if (formdata) {
            formdata.append("cover", file);
        }
    });

    $("#submit-edit-profile").click(function(e) {
        e.preventDefault();
        const name = document.querySelector("#name-input").value
        const username = document.querySelector("#username-input").value
        const bio = document.querySelector("#bio-input").value

        formdata.append("name", name)
        formdata.append("username", username)
        formdata.append("bio", bio)
        
        $.ajax({
            type: "POST",
            url: url_profile_edit,
            data: formdata,
            processData: false,
            contentType: false,
            success: function(response) {
                response = JSON.parse(response)
                $(".popup-edit-profile").remove()
                date = new Date().getTime();
                $("#cover-image").attr("src", "/media/"+ response[0] + "?t=" + date)
                $("#profile-image").attr("src", "/media/" + response[1] + "?t=?" + date)
            },
        })
    })
})
