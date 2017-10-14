package test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"io"
	"os"
	"bytes"
	"github.com/imbaky/PatientFocus/core/domain/handler"
	"mime/multipart"
	"fmt"
)

const test_file_name = "test_upload_file.txt"
const test_upload_file = "res/" + test_file_name
const url = "/Document"

func TestReceiveDocument(t *testing.T) { //test if a file can be uploaded and saved in the correct directory

	var b bytes.Buffer
	w := multipart.NewWriter(&b)
	f, err := os.Open(test_upload_file)
	if err != nil {
		fmt.Printf("Cannot open %v \n", test_upload_file)
		return
	}
	defer f.Close()
	fw, err := w.CreateFormFile("file", test_file_name)
	if err != nil {
		panic(err)
	}
	if _, err = io.Copy(fw, f); err != nil {
		panic(err)
	}
	w.Close()

	// Now that you have a form, you can submit it to your handler.
	req, err := http.NewRequest("POST", url, &b)
	req.Header.Set("Content-Type", w.FormDataContentType())
	if err != nil {
		t.Fatal(err)
	}
	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(handlers.ReceiveDocument)

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	handler.ServeHTTP(rr, req)

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body is what we expect.
	expected := `{"success":true}`
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}

}