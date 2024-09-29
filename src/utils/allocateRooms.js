/**
 * @file allocateRooms.js
 * @description Function to allocate available rooms based on total guests, rooms, and availability over selected date ranges.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export function allocateRooms(
  totalGuests,
  totalRooms,
  availableRooms,
  cmsRooms,
  selectedCheckInDate,
  selectedCheckOutDate
) {
  // Parse selected dates into JavaScript Date objects for accurate comparison
  const checkInDate = new Date(selectedCheckInDate);
  const checkOutDate = new Date(selectedCheckOutDate);

  // Find the matching room from CMS based on the roomId and attach roomMaxGuests
  const enrichedRooms = availableRooms.map((room) => {
    const matchingCmsRoom = cmsRooms.find(
      (cmsRoom) => String(cmsRoom.roomId) === String(room.roomId)
    );

    if (matchingCmsRoom) {
      room.roomMaxGuests = matchingCmsRoom.roomMaxGuests;
    }

    return room;
  });

  // Filter rooms based on availability across the selected date range
  const availableRoomsForDates = enrichedRooms.filter((room) => {
    const roomAvailability = room.calendar;

    // Check if the room is available for every day in the selected date range
    let isRoomAvailableForAllDays = true;

    // Loop through each day in the selected range and check availability
    let date = new Date(checkInDate); // Reset date to start at checkInDate

    // While loop to handle ranges longer than 2 days
    while (date < checkOutDate) {
      const currentDateString = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      // Check if the date falls within any availability range with numAvail > 0
      const availabilityForDay = roomAvailability.find((day) => {
        const fromDateString = day.from;
        const toDateString = day.to;

        return (
          currentDateString >= fromDateString &&
          currentDateString <= toDateString &&
          day.numAvail > 0
        );
      });

      if (!availabilityForDay) {
        // If no availability for this day, mark the room as unavailable
        isRoomAvailableForAllDays = false;
        break; // No need to check further if one day is unavailable
      }

      // Move to the next day
      date.setDate(date.getDate() + 1);
    }

    return isRoomAvailableForAllDays;
  });

  // If no rooms are available for the entire date range
  if (availableRoomsForDates.length === 0) {
    return [];
  }

  // Sort rooms by capacity, largest first
  availableRoomsForDates.sort((a, b) => b.roomMaxGuests - a.roomMaxGuests);

  // Scenario 1: If totalRooms is 1 and guests are 1 or 2, return all available rooms
  if (totalRooms === 1 && (totalGuests === 1 || totalGuests === 2)) {
    return availableRoomsForDates.map((room) => ({
      room: room,
      guestsInRoom: totalGuests,
    }));
  }

  // Scenario 2: If totalRooms is 1 and guests are 3 or 4, show only the Twin room (capacity 4)
  if (totalRooms === 1 && (totalGuests === 3 || totalGuests === 4)) {
    return availableRoomsForDates
      .filter((room) => room.roomMaxGuests >= 4)
      .map((room) => ({
        room: room,
        guestsInRoom: totalGuests,
      }));
  }

  // Scenario 3: If totalRooms is 2 and guests are 2, 3, or 4, show all rooms (allow users to choose how to allocate guests)
  if (
    totalRooms === 2 &&
    (totalGuests === 2 || totalGuests === 3 || totalGuests === 4)
  ) {
    return availableRoomsForDates.map((room) => ({
      room: room,
      guestsInRoom: totalGuests,
    }));
  }

  // Scenario 4: If totalRooms is 2 and guests are 5 or 6, show both king-size rooms and the twin room
  if (totalRooms === 2 && (totalGuests === 5 || totalGuests === 6)) {
    return availableRoomsForDates.map((room) => ({
      room: room,
      guestsInRoom: totalGuests,
    }));
  }

  // Scenario 5: If totalRooms is 3 and guests are from 3 to 8, show both king-size rooms and the twin room
  if (totalRooms === 3 && totalGuests >= 3 && totalGuests <= 8) {
    return availableRoomsForDates.map((room) => ({
      room: room,
      guestsInRoom: totalGuests,
    }));
  }

  // Default case: return all rooms without additional logic for now
  return availableRoomsForDates.map((room) => ({
    room: room,
    guestsInRoom: null,
  }));
}
