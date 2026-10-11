# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.7 _

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** How should a connected development team use online collaboration so changes are coordinated, reviewed, and owned without making a small project unnecessarily slow?

**Users:** The scenario involves four student developers, one course supervisor, and KBTU students who would use the resulting campus equipment-booking web application

**Problem:** The development team works at different times from separate laptops, so code changes, decisions, and task ownership can easily become inconsistent.

**Constraints:** The fictional team has a four-week deadline, and it must work through one shared GitHub repository with only lightweight tools available to the students.

**Risk:** A rushed or poorly reviewed merge could break booking rules or overwrite another member's work close to the deadline.

**Assumptions:** All project details, team size, deadline, application name, and development conditions are fictional and are used only for this analysis.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

Connected development tools help most when they make responsibility and change history visible rather than merely giving several people access to the same files. For this fictional four-person project, the recommended workflow is one shared repository, short-lived feature branches, issues for planned work, and pull requests for code or configuration changes. The main trade-off is speed versus control. Direct pushes can feel faster during a four-week project, but they make it harder to see who changed a booking rule, why it changed, and whether another person checked the effect. Pull requests add review time, yet they also create a focused place to discuss a change before it reaches the shared branch.

The first engineering decision is to protect the main branch and require one peer approval plus successful automated checks for behavior-changing pull requests. GitHub documents that pull requests support discussion and review before changes become part of a project, while branch protection can require reviews and status checks before merging. This does not guarantee defect-free software. Automated checks reduce regression risk only for cases they actually exercise, and human review is still needed for requirement misunderstandings, unclear design choices, or missing tests. For the small team, one reviewer is a reasonable compromise; demanding two reviewers for every minor change could create a bottleneck when only four people are available.

The second decision is to connect each non-trivial change to an issue or short written task description and record the reason for important decisions in the pull request or repository documentation. Chat messages alone are fast but difficult to audit later. A visible issue owner reduces duplicated work, while the pull-request history gives the supervisor and teammates a traceable explanation of what changed. Documentation-only corrections can use a lighter review path if the team still records them, because the same level of control is not necessary for every edit.

This workflow also requires social discipline. Tools cannot decide whether a requirement is correct, whether a reviewer understood the change, or whether deadlines justify accepting technical debt. The team should therefore keep branches small, review promptly, and make ownership explicit. Online collaboration supports coordination, but responsibility for quality remains with the developers who propose, review, and merge the change.

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

Prompt B raised five concerns. I accepted the first: the draft could imply that pull requests themselves improve quality. Verification row 1 supports the narrower claim that GitHub pull requests provide a place to discuss and review work and can help catch problems early, so the final analysis describes review as a control rather than a guarantee. I also accepted the second concern that the speed-versus-control trade-off needed to be explicit; the final text now explains why direct pushes are faster but less traceable.

I qualified the third concern about automated checks. The critique was right that tests cannot guarantee the absence of defects, but automated checks are still useful when tied to known booking behavior. Change-log row 1 therefore replaces the stronger wording with a limited claim about reducing regression risk for exercised cases. Verification row 2 confirms that GitHub branch protection can require status checks and approvals before merge, but it does not claim those checks prove correctness.

I accepted the fourth concern about ownership and added issues or task descriptions so every non-trivial change has a visible owner and reason. I rejected the fifth suggestion that every repository change should use the same mandatory review path. In a fictional four-person team with a four-week deadline, forcing identical review for a typo and for booking-rule code would add overhead without equal benefit. Change-log row 2 therefore keeps strict review for behavior-changing code or configuration while allowing a lighter documented path for low-risk documentation changes. The remaining uncertainty is team behavior: no GitHub setting can ensure a reviewer reads carefully or understands the requirement.

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

For this small connected team, the best approach is a lightweight but enforceable GitHub workflow: short feature branches, visible issues or task descriptions, pull requests for meaningful changes, one peer approval, automated checks, and a protected main branch. This combination gives the team traceability and review without creating a process that is too heavy for a four-week student project. The main limitation is that collaboration tooling controls workflow, not engineering judgment. A pull request can be approved even when the requirement is misunderstood, and a passing automated check only covers what was actually tested. The team must still communicate, review carefully, and accept responsibility for the final system. Therefore, the tools should support professional practice rather than replace it.

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

