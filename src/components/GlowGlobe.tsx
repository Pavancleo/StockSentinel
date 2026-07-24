/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

interface CityNode {
  name: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  z: number;
}

interface ConnectionArc {
  from: CityNode;
  to: CityNode;
  progress: number;
  speed: number;
}

const CITIES: CityNode[] = [
  { name: 'Mumbai (NSE / BSE)', lat: 19.0760, lon: 72.8777, x: 0, y: 0, z: 0 },
  { name: 'Bengaluru (Tech Capital)', lat: 12.9716, lon: 77.5946, x: 0, y: 0, z: 0 },
  { name: 'Chennai (Fintech & Auto Hub)', lat: 13.0827, lon: 80.2707, x: 0, y: 0, z: 0 },
  { name: 'Delhi NCR (Financial Exchange)', lat: 28.6139, lon: 77.2090, x: 0, y: 0, z: 0 },
  { name: 'Hyderabad (Cyberabad Cluster)', lat: 17.3850, lon: 78.4867, x: 0, y: 0, z: 0 },
  { name: 'Kolkata (Eastern Financial Hub)', lat: 22.5726, lon: 88.3639, x: 0, y: 0, z: 0 },
  { name: 'Ahmedabad (GIFT City IFSC)', lat: 23.0225, lon: 72.5714, x: 0, y: 0, z: 0 },
  { name: 'Pune (IT & Innovation Hub)', lat: 18.5204, lon: 73.8567, x: 0, y: 0, z: 0 },
];

