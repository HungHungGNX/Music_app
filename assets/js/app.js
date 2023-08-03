import { song_items, song_items_popular } from "./template.js";
import { songs } from "./data.js";
// get element from DOM
const menu_song = document.querySelector(".menu-song");
const pop_song = document.querySelector(".pop_song");
const master_play = document.querySelector("#masterPlay");
const music = document.querySelector("audio");
const wave = document.querySelector(".wave");
const getcurrentStart = document.querySelector("#currentStart");
const getcurrentEnd = document.querySelector("#currentEnd");

// get element in master play
const master_play_container = document.querySelector(".master-play");
const name_song_master = master_play_container.querySelector(".name-song");
const poster_song_master = master_play_container.querySelector(".thumb-song");
const author_song_master = master_play_container.querySelector(".author");
const seek = document.getElementById("seek");
let bar_master = document.querySelector(".bar-master");
let dot_master = document.querySelector(".dot-master");
// render
const render_list = (items, container, position) => {
    items.forEach((item) => {
        container.insertAdjacentHTML(position, item);
    });
};

render_list(song_items, menu_song, "beforeend");
render_list(song_items_popular, pop_song, "beforeend");
music.volume = 0.3;

let typeList = {
    "menu-song": 0,
    pop_song: 0,
};

const changTypeList = (key_search) => {
    for (let key in typeList) {
        if (key == key_search) {
            typeList[key] = 1;
        } else {
            typeList[key] = 0;
        }
    }
};
let id_current_song = 1;
// event
function reset_song(status_song, id_song, time_music) {
    music.currentTime = time_music;
    getcurrentEnd.textContent = "";
    status_song ? closeMusic(master_play, wave) : openMusic(master_play, wave);
    const song = songs.find((item) => {
        return item.id == id_song;
    });
    name_song_master.textContent = song.songName;
    poster_song_master.setAttribute("src", song.poster);
    author_song_master.textContent = song.author;
}

function reset_icon_play_for_list(songs, class_add, class_remove) {
    songs.forEach((song) => {
        song.classList.add(class_add);
        song.classList.remove(class_remove);
    });
}

function openMusic(element1, element2) {
    music.play();
    element1.classList.remove("bi-play-fill");
    element1.classList.add("bi-pause-fill");
    element2.classList.add("active2");
}
function closeMusic(element1, element2) {
    music.pause();
    element1.classList.add("bi-play-fill");
    element1.classList.remove("bi-pause-fill");
    element2.classList.remove("active2");
}

master_play.addEventListener("click", (event) => {
    if (music.paused || music.currentTime <= 0) {
        music.play();
        openMusic(master_play, wave);
    } else {
        closeMusic(master_play, wave);
    }
});
let currentSongItem = "";
pop_song.addEventListener("click", (event) => {
    if (!event.target.matches(".pop_song")) {
        changTypeList("pop_song");
        const status_song = music.paused;
        const songItem = event.target.closest(".songItem");
        const link_song = songItem.dataset.link;
        const save_current_time = music.currentTime;
        music.setAttribute("src", link_song);
        reset_icon_play_for_list(
            [...document.querySelectorAll(".pop_song .playListPlay")],
            "bi-play-circle-fill",
            "bi-pause-circle-fill"
        );
        [...document.querySelectorAll(".pop_song .songItem")].forEach(
            (item) => {
                item.classList.remove("active");
            }
        );

        songItem.classList.add("active");
        if (currentSongItem === songItem) {
            reset_song(
                !status_song,
                songItem.dataset.idsong,
                save_current_time
            );
        } else {
            reset_song(status_song, songItem.dataset.idsong, 0);
        }
        currentSongItem = songItem;
        id_current_song = parseInt(songItem.dataset.idsong);

        if (!music.paused) {
            songItem
                .querySelector(".playListPlay")
                .classList.remove("bi-play-circle-fill");
            songItem
                .querySelector(".playListPlay")
                .classList.add("bi-pause-circle-fill");
        }
    }
});
let flag = 0;
music.addEventListener("timeupdate", () => {
    let time_current = music.currentTime;
    let time_duration = Number.isNaN(music.duration) ? 0 : music.duration;

    let minute = Math.floor(time_duration / 60);
    let second = Math.floor(time_duration % 60);

    second = second < 10 ? `0${second}` : second;
    getcurrentEnd.textContent = `${minute}:${second}`;

    let minute1 = Math.floor(time_current / 60);
    let second1 = Math.floor(time_current % 60);

    second1 = second1 < 10 ? `0${second1}` : second1;
    getcurrentStart.textContent = `${minute1}:${second1}`;

    if (time_current != 0 && time_duration != 0) {
        if (flag == 0) {
            seek.value = parseInt((time_current / time_duration) * 100);
            const time_now = (time_current / time_duration) * 100;
            bar_master.style.width = `${time_now}%`;
            dot_master.style.left = `${time_now}%`;
        }
    } else {
        bar_master.style.width = `0`;
        dot_master.style.left = `0`;
    }
});

