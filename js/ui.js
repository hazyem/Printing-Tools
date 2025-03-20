class UI {
    constructor() {
        this.calculator = new Calculator();
        this.initializeElements();
        this.setupEventListeners();
        this.setupMaterialSelector();
        this.populateAddonDropdown();
        
        // Initialize calculator state with UI values
        this.initializeCalculatorState();
    }

    initializeElements() {
        // Input elements
        this.lengthInput = document.getElementById('length');
        this.widthInput = document.getElementById('width');
        this.unitSelect = document.getElementById('unit');
        this.materialContainer = document.querySelector('.custom-select');
        this.rate1Input = document.getElementById('rate1');
        this.rate2Input = document.getElementById('rate2');
        this.addonSelect = document.getElementById('addon-select');
        this.selectedAddonsContainer = document.getElementById('selected-addons');

        // Output elements
        this.totalSqFtOutput = document.getElementById('total-sqft');
        this.total1Output = document.getElementById('total1');
        this.total2Output = document.getElementById('total2');
        this.breakdown1Output = document.getElementById('breakdown1');
        this.breakdown2Output = document.getElementById('breakdown2');
    }

    setupMaterialSelector() {
        this.materialSelector = new MaterialSelector(
            this.materialContainer,
            CONFIG.materials,
            (material) => {
                this.calculator.setMaterial(material.id);
                this.rate1Input.value = this.calculator.rate1;
                this.updateCalculations();
            }
        );
    }

    initializeCalculatorState() {
        // Set initial unit
        this.calculator.setUnit(this.unitSelect.value);
        
        // Set initial dimensions if they exist
        if (this.lengthInput.value || this.widthInput.value) {
            this.calculator.setDimensions(
                this.lengthInput.value,
                this.widthInput.value
            );
        }
        
        // Set initial material if selected
        const selectedMaterial = this.materialSelector.getSelectedMaterial();
        if (selectedMaterial) {
            this.calculator.setMaterial(selectedMaterial.id);
            this.rate1Input.value = this.calculator.rate1;
        }
        
        // Set initial rates if they exist
        if (this.rate1Input.value) {
            this.calculator.setRate1(this.rate1Input.value);
        }
        if (this.rate2Input.value) {
            this.calculator.setRate2(this.rate2Input.value);
        }
        
        // Update calculations
        this.updateCalculations();
    }

    setupEventListeners() {
        // Unit selection
        this.unitSelect.addEventListener('change', () => {
            this.calculator.setUnit(this.unitSelect.value);
            this.updateCalculations();
        });

        // Size inputs
        this.lengthInput.addEventListener('input', () => {
            this.calculator.setDimensions(this.lengthInput.value, this.widthInput.value);
            this.updateCalculations();
        });

        this.widthInput.addEventListener('input', () => {
            this.calculator.setDimensions(this.lengthInput.value, this.widthInput.value);
            this.updateCalculations();
        });

        // Rate inputs
        this.rate1Input.addEventListener('input', () => {
            this.calculator.setRate1(this.rate1Input.value);
            this.updateCalculations();
        });

        this.rate2Input.addEventListener('input', () => {
            this.calculator.setRate2(this.rate2Input.value);
            this.updateCalculations();
        });

        // Add-on selection
        this.addonSelect.addEventListener('change', () => {
            if (this.addonSelect.value) {
                const [type, id] = this.addonSelect.value.split(':');
                this.addAddon(type, id);
                this.addonSelect.value = ''; // Reset selection
            }
        });
    }

    formatNumber(number) {
        return new Intl.NumberFormat('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    populateAddonDropdown() {
        // Add per square foot add-ons
        const perSqFtOptgroup = document.createElement('optgroup');
        perSqFtOptgroup.label = 'Per Square Foot Add-ons';
        CONFIG.addons.perSquareFoot.forEach(addon => {
            const option = document.createElement('option');
            option.value = `perSquareFoot:${addon.id}`;
            option.textContent = `${addon.name} (PHP ${this.formatNumber(addon.rate)} per sq ft)`;
            perSqFtOptgroup.appendChild(option);
        });
        this.addonSelect.appendChild(perSqFtOptgroup);

        // Add per piece add-ons
        const perPieceOptgroup = document.createElement('optgroup');
        perPieceOptgroup.label = 'Per Piece Add-ons';
        CONFIG.addons.perPiece.forEach(addon => {
            const option = document.createElement('option');
            option.value = `perPiece:${addon.id}`;
            option.textContent = `${addon.name} (PHP ${this.formatNumber(addon.rate)} per piece)`;
            perPieceOptgroup.appendChild(option);
        });
        this.addonSelect.appendChild(perPieceOptgroup);
    }

    addAddon(type, addonId) {
        const addonList = CONFIG.addons[type];
        const addon = addonList.find(a => a.id === addonId);
        if (!addon) return;

        const addonElement = document.createElement('div');
        addonElement.className = 'selected-addon';
        addonElement.dataset.type = type;
        addonElement.dataset.id = addonId;

        const addonInfo = document.createElement('div');
        addonInfo.className = 'addon-info';

        const addonName = document.createElement('div');
        addonName.className = 'addon-name';
        addonName.textContent = addon.name;

        const addonType = document.createElement('div');
        addonType.className = 'addon-type';
        addonType.textContent = type === 'perSquareFoot' ? 'Per Square Foot' : 'Per Piece';

        addonInfo.appendChild(addonName);
        addonInfo.appendChild(addonType);

        const addonControls = document.createElement('div');
        addonControls.className = 'addon-controls';

        if (type === 'perSquareFoot') {
            // Per square foot add-on controls
            const rateGroup = document.createElement('div');
            rateGroup.className = 'addon-control-group';

            const rateLabel = document.createElement('label');
            rateLabel.textContent = 'Rate (PHP/sq ft):';
            rateLabel.htmlFor = `rate-${addonId}`;

            const rateInput = document.createElement('input');
            rateInput.type = 'number';
            rateInput.id = `rate-${addonId}`;
            rateInput.value = addon.rate;
            rateInput.min = '0';
            rateInput.step = '0.01';
            rateInput.addEventListener('input', () => {
                this.calculator.updateAddonRate(type, addonId, rateInput.value);
                this.updateCalculations();
            });

            rateGroup.appendChild(rateLabel);
            rateGroup.appendChild(rateInput);
            addonControls.appendChild(rateGroup);
        } else {
            // Per piece add-on controls
            const rateGroup = document.createElement('div');
            rateGroup.className = 'addon-control-group';

            const rateLabel = document.createElement('label');
            rateLabel.textContent = 'Price per piece (PHP):';
            rateLabel.htmlFor = `rate-${addonId}`;

            const rateInput = document.createElement('input');
            rateInput.type = 'number';
            rateInput.id = `rate-${addonId}`;
            rateInput.value = addon.rate;
            rateInput.min = '0';
            rateInput.step = '0.01';
            rateInput.addEventListener('input', () => {
                this.calculator.updateAddonRate(type, addonId, rateInput.value);
                this.updateCalculations();
            });

            const qtyGroup = document.createElement('div');
            qtyGroup.className = 'addon-control-group';

            const qtyLabel = document.createElement('label');
            qtyLabel.textContent = 'Quantity:';
            qtyLabel.htmlFor = `qty-${addonId}`;

            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.id = `qty-${addonId}`;
            qtyInput.value = 1;
            qtyInput.min = '1';
            qtyInput.step = '1';
            qtyInput.addEventListener('input', () => {
                this.calculator.updateAddonQuantity(type, addonId, qtyInput.value);
                this.updateCalculations();
            });

            rateGroup.appendChild(rateLabel);
            rateGroup.appendChild(rateInput);
            qtyGroup.appendChild(qtyLabel);
            qtyGroup.appendChild(qtyInput);

            addonControls.appendChild(rateGroup);
            addonControls.appendChild(qtyGroup);
        }

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-addon';
        removeButton.innerHTML = '×';
        removeButton.addEventListener('click', () => {
            this.calculator.toggleAddon(type, addonId, false);
            addonElement.remove();
            this.updateCalculations();
        });

        addonElement.appendChild(addonInfo);
        addonElement.appendChild(addonControls);
        addonElement.appendChild(removeButton);

        this.selectedAddonsContainer.appendChild(addonElement);
        this.calculator.toggleAddon(type, addonId, true, addon.rate);
        this.updateCalculations();
    }

    updateCalculations() {
        const results = this.calculator.calculate();

        // Update total area with current unit
        this.totalSqFtOutput.textContent = this.calculator.formatDimension(results.totalSquareFeet);

        // Update totals
        this.total1Output.textContent = this.calculator.formatNumber(results.total1);
        this.total2Output.textContent = this.calculator.formatNumber(results.total2);

        // Update breakdowns
        this.breakdown1Output.innerHTML = results.breakdown1
            .map(line => `<div>${line}</div>`)
            .join('');
        this.breakdown2Output.innerHTML = results.breakdown2
            .map(line => `<div>${line}</div>`)
            .join('');
    }
}

// Initialize the UI when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UI();
}); 