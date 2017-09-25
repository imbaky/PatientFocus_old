# PatientFocus
SOEN490 project

## Development

### Tools used
* Zenhub Addon
* tortoisegit (optional)

### While working on a feature

* Make sure that your task moved to **'In Progress'** on the Zenhub Board.

* Atomic commits: Every change you make should have its on separate commit.

* Commit messages should be short but clear.


### Done implementing your Feature?

* Commit your changes.

* Update local dev branch

```
git checkout dev
git pull
```

* merge dev into your branch

```
git checkout <your branch>
git pull dev
```

### Pull Requests

* Open a pull request for your branch based on the develop branch and add everyone as a reviewer.

* Move your task to the **'In Review'** column on the Zenhub board.

* Once you get approval from 2 people, go ahead and merge (Make sure to select the option to close/delete the branch + Squash commits ).

* Move your task to **'Done'** on the Zenhub board.

#### Pull Request format

If your PR is for a Feature:

* Summary
* Technical Description
* Attachments (screenshots, diagrams, results, etc)

If your PR is for a bug:

* Observation
* Reproduction Steps
* Resolution Description
* Resolution Validation
