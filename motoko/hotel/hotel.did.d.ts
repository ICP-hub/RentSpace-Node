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
  'createdAt' : string,
  'hotelImage' : string,
  'hotelPrice' : string,
  'hotelTitle' : string,
  'hotelLocation' : string,
}
export interface anon_class_9_1 {
  'addOwner' : ActorMethod<[string], string>,
  'checkHotelExist' : ActorMethod<[string], boolean>,
  'createHotel' : ActorMethod<[HotelInfo], HotelId>,
  'deleteHotel' : ActorMethod<[HotelId], string>,
  'getAllAdmin' : ActorMethod<[], Array<AdminId>>,
  'getHotel' : ActorMethod<[HotelId], [] | [HotelInfo]>,
  'getHotelFrequencyByYear' : ActorMethod<[string], [] | [AnnualData]>,
  'getHotelId' : ActorMethod<[], Array<HotelId>>,
  'getNoOfPages' : ActorMethod<[bigint], bigint>,
  'scanHotel' : ActorMethod<[bigint, bigint], Array<[HotelId, HotelInfo]>>,
  'updateHotel' : ActorMethod<[HotelId, HotelInfo], [] | [HotelInfo]>,
  'whoami' : ActorMethod<[], string>,
}
export interface _SERVICE extends anon_class_9_1 {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
