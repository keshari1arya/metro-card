const charges = require('../enum/charges');
const PassengerType = require('../enum/passengerType');
const MetroCard = require('./metroCard');

class Station {
    constructor(name) {
        this.name = name;
        this.amountCollected = 0;
        this.discountGiven = 0;
        this.passengerCount = new Map();
        this.passengerCount.set(PassengerType.ADULT, 0);
        this.passengerCount.set(PassengerType.KID, 0);
        this.passengerCount.set(PassengerType.SENIOR_CITIZEN, 0);
    }

    rechargeCard(metroCard, amount) {
        metroCard.addBalance(amount);
        amount = amount * 0.02;
        this.amountCollected += amount;
    }

    getEarning() {
        return this.amountCollected;
    }

    swipeCard(metroCard, passengerType) {
        this.passengerCount.set(passengerType, this.passengerCount.get(passengerType) + 1);
        let amount = charges[passengerType];
        const isDiscountEligible = metroCard.getLastStation() != this.name && metroCard.getLastStation() != '';
        if (isDiscountEligible) {
            amount = amount * 0.5;
            this.discountGiven += amount;
        }

        if (!metroCard?.hasRequiredBalance(passengerType)) {
            this.rechargeCard(metroCard, amount - metroCard.getBalance());
        }

        this.amountCollected += amount;
        metroCard.deductBalance(amount, this.name, isDiscountEligible);
    }

    getTotalDiscountGiven() {
        return this.discountGiven;
    }

    getPassengerCounts() {
        return Array.from(this.passengerCount, ([key, value]) => ({ type: key, count: value }))
            .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
    }
}

module.exports = Station;
