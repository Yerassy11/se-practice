import unittest
from booking import can_book


class BookingTests(unittest.TestCase):

    def test_touching_end_is_allowed(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_partial_overlap_rejected(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(630, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_blocked_room_rejected(self):
        # AC3: expected result follows the specification, not code output.
        result = can_book(660, 720, 540, True, [(600, 660)])
        self.assertIs(result, False)

    def test_exactly_120_minutes_allowed(self):
        # AC2: expected result follows the specification, not code output.
        result = can_book(720, 840, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_121_minutes_rejected(self):
        # AC2: expected result follows the specification, not code output.
        result = can_book(720, 841, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_start_equal_now_rejected(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(540, 570, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_zero_length_rejected(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(700, 700, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_reversed_times_rejected(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(720, 700, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_end_at_1440_allowed(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(1380, 1440, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_end_after_1440_rejected(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(1380, 1441, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_negative_start_rejected(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(-1, 30, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_start_at_zero_now_zero_rejected(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(0, 60, 0, False, [])
        self.assertIs(result, False)

    def test_one_minute_after_now_allowed(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(541, 571, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_start_one_now_zero_allowed(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(1, 61, 0, False, [])
        self.assertIs(result, True)

    def test_past_start_rejected(self):
        # AC1: expected result follows the specification, not code output.
        result = can_book(500, 530, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_one_minute_duration_allowed(self):
        # AC2: expected result follows the specification, not code output.
        result = can_book(720, 721, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_119_minutes_allowed(self):
        # AC2: expected result follows the specification, not code output.
        result = can_book(720, 839, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_blocked_with_empty_bookings_rejected(self):
        # AC3: expected result follows the specification, not code output.
        result = can_book(660, 720, 540, True, [])
        self.assertIs(result, False)

    def test_empty_existing_allowed(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(600, 660, 540, False, [])
        self.assertIs(result, True)

    def test_overlap_second_booking_rejected(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(720, 780, 540, False, [(600, 660), (700, 760)])
        self.assertIs(result, False)

    def test_unsorted_existing_second_overlap_rejected(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(610, 650, 540, False, [(900, 960), (600, 660)])
        self.assertIs(result, False)

    def test_touch_both_neighbours_allowed(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(660, 720, 540, False, [(600, 660), (720, 780)])
        self.assertIs(result, True)

    def test_entirely_inside_rejected(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(615, 645, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_contains_existing_rejected(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(570, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_identical_interval_rejected(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(600, 660, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_touch_existing_start_allowed(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(570, 600, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_partial_overlap_on_start_rejected(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(570, 630, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_free_gap_among_three_allowed(self):
        # AC4: expected result follows the specification, not code output.
        result = can_book(760, 800, 540, False, [(600, 660), (700, 760), (800, 860)])
        self.assertIs(result, True)

    def test_return_bool_true(self):
        # AC5: expected result follows the specification, not code output.
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_return_bool_false(self):
        # AC5: expected result follows the specification, not code output.
        result = can_book(630, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_accepted_existing_list_unchanged(self):
        # AC5: successful checks must not mutate or reorder existing.
        existing = [(900, 960), (600, 660), (700, 760)]
        snapshot = existing.copy()
        self.assertIs(can_book(780, 840, 540, False, existing), True)
        self.assertEqual(existing, snapshot)

    def test_rejected_existing_list_unchanged(self):
        # AC5: rejected checks must not mutate or reorder existing.
        existing = [(900, 960), (600, 660), (700, 760)]
        snapshot = existing.copy()
        self.assertIs(can_book(610, 650, 540, False, existing), False)
        self.assertEqual(existing, snapshot)
