function updateProgress(newValue){
    document.getElementById('download').value = newValue
}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000'
ctx.fillRect(0, 0, 150, 75)