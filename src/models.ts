export interface CampsiteReservation {
    campsiteId: number
    startDate: Date
    endDate: Date
}

export interface Campsite {
    id: number
    name: string
}

export interface ReservationSearch {
    startDate: Date
    endDate: Date
}

export enum ReservationFit {
    NO_EXISTING,
    BEFORE,
    AFTER,
    BETWEEN
}