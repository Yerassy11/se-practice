def can_book(start, end, now, blocked, existing):
    """Check availability using integer minutes and a Boolean blocked flag.

    start/end describe a same-day interval; now must be within 0..1440.
    Invalid scalar inputs return False. Existing bookings are not mutated.
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
    for booked_start, booked_end in existing:
        if start < booked_end and end > booked_start:
            return False
    return True
