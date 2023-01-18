import "./style.css";

let allAssets = [];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

shuffleArray(allAssets);

const distance = 4;

let dx = 2;
let dy = 1;
let x = 0;
let y = 0;

let img = new Image();
let video = document.createElement("video");
video.muted = true;
let assetIndex = 0;

const getFilenameWithoutExtension = (name) => {
  const filenameWithoutExtension = name
    .split("/")
    .pop()
    .split(".")
    .slice(0, -1)
    .join(".");

  return filenameWithoutExtension;
};

const loadImage = () => {
  const imported = allAssets[assetIndex].imported;
  document.getElementById("bottom-text").innerText =
    getFilenameWithoutExtension(imported[0]);

  img.src = imported[1].default;
};

const loadVideo = () => {
  const imported = allAssets[assetIndex].imported;
  console.log(allAssets[assetIndex]);
  document.getElementById("bottom-text").innerText =
    getFilenameWithoutExtension(imported[0]);

  video.src = imported[1].default;
  video.playbackRate = 4;
  video.loop = true;
  video.play();
};

const tick = () => {
  console.log("tick");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const isVideo = allAssets[assetIndex].type === "video";

  const elementToDraw = isVideo ? video : img;

  const elementWidth = isVideo ? video.videoWidth : img.width;
  const elementHeight = isVideo ? video.videoHeight : img.height;

  const elementRatio = elementWidth / elementHeight;
  const drawWidth = Math.min(600, elementWidth);
  const drawHeight = drawWidth / elementRatio;

  console.log("?");

  ctx.drawImage(
    elementToDraw,
    x - drawWidth / 2,
    y - drawHeight / 2,
    drawWidth,
    drawHeight
  );

  x += dx * distance;
  y += dy * distance;

  let turn = false;
  if (x >= canvas.width || x <= 0) {
    dx = -dx;

    turn = true;
  }

  if (y >= canvas.height || y <= 0) {
    dy = -dy;

    turn = true;
  }

  if (turn) {
    loadNextAsset();
  }
};

const loadNextAsset = () => {
  assetIndex = (assetIndex + 1) % allAssets.length;

  const asset = allAssets[assetIndex];

  if (asset.type === "image") {
    loadImage();
  } else if (asset.type === "video") {
    loadVideo();
  }
};

const setup = () => {
  document.getElementById("app").style.display = "block";
  loadNextAsset();
  setInterval(tick, 32);
  tick();
};

// Hide app
document.getElementById("app").style.display = "none";

const fileInput = document.getElementById("input");
fileInput.addEventListener("change", (e) => {
  const files = e.target.files;

  allAssets = [...files].map((file) => {
    console.log(file);
    const url = URL.createObjectURL(file);

    // Determine type by extension
    const type = file.name.split(".").pop() === "mp4" ? "video" : "image";

    return {
      type,
      imported: [file.name, { default: url }],
    };
  });

  shuffleArray(allAssets);
  setup();
});
