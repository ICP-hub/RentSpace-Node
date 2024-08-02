const { Property } = require("../models/Property");
const { CheckOut } = require("../models/CheckOut");
const { v4 } = require("uuid");

module.exports = {
  async createBooking(req, res) {
    const { propertyId, checkIn, checkOut, rooms, roomData } = req.body;

    try {
      console.log("Booking Data", req.body);

      for (let i = 0; i < roomData.length; i++) {
        let roomID = roomData[i].roomID;
        let bookedRooms = roomData[i].totalRooms;
        console.log("Room ID : ", roomID);
        console.log("Booked Rooms : ", bookedRooms);

        const record = {
          id: v4(),
          propertyId,
          rommId: roomID,
          bookedRooms: bookedRooms,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
        };

        const createCheckOut = await CheckOut.create(record);

        await Property.update({ rooms: rooms }, { where: { propertyId } });

        if (createCheckOut) {
          console.log("Booking create successfully and rooms updated");
        } else {
          console.log("Booking not created");
        }
      }

      res.send("Booking created successfully and rooms updated");
    } catch (error) {
      console.log("Error in booking", error);
      res.send("Error in booking");
    }
  },

  async updateBooking() {
    // check if checkOut date is less than current date in checkOut collection
    // if yes then update the booking and rooms
    try {
      const checkOutRecords = await CheckOut.findAll();

      if (checkOutRecords.length === 0) {
        console.log("No checkOut records found");
        return;
      } else {
        const currentDate = new Date();
        //   console.log("Current Date : ", currentDate);

        for (let i = 0; i < checkOutRecords.length; i++) {
          let checkOutDate = new Date(checkOutRecords[i].dataValues.checkOut);

          let day = checkOutDate.getDate();
          let month = checkOutDate.getMonth() + 1;
          let year = checkOutDate.getFullYear();

          // console.log(" Day : ", month);
          // console.log(" Month : ", day);
          // console.log(" Year : ", year);

          checkOutDate = new Date(`${year}-${day}-${month}`);

          // console.log("CheckOut Date : ", checkOutDate);

          //   console.log("Date comparison : ", checkOutDate < currentDate);

          if (checkOutDate < currentDate) {
            //------------------ Change this to  /// checkOutDate < currentDate \\\ ------------------
            console.log("CheckOut Date is less than current date : ", i);

            const property = await Property.findOne({
              where: { propertyId: checkOutRecords[i].dataValues.propertyId },
            });

            if (property) {
              let Rooms = property.rooms;

              console.log("Rooms => ", Rooms);

              for (let j = 0; j < Rooms.length; j++) {
                if (Rooms[j].roomID === checkOutRecords[i].dataValues.roomId) {
                  Rooms[j].totalAvailableRooms =
                    Rooms[j].totalAvailableRooms +
                    checkOutRecords[i].dataValues.bookedRooms;
                  break;
                }
              }

              console.log("Room before : ", Rooms);

              //   delete checkOutRecords[i];
              const updateProperty = await Property.update(
                { rooms: Rooms },
                {
                  where: {
                    propertyId: checkOutRecords[i].dataValues.propertyId,
                  },
                }
              );

              if (updateProperty) {
                console.log("Property updated successfully");
              } else {
                console.log("Property not updated");
              }

              const deleteCheckOut = await CheckOut.destroy({
                where: { id: checkOutRecords[i].dataValues.id },
              });

              if (deleteCheckOut) {
                console.log("CheckOut record deleted successfully");
              } else {
                console.log("CheckOut record not deleted");
              }
            }
          }
        }
      }
    } catch (error) {
      console.log("Error in updateBooking", error);
    }
  },
};
