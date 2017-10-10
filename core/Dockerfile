FROM golang:1.9

WORKDIR /go/src/github.com/imbaky/PatientFocus/core
COPY . .

RUN go-wrapper download   # "go get -d -v ./..."
RUN go-wrapper install    # "go install -v ./..."

ENV POSTGRES_USER pf
ENV POSTGRES_PASSWORD patientfocus

EXPOSE 9000

CMD ["core"]
