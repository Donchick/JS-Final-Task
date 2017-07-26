function SimpleTextEditor (textInput, textOutput, boldActivator, emphasizeAcitvator, quoteActivator) {
    textInput.addEventListener('input', function () {
        var regexp = /\[(\/?)([bqi])\]/g;
        var result = textInput.value.replace(regexp, '<$1$2>')
            .replace(/\n/g, '<br>');
        textOutput.innerHTML = result || '';
    });

    boldActivator.addEventListener('click', function () {
        var selectionPosition = getSelectionPosition();

        textInput.value = addSubTag(textInput.value,
            selectionPosition.start, selectionPosition.end, 'b');
        triggerReviewTextChanged();
    });

    emphasizeAcitvator.addEventListener('click', function () {
        var selectionPosition = getSelectionPosition();

        textInput.value = addSubTag(textInput.value,
            selectionPosition.start, selectionPosition.end, 'i');
        triggerReviewTextChanged();
    });

    quoteActivator.addEventListener('click', function () {
        var selectionPosition = getSelectionPosition();

        textInput.value = addSubTag(textInput.value,
            selectionPosition.start, selectionPosition.end, 'q');
        triggerReviewTextChanged();
    });

    function getSelectionPosition() {
        return {
            start: textInput.selectionStart,
            end: textInput.selectionEnd
        };
    }

    function triggerReviewTextChanged () {
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        textInput.dispatchEvent(event);
    }

    function addSubTag(text, start, end, tag) {
        var result;
        if (start < end) {
            result = text.slice(0, start) + `[${tag}]` + text.slice(start, end) +
                `[/${tag}]` + text.slice(end);
        } else {
            result = text + `[${tag}][/${tag}]`;
        }

        return result;
    }
}