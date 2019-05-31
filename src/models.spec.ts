import 'mocha'
import * as chai from 'chai'
import { CampsiteReservation, ReservationSearch, ReservationFit } from "./models";
import { toCampsites, toCampsiteReservations, toReservationSearch, isCampsiteAvailable, getReservationFit } from './utilities';
import { testCampsites, testCampsitesObject, testReservationsObject, testReservations, testSearchObject, testSearch } from '../tests/test-data'

const expect = chai.expect

describe('parsing input file', () => {
    it('should convert an array of objects into Campsite array', () => {
        const result = toCampsites(testCampsitesObject)
        expect(result).to.deep.equal(testCampsites)
    })

    it('should convert an array of objects into CampsiteReservation array', () => {
        const result = toCampsiteReservations(testReservationsObject)
        expect(result).to.deep.equal(testReservations)
    })

    it('should convert an object into ReservationSearch', () => {
        const result = toReservationSearch(testSearchObject)
        expect(result).to.deep.equal(testSearch)
    })
})

describe('determine where a reservation fits in existing reservations', () => {
    const reservationSearch: ReservationSearch = {
        "startDate": new Date("2018-03-02"),
        "endDate": new Date("2018-03-05")
    }

    const noExisting: CampsiteReservation[] = []
    const before: CampsiteReservation[] = [
        { "campsiteId": 1, "startDate": new Date("2018-04-01"), "endDate": new Date("2018-04-03") },
        { "campsiteId": 1, "startDate": new Date("2018-04-08"), "endDate": new Date("2018-04-10") },
    ]
    const after: CampsiteReservation[] = [
        { "campsiteId": 1, "startDate": new Date("2018-02-01"), "endDate": new Date("2018-02-03") },
        { "campsiteId": 1, "startDate": new Date("2018-03-01"), "endDate": new Date("2018-03-01") },
    ]
    const between: CampsiteReservation[] = [
        { "campsiteId": 1, "startDate": new Date("2018-03-01"), "endDate": new Date("2018-03-01") },
        { "campsiteId": 1, "startDate": new Date("2018-03-10"), "endDate": new Date("2018-03-11") },
    ]

    it('should determine there are no existing reservations', () => {
        const result = getReservationFit(noExisting, reservationSearch)
        expect(result).to.equal(ReservationFit.NO_EXISTING)
    })

    it('should determine requested reservation comes before existing reservations', () => {
        const result = getReservationFit(before, reservationSearch)
        expect(result).to.equal(ReservationFit.BEFORE)
    })

    it('should determine requested reservation comes after existing reservations', () => {
        const result = getReservationFit(after, reservationSearch)
        expect(result).to.equal(ReservationFit.AFTER)
    })

    it('should determine requested reservation comes between existing reservations', () => {
        const result = getReservationFit(between, reservationSearch)
        expect(result).to.equal(ReservationFit.BETWEEN)
    })
})

describe('determine if a requested reservation would violate the specified gap constraint for a campsite', () => {
    const reservationSearch: ReservationSearch = {
        "startDate": new Date("2018-03-02"),
        "endDate": new Date("2018-03-05")
    }

    const singleNightPass: CampsiteReservation[] = [
        { "campsiteId": 1, "startDate": new Date("2018-03-06"), "endDate": new Date("2018-03-07") },
    ]

    const singleNightFail: CampsiteReservation[] = [
        { "campsiteId": 1, "startDate": new Date("2018-03-07"), "endDate": new Date("2018-03-08") },
    ]

    const doubleNightPass: CampsiteReservation[] = [
        { "campsiteId": 1, "startDate": new Date("2018-02-25"), "endDate": new Date("2018-02-26") },
    ]

    const doubleNightFail: CampsiteReservation[] = [
        { "campsiteId": 1, "startDate": new Date("2018-02-25"), "endDate": new Date("2018-02-27") },
    ]

    const tripleNightPass: CampsiteReservation[] = [
        { "campsiteId": 1, "startDate": new Date("2018-02-24"), "endDate": new Date("2018-02-25") },
        { "campsiteId": 1, "startDate": new Date("2018-03-10"), "endDate": new Date("2018-03-11") },
    ]

    const tripleNightFail: CampsiteReservation[] = [
        { "campsiteId": 1, "startDate": new Date("2018-02-24"), "endDate": new Date("2018-02-25") },
        { "campsiteId": 1, "startDate": new Date("2018-03-09"), "endDate": new Date("2018-03-10") },
    ]

    it('should pass a requested reservation that does not create a one night gap for gap constraint of one', () => {
        const result = isCampsiteAvailable(singleNightPass, 1, reservationSearch)
        expect(result).to.equal(true)
    })

    it('should fail a requested reservation that does create a one night gap for gap constraint of one', () => {
        const result = isCampsiteAvailable(singleNightFail, 1, reservationSearch)
        expect(result).to.equal(false)
    })

    it('should pass a requested reservation that does not create a two night gap for gap constraint of two', () => {
        const result = isCampsiteAvailable(doubleNightPass, 2, reservationSearch)
        expect(result).to.equal(true)
    })

    it('should fail a requested reservation that does create a two night gap for gap constraint of two', () => {
        const result = isCampsiteAvailable(doubleNightFail, 2, reservationSearch)
        expect(result).to.equal(false)
    })

    it('should pass a requested reservation that does not create a three night gap for gap constraint of three', () => {
        const result = isCampsiteAvailable(tripleNightPass, 3, reservationSearch)
        expect(result).to.equal(true)
    })

    it('should fail a requested reservation that does create a three night gap for gap constraint of three', () => {
        const result = isCampsiteAvailable(tripleNightFail, 3, reservationSearch)
        expect(result).to.equal(false)
    })
})