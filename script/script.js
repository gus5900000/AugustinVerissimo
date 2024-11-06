document.addEventListener('DOMContentLoaded',
    function () {
        const currentPage = window.location.pathname.split("/").pop();
        const navItems = document.querySelectorAll('.nav-link')

        navItems.forEach(item => {
            if (item.getAttribute('href') === `${currentPage}`) {
                item.classList.add('active');
            }
        });
    });