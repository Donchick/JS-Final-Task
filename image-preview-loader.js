function ImagePreviewLoader (fileInput, previewes, imgLoaded) {
    fileInput.addEventListener('change', function (e) {
        var file = this.files[0];
        var fr = new FileReader();
        fr.onload = (function (file) {
            return function (e) {
                var data = e.target.result;
                previewes.forEach(preview => preview.src = data);

                imgLoaded();
            }
        })(file);

        fr.readAsDataURL(file);
    });
}