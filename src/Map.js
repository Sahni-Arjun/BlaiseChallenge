import * as React from 'react';
import { PureComponent, Component } from 'react';
import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl';
import loadAndAllocate from './Objects';


import PASSENGERS from './passengers.json';
import STOPS from './stops.json';

let transitData = loadAndAllocate(PASSENGERS, STOPS);
let busStops = transitData.stops;
let connections = transitData.connections;



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



const cord1 = [[-73.568, 45.509], [-73.5664, 45.512]]
const cord2 = [[-73.868, 45.809], [-73.8664, 45.812]]

class Line extends Component {
    data = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: this.props.coordinates
        }
    };

    render() {
        return (
            <div>
                <Source id='route' type='geojson' data={this.data} />
                <Layer
                    id={this.props.id}
                    type='line'
                    source='route'
                    layout={{
                        'line-join': 'round',
                        'line-cap': 'round'
                    }}
                    paint={{
                        'line-color': '#FF5733 ',
                        'line-width': 7
                    }}
                />
            </div>
        );
    }
}

class AllLines extends PureComponent {

    render() {
        return this.props.connections.map(
            connection => <Line coordinates={connection} />
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
                <Line coordinates={cord1} id={1} />
                <Line coordinates={cord2} id={2} />


            </ReactMapGL>
        );
    }
}

export default Map;