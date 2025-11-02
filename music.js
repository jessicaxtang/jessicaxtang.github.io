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
  const showcaseMedia = document.querySelectorAll('.home-showcase__media');

  navLinks.forEach((link) => {
    const enter = () => link.classList.add('is-hovering');
    const leave = () => link.classList.remove('is-hovering');

    link.addEventListener('mouseenter', enter);
    link.addEventListener('mouseleave', leave);
    link.addEventListener('focus', enter);
    link.addEventListener('blur', leave);
  });

  const showcaseState = new Map();

  const setActiveImage = (images, index) => {
    images.forEach((img, idx) => {
      if (idx === index) {
        img.classList.add('is-active');
      } else {
        img.classList.remove('is-active');
      }
    });
  };

  const stopCycle = (media) => {
    const state = showcaseState.get(media);
    if (!state || !state.timer) {
      return;
    }

    window.clearInterval(state.timer);
    state.timer = null;
  };

  const startCycle = (media) => {
    const state = showcaseState.get(media);

    if (!state || state.timer || state.hovering || prefersReducedMotion.matches) {
      return;
    }

    state.timer = window.setInterval(() => {
      state.index = (state.index + 1) % state.images.length;
      setActiveImage(state.images, state.index);
    }, state.delay);
  };

  let showcaseObserver = null;

  if (showcaseMedia.length) {
    showcaseObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const state = showcaseState.get(entry.target);
          if (!state) {
            return;
          }

          if (entry.isIntersecting && !prefersReducedMotion.matches && !state.hovering) {
            startCycle(entry.target);
          } else {
            stopCycle(entry.target);
          }
        });
      },
      {
        threshold: 0.35,
      },
    );
  }

  showcaseMedia.forEach((media) => {
    const images = Array.from(media.querySelectorAll('.home-showcase__image'));

    if (!images.length) {
      return;
    }

    setActiveImage(images, 0);

    if (images.length <= 1) {
      return;
    }

    const requestedDelay = Number.parseInt(media.dataset.rotate || '', 10);
    const delay = Number.isFinite(requestedDelay) && requestedDelay > 0 ? requestedDelay : 5000;

    const state = {
      images,
      index: 0,
      delay,
      timer: null,
      hovering: false,
    };

    showcaseState.set(media, state);

    if (showcaseObserver) {
      showcaseObserver.observe(media);
    }

    media.addEventListener('mouseenter', () => {
      state.hovering = true;
      stopCycle(media);
    });

    media.addEventListener('mouseleave', () => {
      state.hovering = false;
      if (!prefersReducedMotion.matches) {
        startCycle(media);
      }
    });

    media.addEventListener('focusin', () => stopCycle(media));
    media.addEventListener('focusout', () => {
      if (!media.matches(':focus-within') && !state.hovering && !prefersReducedMotion.matches) {
        startCycle(media);
      }
    });

    const rect = media.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible && !prefersReducedMotion.matches) {
      startCycle(media);
    }
  });

  if (showcaseState.size) {
    const handleMotionPreferenceChange = (event) => {
      if (event.matches) {
        showcaseState.forEach((_, media) => stopCycle(media));
      } else {
        showcaseState.forEach((state, media) => {
          if (!media.matches(':hover') && !media.matches(':focus-within')) {
            startCycle(media);
          }
        });
      }
    };

    if (typeof prefersReducedMotion.addEventListener === 'function') {
      prefersReducedMotion.addEventListener('change', handleMotionPreferenceChange);
    } else if (typeof prefersReducedMotion.addListener === 'function') {
      prefersReducedMotion.addListener(handleMotionPreferenceChange);
    }
  }

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
});
