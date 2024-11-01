/**
 * @file allocateRooms.js
 * @description Function to allocate available rooms based on availability over selected date ranges.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export function allocateRooms(
  availableRooms,
  cmsRooms,
  selectedCheckInDate,
  selectedCheckOutDate
) {
  const checkInDate = new Date(selectedCheckInDate);
  const checkOutDate = new Date(selectedCheckOutDate);

  // Filter rooms based on availability across the selected date range
  const availableRoomsForDates = availableRooms.filter((room) => {
    const roomAvailability = room.calendar;

    let isAvailableForAllDays = true;
    let date = new Date(checkInDate);

    // Check each day in the date range for availability
    while (date < checkOutDate) {
      const currentDateString = date.toISOString().split("T")[0];
      const availableOnDate = roomAvailability.some(
        (day) =>
          currentDateString >= day.from &&
          currentDateString <= day.to &&
          day.numAvail > 0
      );

      if (!availableOnDate) {
        isAvailableForAllDays = false;
        break;
      }
      date.setDate(date.getDate() + 1);
    }

    return isAvailableForAllDays;
  });

  return availableRoomsForDates;
}
