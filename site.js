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

});