The most useful part of the process was separating what collaboration tools can enforce from what developers still have to decide. At first, it was easy to treat pull requests, reviews, and checks as if using them automatically produced good software. The critique made that assumption visible. I changed the analysis so that automated checks are described as evidence for tested cases rather than proof that a change is correct. I also changed the review rule after considering the size and deadline of the fictional team. Requiring the same process for every tiny documentation edit would make the workflow look strict but would not necessarily improve the project. Checking the GitHub documentation was useful because it showed exactly what branch protection and pull requests can enforce, which helped separate platform capabilities from my own recommendations. The main lesson is that online collaboration is not only about sharing code. It is also about making ownership, review, decisions, and change history visible enough that another team member can understand and challenge them.

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- GitHub Docs. (2026). About pull requests. Section “Why use pull requests”. https://docs.github.com/en/pull-requests/get-started/about-pull-requests (accessed 2026-10-11).
- GitHub Docs. (2026). About protected branches. Sections “About branch protection settings”, “Require pull request reviews before merging”, and “Require status checks before merging”. https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches (accessed 2026-10-11).

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. Keep one shared repository and use small feature branches so unfinished work does not directly change the main branch
2. Track planned tasks and owners with issues or short task descriptions so team members do not duplicate work.
3. Use pull requests and peer review before merging important code changes into the shared branch
4. Run simple automated checks on proposed changes, but do not treat passing tests as proof that the software is correct.
5. Record important decisions and reasons in the repository instead of leaving project knowledge only in private chat messages

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->


### B1 — Draft (Prompt A)

- **Tool:** ChatGPT
- **Model:** GPT 5.6 Sol
- **Date:**  2026-10-11
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.7 Connected development teams for a first-year-level university assignment.

My scenario is four student developers and one course supervisor are building a fictional campus equipment-booking web application for KBTU students. The team works asynchronously from separate laptops. It has a fictional four-week deadline, must use one shared GitHub repository with lightweight tools, and risks rushed or poorly reviewed merges that could break booking rules or overwrite another member's work. My initial ideas are keep one shared repository and use small feature branches; track tasks and owners with issues or short task descriptions; use pull requests and peer review for important changes; run simple automated checks without treating them as proof of correctness; and record important decisions in the repository instead of only in private chat. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Connected development teams need more than a shared place to store code. They need a workflow that makes responsibilities, changes, and decisions visible to other team members. In this scenario, four student developers are building a fictional campus equipment-booking web application while working asynchronously from separate laptops. The four-week deadline and use of one shared GitHub repository are assumptions of the scenario, not general facts about software projects.

A practical workflow would use one repository with short-lived feature branches. Each developer would create a branch for a small task rather than changing the main branch directly. This reduces interference between unfinished changes and gives the team a clear unit of work to discuss. Tasks can be represented as issues or short written descriptions with an owner. That can reduce duplicated work and make it easier to see what is blocked or unfinished, although the team still needs to keep the task information current.

Pull requests should be used before important changes are merged. A pull request creates a review point before changes enter the shared main branch, helping the team catch problems early and preserve a visible discussion of why a change was made. For this small team, one peer review may be enough for most changes. Requiring several reviewers could improve scrutiny, but it could also slow the project when only four developers are available. I would verify the claim that pull requests support review, discussion, and a traceable change history using GitHub's official documentation.

Automated checks can be added to pull requests for important booking behavior. These checks can prevent regressions by rejecting changes that break known tests. However, automated tests do not prove that a change is correct in every situation. They only check the cases and properties that the team has encoded. This is an important trade-off: more automated checks improve repeatability but take time to create and maintain.

Branch protection can make review and automated status checks mandatory before merge, so the workflow does not depend only on memory or goodwill. I would verify this capability in GitHub's documentation. The team should also record important design decisions in pull-request descriptions or repository documentation rather than leaving them only in chat, because later team members need to understand why a change was made.

