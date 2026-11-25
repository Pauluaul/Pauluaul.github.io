(() => {
  const dialog = document.querySelector("#matrix-dialog");
  const canvas = dialog.querySelector("canvas");
  const closeButton = dialog.querySelector("button");
  const context = canvas.getContext("2d");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const symbols = "01アイウエオカキクケコサシスセソ";
  let frame = 0;
  let lastTime = 0;
  let columns = [];
  let width = 0;
  let height = 0;

  function resize() {
    width = innerWidth;
    height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.fillStyle = "#030906";
    context.fillRect(0, 0, width, height);
    context.font = "18px monospace";
    columns = Array.from({ length: Math.ceil(width / 20) }, () => Math.random() * height / 22);
  }

  function draw(time) {
    if (!dialog.open || document.hidden) return;
    if (time - lastTime >= 65) {
      context.fillStyle = "rgba(3, 9, 6, .12)";
      context.fillRect(0, 0, width, height);
      columns.forEach((row, index) => {
        context.fillStyle = Math.random() > .96 ? "#d7ffe4" : "#44ca76";
        const character = symbols[Math.floor(Math.random() * symbols.length)];
        context.fillText(character, index * 20, row * 22);
        columns[index] = row * 22 > height && Math.random() > .97 ? 0 : row + 1;
      });
      lastTime = time;
    }
    if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
  }

  function restart() {
    cancelAnimationFrame(frame);
    if (!dialog.open || document.hidden || !context) return;
    resize();
    lastTime = 0;
    if (reducedMotion.matches) {
      // Render a still image when the visitor requests reduced motion.
      for (let i = 0; i < 24; i += 1) draw((i + 1) * 70);
    } else {
      frame = requestAnimationFrame(draw);
    }
  }

  window.openMatrix = () => {
    if (!dialog.open) dialog.showModal();
    restart();
    return "";
  };

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    cancelAnimationFrame(frame);
    document.querySelector("#shell-command").focus({ preventScroll: true });
  });
  addEventListener("resize", restart);
  document.addEventListener("visibilitychange", restart);
  reducedMotion.addEventListener("change", restart);
})();
