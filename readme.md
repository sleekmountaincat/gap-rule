# gap-rule

Implements basic gap rule logic for reservations. Takes an input file (see test-case.json for the format) and determines what campsites can accomodate the requested reservation while satisifying the specified gap constraint (maximum number of nights not allowed between reservations).

# Overview
A gap rule is a business rule to prevent gaps of a specified length between a requested reservation and existing reservations for a resource (campsite, hotel room, etc). This is to prevent holes in the reservation calendar  which are unlikely to be filled, as most guests will not want to stay for only one night. Some destinations may wish to exclude two or even three night gaps in the reservation calendar .

To approach this problem, I determine where a requested reservation would fit in with existing reservations. If a requested reservation comes before or after existing reservations, you only need to worry about a single gap, but if the requested reservation falls between existing reservations you need to take into account the gaps on either side of the requested reservation.

## Install dependencies, build and run:

Install dependencies using npm:

    npm install

This project is authored using Typescript and can be built (transpiled to JS ES Modules) using:

    npm run build

To automatically rebuild while developing, use:

    npm run dev

To run the program with default parameters (see below), use:

    npm start

Link the project locally:

    npm link

Run the project

	gap-rule

Usage information:

```ruby?line_numbers=false
Usage: gap-rule [options]

Implements basic gap rule logic for campground reservations

Options:
  -V, --version           output the version number
  -i --input-file <file>  JSON input file (default: "./test-case.json")
  -g --gap <n>            gap constraint - maximum number of nights not allowed between reservations (default: 1)
  -h, --help              output usage information
```



## Tests

Unit tests:

    npm run test

To automatically re-run tests (useful with `npm run dev`):

    npm run test:auto

## Assumptions

This project assumes the following:
1. .JSON input file matches the format found in **test-case.json**
2. There are no overlapping existing reservations per campsite
3. The existing reservations are sorted by **startDate** per **campsiteId**
4. The existing reservations do not overlap with the requested reservation in the **search** key
5. You can not start a reservation on the same day a reservation ends (if a reservation ends on the 9th, the site is not available until the 10th)