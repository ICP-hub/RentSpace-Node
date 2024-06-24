import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

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
  'hotelId' : string,
  'hotelImage' : string,
  'hotelTitle' : string,
  'hotelLocation' : string,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : RoomType } |
  { 'err' : string };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_3 = { 'ok' : AnnualData } |
  { 'err' : string };
export type Result_4 = { 'ok' : HotelInfo } |
  { 'err' : string };
export type Result_5 = { 'ok' : Array<[HotelId, HotelInfo]> } |
  { 'err' : string };
export interface RoomType { 'roomPrice' : bigint, 'roomType' : string }
export type Year = string;
export interface _anon_class_19_1 {
  'checkHotelExist' : ActorMethod<[HotelId], boolean>,
  'createHotel' : ActorMethod<[HotelInfo, RoomType], Result>,
  'deleteHotel' : ActorMethod<[HotelId], Result>,
  'getAllHotels' : ActorMethod<[bigint, bigint], Result_5>,
  'getHotel' : ActorMethod<[HotelId], Result_4>,
  'getHotelRegisterFrequencyData' : ActorMethod<[Year], Result_3>,
  'getNumberofHotels' : ActorMethod<[], Result_2>,
  'getRoom' : ActorMethod<[HotelId], Result_1>,
  'updateHotel' : ActorMethod<[HotelInfo, RoomType], Result>,
  'whoami' : ActorMethod<[], string>,
}
export interface _SERVICE extends _anon_class_19_1 {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
