The context for this API is the following: A marketplace app for independent workers to find rotational job opportunities,
matching the eligibility of the worker with what is requested by the facilities publishing the jobs.
 
Shift eligibility is a feature that allows you to know what shifts are eligible for a specific Worker in specific facilities.

The entities that come into play are the following, `Shift`, `Facility`, `Worker`, `Document`, `FacilityRequirement`, and `DocumentWorker`.

Story: As a worker, I want to get all available shifts that I'm eligible to work for.  

### Acceptance Criteria:

 - In order for a Worker to be eligible for a shift, the rules are:
	 - A Facility must be active.
	 - The Shift must be active and not claimed by someone else.
	 - The Worker must be active.
	 - The Worker must not have claimed a shift that collides with the shift they are eligible for.
	 - The professions between the Shift and Worker must match.
	 - The Worker must have all the documents required by the facilities.
 - Given an active facility, when I request all available shifts within a start and end date, then it will return a list of shifts from that facility in the specified date range.
 - Given an inactive facility, when I request all available shifts within a start and end date, then it will not return a list of shifts from that facility.
 - Given a shift is claimed and is within the requested start and end date, when I request all available shifts within a start and end date, it will not return the claimed shift.
 - The shifts must be grouped by date.


The `seed.ts` file inside the /seed/prisma folder provides a way to create data. It is random such that:

 - Some shifts are claimed.
 - Some workers are inactive.
 - Some facilities are inactive
 - Some workers don’t meet all the documents a facility requires.

## TODOS:

| Item                                                                 | Status |
| -------------------------------------------------------------------- | ------ |
| get worker eligible shifts implementation                            | [ x ]  |
| paging                                                               | [ x ]  |
| postman collection files                                             | [ x ]  |
| tests graceful shutdown                                              | [ x ]  |
| auto swaggeer gen & /swagger route                                   | [ x ]  |
| jmeter scripts and evidence                                          | [ x ]  |
| domain layer unit tests                                              | [ ]    |
| defensive programing for max values for paging and date range params | [ ]    |
| create nest custom datetime decent custom pipe                       | [ ]    |
| disable prisma query logging for prod env                            | [ ]    |
| streamed response instead of http paging                             | [ ]    |
| add automapper for dtos <> entities prop mappping                    | [ ]    |
| Husky pre-commit testing and linting                                 | [ ]    |