seek.addEventListener("change", (event) => {
    const timeCurrent = seek.value * (music.duration / 100);
    music.currentTime = timeCurrent;
    flag = 0;
});

seek.addEventListener("input", (event) => {
    bar_master.style.width = `${seek.value}%`;
    dot_master.style.left = `${seek.value}%`;
    flag = 1;
});

music.addEventListener("ended", (event) => {
    music.currentTime = 0;
    master_play.classList.add("bi-play-fill");
    master_play.classList.remove("bi-pause-fill");
    wave.classList.remove("active2");
    openMusic(master_play, wave);
});

const vol_icon = document.querySelector("#vol_icon");
const vol = document.querySelector("#vol");
const vol_bar = document.querySelector(".vol_bar");
const vol_dot = document.querySelector("#vol_dot");
vol_bar.style.width = `30%`;
vol_dot.style.left = `30%`;
vol.addEventListener("input", (event) => {
    music.volume = event.currentTarget.value / 100;
    vol_bar.style.width = `${event.currentTarget.value}%`;
    vol_dot.style.left = `${event.currentTarget.value}%`;

    if (event.currentTarget.value == 0) {
        vol_icon.classList.remove("bi-volume-down-fill");
        vol_icon.classList.add("bi-volume-mute-fill");
    } else {
        vol_icon.classList.add("bi-volume-down-fill");
        vol_icon.classList.remove("bi-volume-mute-fill");
    }
});

const btn_next = document.querySelector("#next");
const btn_back = document.querySelector("#back");

btn_next.addEventListener("click", (event) => {
    let name_class_list = "";
    for (let key in typeList) {
        if (typeList[key] === 1) {
            name_class_list = key;
            break;
        }
    }

    if (name_class_list) {
        const songItems = [
            ...document.querySelectorAll(`.${name_class_list} .songItem`),
        ];

        let index_song_item = songItems.findIndex((item) => {
            return item.getAttribute("data-idSong") == id_current_song;
        });

        index_song_item =
            index_song_item == songItems.length - 1 ? -1 : index_song_item;

        const status_song = music.paused;
        const songItem = songItems[index_song_item + 1];
        const link_song = songItem.dataset.link;
        music.setAttribute("src", link_song);
        reset_icon_play_for_list(
            [...document.querySelectorAll(".pop_song .playListPlay")],
            "bi-play-circle-fill",
            "bi-pause-circle-fill"
        );
        [...document.querySelectorAll(".pop_song .songItem")].forEach(
            (item) => {
                item.classList.remove("active");
            }
        );

        songItem.classList.add("active");
        reset_song(status_song, songItem.dataset.idsong, 0);
        currentSongItem = songItem;
        id_current_song = parseInt(songItem.dataset.idsong);

        if (!music.paused) {
            songItem
                .querySelector(".playListPlay")
                .classList.remove("bi-play-circle-fill");
            songItem
                .querySelector(".playListPlay")
                .classList.add("bi-pause-circle-fill");
        }
    } else {
        // some thing
    }
});

btn_back.addEventListener("click", (event) => {
    let name_class_list = "";
    for (let key in typeList) {
        if (typeList[key] === 1) {
            name_class_list = key;
            break;
        }
    }

    if (name_class_list) {
        const songItems = [
            ...document.querySelectorAll(`.${name_class_list} .songItem`),
        ];

        let index_song_item = songItems.findIndex((item) => {
            return item.getAttribute("data-idSong") == id_current_song;
        });

        index_song_item =
            index_song_item == 0 ? songItems.length : index_song_item;

        const status_song = music.paused;
        const songItem = songItems[index_song_item - 1];
        const link_song = songItem.dataset.link;
        music.setAttribute("src", link_song);
        reset_icon_play_for_list(
            [...document.querySelectorAll(".pop_song .playListPlay")],
            "bi-play-circle-fill",
            "bi-pause-circle-fill"
        );
        [...document.querySelectorAll(".pop_song .songItem")].forEach(
            (item) => {
                item.classList.remove("active");
            }
        );

        songItem.classList.add("active");
        reset_song(status_song, songItem.dataset.idsong, 0);
        currentSongItem = songItem;
        id_current_song = parseInt(songItem.dataset.idsong);

        if (!music.paused) {
            songItem
                .querySelector(".playListPlay")
                .classList.remove("bi-play-circle-fill");
            songItem
                .querySelector(".playListPlay")
                .classList.add("bi-pause-circle-fill");
        }
    } else {
        // some thing
    }
});

document.addEventListener("keypress", (event) => {
    if (event.key === " ") {
        if (music.paused) {
            openMusic(master_play, wave);
        } else {
            closeMusic(master_play, wave);
        }
    }
});
