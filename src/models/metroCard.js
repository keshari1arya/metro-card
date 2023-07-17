const charges = require('../enum/charges');
const PassengerType = require('../enum/passengerType');

class MetroCard {
    constructor(cardNumber, balance) {
        this.cardNumber = cardNumber;
        this.balance = balance;
        this.lastStation = '';
    }

    deductBalance(amount, station, isWithDiscount = false) {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.lastStation = station;
            if (isWithDiscount) this.lastStation = '';
            return true;
        }
        return false;
    }

    addBalance(amount) {
        this.balance += amount;
    }

    getBalance() {
        return this.balance;
    }

    getLastStation() {
        return this.lastStation;
    }

    hasRequiredBalance(passengerType) {
        return this.balance >= charges[passengerType];
    }
}

module.exports = MetroCard;
