;(function () {
    let sliderContainerClass = 'block-image-slider';

    function getWatermarkedCanvas (img, waterMark) {
        let watermarkedCanvas = document.createElement('canvas');
        let watermarkedCtx = watermarkedCanvas.getContext('2d');
        watermarkedCanvas.width = img.width;
        watermarkedCanvas.height = img.height;
        watermarkedCtx.drawImage(img, 0, 0);
        watermarkedCtx.font = '48px Engravers Gothic';
        watermarkedCtx.fillStyle = '#d2d2d2';

        let textRightPos = watermarkedCanvas.width - watermarkedCtx.measureText(waterMark).width - 60;
        let textTopPos = 60;
        watermarkedCtx.fillText(waterMark, textRightPos, textTopPos);

        return watermarkedCanvas;
    }

    function appendWatermarkedCanvas (canvas, imgDesc, isActive) {
        if (isActive) {
            canvas.classList.add('active');
        } else {
            canvas.classList.add('hidden');
        }

        let span = document.createElement('span');
        span.innerHTML = imgDesc;

        let parent = document.getElementsByClassName(sliderContainerClass)[0];
        parent.appendChild(canvas);
        parent.appendChild(span);

        return Promise.resolve();
    }

    function Zoomer (canvas, zoomOutput) {
        this._topPos = 0;
        this._leftPos = 0;
        this._imgData = null;

        canvas.addEventListener('mousemove', (e) => {
            let context = canvas.getContext('2d');
            if (this._imgData) {
                context.clearRect(this._leftPos - 2, this._topPos - 2, 256, 456);
                context.putImageData(this._imgData, this._leftPos - 2, this._topPos - 2);
            }

            context.strokeStyle = '#fecd2f';
            context.fillStyle = "rgba(255, 255, 255, 0.3)";
            context.lineWidth = '3';

            let widthScale = canvas.width / e.target.clientWidth;
            let heightScale = canvas.height / e.target.clientHeight;

            this._leftPos = e.layerX * widthScale - 125;
            this._leftPos = this._leftPos < 0 ? 0 : this._leftPos;
            this._leftPos = this._leftPos > canvas.width - 250 ? canvas.width - 250 : this._leftPos;

            this._topPos = e.layerY * heightScale - 225;
            this._topPos = this._topPos < 0 ? 0 : this._topPos;
            this._topPos = this._topPos > canvas.height - 450 ? canvas.height - 450 : this._topPos;

            this._imgData = context.getImageData(this._leftPos - 2, this._topPos - 2, 258, 458);

            context.fillRect(this._leftPos, this._topPos, 250, 450);
            context.strokeRect(this._leftPos, this._topPos, 250, 450);

            this.showZoomedData(e);
        });

        canvas.addEventListener('mouseout', () => {
            let context = canvas.getContext('2d');

            if (this._imgData) {
                context.clearRect(this._leftPos - 2, this._topPos - 2, 256, 456);
                context.putImageData(this._imgData, this._leftPos - 2, this._topPos - 2);
            }

            this.hideZoomedData();
        });

        this.showZoomedData = function (e) {
            let target = zoomOutput || document.getElementsByClassName('zoomed-img')[0];

            let canvasPos = canvas.getBoundingClientRect();
            let leftPos = canvasPos.right;
            let topPos = canvasPos.top + e.target.clientHeight/2 - this._imgData.height/2;

            if (target.style['display'] !== 'block') {
                target.style['display'] = 'block';
                target.style['left'] = `${leftPos}px`;
                target.style['top'] = `${topPos}px`;
            }

            target.width = this._imgData.width - 8;
            target.height = this._imgData.height - 8;
            let context = target.getContext('2d');
            context.save();
            context.scale(2, 2);
            context.clearRect(0, 0, target.width, target.height);
            context.putImageData(this._imgData, -2, -2);
            context.restore();
        };

        this.hideZoomedData = function () {
            let target = zoomOutput || document.getElementsByClassName('zoomed-img')[0];

            if (target.style['display'] === 'block') {
                target.style['display'] = 'none';
            }
        }
    }

    function Slider (items, currentItem, currentPosition, prevButton, nextButton, animationDuration = 500) {
        let itemsCount = items.length;
        this._nextDirection = 1;
        this._prevDirection = -1;
        this._currentItem = currentItem;
        this._currentPosition = currentPosition;
        this._animationDuration = animationDuration;

        nextButton.addEventListener('click', onClickNext.bind(this));
        prevButton.addEventListener('click', onClickPrev.bind(this));

        function onClickPrev () {
            let itemIndex = this._currentPosition === 0 ? itemsCount - 1
                : this._currentPosition - 1;
            this.slideTo(itemIndex, this._prevDirection);
        }

        function onClickNext () {
            let itemIndex = this._currentPosition === itemsCount  -1 ?
                0 : this._currentPosition + 1;
            this.slideTo(itemIndex, this._nextDirection);
        }

        this.slideTo = function (toGoItemIndex) {
            this._currentItem = items[toGoItemIndex];
            this._currentPosition = toGoItemIndex;
        }
    }

    function FadeSlider (items, currentItem, currentPosition, prevButton, nextButton) {
        Slider.call(this, items, currentItem, currentPosition, prevButton, nextButton);

        this.slideTo = function (toGoItemIndex) {
            let toGoItem = items[toGoItemIndex];
            this._currentItem.classList.remove('active');

            setTimeout(() => {
                this._currentItem.classList.add('hidden');
                toGoItem.classList.remove('hidden');
                toGoItem.classList.add('active');
                this._currentItem = toGoItem;
                this._currentPosition = toGoItemIndex;
            }, this._animationDuration);
        }
    }

    function HorizontalSlider (itemsWidth, items, currentItem, currentPosition, prevButton, nextButton) {
        Slider.call(this, items, currentItem, currentPosition, prevButton, nextButton);

        this.slideTo = function (toGoItemIndex, direction) {
            let toGoItem = items[toGoItemIndex];
            this._currentItem.classList.remove('active');

            let leftSideItem = direction === this._nextDirection ?
                this._currentItem : toGoItem;
            let rightSideItem = direction === this._nextDirection ?
                toGoItem: this._currentItem;

            leftSideItem.style.left = '0px';
            leftSideItem.style.direction = 'rtl';
            rightSideItem.style.left = itemsWidth + 'px';
            rightSideItem.style.direction = 'ltr';

            setTimeout(() => {
                rightSideItem.style.left = '0px';
                this._currentItem = toGoItem;
                this._currentPosition = toGoItemIndex;
            }, this._animationDuration);
        }
    }

    window.ImageSlider = function (contentContainer, watermarkLabel, addZoomer) {
        let imgs = [].slice.call(contentContainer.children);

        imgs.forEach(img => {
            let canvas = getWatermarkedCanvas(img, watermarkLabel);
            if (addZoomer) {
                new Zoomer(canvas, document.getElementsByClassName('zoomed-img')[0]);
            }
            appendWatermarkedCanvas(canvas, img.getAttribute('alt'), img.getAttribute('isActive'));
        });

        let imageItems = document.querySelectorAll(`.${sliderContainerClass} canvas`);
        let titleItems = document.querySelectorAll(`.${sliderContainerClass} canvas+span`);
        let currentImage = document.querySelectorAll('canvas.active')[0];
        let currentTitle = document.querySelectorAll('canvas.active+span')[0];
        let nextButton = document.getElementById('next');
        let prevButton = document.getElementById('prev');
        let currentPosition = 0;
        new FadeSlider(imageItems, currentImage, currentPosition, prevButton, nextButton);
        new HorizontalSlider(imageItems[0].offsetWidth, titleItems, currentTitle, currentPosition, prevButton, nextButton);
    };
})();