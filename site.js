document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reduceMotion.matches) {
    body.classList.add('is-loaded');
  } else {
    window.requestAnimationFrame(() => body.classList.add('is-loaded'));
  }

  /* ---- custom cursor (fine pointers only) ---- */

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-dot-outline');

  if (!dot || !outline || !finePointer.matches) {
    return;
  }

  body.classList.add('has-cursor');

  const state = {
    delay: 7,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    endX: window.innerWidth / 2,
    endY: window.innerHeight / 2,
    enlarged: false,
  };

  const show = (visible) => {
    dot.style.opacity = visible ? '1' : '0';
    outline.style.opacity = visible ? '0.35' : '0';
  };

  const size = () => {
    const scaleDot = state.enlarged ? 0.75 : 1;
    const scaleOutline = state.enlarged ? 1.5 : 1;
    dot.style.transform = `translate(-50%, -50%) scale(${scaleDot})`;
    outline.style.transform = `translate(-50%, -50%) scale(${scaleOutline})`;
  };

  const trail = () => {
    state.x += (state.endX - state.x) / state.delay;
    state.y += (state.endY - state.y) / state.delay;
    outline.style.left = `${state.x}px`;
    outline.style.top = `${state.y}px`;
    window.requestAnimationFrame(trail);
  };

  document.querySelectorAll('a, button, iframe').forEach((el) => {
    el.addEventListener('mouseover', () => {
      state.enlarged = true;
      size();
    });
    el.addEventListener('mouseout', () => {
      state.enlarged = false;
      size();
    });
  });

  document.addEventListener('mousemove', (event) => {
    state.endX = event.pageX;
    state.endY = event.pageY;
    dot.style.left = `${event.pageX}px`;
    dot.style.top = `${event.pageY}px`;
    show(true);
  });

  document.addEventListener('mouseleave', () => show(false));
  document.addEventListener('mousedown', () => {
    state.enlarged = true;
    size();
  });
  document.addEventListener('mouseup', () => {
    state.enlarged = false;
    size();
  });

  trail();
});