export default function GlowGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0.4, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalized coordinates from -1 to 1
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let localRotationY = 0;
    const radius = 130;

    // Generate globe grid points (dot matrix representation of sphere)
    const points: { x: number; y: number; z: number }[] = [];
    const step = 15;
    for (let lat = -90; lat <= 90; lat += step) {
      const phi = (lat * Math.PI) / 180;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const numLon = Math.max(4, Math.floor(360 * cosPhi / step));

      for (let i = 0; i < numLon; i++) {
        const lon = (i * 360) / numLon - 180;
        const theta = (lon * Math.PI) / 180;
        const x = radius * cosPhi * Math.cos(theta);
        const y = radius * sinPhi;
        const z = radius * cosPhi * Math.sin(theta);
        points.push({ x, y, z });
      }
    }

    // Connections between cities
    const connections: ConnectionArc[] = [];
    for (let i = 0; i < CITIES.length; i++) {
      const from = CITIES[i];
      const to = CITIES[(i + 1) % CITIES.length];
      connections.push({
        from,
        to,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.005,
      });
    }

    // Handle resizing
    const resizeCanvas = () => {
      const width = containerRef.current?.clientWidth || 400;
      const height = containerRef.current?.clientHeight || 400;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Render loop
    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Slow orbital rotation
      localRotationY += 0.002;

      // Projection angles
      const angleX = rotation.x + mouseRef.current.y * 0.15;
      const angleY = rotation.y + localRotationY + mouseRef.current.x * 0.3;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Center offset
      const cx = width / 2;
      const cy = height / 2;

      // Helper for 3D rotation
      const rotate3D = (x: number, y: number, z: number) => {
        // Rotate Y
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        // Rotate X
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        return { x: x1, y: y2, z: z2 };
      };

      // Draw background cyber grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Project points
      const projectedPoints = points.map((p) => {
        const rotated = rotate3D(p.x, p.y, p.z);
        // Apply perspective
        const scale = 260 / (260 - rotated.z);
        return {
          px: cx + rotated.x * scale,
          py: cy + rotated.y * scale,
          pz: rotated.z,
          scale,
        };
      });

      // Sort points back-to-front for transparency correctness
      projectedPoints.sort((a, b) => a.pz - b.pz);

      // Draw dots
      projectedPoints.forEach((pt) => {
        const alpha = Math.max(0.08, (pt.pz + radius) / (radius * 2));
        const finalAlpha = pt.pz < 0 ? alpha * 0.35 : alpha * 0.75;
        ctx.fillStyle = pt.pz < 0 ? `rgba(168, 85, 247, ${finalAlpha})` : `rgba(14, 165, 233, ${finalAlpha})`;
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, pt.pz < 0 ? 0.9 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Compute and draw city nodes
      const projectedCities = CITIES.map((city) => {
        // Lat/lon to spherical 3D points
        const phi = (city.lat * Math.PI) / 180;
        const theta = (city.lon * Math.PI) / 180;
        const x = radius * Math.cos(phi) * Math.sin(theta);
        const y = radius * Math.sin(phi);
        const z = radius * Math.cos(phi) * Math.cos(theta);

        const rotated = rotate3D(x, y, z);
        const scale = 260 / (260 - rotated.z);
        return {
          ...city,
          px: cx + rotated.x * scale,
          py: cy + rotated.y * scale,
          pz: rotated.z,
          scale,
        };
      });

      // Draw connection arcs
      connections.forEach((conn) => {
        const fromProj = projectedCities.find((c) => c.name === conn.from.name);
        const toProj = projectedCities.find((c) => c.name === conn.to.name);

        if (fromProj && toProj) {
          // Progress speed
          conn.progress += conn.speed;
          if (conn.progress > 1) conn.progress = 0;

          // Midpoint logic for arc curve
          const mx = (fromProj.px + toProj.px) / 2;
          const my = (fromProj.py + toProj.py) / 2 - 40 * ((fromProj.pz + toProj.pz) / (radius * 2) + 1.2);

          // Draw the connection arc
          ctx.beginPath();
          ctx.moveTo(fromProj.px, fromProj.py);
          ctx.quadraticCurveTo(mx, my, toProj.px, toProj.py);
          const isBehind = fromProj.pz < 0 || toProj.pz < 0;
          ctx.strokeStyle = isBehind ? 'rgba(168, 85, 247, 0.15)' : 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = isBehind ? 0.8 : 1.5;
          ctx.stroke();

          // Draw animated glowing message packet along arc
          const t = conn.progress;
          const px = (1 - t) * (1 - t) * fromProj.px + 2 * (1 - t) * t * mx + t * t * toProj.px;
          const py = (1 - t) * (1 - t) * fromProj.py + 2 * (1 - t) * t * my + t * t * toProj.py;

          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px, py, isBehind ? 1.5 : 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // Reset
        }
      });

      // Draw city labels
      let currentHovered: string | null = null;
      projectedCities.forEach((city) => {
        const isBehind = city.pz < 0;
        const size = isBehind ? 2 : 4;

        // Draw indicator node
        ctx.fillStyle = isBehind ? 'rgba(168, 85, 247, 0.4)' : 'rgba(34, 197, 94, 0.9)';
        ctx.beginPath();
        ctx.arc(city.px, city.py, size, 0, Math.PI * 2);
        ctx.fill();

        // Glowing pulse
        if (!isBehind) {
          const pulse = (Date.now() % 2000) / 2000;
          ctx.strokeStyle = `rgba(34, 197, 94, ${1 - pulse})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(city.px, city.py, size + pulse * 15, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Mouse hover checking (within 15px radius)
        const dist = Math.hypot(mouseRef.current.targetX * (width / 2) + cx - city.px, mouseRef.current.targetY * (height / 2) + cy - city.py);
        const isHovered = dist < 25;
        if (isHovered && !isBehind) {
          currentHovered = city.name;
        }

        // Draw label text
        if (!isBehind || isHovered) {
          ctx.fillStyle = isHovered ? '#22c55e' : 'rgba(241, 245, 249, 0.75)';
          ctx.font = isHovered ? 'bold 10px "JetBrains Mono", monospace' : '9px "Inter", sans-serif';
          ctx.fillText(city.name.split(' ')[0], city.px + 8, city.py + 3);
        }
      });

      if (currentHovered !== hoveredNode) {
        setHoveredNode(currentHovered);
      }

      // Draw subtle orbital rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.3, radius * 0.4, rotation.x, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [rotation, hoveredNode]);

  return (
    <div id="globe-container" ref={containerRef} className="relative w-full h-[380px] flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="block select-none" />

      {/* Floating HUD interface accents */}
      <div className="absolute top-4 left-4 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg text-left pointer-events-none font-mono text-[10px] space-y-1 text-slate-400">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
          <span>ORBITAL TRANS-FEED</span>
        </div>
        <div>SYS: SECURE NODE CONNECT</div>
        <div>STATIONS: {CITIES.length} GLOBAL HUBs</div>
        <div>FEED: TRADINGVIEW & GEMINI</div>
      </div>

      <div className="absolute bottom-4 right-4 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg text-right pointer-events-none font-mono text-[10px] space-y-1 text-slate-400">
        <div>COORDINATES: UTC+00</div>
        <div className="text-purple-400 font-medium">
          GRID LOCK: {hoveredNode ? hoveredNode : 'AUTO-SCANNING'}
        </div>
        <div>LAT: {(mouseRef.current.y * 90).toFixed(4)}° / LON: {(mouseRef.current.x * 180).toFixed(4)}°</div>
      </div>
    </div>
  );
}
