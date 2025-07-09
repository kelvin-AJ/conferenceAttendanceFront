"use strict";
const fullNameInput = document.querySelector("#fullName");
const startBtn = document.querySelector("#start-btn");
const endBtn = document.querySelector("#end-btn");
const infoArea = document.querySelector(".info")


const html5QrCode = new Html5Qrcode("reader");

const setMessage = function(message) {
  infoArea.textContent = message;
} 


const scanHandler = async (decodedText, decodedResult) => {
    const response = await submitAttendance(decodedText, fullNameInput.value);
  
    if(response?.ok) {
      setMessage(`${fullNameInput.value} Submitted`)
    }else if(response.status == 409){
      setMessage(`${fullNameInput.value} has already been marked present`)
    }else{
      setMessage("Something went wrong")
    }

    fullNameInput.value = "";
  

}

const beginApp = async function(scanHandler, qrCode) {

  try{
    const cameras = await Html5Qrcode.getCameras();
    setMessage(JSON.stringify(cameras))

    const cameraId = cameras[1].id;
    const options = {
      fps: 5,
      qrbox: {width:250, height: 250}
    }

    qrCode.start(
      cameraId, 
      options,
      scanHandler,
      errorMessage => {}
    )

    startBtn.toggleAttribute("disabled")
    endBtn.toggleAttribute("disabled")
  }catch (error) {
    console.log(error)
  }
  
}

const closeApp = async function(qrCode) {
    const response = await qrCode.stop();
    startBtn.toggleAttribute("disabled")
    endBtn.toggleAttribute("disabled")
    console.log(response)
}



const submitAttendance = async function (attendeeId, fullName=`Person-${Date.now()}`) {
    
  try{
    const result = await fetch("https://conferenceattendance.onrender.com/attendance",
        {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },body: JSON.stringify({
                fullName,
                attendeeId
            })
        }
    );
    return result;
  }catch (error) {
    console.log(error)
  }
    

}





startBtn.addEventListener("click", () => {
    beginApp(scanHandler, html5QrCode)
});
endBtn.addEventListener("click", () => {
  closeApp(html5QrCode)
})