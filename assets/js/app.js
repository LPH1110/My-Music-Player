const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const audio = $('#audio');
const songImage = $('.dashboard__image');
const songName = $('.dashboard__info-name');
const songSinger = $('.dashboard__info-singer');
const playBtn = $('.play__control-toggle-play');
const progress = $('#progress');
const nextBtn = $('.play__rewind-next');
const prevBtn = $('.play__rewind-prev');
const repeatBtn = $('.play__control-repeat');
const randomBtn = $('.play__control-random');
const songStatus = $('.dashboard__heading-status');
const currentTimeProgress = $('.play__progress-time-current');

const app = {
    currentIndex: 0, 
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    
    songs: [
        {
            name: 'Vicetone (ft. Cozi Zuehlsdorff)',
            singer: 'Nevada',
            path: './assets/mp3/Vicetone_Nevada.mp3',
            image: './assets/img/Vice-tone_Nevada.jpg'
        },
        {
            name: 'Born For This (Official Audio)',
            singer: 'The Score',
            path: './assets/mp3/The-Score_Born-For-This.mp3',
            image: './assets/img/The-Score_Born-for-this.jpg'
        },
        {
            name: 'The Law',
            singer: 'Reach',
            path: './assets/mp3/The-Law_Reach.mp3',
            image: './assets/img/TheLaw-Reach.jpg'
        },
        {
            name: 'Shine',
            singer: 'Matt Beillis',
            path: './assets/mp3/Shine_Matt-Beilis.mp3',
            image: './assets/img/Shine-Matt-Beilis.jpg'
        },
        {
            name: 'Legends Are Made [Official Audio]',
            singer: 'Sam Tinnesz',
            path: './assets/mp3/Sam-Tinnesz_Legends-Are-Made.mp3',
            image: './assets/img/Legends-Are-Made_Sam-Tinnesz.jpg'
        },
        {
            name: 'Savages',
            singer: 'Royal Deluxe',
            path: './assets/mp3/Royal-Deluxe_Savages.mp3',
            image: './assets/img/Savages-Royal-Deluxe.jpg'
        },
        {
            name: 'Monster',
            singer: 'Willyecho',
            path: './assets/mp3/Monster_Willyecho.mp3',
            image: './assets/img/Monster_Willyecho.jpg'
        },
        {
            name: 'Lions Inside',
            singer: 'Valley of Wolves',
            path: './assets/mp3/Lions-Inside_Valley-of-Wolves.mp3',
            image: './assets/img/Lions-Inside.jpg'
        },
        {
            name: 'HEROES',
            singer: 'Eye of the Storm',
            path: './assets/mp3/HEROES_Eye-of-the-Storm.mp3',
            image: './assets/img/HEROES_Eye-Of-The-Storm.jpg'
        },
        {
            name: 'Echo (Ready for War)',
            singer: 'Autumn Kings',
            path: './assets/mp3/Autumn-Kings_Echo.mp3',
            image: './assets/img/Echo-ReadyForWar_Autumn-Kings.png'
        },
        {
            name: 'Timber',
            singer: 'Pitbull - ft. Ke$ha',
            path: './assets/mp3/Pitbull_Timber.mp3',
            image: './assets/img/Timber_Pitbutt-ft-Kesha.jpg'
        },
        {
            name: 'Legacy',
            singer: 'Lost Stars',
            path: './assets/mp3/Legacy_Lost-Stars.mp3',
            image: './assets/img/Legacy_Lost-Stars.jpg'
        },
        {
            name: 'Fire',
            singer: 'Gavin DeGraw',
            path: './assets/mp3/Gavin-DeGraw_Fire.mp3',
            image: './assets/img/Gavin-DeGraw_Fire.jpg'
        },
        {
            name: 'Sold Out',
            singer: 'Hawk Nelson',
            path: './assets/mp3/Hawk-Nelson_Sold-Out.mp3',
            image: './assets/img/Sold-out_Hawk-Nelson.jpg'
        },
        {
            name: 'Runnin\'',
            singer: 'Adam Lambert',
            path: './assets/mp3/Runnin_Adam-Lambert.mp3',
            image: './assets/img/Runnin_Adam-Lambert.jpg'
        },
        {
            name: 'Leading The Pack',
            singer: 'Sam Tinnesz',
            path: './assets/mp3/Sam-Tinnesz_Leading-The-Pack.mp3',
            image: './assets/img/leadingthepack_Sam-Tinnesz.gif'
        }
    ],

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {

        // Xử lý tua bài hát
        progress.addEventListener('change', (e) => {
            const seekTime =  e.target.value * (audio.duration / 100);
            audio.currentTime = seekTime;
        })

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Xử lý khi cd quay
        const songImageAnimate = songImage.animate([
            { transform: 'rotate(360deg)' } 
        ], {
            duration: 10000, // 10s
            iterations: Infinity
        })
        songImageAnimate.pause();

        // Khi song play
        audio.onplay = function() {
            app.isPlaying = true;
            songImageAnimate.play();
            playBtn.classList.add('playing');
            songStatus.style.color = '#5656ff';
        }

        // khi song pause
        audio.onpause = function() {
            app.isPlaying = false;
            songImageAnimate.pause();
            playBtn.classList.remove('playing');
            songStatus.style.color = 'var(--text-color)';
        }

        // Khi tiến độ bài hát thay đổi
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100;
                progress.value = progressPercent;
            }
            
            // Update UI current time
            currentTimeProgress.textContent = app.calculateTime(audio.currentTime);
        })

        // Xử lý next song
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
        }

        // Xử lý prev song
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
        }

        // Xử lý auto play
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play();
            } else if (app.isRandom) {
                app.playRandomSong();
            }
             else {
                app.nextSong();
            }
            audio.play();
        }

        // Xử lý repeat songs
        repeatBtn.addEventListener('mousedown', function(e) {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('btn-active', app.isRepeat);
        })
        //Xử lý random songs
        randomBtn.addEventListener('mousedown', function(e) {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('btn-active', app.isRandom);
        })
    },

    displayDuration: function() {
        audio.onloadedmetadata = function() {
            $('.play__progress-time-end').textContent = app.calculateTime(audio.duration);
        }
    },

    calculateTime: function(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    }, 

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    loadCurrentSong: function() {
        audio.src = this.currentSong.path;
        songImage.style.backgroundImage = `url(${this.currentSong.image})`;
        songName.textContent = this.currentSong.name;
        songSinger.textContent = this.currentSong.singer;
    },

    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Hiển thị song duration
        this.displayDuration();

        // Xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Load thông tin bài hát đầu tiên vào UI 
        this.loadCurrentSong();

    }
}

app.start();
