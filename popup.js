const form = document.getElementById('search-form');
const statusEl = document.getElementById('status');

form.addEventListener('submit', (event) => {
  // Stop the browser from reloading the popup on submit.
  event.preventDefault();
  const input = Object.fromEntries(new FormData(form));
  statusEl.textContent = `Got it: ${JSON.stringify(input)}`;
});
