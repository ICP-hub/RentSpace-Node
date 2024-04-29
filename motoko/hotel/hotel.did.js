const idlFactory = ({ IDL }) => {
  const HotelInfo = IDL.Record({
    'hotelDes' : IDL.Text,
    'hotelAvailableFrom' : IDL.Text,
    'hotelAvailableTill' : IDL.Text,
    'createdAt' : IDL.Text,
    'hotelImage' : IDL.Text,
    'hotelPrice' : IDL.Text,
    'updatedAt' : IDL.Opt(IDL.Text),
    'hotelTitle' : IDL.Text,
    'hotelLocation' : IDL.Text,
  });
  const HotelId = IDL.Text;
  const AdminId = IDL.Text;
  const AnnualData = IDL.Record({
    'aug' : IDL.Nat,
    'dec' : IDL.Nat,
    'feb' : IDL.Nat,
    'jan' : IDL.Nat,
    'may' : IDL.Nat,
    'nov' : IDL.Nat,
    'oct' : IDL.Nat,
    'sep' : IDL.Nat,
    'march' : IDL.Nat,
    'april' : IDL.Nat,
    'july' : IDL.Nat,
    'june' : IDL.Nat,
  });
  const _anon_class_10_1 = IDL.Service({
    'addOwner' : IDL.Func([IDL.Text], [IDL.Text], []),
    'checkHotelExist' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'createHotel' : IDL.Func([HotelInfo], [HotelId], []),
    'deleteHotel' : IDL.Func([HotelId], [IDL.Text], []),
    'getAllAdmin' : IDL.Func([], [IDL.Vec(AdminId)], ['query']),
    'getHotel' : IDL.Func([HotelId], [IDL.Opt(HotelInfo)], ['query']),
    'getHotelAvailabilty' : IDL.Func(
        [HotelId],
        [
          IDL.Opt(
            IDL.Record({
              'hotelAvailableFrom' : IDL.Text,
              'hotelAvailableTill' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getHotelFrequencyByYear' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(AnnualData)],
        ['query'],
      ),
    'getHotelId' : IDL.Func([], [IDL.Vec(HotelId)], ['query']),
    'getNoOfPages' : IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    'getTime' : IDL.Func([], [IDL.Int], ['query']),
    'scanHotel' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(IDL.Tuple(HotelId, HotelInfo))],
        ['query'],
      ),
    'updateHotel' : IDL.Func([HotelId, HotelInfo], [IDL.Opt(HotelInfo)], []),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
  });
  return _anon_class_10_1;
};
const init = ({ IDL }) => { return []; };

module.exports={
  idlFactory,
  init
}