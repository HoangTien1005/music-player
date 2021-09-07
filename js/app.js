const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);
const PLAYER_STORAGE_KEY = 'F8-PLAYER';
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const btnPlay = $('.btn-toggle-play');
const cd = $('.cd');
const progress = $('#progress');
const btnPrev = $('.btn-prev');
const btnRepeat = $('.btn-repeat');
const btnNext = $('.btn-next');
const btnRandom = $('.btn-random');
const playlist = $('.playlist');
var playedSongs = [];       // mảng dùng để kiểm tra những bài hát đã chơi


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: '21',
          singer: 'Dean',
          path: 'https://aredir.nixcdn.com/Unv_Audio52/21-Dean-4401138.mp3?st=AlGoyQI_nA0Gu35_RFZGDQ&e=1631113361',
          image: 'https://avatar-ex-swe.nixcdn.com/singer/avatar/2016/08/29/d/1/b/b/1472443034582_600.jpg',
        },
        {
          name: 'Stay',
          singer: 'The Kid LAROI, Justin Bieber',
          path: 'https://aredir.nixcdn.com/NhacCuaTui1018/Stay-TheKidLAROIJustinBieber-7045258.mp3?st=WmLaf88DPIfKk1flz8tMhg&e=1631113565',
          image: 'https://avatar-ex-swe.nixcdn.com/singer/avatar/2021/08/09/e/5/0/b/1628489906903_600.jpg',
        },
        {
          name: 'Everyday',
          singer: 'WINNER',
          path: 'https://aredir.nixcdn.com/YG_Audio1/Everyday-WINNER-6292897.mp3?st=Uo7E6sf8f3vyIVFbKJ7pMA&e=1631114407',
          image: 'https://avatar-ex-swe.nixcdn.com/song/2018/04/04/3/c/4/e/1522832778580.jpg',
        },
        {
          name: 'Right Through Me',
          singer: 'DAY6',
          path: 'https://aredir.nixcdn.com/NhacCuaTui1017/RightThroughMe-DAY6-7043249.mp3?st=9nXVyHK9V02P45G4L4iCvA&e=1631114295',
          image: 'https://avatar-ex-swe.nixcdn.com/song/2021/07/05/0/4/f/4/1625471221341.jpg',
        },
        {
          name: 'Fool',
          singer: 'WINNER',
          path: 'https://aredir.nixcdn.com/YG_Audio1/Fool-WINNER-6291947.mp3?st=dl8P2BGirwpM9kh48y-xoQ&e=163111451',
          image: 'https://avatar-ex-swe.nixcdn.com/song/2017/11/15/9/a/b/f/1510744017680.jpg',
        },
       
        {
          name: 'What 2 Do',
          singer: 'Dean, Crush, Jeff Bernat',
          path: 'https://aredir.nixcdn.com/Unv_Audio50/What2Do-DeanCrushJeffBernat-4323527.mp3?st=o_27-AF0phyuUZYLaqZDjw&e=1631113748',
          image: 'https://avatar-ex-swe.nixcdn.com/singer/avatar/2016/08/29/d/1/b/b/1472443034582_600.jpg',
        },
        {
          name: 'Baby Baby',
          singer: 'WINNER',
          path: 'https://aredir.nixcdn.com/YG_Audio1/BabyBaby-WINNER-6292241.mp3?st=Q-2UApxmu4K0aUwVZbIE2Q&e=1631114743',
          image: 'https://avatar-ex-swe.nixcdn.com/song/2020/06/09/2/d/0/7/1591694646150.jpg',
        },
        {
          name: 'Jasmine',
          singer: 'DPR Live',
          path: 'https://aredir.nixcdn.com/NhacCuaTui964/Jasmine-DPRLive-5488767.mp3?st=aZqNznbEk-JRo1z_0-rTPw&e=1631115170',
          image: 'https://avatar-ex-swe.nixcdn.com/singer/avatar/2021/03/16/4/4/c/d/1615870762599.jpg',
        },
        {
          name: 'Maps',
          singer: 'Maroon 5',
          path: 'https://aredir.nixcdn.com/Unv_Audio20/Maps-Maroon5-3298999.mp3?st=4c24hBCZVhW1XUmsGpYzIA&e=1631113857',
          image: 'https://avatar-ex-swe.nixcdn.com/singer/avatar/2018/02/08/d/9/d/9/1518102796944_600.jpg',
        },
        {
          name: 'Always',
          singer: 'Keshi',
          path: 'https://aredir.nixcdn.com/Unv_Audio171/Always-keshi-6387014.mp3?st=07STMY3em45N8WPvpKBKhg&e=1631114967',
          image: 'https://avatar-ex-swe.nixcdn.com/song/2020/07/27/1/9/1/d/1595823661729.jpg',
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    render: function () {
        const htmls = this.songs.map((item, index) => {
          return `        
            <div data-index="${index}" class="song ${
            index === this.currentIndex ? 'active' : ''
          }">
                <div
                    class="thumb"
                    style="
                    background-image: url('${item.image}');
                "
                ></div>
                <div class="body">
                    <h3 class="title">${item.name}</h3>
                    <p class="author">${item.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        // handle zoom in/out CD when scroll
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }


         // handle spin/stop CD thumb

         const cdThumbAnimate = cdThumb.animate([
             {transform: 'rotate(360deg'}
         ], {
             duration: 10000,
             iterations: Infinity
         });
         cdThumbAnimate.pause();
        
        // handle play button
        btnPlay.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            } 
        }

        audio.onplay = function() {
            _this.isPlaying = true; 
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // // my way of handle play button
        // // chưa tối ưu
        // btnPlay.onclick = function() {
        //     _this.isPlaying = !_this.isPlaying;
        //     player.classList.toggle('playing', _this.isPlaying);
        //     if(_this.isPlaying){ 
        //         audio.play() ;  
        //         cdThumbAnimate.play();
        //     } else {
        //         audio.pause();
        //         cdThumbAnimate.pause();
        //     }
        // }

        // when song progess is changed
        audio.ontimeupdate = function() {
            if(audio.duration) {
                // const progessPercent = Math.floor(audio.currentTime / audio.duration * 100);
                const progessPercent = audio.currentTime / audio.duration * 100;
                progress.value = progessPercent;
            }
        }   

        // handle fast forward songs
        progress.oninput = function(e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }

        // handle choose next song
        btnNext.onclick = function() {
            _this.isRandom ? _this.playRandomSong() : _this.nextSong();
            audio.play();
            cdThumbAnimate.play();
            _this.scrollToActiveSong();
        } 

        // handle choose previous song
        btnPrev.onclick = function() {
            _this.isRandom ? _this.playRandomSong() : _this.prevSong();
            audio.play();
            cdThumbAnimate.play();
            _this.scrollToActiveSong();
        } 

        // handle on/off random button
        btnRandom.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            btnRandom.classList.toggle('active', _this.isRandom);
        }

        // handle on/off repeat button
        btnRepeat.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat);
        }
       
        // handle switch song when audio ended
        audio.onended = function() {
            _this.isRepeat ? audio.play() : btnNext.click();
        }

        // handle click behavior on songs
        playlist.onclick = function (e) {
            let songNode = e.target.closest('.song:not(.active)');
              if (songNode && !e.target.closest('.option')) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                audio.play();
              }
          }
        

        
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
        this.changeActiveSong();
    },
    changeActiveSong: function() {
        // change active song
        $('.song.active')?.classList.remove('active');
        const songs= $$('.song');
        songs.forEach((song) => {
        if (song.getAttribute('data-index') == this.currentIndex) {
            song.classList.add('active');
        }
        });
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) this.currentIndex = 0;
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        playedSongs.push(this.currentIndex);
        if(playedSongs.length === this.songs.length) {
            playedSongs = [this.currentIndex];
        }
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(playedSongs.includes(newIndex))

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {

        this.loadConfig();

        this.defineProperties();

        this.handleEvents();

        this.loadCurrentSong();


        this.render();
        btnRandom.classList.toggle('active', this.isRandom);
        btnRepeat.classList.toggle('active', this.isRepeat);
    }
}

app.start();



