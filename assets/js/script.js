/**
 * @typedef {import("dayjs").Dayjs} DayJS
 */

const baseHour = 9;
const maxHour = 18;
/**
 * @type {Object.<string,string>[]}
 */
const schedule = JSON.parse(localStorage.getItem("schedule")) || [];
/**
 * @type {DayJS}
 */
const now = dayjs();

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  const scheduleEl = $("#schedule");
  const saveToast = new bootstrap.Toast(document.getElementById("save-toast"), {
    delay: 3000,
  });
  scheduleEl.on("click", (e) => {
    const target = $(e.target);
    const parent = target.parent();
    // Ensure the target is a saveBtn inside a time-block
    if (!target.is(".saveBtn") || !parent.is(".time-block")) return;
    const description = parent.children(".description").val();
    const parentId = parseInt(parent.attr("id").split("hour-")[1]);
    // Save schedule
    schedule[parentId - baseHour] = description;
    localStorage.setItem("schedule", JSON.stringify(schedule));
    saveToast.show();
  });
  const currentHour = now.hour();
  for (let i = baseHour; i < maxHour; i++) {
    let status = "present";
    // If the hour is less than the current, it is in the past
    // If the hour is greater than the current, it is in the future
    // Otherwise, that hour is the present
    if (i < currentHour) status = "past";
    else if (i > currentHour) status = "future";
    let time = (i % 12) + (i > 11 ? "PM" : "AM");
    if (time == "0PM") time = "12PM";
    const hourEl = $(`
      <div id="hour-${i}" class="row time-block ${status}">
        <div class="col-2 col-md-1 hour text-center py-3">${time}</div>
        <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
      </div>`);
    scheduleEl.append(hourEl);
  }
  // Update the schedule elements with the events from localStorage
  for (let i = 0; i < schedule.length; i++) {
    $(`#hour-${baseHour + i} .description`).val(schedule[i]);
  }
  // Display the current date in the header of the page.
  const currentDayEl = $("#currentDay");
  currentDayEl.text(now.format("dddd, MMMM D, YYYY"));
});
