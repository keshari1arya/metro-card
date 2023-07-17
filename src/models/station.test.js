const charges = require('../enum/charges');
const PassengerType = require('../enum/passengerType');
const MetroCard = require('./metroCard');
const Station = require('./station');

describe('Station', () => {
    let station;
    let metroCard;

    beforeEach(() => {
        station = new Station('AIRPORT');
        metroCard = new MetroCard('MC1', 100);
    });

    describe('rechargeCard', () => {
        it('should add amount to the metro card and increment the amountCollected by 2% of the recharge amount', () => {
            station.rechargeCard(metroCard, 50);
            expect(metroCard.getBalance()).toBe(150);
            expect(station.getEarning()).toBe(1);
        });
    });

    describe('swipeCard', () => {
        it('should add charges to the amountCollected based on the passenger type and deduct from the metro card balance', () => {
            station.swipeCard(metroCard, PassengerType.ADULT);
            expect(metroCard.getBalance()).toBe(0);
            expect(station.getEarning()).toBe(202);
        });

        it('should add half the charges and set isDiscounted true when the same card is swiped at different stations', () => {
            station.swipeCard(metroCard, PassengerType.KID);
            expect(metroCard.getBalance()).toBe(50);
            expect(station.getEarning()).toBe(50);
            expect(station.getTotalDiscountGiven()).toBe(0);

            const grandCentral = new Station('GRAND_CENTRAL');
            grandCentral.swipeCard(metroCard, PassengerType.ADULT);
            expect(metroCard.getBalance()).toBe(0);
            expect(grandCentral.getEarning()).toBe(101);
            expect(grandCentral.getTotalDiscountGiven()).toBe(100);
            expect(metroCard.getLastStation()).toBe('');
        });

        it('should recharge card when the balance is insufficient for passenger type', () => {
            metroCard.deductBalance(100, 'JUNCTION', false);
            station.swipeCard(metroCard, PassengerType.ADULT);
            expect(metroCard.getBalance()).toBe(0);
            expect(station.getEarning()).toBe(102);
        });

        it('should update passenger count for different types of passengers', () => {
            station.swipeCard(metroCard, PassengerType.ADULT);
            station.swipeCard(metroCard, PassengerType.KID);
            station.swipeCard(metroCard, PassengerType.KID);
            station.swipeCard(metroCard, PassengerType.SENIOR_CITIZEN);
            expect(station.getPassengerCounts()).toEqual([
                { type: PassengerType.KID, count: 2 },
                { type: PassengerType.ADULT, count: 1 },
                { type: PassengerType.SENIOR_CITIZEN, count: 1 },
            ]);
        });
    });
    describe('getTotalDiscountGiven', function () {
        let station;
        let card;

        beforeEach(function () {
            station = new Station('Grand Central');
            card = new MetroCard('MC1', 100);
        });

        it('should return 0 when no discounts have been given', function () {
            station.swipeCard(card, PassengerType.ADULT);
            expect(station.getTotalDiscountGiven()).toBe(0);
        });

        it('should return total discount given across all swipes', function () {
            // swipe with discount eligible
            station.swipeCard(card, PassengerType.ADULT);
            expect(station.getTotalDiscountGiven()).toBe(0);

            // swipe without discount eligible
            station.swipeCard(card, PassengerType.ADULT);
            expect(station.getTotalDiscountGiven()).toBe(0);

            // swipe with discount eligible for a different passenger type
            station.swipeCard(card, PassengerType.SENIOR_CITIZEN);
            expect(station.getTotalDiscountGiven()).toBe(0);
        });
    });

});