/* Home film. Three.js dust rides over the gallop.
   The video and the wordmark are real DOM, so the page still
   stands if WebGL refuses to start. Dust never covers the shop. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

var root = document.querySelector(".hero--film");
var canvas = document.querySelector(".hero__dust");
var video = root && root.querySelector(".hero__film");
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (video) {
  if (reduce) {
    video.removeAttribute("autoplay");
    video.pause();
  } else {
    var attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(function () {});
  }
}

if (!root || !canvas || reduce) {
  /* still page, no dust */
} else {
  boot(root, canvas);
}

function boot(root, canvas) {
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance"
    });
  } catch (err) {
    return;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(48, 1, 0.1, 50);
  camera.position.set(0, 0.6, 7.2);

  var narrow = window.matchMedia("(max-width: 800px)").matches;
  var count = narrow ? 380 : 980;
  var positions = new Float32Array(count * 3);
  var speeds = new Float32Array(count);
  var colors = new Float32Array(count * 3);
  var palette = ["#f3d7a1", "#e0a15a", "#c56a32", "#fff6e8", "#8d4a28"].map(function (hex) {
    return new THREE.Color(hex);
  });

  var i;
  for (i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.15) * 5.2;
    positions[i * 3 + 2] = (Math.random() - 0.55) * 7;
    speeds[i] = 0.55 + Math.random() * 1.7;
    var tint = palette[(Math.random() * palette.length) | 0];
    colors[i * 3] = tint.r;
    colors[i * 3 + 1] = tint.g;
    colors[i * 3 + 2] = tint.b;
  }

  var geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  var sprite = document.createElement("canvas");
  sprite.width = sprite.height = 64;
  var g = sprite.getContext("2d");
  var glow = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.28, "rgba(255,255,255,0.7)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, 64, 64);
  var mat = new THREE.PointsMaterial({
    size: narrow ? 0.09 : 0.07,
    map: new THREE.CanvasTexture(sprite),
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  scene.add(new THREE.Points(geo, mat));

  var tx = 0;
  var ty = 0;
  var px = 0;
  var py = 0;

  function aim(clientX, clientY) {
    var box = root.getBoundingClientRect();
    tx = ((clientX - box.left) / box.width) * 2 - 1;
    ty = ((clientY - box.top) / box.height) * 2 - 1;
  }

  root.addEventListener("pointermove", function (e) { aim(e.clientX, e.clientY); });
  root.addEventListener("pointerleave", function () { tx = 0; ty = 0; });

  function resize() {
    var w = root.clientWidth;
    var h = root.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  var running = true;
  var watch = new IntersectionObserver(function (entries) {
    running = entries[0].isIntersecting;
  }, { threshold: 0.08 });
  watch.observe(root);

  var clock = new THREE.Clock();
  var pos = geo.attributes.position;

  function frame() {
    requestAnimationFrame(frame);
    if (!running || document.hidden) {
      clock.getDelta();
      return;
    }
    var dt = Math.min(clock.getDelta(), 0.05);
    px += (tx - px) * 0.07;
    py += (ty - py) * 0.07;
    root.style.setProperty("--px", px.toFixed(4));
    root.style.setProperty("--py", py.toFixed(4));
    camera.position.x = px * 1.15;
    camera.position.y = 0.6 - py * 0.45;
    camera.lookAt(px * 0.2, 0.15, 0);

    var n = pos.count;
    var k;
    for (k = 0; k < n; k++) {
      var x = pos.getX(k) + speeds[k] * dt * 1.35;
      if (x > 9) x = -9;
      var y = pos.getY(k) + Math.sin(x * 0.85 + k) * dt * 0.15;
      if (y > 3.2) y = -2.2;
      if (y < -2.4) y = 3;
      pos.setXY(k, x, y);
    }
    pos.needsUpdate = true;
    renderer.render(scene, camera);
  }
  frame();
}
