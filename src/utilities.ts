import { Campsite, CampsiteReservation, ReservationSearch, ReservationFit } from "./models";

// parses an object, and returns an array whose members are of type Campsite
// assumes format of parsed object to match "campsites" key in 'test-case.json'
export function toCampsites(sites: any): Campsite[] {
    let campsites: Campsite[] = []
    sites.forEach((site: any) => {
        campsites.push({
            id: site.id,
            name: site.name
        })
    })
    return campsites
}

// parses an object, and returns an array whose members are of type CampsiteReservation
// assumes format of parsed object to match "reservations" key in 'test-case.json'
export function toCampsiteReservations(reservations: any): CampsiteReservation[] {
    let campsiteReservations: CampsiteReservation[] = []
    reservations.forEach((reservation: any) => {
        campsiteReservations.push({
            campsiteId: reservation.campsiteId,
            startDate: new Date(reservation.startDate),
            endDate: new Date(reservation.endDate)
        })
    })
    return campsiteReservations
}

// parses an object, and returns a ReservationSearch 
// assumes format of parsed object to match "search" key in 'test-case.json'
export function toReservationSearch(search: any): ReservationSearch {
    return {
        startDate: new Date(search.startDate),
        endDate: new Date(search.endDate)
    }
}

// checks to see if a requested reservation can be filled for a particular campsite without violating the supplied gap limit. 
//
// for example, if the gap limit was 1, a reservation would not be accepted if it would create a 1 night gap 
// between the requested reservation and existing reservations. if the gap limit was 2,
// a reservation would not be accepted if it would create a gap that is 2 or less nights 
// between the requested reservation and existing reservations.  
//
// we add one to the specified gap due to assuumption #5 (see README.md)
export function isCampsiteAvailable(siteReservations: CampsiteReservation[], gap: number, reservationSearch: ReservationSearch): boolean {
    const reservationFit: ReservationFit = getReservationFit(siteReservations, reservationSearch)

    switch (reservationFit) {
        case ReservationFit.NO_EXISTING: // no existing reservations, we dont need to accomodate the gap limit and the requested reservation is valid
            return true

        case ReservationFit.BEFORE: { // check if the gap between the end of requested reservation and start of first existing reservation satisfies gap constraint
            const diff = differenceInDays(siteReservations[0].startDate, reservationSearch.endDate)
            return (diff > 1 && diff <= gap + 1) ? false : true
        }

        case ReservationFit.AFTER: { // check if the gap between the start of requested reservation and end of last existing reservation satisfies gap constraint
            const diff = differenceInDays(reservationSearch.startDate, siteReservations[siteReservations.length - 1].endDate)
            return (diff > 1 && diff <= gap + 1) ? false : true
        }

        case ReservationFit.BETWEEN: { // check if the gap between existing reservations and the start and end of requested reservation satisfies gap constraint
            // get index of existing reservation that comes before requested reservation
            const preceedingReservation = siteReservations.reduce((lastIndex: number, reservation, index) => {
                if (reservation.endDate < reservationSearch.startDate) lastIndex = index
                return lastIndex
            }, -1)
            const diffBefore = differenceInDays(reservationSearch.startDate, siteReservations[preceedingReservation].endDate) // gap created with preceeding reservation
            const diffAfter = differenceInDays(siteReservations[preceedingReservation + 1].startDate, reservationSearch.endDate) // gap created with following reservation
            return ((diffBefore > 1 && diffBefore <= gap + 1) || (diffAfter > 1 && diffAfter <= gap + 1)) ? false : true
        }
    }
}

// returns how a requested reservation fits in with existing reservations (if there are any).
// a requested reservation can come either before, after, or between existing reservations. 
export function getReservationFit(siteReservations: CampsiteReservation[], reservationSearch: ReservationSearch): ReservationFit {
    // no existing reservations
    if (!siteReservations.length)
        return ReservationFit.NO_EXISTING

    // requested reservation ends before first existing reservation
    else if (reservationSearch.endDate < siteReservations[0].startDate)
        return ReservationFit.BEFORE

    // requested reservation starts after the last existing reservation        
    else if (reservationSearch.startDate > siteReservations[siteReservations.length - 1].endDate)
        return ReservationFit.AFTER

    // if none of the above are true, the requested reservation comes between existing reservations
    else
        return ReservationFit.BETWEEN
}

// formats a Date object
// TODO: zero pad month and day
export function displayDate(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

// calculates difference in days between two Dates
export function differenceInDays(startDate: Date, endDate: Date): number {
    const difference = Math.abs(startDate.getTime() - endDate.getTime())
    return Math.ceil(difference / (1000 * 3600 * 24))
}