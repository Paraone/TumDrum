$(document).ready(function() {
  var buttons = $('.btn'); //array of buttons
  var navbtn = $('.navbtn');//nav buttons
  var pages = $('.page');//pages to be displayed
  var playbtn = $('#playbtn'); // starts sequence
  var status = $('#status'); // display win/lose
  var audioOn = true; //sets audio on or off
  var song = $('#song').get(0);//background music
  var cheer = $('#cheer').get(0);//winning cheer
  cheer.volume = .1;
  song.volume = .1;
  var sequence = []; //array of sequence to be followed
  var playerSeq = []; //array of user input
  var inputs = 0; // number of inputs
  var playerTimeout = null; //setTimeout variable
  var playerTurn = false; //is timer running??
  var sound = null; // holds audio for playback controls
  var timerInterval = 4000; // interval to be used for player input
  var seqInterval = 774; // interval to be use for playback 155bpm tempo
  var winPoint = 4; // player wins in 8 turns.
  var diff = 0;//difficulty idex
  var difficulty = [4, 8, 12];//difficulty amount.
  var keyInputs = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];



  var getRand = function(min, max){ // gets random number from min to max
    var min = Math.ceil(min); //courtesy of MDN
    var max = Math.floor(max);
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  var checkSeq = function(sequence, playerSeq){// checks to see if playerSeq follows sequence order
    var output = false;
    for (var i = 0; i < playerSeq.length; i++) {
      output = Number(sequence[i]) === Number(playerSeq[i]);
      if(!output) break;
    }
    return output;
  }

  var gameOver = function(){//set game over que
    song.pause();
    song.currentTime = 0;
    console.log('You lose.');
    status.css('font-family', "'Nosifer', helvetica");
    status.text('You lose.');
    // alert('You lose.');
  }

  var youWin = function(){// sets winner que
    console.log('You win!');
    status.css('font-family', '"Stalinist One", helvetica');
    status.text('You win.');
    if(audioOn)cheer.play();
    setTimeout(function(){
      cheer.pause();
      cheer.currentTime = 0;
    }, 10000);
    // alert('You win!');
  }

  var resetGame = function(seq){// resets game variables for next round
    inputs = 0;
    playerSeq = [];
    $('#round').text('Round: 1');
    if(!seq) {
      seqInterval = 774;
      timerInterval = 4000; // interval to be used for player input
      seq = []
    }
    buttons.css('display', 'none');
    sequence = seq;
    sequence.push(getRand(0, 3));
    console.log('new sequence: '+sequence);
  }

  var setTimer = function(mils, seq){// sets playerTimeout
    if(!playerTurn) playerTurn = true;
    if(!seq) seq = [];
    playerTimeout = setTimeout(function(){
      console.log('setTimer timed out');
      gameOver();
      resetGame();
      playbtn.show('slow');
    }, mils);
  }

  var playSequence = function(seq){// plays the sequence in order
    // debugger;
    $('#round').text('Round: '+sequence.length);
    buttons.css('display', 'none');// hide buttons so not to allow input during playback
    status.css('font-family', '"Stalinist One", helvetica');// set status styling
    status.text('Listen...');//set status text
    $('#sprite').addClass('animate');//animate sprite
    for (let i = 0; i < seq.length; i++) {//set timeouts in motion
        setTimeout(function(){
          if(i > 0 && audioOn){//if sound is playing reset sound
            sound = $('#sound-'+seq[i-1]).get(0);
            sound.pause();
           sound.currentTime = 0;
         }
         if(audioOn){// if audioOn play sound
            sound = $('#sound-'+seq[i]).get(0);
            sound.play();
          }
          $('#btn-'+seq[i]).css({//change btn color
            'border' : '3px solid #ff5',
            'margin' : '2px'
          });
          setTimeout(function(){//change btn color back in .25s
            $('#btn-'+seq[i]).css({
              'border' : 'none',
              'margin' : '5px'
            });
          }, 250);
          if(i === seq.length-1) {//if last part of sequence
            $('#sprite').removeClass('animate');// stop player animation
            buttons.css('display', 'block');//display buttons to allow input
          status.css('font-family', '"Stalinist One", helvetica');//set status styling
            status.text('Repeat!');//set status text
            setTimer(timerInterval);// set timer for input
          }
        }, i*seqInterval+seqInterval);
    }
  }

  var clickFunc = function(event){
        if(playerTurn){

        clearTimeout(playerTimeout);//stop timer
        inputs++; //increase input amount
        if(inputs % 3 === 0) seqInterval *= .9; // increases difficulty as rounds progress
        if(event.type != 'keydown' && event.type != 'keyup'){// if not a keypress
          var btnId = $(this).parent().attr('id').split('').pop();// use button.parent for id
        }
        else {
          var btnId = keyInputs.indexOf(event.key);// else use event.key
        }
        if(audioOn){//if audioOn
          console.log(btnId);
          sound = $('#sound-'+btnId).get(0);//get sound file
          sound.play(); // play sound
        }
        playerSeq.push(Number(btnId));//store button number in playerSeq
        if(checkSeq(sequence, playerSeq)){// if playerSeq matches sequence
        if(event.type != 'keydown' && event.type != 'keyup'){//set color of button to green if correct
          $(this).parent().css({
            'border' : '3px solid green',
            'margin' : '2px'
          });
        }
        else{
          $('#btn-'+keyInputs.indexOf(event.key)).css({//if using event.key
            'border' : '3px solid green',
            'margin' : '2px'
          });
        }
          if(sequence.length === inputs){// if # of inputs match sequence length
            playerTurn = false;
            if(inputs === winPoint){//if sequence length === winPoint you win; exit function;
              youWin();
              playbtn.show('slow');
              return;
            }
            resetGame(sequence); //  keep sequence going
            playSequence(sequence); // play next sequence
            return;
          }
          setTimer(4000); //set timer between inputs
        }
        else{//if sequences do not match --> game over...
          if(event.type != 'keydown' && event.type != 'keyup'){// if incorrect btn
            $(this).parent().css({//set color to red
                'border' : '3px solid red',
                'margin' : '2px'
              });
          }
          else{
          $('#btn-'+keyInputs.indexOf(event.key)).css({//if incorrect key pressed
            'border' : '3px solid red',
            'margin' : '2px'
          });
          }
          gameOver();
          resetGame();
          playbtn.show('slow');//allow player to start again
          return;
        }
      }
    }

  var init = function(){// initialize game mouseEvent functions and set game in motion
    //*************** DRUM BUTTONS *******************
    buttons.mousedown(clickFunc);
    buttons.mouseleave(function() {
      $(this).parent().css({
        'border' : 'none',
        'margin' : '5px'
      });
      if(sound){
        sound.pause();
        sound.currentTime = 0;
      }
    });
    buttons.mouseup(function() {
      $(this).parent().css({
        'border' : 'none',
        'margin' : '5px'
      });
      if(sound){
        sound.pause();
        sound.currentTime = 0;
      }
    });
    // **************PLAY BUTTON *******************
    playbtn.mousedown(function(event) {
      $(this).css({
        'background' : 'rgba(255, 255, 255, 1)'
      });
    });
    playbtn.mouseup(function(event) {
      status.text('');
      if(audioOn){
        song.loop = true;
        song.play();
      }
      resetGame();
      playSequence(sequence);
      $(this).css({
        'background' : 'rgba(255, 255, 255, .5)'
      });
      $(this).fadeOut('slow');
    });
    playbtn.mouseleave(function(event) {
      $(this).css({
        'background' : 'rgba(255, 255, 255, .5)'
      });
    });
    //*************AUDIO BUTTON *************************
    $('.sound').click(function(){
      audioOn = !audioOn;
      if(audioOn === true){
        $('.sound').text('Audio: ON').css({'color': 'white', 'text-decoration': 'none'});
        if(song) song.volume = .1;
        if(cheer) cheer.volume = .1;
      }
      else{
        $('.sound')
          .text('Audio: OFF')
          .css({'color': 'red', 'text-decoration': 'line-through'});
          if(cheer) cheer.volume = 0;
          if(song){
            song.volume = 0;
          }
      }
    });
    //*************NAV BUTTONS**************************
    navbtn.click(function(){//nav buttons switch between pages
      pages.css('display', 'none');//hide all pages
      $('.'+$(this).text().toLowerCase()).fadeIn('slow');//fade in current page
        $('#sprite').removeClass('animate');//stop sprite animation
        clearTimeout(playerTimeout);//stop timer
        if(cheer){//stop cheer
          cheer.pause();
          cheer.currentTime = 0;
        }
        if(song){// stop song
          song.pause();
          song.currentTime = 0;
        }
        resetGame();//reset game
        status.text('');// reset status text
        playbtn.show('slow');
    });
    //***************DIFFICULTY BTN ************************
    $('#diff').click(function(){// toggles difficulty
      console.log('diff clicked');
      diff++;
      if(diff >= difficulty.length) diff = 0;
      winPoint = difficulty[diff];
      switch(diff){
        case 0:
          $('#diff').text('Difficulty: Easy');
          break;
        case 1:
          $('#diff').text('Difficulty: Medium');
          break;
        case 2:
          $('#diff').text('Difficulty: Hard');
          break;
        default:
          console.log('Something went wrong with Difficulty');
      }
    });
    //****************SET KEYBOARD INPUTS*******************
    document.addEventListener('keydown', clickFunc);//handles key events
    document.addEventListener('keyup', function(event){//key ups
      if(keyInputs.includes(event.key)){
        var index = keyInputs.indexOf(event.key);
        $('#btn-'+index).css({
          'border' : 'none',
          'margin' : '5px'
        });
      }
    });

    $('.setImage').keyup(function(event){//sets user input to user defined keys
      var index = $(this).attr('id').split('').pop();//gets button index
      var key = event.key;//saves event.key to variable
      keyInputs[index] = event.key;//inputs value to array
      if(key === ' ') key = 'Space';//changes " " to "Space"
      $('.controlStatus').text('Button changed to - '+key);// set control status text
    });
    //************************Initialize Game***************************
    resetGame();
    buttons.css('display', 'none');//  make player press play to begin
  }
  init();
});
