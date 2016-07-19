import Ember from 'ember';
import MapStylesMixin from 'address-book/mixins/map-styles';

export default Ember.Component.extend(MapStylesMixin, {
  init() {
    this._super(...arguments);

    this.setProperties({
      mapData: {
        lat: 45,
        lng: -110
      },
      mapSettings: {
        zoom: 4,
        showZoomControl: false,
        showMapTypeControl: false,
        styles: this.get('styles')
      }
    });
  },

  markers: [],

  actions: {
    showOnMap(address) {
      Ember.setProperties(this.get('mapData'), {
        lat: address.marker.lat,
        lng: address.marker.lng
      });

      Ember.setProperties(this.get('mapSettings'), {
        zoom: 18
      });
    },

    city() {
      Ember.setProperties(this.get('mapSettings'), {
        zoom: 14
      });
    },

    street() {
      Ember.setProperties(this.get('mapSettings'), {
        zoom: 18
      });
    },

    fitMap() {
      Ember.run.later((() => {
        let markers = this.get('markers');
        let map = this.get('map');
        let bounds = new google.maps.LatLngBounds();

        for (let i = 0; i < markers.length; i++) {
          let googleMarker = new google.maps.Marker({
            position: {
              lat: markers[i].lat,
              lng: markers[i].lng
            },
            setMap: map
          });

          bounds.extend(googleMarker.getPosition());
        }

        bounds.j.H -= 100;
        bounds.j.j += 50;

        map.fitBounds(bounds);
      }), 1000);
    }
  }
});
