var productImageObjects = [{
    imgSrc: '1.jpg',
    productDesc: 'first product desc',
    isActive: true
}, {
    imgSrc: '2.jpg',
    productDesc: 'second product desc'
}, {
    imgSrc: '3.jpg',
    productDesc: 'third product desc'
}];

var promise = Promise.resolve();

for (var i = 0; i < productImageObjects.length; i++) {
    let obj = productImageObjects[i];
    promise = promise.then(() => loadImg(obj.imgSrc))
        .then(img => getWatermarkedCanvas(img, 'DEMO SHOP'))
        .then(canvas => {
            new Zoomer(canvas, document.getElementsByClassName('zoomed-img')[0]);
            return canvas;
        })
        .then(canvas => appendWatermarkedCanvas(canvas, obj.productDesc, obj.isActive));
}



promise.then(() => new FadeSlider(document.querySelectorAll('.block-image-slider canvas'),
    document.querySelectorAll('canvas.active')[0], 0,
    document.getElementById("prev"), document.getElementById("next")))
.then(() => new HorizontalSlider(document.querySelectorAll('.block-image-slider canvas')[0].offsetWidth, document.querySelectorAll('.block-image-slider canvas+span'),
    document.querySelectorAll('canvas.active+span')[0], 0,
    document.getElementById("prev"), document.getElementById("next")));