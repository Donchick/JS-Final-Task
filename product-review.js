;(function () {
    function imgLoaded (avatarSelectedLabel, avatarEmptyLabel) {
        avatarSelectedLabel.removeAttribute('hidden');
        avatarEmptyLabel.setAttribute('hidden', 'hidden');
    }

    function SimpleTextEditor (textInput, textOutput, boldActivator, emphasizeAcitvator, quoteActivator) {
        textInput.addEventListener('input', function () {
            let regexp = /\[(\/?)([bqi])\]/g;
            let result = textInput.value.replace(regexp, '<$1$2>')
                .replace(/\n/g, '<br>');
            textOutput.innerHTML = result || '';
        });

        boldActivator.addEventListener('click', function () {
            let selectionPosition = getSelectionPosition();

            textInput.value = addSubTag(textInput.value,
                selectionPosition.start, selectionPosition.end, 'b');
            triggerReviewTextChanged();
        });

        emphasizeAcitvator.addEventListener('click', function () {
            let selectionPosition = getSelectionPosition();

            textInput.value = addSubTag(textInput.value,
                selectionPosition.start, selectionPosition.end, 'i');
            triggerReviewTextChanged();
        });

        quoteActivator.addEventListener('click', function () {
            let selectionPosition = getSelectionPosition();

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
            let event = document.createEvent('Event');
            event.initEvent('input', true, true);
            textInput.dispatchEvent(event);
        }

        function addSubTag(text, start, end, tag) {
            let result;
            if (start < end) {
                result = text.slice(0, start) + `[${tag}]` + text.slice(start, end) +
                    `[/${tag}]` + text.slice(end);
            } else {
                result = text + `[${tag}][/${tag}]`;
            }

            return result;
        }
    }

    function ImagePreviewLoader (fileInput, previewes, imgLoaded) {
        fileInput.addEventListener('change', function (e) {
            let file = this.files[0];
            let fr = new FileReader();
            fr.onload = (function (file) {
                return function (e) {
                    let data = e.target.result;
                    previewes.forEach(preview => preview.src = data);

                    imgLoaded();
                }
            })(file);

            fr.readAsDataURL(file);
        });
    }


    window.ProductReview = function () {
        let months = ['January', 'February', 'March', 'April', 'May',
            'June', 'Jule', 'August', 'September', 'October', 'November', 'December'];

        let userNameInput = document.querySelector('.review-editor .user-name');
        let userNameOutput = document.querySelector('.review-preview .user-name');

        let avatarInput = document.querySelector('.review-editor .avatar');
        let avatarUploadOutput = document.querySelector('.review-editor .avatar-img');
        let avatarOutput = document.querySelector('.review-preview .review-avatar');
        let avatarEmptyLabel = document.querySelector('.review-editor .empty-avatar.label');
        let avatarSelectedLabel = document.querySelector('.review-editor .selected-avatar.label');

        let productRatingEditorInputs = document.querySelectorAll('.review-editor .product-rating-editor i');
        let productRatingEditorOutputs = document.querySelector('.review-preview .product-rating-viewer');

        let reviewTextInput = document.querySelector('.review-editor .review-text');
        let reviewTextOutput = document.querySelector('.review-preview .review-preview-text');

        let boldBtn = document.getElementsByClassName('bold-btn')[0];
        let emphasizeBtn = document.getElementsByClassName('emphasize-btn')[0];
        let quoteBtn = document.getElementsByClassName('quote-btn')[0];
        let reviewDate = document.getElementsByClassName('review-date')[0];

        let openReviewEditorLabel = document.querySelector('.add-review-lable .open-label');
        let closedReviewEditorLabel = document.querySelector('.add-review-lable .closed-label');
        let openedReviewEditorLabel = document.querySelector('.add-review-lable .opened-label');
        let productReview = document.querySelector('.product-review');

        let cancelBtn = document.getElementsByClassName('cancel-btn')[0];
        let textEditor;
        let imgPreviewLoader;

        openReviewEditorLabel.addEventListener('click', function () {
            productReview.style['display'] = 'block';
            closedReviewEditorLabel.setAttribute('hidden', 'hidden');
            openedReviewEditorLabel.removeAttribute(('hidden'));

            let date = new Date();
            reviewDate.textContent = `${date.getDate()} ${months[date.getMonth()]} , ${date.getFullYear()}`;

            if (!textEditor) {
                textEditor = new SimpleTextEditor (reviewTextInput, reviewTextOutput, boldBtn, emphasizeBtn, quoteBtn);
            }

            if (!imgPreviewLoader) {
                imgPreviewLoader = new ImagePreviewLoader(avatarInput,
                    [avatarUploadOutput, avatarOutput], imgLoaded.bind(null, avatarSelectedLabel, avatarEmptyLabel));
            }
        });

        cancelBtn.addEventListener('click', function () {
            productReview.style['display'] = 'none';
            openedReviewEditorLabel.setAttribute('hidden', 'hidden');
            closedReviewEditorLabel.removeAttribute(('hidden'));
        });

        userNameInput.addEventListener('input', function () {
            userNameOutput.textContent = userNameInput.value || 'Your name';
        });

        productRatingEditorInputs.forEach(input => {
            input.addEventListener('click', function (event) {
                let rating = event.currentTarget.dataset["rating"];

                for (let i = 0; i < productRatingEditorInputs.length; i++) {
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
    }
})();