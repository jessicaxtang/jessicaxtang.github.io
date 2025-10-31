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

  navLinks.forEach((link) => {
    const enter = () => link.classList.add('is-hovering');
    const leave = () => link.classList.remove('is-hovering');

    link.addEventListener('mouseenter', enter);
    link.addEventListener('mouseleave', leave);
    link.addEventListener('focus', enter);
    link.addEventListener('blur', leave);
  });
});
