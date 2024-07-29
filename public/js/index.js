const locationMapping = {
    "usa": "America/New_York",
    "new york": "America/New_York",
    "los angeles": "America/Los_Angeles",
    "san francisco": "America/Los_Angeles",
    "chicago": "America/Chicago",
    "london": "Europe/London",
    "paris": "Europe/Paris",
    "tokyo": "Asia/Tokyo",
    "sydney": "Australia/Sydney",
    "islamabad": "Asia/Karachi",
};

async function fetchTime(location) {
    const timeResult = document.getElementById("timeResult");

    const timezone = locationMapping[location.toLowerCase()] || location;
    if (timezone) {
        const url = `http://worldtimeapi.org/api/timezone/${timezone}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.datetime) {
                const localTime = new Date(data.datetime);
                timeResult.innerHTML = `The local time in ${location} is ${localTime.toLocaleTimeString()}`;
            } else {
                timeResult.innerHTML = 'Could not fetch the time. Please check the location name.';
            }
        } catch (error) {
            timeResult.innerHTML = 'Error fetching the time. Please try again later.';
            console.error(error);
        }
    } else {
        timeResult.innerHTML = "Please enter a valid location";
    }
}

const accessToken = 'pk.eyJ1Ijoic2FhZGRkZCIsImEiOiJjbHowNG11czcyaHQ4MmtyNDl5MGptN2VrIn0.9HY3mYM_MQLm7Rd858zsVQ';

async function fetchPlacesMapbox(keyword) {
    const placesContainer = document.getElementById("placesContainer");

    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(keyword)}&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Mapbox API response:", data);  // Log the response to inspect its structure
        placesContainer.innerHTML = ""; // Clear previous results

        if (data.features && data.features.length > 0) {
            data.features.forEach(async (place) => {
                console.log("Place feature:", place); // Log each place object

                const placeName = place.properties.name || 'No name available';
                const placeAddress = place.properties.full_address || 'No address available'; // Adjust based on actual data

                const placeElement = document.createElement("div");
                placeElement.classList.add("place-item");

                placeElement.innerHTML = `
                    <h3>${placeName}</h3>
                    <img src="" alt="${placeName}">
                    <p>${placeAddress}</p>
                `;
                placesContainer.appendChild(placeElement);

                // Fetch images for the place and update the img tag
                const images = await fetchImages(placeName);
                if (images.length > 0) {
                    placeElement.querySelector('img').src = images[0].urls.small;
                } else {
                    placeElement.querySelector('img').alt = 'No image available';
                }
            });
        } else {
            placesContainer.innerHTML = "No results found";
        }
    } catch (error) {
        placesContainer.innerHTML = 'Error fetching places. Please try again later.';
        console.error(error);
    }
}


const unsplashAccessKey = 's4Y6CU8tHwUi8vX9orZEH1RPIOPbvKUXNhntmnpEtTE'; // Replace with your Unsplash access key

async function fetchImages(keyword) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&client_id=${unsplashAccessKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results; // This is an array of photo objects
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

document.getElementById("search").addEventListener("click", () => {
    const keyword = document.getElementById("locationInput").value.trim();
    if (keyword) {
        fetchTime(keyword);
        fetchPlacesMapbox(keyword);
    } else {
        alert("Please enter a search term");
    }
});

emailapi=""
async function sendMessage(message) {

}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("contactForm").addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the default form submission
        const message = "Name: " + document.getElementById("name").value + "\nEmail: " + document.getElementById("email").value + "\nMessage: " + document.getElementById("message").value;
        console.log(message);
    });
});
