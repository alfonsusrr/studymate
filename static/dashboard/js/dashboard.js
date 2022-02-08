/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let recommend = document.querySelector(".recommend");
let container = document.querySelector(".flex-container-top");
let caption = document.querySelector(".caption");
let img = document.querySelector("img");
let note = document.querySelector(".note_rec");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    recommend.classList.toggle("active");
    container.classList.toggle("active");
    caption.classList.toggle("active");
    img.classList.toggle("active");
    note.classList.toggle("active");
}

var slidesIndex = 1;
showSlides(slidesIndex);

function slides(i){
    showSlides(slidesIndex += i);
}

function currentSlide(i){
    showSlides(slidesIndex = i);
}

function showSlides(i){
    var n;
    var slide = document.getElementsByClassName("trans");
    var dot = document.getElementsByClassName("dot");
    if (i > slide.length) {
        slidesIndex = 1;
    }
    if (i < 1){
        slidesIndex = slide.length;
    }
    for(n = 0; n < slide.length; n++){
        slide[n].getElementsByClassName.display = "none";
    }
    for(n = 0; n < dot.length; n++){
        dot[n].className = dot[n].className.replace(" active", "");
    }
    slide[slidesIndex-1].style.display = "block";
    dot[slidesIndex-1].className += " dotActive";
}

//selectors
const todoInput = document.querySelector('.todo_input');
const todoButton = document.querySelector('.todo_button');
const todoList = document.querySelector('.todo_list');
const filterOption = document.querySelector('.filter_todo');

var currentdate = new Date()
var date = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate();

//event listeners
//todoButton.addEventListener("click", addTodo)
todoList.addEventListener("click", deleteCheck)
filterOption.addEventListener("click", filterTodo)
//functions

function addTodo(data) {
    let title = data.title
    let due = data.due
    var today = new Date()
    const todayDate = today.getDate();
    const todayDay = today.getDay();

    const firstDay = new Date(today.setDate(todayDate - todayDay))

    const lastDay = new Date(firstDay)
    lastDay.setDate(lastDay.getDate() + 6)

    today = new Date()
    //todo DIV
    const todoDiv = document.createElement('div');
    //todo LI 
    const newTodo = document.createElement('li');
    const newDate = document.createElement('li');
    newTodo.innerText = title;
    newDate.innerText = due;

    var dateArray = [parseInt(due.slice(0, 4)), parseInt(due.slice(5, 7))-1, parseInt(due.slice(8))] //making date into array
    
    var dateDate = new Date(dateArray[0], dateArray[1], dateArray[2]);

    if(newDate.innerText == date){
        todoDiv.classList.add('todo');
    }
    else if(dateDate >= firstDay && dateDate <= lastDay){
        todoDiv.classList.add('todo_week');
    }
    else if(dateDate > lastDay) {
        todoDiv.classList.add('todo_not_today');
    }

    newTodo.classList.add('todo_item');
    todoDiv.appendChild(newTodo);
    todoDiv.appendChild(newDate);

    //check mark BUTTON
    const completedButton = document.createElement('button');
    completedButton.classList.add('complete_btn');
    completedButton.id = data.id;
    todoDiv.appendChild(completedButton);
    //delete BUTTON
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete_btn');
    deleteButton.id = data.id;
    todoDiv.appendChild(deleteButton);

    // Completed items
    if (data.completed == true) {
        todoDiv.classList.toggle("completedItem")
    }

    //Append to Actual LIST
    if(newDate.innerText == date){
        todoList.appendChild(todoDiv);
    }
    else if(dateDate > today && dateDate <= lastDay){
        todoWeekList.appendChild(todoDiv);
    }
    else if(dateDate > lastDay) {
        todoNotTodayList.appendChild(todoDiv);
    }
}

//DELETE & CHECK
function deleteCheck(e) {
    const item = e.target;
    //DELETE ITEM
    if (item.classList[0] === "delete_btn") {
        const todo = item.parentElement;
        //ANIMATION TRANSITION
        todo.classList.add("fall")
        todo.addEventListener('transitionend', function () {
            todo.remove()
        })
        $.ajax({
            type: "POST",
            url: "/agenda/",
            data: {
                "id": item.id,
                "action": "delete",
                "csrfmiddlewaretoken" : token,
            }, 
        })
    }
    //COMPLETE ITEM
    if (item.classList[0] === "complete_btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completedItem")
    }
    $.ajax({
        type: "POST",
        url: "/agenda/",
        data: {
            "id": item.id,
            "action": "completed",
            "csrfmiddlewaretoken" : token,
        }, 
    })
}
//FILTERING THE TASKS ACCORDING THE OPTION
function filterTodo(e) {
    const todos = todoList.childNodes;
    for(let i = 0; i < todos.length; i++ ){
        switch (e.target.value) {
            case "all":
                todos[i].style.display = "flex";
                break;
            case "completed":
                if (todos[i].classList.contains('completedItem')) {
                    todos[i].style.display = "flex";
                } else {
                    todos[i].style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todos[i].classList.contains('completedItem')) {
                    todos[i].style.display = "flex";
                } else {
                    todos[i].style.display = "none";
                }
                break;
        }
    }

    const notTodos = todoNotTodayList.childNodes;
    for(let i = 0; i<notTodos.length; i++ ){
        switch (e.target.value) {
            case "all":
                notTodos[i].style.display = "flex";
                break;
            case "completed":
                if (notTodos[i].classList.contains('completedItem')) {
                    notTodos[i].style.display = "flex";
                } else {
                    notTodos[i].style.display = "none";
                }
                break;
            case "uncompleted":
                if (!notTodos[i].classList.contains('completedItem')) {
                    notTodos[i].style.display = "flex";
                } else {
                    notTodos[i].style.display = "none";
                }
                break;
        }
    }

    const todosWeek = todoWeekList.childNodes;
    for(let i = 0; i<todosWeek.length; i++ ){
        switch (e.target.value) {
            case "all":
                todosWeek[i].style.display = "flex";
                break;
            case "completed":
                if (todosWeek[i].classList.contains('completedItem')) {
                    todosWeek[i].style.display = "flex";
                } else {
                    todosWeek[i].style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todosWeek[i].classList.contains('completedItem')) {
                    todosWeek[i].style.display = "flex";
                } else {
                    todosWeek[i].style.display = "none";
                }
                break;
        }
    }
}

function passDataAgenda(data){
    dataNow = JSON.parse(data.replace(/&quot;/g,'"').replace(/%20/g, ' '))
    for (let i = 0; i < dataNow.length; i++){
        addTodo(dataNow[i])
    }
}

function view_notes(url_id) {
    window.location.href = url_id
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

    $(".img-recommend").on("click", function () {
        let url = $(this).attr('data-link')
        view_notes(url)
    })
}
clicked()