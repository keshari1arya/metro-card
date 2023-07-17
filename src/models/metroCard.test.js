const MetroCard = require('./metroCard');
const PassengerType = require('../enum/passengerType');

describe('MetroCard', () => {
  let card;

  beforeEach(() => {
    card = new MetroCard('123456789', 50);
  });

  describe('deductBalance', () => {
    it('should deduct balance and set last station when balance is sufficient', () => {
      const success = card.deductBalance(5, 'Central');
      expect(success).toBe(true);
      expect(card.getBalance()).toBe(45);
      expect(card.getLastStation()).toBe('Central');
    });

    it('should deduct balance without setting last station when isWithDiscount is true', () => {
      const success = card.deductBalance(5, 'Central', true);
      expect(success).toBe(true);
      expect(card.getBalance()).toBe(45);
      expect(card.getLastStation()).toBe('');
    });

    it('should not deduct balance when balance is insufficient', () => {
      const success = card.deductBalance(70, 'Central');
      expect(success).toBe(false);
      expect(card.getBalance()).toBe(50);
      expect(card.getLastStation()).toBe('');
    });
  });

  describe('addBalance', () => {
    it('should add balance to the card', () => {
      card.addBalance(10);
      expect(card.getBalance()).toBe(60);
    });
  });

  describe('hasRequiredBalance', () => {
    it('should return true when balance is sufficient for passenger type', () => {
      expect(card.hasRequiredBalance(PassengerType.KID)).toBe(true);
    });

    it('should return false when balance is insufficient for passenger type', () => {
      expect(card.hasRequiredBalance(PassengerType.ADULT)).toBe(false);
    });
  });
});
