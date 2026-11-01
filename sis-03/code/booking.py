def can_book(start, end, now, blocked, existing):
    # AC1: within the day, ordered, and starting strictly after current time.
    if not (0 <= start < end <= 1440) or start <= now:
        return False

    # AC2: two hours are allowed, but not a minute more.
    if end - start > 120:
        return False

    # AC3: a blocked room rejects every request.
    if blocked:
        return False

    # AC4: touching an endpoint is not overlap for half-open intervals.
    for booked_start, booked_end in existing:
        if start < booked_end and end > booked_start:
            return False

    return True