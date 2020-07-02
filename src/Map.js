import * as React from 'react';
import { PureComponent, Component } from 'react';
import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl';
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

const data = {
    type: 'Feature',
    geometry: {
        type: 'LineString',
        coordinates: [
            [-122.48369693756104, 37.83381888486939],
            [-122.48348236083984, 37.83317489144141],
            [-122.48339653015138, 37.83270036637107],
            [-122.48356819152832, 37.832056363179625],
            [-122.48404026031496, 37.83114119107971],
            [-122.48404026031496, 37.83049717427869],
            [-122.48348236083984, 37.829920943955045],
            [-122.48356819152832, 37.82954808664175],
            [-122.48507022857666, 37.82944639795659],
            [-122.48610019683838, 37.82880236636284],
            [-122.48695850372314, 37.82931081282506],
            [-122.48700141906738, 37.83080223556934],
            [-122.48751640319824, 37.83168351665737],
            [-122.48803138732912, 37.832158048267786],
            [-122.48888969421387, 37.83297152392784],
            [-122.48987674713133, 37.83263257682617],
            [-122.49043464660643, 37.832937629287755],
            [-122.49125003814696, 37.832429207817725],
            [-122.49163627624512, 37.832564787218985],
            [-122.49223709106445, 37.83337825839438],
            [-122.49378204345702, 37.83368330777276]
        ]
    }
};

const cord = [[-73.568, 45.509], [-73.5664, 45.512]]

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
                    id='route'
                    type='line'
                    source='route'
                    layout={{
                        'line-join': 'round',
                        'line-cap': 'round'
                    }}
                    paint={{
                        'line-color': '#FF5733 ',
                        'line-width': 3
                    }}
                />
            </div>
        );
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
                <Line coordinates={cord} />

            </ReactMapGL>
        );
    }
}

export default Map;