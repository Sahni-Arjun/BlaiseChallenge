function BusStop(lat, lon) {
    this.lat = lat;
    this.lon = lon;
    this.passengers = [];
    this.distance = function (lat, lon) {
        return Math.sqrt((this.lat - lat) ** 2 + (this.lon - lon) ** 2);
    };
    this.addPassenger = function (Passenger) {
        this.passengers.push(Passenger);
    }
}

function Passenger(lat, lon) {
    this.lat = lat;
    this.lon = lon;
}

/**
 * allocates the passengers to the closest bus stop
 * @param {*} busStops, a list of BusStop objects
 * @param {*} Passengers , a list of Passenger objects
 */
function allocatePassengers(busStops, passengers) {

    for (let i = 0; i < passengers.length; i++) {
        let p = passengers[i];
        let min = 0;
        let minDist = Infinity;
        for (let j = 0; j < busStops.length; j++) {
            let dist = busStops[j].distance(p.lat, p.lon);
            if (dist < minDist) {
                min = j;
                minDist = dist;
            }
        }
        busStops[min].addPassenger(p);
    }

}

export default function loadAndAllocate(passengerData, busData) {
    let passengers = []
    let busStops = []
    passengerData.map(
        stop => passengers.push(new Passenger(stop.lat, stop.lon))
    );
    busData.map(
        stop => busStops.push(new BusStop(stop.lat, stop.lon))
    )
    allocatePassengers(busStops, passengers)
    return busStops;

}


