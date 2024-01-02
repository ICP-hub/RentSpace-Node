const idlFactory = ({ IDL }) => {
  const AutoScalingCanisterSharedFunctionHook = IDL.Func(
    [IDL.Text],
    [IDL.Text],
    []
  );
  const ScalingLimitType = IDL.Variant({
    heapSize: IDL.Nat,
    count: IDL.Nat,
  });
  const ScalingOptions = IDL.Record({
    autoScalingHook: AutoScalingCanisterSharedFunctionHook,
    sizeLimit: ScalingLimitType,
  });
  const HotelInfo = IDL.Record({
    hotelDes: IDL.Text,
    createdAt: IDL.Text,
    hotelImage: IDL.Text,
    hotelPrice: IDL.Text,
    hotelTitle: IDL.Text,
    hotelLocation: IDL.Text,
  });
  const ScanHotels = IDL.Record({
    nextKey: IDL.Opt(IDL.Text),
    hotels: IDL.Vec(HotelInfo),
  });
  const Hotel = IDL.Service({
    createHotel: IDL.Func([HotelInfo], [IDL.Text], []),
    getHotel: IDL.Func([IDL.Text], [IDL.Opt(HotelInfo)], ["query"]),
    getHotelId: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    getPK: IDL.Func([], [IDL.Text], ["query"]),
    scanRent: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Nat, IDL.Opt(IDL.Bool)],
      [ScanHotels],
      ["query"]
    ),
    searchLocationNode: IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ["query"]),
    searchNameNode: IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ["query"]),
    skExists: IDL.Func([IDL.Text], [IDL.Bool], ["query"]),
    transferCycles: IDL.Func([], [], []),
    updateHotel: IDL.Func([IDL.Text, HotelInfo], [IDL.Opt(HotelInfo)], []),
  });
  return Hotel;
};
const init = ({ IDL }) => {
  const AutoScalingCanisterSharedFunctionHook = IDL.Func(
    [IDL.Text],
    [IDL.Text],
    []
  );
  const ScalingLimitType = IDL.Variant({
    heapSize: IDL.Nat,
    count: IDL.Nat,
  });
  const ScalingOptions = IDL.Record({
    autoScalingHook: AutoScalingCanisterSharedFunctionHook,
    sizeLimit: ScalingLimitType,
  });
  return [
    IDL.Record({
      owners: IDL.Opt(IDL.Vec(IDL.Principal)),
      partitonKey: IDL.Text,
      scalingOptions: ScalingOptions,
    }),
  ];
};
module.exports = { init, idlFactory };
