class MaterialSelector {
    constructor(container, materials, onSelect) {
        this.container = container;
        this.materials = materials;
        this.onSelect = onSelect;
        this.selectedMaterial = null;
        this.searchInput = container.querySelector('.search-input');
        this.optionsContainer = container.querySelector('.options-container');
        
        this.setupEventListeners();
        this.populateOptions();
    }

    setupEventListeners() {
        // Handle input changes
        this.searchInput.addEventListener('input', (e) => {
            this.filterOptions(e.target.value);
        });

        // Handle focus/blur
        this.searchInput.addEventListener('focus', () => {
            this.optionsContainer.classList.add('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.optionsContainer.classList.remove('show');
            }
        });

        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.handleArrowKeys(e.key);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.selectHighlightedOption();
            } else if (e.key === 'Escape') {
                this.optionsContainer.classList.remove('show');
            }
        });
    }

    populateOptions() {
        this.optionsContainer.innerHTML = '';
        this.materials.forEach(material => {
            const option = document.createElement('div');
            option.className = 'material-option';
            option.dataset.id = material.id;
            option.textContent = `${material.name} - PHP ${this.formatNumber(material.baseRate)}`;
            
            option.addEventListener('click', () => {
                this.selectMaterial(material);
            });
            
            this.optionsContainer.appendChild(option);
        });
    }

    filterOptions(searchTerm) {
        const options = this.optionsContainer.querySelectorAll('.material-option');
        const searchLower = searchTerm.toLowerCase();
        
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(searchLower) ? 'block' : 'none';
        });
    }

    handleArrowKeys(key) {
        const options = Array.from(this.optionsContainer.querySelectorAll('.material-option:not([style*="display: none"])'));
        const currentIndex = options.findIndex(opt => opt.classList.contains('selected'));
        
        if (key === 'ArrowDown') {
            const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
            this.highlightOption(options[nextIndex]);
        } else {
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
            this.highlightOption(options[prevIndex]);
        }
    }

    highlightOption(option) {
        this.optionsContainer.querySelectorAll('.material-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
    }

    selectHighlightedOption() {
        const selected = this.optionsContainer.querySelector('.material-option.selected');
        if (selected) {
            const material = this.materials.find(m => m.id === selected.dataset.id);
            if (material) {
                this.selectMaterial(material);
            }
        }
    }

    selectMaterial(material) {
        this.selectedMaterial = material;
        this.searchInput.value = `${material.name} - PHP ${this.formatNumber(material.baseRate)}`;
        this.optionsContainer.classList.remove('show');
        this.onSelect(material);
    }

    formatNumber(number) {
        return new Intl.NumberFormat('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    getSelectedMaterial() {
        return this.selectedMaterial;
    }
} 