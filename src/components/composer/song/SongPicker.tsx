import React, { useCallback, useEffect, useState } from "react"
import { useMotionValue } from "framer-motion"
import SongDragOverlay from "@components/composer/song/SongDragOverlay"
import SongDetails from "@components/composer/song/SongDetails"
import SongBackground from "@components/composer/song/SongBackground"
import useAsync from "@utils/useAsync"
import { Song } from "@typedefs/spotify"
import { getAllSongs } from "@spotify/playlists"
import SongAudioPreview from "@components/composer/song/SongAudioPreview"
import SongAudioControls from "@components/composer/song/SongAudioControls"

interface Props {
    includedPlaylists: string[]
    setIncludedSongs: (songs: Song[]) => void
}

const SongPicker: React.FC<Props> = ({ includedPlaylists, setIncludedSongs }) => {
    const callback = useCallback(() => getAllSongs(includedPlaylists), [includedPlaylists])
    const { result: songs, state } = useAsync(callback)

    const [index, setIndex] = useState(0)
    const [taken, setTaken] = useState<Song[]>([])

    const x = useMotionValue(0)

    const [targetVolume, setTargetVolume] = useState(readFromLocalStorage() ?? 0.15)
    const setVolume = (value: number) => {
        writeToLocalStorage(value)
        setTargetVolume(value)
    }

    useEffect(() => {
        if (state === "done" && index === songs!.length) {
            setIncludedSongs(taken)
        }
    }, [state, index, songs, setIncludedSongs, taken])

    function next() {
        setIndex(index + 1)
    }

    function take() {
        setTaken([...taken, currentSong])
        next()
    }

    function handleDragEnd() {
        if (x.get() > 30) take()
        else if (x.get() < -30) next()
    }

    if (state !== "done" || !songs) {
        return <div>Loading...</div>
    }

    const currentSong = songs[index]
    if (!currentSong) return <></>

    return (
        <div className="w-full flex-grow flex overflow-hidden relative">
            <SongAudioPreview currentSong={currentSong} key={currentSong.track.id} targetVolume={targetVolume}/>
            <SongAudioControls volume={targetVolume} setVolume={setVolume}/>

            <SongDragOverlay x={x} onDragEnd={handleDragEnd} />
            <SongDetails x={x} currentSong={currentSong} left={songs.length - index} />

            <SongBackground currentSong={currentSong} />
        </div>
    )
}

function writeToLocalStorage(volume: number) {
    localStorage.setItem("volume", String(volume))
}

function readFromLocalStorage(): number | null {
    const item = localStorage.getItem("volume")
    if (item) {
        const number = parseInt(item)
        return isNaN(number) ? null : number
    } else return null
}

export default SongPicker
