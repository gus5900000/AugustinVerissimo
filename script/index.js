const profil = document.querySelector('.header-profil');
const profilImg = profil?.querySelector('img');

if (profil && profilImg) {
    const handleMouseMove = (e) => {
        const rect = profil.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 5; 
        const rotateY = ((x - centerX) / centerX) * 5;
        profilImg.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
        profilImg.style.transition = 'transform 0.1s';
    };
    const handleMouseLeave = () => {
        profilImg.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        profilImg.style.transition = 'transform 0.5s';
    };

    profil.addEventListener('mousemove', handleMouseMove);
    profil.addEventListener('mouseleave', handleMouseLeave);
}