const StatusPlayer = Object.freeze({
	NOT_PLAYING: Symbol("NOT_PLAYING"),
	IS_PLAYING: Symbol("IS_PLAYING"),
	WANT_TO_PLAY: Symbol("WANT_TO_PLAY"),
});
module.exports=StatusPlayer;