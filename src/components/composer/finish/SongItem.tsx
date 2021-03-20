import React from "react"

interface Props {
    song: any
}

const SongItem: React.FC<Props> = ({ song }) => {
    const totalSeconds = song.track.duration_ms / 1000
    const durationSeconds = Math.round(totalSeconds % 60)
    const duration = Math.floor(totalSeconds / 60) + ":" + (durationSeconds < 10 ? "0" + durationSeconds : durationSeconds)

    return (
        <div key={song.track.id} className="w-full bg-white rounded-lg shadow-sm my-2 flex flex-wrap h-12">
            <img src={song.track.album.images[0].url} alt="album cover" className="h-full rounded-l-lg"/>
            <div className="h-full flex flex-col flex-grow justify-center ml-2">
                <h1 className="text-md font-medium tracking-tight">{song.track.name}</h1>
                <p className="text-sm leading-4 font-light tracking-tight">
                    {song.track.artists.slice(0, 4).map((artist: any) => artist.name).join(", ")}
                </p>
            </div>
            <p className="h-full flex flex-col justify-center text-right pr-3 tracking-tight">
                {duration}
            </p>
        </div>
    )
}

export default SongItem