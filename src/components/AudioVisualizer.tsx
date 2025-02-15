"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTrack } = usePlayerStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const audio = document.querySelector("audio");
    if (!audio) return;

    // 初始化音频上下文
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    
    // 创建分析器节点
    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
    }

    // 连接音频源
    if (!sourceRef.current) {
      sourceRef.current = audioContext.createMediaElementSource(audio);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContext.destination);
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置画布尺寸
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // 绘制可视化效果
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const barWidth = width / bufferLength * 2.5;
      let barHeight;
      let x = 0;

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;

        const hue = (i / bufferLength) * 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;

        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentTrack]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[72px] left-0 right-0 h-20 bg-black/50">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
} 