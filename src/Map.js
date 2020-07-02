import * as React from 'react';
import { PureComponent, Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import loadAndAllocate from './Objects';


import PASSENGERS from './passengers.json';
import STOPS from './stops.json';

let busStops = loadAndAllocate(PASSENGERS, STOPS);


let lat = 0;
let lon = 0;


for (let i = 0; i < PASSENGERS.length; i++) {
    lat = lat + PASSENGERS[i].lat;
    lon = lon + PASSENGERS[i].lon;
}

lon = lon / PASSENGERS.length
lat = lat / PASSENGERS.length


class PassMarkers extends PureComponent {
    render() {
        const { data } = this.props;
        return data.map(
            passenger => <Marker longitude={passenger.lon} latitude={passenger.lat} ><img src="../passenger.ico" alt="P" /></Marker>
        )
    }
}

export class BusButton extends Component {
    constructor(props) {
        super(props);
        this.state = { isHoverOn: false };

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    show() {
        if (this.state.isHoverOn) {
            return this.props.passengers;
        }
    }

    handleMouseEnter() {
        this.setState(state => ({
            isHoverOn: true
        }));
    }

    handleMouseLeave() {
        this.setState(state => ({
            isHoverOn: false
        }));
    }

    render() {
        return (<button
            onMouseEnter={() => this.handleMouseEnter()}
            onMouseLeave={() => this.handleMouseLeave()}>
            <img src="../bus.ico" alt="S" />
            <div>{this.show()}</div>
        </button>);

    }

}




class BusMarkers extends Component {


    render() {
        const { data } = this.props;
        return data.map(
            stop => <Marker longitude={stop.lon} latitude={stop.lat} >
                <BusButton passengers={stop.passengers.length} />
            </Marker>
        )
    }
}


class Map extends PureComponent {

    state = {
        viewport: {
            zoom: 15,
        }
    };


    render() {
        return (
            <ReactMapGL

                latitude={lat}
                longitude={lon}
                width="100vw"
                height="100vh"
                mapStyle="mapbox://styles/mapbox/dark-v9"
                mapboxApiAccessToken={'pk.eyJ1IjoidGhlYmxhZGVvZmFzaCIsImEiOiJja2M0dTZoMHAwYmoxMnFwMjhtMjlsbjFhIn0.-Hig8RNuZegvCdZq8yig7g'}
                {...this.state.viewport}

                onViewportChange={viewport => this.setState({ viewport })}
            >
                <PassMarkers data={PASSENGERS} />
                <BusMarkers data={busStops} />

            </ReactMapGL>
        );
    }
}

export default Map;