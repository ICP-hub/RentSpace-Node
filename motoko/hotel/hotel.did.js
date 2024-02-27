const idlFactory = ({ IDL }) => {
    const HotelInfo = IDL.Record({
      'hotelDes' : IDL.Text,
      'createdAt' : IDL.Text,
      'hotelImage' : IDL.Text,
      'hotelPrice' : IDL.Text,
      'hotelTitle' : IDL.Text,
      'hotelLocation' : IDL.Text,
    });
    const HotelId = IDL.Text;
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
    const anon_class_16_1 = IDL.Service({
      'addOwner' : IDL.Func([IDL.Text], [IDL.Text], []),
      'createHotel' : IDL.Func([HotelInfo], [], []),
      'deleteHotel' : IDL.Func([HotelId], [IDL.Text], []),
      'getHotel' : IDL.Func([HotelId], [IDL.Opt(HotelInfo)], ['query']),
      'getHotelFrequencyByYear' : IDL.Func(
          [IDL.Text],
          [IDL.Opt(AnnualData)],
          ['query'],
        ),
      'getHotelId' : IDL.Func([], [IDL.Vec(HotelId)], ['query']),
      'scanHotel' : IDL.Func(
          [IDL.Nat, IDL.Nat],
          [IDL.Vec(IDL.Tuple(HotelId, HotelInfo))],
          ['query'],
        ),
      'updateHotel' : IDL.Func([HotelId, HotelInfo], [IDL.Opt(HotelInfo)], []),
      'whoami' : IDL.Func([], [IDL.Text], ['query']),
    });
    return anon_class_16_1;
  };
 const init = ({ IDL }) => { return []; };

 module.exports={idlFactory,init}
  