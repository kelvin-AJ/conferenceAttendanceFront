"use strict";
const fullNameInput = document.querySelector("#fullName");
const startBtn = document.querySelector("#start-btn");
const endBtn = document.querySelector("#end-btn");
const infoArea = document.querySelector(".info");
const input = document.querySelector("#test")


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
      throw Error("An Error Ocuured, Debeg: ", response)
    }

    fullNameInput.value = "";
  

}

const beginApp = async function(scanHandler, qrCode) {

  try{

    // setMessage(JSON.stringify(cameras))

    const cameraId = input.value;
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


const begin = async function() {const cameras = await Html5Qrcode.getCameras();
cameras.forEach(camera => {
      input.insertAdjacentHTML("beforeend", `<option value="${camera.id}">${camera.label}</option>`)
})}


startBtn.addEventListener("click", () => {
    beginApp(scanHandler, html5QrCode)
});
endBtn.addEventListener("click", () => {
  closeApp(html5QrCode)
})

begin();