Overall, online collaboration tools support coordination by making work visible, reviewable, and traceable. They do not replace engineering responsibility. Developers still have to decide whether a requirement is correct, whether a test is sufficient, and whether a review was careful enough. The best workflow for this scenario is therefore lightweight: small branches, explicit task ownership, pull requests, one peer review, automated checks for important behavior, and written decisions.
```

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT
- **Model:** GPT 5.6 Sol
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: How should a connected development team use online collaboration so changes are coordinated, reviewed, and owned without making a small project unnecessarily slow? Scenario: Four student developers and one course supervisor are building a fictional campus equipment-booking web application for KBTU students. The team works asynchronously from separate laptops, has a fictional four-week deadline, must use one shared GitHub repository with lightweight tools, and risks rushed or poorly reviewed merges that could break booking rules or overwrite another member's work. Draft: Connected development teams need more than a shared place to store code. They need a workflow that makes responsibilities, changes, and decisions visible to other team members. In this scenario, four student developers are building a fictional campus equipment-booking web application while working asynchronously from separate laptops. The four-week deadline and use of one shared GitHub repository are assumptions of the scenario, not general facts about software projects.

A practical workflow would use one repository with short-lived feature branches. Each developer would create a branch for a small task rather than changing the main branch directly. This reduces interference between unfinished changes and gives the team a clear unit of work to discuss. Tasks can be represented as issues or short written descriptions with an owner. That can reduce duplicated work and make it easier to see what is blocked or unfinished, although the team still needs to keep the task information current.

Pull requests should be used before important changes are merged. A pull request creates a review point before changes enter the shared main branch, helping the team catch problems early and preserve a visible discussion of why a change was made. For this small team, one peer review may be enough for most changes. Requiring several reviewers could improve scrutiny, but it could also slow the project when only four developers are available. I would verify the claim that pull requests support review, discussion, and a traceable change history using GitHub's official documentation.

Automated checks can be added to pull requests for important booking behavior. These checks can prevent regressions by rejecting changes that break known tests. However, automated tests do not prove that a change is correct in every situation. They only check the cases and properties that the team has encoded. This is an important trade-off: more automated checks improve repeatability but take time to create and maintain.

Branch protection can make review and automated status checks mandatory before merge, so the workflow does not depend only on memory or goodwill. I would verify this capability in GitHub's documentation. The team should also record important design decisions in pull-request descriptions or repository documentation rather than leaving them only in chat, because later team members need to understand why a change was made.

Overall, online collaboration tools support coordination by making work visible, reviewable, and traceable. They do not replace engineering responsibility. Developers still have to decide whether a requirement is correct, whether a test is sufficient, and whether a review was careful enough. The best workflow for this scenario is therefore lightweight: small branches, explicit task ownership, pull requests, one peer review, automated checks for important behavior, and written decisions.
```

**Response:**

```text
1. The draft slightly overstates the effect of pull requests. Saying they help the team catch problems early is plausible, but the tool itself does not guarantee that anyone performs a useful review. This matters because the assignment asks for engineering reasoning rather than a list of tool features. Check GitHub's official pull-request documentation and qualify the claim so the benefit depends on actual review behavior.

2. The speed-versus-control trade-off is mentioned but not developed enough. The question asks how to avoid making a small project unnecessarily slow, so the answer should explain when review overhead is justified. Compare direct pushes with reviewed pull requests in the four-week, four-person scenario and state which changes deserve stronger control.

3. The sentence saying automated checks can prevent regressions is too strong. A passing suite can miss untested behavior, incorrect requirements, or interactions that were never encoded. Keep the idea of automated checks, but qualify the effect. You could verify platform capabilities in GitHub documentation, while the limitation should be justified as an engineering argument rather than presented as a platform guarantee.

4. Responsibility is not concrete enough. The draft says tasks can have owners, but it does not say who is responsible for accepting a merge or keeping issue information current. This matters in asynchronous work because a shared tool does not automatically create accountability. Add a simple ownership rule, such as the author responding to review comments and a peer approving behavior-changing changes.

5. An alternative interpretation is that mandatory review for every repository change could be excessive for a four-person student project. A documentation typo or formatting fix may not justify the same process as a change to booking logic. Consider a lighter path for low-risk documentation changes while preserving a record of the change. This would show that the workflow is adapted to the scenario instead of applying one rule mechanically.
```

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT
- **Model:** GPT 5.6 Sol
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: Accept concern 1 but qualify the benefit of pull requests because useful review still depends on people. Accept concern 2 and make the speed-versus-control trade-off explicit. Qualify concern 3: automated checks reduce risk for encoded cases but cannot guarantee correctness. Accept concern 4 and make ownership visible through issues and review responsibility. Reject the idea that every repository change needs the same mandatory review path; for this four-person, four-week fictional project, documentation-only corrections may use a lighter documented path. Verified evidence: GitHub Docs, About pull requests, section Why use pull requests, https://docs.github.com/en/pull-requests/get-started/about-pull-requests, accessed 2026-10-11: pull requests provide a place to discuss and review proposed work before it becomes part of a project, can help catch problems early, and keep a reviewable history. GitHub Docs, About protected branches, sections About branch protection settings, Require pull request reviews before merging, and Require status checks before merging, https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches, accessed 2026-10-11: branch protection rules can require approving reviews and successful status checks before merging. Draft: Connected development teams need more than a shared place to store code. They need a workflow that makes responsibilities, changes, and decisions visible to other team members. In this scenario, four student developers are building a fictional campus equipment-booking web application while working asynchronously from separate laptops. The four-week deadline and use of one shared GitHub repository are assumptions of the scenario, not general facts about software projects.

A practical workflow would use one repository with short-lived feature branches. Each developer would create a branch for a small task rather than changing the main branch directly. This reduces interference between unfinished changes and gives the team a clear unit of work to discuss. Tasks can be represented as issues or short written descriptions with an owner. That can reduce duplicated work and make it easier to see what is blocked or unfinished, although the team still needs to keep the task information current.

