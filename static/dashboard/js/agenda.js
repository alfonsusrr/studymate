/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let agenda = document.querySelector(".agenda");
let title = document.querySelector("h2");
let vl = document.querySelector(".vl");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    agenda.classList.toggle("active");
    title.classList.toggle("active");
    vl.classList.toggle("active");
}

//selectors
const todoInput = document.querySelector('.todo_input');
const datetime = document.querySelector(".date");
const todoButton = document.querySelector('.todo_button');
const todoList = document.querySelector('.todo_list');
const todoNotTodayList = document.querySelector('.todo_not_today_list');
const todoWeekList = document.querySelector('.todo_week_list');
const filterOption = document.querySelector('.filter_todo');

var currentdate = new Date()
var date = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate();
var dataAgenda = [] 
//event listeners
//todoButton.addEventListener("click", addTodo)
todoList.addEventListener("click", deleteCheck)
todoNotTodayList.addEventListener("click", deleteCheck)
todoWeekList.addEventListener("click", deleteCheck)
filterOption.addEventListener("change", filterTodo)
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
        $.ajax({
            type: "POST",
            url: "/agenda/",
            data: {
                "id": item.id,
                "action": "delete",
                "csrfmiddlewaretoken" : token,
            }, 
            success: function() {
                todo.classList.add("fall")
                todo.addEventListener('transitionend', function () {
                todo.remove()
                })
            }
        })
    }
    //COMPLETE ITEM
    if (item.classList[0] === "complete_btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completedItem")
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
}
//FILTERING THE TASKS ACCORDING THE OPTION
function filterTodo(e) {
    const todos = todoList.childNodes;
    for(let i = 1; i < todos.length; i++ ){
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