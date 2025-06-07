document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPostsContainer = document.getElementById('blog-posts');
    
    // State
    let posts = [];
    let filteredPosts = [];
    let currentFilter = 'all';
    let searchQuery = '';
    
    // Initialize the app
    initTheme();
    fetchBlogPosts();
    setupEventListeners();
    
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    async function fetchBlogPosts() {
        try {
            // Burada gerçek bir API endpoint'i kullanabilirsiniz
            // Örnek olarak local bir JSON dosyası kullanıyorum
            const response = await fetch('posts.json');
            posts = await response.json();
            
            // Her post için favori durumunu yükle
            posts.forEach(post => {
                post.isFavorite = getFavoriteStatus(post.id);
            });
            
            renderPosts(posts);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            blogPostsContainer.innerHTML = '<div class="no-results">Gönderiler yüklenirken bir hata oluştu.</div>';
        }
    }
    
    function getFavoriteStatus(postId) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.includes(postId);
    }
    
    function toggleFavorite(postId) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const index = favorites.indexOf(postId);
        
        if (index === -1) {
            favorites.push(postId);
        } else {
            favorites.splice(index, 1);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // UI'ı güncelle
        const favoriteButtons = document.querySelectorAll(`.favorite-btn[data-id="${postId}"]`);
        favoriteButtons.forEach(btn => {
            btn.classList.toggle('favorited');
        });
        
        // Eğer favori filtresi aktifse, listeyi yeniden render et
        if (currentFilter === 'favorites') {
            applyFilters();
        }
    }
    
    function renderPosts(postsToRender) {
        if (postsToRender.length === 0) {
            blogPostsContainer.innerHTML = '<div class="no-results">Sonuç bulunamadı.</div>';
            return;
        }
        
        blogPostsContainer.innerHTML = '';
        
        postsToRender.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-card';
            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="blog-image">
                <div class="blog-content">
                    <h2 class="blog-title">${post.title}</h2>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-meta">
                        <span class="blog-date"><i class="far fa-calendar-alt"></i> ${post.date}</span>
                        <button class="favorite-btn ${post.isFavorite ? 'favorited' : ''}" data-id="${post.id}" aria-label="${post.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;
            blogPostsContainer.appendChild(postElement);
        });
        
        // Favori butonlarına event listener ekle
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = parseInt(this.getAttribute('data-id'));
                toggleFavorite(postId);
            });
        });
    }
    
    function applyFilters() {
        filteredPosts = [...posts];
        
        // Filtre uygula
        if (currentFilter === 'favorites') {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            filteredPosts = filteredPosts.filter(post => favorites.includes(post.id));
        }
        
        // Arama sorgusunu uygula
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.excerpt.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query)
            );
        }
        
        renderPosts(filteredPosts);
    }
    
    function setupEventListeners() {
        // Tema değiştirme butonu
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
        
        // Mobil menü butonu
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
        
        // Filtre butonları
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                applyFilters();
            });
        });
        
        // Arama butonu
        searchButton.addEventListener('click', function() {
            searchQuery = searchInput.value.trim();
            applyFilters();
        });
        
        // Arama input'unda Enter tuşu
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchQuery = searchInput.value.trim();
                applyFilters();
            }
        });
    }
});
