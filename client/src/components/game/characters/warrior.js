import Being from './being';

export default class Warrior extends Being {
    constructor(data) {
        data.type = 'Warrior';
        super(data);
        this.armorCapacity = 4;
    }

    attack(data) {
        // armor can mitigate an attack, as well as strength and to a lesser extent dexterity.
        console.log('data in warrior attack:::', data);
        super.attack(data);
    }

    heal(data) {
        console.log('data in warrior heal:::', data);
        super.heal(data);
    }
}
