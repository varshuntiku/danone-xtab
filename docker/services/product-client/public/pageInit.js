// zendesk
// window.zESettings = {
//     webWidget: {
//       position: { horizontal: "left", vertical: "bottom" },
//     },
// };

// page scale
document.addEventListener("DOMContentLoaded", (event) => {
  // console.log('DOM is ready.');
  var setBodyScale = function () {
    // console.log('On Set Body Scale.');
    var scaleSource =
      document.body.offsetWidth < document.body.offsetHeight
        ? document.body.offsetWidth
        : document.body.offsetHeight,
      scaleFactor = 0.06,
      maxScale = 75,
      minScale = 25; //Tweak these values to taste

    var fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:
    // console.log(fontSize);

    if (fontSize > maxScale) fontSize = maxScale;
    if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and maximums

    // console.log(scaleSource);

    document.getElementsByTagName("html")[0].style.fontSize =
      fontSize + "%";
  };
  
  setBodyScale();
  window.onresize = function () {
    // console.log('On Resize.');
    setBodyScale();
  };

  //Fire it when the page first loads:
  if(window.zE) window.zE('webWidget', 'hide');
 
});

//zendesk
window.zESettings = {
  webWidget: {
    position: { horizontal: "right", vertical: "top" },
    color: {
      theme: '#ffffff'
    },
    offset: {
      horizontal: '20px',
      vertical: '35px'
    },
    launcher: {
      label: {
        '*': ' '
      }
    }
  }
};

//   document.addEventListener("DOMContentLoaded", function(event) {
//     // document.getElementById("zenToggle").style.display = "flex";
//     // document.getElementById("zenToggle").addEventListener("click", toggleZen);
//     toggleZen();
//   });

//   function toggleZen() {
//     const toggle = document.getElementById("zenToggle");
//     if(zE('webWidget:get', 'display') === "hidden") 	{
//       toggle.innerHTML = "X";
//       toggle.style.bottom = "60px";
//       toggle.title = "Hide Help";
//       zE('webWidget', 'show');
//       zE('webWidget', 'toggle');
//     }
//     else {
//       toggle.innerHTML = "?";
//       toggle.style.bottom = "15px";
//       toggle.title = "Help";
//       toggle.style.display='none'
//       zE('webWidget', 'hide');
//     }
//   }