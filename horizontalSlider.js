function HorizontalSlider (itemsWidth, items, currentItem, currentPosition, prevButton, nextButton) {
    Slider.call(this, items, currentItem, currentPosition, prevButton, nextButton);

    var _this = this;
    this.slideTo = function (toGoItemIndex, direction) {
        var toGoItem = items[toGoItemIndex];
        this._currentItem.classList.remove('active');

        var leftSideItem = direction === this._nextDirection ?
            this._currentItem : toGoItem;
        var rightSideItem = direction === this._nextDirection ?
            toGoItem: this._currentItem;

        leftSideItem.style.left = '0px';
        leftSideItem.style.direction = 'rtl';
        rightSideItem.style.left = itemsWidth + 'px';
        rightSideItem.style.direction = 'ltr';

        setTimeout(function () {
            rightSideItem.style.left = '0px';
            _this._currentItem = toGoItem;
            _this._currentPosition = toGoItemIndex;
        }, this._anumationDuration);
    }
}