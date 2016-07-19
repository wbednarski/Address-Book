import Ember from 'ember';

export default Ember.Component.extend({
  api: Ember.inject.service('address-api'),

  addressTypes: [
    'Business',
    'Mailing',
    'Other'
  ],

  didInsertElement() {
    Ember.run.later(()=> {
      $(this.$('.address-item')[0]).attr('id', `id-${this.get('address.id')}`);

      let timestamp = Date.now();
      let address = this.get('address');

      Ember.$.getJSON(`https://maps.googleapis.com/maps/api/timezone/json?location=${address.marker.lat},${address.marker.lng}&timestamp=${timestamp.toString().slice(0, -1)}`, function (data) {
        let d = new Date();
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        let localDate = new Date(utc + data.dstOffset * 1000 + 1000 * data.rawOffset);

        Ember.set(address, 'localTime', `${localDate.getHours()}:${(0 + localDate.getMinutes().toString()).slice(-2)}`);
        Ember.set(address, 'timeZoneName', data.timeZoneName);
      });

    }, 1000);

  },

  click() {
    this.sendAction('showOnMap', this.get('address'));
  },

  hideEdit: Ember.observer('collapse', function () {
    this.set('isEditing', false);
  }),

  autoSave() {
    // this.sendAction('save');
    this.get('api').save(this.get('addresses'));
    this.toggleProperty('saved');
    Ember.run.later(()=> {
      this.toggleProperty('saved');
    }, 3000);
  },

  actions: {
    update() {
      Ember.run.debounce(this, this.autoSave, 1500);
      // this.sendAction('update', this.get('address'));
    },

    edit() {
      this.toggleProperty('collapse');
      this.toggleProperty('isEditing');
    },

    close() {
      this.set('isEditing', false);
    },

    remove() {
      if (window.confirm(`Delete ${this.get('address.city')}?`)) {
        this.sendAction('remove', this.get('address'));
      }
    },

    addressDidChange(data) {
      this.set('mapData', data);
    }
  }
});
