document.addEventListener('DOMContentLoaded', () => {
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const playButton = container.querySelector('.play-button');
        const overlay = container.querySelector('.video-overlay');
        const progressBar = container.querySelector('.progress');
        const timeDisplay = container.querySelector('.time-display');
        const fullscreenButton = container.querySelector('.fullscreen-button');
        const videoWrapper = container.querySelector('.video-wrapper');

        playButton.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                overlay.style.opacity = '0';
            } else {
                video.pause();
                overlay.style.opacity = '1';
            }
        });

        video.addEventListener('play', () => {
            overlay.style.opacity = '0';
        });

        video.addEventListener('pause', () => {
            overlay.style.opacity = '1';
        });

        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${progress}%`;
            timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        });

        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                if (videoWrapper.requestFullscreen) {
                    videoWrapper.requestFullscreen();
                } else if (videoWrapper.mozRequestFullScreen) {
                    videoWrapper.mozRequestFullScreen();
                } else if (videoWrapper.webkitRequestFullscreen) {
                    videoWrapper.webkitRequestFullscreen();
                } else if (videoWrapper.msRequestFullscreen) {
                    videoWrapper.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement === videoWrapper) {
                videoWrapper.classList.add('fullscreen');
            } else {
                videoWrapper.classList.remove('fullscreen');
            }
        });

        container.querySelector('.progress-bar').addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const clickedValue = x / rect.width;
            video.currentTime = clickedValue * video.duration;
        });
    });

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
});