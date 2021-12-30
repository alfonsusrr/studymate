/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let options = document.querySelector(".options");
let title = document.querySelector("h2");
let display = document.querySelector(".display");
let text_id_list = [2,3,4,5];
let video_id_list = [2,3,4,5];
btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    options.classList.toggle("active");
    title.classList.toggle("active");
    display.classList.toggle("active");
}

let contact = document.querySelector(".contact");

contact.onclick = function(){
    contact.classList.toggle("on");
}

let add_text = document.querySelector("#add-text");
let add_video =document.querySelector("#add-video");

if (private == "True") {
    private = true;
    contact.classList.toggle("on");
}
else {
    private = false;
}

if (default_image == "True") {
    default_image = true;
    document.querySelector("#default-image").classList.toggle("on");
}
else {
    default_image = false;
}

if (default_music == "True") {
    default_music = true;
    document.querySelector("#default-music").classList.toggle("on");
}
else {
    default_music = false;
}

if (default_text == "True") {
    default_text = true;
    document.querySelector("#default-text").classList.toggle("on");
}
else {
    default_text = false;
}

var counter_text = 1;
var counter_video = 1;
add_text.onclick = function(){
    counter_text += 1
    if(counter_text > 5){
        return
    }
    addTextSlot(counter_text-1)
}

add_video.onclick = function(){
    counter_video += 1
    if(counter_video > 5){
        return
    }
    addMusicSlot(counter_video-1)
}

$("#private").click(function () {
    private = !private
})

let image_method = "link";
$("#method-image").change(function () {
    var method = $(this).find("option:selected").attr("value");
    var input = document.querySelector("#background-image");
    if (method == "link") {
        input.type = "text"
        image_method = "link"
        if (formdata.get("image") != null) {
            formdata.delete("image")
        }
    }
    else {
        input.type = "file"
        input.accept = "image/png, image/jpeg, image/jpg"
        image_method = "local"
    }
})

$("#default-music").click(function() {
    if (!default_music) {
        $(this).addClass("on");
    }
    else {
        $(this).removeClass("on");
        $("#background-music-1").prop("required", true)
    }
    default_music = !default_music
})

$("#default-image").click(function() {
    if (!default_image) {
        $(this).addClass("on");
    }
    else {
        $(this).removeClass("on");
        $("#background-image").prop("required", true)
    }
    default_image = !default_image
})

$("#default-text").click(function() {
    if (!default_text) {
        $(this).addClass("on");
    }
    else {
        $(this).removeClass("on");
        $("#text-1").prop("required", true)
    }
    default_text = !default_text
});

let formdata = new FormData();	

$("#background-image").on("change", function() {
    if ($(this).attr("type") == "file") {
        var file = this.files[0];
        if (formdata) {
            formdata.append("image", file);
        }
    }
});

$("#submit").click(function(e) {
    var data = formdata;
    data.append("default_music", default_music)
    data.append("default_image", default_image)
    data.append("default_text", default_text)
    data.append("private", private)
    if (image_method == "link"){
        image_link_input = document.querySelector("#background-image").value
        if (image_link_input != "") {
            data.append("image", image_link_input);
            data.append("method", "link")
            data.append("image_change", "True")
        }
        else {
            data.append("method", "link")
            data.append("image_change", "False")
        }
    }
    else {
        if (formdata.get("image") != null) {
            data.append("method", "local")
            data.append("image_change", "True")
        }
        else {
            data.append("method", "local")
            data.append("image_change", "False")
        }
    }

    var text_input = []
    var music_input = []
    var text_added = document.querySelector("#added-text")
    var video_added = document.querySelector("#added-video")
    for (let i = 0; i < counter_text; i++) {
        if (i == 0) {
            let text = document.querySelector("#text-1").value
            if (text != ""){
                text = text.replaceAll(",", "&comma")
                text_input.push(text)
            }
        }
        else {
            let text = text_added.children[i-1].children[0].value
            if (text != ""){
                text = text.replaceAll(",", "&comma")
                text_input.push(text)
            }
        }
    }

    for (let i = 0; i < counter_video; i++) {
        if (i == 0) {
            let music = document.querySelector("#background-music-1").value
            if (music != ""){
                music_input.push(music)
            }
        }
        else {
            let music = video_added.children[i-1].children[0].value
            if (music != ""){
                music_input.push(music)
            }
        }

        data.append("music", music_input)
        data.append("text", text_input)
    }

    $.ajax({
        type: "POST",
        url: url,
        processData: false,
		contentType: false,
        data: data,
        success: function(response) {
            if (response != "None") {
                var timestamp = new Date().getTime();  
                if (image_method == "link") {
                    $("#display-image").attr("src", response)
                }
                else {
                    $("#display-image").attr("src", response + "?t=" + timestamp)
                }
            }
        }
    })
})

if (method_image == "link") {
    $("#display-image").attr("src", image)
    $("#background-image").attr("value", image)
}
else if(method_image == "local") {
    let path = "/media/" + image
    $("#display-image").attr("src", path)
}

function addMusicSlot(i) {
    let video_id = video_id_list.pop()
    let parent = document.getElementById("added-video")
    let newElement = document.createElement('div');
    newElement.innerHTML += '' +
        '<input id="background-music-'+ video_id +'" class="display_text" placeholder="Enter a Text" type="text">' +
        '<button id="delete-text-'+ video_id +'" class="delete-button delete-video" type="button"><i class="fa fa-trash-o"></i></button>';
    newElement.classList.add("input-box")
    newElement.setAttribute("id", video_id)
    parent.appendChild(newElement)
    return video_id
}

function addTextSlot(i) {
    let text_id = text_id_list.pop()
    let parent = document.getElementById("added-text")
    let newElement = document.createElement('div');
    newElement.innerHTML += '' +
        '<input id="text-'+ text_id +'" class="display_text" placeholder="Enter a Text" type="text">' +
        '<button id="delete-text-'+ text_id +'" class="delete-button delete-text" type="button"><i class="fa fa-trash-o"></i></button>';
    newElement.classList.add("input-box")
    newElement.setAttribute("id", text_id)
    parent.appendChild(newElement)
    return text_id
}

if (music.length != 0) {
    for (let i = 0; i < music.length; i++) {
        if (i == 0){
            $("#background-music-1").attr("value", music[0])
        }
        else{
            counter_video += 1
            let idAdded = addMusicSlot(i);
            let id = "#background-music-" + idAdded;
            $(id).attr("value", music[i])
        }
    }
}

if (text.length != 0) {
    for (let i = 0; i < text.length; i++) {
        if (i == 0){
            $("#text-1").attr("value", text[0])
        }
        else{
            counter_text += 1
            idAdded = addTextSlot(i);
            let id = "#text-" + idAdded;
            $(id).attr("value", text[i])
        }
    }
}

$(document.body).on('click', '.delete-text', function() {
    var deleted_id = $(this).parent().attr("id")
    $(this).parent().remove()
    text_id_list.push(parseInt(deleted_id))
    counter_text -= 1
});

$(document.body).on('click', '.delete-video', function() {
    var deleted_id = $(this).parent().attr("id")
    $(this).parent().remove()
    video_id_list.push(parseInt(deleted_id))
    counter_video -= 1
});