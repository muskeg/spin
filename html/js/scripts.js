requestAnimationFrame(mainLoop);
Math.TAU = Math.PI * 2;
const size = 1000;
const innerRadius = 200;
var canvas = document.getElementById("wheel-canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(ctx.canvas);
const stopAt = document.createElement("div")
document.body.appendChild(stopAt);
ctx.canvas.style.border = "2px solid black";


var gTime;   // global time
const colors = ["#C00","#C80","#CC0","#0A0","#08C","#00C","#C0C"];
const wheelSteps = 100;
const minSpins = 25 * Math.TAU;  // min number of spins before stopping
const spinTime = 20000;          // in ms
const slowDownRate =  0.1;   // smaller this value the greater the ease in. 
                                 // Must be > 0 
var startSpin = false; 
var readyTime = 0;
ctx.canvas.addEventListener("click",() => { startSpin = !wheel.spinning });
stopAt.textContent = "Click wheel to spin";

const wheel = {  // hold wheel related variables
    img: createWheel(wheelSteps),
    endTime: performance.now() - 2000,
    startPos: 0,
    endPos: 0,
    speed: 0,
    pos: 0,
    spinning: false,
    set currentPos(val) {
      this.speed = (val - this.pos) / 2;  // for the wobble at stop
      this.pos = val;
    },
    set endAt(pos) {
       this.endPos = (Math.TAU - (pos / wheelSteps) * Math.TAU) + minSpins;
       this.endTime = gTime + spinTime;
       this.startTime = gTime;
       stopAt.textContent = "Spin to: "+(pos + 1);
    }
 };
 function wheelPos(currentTime, startTime, endTime, startPos, endPos) {
    const x = ((currentTime - startTime) / (endTime - startTime)) ** slowDownRate;
    return x * (endPos - startPos) + startPos;
 } 

function mainLoop(time) {
  gTime = time;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, size, size);

  if (startSpin && !wheel.spinning) {
      startSpin = false;
      wheel.spinning = true;
      wheel.startPos = (wheel.pos % Math.TAU + Math.TAU) % Math.TAU;
      wheel.endAt =  Math.random() * wheelSteps | 0;
  } else if (gTime <= wheel.endTime) { // wheel is spinning get pos
      wheel.currentPos = wheelPos(gTime, wheel.startTime, wheel.endTime, wheel.startPos, wheel.endPos);
      readyTime = gTime + 1500;
  } else { // wobble at stop
      wheel.speed += (wheel.endPos - wheel.pos) * 0.0125;
      wheel.speed *= 0.95;
      wheel.pos += wheel.speed;
      if (wheel.spinning && gTime > readyTime) {
          wheel.spinning = false;
          stopAt.textContent = "Click wheel to spin";
      }
          
  }

  // draw wheel
  ctx.setTransform(1,0,0,1,size / 2, size / 2);
  ctx.rotate(wheel.pos);
  ctx.drawImage(wheel.img, -size / 2 , - size / 2);


  // draw marker shadow
  ctx.setTransform(1,0,0,1,1,4);
  ctx.fillStyle = "#0004";
  ctx.beginPath();
  ctx.lineTo(size - 13, size / 2);
  ctx.lineTo(size, size / 2 - 7);
  ctx.lineTo(size, size / 2 + 7);
  ctx.fill();
  // draw marker
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle = "#F00";
  ctx.beginPath();
  ctx.lineTo(size - 13, size / 2);
  ctx.lineTo(size, size / 2 - 7);
  ctx.lineTo(size, size / 2 + 7);
  ctx.fill();
  
  requestAnimationFrame(mainLoop);
}

   

function createWheel(steps) {
    const ctx = Object.assign(document.createElement("canvas"),{width: size, height: size}).getContext("2d");
    const s = size, s2 = s / 2, r = s2 - 4;
    var colIdx = 0;
    for (let a = 0; a < Math.TAU; a += Math.TAU / steps) {
        const aa = a - Math.PI / steps;
        ctx.fillStyle = colors[colIdx++ % colors.length];
        ctx.beginPath();
        ctx.moveTo(s2, s2);
        ctx.arc(s2, s2, r, aa, aa + Math.TAU / steps);
        ctx.fill();
    }    
    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.arc(s2, s2, innerRadius, 0, Math.TAU);
    ctx.fill();
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(s2, s2, r, 0, Math.TAU);
    ctx.moveTo(s2 + innerRadius, s2);
    ctx.arc(s2, s2, innerRadius, 0, Math.TAU);
    for (let a = 0; a < Math.TAU; a += Math.TAU / steps) {
        const aa = a - Math.PI / steps;
        ctx.moveTo(Math.cos(aa) * innerRadius + s2, Math.sin(aa) * innerRadius + s2);
        ctx.lineTo(Math.cos(aa) * r + s2, Math.sin(aa) * r + s2);
    }
    //ctx.fill("evenodd");
    ctx.stroke();
    // ctx.fillStyle = "#000";
    ctx.font = "13px arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const tr = r - 8;
    var idx = 1;        
    for (let a = 0; a < Math.TAU; a += Math.TAU / steps) {
        const dx = Math.cos(a);
        const dy = Math.sin(a);
        ctx.setTransform(dy, -dx, dx, dy, dx * (tr - 90) + s2, dy * (tr - 90) + s2);
        ctx.rotate(Math.PI/2);
        ctx.fillText("aaa"+ (idx ++), 0, 0);
    }
    return ctx.canvas;
}