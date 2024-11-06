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