def can_book(start, end, now, blocked, existing):
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for booked_start, booked_end in existing:
        if start <= booked_end and end >= booked_start:
            return False
    return True