document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split("/").pop();
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
        if (currentPage === "" || currentPage === "/") {
            if (item.getAttribute('href') === "/") {
                item.classList.add('active');
            }
        } else if (item.getAttribute('href') === `${currentPage}`) {
            item.classList.add('active');
        }
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            return;
        })
        .catch(error => {
          console.error('Échec de l\'enregistrement du Service Worker:', error);
        });
    });
  }

document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
    img.decoding = 'async';
});