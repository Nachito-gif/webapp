document.addEventListener('DOMContentLoaded', function() {
    const venenoGif = document.getElementById('venenoGif');
    const audioDigo = document.getElementById('audioDigo');

    venenoGif.addEventListener('click', function() {
        audioDigo.play();
    });
});