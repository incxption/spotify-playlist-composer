import React, { useState } from "react"
import PlaylistPicker from "./playlist/PlaylistPicker"
import SongPicker from "./song/SongPicker"
import FinishScreen from "./finish/FinishScreen"
import { Song } from "../../types/spotify"

const Composer: React.FC = () => {
    const [includedPlaylists, setIncludedPlaylists] = useState<string[] | null>(null)
    const [includedSongs, setIncludedSongs] = useState<Song[] | null>(null)

    if (includedSongs) return (
        <FinishScreen songs={includedSongs}/>
    )

    if (includedPlaylists) return (
        <SongPicker includedPlaylists={includedPlaylists} setIncludedSongs={setIncludedSongs}/>
    )

    return <PlaylistPicker setIncludedPlaylists={setIncludedPlaylists}/>
}

export default Composer