import Ember from 'ember';
import Paper from 'ember-paper/components/paper-input';

const { inject, get, set } = Ember;

export default Paper.extend({
  maps: inject.service('g-maps'),
  classNames: ['autocomplete'],
  placeholder: '',

  init() {
    this._super(...arguments);

    const maps = get(this, 'maps');
    if (maps) {
      maps.registerAutocomplete(this);
    }
  },

  focusOut() {
    if(this.$('input')[0].value) {
      // this.$().removeClass('md-input-has-value');
    }
  },

  didInsertElement() {
    this._super(...arguments);

    let input = this.$('input')[0];
    this.setup(input);
    Ember.run.later(() => {
      $(input).focus();
    }, 350);
  },

  setup(input) {
    const autocomplete = new google.maps.places.Autocomplete(input);
    const handler = Ember.run.bind(this, function() {
      const place = autocomplete.getPlace();
      this.sendAction('on-select', {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        place
      });
    });

    const listener = autocomplete.addListener('place_changed', handler);

    set(this, 'autocomplete', autocomplete);
    set(this, 'listener', listener);
    this.$().removeClass('md-input-has-value');
  },

  didAutocomplete(place) {
    this.send('onSelect', place);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.teardown();
  },

  teardown() {
    const autocomplete = get(this, 'autocomplete');
    const listener = get(this, 'listener');

    google.maps.event.removeListener(listener);
    google.maps.event.clearInstanceListeners(autocomplete);

    const maps = get(this, 'maps');
    if (maps) {
      maps.unregisterAutocomplete(this);
    }
  },

  actions: {
    onSelect(place) {
      this.sendAction('on-select', place);
    }
  }
});
