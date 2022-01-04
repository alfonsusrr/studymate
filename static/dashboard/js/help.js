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
    $(".dashboard").slideToggle("slow", "linear")
}

headerAgenda.onclick = function(){
    $(".Agenda").slideToggle("slow", "linear")
}

headerNoteArchive.onclick = function(){
    $(".NoteArchive").slideToggle("slow", "linear")
}

headerNoteShare.onclick = function(){
    $(".NoteShare").slideToggle("slow", "linear")
}

headerRelaxRoom.onclick = function(){
    $(".RelaxRoom").slideToggle("slow", "linear")
}

headerSearchCourses.onclick = function(){
    $(".SearchCourses").slideToggle("slow", "linear")
}

headerSettings.onclick = function(){
    $(".Settings").slideToggle("slow", "linear")
}

headerQuestions.onclick = function(){
    $(".Questions").slideToggle("slow", "linear")
}