export default class Being {
    constructor(data) {
        console.log('data in Being constructor:::', data);
        const { armor, str, int, dex, vit, race, type, name } = data

        this.races = [
            'Human',
            'Elf',
            'Dwarf',
            'Orc',
            'Hobbit',
            'Vulpera',
            'Slitherin'
        ];

        if (this.races.includes(race)) this.race = race;
        else this.race = 'human';

        this.stats = {
            armor,
            vitality: vit,
            strength: str,
            intellect: int,
            dexterity: dex,
            haste: 0,
            mastery: 0,
            versatility: 0,
            critical: 0
        };

        this.name = name;
        this.type = type;
        
        this.equipment = [];
    }

    getStats() {
        return this.stats;
    }

    setStat(data) {
        const isValid = Object.keys(this.stats).includes(Object.keys(data)[0]);
        
        if (isValid) {
            this.stats = {
                ...this.stats,
                ...data
            }
        }
    }

    attack(data) {
        // this is what happens to this being when another being attacks 
        console.log('data in being attack:::', data);
    }

    heal(data) {
        console.log('data in being heal:::', data);

    }
    
    equip(item) {
        if (item.armorLimiter > this.armorCapacity) return;
        // maybe later this can return an error message "You can't wear that!!"

        this.equipment.push(item);
        for (const key in item.stats) {
            if (Object.hasOwnProperty.call(item.stats, key)) {
                const element = item.stats[key];
                const newValue = this.stats[key] + element;
                this.setStat({ [key]: newValue });
            }
        }

        console.log('item:::', item);
        console.log('this.getStats():::', this.getStats());
    }

    unequip(item) {
        const index = this.equipment.findIndex(e => e.name === item.name);
        this.equipment.splice(index, 1);
        for (const key in item.stats) {
            if (Object.hasOwnProperty.call(item.stats, key)) {
                const element = item.stats[key];
                const newValue = this.stats[key] - element;
                this.setStat({ [key]: newValue });
            }
        }
    }

    getEquipment() {
        return this.equipment;
    }
}
