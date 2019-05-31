#!/usr/bin/env node

// takes an input file (see test-case.json) and determines what campsites 
// can accomodate the requested reservation while satisifying the specified gap constraint

import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
import * as fs from 'fs'
import { CampsiteReservation, Campsite, ReservationSearch } from './models'
import { toCampsites, toCampsiteReservations, toReservationSearch, isCampsiteAvailable, displayDate } from './utilities';

console.clear()
console.log(
    chalk.yellow(
        figlet.textSync('gap-rule', { horizontalLayout: 'full' })
    )
)

program
    .version('0.0.1')
    .description("Implements basic gap rule logic for campground reservations")
    .option('-i --input-file <file>', 'JSON input file', './test-case.json')
    .option('-g --gap <n>', 'gap constraint - maximum number of nights not allowed between reservations', 1)
    .parse(process.argv);

const inputFile: string = program.inputFile
const gap: number = program.gap // the maximum number of nights not allowed between reservations

if (!fs.existsSync(inputFile)) {
    console.log(`input file (${inputFile}) does not exist`)
    process.exit(1)
}

// parse JSON input file
const data = JSON.parse(fs.readFileSync(program.inputFile, 'utf-8'))

const campsites: Campsite[] = toCampsites(data.campsites) // array of available campsites
const reservations: CampsiteReservation[] = toCampsiteReservations(data.reservations) // array of existing reservations for all campsites
const reservationSearch: ReservationSearch = toReservationSearch(data.search) // requested reservation

let availableSites: Campsite[] = [] // holds campsites that can accomodate requested reservation without violating gap constraint with existing reservations

campsites.forEach(site => {
    // load existing reservations for only the current campsite
    const siteReservations: CampsiteReservation[] = reservations.filter(reservation => reservation.campsiteId === site.id)

    // check if current campsite can accomodate requested reservation without violating gap constraint with existing reservations
    if (isCampsiteAvailable(siteReservations, gap, reservationSearch)) {
        availableSites.push(site)
    }
})

console.log(`\nAvoiding ${gap} night gaps, the available campsites for ${displayDate(reservationSearch.startDate)} through ${displayDate(reservationSearch.endDate)} are:`)
availableSites.forEach(site => console.log(site.name))
