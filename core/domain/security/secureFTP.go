package security

import (
	"strconv"
	"golang.org/x/crypto/ssh"
	"github.com/pkg/sftp"
	"io/ioutil"
	"os/user"
	"log"
	"fmt"
	"bytes"
)


const Host        string = "localhost"
const Port        int    = 8080
const Username    string = "root"
const Password    string = "root"


func OpenSFTP(destinationPath string, file bytes.Buffer) {

	key, err :=  getKeyFile();
	if err != nil { //check if key is available on server
		panic(err)
	}
	config := &ssh.ClientConfig{
		User: Username,
		Auth: []ssh.AuthMethod{
			ssh.PublicKeys(key),
		},
	}
	//open ssh connection
	client, err := ssh.Dial("tcp", Host+":"+strconv.Itoa(Port), config)
	if err != nil {
		log.Fatal(err)
		fmt.Printf("Could not ssh to %s +\":\" %d \n", Host,Port)
		panic(err)
	}
	sftpClient, err := sftp.NewClient(client)
	if err != nil {
		log.Fatal(err)
		fmt.Printf("Could not sftpClient to %s +\":\" %d \n", Host,Port)
		panic(err)
	}
	defer sftpClient.Close() //closes the SFTP session and the client (ssh)
	f, err := sftpClient.Create(destinationPath)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	f.Write(file.Bytes()) //write file to destinationPath
}

func getKeyFile() (key ssh.Signer, err error){ // get the RSA key
    usr, _ := user.Current()
    file := usr.HomeDir + "/.ssh/id_rsa"
    buf, err := ioutil.ReadFile(file)
    if err != nil {
        return
    }
    key, err = ssh.ParsePrivateKey(buf)
    if err != nil {
        return
     }
    return
}