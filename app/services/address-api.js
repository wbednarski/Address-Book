import Ember from 'ember';

export default Ember.Service.extend({
  load() {

    return {
      "addresses": [
        {
          "city": "København N",
          "country": "Denmark",
          "zipcode": "2200",
          "label": "Business",
          "state": "",
          "address_1": "Ravnsborggade",
          "address_2": ""
        },
        {
          "city": "San Francisco",
          "country": "United States",
          "zipcode": "",
          "label": "Business",
          "state": "CA",
          "address_1": "Market Street",
          "address_2": ""
        }
      ]
    };
  },

  save(data) {

  },

  update(data) {

  },

  remove(data) {

  }
});
