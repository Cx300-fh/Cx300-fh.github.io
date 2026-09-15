(() => {
  const start = () => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};
    const setup = () => {
      dispose();
      if (preference.matches) return;
      const animations = [];
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          animations.push(entry.target.animate([{ opacity: .2, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.2,.65,.3,1)' }));
          observer.unobserve(entry.target);
        }
      }), { threshold: .08 });
      document.querySelectorAll('.paper, .section-heading, .experience-entry, .content-card, .gallery-card, .about-grid, .contact').forEach(el => observer.observe(el));
      const card = document.querySelector('.polaroid');
      const pointer = event => {
        if (event.pointerType !== 'mouse' || !card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--tilt-x', `${-(event.clientY - rect.top - rect.height / 2) / 45}deg`);
        card.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / 45}deg`);
      };
      const leave = () => { card?.style.setProperty('--tilt-x', '0deg'); card?.style.setProperty('--tilt-y', '0deg'); };
      card?.addEventListener('pointermove', pointer);
      card?.addEventListener('pointerleave', leave);
      dispose = () => { observer.disconnect(); animations.forEach(a => a.cancel()); card?.removeEventListener('pointermove', pointer); card?.removeEventListener('pointerleave', leave); leave(); };
    };
    setup();
    preference.addEventListener('change', setup);
    const button = document.querySelector('[data-copy-email]');
    const status = document.querySelector('.copy-status');
    let timer;
    button?.addEventListener('click', async () => {
      clearTimeout(timer);
      try { await navigator.clipboard.writeText('li-yx24@mails.tsinghua.edu.cn'); status.textContent = 'Email copied.'; button.classList.add('is-copied'); }
      catch { status.textContent = 'Please copy the email address manually.'; }
      timer = setTimeout(() => { status.textContent = ''; button.classList.remove('is-copied'); }, 3500);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
