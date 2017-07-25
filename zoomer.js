function Zoomer (canvas, zoomOutput) {
    this._topPos = 0;
    this._leftPos = 0;
    this._imgData = null;
    var _this = this;

    canvas.addEventListener('mousemove', function (e) {
        var context = canvas.getContext('2d');
        if (_this._imgData) {
            context.clearRect(_this._leftPos - 2, _this._topPos - 2, 256, 456);
            context.putImageData(_this._imgData, _this._leftPos - 2, _this._topPos - 2);
        }

        context.strokeStyle = '#fecd2f';
        context.fillStyle = "rgba(255, 255, 255, 0.3)";
        context.lineWidth = '3';

        var widthScale = canvas.width / e.target.clientWidth;
        var heightScale = canvas.height / e.target.clientHeight;

        _this._leftPos = e.layerX * widthScale - 125;
        _this._leftPos = _this._leftPos < 0 ? 0 : _this._leftPos;
        _this._leftPos = _this._leftPos > canvas.width - 250 ? canvas.width - 250 : _this._leftPos;

        _this._topPos = e.layerY * heightScale - 225;
        _this._topPos = _this._topPos < 0 ? 0 : _this._topPos;
        _this._topPos = _this._topPos > canvas.height - 450 ? canvas.height - 450 : _this._topPos;

        _this._imgData = context.getImageData(_this._leftPos - 2, _this._topPos - 2, 258, 458);

        context.fillRect(_this._leftPos, _this._topPos, 250, 450);
        context.strokeRect(_this._leftPos, _this._topPos, 250, 450);

        _this.showZoomedData(e);
    });

    canvas.addEventListener('mouseout', function () {
        var context = canvas.getContext('2d');

        if (_this._imgData) {
            context.clearRect(_this._leftPos - 2, _this._topPos - 2, 256, 456);
            context.putImageData(_this._imgData, _this._leftPos - 2, _this._topPos - 2);
        }

        _this.hideZoomedData();
    });

    this.showZoomedData = function (e) {
        var target = zoomOutput || document.getElementsByClassName('zoomed-img')[0];

        var canvasPos = canvas.getBoundingClientRect();
        var leftPos = canvasPos.right;
        var topPos = canvasPos.top + e.target.clientHeight/2 - this._imgData.height/2;

        if (target.style['display'] !== 'block') {
            target.style['display'] = 'block';
            target.style['left'] = `${leftPos}px`;
            target.style['top'] = `${topPos}px`;
        }

        target.width = this._imgData.width - 8;
        target.height = this._imgData.height - 8;
        var context = target.getContext('2d');
        context.save();
        context.scale(2, 2);
        context.clearRect(0, 0, target.width, target.height);
        context.putImageData(this._imgData, -2, -2);
        context.restore();
    }

    this.hideZoomedData = function () {
        var target = zoomOutput || document.getElementsByClassName('zoomed-img')[0];

        if (target.style['display'] === 'block') {
            target.style['display'] = 'none';
        }
    }
}