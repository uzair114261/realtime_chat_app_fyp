/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client";


import React from "react";

import { FaPause, FaPlay } from "react-icons/fa6";
import { useRecoilState } from "recoil";
import WaveSurfer from "wavesurfer.js";


const VoiceMessage = ({url})  => {
	
	const waveFormRef = React.useRef("");
	const [waveForm, setWaveForm] = React.useState();
	const [audio, setAudio] = React.useState(null);
	const [isPlaying, setIsPlaying] = React.useState(false);
	const [currentPlaybackTime, setCurrentPlaybackTime] = React.useState(0);
	const [totalDuration, setTotalDuration] = React.useState(0);
	const formatTime = (time) => {
		if (isNaN(time) || time === Infinity) return "00:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};
	const handlePauseRecording = () => {
		if (audio) {
			waveForm?.pause();
			setIsPlaying(false);
			audio.pause();
		}
	};
	const handlePlayRecording = () => {
		if (audio) {
			setIsPlaying(true);
			void waveForm?.play();
			void audio.play();
		}
	};
	React.useEffect(() => {
		if (audio) {
			const updatePlaybackTime = () => {
				setCurrentPlaybackTime(audio.currentTime);
			};
			audio.addEventListener("timeupdate", updatePlaybackTime);
			return () => {
				audio.removeEventListener("timeupdate", updatePlaybackTime);
			};
		}
		return () => null;
	}, [audio]);
	React.useEffect(() => {
		const waveForm = WaveSurfer.create({
			container: waveFormRef.current,
			
			interact: false,
			waveColor: "#54656f",
			progressColor: "#25d366",
			cursorColor: "#25d366",
			
			barWidth: 2,
			height: 10,
		});
		waveForm.on("ready", () => {
			setTotalDuration(waveForm.getDuration());
		});
		setWaveForm(waveForm);
		waveForm.on("finish", () => {
			setIsPlaying(false);
			setCurrentPlaybackTime(0);
			waveForm.seekTo(0);
			waveForm.stop();
		});
		return () => {
			waveForm.destroy();
		};
	}, []);
	React.useEffect(() => {
		
		if(url) {
			const audio = new Audio(String(url));
		setAudio(audio);
		void waveForm?.load(String(url));
		}
	}, [url, waveForm]);
	return (
		<div
			className="flex gap-4 h-[50px] items-center"
			>
			{isPlaying ? (
				<FaPause className="h-5 w-5 cursor-pointer" onClick={handlePauseRecording} />
			) : (
				<FaPlay className="h-5 w-5 cursor-pointer" onClick={handlePlayRecording} />
			)}
			<div className="relative pt-[25px]">
				{/* eslint-disable-next-line  @typescript-eslint/ban-ts-comment */}
				{/* @ts-expect-error */}
				<div className={`mb-1 w-48 lg:w-60 `} ref={waveFormRef} />
				{audio && isPlaying && (
					<span className="text-[11px] text-[#54656f] dark:text-[#aebac1]">
						{formatTime(currentPlaybackTime)} 
					</span>
				)}
				{audio && !isPlaying && (
					<span className="text-[11px] text-[#54656f] dark:text-[#aebac1]">

						{formatTime(totalDuration)}
					</span>
				)}
				
			</div>
		</div>
	);
}
export default VoiceMessage;