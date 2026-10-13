# Atmos — React Weather App

A responsive weather dashboard for current conditions, hourly and seven-day forecasts, saved places, location search, browser geolocation, theme and temperature preferences, and cached offline forecasts. Built for the CodeTribe React TypeScript Task 4.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local URL. Use `npm run build` to create a production build and `npm run preview` to serve it locally. Browser geolocation and notifications require a secure context such as `localhost` or HTTPS. Weather and geocoding data come from the public [Open-Meteo APIs](https://open-meteo.com/); no API key is needed for this learning project.

## Design

Atmos uses a calm forest-green and warm-sunlight palette, readable DM Sans and Manrope typography, and a compact sidebar that becomes a slide-out menu on small screens. The dashboard groups a prominent current forecast, four quick weather metrics, an hourly/daily forecast switcher, and saved places. A separate preferences page contains theme, units and notification controls. Interactive controls use hover and focus states, and the layout adapts at 320, 480, 768, 1024 and 1200 pixels.

## Step-by-step planning

1. Create a Vite React TypeScript project and define typed place and weather models.
2. Build small reusable metric and forecast elements, then compose the dashboard and settings page with React Router.
3. Isolate Open-Meteo geocoding and forecast requests in `src/weather.ts`.
4. Add saved locations, settings and per-location forecast caching through `src/storage.ts` and browser localStorage.
5. Connect search, geolocation, hourly/daily selection, units, theme and notification permission to React state.
6. Add offline fallback from cached weather, loading and error feedback, and responsive styling.
7. Build the production bundle and manually check search, location permission, forecast switches, saved places, preferences and offline fallback at the required widths.

## Pseudocode

```text
load saved places, theme, units and cached forecast
if there are no saved places, start with Kimberley
when active place or units change:
    request forecast from Open-Meteo
    if request succeeds, show and cache it
    otherwise, show cached forecast and offline message
when a search term changes, debounce and request geocoding results
when a result is selected, save the place and make it active
when current-location is selected, ask browser permission and use coordinates
when forecast mode changes, show hourly or daily data
when preferences change, persist them and refresh forecast if units changed
when a severe weather code is returned, show a browser notification if allowed
```

## Algorithm

- **Search:** Trim the query, wait 300 ms, call Open-Meteo geocoding, map results to typed places, and make the selected place active.
- **Weather:** Request current, hourly and daily fields for the active coordinates and selected temperature/wind units. Store successful responses with a timestamp under that place's cache key.
- **Offline:** If a request fails, load the last cached response for the active place and display its saved timestamp. If no cache exists, show an error toast.
- **Saved places:** Add a selected place only once; switch the active ID when selected; allow removal while keeping at least one place available.
- **Units and theme:** Update React state, persist the preference, and apply it across the interface. A unit change triggers a forecast request in the new units.
- **Location and alerts:** Request coordinates through the browser Geolocation API only after user action. Request notification permission after user action and report severe forecast conditions when permission is granted.

## Project structure

```text
src/
  App.tsx       Dashboard, settings, interactions and reusable metric component
  main.tsx      React entry point and router
  storage.ts    localStorage helpers and weather cache
  styles.css    Themes, layout, interaction states and responsive breakpoints
  types.ts      Place, forecast and unit types
  weather.ts    Open-Meteo geocoding, forecast and weather-code helpers
```

## Privacy and data

Saved locations, preferences and cached forecasts stay in this browser's localStorage. Location access is requested only when the user selects the location button. Search terms and coordinates are sent to Open-Meteo to provide weather results. This project does not run its own server or collect accounts.

## Attribution and limitations

Forecasts and geocoding are provided by Open-Meteo. Browser notifications are best-effort and depend on permission and browser support. Severe conditions are inferred from forecast weather codes; this app does not receive government-issued alert bulletins. The demo's daylight metric is decorative.
