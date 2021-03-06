/*global module, require*/

var tgv = tgv || {};

// Node.js detection. For testing
if (typeof module !== 'undefined' && module.exports) {
  tgv.utils = require('../utils.js');
  var LocalStorage = require('node-localstorage').LocalStorage,
      localStorage = new LocalStorage('./nodeLocalStorage');
}

(function(utils) {

  var AppModel = function(options) {
    this._init = this._init.bind(this);
    this.getClickRadius = this.getClickRadius.bind(this);
    this.getMapClickEnabled = this.getMapClickEnabled.bind(this);
    this.setClickRadius = this.setClickRadius.bind(this);
    this.setMapClickEnabled = this.setMapClickEnabled.bind(this);
    this.getClickRadiusMeters = this.getClickRadiusMeters.bind(this);

    // get default values from localStorage if they are available
    var defaults = {
      clickRadius: 250,
      mapClickEnabled: true
    };

    options = utils.deepExtend({}, defaults, options);

    this._init(options);
  };

  AppModel.prototype = {
    showingSidePanel: false,
    showingTweetsPopup: false,
    searchQuery: null,
    _mapClickEnabled: null,
    _clickRadius: null
  };

  AppModel.prototype._init = function App_Model__init(options) {
    this._clickRadius = options.clickRadius;
    this._mapClickEnabled = options.mapClickEnabled;

    // overwrite data from localStorage storage if it is available
    if (localStorage.getItem('clickRadius') !== null) {
      this._clickRadius = parseInt(localStorage.getItem('clickRadius'), 10);
    }

    if (localStorage.getItem('mapClickEnabled') !== null) {
      this._mapClickEnabled =
        localStorage.getItem('mapClickEnabled') === 'true';
    }
  };

  AppModel.prototype.getClickRadiusMeters =
                                      function AppModel_getClickRadiusMeters() {
    var km = 1000;
    return this._clickRadius * km;
  };

  AppModel.prototype.getClickRadius = function AppModel_getClickRadius() {
    return this._clickRadius;
  };

  AppModel.prototype.getMapClickEnabled =
                                        function AppModel_getMapClickEnabled() {
    return this._mapClickEnabled;
  };

  AppModel.prototype.setClickRadius = function AppModel_setClickRadius(value) {
    this._clickRadius = value;
    localStorage.setItem('clickRadius', value);

    return this; // for chaining
  };

  AppModel.prototype.setMapClickEnabled =
                                  function AppModel_setMapClickEnabled(value) {
    this._mapClickEnabled = value;
    localStorage.setItem('mapClickEnabled', value);

    return this; // for chaining
  };

  tgv.appModel = new AppModel();

})(tgv.utils);

// Node.js support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = tgv.appModel;
}
