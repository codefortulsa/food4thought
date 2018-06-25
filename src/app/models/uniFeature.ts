
export interface Properties {
  Ext: string;
  DaysOpen: string;
  FullAddress: string;
  BreakfastTime: string;
  EndDate: string;
  City: string;
  Name: string;
  ZipCode: string;
  Phone: string;
  StartDate: string;
  State: string;
  Status: string;
  Address: string;
  LunchTime: string;
  MealServed: string;
  SnackTime: string;
  DinnerTime: string;
}

export interface Geometry {
    coordinates: number[];
    type: string;
}

export interface UniFeature {
    type: string;
    properties: Properties;
    geometry: Geometry;
    id: string;
}
