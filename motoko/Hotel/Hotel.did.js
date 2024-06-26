const idlFactory = ({ IDL }) => {
  const HotelId = IDL.Text;
  const HotelInfo = IDL.Record({
    hotelDes: IDL.Text,
    hotelAvailableFrom: IDL.Text,
    hotelAvailableTill: IDL.Text,
    createdAt: IDL.Text,
    hotelId: IDL.Text,
    hotelImage: IDL.Text,
    hotelTitle: IDL.Text,
    hotelLocation: IDL.Text,
  });
  const RoomType = IDL.Record({ roomPrice: IDL.Nat, roomType: IDL.Text });
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Result_5 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(HotelId, HotelInfo)),
    err: IDL.Text,
  });
  const Result_4 = IDL.Variant({ ok: HotelInfo, err: IDL.Text });
  const Year = IDL.Text;
  const AnnualData = IDL.Record({
    aug: IDL.Nat,
    dec: IDL.Nat,
    feb: IDL.Nat,
    jan: IDL.Nat,
    may: IDL.Nat,
    nov: IDL.Nat,
    oct: IDL.Nat,
    sep: IDL.Nat,
    march: IDL.Nat,
    april: IDL.Nat,
    july: IDL.Nat,
    june: IDL.Nat,
  });
  const Result_3 = IDL.Variant({ ok: AnnualData, err: IDL.Text });
  const Result_2 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Result_1 = IDL.Variant({ ok: RoomType, err: IDL.Text });
  const _anon_class_19_1 = IDL.Service({
    checkHotelExist: IDL.Func([HotelId], [IDL.Bool], ["query"]),
    createHotel: IDL.Func([HotelInfo, RoomType], [Result], []),
    deleteHotel: IDL.Func([HotelId], [Result], []),
    getAllHotels: IDL.Func([IDL.Nat, IDL.Nat], [Result_5], []),
    getHotel: IDL.Func([HotelId], [Result_4], ["query"]),
    getHotelRegisterFrequencyData: IDL.Func([Year], [Result_3], ["query"]),
    getNumberofHotels: IDL.Func([], [Result_2], []),
    getRoom: IDL.Func([HotelId], [Result_1], ["query"]),
    updateHotel: IDL.Func([HotelInfo, RoomType], [Result], []),
    whoami: IDL.Func([], [IDL.Text], []),
  });
  return _anon_class_19_1;
};
const init = ({ IDL }) => {
  return [];
};

module.exports = {
  idlFactory,
  init,
};
