import { CampsiteReservation } from "../src/models";

export const testReservationsObject = [
    { "campsiteId": 1, "startDate": "2018-06-01", "endDate": "2018-06-03" },
    { "campsiteId": 1, "startDate": "2018-06-08", "endDate": "2018-06-10" },
    { "campsiteId": 2, "startDate": "2018-06-01", "endDate": "2018-06-01" },
    { "campsiteId": 2, "startDate": "2018-06-02", "endDate": "2018-06-03" },
    { "campsiteId": 2, "startDate": "2018-06-07", "endDate": "2018-06-09" },
    { "campsiteId": 3, "startDate": "2018-06-01", "endDate": "2018-06-02" },
    { "campsiteId": 3, "startDate": "2018-06-08", "endDate": "2018-06-09" },
    { "campsiteId": 4, "startDate": "2018-06-07", "endDate": "2018-06-10" }
]

export const testReservations: CampsiteReservation[] = [
    { "campsiteId": 1, "startDate": new Date("2018-06-01"), "endDate": new Date("2018-06-03") },
    { "campsiteId": 1, "startDate": new Date("2018-06-08"), "endDate": new Date("2018-06-10") },
    { "campsiteId": 2, "startDate": new Date("2018-06-01"), "endDate": new Date("2018-06-01") },
    { "campsiteId": 2, "startDate": new Date("2018-06-02"), "endDate": new Date("2018-06-03") },
    { "campsiteId": 2, "startDate": new Date("2018-06-07"), "endDate": new Date("2018-06-09") },
    { "campsiteId": 3, "startDate": new Date("2018-06-01"), "endDate": new Date("2018-06-02") },
    { "campsiteId": 3, "startDate": new Date("2018-06-08"), "endDate": new Date("2018-06-09") },
    { "campsiteId": 4, "startDate": new Date("2018-06-07"), "endDate": new Date("2018-06-10") }
] 