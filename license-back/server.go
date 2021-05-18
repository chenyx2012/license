package main

import (
	"encoding/json"
	"fmt"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/alec-z/license-back/graph"
	"github.com/alec-z/license-back/graph/auth"
	"github.com/alec-z/license-back/graph/generated"
	"github.com/alec-z/license-back/graph/model"
	"github.com/go-chi/chi/v5"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

const defaultPort = "8080"

var db *gorm.DB

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	initDB()
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{ DB: db}}))
	router := chi.NewRouter()
	router.Use(auth.Middleware(db))
	router.Handle("/api_test", playground.Handler("GraphQL playground", "/graphql"))
	router.Handle("/graphql", srv)
	router.HandleFunc("/ci", handleCI)
	router.HandleFunc("/oauth2/github_redirect", handleOAuth2Github)
	router.HandleFunc("/oauth2/gitee_redirect", handleOAuth2Gitee)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}



func handleCI(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	var request model.CIRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	var result model.CIResult
	result.Pass = true
	result.Synchronous = false
	result.ReportFlag = "INFO"
	result.ReportSummary = request.Action + ":" + request.ActionParameter + ":" + request.Repo + ":" + request.Branch + ":" + "Report will be generate in 10-15 minutes, please check the report url since then"
	result.ReportUrl = "http://compliance.openeuler.org/xxx"
	resultBytes, err := json.Marshal(result)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Fprint(w, string(resultBytes))
}


func handleOAuth2Gitee(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	token, err := model.OAuth2ConfigObj.GiteeConfig.Exchange(
		model.OAuth2ConfigObj.Ctx,
		code,
	)
	if err != nil {
		log.Println("An error occurred while trying to exchange the authorisation code with the gitee API.")
		log.Fatalln(err)
	}

	client :=  model.OAuth2ConfigObj.GiteeConfig.Client(model.OAuth2ConfigObj.Ctx, token)
	resp, err := client.Get("https://gitee.com/api/v5/user")
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}
	var res map[string]interface{}
	d := json.NewDecoder(strings.NewReader(string(body)))
	d.UseNumber()
	d.Decode(&res)
	var authID = string(res["id"].(json.Number))
	var user model.User
	db.FirstOrCreate(&user, model.User{AuthType: "gitee", AuthID: authID})
	user.AuthRawJson = string(body)
	user.AuthLogin = res["login"].(string)
	user.AuthPrimaryEmail = res["email"].(string)
	user.AvatarUrl = res["avatar_url"].(string)
	db.Save(&user)
	jwt, err := auth.CreateToken(user.ID)
	cookie := http.Cookie{Name: "jwt", Value: jwt, Path: "/"}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, "/auth-redirect", http.StatusFound)
}

func handleOAuth2Github(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	token, err := model.OAuth2ConfigObj.GithubConfig.Exchange(
		model.OAuth2ConfigObj.Ctx,
		code,
	)
	if err != nil {
		log.Fatal("An error occurred while trying to exchange the authorisation code with the Github API." + err.Error())
		return
	}
	client :=  model.OAuth2ConfigObj.GithubConfig.Client(model.OAuth2ConfigObj.Ctx, token)
 	if err != nil {
		return
	}
	resp, err := client.Get("https://api.github.com/user")
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}
	var res map[string]interface{}
	d := json.NewDecoder(strings.NewReader(string(body)))
	d.UseNumber()
	d.Decode(&res)
	var authID = string(res["id"].(json.Number))
	var user model.User
	db.FirstOrCreate(&user, model.User{AuthType: "github", AuthID: authID})
	user.AuthRawJson = string(body)
	user.AuthLogin = res["login"].(string)
	user.AuthPrimaryEmail = res["email"].(string)
	user.AvatarUrl = res["avatar_url"].(string)
	db.Save(&user)
	jwt, err := auth.CreateToken(user.ID)
	cookie := http.Cookie{Name: "jwt", Value: jwt, Path: "/"}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, "/auth-redirect", http.StatusFound)
}


func initDB() {
	var err error
	mysqlHost := os.Getenv("MYSQL_HOST")
	mysqlPassword := os.Getenv("MYSQL_PASSWORD")

	dataSourceName := fmt.Sprintf("root:%s@tcp(%s:3306)/license?charset=utf8mb4&parseTime=True&loc=Local", mysqlPassword, mysqlHost)
	db, err = gorm.Open("mysql", dataSourceName)

	if err != nil {
		fmt.Println(err)
		panic("failed to connect database")
	}

	db.LogMode(true)

	// Create the database. This is a one-time step.
	// Comment out if running multiple times - You may see an error otherwise

	// Migration to create tables for Order and Item schema
	db.AutoMigrate(&model.License{}, &model.Dict{}, &model.LicenseFeatureTag{}, &model.FeatureTag{}, &model.User{})
	model.DB = db
}