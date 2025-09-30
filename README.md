# Trip Planner

A simple, interactive trip planner application that allows users to create, visualize, and manage their travel itineraries.

## Features

- **Create and Manage Trips:** Easily create new trips, give them a name, and add a cover image.
- **Interactive Calendar:** Plan your trip day-by-day on an interactive calendar.
- **Day-by-Day View:** View your itinerary in a detailed, day-by-day format with images and activities.
- **Stay or Travel:** For each day, you can specify whether you're staying in a city or traveling between destinations.
- **Activity Planning:** Add morning, afternoon, and evening activities to each day of your trip.
- **Interactive Map:** Generate a full-screen map of your trip, showing all your destinations and the routes between them.
- **Responsive Design:** The application is designed to work on desktop, tablet, and mobile devices.
- **Local Storage:** All your trip data is saved in your browser's local storage, so your trips will be there when you come back.

## Local Development

To set up the project for local development and compile the SASS files, follow these steps:

1.  **Install Dependencies:**
    Navigate to the root of the project and install the required development dependencies (in this case, `sass`).
    ```bash
    npm install
    ```

2.  **Run SASS Watch:**
    To automatically compile `.scss` files to `.css` whenever you save a change, run the predefined `sass:watch` script from your terminal:
    ```bash
    npm run sass:watch
    ```
    This will watch the `sass/main.scss` file and its imports, compiling the output to `css/styles.css`. You can now open `index.html` in your browser and see your style changes reflected live upon saving.
