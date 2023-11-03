// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
	static #list = [];

	constructor(name, author, image) {
		this.id = Math.floor(1000 + Math.random() * 9000);
		this.name = name;
		this.author = author;
		this.image = image;
	}

	// Статичний метод для створення об'єкту Track і додавання його до списку #list
	static create(name, author, image) {
		const newTrack = new Track(name, author, image);
		this.#list.push(newTrack);
		return newTrack;
	}

	static getList() {
		return this.#list.reverse();
	}

	static getById(trackId) {
		return this.#list.find(track => trackId === track.id)
	}
};

Track.create(
	'Baila Conmigo (Remix)',
	'Selena Gomez i Rauw Alejandro',
	'https://picsum.photos/100/100',
)

Track.create(
  'Shape of You',
  'Ed Sheeran',
  'https://picsum.photos/100/100',
);

Track.create(
  'Blinding Lights',
  'The Weeknd',
  'https://picsum.photos/100/100',
);

Track.create(
  'Someone Like You',
  'Adele',
  'https://picsum.photos/100/100',
);

Track.create(
  'Bohemian Rhapsody',
  'Queen',
  'https://picsum.photos/100/100',
);

Track.create(
  'Uptown Funk',
  'Mark Ronson feat. Bruno Mars',
  'https://picsum.photos/100/100',
);

Track.create(
  'Bad Guy',
  'Billie Eilish',
  'https://picsum.photos/100/100'
);

Track.create(
  'Don\'t Start Now',
  'Dua Lipa',
  'https://picsum.photos/100/100'
);

Track.create(
  'Rolling in the Deep',
  'Adele',
  'https://picsum.photos/100/100'
);

Track.create(
  'Sicko Mode',
  'Travis Scott',
  'https://picsum.photos/100/100'
);

class Playlist {
	static #list = [];

	constructor(name) {
		this.id = Math.floor(Math.random() * 9000 + 1000);
		this.name = name;
		this.tracks = [];
		this.image = 'https://picsum.photos/100/100';
	}

	static create(name) {
		const newPlaylist = new Playlist(name);
		this.#list.push(newPlaylist);
		return newPlaylist;
	}

	static getList() {
		return this.#list.reverse();
	}

	static makeMix(playlist) {
		const allTracks = Track.getList();

		let randomTracks = allTracks.sort(() => 0.5 - Math.random()).slice(0, 3)
		playlist.tracks.push(...randomTracks)
	}

	static getById(id) {
		return Playlist.#list.find((playlist) => playlist.id === id) || null;
	}

	deleteTrackById(trackId) {
		this.tracks = this.tracks.filter((track) => track.id !== trackId);
	}

	static findListByValue(name) {
		return this.#list.filter((playlist) => playlist.name.toLowerCase().includes(name.toLowerCase()))
	}
};

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test1'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))
Playlist.makeMix(Playlist.create('Test4'))
Playlist.makeMix(Playlist.create('Test5 sdggdgdfg dfgsdfg dfgd fgdfgdfgdfgsdfgdf'))

// ================================================================

router.get('/', function (req, res) {
	const id = Number(req.query.id)
	
	const playlist = Playlist.getList();
	const amountTracks = playlist.reduce((acc, playlist) => playlist.tracks.length)

  res.render('spotify-list-playlist', {
    style: 'spotify-list-playlist',

		data: {
			playlist: playlist,
			amount: amountTracks,
		},
  })
})

// ================================================================

router.get('/spotify-choose', function (req, res) {

  res.render('spotify-choose', {
    style: 'spotify-choose',

		data: {},
  })
})

// ================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix;

  res.render('spotify-create', {
    style: 'spotify-create',

		data: {
			isMix,
		},
  })
  // ↑↑ сюди вводимо JSON дані
});

router.post('/spotify-create', function (req, res) {
	const isMix = !!req.query.isMix;
	const name = req.body.name;

	if (!name) {
		return res.render('alert', {
			style: 'alert',
	
			data: {
				message: 'Помилка',
				info: 'Введіть назву плейліста',
				link: isMix
					? `/spotify-create?isMix=true`
					: `/spotify-create`
			},
		})
	}

	const playlist = Playlist.create(name);

	if (isMix) {
		Playlist.makeMix(playlist)
	};

	res.render('spotify-playlist', {
    style: 'spotify-playlist',

		data: {
			playlistId: playlist.id,
			tracks: playlist.tracks,
			name: playlist.name,
		},
  })
});

// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id);

	const playlist = Playlist.getById(id);

	if (!playlist) {
		return res.render('alert', {
			style: 'alert',

			data: {
				message: 'Помилка',
				info: 'Такого плейліста не знайдено',
				link: '/',
			}
		})
	}

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

		data: {
			playlistId: playlist.id,
			tracks: playlist.tracks,
			name: playlist.name,
		},
  })
});

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId);
	const trackId = Number(req.query.trackId);
	const playlist = Playlist.getById(playlistId)

	if (!playlist) {
		return res.render('alert', {
			style: 'alert',

			data: {
				message: 'Помилка',
				info: 'Такого плейліста не знайдено',
				link: `/spotify-playlist?id=${playlistId}`,
			}
		})
	}

	playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

		data: {
			playlistId: playlist.id,
			tracks: playlist.tracks,
			name: playlist.name,
		},
  })
});

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = '';
	const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

		data: {
			list: list.map(({tracks, ...rest}) => ({...rest, amount: tracks.length,})), value,
		},
  })
});

// ================================================================

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || '';
	const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

		data: {
			list: list.map(({tracks, ...rest}) => ({...rest, amount: tracks.length,})), value,
		},
  })
});

// ================================================================

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',

		data: {
			playlistId: playlistId,
			tracks: Track.getList(),
		},
  })
});

// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId);
	const trackId = Number(req.query.trackId);
	const playlist = Playlist.getById(playlistId);

	if (!playlist) {
		return res.render('alert', {
			style: 'alert',

			data: {
				message: 'Помилка',
				info: 'Такого плейліста не знайдено',
				link: `/spotify-playlist?id=${playlistId}`,
			}
		})
	}

	const track = Track.getById(trackId);

	playlist.tracks.push(track);


	res.render('spotify-playlist', {
    style: 'spotify-playlist',

		data: {
			playlistId: playlist.id,
			tracks: playlist.tracks,
			name: playlist.name,
		},
  })
});
// Підключаємо роутер до бек-енду
module.exports = router
