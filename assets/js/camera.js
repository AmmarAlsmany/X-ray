
          
    openCamera();


      

    // OpenCamera function start here
    
    function openCamera(){
          let All_mediaDevices=navigator.mediaDevices
          if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
              console.log("getUserMedia() not supported.");
              
          }
          All_mediaDevices.getUserMedia({
          
              video: true
          })
          .then(function(vidStream) {
              var video = document.getElementById('videoCam');
              if ("srcObject" in video) {
                video.srcObject = vidStream;
              } else {
                console.log(vidStream);
                video.src = window.URL.createObjectURL(vidStream);
              }
              video.onloadedmetadata = function(e) {
                video.play();
              };
          })
      }

