import { ReservationSearch } from "../src/models";

export const testSearchObject = {
    "startDate": "2018-06-04",
    "endDate": "2018-06-06"
}

export const testSearch: ReservationSearch = {
    "startDate": new Date("2018-06-04"),
    "endDate": new Date("2018-06-06")
}