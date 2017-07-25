function FadeSlider (items, currentItem, currentPosition, prevButton, nextButton) {
    Slider.call(this, items, currentItem, currentPosition, prevButton, nextButton);

    var _this = this;
    this.slideTo = function (toGoItemIndex) {
        var toGoItem = items[toGoItemIndex];
        this._currentItem.classList.remove('active');

        setTimeout(function () {
            _this._currentItem.classList.add('hidden');
            toGoItem.classList.remove('hidden');
            toGoItem.classList.add('active');
            _this._currentItem = toGoItem;
            _this._currentPosition = toGoItemIndex;
        }, this._anumationDuration);
    }
}