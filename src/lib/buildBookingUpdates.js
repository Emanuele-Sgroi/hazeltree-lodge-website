/**
 * Re‑creates the same bookingUpdates array you build in CheckoutForm,
 * but as a pure function so the server can call it.
 */
export function buildBookingUpdates({
  bookingData,
  totalPrice,
  guestValues,
  piId,
}) {
  const { bookingIds, checkIn, checkOut, selectedRooms, totalGuestsNumber } =
    bookingData;
  const nightsCount = bookingData.searchData?.nightsCount ?? 1;

  function generateInvoiceNumber() {
    return `INV-${Date.now()}`;
  }

  const totalGuestsNote = `Total Guests: ${totalGuestsNumber}`;

  return bookingIds.map((bookingId, index) => {
    if (index === 0) {
      // ----- primary booking -----
      const addNote =
        bookingIds.length > 1
          ? `Payment of €${totalPrice} covers multiple rooms. Booking IDs: ${bookingIds.join(
              ", "
            )}. ${totalGuestsNote}. Paid with Stripe: ${piId}`
          : `Paid with Stripe: ${piId}`;

      const addInvoiceDescription =
        bookingIds.length > 1 ? "Charges for Multiple Rooms" : "Room Charges";

      const invoiceNumber = generateInvoiceNumber();
      const invoiceDate = new Date().toISOString().split("T")[0];

      return {
        id: bookingId,
        status: "confirmed",
        arrival: checkIn,
        departure: checkOut,
        numAdult: selectedRooms[index].guestCount,
        numChild: 0,
        title: guestValues.title,
        firstName: guestValues.firstName,
        lastName: guestValues.lastName,
        email: guestValues.email,
        mobile: guestValues.mobileNumber,
        address: guestValues.address,
        city: guestValues.city,
        postcode: guestValues.postcode,
        country2: guestValues.country,
        comments: guestValues.notes,
        arrivalTime: guestValues.arrivalTime,
        flagColor: "0000ff",
        flagText: "Paid",
        notes: addNote,
        price: totalPrice,
        deposit: totalPrice,
        offerId: 1,
        allowAutoAction: "enable",
        actions: {
          makeGroup: true,
          notifyHost: true,
          assignInvoiceNumber: true,
        },
        invoice: {
          invoiceId: invoiceNumber,
          invoiceDate: invoiceDate,
        },
        invoiceItems: [
          {
            type: "charge",
            description: addInvoiceDescription,
            qty: 1,
            amount: totalPrice,
          },
          {
            type: "payment",
            description: "Paid via stripe",
            amount: totalPrice,
          },
        ],
      };
    }

    // ----- secondary booking -----
    const addNote =
      bookingIds.length > 1
        ? `Payment recorded under Booking ID ${bookingIds[0]}. Paid with Stripe: ${piId}. ${totalGuestsNote}`
        : `Paid with Stripe: ${piId}`;

    return {
      id: bookingId,
      status: "confirmed",
      arrival: checkIn,
      departure: checkOut,
      numAdult: selectedRooms[index].guestCount,
      numChild: 0,
      title: guestValues.title,
      firstName: guestValues.firstName,
      lastName: guestValues.lastName,
      email: guestValues.email,
      mobile: guestValues.mobileNumber,
      address: guestValues.address,
      city: guestValues.city,
      postcode: guestValues.postcode,
      country2: guestValues.country,
      comments: guestValues.notes,
      arrivalTime: guestValues.arrivalTime,
      flagColor: "0000ff",
      flagText: "Paid",
      notes: addNote,
      price: 0,
      deposit: 0,
      allowAutoAction: "disable",
      actions: { makeGroup: true },
    };
  });
}
