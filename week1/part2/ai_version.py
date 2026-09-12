def process_marks(marks, pass_threshold=50):
    if not marks:
        print("No marks provided.")
        return

    total = sum(marks)
    average = total / len(marks)
    highest = max(marks)
    lowest = min(marks)
    passed = sum(1 for m in marks if m >= pass_threshold)
    pass_rate = (passed / len(marks)) * 100

    print(f"{len(marks)}\t{average:.2f}\t{highest}\t{lowest}\t{pass_rate:.1f}%")


def get_marks_from_user():
    raw = input("Enter student marks separated by spaces or commas: ")
    raw = raw.replace(",", " ")
    marks = []
    for token in raw.split():
        try:
            marks.append(float(token))
        except ValueError:
            print(f"Skipping invalid entry: {token}")
    return marks


if __name__ == "__main__":
    student_marks = get_marks_from_user()