document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Modal Handling
    // ======================
    const signinModal = document.getElementById('signin-modal');
    const signupModal = document.getElementById('signup-modal');
    const openSigninBtn = document.getElementById('open-signin');
    const openSignupForm = document.getElementById('open-signup');
    const closeSigninBtn = document.getElementById('close-signin');
    const closeSignupBtn = document.getElementById('close-signup');
    const gotoSignup = document.getElementById('goto-signup');
    const gotoSignin = document.getElementById('goto-signin');

    // Open Sign In modal
    if (openSigninBtn) {
        openSigninBtn.onclick = () => {
            signinModal.style.display = 'flex';
            signupModal.style.display = 'none';
        };
    }

    // Open Sign Up modal from Get Started
    if (openSignupForm) {
        openSignupForm.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('main-email').value;
            
            // Validate email format
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                alert("Please enter a valid email address");
                return;
            }
            
            // Open signup modal
            signupModal.style.display = 'flex';
            signinModal.style.display = 'none';
            
            // Populate email in signup form and focus on first name
            const signupEmail = document.getElementById('signup-email');
            signupEmail.value = email;
            document.getElementById('first-name').focus();
        };
    }

    // Close modals
    if (closeSigninBtn) closeSigninBtn.onclick = () => signinModal.style.display = 'none';
    if (closeSignupBtn) closeSignupBtn.onclick = () => signupModal.style.display = 'none';

    // Switch between modals
    if (gotoSignup) {
        gotoSignup.onclick = (e) => {
            e.preventDefault();
            signinModal.style.display = 'none';
            signupModal.style.display = 'flex';
        };
    }

    if (gotoSignin) {
        gotoSignin.onclick = (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            signinModal.style.display = 'flex';
        };
    }

    // Close modal on outside click
    window.onclick = function(event) {
        if (event.target === signinModal) signinModal.style.display = 'none';
        if (event.target === signupModal) signupModal.style.display = 'none';
    };

    // ======================
    // Form Handling
    // ======================
    // Sign In Form Handler
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.onsubmit = function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="text"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            // Check if user exists in localStorage
            const user = JSON.parse(localStorage.getItem('netflixUser'));
            
            if (user && user.email === email && user.password === password) {
                // Successful login - redirect to dashboard
                window.location.href = "dashboard.html";
            } else {
                alert("Invalid credentials. Please try again or sign up.");
            }
        };
    }

    // Sign Up Form Handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.onsubmit = function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;

            // Validation
            if (!firstName || !lastName) {
                alert("Please enter your first and last name");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters");
                return;
            }

            // Create user object
            const user = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password // Note: In real app, never store plain passwords
            };

            // Save to localStorage
            localStorage.setItem('netflixUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = "dashboard.html";
        };
    }

    // ======================
    // Dashboard Functionality
    // ======================
    if (document.querySelector('.dashboard-user')) {
        // Load and display user data
        const loadUserData = () => {
            try {
                const userData = localStorage.getItem('netflixUser');
                if (userData) {
                    const user = JSON.parse(userData);
                    if (user.firstName && user.lastName) {
                        const firstInitial = user.firstName.charAt(0).toUpperCase();
                        const lastInitial = user.lastName.charAt(0).toUpperCase();
                        const initials = firstInitial + lastInitial;
                        
                        const userIcon = document.getElementById('user-icon');
                        const userInitials = document.getElementById('user-initials');
                        
                        if (userIcon) {
                            userIcon.textContent = initials;
                            userIcon.style.fontSize = '16px';
                            userIcon.style.fontWeight = 'bold';
                        }
                        if (userInitials) userInitials.textContent = initials;
                        return;
                    }
                }
                // Fallback if no user data
                document.getElementById('user-icon').textContent = '👤';
            } catch (e) {
                console.error('Error loading user data:', e);
                document.getElementById('user-icon').textContent = '👤';
            }
        };

        // Initialize user data
        loadUserData();

        // Toggle dropdown
        const dropdown = document.getElementById('user-dropdown');
        const userIcon = document.getElementById('user-icon');

        if (userIcon && dropdown) {
            userIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.dashboard-user')) {
                    dropdown.classList.remove('show');
                }
            });
        }

        // Sign out functionality
        const signOutBtn = document.getElementById('sign-out');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }

        // Delete account functionality
        const deleteAccountBtn = document.getElementById('delete-account');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', function() {
                const modal = document.createElement('div');
                modal.className = 'confirm-modal';
                modal.innerHTML = `
                    <div class="confirm-content">
                        <h3>Delete Your Account?</h3>
                        <p>This will permanently delete your account and all your data. This action cannot be undone.</p>
                        <div class="confirm-buttons">
                            <button class="confirm-delete">Delete</button>
                            <button class="cancel-delete">Cancel</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                modal.style.display = 'flex';

                modal.querySelector('.confirm-delete').addEventListener('click', function() {
                    localStorage.removeItem('netflixUser');
                    window.location.href = 'index.html';
                });

                modal.querySelector('.cancel-delete').addEventListener('click', function() {
                    document.body.removeChild(modal);
                });

                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                    }
                });
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('.dashboard-nav a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without refreshing
                    history.pushState(null, null, targetId);
                    
                    // Update active link
                    document.querySelectorAll('.dashboard-nav a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });

        // Highlight active section while scrolling
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY + 100;
            
            document.querySelectorAll('.movie-section, .featured').forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.dashboard-nav a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        // Set initial active link
        const featuredLink = document.querySelector('.dashboard-nav a[href="#featured"]');
        if (featuredLink) {
            featuredLink.classList.add('active');
        }

        // ======================
        // Search Functionality
        // ======================
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const searchIcon = document.querySelector('.search-icon');

        if (searchInput && searchResults) {
            // Get all movie cards for searching
            const movieCards = document.querySelectorAll('.movie-card');
            
            // Show search results when input is focused
            searchInput.addEventListener('focus', function() {
                if (this.value.length >= 2) {
                    searchResults.style.display = 'block';
                }
            });

            // Hide search results when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.search-container')) {
                    searchResults.style.display = 'none';
                }
            });

            // Handle search input
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                searchResults.innerHTML = '';
                
                if (query.length < 2) {
                    searchResults.style.display = 'none';
                    return;
                }
                
                const matches = Array.from(movieCards).filter(card => {
                    const title = card.dataset.title.toLowerCase();
                    const genre = card.dataset.genre.toLowerCase();
                    return title.includes(query) || genre.includes(query);
                });
                
                if (matches.length > 0) {
                    matches.slice(0, 5).forEach(match => {
                        const resultItem = document.createElement('div');
                        resultItem.className = 'search-result-item';
                        
                        const img = document.createElement('img');
                        img.src = match.querySelector('img').src;
                        img.alt = match.dataset.title;
                        
                        const info = document.createElement('div');
                        info.className = 'search-result-info';
                        
                        const title = document.createElement('h4');
                        title.textContent = match.dataset.title;
                        
                        const genre = document.createElement('p');
                        genre.textContent = match.dataset.genre;
                        
                        info.appendChild(title);
                        info.appendChild(genre);
                        resultItem.appendChild(img);
                        resultItem.appendChild(info);
                        
                        resultItem.addEventListener('click', function() {
                            // Scroll to the matching movie
                            match.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            
                            // Highlight the movie temporarily
                            match.classList.add('highlight');
                            setTimeout(() => {
                                match.classList.remove('highlight');
                            }, 2000);
                            
                            // Clear search
                            searchInput.value = '';
                            searchResults.style.display = 'none';
                        });
                        
                        searchResults.appendChild(resultItem);
                    });
                    searchResults.style.display = 'block';
                } else {
                    const noResults = document.createElement('div');
                    noResults.className = 'search-no-results';
                    noResults.textContent = 'No results found';
                    searchResults.appendChild(noResults);
                    searchResults.style.display = 'block';
                }
            });

            // Search icon click handler
            if (searchIcon) {
                searchIcon.addEventListener('click', function() {
                    if (searchInput.value.trim().length >= 2) {
                        searchResults.style.display = searchResults.style.display === 'block' ? 'none' : 'block';
                    }
                });
            }
        }
    }

    // ======================
    // Movie Loading (if needed)
    // ======================
    function loadMovies() {
        const movieContainer = document.getElementById("movie-container");
        if (!movieContainer) return;

        const movies = [
            {
                title: "Movie 1",
                image: "https://via.placeholder.com/150",
            },
            {
                title: "Movie 2",
                image: "https://via.placeholder.com/150",
            },
            {
                title: "Movie 3",
                image: "https://via.placeholder.com/150",
            },
            {
                title: "Movie 4",
                image: "https://via.placeholder.com/150",
            },
        ];

        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie");
            
            const movieImage = document.createElement("img");
            movieImage.src = movie.image;
            movieImage.alt = movie.title;

            const movieTitle = document.createElement("h3");
            movieTitle.textContent = movie.title;

            movieDiv.appendChild(movieImage);
            movieDiv.appendChild(movieTitle);
            movieContainer.appendChild(movieDiv);
        });
    }

    // Load movies if container exists
    loadMovies();
});