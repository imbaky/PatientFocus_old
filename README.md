# PatientFocus

SOEN490 project

## Documentation
1. [Frontend documentation](client/Readme.md)
2. [Backend documentation](core/Readme.md)

## File Structure

1. Documents for course: `./CourseAdmin`
2. Frontend: `./client`
3. Backend: `./core`

## Development Process

### Tools used

* Zenhub Addon
* tortoisegit (optional)

### While working on a feature

* Make sure that your task moved to **'In Progress'** on the Zenhub Board.

* Atomic commits: Every change you make should have its on separate commit.

* Commit messages should be short and include the issue tag that it is related to. (eg. `#123 Did something`)


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

*Make sure that you clean up your git history before creating the PR*

* Open a pull request for your branch based on the develop branch and add everyone as a reviewer.

* Move your task to the **'In Review'** column on the Zenhub board.

* Once you get approval from 2 people, go ahead and merge (Make sure to select the option to close/delete the branch + Merge commits ).

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

## Development
Instructions to get PatientFocus up and running in your development environment.
### Setup
Modify docker-compose-dev.yml in this directory
```
volumes:
    - <your local db path>:/var/lib/postgresql/data
```
Modify client/nginx/default.conf
```
upstream backend {
  server <ip address of your server>:9000;
}
```
DO NOT use localhost or 127.0.0.1 as that is address inside the container. It will go nowhere.

### Makefile
The makefile will allow you to build the project from here.
### Usage
make - with no arguments will build frontend and backend image
make frontend  - just frontend
make backend - just backend
make dev - will start up all services defined in docker-compose-dev.yml
