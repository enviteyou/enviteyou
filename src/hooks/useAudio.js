import React, { useState, useRef } from 'react';

export function useAudio(src, loop = true) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log("Audio play blocked", e));
        }
    };

    const playAudio = () => {
        if (!audioRef.current) return;
        audioRef.current.volume = 0.5;
        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.log("Audio play blocked", e));
    };

    const pauseAudio = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const audioNode = <audio ref={audioRef} loop={loop} src={src} preload="auto" />;

    return {
        isPlaying,
        toggleAudio,
        playAudio,
        pauseAudio,
        audioNode,
        audioRef
    };
}