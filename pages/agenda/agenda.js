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
const filterOption = document.querySelector('.filter_todo');

var currentdate = new Date()
var date = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate();
//event listeners
todoButton.addEventListener("click", addTodo)
todoList.addEventListener("click", deleteCheck)
todoNotTodayList.addEventListener("click", deleteCheck)
filterOption.addEventListener("click", filterTodo)
//functions

function addTodo(event) {
    event.preventDefault();
    //todo DIV
    const todoDiv = document.createElement('div');
    //todo LI 
    const newTodo = document.createElement('li');
    const newDate = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newDate.innerText = datetime.value;
    if(datetime.value == ""){
        newDate.innerText = date;
    }
    if(datetime.value[datetime.value.length - 2] + datetime.value[datetime.value.length - 1] < date[date.length - 2] + date[date.length - 1]){
        alert("Date must be at least today");
        return null;
    }
    if(newDate.innerText != date){
        todoDiv.classList.add('todo_not_today');
    }
    else{
        todoDiv.classList.add('todo');
    }
    newTodo.classList.add('todo_item');
    todoDiv.appendChild(newTodo);
    if(todoInput.value === ""){
        return null;
    }
    if(todoInput.value.length > 20){
        alert("Input must be between 0 and 20 characters");
        return null;
    }
    todoDiv.appendChild(newDate);
    //check mark BUTTON
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('complete_btn');
    todoDiv.appendChild(completedButton);
    //delete BUTTON
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add('delete_btn');
    todoDiv.appendChild(deleteButton);
    //Append to Actual LIST
    if(newDate.innerText != date){
        todoNotTodayList.appendChild(todoDiv);
    }
    else{
        todoList.appendChild(todoDiv);
    }
    //Clear todo input VALUE
    todoInput.value = "";
    datetime.value = "";
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
    }
    //COMPLETE ITEM
    if (item.classList[0] === "complete_btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completedItem")
    }
}
//FILTERING THE TASKS ACCORDING THE OPTION
function filterTodo(e) {
    const todos = todoList.childNodes;
    for(let i = 0; i<todos.length; i++ ){
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
}