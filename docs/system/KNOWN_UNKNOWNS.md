# KNOWN_UNKNOWNS.md

Purpose:
Architectural decisions and inconsistencies that are known problems
but deliberately deferred. Prevents them from being accidentally 
"fixed" without proper planning.

Format:
[DATE] — Issue name
What we know: 
What we don't know yet:
Risk of casual fix:
When to resolve:

---

## Known Unknowns

[2026-05-06] — receipt boolean vs receiptUri inconsistency
What we know: receipt boolean and receiptUri are out of sync. 
  Seed data has receipt:true with no URI. Green dots show on 
  transactions with no actual photo.
What we don't know yet: Full impact of removing receipt boolean 
  across all display logic, tax calculations, and filters simultaneously
Risk of casual fix: Updating one reference without all others 
  creates new inconsistencies
When to resolve: Dedicated coordinated pass touching all 4 files 
  simultaneously. Not as a side effect of another task.

[2026-05-06] — Date stored as display string with no year
What we know: Dates stored as "Apr 14" with no year. Tax screen 
  shows "year summary" but includes all years. Sorting by date 
  is impossible.
What we don't know yet: Migration path for existing saved data
Risk of casual fix: Breaking all existing saved transaction dates
When to resolve: Before building year filter or date backdating. 
  Requires coordinated store migration.

[2026-05-06] — workTotal uses hardcoded clientId 5 to exclude Personal
What we know: Tax screen excludes Personal via clientId !== 5. 
  Home screen excludes via name !== 'Personal'. Two different 
  exclusion strategies for same concept.
What we don't know yet: Whether isPersonal flag on Client model 
  is the right permanent fix
Risk of casual fix: Wrong approach chosen, requires second migration
When to resolve: When expense buckets vs clients is properly designed.
