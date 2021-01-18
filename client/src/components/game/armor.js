export default class Armor {
    constructor(data) {
        this.name = data.name;
        this.anatomy = data.anatomy;
        this.material = data.material;
        this.armorMultiplier = 1;
        this.armorLimiter = 1;
        this.stats = data.stats;
        this.setArmorMeta();
    }
    
    setArmorMeta() {
        switch (this.material) {
            case 'plate':
                this.armorMultiplier = 4;
                this.armorLimiter = 4;
                break;
            case 'mail':
                this.armorMultiplier = 2.6;
                this.armorLimiter = 3;
                break;
            case 'leather':
                this.armorMultiplier = 1.6;
                this.armorLimiter = 2;
                break;
            default:
                // default is cloth
                this.armorMultiplier = 1;
                this.armorLimiter = 1;
        }
    }
    
    onEquip() {

    }

    onUse() {

    }
}