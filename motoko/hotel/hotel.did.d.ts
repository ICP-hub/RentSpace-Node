import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

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
export interface anon_class_16_1 {
  'addOwner' : ActorMethod<[string], string>,
  'createHotel' : ActorMethod<[HotelInfo], HotelId>,
  'deleteHotel' : ActorMethod<[HotelId], string>,
  'getHotel' : ActorMethod<[HotelId], [] | [HotelInfo]>,
  'getHotelFrequencyByYear' : ActorMethod<[string], [] | [AnnualData]>,
  'getHotelId' : ActorMethod<[], Array<HotelId>>,
  'scanHotel' : ActorMethod<[bigint, bigint], Array<[HotelId, HotelInfo]>>,
  'updateHotel' : ActorMethod<[HotelId, HotelInfo], [] | [HotelInfo]>,
  'whoami' : ActorMethod<[], string>,
}
export interface _SERVICE extends anon_class_16_1 {}
