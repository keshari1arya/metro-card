const PassengerType = require("./enum/passengerType");
const Main = require("./main");
const MetroCard = require("./models/metroCard");

describe('Main', () => {
    let main;
    let consoleLogSpy;

    beforeEach(() => {
        main = new Main([]);
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    it('should create a new MetroCard with the specified balance', () => {
        const commands = ['BALANCE MC1 100'];
        main = new Main(commands);
        expect(main['metroCards'].length).toBe(1);
        expect(main['metroCards'][0]).toEqual(new MetroCard('MC1', 100));
    });

    it('should check in a passenger at a station with the correct passenger type and deduct the correct fare', () => {
        const commands = ['BALANCE MC1 100', 'CHECK_IN MC1 ADULT AIRPORT'];
        main = new Main(commands);
        const station = main['stations'][0];
        const metroCard = main['metroCards'][0];

        expect(station.getPassengerCounts().find(x => x.type === PassengerType.ADULT)?.count).toBe(1);
        expect(metroCard.getBalance()).toBe(0);
        expect(station.getEarning()).toBe(202);
    });

    it('should print a summary of the station earnings and passenger type summary', () => {
        const commands = [
            'BALANCE MC1 100',
            'BALANCE MC2 200',
            'CHECK_IN MC1 ADULT AIRPORT',
            'CHECK_IN MC2 KID AIRPORT',
            'CHECK_IN MC2 ADULT CENTRAL',
            'PRINT_SUMMARY',
        ];
        main = new Main(commands);

        expect(consoleLogSpy).toHaveBeenCalledWith('TOTAL_COLLECTION AIRPORT 252 0');
        expect(consoleLogSpy).toHaveBeenCalledWith('PASSENGER_TYPE_SUMMARY');
        expect(consoleLogSpy).toHaveBeenCalledWith('ADULT 1');
        expect(consoleLogSpy).toHaveBeenCalledWith('KID 1');
    });
});
