class LocationUtil {
  location = window.location;

  replace(...args) {
    this.location.replace(...args);
  }
}

const location = new LocationUtil();

export default location;
