# Assumptions:
# - int and float values are accepted as numeric marks.
# - a mark equal to pass_mark passes.
# - pass_rate is a percentage rounded to two decimal places.

def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("marks cannot be empty")

    for mark in marks:
        if not isinstance(mark, (int, float)):
            raise ValueError("all marks must be numeric")
        if mark < 0 or mark > 100:
            raise ValueError("marks must be between 0 and 100")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    passed = sum(1 for mark in marks if mark >= pass_mark)
    pass_rate = round(passed / len(marks) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


if __name__ == "__main__":
    assert analyze_marks([100]) == {
        "average": 100,
        "highest": 100,
        "lowest": 100,
        "pass_rate": 100.0,
    }
    assert analyze_marks([49.5, 50]) == {
        "average": 49.75,
        "highest": 50,
        "lowest": 49.5,
        "pass_rate": 50.0,
    }
    assert analyze_marks([40, 60, 80], 70)["pass_rate"] == 33.33

    for bad_marks in ([], [40, "60"], [-1, 50], [50, 101]):
        try:
            analyze_marks(bad_marks)
            raise AssertionError("ValueError was expected")
        except ValueError:
            pass

    print("All tests passed")
