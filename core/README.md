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

5. go to PatientFocus/core directory
   ```
   docker build -t backend .
   ```
   wait for it to finish


6. docker run --name backend -p 80:9000 -d backend

7. To test open browser http://localhost/health
