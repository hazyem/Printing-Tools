class Calculator {
    constructor() {
        this.length = 0;
        this.width = 0;
        this.selectedMaterial = null;
        this.rate1 = 0;
        this.rate2 = 0;
        this.selectedAddons = {
            perSquareFoot: new Map(),
            perPiece: new Map()
        };
        this.unit = 'ft'; // Default unit
    }

    // Unit conversion constants
    static UNIT_CONVERSIONS = {
        ft: 1,
        in: 1/12,
        cm: 0.0328084,
        mm: 0.00328084
    };

    setUnit(unit) {
        this.unit = unit;
        // Recalculate with new unit
        this.setDimensions(this.length, this.width);
    }

    setDimensions(length, width) {
        // Convert input values to feet for internal calculations
        const conversionFactor = Calculator.UNIT_CONVERSIONS[this.unit];
        this.length = (parseFloat(length) || 0) * conversionFactor;
        this.width = (parseFloat(width) || 0) * conversionFactor;
    }

    setMaterial(materialId) {
        this.selectedMaterial = CONFIG.materials.find(m => m.id === materialId) || null;
        if (this.selectedMaterial) {
            this.rate1 = this.selectedMaterial.baseRate;
        }
    }

    setRate1(rate) {
        this.rate1 = parseFloat(rate) || 0;
    }

    setRate2(rate) {
        this.rate2 = parseFloat(rate) || 0;
    }

    toggleAddon(type, addonId, isSelected, customRate = null) {
        const addonList = CONFIG.addons[type];
        const addon = addonList.find(a => a.id === addonId);
        
        if (!addon) return;

        if (isSelected) {
            this.selectedAddons[type].set(addonId, {
                ...addon,
                rate: customRate !== null ? parseFloat(customRate) : addon.rate,
                quantity: type === 'perPiece' ? 1 : undefined // Default quantity for per-piece add-ons
            });
        } else {
            this.selectedAddons[type].delete(addonId);
        }
    }

    updateAddonRate(type, addonId, rate) {
        if (this.selectedAddons[type].has(addonId)) {
            const addon = this.selectedAddons[type].get(addonId);
            addon.rate = parseFloat(rate) || 0;
            this.selectedAddons[type].set(addonId, addon);
        }
    }

    updateAddonQuantity(type, addonId, quantity) {
        if (type === 'perPiece' && this.selectedAddons[type].has(addonId)) {
            const addon = this.selectedAddons[type].get(addonId);
            addon.quantity = Math.max(1, parseInt(quantity) || 1);
            this.selectedAddons[type].set(addonId, addon);
        }
    }

    calculateTotalSquareFeet() {
        return this.length * this.width;
    }

    calculateAddons(totalSqFt) {
        let total = 0;
        
        // Calculate per square foot add-ons
        for (const addon of this.selectedAddons.perSquareFoot.values()) {
            total += addon.rate * totalSqFt;
        }
        
        // Calculate per piece add-ons
        for (const addon of this.selectedAddons.perPiece.values()) {
            total += addon.rate * addon.quantity;
        }
        
        return total;
    }

    getBreakdown(baseRate, totalSqFt) {
        const breakdown = [];
        
        // Base calculation
        breakdown.push(`Base: ${this.formatDimension(totalSqFt)} × PHP ${this.formatNumber(baseRate)} = PHP ${this.formatNumber(totalSqFt * baseRate)}`);
        
        // Add-ons breakdown
        for (const addon of this.selectedAddons.perSquareFoot.values()) {
            const addonTotal = addon.rate * totalSqFt;
            breakdown.push(`${addon.name}: ${this.formatDimension(totalSqFt)} × PHP ${this.formatNumber(addon.rate)} = PHP ${this.formatNumber(addonTotal)}`);
        }
        
        for (const addon of this.selectedAddons.perPiece.values()) {
            const addonTotal = addon.rate * addon.quantity;
            breakdown.push(`${addon.name}: ${addon.quantity} pc × PHP ${this.formatNumber(addon.rate)} = PHP ${this.formatNumber(addonTotal)}`);
        }
        
        return breakdown;
    }

    formatDimension(value) {
        // Convert back to selected unit for display
        const conversionFactor = 1 / Calculator.UNIT_CONVERSIONS[this.unit];
        const convertedValue = value * conversionFactor;
        return `${this.formatNumber(convertedValue)} ${this.unit}`;
    }

    formatNumber(number) {
        return new Intl.NumberFormat('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    calculate() {
        const totalSqFt = this.calculateTotalSquareFeet();
        const addonsTotal = this.calculateAddons(totalSqFt);
        
        const total1 = (this.rate1 * totalSqFt) + addonsTotal;
        const total2 = this.rate2 ? (this.rate2 * totalSqFt) + addonsTotal : 0;
        
        return {
            totalSquareFeet: totalSqFt,
            total1: total1,
            total2: total2,
            breakdown1: this.getBreakdown(this.rate1, totalSqFt),
            breakdown2: this.rate2 ? this.getBreakdown(this.rate2, totalSqFt) : []
        };
    }
} 