# Week 01 — Manual vs AI: Comparison

**Name:Khudaibergen Yerassyl**
**Group:Monday 16:00-19:00**
**Date:13.09.2026**

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used   |Python | Claude
| Time to first version that ran | 15 min +- | 3 min +- |
| Time to all 4 test cases passing | 20 min | 4 min |
| Number of attempts / prompts needed | 4 |  2|
| Lines of code you actually wrote | 41 | 0 |
| Did it handle invalid marks (case B)? | Yes| Yes|
| Did it handle an empty list (case D)? | Yes | Yes|
| Did it use the ≥ 50 pass threshold? | Yes| Yes |
| Output format matches the spec? |Yes | Yes|
| Can you explain every line of it? | Yes| Yes|

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | | | avg 67.00 · high 92 · low 23 · pass 60.0% | |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | | | avg 71.60 · high 100 · low 47 · pass 80.0% | |
| C | `10, 20, 30` | | | avg 20.00 · high 30 · low 10 · pass 0.0% | |
| D | `abc, , xyz` | | | clear message, no crash | |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->
The `if __name__ == "__main__"` construction that ensures that the code inside it executes only when the file is run directly
-
-

## 4. What the AI got wrong or silently skipped
At first AI set the pass rate by 40% 
<!-- Be concrete: input, expected, actual. -->

-
-

## 5. The defect I asked Rocket to fix

**Prompt I used:*```
Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.


```

'''
Adjust it so the pass rate is 50%.
'''

''' 
Fix the formats of answers,1 decimal for pass rate 2 decimal for avg
'''
*

**Result:** (fixed / partly fixed / broke something else)
Fixed everything
**What this tells me:*
AI may be helpful and speed up whole process but needs human control and review
*

---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?

<!-- Write your reflection below this line -->
AI genuinely sped up the parts of the work where I needed help finding mistakes and improving the program structure. It was especially useful for checking why the program did not print anything, explaining how `input().split(",")` produces strings, and showing how to handle invalid values such as text, empty input, negative numbers, or marks above 100. This saved time compared with finding every issue by trial and error.
At the same time, AI also created some extra work. Some answers looked correct at first, but they did not fully match the task requirements. For example, a simple solution could calculate average and pass rate correctly for valid numbers but fail when the input contained `"abc"` or an empty value. I still had to test the code using the required test cases and check whether the output was exactly correct.

I would be more willing to put my name on the manually written artefact, because I understand how it works and I made the main decisions myself. However, I would also accept the AI-assisted version after testing and correcting it, because by that point I understand the final code and can explain it.
This experiment showed that a human engineer must still be responsible for understanding the requirements, testing edge cases, checking correctness, and deciding whether the result is reliable. AI can generate code quickly, but it cannot replace responsibility. The engineer must review the output, detect hidden mistakes, and make sure the final program behaves exactly as expected.

