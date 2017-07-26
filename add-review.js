var months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'Jule',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
};

var userNameInput = document.querySelector('.review-editor .user-name');
var userNameOutput = document.querySelector('.review-preview .user-name');

var avatarInput = document.querySelector('.review-editor .avatar');
var avatarUploadOuput = document.querySelector('.review-editor .avatar-img');
var avatarOutput = document.querySelector('.review-preview .review-avatar');
var avatarEmptyLabel = document.querySelector('.review-editor .empty-avatar.label');
var avatarSelectedLabel = document.querySelector('.review-editor .selected-avatar.label');

var productRatingEditorInputs = document.querySelectorAll('.review-editor .product-rating-editor i');
var productRatingEditorOutputs = document.querySelector('.review-preview .product-rating-viewer');

var reviewTextInput = document.querySelector('.review-editor .review-text');
var reviewTextOutput = document.querySelector('.review-preview .review-preview-text');

var boldBtn = document.getElementsByClassName('bold-btn')[0];
var emphasizeBtn = document.getElementsByClassName('emphasize-btn')[0];
var quoteBtn = document.getElementsByClassName('quote-btn')[0];
var reviewDate = document.getElementsByClassName('review-date')[0];

var openReviewEditorLabel = document.querySelector('.add-review-lable .open-label');
var closedReviewEditorLabel = document.querySelector('.add-review-lable .closed-label');
var openedReviewEditorLabel = document.querySelector('.add-review-lable .opened-label');
var productReview = document.querySelector('.product-review');

var cancelBtn = document.getElementsByClassName('cancel-btn')[0];

openReviewEditorLabel.addEventListener('click', function () {
    productReview.style['display'] = 'block';
    closedReviewEditorLabel.setAttribute('hidden', 'hidden');
    openedReviewEditorLabel.removeAttribute(('hidden'));

    var date = new Date();
    reviewDate.textContent = `${date.getDate()} ${months[date.getMonth()]} , ${date.getFullYear()}`;
});

cancelBtn.addEventListener('click', function () {
    productReview.style['display'] = 'none';
    openedReviewEditorLabel.setAttribute('hidden', 'hidden');
    closedReviewEditorLabel.removeAttribute(('hidden'));
});

userNameInput.addEventListener('input', function () {
    userNameOutput.textContent = userNameInput.value || 'Your name';
});

reviewTextInput.addEventListener('input', function () {
    var regexp = /\[(\/?)([bqi])\]/g;
    var result = reviewTextInput.value.replace(regexp, '<$1$2>')
        .replace(/\n/g, '<br>');
    reviewTextOutput.innerHTML = result || '';
});

boldBtn.addEventListener('click', function () {
    var selectionPosition = getSelectionPosition(reviewTextInput);

    reviewTextInput.value = addSubTag(reviewTextInput.value,
        selectionPosition.start, selectionPosition.end, 'b');
    triggerReviewTextChanged();
});

emphasizeBtn.addEventListener('click', function () {
    var selectionPosition = getSelectionPosition(reviewTextInput);

    reviewTextInput.value = addSubTag(reviewTextInput.value,
        selectionPosition.start, selectionPosition.end, 'i');
    triggerReviewTextChanged();
});

quoteBtn.addEventListener('click', function () {
    var selectionPosition = getSelectionPosition(reviewTextInput);

    reviewTextInput.value = addSubTag(reviewTextInput.value,
        selectionPosition.start, selectionPosition.end, 'q');
    triggerReviewTextChanged();
});

function getSelectionPosition(textElement) {
    return {
        start: textElement.selectionStart,
        end: textElement.selectionEnd
    };
}

function triggerReviewTextChanged () {
    var event = document.createEvent('Event');
    event.initEvent('input', true, true);
    reviewTextInput.dispatchEvent(event);
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

avatarInput.addEventListener('change', function (e) {
    var file = this.files[0];
    var fr = new FileReader();
    fr.onload = (function (file) {
        return function (e) {
            var data = e.target.result;
            avatarOutput.src = data;
            avatarUploadOuput.src = data;
            avatarSelectedLabel.removeAttribute('hidden');
            avatarEmptyLabel.setAttribute('hidden', 'hidden');
        }
    })(file);

    fr.readAsDataURL(file);
});

productRatingEditorInputs.forEach(input => {
    input.addEventListener('click', function (event) {
        var rating = event.currentTarget.dataset["rating"];

        for (var i = 0; i < productRatingEditorInputs.length; i++) {
            if (i < rating) {
                productRatingEditorInputs[i].classList.remove('grey-star');
                productRatingEditorInputs[i].classList.add('gold-star');

                productRatingEditorOutputs.removeAttribute('hidden');
                productRatingEditorOutputs.children[i].classList.remove('star');
                productRatingEditorOutputs.children[i].classList.add('gold-star');
            } else {
                productRatingEditorInputs[i].classList.remove('gold-star');
                productRatingEditorInputs[i].classList.add('grey-star');
                productRatingEditorOutputs.children[i].classList.add('star');
                productRatingEditorOutputs.children[i].classList.remove('gold-star');
            }
        }
    });
});