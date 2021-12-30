/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let options = document.querySelector(".options");
let title = document.querySelector("h2");
let display = document.querySelector(".display");

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

let add = document.querySelector(".add");

if (private == "True") {
    private = true;
    contact.classList.toggle("on");
}
else if(private == "False") {
    private = false;
}

var counter = 0
add.onclick = function(){
    counter += 1
    if(counter > 4){
        return
    }
    document.getElementById("added").innerHTML += "<input class='display_text' placeholder='Enter a Text' type='text'><br>";
}

$("#private").click(function () {
    private = !private
})

$("#method-image").change(function () {
    var method = $(this).find("option:selected").attr("value");
    var input = document.querySelector("#background-image");
    if (method == "link") {
        input.type = "text"
    }
    else {
        input.type = "file"
        input.accept = "image/png, image/jpeg, image/jpg"
    }

})