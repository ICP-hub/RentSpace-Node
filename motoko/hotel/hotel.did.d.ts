import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AdminId = string;
export interface AnnualData {
  'aug' : bigint,
  'dec' : bigint,
  'feb' : bigint,
  'jan' : bigint,
  'may' : bigint,
  'nov' : bigint,
  'oct' : bigint,
  'sep' : bigint,
  'march' : bigint,
  'april' : bigint,
  'july' : bigint,
  'june' : bigint,
}
export type HotelId = string;
export interface HotelInfo {
  'hotelDes' : string,
  'hotelAvailableFrom' : string,
  'hotelAvailableTill' : string,
  'createdAt' : string,
  'hotelImage' : string,
  'hotelPrice' : string,
  'updatedAt' : [] | [string],
  'hotelTitle' : string,
  'hotelLocation' : string,
}
export interface _anon_class_10_1 {
  'addOwner' : ActorMethod<[string], string>,
  'checkHotelExist' : ActorMethod<[string], boolean>,
  'createHotel' : ActorMethod<[HotelInfo], HotelId>,
  'deleteHotel' : ActorMethod<[HotelId], string>,
  'getAllAdmin' : ActorMethod<[], Array<AdminId>>,
  'getHotel' : ActorMethod<[HotelId], [] | [HotelInfo]>,
  'getHotelAvailabilty' : ActorMethod<
    [HotelId],
    [] | [{ 'hotelAvailableFrom' : string, 'hotelAvailableTill' : string }]
  >,
  'getHotelFrequencyByYear' : ActorMethod<[string], [] | [AnnualData]>,
  'getHotelId' : ActorMethod<[], Array<HotelId>>,
  'getNoOfPages' : ActorMethod<[bigint], bigint>,
  'getTime' : ActorMethod<[], bigint>,
  'scanHotel' : ActorMethod<[bigint, bigint], Array<[HotelId, HotelInfo]>>,
  'updateHotel' : ActorMethod<[HotelId, HotelInfo], [] | [HotelInfo]>,
  'whoami' : ActorMethod<[], string>,
}
export interface _SERVICE extends _anon_class_10_1 {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
