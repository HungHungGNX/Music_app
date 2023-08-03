import { songs } from "./data.js";

export const song_items = songs.map((song, index) => {
    return `<li class="song-item">
    <span>${index}</span>
    <img src="${song.poster}" alt="Alan" />
    <h5>
        <p class="name-song">${song.songName}</p> 
        <div class="sub-title">${song.author}</div>
    </h5>
    <div class="icon-play">
        <i class="bi bi-play-circle-fill"></i>
    </div>`;
});

export const song_items_popular = songs.map((song, index) => {
    return `
    <li class="songItem" data-link=${song.link_song} data-idSong=${song.id} >
    <div class="img_play">
        <img src=${song.poster} alt="alan"  />
        <i
            class="bi playListPlay bi-play-circle-fill"
            id=${song.id}
        ></i>
    </div>
    <div class="information-song">
        <p class="name-song">${song.songName}</p>
        <div class="subtitle">${song.author}</div>
    </div>
    </li>`;
});
