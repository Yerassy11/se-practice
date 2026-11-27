# Smart Campus Room Availability

A small Python project that checks whether a room is available for a requested
time interval. Times are expressed as minutes since midnight.

## Files

- `booking.py` — the `can_book` availability checking function.
- `test_booking.py` — automated unit tests using Python's built-in `unittest`.

## Requirements

Python 3. No third-party packages are required.

## Booking rules

The requested interval must be within a single day, start after the current time,
and last no more than 120 minutes. Blocked rooms and overlapping bookings are
rejected. Bookings that only touch at their endpoints are allowed. The function
returns a boolean without changing the existing bookings.

## Run tests

Run this command from the `sis-05/project/` directory:

```powershell
py -m unittest -v
```
