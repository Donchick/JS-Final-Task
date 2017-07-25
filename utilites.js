function loadImg (imgSrc) {
    return new Promise(resolve => {
        var img = new Image();
        img.src = imgSrc;
        img.onload = () => resolve(img);
    })
}

function getWatermarkedCanvas (img) {
    var waterMark = 'DEMO SHOP';
    var watermarkedCanvas = document.createElement('canvas');
    var watermarkedCtx = watermarkedCanvas.getContext('2d');
    watermarkedCanvas.width = img.width;
    watermarkedCanvas.height = img.height;
    watermarkedCtx.drawImage(img, 0, 0);
    watermarkedCtx.font = '48px Engravers Gothic';
    watermarkedCtx.fillStyle = '#d2d2d2';

    var textRightPos = watermarkedCanvas.width - watermarkedCtx.measureText(waterMark).width - 60;
    var textTopPos = 60;
    watermarkedCtx.fillText(waterMark, textRightPos, textTopPos);

    return watermarkedCanvas;
}

function appendWatermarkedCanvas (canvas, imgDesc, isActive) {
    if (isActive) {
        canvas.classList.add('active');
    } else {
        canvas.classList.add('hidden');
    }

    var span = document.createElement('span');
    span.innerHTML = imgDesc;

    var parent = document.getElementsByClassName('block-image-slider')[0];
    parent.appendChild(canvas);
    parent.appendChild(span);

    return Promise.resolve();
}