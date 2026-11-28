def can_book(start, end, now, blocked, existing):
    """Check availability using integer minutes and a Boolean blocked flag.

    start/end describe a same-day interval; now must be within 0..1440.
    existing must be a list/tuple of two-item lists/tuples containing integer
    endpoints with 0 <= booked_start < booked_end <= 1440. Invalid inputs
    return False. Existing bookings are not mutated or reordered.
    """
    if any(type(value) is not int for value in (start, end, now)):
        return False
    if type(blocked) is not bool or not 0 <= now <= 1440:
        return False
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    if type(existing) not in (list, tuple):
        return False
    for record in existing:
        if type(record) not in (list, tuple) or len(record) != 2:
            return False
        booked_start, booked_end = record
        if type(booked_start) is not int or type(booked_end) is not int:
            return False
        if not 0 <= booked_start < booked_end <= 1440:
            return False
        if start < booked_end and end > booked_start:
            return False
    return True
