const axios = require('axios');
const geolib = require('geolib');

async function geocodeAddress(city, district, ward) {
    const fullAddress = `${[ward, district, city].filter(Boolean).join(', ')} 550000, Vietnam`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;
    console.log(url);
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'YourAppName/1.0 (your.email@example.com)' }
        });
        if (!response.data || response.data.length === 0) {
            console.error(`No geocoding results for address: "${fullAddress}"`);
            return null;
        }
        const data = response.data[0];
        return { lat: parseFloat(data.lat), lon: parseFloat(data.lon) };
    } catch (error) {
        console.error(`Geocoding error for "${fullAddress}": ${error.message}`);
        return null;
    }
}

module.exports = async (addr1, addr2) => {
    const coord1 = await geocodeAddress(addr1.city, addr1.district, addr1.ward);
    const coord2 = await geocodeAddress(addr2.city, addr2.district, addr2.ward);

    if (coord1 && coord2) {
        const distance = geolib.getDistance(
            { latitude: coord1.lat, longitude: coord1.lon },
            { latitude: coord2.lat, longitude: coord2.lon }
        );
        return distance;
    }
    return null;
};