Pull requests should be used before important changes are merged. A pull request creates a review point before changes enter the shared main branch, helping the team catch problems early and preserve a visible discussion of why a change was made. For this small team, one peer review may be enough for most changes. Requiring several reviewers could improve scrutiny, but it could also slow the project when only four developers are available. I would verify the claim that pull requests support review, discussion, and a traceable change history using GitHub's official documentation.

Automated checks can be added to pull requests for important booking behavior. These checks can prevent regressions by rejecting changes that break known tests. However, automated tests do not prove that a change is correct in every situation. They only check the cases and properties that the team has encoded. This is an important trade-off: more automated checks improve repeatability but take time to create and maintain.

Branch protection can make review and automated status checks mandatory before merge, so the workflow does not depend only on memory or goodwill. I would verify this capability in GitHub's documentation. The team should also record important design decisions in pull-request descriptions or repository documentation rather than leaving them only in chat, because later team members need to understand why a change was made.

Overall, online collaboration tools support coordination by making work visible, reviewable, and traceable. They do not replace engineering responsibility. Developers still have to decide whether a requirement is correct, whether a test is sufficient, and whether a review was careful enough. The best workflow for this scenario is therefore lightweight: small branches, explicit task ownership, pull requests, one peer review, automated checks for important behavior, and written decisions.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
The scenario needs a collaboration workflow that creates enough control to protect the shared code without turning a four-week student project into a heavy process. A useful starting point is one shared repository, short-lived feature branches, and visible task ownership. Each non-trivial task should have an issue or short written description naming its owner, while the developer who opens a pull request remains responsible for responding to review comments and updating the change.

For code or configuration that can change application behavior, the team should use a pull request before merging to the main branch. GitHub's documentation supports the factual claim that pull requests provide a place to discuss and review proposed work before it becomes part of a project and can keep a reviewable history. This is a platform capability, not a guarantee of good review. A reviewer can still miss an incorrect requirement or approve a change too quickly.

The main trade-off is speed versus control. Direct pushes remove review delay, but they also remove an explicit point where another developer can question the change. In a four-person team, one peer approval is a reasonable scenario-specific compromise for behavior-changing work. Requiring several approvals for every change could create a bottleneck. Low-risk documentation-only corrections can use a lighter path if the team still records what changed and why.

Automated checks should run on important pull requests, especially for known booking rules. Their role should be stated carefully: they reduce regression risk for the cases they actually exercise, but they do not establish complete correctness. Human review is still needed for missing requirements, design problems, and tests that do not cover the relevant behavior.

The main branch should be protected so the agreed workflow is enforced rather than remembered informally. GitHub's documentation states that branch protection rules can require approving reviews and successful status checks before merging. The team should combine that mechanism with small branches and prompt reviews so that protection does not create long queues.

Finally, important decisions should remain in the repository through issues, pull-request descriptions, or short documentation notes instead of existing only in private chat. This improves traceability for teammates and the supervisor. The limitation is organizational: tools can record decisions and enforce merge conditions, but they cannot guarantee that reviewers understand the requirement or that task owners keep information current.

Changes made: I qualified the benefits of pull requests and automated checks, added an explicit speed-versus-control comparison, made ownership responsibilities clearer, limited strict review to behavior-changing changes, and tied branch-protection claims only to the supplied GitHub documentation.
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| “A pull request creates a review point before changes enter the shared main branch, helping the team catch problems early and preserve a visible discussion of why a change was made.” | GitHub Docs, “About pull requests”, section “Why use pull requests”, https://docs.github.com/en/pull-requests/get-started/about-pull-requests, accessed 2026-10-11 | The page says pull requests provide a place to discuss and review work before it becomes part of a project, can help catch bugs and problems early, and keep a clear reviewable history. | keep |
| “Branch protection can make review and automated status checks mandatory before merge, so the workflow does not depend only on memory or goodwill.” | GitHub Docs, “About protected branches”, sections “About branch protection settings”, “Require pull request reviews before merging”, and “Require status checks before merging”, https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches, accessed 2026-10-11 | The page states that branch protection rules can require pull-request reviews and required status checks, and that required checks must pass before changes can be merged into the protected branch. | keep |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| “These checks can prevent regressions by rejecting changes that break known tests.” | “Automated checks reduce regression risk only for cases they actually exercise, and human review is still needed for requirement misunderstandings, unclear design choices, or missing tests.” | Prompt B concern 3 identified an overclaim. The final wording keeps the useful control but avoids treating test success as proof of correctness. |
| “Pull requests should be used before important changes are merged.” | “Require one peer approval plus successful automated checks for behavior-changing pull requests; documentation-only corrections can use a lighter documented path.” | The fictional four-person team has only four weeks, so applying the same review overhead to every edit would conflict with the scenario's time constraint. |
