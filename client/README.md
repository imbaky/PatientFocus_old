# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Docker

1. Install docker for your distro

Note: The following examples will assume systemd

2. add your user to docker group /etc/group
   ```
   sudo vi /etc/group
   find the line and modify
   docker:x:###: to docker:x:###:<username>
   ```

3. start docker
   ```
   sudo systemctl start docker
   ```

4. docker ps <- should return with no errors

5. go to PatientFocus/client directory
   ```
   docker build .
   ```
   wait for it to finish


6. docker run --name frontend -p 80:80 -d frontend

7. open browser http://localhost
