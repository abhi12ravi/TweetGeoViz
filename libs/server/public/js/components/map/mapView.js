var tgv = tgv || {};

(function(appModel, utils) {
  var MapView = function(options) {
    this._init = this._init.bind(this);
    this.addMapControl = this.addMapControl.bind(this);
    this.renderHeatMap = this.renderHeatMap.bind(this);
    this.addMapCircle = this.addMapCircle.bind(this);
    this.removeCircle = this.removeCircle.bind(this);

    var defaults = {
      control: null,
      componentSelector: null
    };

    options = utils.deepExtend({}, defaults, options);

    this._init(options);
  };

  MapView.prototype = {
    _init: function MapView__init(options) {
      this._control = options.control;

      var mapCanvas = document.querySelector(options.componentSelector);

      var mapOptions = {
        center: new google.maps.LatLng(21.2125, 31.1973),
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
      };

      this._googleMap = new google.maps.Map(mapCanvas, mapOptions);

      // bind events
      google.maps.event.addListener(this._googleMap, 'click', function(event) {
        var lat = event.latLng.lat(),
            lng = event.latLng.lng();

        this._control.mapClick(event.pixel.x, event.pixel.y, lat, lng);
        this.addMapCircle(lat, lng);
      }.bind(this));
    },

    addMapCircle: function MapView_addMapCircle(lat, lng) {
      this.removeCircle();

      this._circle = new google.maps.Circle({
        map: this._googleMap,
        center: new google.maps.LatLng(lat, lng),
        clickable: false,
        // metres
        radius: appModel.getClickRadiusMeters(),
        fillColor: '#fff',
        fillOpacity: .6,
        strokeColor: '#313131',
        strokeOpacity: .4,
        strokeWeight: .8
      });
    },

    removeCircle: function MapView_removeCircle() {
      if (!this._circle) {
        return;
      }

      this._circle.setMap(null);
    },

    addMapControl: function MapView_addMapControl(location, el) {
      this._googleMap.controls[location].push(el);
    },

    renderHeatMap: function MapView_renderHeatMap(heatmapData) {
      //insert heatmap layer
      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        dissipating: false,
        radius: 5,
        map: this._googleMap
      });
    },

    el: null,
    showingCircle: false,
    _circle: null,
    _control: null,
    _googleMap: null
  };

  tgv.MapView = MapView;
})(tgv.appModel, tgv.utils);