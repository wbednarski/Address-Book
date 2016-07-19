import Ember from 'ember';
import MapStylesMixin from 'address-book/mixins/map-styles';
import { module, test } from 'qunit';

module('Unit | Mixin | map styles');

// Replace this with your real tests.
test('it works', function(assert) {
  let MapStylesObject = Ember.Object.extend(MapStylesMixin);
  let subject = MapStylesObject.create();
  assert.ok(subject);
});
