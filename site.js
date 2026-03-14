document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const page = document.body;

  const finishLoad = () => {
    page.classList.add('is-loaded');
  };

  if (prefersReducedMotion.matches) {
    finishLoad();
  } else {
    window.requestAnimationFrame(finishLoad);
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const revealTargets = document.querySelectorAll('.reveal-on-scroll');

  navLinks.forEach((link) => {
    const enter = () => link.classList.add('is-hovering');
    const leave = () => link.classList.remove('is-hovering');

    link.addEventListener('mouseenter', enter);
    link.addEventListener('mouseleave', leave);
    link.addEventListener('focus', enter);
    link.addEventListener('blur', leave);
  });

  if (revealTargets.length) {
    if (prefersReducedMotion.matches) {
      revealTargets.forEach((target) => target.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          });
        },
        {
          root: null,
          threshold: 0.2,
        },
      );

      revealTargets.forEach((target) => revealObserver.observe(target));
    }
  }

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-dot-outline');

  if (cursorDot && cursorOutline) {
    const cursorState = {
      delay: 7,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      endX: window.innerWidth / 2,
      endY: window.innerHeight / 2,
      visible: true,
      enlarged: false,
    };

    const toggleCursorVisibility = () => {
      if (cursorState.visible) {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '0.5';
      } else {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
      }
    };

    const toggleCursorSize = () => {
      if (cursorState.enlarged) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.75)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
      } else {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    };

    const animateCursorOutline = () => {
      cursorState.x += (cursorState.endX - cursorState.x) / cursorState.delay;
      cursorState.y += (cursorState.endY - cursorState.y) / cursorState.delay;
      cursorOutline.style.top = `${cursorState.y}px`;
      cursorOutline.style.left = `${cursorState.x}px`;
      window.requestAnimationFrame(animateCursorOutline);
    };

    document.querySelectorAll('a').forEach((anchor) => {
      anchor.addEventListener('mouseover', () => {
        cursorState.enlarged = true;
        toggleCursorSize();
      });
      anchor.addEventListener('mouseout', () => {
        cursorState.enlarged = false;
        toggleCursorSize();
      });
    });

    document.addEventListener('mousedown', () => {
      cursorState.enlarged = true;
      toggleCursorSize();
    });

    document.addEventListener('mouseup', () => {
      cursorState.enlarged = false;
      toggleCursorSize();
    });

    document.addEventListener('mousemove', (event) => {
      cursorState.visible = true;
      toggleCursorVisibility();
      cursorState.endX = event.pageX;
      cursorState.endY = event.pageY;
      cursorDot.style.top = `${cursorState.endY}px`;
      cursorDot.style.left = `${cursorState.endX}px`;
    });

    document.addEventListener('mouseenter', () => {
      cursorState.visible = true;
      toggleCursorVisibility();
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursorState.visible = true;
      toggleCursorVisibility();
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });

    animateCursorOutline();
  }

});
