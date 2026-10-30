# Week 5 Answers

**1. You refresh the browser on /events/2 and the page loads. Which program answered that request in development, and what must the production server do so it still works after deployment?**

In development, the Vite dev server answered the request; it is configured to fall back to `index.html` for any unknown paths so the Vue Router can handle them. In production, the web server (like Nginx or Apache) must be configured with a "fallback" or "rewrite" rule (e.g., `try_files $uri /index.html`) to serve the `index.html` file for all routes, preventing 404 errors on refresh.

**2. The guard stops students from opening /events/new. Can a student still create an event? How, and what must stop them?**

Yes, a student can still create an event by using API tools like `curl` or Postman to send a POST request directly to the server, bypassing the UI. Client-side guards only protect the user interface; the backend API must enforce authorization (e.g., checking a user token) and reject the request.

**3. EventDetailPage loads its event in a watch on the id with immediate: true, not in onMounted. What bug would onMounted alone cause?**

If the page only used `onMounted`, Vue would not re-run the fetch logic if the user navigated from one event directly to another (e.g., from `/events/1` to `/events/2`) while staying on the same component. The URL would change, but the screen would still show the old event's data. A `watch` with `immediate: true` fixes this by firing both on the initial load and whenever the ID changes.

**4. Why does EventsPage use storeToRefs(store) instead of const { events } = store?**

If you destructure a Pinia store directly using `const { events } = store`, you extract the current value but lose its reactivity. If the store updates the `events` array later (e.g., after fetching from the API), your component's `events` variable will still hold the old, empty value. `storeToRefs` wraps the state in `ref` objects, keeping the component perfectly in sync with the store.

**5. Booking makes two requests: POST the booking, then PATCH the seat count. What happens to the data if the second one fails? How could the server avoid this?**

If the PATCH fails, the booking is saved in the database, but the seat count is not updated. This creates a data inconsistency where the event might appear to have more seats available than it actually does. The server could prevent this by using a database transaction (which rolls back the POST if the PATCH fails), or by handling both the booking creation and seat deduction in a single atomic API endpoint.