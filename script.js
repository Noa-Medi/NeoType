flatpickr("#myDatePicker", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
    maxDate: new Date().fp_incr(30), // 30 days from now
    defaultDate: "today",
});

