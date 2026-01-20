const sections=document.querySelectorAll('section');
const observer=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.15});
sections.forEach(s=>observer.observe(s));
