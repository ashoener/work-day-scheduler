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
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  scheduleEl.on("click", (e) => {
    const parent = $(e.target).parent();
    if (!parent.is(".time-block")) return;
    const description = parent.children(".description").val();
    const parentId = parseInt(parent.attr("id").split("hour-")[1]);
    schedule[parentId - baseHour] = description;
    console.log(parentId - baseHour);
    localStorage.setItem("schedule", JSON.stringify(schedule));
  });
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  const currentHour = now.hour();
  for (let i = baseHour; i < maxHour; i++) {
    let status = "present";
    if (i < currentHour) status = "past";
    else if (i > currentHour) status = "future";
    const time = (i % 12) + (i > 12 ? "PM" : "AM");
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
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  for (let i = 0; i < schedule.length; i++) {
    $(`#hour-${baseHour + i} .description`).val(schedule[i]);
  }
  // TODO: Add code to display the current date in the header of the page.
  const currentDayEl = $("#currentDay");
  currentDayEl.text(now.format("dddd, MMMM D, YYYY"));
});
