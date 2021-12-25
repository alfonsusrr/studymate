let headerdashboard = document.querySelector(".headerdashboard");
let headerAgenda = document.querySelector(".headerAgenda");
let headerNoteArchive = document.querySelector(".headerNoteArchive");
let headerNoteShare = document.querySelector(".headerNoteShare");
let headerRelaxRoom = document.querySelector(".headerRelaxRoom");
let headerSearchCourses = document.querySelector(".headerSearchCourses");
let headerSettings = document.querySelector(".headerSettings");
let headerQuestions = document.querySelector(".headerQuestions");

let dashboard = document.querySelector(".dashboard");
let Agenda = document.querySelector(".Agenda");
let NoteArchive = document.querySelector(".NoteArchive");
let NoteShare = document.querySelector(".NoteShare");
let RelaxRoom = document.querySelector(".RelaxRoom");
let SearchCourses = document.querySelector(".SearchCourses");
let Settings = document.querySelector(".Settings");
let Questions = document.querySelector(".Questions");

headerdashboard.onclick = function(){
    dashboard.classList.toggle("display");
}

headerAgenda.onclick = function(){
    Agenda.classList.toggle("display");
}

headerNoteArchive.onclick = function(){
    NoteArchive.classList.toggle("display");
}

headerNoteShare.onclick = function(){
    NoteShare.classList.toggle("display");
}

headerRelaxRoom.onclick = function(){
    RelaxRoom.classList.toggle("display");
}

headerSearchCourses.onclick = function(){
    SearchCourses.classList.toggle("display");
}

headerSettings.onclick = function(){
    Settings.classList.toggle("display");
}

headerQuestions.onclick = function(){
    Questions.classList.toggle("display");
}