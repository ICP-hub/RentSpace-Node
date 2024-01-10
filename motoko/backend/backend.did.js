const idlFactory = ({ IDL }) => {
  const Canister = IDL.Variant({
    'hotel' : IDL.Null,
    'user' : IDL.Null,
    'booking' : IDL.Null,
  });
  const CanisterSettings = IDL.Record({
    'freezing_threshold' : IDL.Opt(IDL.Nat),
    'controllers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'memory_allocation' : IDL.Opt(IDL.Nat),
    'compute_allocation' : IDL.Opt(IDL.Nat),
  });
  const Database = IDL.Service({
    'createNewCanister' : IDL.Func(
        [IDL.Text, Canister, IDL.Principal],
        [IDL.Opt(IDL.Text)],
        [],
      ),
    'deleteCanister' : IDL.Func([IDL.Text], [], []),
    'getCanistersByPK' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'getPKs' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'updateCanisterSetting' : IDL.Func(
        [IDL.Principal, CanisterSettings],
        [],
        [],
      ),
    'upgradeCanisterByPK' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8), IDL.Nat],
        [IDL.Text],
        [],
      ),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
  });
  return Database;
};
const init = ({ IDL }) => { return []; };
module.exports = {
  init,
  idlFactory
}
