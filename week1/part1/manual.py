grades = input("Enter grades separated by commas: ").split(",")


def clean_grades(grades):
    valid_grades = []

    for grade in grades:
        grade = grade.strip()

        try:
            grade = int(grade)

            if 0 <= grade <= 100:
                valid_grades.append(grade)

        except ValueError:
            pass

    if len(valid_grades) == 0:
        print("No valid marks")
        return

    passed = 0

    for grade in valid_grades:
        if grade >= 50:
            passed += 1

    average = sum(valid_grades) / len(valid_grades)
    highest = max(valid_grades)
    lowest = min(valid_grades)
    pass_rate = passed / len(valid_grades) * 100

    print("Number of valid grades:", len(valid_grades))
    print(f"Average grade: {average:.2f}")
    print("Maximum grade:", highest)
    print("Minimum grade:", lowest)
    print(f"Pass rate: {pass_rate:.1f}%")


clean_grades(grades)