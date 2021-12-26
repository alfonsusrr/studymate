/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let recommend = document.querySelector(".recommend");
let agenda = document.querySelector(".agenda");
let caption = document.querySelector(".caption");
let img = document.querySelector("img");
let note = document.querySelector(".note_rec");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    recommend.classList.toggle("active");
    agenda.classList.toggle("active");
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
todoButton.addEventListener("click", addTodo)
todoList.addEventListener("click", deleteCheck)
filterOption.addEventListener("click", filterTodo)
//functions

function addTodo(event) {
    event.preventDefault();
    //todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    //todo LI 
    const newTodo = document.createElement('li');
    const newDate = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newDate.innerText = date;
    newTodo.classList.add('todo_item');
    todoDiv.appendChild(newTodo);
    todoDiv.appendChild(newDate);
    if(todoInput.value === ""){
        return null
    }
    if(todoInput.value.length > 20){
        alert("Input must be between 0 and 20 characters");
        return null;
    }
    //check mark BUTTON
    const completedButton = document.createElement('button');
    completedButton.classList.add('complete_btn');
    todoDiv.appendChild(completedButton);
    //delete BUTTON
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete_btn')
    todoDiv.appendChild(deleteButton);
    //Append to Actual LIST
    todoList.appendChild(todoDiv);
    //Clear todo input VALUE
    todoInput.value = ""
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
} 
