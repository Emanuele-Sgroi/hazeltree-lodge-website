/**
 * @file generateAlternativeRooms.js
 * @description Generates alternative room combinations for bookings based on total guests, room availability, and room capacity. Includes logic to filter and sort suitable room combinations.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export function generateAlternativeRooms(
  totalGuests,
  availableRooms,
  cmsRooms,
  selectedCheckInDate,
  selectedCheckOutDate
) {
  const checkInDate = new Date(selectedCheckInDate);
  const checkOutDate = new Date(selectedCheckOutDate);

  // Enrich availableRooms with roomMaxGuests from cmsRooms
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
    let isRoomAvailableForAllDays = true;
    let date = new Date(checkInDate);
    while (date < checkOutDate) {
      const currentDateString = date.toISOString().split("T")[0];
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
        isRoomAvailableForAllDays = false;
        break;
      }
      date.setDate(date.getDate() + 1);
    }
    return isRoomAvailableForAllDays;
  });

  // Generate all combinations of available rooms
  const roomCombinations = getAllCombinations(availableRoomsForDates);

  // Filter combinations where the total capacity >= totalGuests
  const suitableCombinations = roomCombinations.filter((combination) => {
    const totalCapacity = combination.reduce(
      (sum, room) => sum + room.roomMaxGuests,
      0
    );
    return totalCapacity >= totalGuests;
  });

  // Sort combinations by the number of rooms (fewest rooms first)
  suitableCombinations.sort((a, b) => a.length - b.length);

  return suitableCombinations;
}

// Helper function to generate all non-empty combinations of rooms
function getAllCombinations(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }

  let result = [];
  const f = function (prefix, rest) {
    for (let i = 0; i < rest.length; i++) {
      const newPrefix = [...prefix, rest[i]];
      result.push(newPrefix);
      f(newPrefix, rest.slice(i + 1));
    }
  };
  f([], arr);
  return result;
}
