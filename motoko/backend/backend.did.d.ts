import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Database {
  'autoScaleHotelCanister' : ActorMethod<[string], string>,
  'autoScaleUserCanister' : ActorMethod<[string], string>,
  'createNewHotelCanister' : ActorMethod<
    [string, [] | [Array<Principal>]],
    [] | [string]
  >,
  'createNewUserCanister' : ActorMethod<
    [string, [] | [Array<Principal>]],
    [] | [string]
  >,
  'deleteCanister' : ActorMethod<[string], undefined>,
  'getCanistersByPK' : ActorMethod<[string], Array<string>>,
  'getOwner' : ActorMethod<[], string>,
  'getPKs' : ActorMethod<[], Array<string>>,
  'upgradeCanisterByPK' : ActorMethod<[string, Uint8Array | number[]], string>,
  'whoami' : ActorMethod<[], string>,
}
export interface _SERVICE extends Database {}
