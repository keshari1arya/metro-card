const charges = require('./enum/charges');
const PassengerType = require('./enum/passengerType');
const MetroCard = require('./models/metroCard');
const Station = require('./models/station');
const CommandType = require('./enum/commandType')

module.exports = class Main {
    constructor(commands) {
        this.metroCards = [];
        this.stations = [];
        for (let item of commands) {
            const command = item.split(' ');
            switch (command[0]) {
                case CommandType.BALANCE:
                    this.metroCards.push(new MetroCard(command[1], +command[2]));
                    break;
                case CommandType.CHECK_IN:
                    let station = this.getStation(command[3]);
                    let metroCard = this.getMetroCard(command[1]);
                    const passengerType = PassengerType[command[2]];

                    station.swipeCard(metroCard, passengerType);
                    break;
                case CommandType.PRINT_SUMMARY:
                    this.printSummary();
                    break;
                default:
                    break;
            }
        }
    }

    printSummary() {
        this.stations = this.stations.sort((a, b) => b.name.localeCompare(a.name))
        for (let station of this.stations) {
            // console.log(`TOTAL_COLLECTION ${station.name} ${station.getEarning()} ${station.getTotalDiscountGiven()}`);
            console.log('TOTAL_COLLECTION ' + station.name + ' ' + station.getEarning() + ' ' + station.getTotalDiscountGiven());


            console.log('PASSENGER_TYPE_SUMMARY');
            for (let item of station.getPassengerCounts()) {
                if (item.count)
                
                    console.log(`${item.type} ${item.count}`);
            }
        }
    }

    getStation(name) {
        let station = this.stations.find(x => x.name == name);
        if (station) {
            return station;
        }
        station = new Station(name);
        this.stations.push(station);
        return station;
    }

    getMetroCard(cardNumber) {
        let card = this.metroCards.find(x => x.cardNumber == cardNumber);
        if (card) {
            return card;
        }
        card = new MetroCard(cardNumber, 0);
        this.metroCards.push(card);
        return card;
    }
}
