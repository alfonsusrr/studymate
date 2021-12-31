/*Sidebar Js*/
let btn = document.querySelector("#menu");
let sidebar = document.querySelector(".sidebar");
let home = document.querySelector(".home_section");
let collapse = document.querySelector(".collapse")
let text = document.querySelector(".text");
let playerBox = document.querySelector(".toogle-player");
let status = false;
let playButton = document.querySelector(".playButton");
let pauseButton = document.querySelector(".pauseButton");

btn.onclick = function(){
    sidebar.classList.toggle("active");    
    home.classList.toggle("active");
    playerBox.classList.toggle("active");
}

collapse.onclick = function(){
    sidebar.classList.toggle("collapse");    
    home.classList.toggle("collapse");
    text.classList.toggle("position");
    playerBox.classList.toggle("position");
}

var playerReady = false;
document.addEventListener('DOMContentLoaded',function(event){
    // array with texts to type in typewriter
    var dataText = textData;
    
    const now = new Date()
    if (now.getHours < 10) {
      time = "Morning"
    }
    else if (now.getHours < 17) {
      time = "Day"
    }
    else {
      time = "Evening"
    }

    const text = "Good " + time + " " + user;
    var greetings = document.querySelector("#greetings");
    greetings.innerHTML = text;
    // type one text in the typwriter
    // keeps calling itself until the text is finished
    function typeWriter(text, i, fnCallback) {
      // chekc if text isn't finished yet
      if (i < (text.length)) {
        // add next character to h1
       document.querySelector("h1").innerHTML = text.substring(0, i+1) +'<span class="type-span" aria-hidden="true"></span>';

        // wait for a while and call this function again for next character
        setTimeout(function() {
          typeWriter(text, i + 1, fnCallback)
        }, 100);
      }
      // text finished, call callback if there is a callback function
      else if (typeof fnCallback == 'function') {
        // call callback after timeout
        setTimeout(fnCallback, 1000);
      }
    }
    // start a typewriter animation for a text in the dataText array
     function StartTextAnimation(i) {
       if (typeof dataText[i] == 'undefined'){
          setTimeout(function() {
            StartTextAnimation(0);
          }, 1000);
       }
       // check if dataText[i] exists
      if (i < dataText[i].length) {
        // text exists! start typewriter animation
       typeWriter(dataText[i], 0, function(){
         // after callback (and whole text has been animated), start next text
         StartTextAnimation(i + 1);
       });
      }
    }
    // start the text animation
    StartTextAnimation(0);
  });

  var player;
  var isUnMuted = false;
  var music_now = 0;

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      videoId: music[music_now],
      height: '98',
      width: '175',
      playerVars: {
        'modestbranding': 1,
        'showinfo': 0,
        'autoplay': 1
      },
      events: {
        'onReady': function() {
          player.unMute();
          player.playVideo();
          playerReady = true;
          onPlayerReady();
        },
        'onStateChange': function () {
          if (player.isMuted() && player.getPlayerState() == 2 && !isUnMuted) {
              player.unMute();
              player.playVideo();
              isUnMuted = true;
          }
        }
      }
    });
  }


var playerDiv = document.querySelector('#player');
playerDiv.style.display = "none"

function onPlayerReady() {
  document.querySelector("#status-player").innerHTML = "press play to start"
  playButton.onclick = function() {
    if (player.getPlayerState() == 2) {
      pauseButton.classList.add("pause");
      playButton.classList.add("pause");
      player.playVideo()
    }
    else if(player.getPlayerState() == -1) {
      player.playVideo()
      setTimeout(function() {
        if(player.getPlayerState() == -1) {
          document.querySelector("#status-player").innerHTML = "Video URL Error, please change the video URL"
        }
        else {
          pauseButton.classList.add("pause");
          playButton.classList.add("pause");
        }
      }, 2000);
    }
  }
  
  pauseButton.onclick = function() {
    if (player.getPlayerState() == 1) {
      playButton.classList.remove("pause");
      pauseButton.classList.remove("pause");
      player.pauseVideo()
    }
  }
  player.addEventListener('onStateChange', function(e) {
    let status_player = document.querySelector("#status-player")
    if (e.data === 1){
      if (!playButton.classList.contains("pause")) {
        pauseButton.classList.add("pause");
        playButton.classList.add("pause");
      }
      status_player.innerHTML = "now playing " + player.getVideoData().title
    }
    else if (e.data === 2) {
      status_player.innerHTML = "paused"
      if (playButton.classList.contains("pause")) {
        pauseButton.classList.remove("pause");
        playButton.classList.remove("pause");
      }
    }
    else if (e.data === -1) {
      status_player.innerHTML = "press play to start"
    }
  })
}

