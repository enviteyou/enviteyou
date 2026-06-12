"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

const SLIDES = [
  { src: "/1.png", title: "Bride and Groom" },
  { src: "/2.png", title: "Countdown Begins" },
  { src: "/3.png", title: "Lanterns" },
  { src: "/4.png", title: "Abishek" },
  { src: "/5.png", title: "Shaadi" },
  { src: "/6.png", title: "Kanika" },
  { src: "/7.png", title: "Kanika" },
  { src: "/8.png", title: "Kanika" },
  { src: "/1.png", title: "Bride and Groom" },
  { src: "/2.png", title: "Countdown Begins" },
  { src: "/3.png", title: "Lanterns" },
  { src: "/4.png", title: "Abishek" },
];

function createAlphaTexture(renderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 512, 1024);

  ctx.fillStyle = "#ffffff";
  const r = 40;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(512 - r, 0);
  ctx.quadraticCurveTo(512, 0, 512, r);
  ctx.lineTo(512, 1024 - r);
  ctx.quadraticCurveTo(512, 1024, 512 - r, 1024);
  ctx.lineTo(r, 1024);
  ctx.quadraticCurveTo(0, 1024, 0, 1024 - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

export default function Hero() {
  const mountRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!mountRef.current) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xf8f8fa);
    // scene.fog = new THREE.FogExp2(0xf8f8fa, 0.015);

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(0, 20, 20); // Above and slightly behind camera
    // dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const centerLight = new THREE.PointLight(0xffffff, 1.5, 100);
    centerLight.position.set(0, 5, 0); // Illuminates the inside of the concave curve
    scene.add(centerLight);

    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    const numPanels = SLIDES.length;
    const isMobile = w < 768;

    // Adjust radius and panelHeight to maintain a pleasant portrait aspect ratio
    // This prevents images from looking vertically stretched (heavily cropped horizontally)
    const radius = isMobile ? 14 : 24;
    const panelHeight = isMobile ? 12 : 18;
    const gap = isMobile ? 0.04 : 0.03;
    const anglePerPanel = (Math.PI * 2) / numPanels;
    const panelAngle = anglePerPanel - gap;

    // Place the camera INSIDE the cylinder, looking at the far inner wall (-Z)
    camera.position.z = radius * 0.85; // Pushed back so the curve is completely "in front"
    camera.position.y = 0; // Centered vertically
    camera.lookAt(0, 0, -radius);
    dirLight.target.position.set(0, 0, -radius);
    scene.add(dirLight.target);

    carouselGroup.position.y = 0; // Centered vertically

    // Slight tilt for depth
    carouselGroup.rotation.x = -0.02;

    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.06 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = - (panelHeight / 2) - 1;
    floor.receiveShadow = true;
    scene.add(floor);

    const alphaTexture = createAlphaTexture(renderer);
    const textureLoader = new THREE.TextureLoader();

    const meshes = [];

    SLIDES.forEach((slide, i) => {
      const geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        panelHeight,
        256,
        1,
        true,
        i * anglePerPanel,
        panelAngle
      );

      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide,
        alphaMap: alphaTexture,
        transparent: true,
        depthWrite: false, // Ensures perfectly soft anti-aliased corners inside the cylinder without sorting bugs
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      textureLoader.load(slide.src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const imgAspect = tex.image.width / tex.image.height;
        const panelAspect = (radius * panelAngle) / panelHeight;

        // Since we are viewing the inside of the cylinder, the texture would normally appear mirrored.
        // We fix this by flipping the texture mapping coordinates horizontally.
        tex.wrapS = THREE.ClampToEdgeWrapping;

        if (imgAspect > panelAspect) {
          const scale = panelAspect / imgAspect;
          tex.repeat.set(-scale, 1);
          tex.offset.set((1 + scale) / 2, 0);
        } else {
          const scale = imgAspect / panelAspect;
          tex.repeat.set(-1, scale);
          tex.offset.set(1, (1 - scale) / 2);
        }

        material.map = tex;
        material.needsUpdate = true;
      });

      carouselGroup.add(mesh);
      meshes.push(mesh);
    });

    let targetRotation = 0;
    let currentRotation = 0;
    let isDragging = false;
    let previousX = 0;
    let autoRotateSpeed = 0.0025;

    const onPointerDown = (e) => {
      isDragging = true;
      previousX = e.clientX || e.touches?.[0].clientX;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || e.touches?.[0].clientX;
      const deltaX = x - previousX;
      // Subtract because from the inside, increasing Y rotation moves panels left
      targetRotation -= deltaX * 0.003;
      previousX = x;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const container = mountRef.current;
    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        targetRotation += autoRotateSpeed;
      }

      currentRotation += (targetRotation - currentRotation) * 0.08;
      carouselGroup.rotation.y = currentRotation;

      // Add a slight vertical bobbing effect
      carouselGroup.position.y = Math.sin(Date.now() * 0.001) * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      camera.aspect = w / h;

      const isMob = w < 768;
      const r = isMob ? 14 : 24;
      camera.position.z = r * 0.85;
      camera.position.y = 0;
      camera.lookAt(0, 0, -r);

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("resize", handleResize);

      cancelAnimationFrame(animationFrameId);

      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (mesh.material.map) mesh.material.map.dispose();
        if (mesh.material.alphaMap) mesh.material.alphaMap.dispose();
        mesh.material.dispose();
      });
      alphaTexture.dispose();
      renderer.dispose();
      scene.clear();

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative isolate w-full flex flex-col items-center justify-start pt-10 cursor-grab active:cursor-grabbing">
      <div className="-mb-55 z-10 flex flex-col items-center text-center px-5 max-w-3xl pointer-events-none">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/50 px-3 py-1 text-xs md:text-sm font-medium text-gray-900 backdrop-blur-sm mb-4 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Pay Once. No Expiry. No Hidden Fees.
        </div>

        <h1 className="text-2xl md:text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 mb-2 drop-shadow-sm">
          Build Your Wedding Website,
          <br className="hidden md:block" />{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-500 to-gray-900">
            Online Forever.
          </span>
        </h1>

        <p className="text-xs md:text-sm text-gray-600 mb-4 max-w-lg font-medium leading-relaxed">
          Create in minutes. Invitations, RSVP, photos, and memories—all in one
          place, beautifully designed.
        </p>

        <button
          onClick={() => router.push("/template")}
          className="pointer-events-auto rounded-full bg-black px-8 py-2 text-sm md:text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-gray-800 shadow-xl shadow-black/10 flex items-center gap-2"
        >
          Explore Templates
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full pointer-events-auto touch-pan-y -mb-40 md:-mb-10"
      />

    </section>
  );
}
