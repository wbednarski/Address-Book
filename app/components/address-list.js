import Ember from 'ember';
import {uuid} from 'ember-cli-uuid';

export default Ember.Component.extend({
  loadAddresses: function () {
    let addresses = this.get('api').load().addresses;
    addresses.map(address => {
      let location = this.standardGeocode(`${address.address_1} ${address.address_2} ${address.zipcode} ${address.city} ${address.state} ${address.country}`);
      location.then((data) => {
        let id = uuid();
        address.id = id;
        address.marker = data;
        this.get('markers').pushObject({
          id: id,
          lat: data.lat,
          lng: data.lng,
          click: function(e) {
            $(`#id-${e.id}`).trigger('click');
          },
          // mouseover: function(event, marker) {},
          // mouseout: function(event, marker) {},
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABPtJREFUaAXtmFtoHFUYx7O7TVKNTUzy1M2Kwc1lY0C0D9EKUkXFF98KFRVq8QL64INQCu2bIBIEqygotCoo4g3sk29afRAtLY2gJprNZXejIXghlyZtum6yWX9fyMDpzJ6Zc2Ym9CUDwznznf93/85lTkPDzrMTgUgRSETi9jIn+vr67oA8VK1WexOJxM0CoV3kneI9n8/nf4VUE3ocTywODAwM7F1bW3uxVqsdTiaTXQGGzYL7CAffKhaLfwdgA4cjOdDT09OMwScw6BiadgdquxZwFb7h5ubm4bGxscq1Q+ZfoR3I5XLdRPEMqu4yV+dF4sTFjY2Ng4VC4Q/vaDAllAPUeQ7jzxL9dLAKI8RsKpV6cHx8fMIIrYCsHejv708TsfPIyChyIneZ4DMEZWh6evofG2FJGzDYJMZ/Qhur8WIDpXQrGf2YrlVQrRygdJ5FwQFRuE3Pw+g4bCPb2FtZcYhSkSjtNVQwDe53wZK12+G7zZDvz9bW1uzIyMiaCX6XCWgLc8jEeGr5R/AvTUxMXFBlE4D9OPIGk/VulV6nf8vKyspB6J/VGfOQjEsI45/wcLsIZOjzdDp9wG28wKamps61t7ffR/dLF5vnEzmPe4gaglEJDQ4ONlUqlSVk3KCRI2WSZxW5s1QqlXUYoePgjS0tLb/QzepwyFphNWpnvKrDOHSjDJTL5T4YtMaLMErj1SDjBTc3N7dKmQ1LX/eQ7T1slFoHVT4jBxDYrTLV6zc2Nn5Vj16PRjYDsevr6931eN00IweI2E1uRvWblF/mPLOg0vz6ZOovxv/zw6Bzj9+4M2bkAAZecRg0rRzkUpoxD1nmFMRGz4BCMNC5iTZyAOS/imxPlxLbxQa0zzOgIXD0HmLIVzcZMDpS+ApR9P9G3/cnhKXvBQXv2wX7vC+A1Wd1dXU8ALM5bOQAa/gyKQ0S+BSb1SNBSnt7ex8F47un4OCorFZBsmTcyIFNYDL5TYDAJGk/Qyk9psPh4JOMfcHru/8g52udDDfdV5AKRvn9CP5Open6RPAH5sWnbGxSerJHDEKTqO/X8ah0sPfKzq3SdH1jBxCQIv0l2tiP0qpxOF3k70w2Md855/AYlxAMVSLznsO4XS2ZO4VsI+PFBhsHpBROM5kr22U8cssE6QMb+VYOcKczxzz40EaBDRbj39/uX8oGUjxMFtZtDDPBSmZ5XzPBqhirDAgjZ/0CTpxWhcTRR+a7Ya5WrB0QYzkpvky0Lsdh+JaMZUrzlTDyjA9gqvClpaUrnZ2dGyh9SKWH7VP7xycnJ78Nwx8qA6Kora3tJFnIh1Hq4hnNZDJvu2jGnzYbmUdoNpt9gNoNFbktYTWyKP/Q33uEGxJClZAje3FxsdTR0ZHBCOOjtMMrLRk8xZHhHZVm2w9dQo4ijDhKf9b5Nm1xeob3mCleh4vsAEvfJYQ/zWu8/QsWx4/IMV1nmCk9Ugk5ShYWFgrc+XQQ0aBLK4fldYyPZS+JnAHHIikHlsOfnW+f9ieuDk/4jFsNRVqF3Jq4eu9nk7vIyqS7xVjGyX1EX+5NY3liy4BYw2Evz4n1OZ1lGP9MnMaLnljmgGrw/Pz8KLu0XAveo9Ix/iTGv6nS4ujHmgHHoK6urqPMCfX38yzGR14yHflqG+scUAVzt9nJ/c8F5kOtqalpyObmTpVzXfv8Qw9wS5G7rkbsKN+JgH8E/gckSLWZA/hhwAAAAABJRU5ErkJggg==',
          opacity: 0.82
        });
      });

      addresses.map(address => address.localTime = '00:00');
      this.sendAction('fitMap');
    });

    this.set('addresses', addresses);

  }.on('init'),

  addresses: [],

  api: Ember.inject.service('address-api'),
  maps: Ember.inject.service('g-map'),

  standardGeocode(address) {
    return this.get('maps').geocode({address}).then((geocodes) => {
      return {
        lat: geocodes[0].geometry.location.lat(),
        lng: geocodes[0].geometry.location.lng()
      };
    }).catch((err) => console.error(err));
  },

  save() {
    let mapData = this.get('mapData');
    let address = this.normalizeData(mapData);
    let id = uuid();
    address.id = id;
    address.localTime = '00:00';
    this.get('addresses').pushObject(address);
    let addresses = this.get('addresses');
    this.get('api').save(addresses);
    this.get('markers').pushObject({
      id: id,
      lat: mapData.lat,
      lng: mapData.lng,
      // click: function(event, marker) {},
      // mouseover: function(event, marker) {},
      // mouseout: function(event, marker) {},
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABPtJREFUaAXtmFtoHFUYx7O7TVKNTUzy1M2Kwc1lY0C0D9EKUkXFF98KFRVq8QL64INQCu2bIBIEqygotCoo4g3sk29afRAtLY2gJprNZXejIXghlyZtum6yWX9fyMDpzJ6Zc2Ym9CUDwznznf93/85lTkPDzrMTgUgRSETi9jIn+vr67oA8VK1WexOJxM0CoV3kneI9n8/nf4VUE3ocTywODAwM7F1bW3uxVqsdTiaTXQGGzYL7CAffKhaLfwdgA4cjOdDT09OMwScw6BiadgdquxZwFb7h5ubm4bGxscq1Q+ZfoR3I5XLdRPEMqu4yV+dF4sTFjY2Ng4VC4Q/vaDAllAPUeQ7jzxL9dLAKI8RsKpV6cHx8fMIIrYCsHejv708TsfPIyChyIneZ4DMEZWh6evofG2FJGzDYJMZ/Qhur8WIDpXQrGf2YrlVQrRygdJ5FwQFRuE3Pw+g4bCPb2FtZcYhSkSjtNVQwDe53wZK12+G7zZDvz9bW1uzIyMiaCX6XCWgLc8jEeGr5R/AvTUxMXFBlE4D9OPIGk/VulV6nf8vKyspB6J/VGfOQjEsI45/wcLsIZOjzdDp9wG28wKamps61t7ffR/dLF5vnEzmPe4gaglEJDQ4ONlUqlSVk3KCRI2WSZxW5s1QqlXUYoePgjS0tLb/QzepwyFphNWpnvKrDOHSjDJTL5T4YtMaLMErj1SDjBTc3N7dKmQ1LX/eQ7T1slFoHVT4jBxDYrTLV6zc2Nn5Vj16PRjYDsevr6931eN00IweI2E1uRvWblF/mPLOg0vz6ZOovxv/zw6Bzj9+4M2bkAAZecRg0rRzkUpoxD1nmFMRGz4BCMNC5iTZyAOS/imxPlxLbxQa0zzOgIXD0HmLIVzcZMDpS+ApR9P9G3/cnhKXvBQXv2wX7vC+A1Wd1dXU8ALM5bOQAa/gyKQ0S+BSb1SNBSnt7ex8F47un4OCorFZBsmTcyIFNYDL5TYDAJGk/Qyk9psPh4JOMfcHru/8g52udDDfdV5AKRvn9CP5Open6RPAH5sWnbGxSerJHDEKTqO/X8ah0sPfKzq3SdH1jBxCQIv0l2tiP0qpxOF3k70w2Md855/AYlxAMVSLznsO4XS2ZO4VsI+PFBhsHpBROM5kr22U8cssE6QMb+VYOcKczxzz40EaBDRbj39/uX8oGUjxMFtZtDDPBSmZ5XzPBqhirDAgjZ/0CTpxWhcTRR+a7Ya5WrB0QYzkpvky0Lsdh+JaMZUrzlTDyjA9gqvClpaUrnZ2dGyh9SKWH7VP7xycnJ78Nwx8qA6Kora3tJFnIh1Hq4hnNZDJvu2jGnzYbmUdoNpt9gNoNFbktYTWyKP/Q33uEGxJClZAje3FxsdTR0ZHBCOOjtMMrLRk8xZHhHZVm2w9dQo4ijDhKf9b5Nm1xeob3mCleh4vsAEvfJYQ/zWu8/QsWx4/IMV1nmCk9Ugk5ShYWFgrc+XQQ0aBLK4fldYyPZS+JnAHHIikHlsOfnW+f9ieuDk/4jFsNRVqF3Jq4eu9nk7vIyqS7xVjGyX1EX+5NY3liy4BYw2Evz4n1OZ1lGP9MnMaLnljmgGrw/Pz8KLu0XAveo9Ix/iTGv6nS4ujHmgHHoK6urqPMCfX38yzGR14yHflqG+scUAVzt9nJ/c8F5kOtqalpyObmTpVzXfv8Qw9wS5G7rkbsKN+JgH8E/gckSLWZA/hhwAAAAABJRU5ErkJggg==',
      opacity: 0.82
    });
  },

  update(address) {

  },

  remove(address) {
    let addresses = this.get('addresses');
    let markers = this.get('markers');
    let addressIndex = addresses.indexOf(address);
    let marker = markers.findBy('id', address.id);
    let markerIndex = markers.indexOf(marker);

    addresses.removeAt(addressIndex);
    markers.removeAt(markerIndex);
    console.log(markers);
    Ember.setProperties(this.get('mapSettings'), {
      zoom: 4
    });
    this.toggleProperty('collapse');
  },

  normalizeData(mapData) {
    let addressComponents = mapData.place.address_components;
    let googleAddress = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    for (let i = 0, l = addressComponents.length; i < l; i++) {
      let addressType = addressComponents[i].types[0];

      if (googleAddress[addressType]) {
        googleAddress[addressType] = addressComponents[i][googleAddress[addressType]];
      }
    }

    let address = {
      city: (googleAddress.locality !== 'long_name') ? googleAddress.locality : '',
      country: (googleAddress.country !== 'long_name') ? googleAddress.country : '',
      zipcode: (googleAddress.postal_code !== 'short_name') ? googleAddress.postal_code : '',
      label: 'Business',
      state: (googleAddress.administrative_area_level_1 !== 'short_name') ? googleAddress.administrative_area_level_1 : '',
      address_1: (googleAddress.route !== 'long_name') ? googleAddress.route : '',
      address_2: (googleAddress.street_number !== 'short_name') ? googleAddress.street_number : '',
      marker: {
        lat: mapData.lat,
        lng: mapData.lng,
        icon: 'label'
      }
    };

    return address;
  },

  actions: {
    addAddress() {
      this.save();
      this.send('toggleAddressForm');
    },

    updateAddress() {
      this.save();
    },

    removeAddress(address) {
      this.remove(address);
    },

    showOnMap(address) {
      this.sendAction('showOnMap', address);
      this.set('currentAddress', address);
    },

    addressDidChange(mapData) {
      let lat = mapData.lat;
      let lng = mapData.lng;

      this.setProperties({
        lat,
        lng,
        mapData
      });
    },

    toggleAddressForm() {
      this.toggleProperty('isAdding');
      this.toggleProperty('collapse');
    }
  }
});
