flatpickr("#myDatePicker", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
    maxDate: new Date().fp_incr(30), // 30 days from now
    defaultDate: "today",
});

const realInput = document.getElementById("real-input");
const fakeInput = document.getElementById("fake-input");

// Sync the fake input with the real input's value
realInput.addEventListener("input", () => {
    fakeInput.textContent = realInput.value; // Mirror the text to fake input
});

// Initialize fake input with the existing value (in case the user starts typing)
fakeInput.textContent = realInput.value;
