FROM golang:1.9

WORKDIR /go/src/github.com/imbaky/PatientFocus/backend
COPY . .

COPY ./configuration/nginx-selfsigned.crt /etc/ssl/certs/
COPY ./configuration/nginx-selfsigned.key /etc/ssl/private/

RUN go-wrapper download   # "go get -d -v ./..."
RUN go-wrapper install    # "go install -v ./..."

ENV POSTGRES_USER pf
ENV POSTGRES_PASSWORD patientfocus
ENV POSTGRES_DB patientfocus
ENV POSTGRES_HOST localhost

EXPOSE 9000

CMD ["backend"]
