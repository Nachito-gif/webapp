document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    const colorblindButton = document.getElementById('toggle-colorblind');
    const readerButton = document.getElementById('toggle-reader');
    const themeButton = document.getElementById('toggle-theme');
    const body = document.body;
    const header = document.querySelector('.header');
    let colorblindMode = false;
    let readerActive = false;
    let synth = window.speechSynthesis;
    let selectedText;
    let lastScrollTop = 0;

    const categoryButtons = document.querySelectorAll('.category-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Game elements
    const gameContainer = document.querySelector('.game-container');
    const gameCanvas = document.getElementById('gameCanvas');
    const gameMessage = document.querySelector('.game-message');
    const gameOverMessage = document.querySelector('.game-over-message');
    const restartButton = document.getElementById('restart-button');
    const ctx = gameCanvas.getContext('2d');
    let gameActive = false;
    let logoImage = new Image();
    logoImage.src = 'images/MOCKUPS HECHOS/IMG_6375.PNG';

    // Game variables
    let logoX = 50;
    let logoY = 100;
    let logoHeight = 50;
    let logoWidth = 50;
    let logoVelocityY = 0;
    let gravity = 1.5;
    let jumpForce = -18;
    let obstacleX = 750;
    let obstacleWidth = 30;
    let obstacleHeight = 60;
    let obstacleSpeed = 5;
    let score = 0;
    let gameInterval;
    let speechUtterances = [];
    let currentUtteranceIndex = 0;

    // Lightbox elements
    const lightbox = document.querySelector('.lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxImage = document.querySelector('.lightbox-image');
    const portfolioLinks = document.querySelectorAll('.portfolio-item a');

    // Contact Form
    const contactForm = document.getElementById('contact-form');

    menuToggle.addEventListener('click', function () {
        navbar.classList.toggle('active');
           this.setAttribute('aria-expanded', navbar.classList.contains('active'));
    });

    colorblindButton.addEventListener('click', function () {
        colorblindMode = !colorblindMode;
        body.classList.toggle('colorblind-mode', colorblindMode);
    });

    readerButton.addEventListener('click', function () {
        readerActive = !readerActive;
        if (readerActive) {
            speakPage();
        } else {
            stopSpeaking();
        }
    });

    function speakPage() {
        selectedText = document.querySelectorAll('h1, h2, p, li, a');
        speechUtterances = [];
        currentUtteranceIndex = 0;
        synth.cancel();

        selectedText.forEach(element => {
            const utter = new SpeechSynthesisUtterance(element.textContent);
            speechUtterances.push(utter);
            utter.onend = speakNext;
        });
        if (speechUtterances.length > 0) {
            synth.speak(speechUtterances[0]);
        }
    }

    function speakNext() {
        currentUtteranceIndex++;
        if (currentUtteranceIndex < speechUtterances.length) {
            synth.speak(speechUtterances[currentUtteranceIndex]);
        }
    }

    function stopSpeaking() {
        synth.cancel();
    }

    window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        lastScrollTop = scrollTop;
    });

   categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            portfolioItems.forEach(item => {
                item.classList.remove('show');
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.add('show');
                }
            });
        });
    });

    function drawGame() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--game-obstacle-color');
        ctx.fillRect(obstacleX, gameCanvas.height - obstacleHeight, obstacleWidth, obstacleHeight);
        ctx.font = '16px Roboto';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--game-text-color');
        ctx.fillText('Score: ' + score, 10, 20);
    }


    function updateGame() {
        logoVelocityY += gravity;
        logoY += logoVelocityY;

        if (logoY > gameCanvas.height - logoHeight) {
            logoY = gameCanvas.height - logoHeight;
            logoVelocityY = 0;
        }

        obstacleX -= obstacleSpeed;
        if (obstacleX < -obstacleWidth) {
            obstacleX = gameCanvas.width;
            score++;
        }

        if (
            logoX < obstacleX + obstacleWidth &&
            logoX + logoWidth > obstacleX &&
            logoY < gameCanvas.height &&
            logoY + logoHeight > gameCanvas.height - obstacleHeight
        ) {
            gameOver();
        }
    }
      function gameOver() {
          gameActive = false;
            clearInterval(gameInterval);
             gameContainer.classList.remove('active');
            body.classList.remove('game-active');
              header.classList.remove('hidden');
           gameOverMessage.classList.remove('hidden');
        }

    function startGame() {
        if (gameActive) return;
        gameActive = true;
        gameContainer.classList.add('active');
        gameMessage.style.display = 'none';
        gameOverMessage.classList.add('hidden');
        body.classList.add('game-active');
        logoY = 100;
        obstacleX = 750;
        score = 0;
        logoVelocityY = 0;
        header.classList.add('hidden');

        gameInterval = setInterval(function () {
            drawGame();
            updateGame();
        }, 1000 / 60);
    }
    
      document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            if (!gameActive) {
                startGame();
            } else {
                logoVelocityY = jumpForce;
            }
        }
    });
     restartButton.addEventListener('click', function() {
         startGame();
     });

    gameContainer.classList.remove('active');
    
     // Theme toggle functionality
    themeButton.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
    });
    
     // Lightbox functionality
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function(event) {
           event.preventDefault(); // Prevent default link behavior
             const imageSrc = this.getAttribute('data-lightbox');
            lightboxImage.src = imageSrc;
            lightbox.classList.add('show');
             lightbox.focus();
        });
    });
  
  lightboxClose.addEventListener('click', function(){
    lightbox.classList.remove('show');
  });
    
    lightbox.addEventListener('click', function(event) {
      if (event.target === lightbox) {
        lightbox.classList.remove('show');
      }
    });

    // Contact Form Submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;

        sendEmail(email)
        
    });
      function sendEmail(email) {
          console.log("Enviando email a ignaciocanosaenz@gmail.com con el email: " + email);
           alert("Email sent successfully to ignaciocanosaenz@gmail.com with the email: " + email);
        }
});