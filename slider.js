function Slider (items, currentItem, currentPosition, prevButton, nextButton, anumationDuration) {
    var itemsCount = items.length;
    this._nextDirection = 1;
    this._prevDirection = -1;
    this._currentItem = currentItem;
    this._currentPosition = currentPosition;
    this._anumationDuration = anumationDuration || 500;
    var _this = this;

    nextButton.addEventListener('click', onClickNext);
    prevButton.addEventListener('click', onClickPrev);

    function onClickPrev () {
        var itemIndex = _this._currentPosition === 0 ? itemsCount - 1
            : _this._currentPosition - 1;
        _this.slideTo(itemIndex, _this._prevDirection);
    }

    function onClickNext () {
        var itemIndex = _this._currentPosition === itemsCount  -1 ?
            0 : _this._currentPosition + 1;
        _this.slideTo(itemIndex, _this._nextDirection);
    }

    this.slideTo = function (toGoItemIndex) {
        var toGoItem = items[toGoItemIndex];
        this._currentItem = toGoItem;
        this._currentPosition = toGoItemIndex;
    }
}