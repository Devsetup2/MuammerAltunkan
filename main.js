document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPostsContainer = document.getElementById('blog-posts');
    
    // Blog verileri (JSON yerine doğrudan JS içinde)
    const posts = [
        {
            id: 1,
            title: "biological computer powered by human brain cells",
            excerpt: "biological computer powered by human brain cells CL1",
            content: "Science biological computer powered by human brain cells CL1 ",
            image: "https://pbs.twimg.com/card_img/1931354427559903232/WbNIJnaD?format=jpg&name=large",
            date: "8 Haziran 2025",
            category: "Science",
            source: ""
        },
        {
            id: 2,
            title: "CSS Grid ile Modern Layout'lar",
            excerpt: "CSS Grid kullanarak responsive ve modern web sayfaları oluşturun.",
            content: "CSS Grid, web sayfalarında karmaşık layout'lar oluşturmak için güçlü bir araçtır...",
            image: "https://source.unsplash.com/random/600x400/?css",
            date: "10 Haziran 2023",
            category: "CSS",
            source: "https://example.com/css-grid-modern-layout"
        },
        {
            id: 3,
            title: "React Hooks Kullanım Rehberi",
            excerpt: "React Hooks'ları kullanarak fonksiyonel bileşenler oluşturmayı öğrenin.",
            content: "React Hooks, fonksiyonel bileşenlerde state ve lifecycle özelliklerini kullanmamızı sağlar...",
            image: "https://source.unsplash.com/random/600x400/?react",
            date: "5 Haziran 2023",
            category: "React",
            source: "https://example.com/react-hooks-kilavuz"
        },
        {
            id: 4,
            title: "Web Performans Optimizasyonu",
            excerpt: "Web sitenizin yüklenme hızını artırmak için ipuçları ve teknikler.",
            content: "Web performansı, kullanıcı deneyimini doğrudan etkileyen kritik bir faktördür...",
            image: "https://source.unsplash.com/random/600x400/?speed",
            date: "1 Haziran 2023",
            category: "Performance",
            source: "https://example.com/web-performans-optimizasyon"
        },
        {
            id: 5,
            title: "Node.js ile REST API Geliştirme",
            excerpt: "Express.js kullanarak Node.js'de RESTful API nasıl oluşturulur?",
            content: "Node.js, sunucu tarafında JavaScript kullanarak hızlı ve ölçeklenebilir uygulamalar oluşturmamızı sağlar...",
            image: "https://source.unsplash.com/random/600x400/?nodejs",
            date: "25 Mayıs 2023",
            category: "Node.js",
            source: "https://example.com/nodejs-rest-api"
        },
        {
            id: 6,
            title: "Git ve GitHub Kullanımı",
            excerpt: "Versiyon kontrol sistemi Git ve GitHub kullanımına giriş.",
            content: "Git, yazılım geliştirme süreçlerinde versiyon kontrolü için kullanılan popüler bir araçtır...",
            image: "https://source.unsplash.com/random/600x400/?github",
            date: "20 Mayıs 2023",
            category: "Git",
            source: "https://example.com/git-github-kullanim"
        }
    ];

    // State
    let filteredPosts = [];
    let currentFilter = 'all';
    let searchQuery = '';
    
    // Initialize the app
    initTheme();
    initBlogPosts();
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
    
    function initBlogPosts() {
        // Her post için favori durumunu yükle
        posts.forEach(post => {
            post.isFavorite = getFavoriteStatus(post.id);
        });
        
        renderPosts(posts);
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
        
        // Postun favori durumunu güncelle
        const postIndex = posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
            posts[postIndex].isFavorite = !posts[postIndex].isFavorite;
        }
        
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
                        <div class="blog-actions">
                            <a href="${post.source}" class="read-more" target="_blank">Devamını Oku</a>
                            <button class="favorite-btn ${post.isFavorite ? 'favorited' : ''}" data-id="${post.id}" aria-label="${post.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
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
