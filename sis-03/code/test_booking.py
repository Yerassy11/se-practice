
import unittest

from booking import can_book


class BookingTests(unittest.TestCase):
    NOW = 540
    EXISTING = [(600, 660)]

    def check(self, start, end, expected, *, now=540, blocked=False, existing=None):
        bookings = list(self.EXISTING if existing is None else existing)
        self.assertIs(can_book(start, end, now, blocked, bookings), expected)

    # Fixed T1--T11 cases from SIS #03.
    def test_T1_touching_right(self):
        self.check(660, 720, True)

    def test_T2_partial_overlap(self):
        self.check(630, 690, False)

    def test_T3_blocked(self):
        self.check(660, 720, False, blocked=True)

    def test_T4_exactly_120(self):
        self.check(720, 840, True)

    def test_T5_121(self):
        self.check(720, 841, False)

    def test_T6_starts_now(self):
        self.check(540, 570, False)

    def test_T7_reversed(self):
        self.check(720, 660, False)

    def test_T8_midnight(self):
        self.check(1380, 1440, True)

    def test_T9_past_midnight(self):
        self.check(1380, 1441, False)

    def test_T10_second_booking(self):
        self.check(720, 780, False, existing=[(600, 660), (700, 760)])

    def test_T11_same_check_twice(self):
        bookings = [(600, 660)]
        self.assertTrue(can_book(660, 720, 540, False, bookings))
        self.assertTrue(can_book(660, 720, 540, False, bookings))
        self.assertEqual(bookings, [(600, 660)])

    # Additional boundary and overlap relationship tests.
    def test_zero_duration(self):
        self.check(720, 720, False)

    def test_negative_start(self):
        self.check(-1, 60, False, now=0, existing=[])

    def test_end_at_zero(self):
        self.check(0, 0, False, now=0, existing=[])

    def test_end_beyond_day_1442(self):
        self.check(1400, 1442, False, existing=[])

    def test_start_past_end_of_day(self):
        self.check(1440, 1441, False, existing=[])

    def test_very_late_one_minute(self):
        self.check(1439, 1440, True, now=1438, existing=[])

    def test_start_before_now(self):
        self.check(539, 570, False, existing=[])

    def test_start_exactly_now_when_room_empty(self):
        self.check(540, 600, False, existing=[])

    def test_start_one_minute_after_now(self):
        self.check(541, 600, True, existing=[])

    def test_touching_left(self):
        self.check(570, 600, True, now=540)

    def test_one_minute_overlap_at_left(self):
        self.check(570, 601, False, now=540)

    def test_one_minute_overlap_at_right(self):
        self.check(659, 670, False)

    def test_inside_existing_booking(self):
        self.check(620, 630, False)

    def test_contains_existing_booking(self):
        self.check(570, 690, False)

    def test_equals_existing_booking(self):
        self.check(600, 660, False)

    def test_empty_existing_bookings(self):
        self.check(1000, 1100, True, existing=[])

    def test_multiple_bookings_avoid_all(self):
        self.check(720, 780, True, existing=[(600, 660), (800, 900)])

    def test_multiple_bookings_overlap_second(self):
        self.check(720, 780, False, existing=[(600, 660), (740, 800)])

    def test_blocked_even_if_no_bookings(self):
        self.check(720, 780, False, blocked=True, existing=[])

    def test_duration_120_with_no_booking(self):
        self.check(900, 1020, True, existing=[])

    def test_duration_121_with_no_booking(self):
        self.check(900, 1021, False, existing=[])

    def test_does_not_modify_booking_list_on_success(self):
        existing = [(600, 660), (800, 900)]
        snapshot = existing.copy()
        self.assertTrue(can_book(660, 780, 540, False, existing))
        self.assertEqual(existing, snapshot)

    def test_unsorted_existing_keeps_original_order(self):
        existing = [(800, 900), (600, 660), (1200, 1260)]
        snapshot = existing.copy()
        self.assertTrue(can_book(660, 780, 540, False, existing))
        self.assertEqual(existing, snapshot)

    def test_does_not_modify_booking_list_on_rejection(self):
        existing = [(600, 660), (800, 900)]
        snapshot = existing.copy()
        self.assertFalse(can_book(610, 650, 540, False, existing))
        self.assertEqual(existing, snapshot)


if __name__ == '__main__':
    unittest.main()
