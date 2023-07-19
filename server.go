package main

import (
    "errors"
    "fmt"
    "net/http"
    "os"
)
const PORT = ":3000"
func main() {
    fileHandler := http.FileServer(http.Dir("./public"))
    http.Handle("/", fileHandler)

    fmt.Printf("Server listening on http://localhost:%s", PORT)

    err := http.ListenAndServe(PORT, nil)
    if errors.Is(err, http.ErrServerClosed) {
        fmt.Printf("server closed\n")
    } else if err != nil {
        fmt.Printf("error starting server: %s\n", err)
        os.Exit(1)
    }
}
