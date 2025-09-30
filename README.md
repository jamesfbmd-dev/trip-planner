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

## Local Development with Gulp

This project uses Gulp to automate SASS compilation. The dependencies are configured to be compatible with older Node.js versions (v10+).

To set up the project for local development, follow these steps:

1.  **Install Dependencies:**
    Navigate to the root of the project and install the required development dependencies.
    ```bash
    npm install
    ```

2.  **Run Gulp Watch:**
    To start the Gulp task runner, which will compile SASS and watch for changes, run the `watch:sass` script.
    ```bash
    npm run watch:sass
    ```
    This will compile `sass/main.scss` to `css/styles.css` and continue watching for changes. You can now open `index.html` in your browser and see your style changes reflected live.

### Troubleshooting

If you encounter any errors during or after installation (such as a `globalThis is not defined` error), please perform a clean installation to ensure you have the correct dependencies:

1.  Delete the `node_modules` directory and the `package-lock.json` file.
2.  Run `npm install` again.

This will build the dependencies from scratch using the versions specified in `package.json`.