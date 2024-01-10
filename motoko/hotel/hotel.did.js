const idlFactory = ({ IDL }) => {
  const ScalingLimitType = IDL.Variant({
    'heapSize' : IDL.Null,
    'count' : IDL.Null,
  });
  const ScalingOptions = IDL.Record({
    'limitType' : ScalingLimitType,
    'limit' : IDL.Nat,
    'autoScalingCanisterId' : IDL.Text,
  });
  const HotelInfo = IDL.Record({
    'hotelDes' : IDL.Text,
    'createdAt' : IDL.Text,
    'hotelImage' : IDL.Text,
    'hotelPrice' : IDL.Text,
    'hotelTitle' : IDL.Text,
    'hotelLocation' : IDL.Text,
  });
  const ScanHotels = IDL.Record({
    'nextKey' : IDL.Opt(IDL.Text),
    'hotels' : IDL.Vec(HotelInfo),
  });
  const Hotel = IDL.Service({
    'createHotel' : IDL.Func([HotelInfo], [], []),
    'getHotel' : IDL.Func([IDL.Text], [IDL.Opt(HotelInfo)], ['query']),
    'getHotelId' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getOwner' : IDL.Func([], [IDL.Opt(IDL.Vec(IDL.Principal))], ['query']),
    'getPK' : IDL.Func([], [IDL.Text], ['query']),
    'scanRent' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Opt(IDL.Bool)],
        [ScanHotels],
        ['query'],
      ),
    'searchLocationNode' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'searchNameNode' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'skExists' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'transferCycles' : IDL.Func([], [], []),
    'updateHotel' : IDL.Func([IDL.Text, HotelInfo], [IDL.Opt(HotelInfo)], []),
  });
  return Hotel;
};
const init = ({ IDL }) => {
  const ScalingLimitType = IDL.Variant({
    'heapSize' : IDL.Null,
    'count' : IDL.Null,
  });
  const ScalingOptions = IDL.Record({
    'limitType' : ScalingLimitType,
    'limit' : IDL.Nat,
    'autoScalingCanisterId' : IDL.Text,
  });
  return [
    IDL.Record({
      'owners' : IDL.Opt(IDL.Vec(IDL.Principal)),
      'partitionKey' : IDL.Text,
      'scalingOptions' : ScalingOptions,
    }),
  ];
};
module.exports = { init, idlFactory };
