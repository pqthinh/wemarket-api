var distance = (location1, location2) => {
  let R = 6371; //km
  let dLat = (location1.lat - location2.lat) * (Math.PI / 180);
  let dLon = (location1.lng - location2.lng) * (Math.PI / 180);
  let lat1 = location2.lat * (Math.PI / 180);
  let lat2 = location1.lat * (Math.PI / 180);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
};

module.exports = distance;
